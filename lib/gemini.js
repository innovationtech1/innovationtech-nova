import "server-only";
import { GoogleGenAI, ThinkingLevel } from "@google/genai";

// Conexión con Google Gemini (plan gratuito).
// La clave se lee de .env.local y NUNCA llega al navegador.

// Si el modelo principal está saturado, se prueban estos (todos del plan gratuito).
const MODELOS_RESPALDO = ["gemini-3.6-flash", "gemini-3.5-flash-lite"];

// Errores temporales de Google en los que vale la pena probar otro modelo
const ERRORES_TEMPORALES = new Set([429, 500, 503, 504]);

// Tiempos de espera máximos para que el cliente nunca se quede esperando sin respuesta
const ESPERA_PRIMERA_PALABRA_MS = 15_000; // por modelo, hasta que empieza a responder
const ESPERA_RESPUESTA_COMPLETA_MS = 45_000; // una vez que empezó, para terminar

let cliente = null;

export function geminiConfigurado() {
  return Boolean(process.env.GEMINI_API_KEY);
}

function obtenerCliente() {
  if (!cliente) cliente = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  return cliente;
}

function listaDeModelos() {
  const principal = process.env.GEMINI_MODEL || "gemini-3.8-flash";
  return [principal, ...MODELOS_RESPALDO.filter((m) => m !== principal)];
}

// historial: [{ rol: "usuario" | "nova", texto: "..." }]
// Devuelve un generador que entrega la respuesta en pedacitos de texto.
export async function* responderConGemini({ instrucciones, historial }) {
  const contents = historial.map((m) => ({
    role: m.rol === "usuario" ? "user" : "model",
    parts: [{ text: m.texto }],
  }));

  const modelos = listaDeModelos();
  let ultimoError;

  for (const modelo of modelos) {
    let algoEnviado = false;
    // Tiempo límite: si el modelo no empieza a responder a tiempo, se cancela y se prueba otro
    const cancelador = new AbortController();
    let motivoCancelacion = null;
    const cancelar = (motivo) => {
      motivoCancelacion = motivo;
      cancelador.abort();
    };
    let reloj = setTimeout(() => cancelar("no empezó a responder"), ESPERA_PRIMERA_PALABRA_MS);

    try {
      const respuesta = await obtenerCliente().models.generateContentStream({
        model: modelo,
        contents,
        config: {
          systemInstruction: instrucciones,
          maxOutputTokens: 2048,
          // Pensamiento bajo: respuestas rápidas y menos consumo de la cuota gratuita
          thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
          abortSignal: cancelador.signal,
        },
      });

      for await (const pedazo of respuesta) {
        if (pedazo.text) {
          if (!algoEnviado) {
            // Ya empezó a responder: se da más tiempo para terminar
            clearTimeout(reloj);
            reloj = setTimeout(() => cancelar("tardó demasiado en terminar"), ESPERA_RESPUESTA_COMPLETA_MS);
          }
          algoEnviado = true;
          yield pedazo.text;
        }
      }
      return; // respuesta completa
    } catch (error) {
      ultimoError = error;
      const esperaAgotada = motivoCancelacion !== null;
      if (esperaAgotada) ultimoError = Object.assign(new Error(`${modelo} ${motivoCancelacion}`), { status: 504 });
      // Si ya se mostró parte de la respuesta, o el error no es temporal, no se reintenta
      if (algoEnviado || !(esperaAgotada || ERRORES_TEMPORALES.has(error?.status))) throw ultimoError;
      console.warn(
        `[NOVA] ${modelo} no disponible (${esperaAgotada ? motivoCancelacion : error.status}); probando el siguiente modelo…`
      );
    } finally {
      clearTimeout(reloj);
    }
  }

  throw ultimoError;
}

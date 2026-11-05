import "server-only";
import { GoogleGenAI, ThinkingLevel } from "@google/genai";

// Conexión con Google Gemini (plan gratuito).
// La clave se lee de .env.local y NUNCA llega al navegador.

// Si el modelo principal está saturado, se prueban estos (todos del plan gratuito).
const MODELOS_RESPALDO = ["gemini-3.6-flash", "gemini-3.5-flash-lite"];

// Errores temporales de Google en los que vale la pena probar otro modelo
const ERRORES_TEMPORALES = new Set([429, 500, 503, 504]);

// Tiempos de espera máximos para que el cliente nunca se quede esperando sin respuesta.
// Netlify corta cada respuesta del servidor a los 60 segundos: todo debe caber antes.
const ESPERA_PRIMERA_PALABRA_MS = 12_000; // por modelo, hasta que empieza a responder
const TIEMPO_TOTAL_MS = 48_000; // para toda la respuesta, contando los cambios de modelo

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

// ── Huellas (embeddings) ──
// gemini-embedding-2 no usa task_type: la tarea se indica con un prefijo en el texto.
const MODELO_HUELLAS = "gemini-embedding-2";
export const DIMENSIONES_HUELLA = 768;

// tipo: "pregunta" (lo que escribe el visitante) o "ficha" (información del negocio)
export async function crearHuella(texto, { tipo, titulo = "none" }) {
  const entrada =
    tipo === "pregunta"
      ? `task: search result | query: ${texto}`
      : `title: ${titulo} | text: ${texto}`;

  const respuesta = await obtenerCliente().models.embedContent({
    model: MODELO_HUELLAS,
    contents: entrada,
    config: {
      outputDimensionality: DIMENSIONES_HUELLA,
      abortSignal: AbortSignal.timeout(ESPERA_PRIMERA_PALABRA_MS),
    },
  });

  const valores = respuesta.embeddings?.[0]?.values;
  if (!valores?.length) throw new Error("Gemini no devolvió la huella");
  return valores;
}

// historial: [{ rol: "usuario" | "nova", texto: "..." }]
// Devuelve un generador que entrega la respuesta en pedacitos de texto.
export async function* responderConGemini({ instrucciones, historial }) {
  const contents = historial.map((m) => ({
    role: m.rol === "usuario" ? "user" : "model",
    parts: [{ text: m.texto }],
  }));

  const modelos = listaDeModelos();
  const limite = Date.now() + TIEMPO_TOTAL_MS;
  let ultimoError;

  for (const modelo of modelos) {
    const restante = limite - Date.now();
    if (restante < 5_000) break; // ya no alcanza el tiempo para otro intento
    let algoEnviado = false;
    // Tiempo límite: si el modelo no empieza a responder a tiempo, se cancela y se prueba otro
    const cancelador = new AbortController();
    let motivoCancelacion = null;
    const cancelar = (motivo) => {
      motivoCancelacion = motivo;
      cancelador.abort();
    };
    let reloj = setTimeout(
      () => cancelar("no empezó a responder"),
      Math.min(ESPERA_PRIMERA_PALABRA_MS, restante)
    );

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
            reloj = setTimeout(() => cancelar("tardó demasiado en terminar"), Math.max(limite - Date.now(), 1_000));
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

  throw ultimoError ?? Object.assign(new Error("Se acabó el tiempo de espera"), { status: 504 });
}

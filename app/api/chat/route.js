import { responder, iaDisponible } from "@/lib/ia";
import { instruccionesNova } from "@/lib/instrucciones";
import { buscarInformacion } from "@/lib/buscar";
import { revisarLimite, LIMITES } from "@/lib/limites";
import { negocio } from "@/datos/sitio";

// Ruta del servidor del chat de NOVA: POST /api/chat
// Recibe: { mensajes: [{ rol: "usuario" | "nova", texto }] }
// Devuelve: la respuesta de NOVA como texto que llega poco a poco.

const contacto = `escríbenos a ${negocio.correo} o llámanos al ${negocio.telefono}`;

const AVISOS = {
  sinConfigurar: `NOVA todavía se está configurando. Mientras tanto, ${contacto}.`,
  limiteMinuto: "Vas muy rápido 😊 Espera un minuto y vuelve a escribirme.",
  limiteDia: `Llegaste al máximo de mensajes por hoy. Para seguir, ${contacto}.`,
  cuotaAgotada: `Ahora mismo estoy recibiendo muchas consultas. Por favor, ${contacto} y te respondemos pronto.`,
  error: `Tuve un problema para responder. Intenta de nuevo en un momento o ${contacto}.`,
  invalido: "No pude leer tu mensaje. ¿Puedes escribirlo de nuevo?",
};

function respuestaTexto(texto, status = 200) {
  return new Response(texto, {
    status,
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}

function obtenerIp(request) {
  const reenviada = request.headers.get("x-forwarded-for");
  return (reenviada ? reenviada.split(",")[0] : request.headers.get("x-real-ip")) || "local";
}

function limpiarMensajes(cuerpo) {
  if (!cuerpo || !Array.isArray(cuerpo.mensajes)) return null;

  const mensajes = cuerpo.mensajes
    .filter(
      (m) =>
        m &&
        (m.rol === "usuario" || m.rol === "nova") &&
        typeof m.texto === "string" &&
        m.texto.trim()
    )
    .slice(-LIMITES.mensajesDeHistorial)
    .map((m) => ({ rol: m.rol, texto: m.texto.slice(0, LIMITES.largoMaximoMensaje * 3) }));

  // La IA espera que la conversación empiece con el usuario y termine con su pregunta
  while (mensajes.length && mensajes[0].rol !== "usuario") mensajes.shift();
  const ultimo = mensajes[mensajes.length - 1];
  if (!ultimo || ultimo.rol !== "usuario") return null;
  if (ultimo.texto.length > LIMITES.largoMaximoMensaje) {
    ultimo.texto = ultimo.texto.slice(0, LIMITES.largoMaximoMensaje);
  }
  return mensajes;
}

// Cuota agotada (429) o Google saturado / sin respuesta a tiempo (503, 504)
function esErrorDeCuota(error) {
  return [429, 503, 504].includes(error?.status) || /RESOURCE_EXHAUSTED|quota|UNAVAILABLE/i.test(error?.message || "");
}

export async function POST(request) {
  let cuerpo;
  try {
    cuerpo = await request.json();
  } catch {
    return respuestaTexto(AVISOS.invalido, 400);
  }

  const historial = limpiarMensajes(cuerpo);
  if (!historial) return respuestaTexto(AVISOS.invalido, 400);

  if (!iaDisponible()) return respuestaTexto(AVISOS.sinConfigurar, 503);

  const limite = revisarLimite(obtenerIp(request));
  if (!limite.permitido) {
    return respuestaTexto(limite.motivo === "minuto" ? AVISOS.limiteMinuto : AVISOS.limiteDia, 429);
  }

  // Para buscar se usan las 2 últimas preguntas del visitante: así se entiende
  // una pregunta corta como "¿y cuánto cuesta?" con el contexto de la anterior.
  const consulta = historial
    .filter((m) => m.rol === "usuario")
    .slice(-2)
    .map((m) => m.texto)
    .join("\n");
  const { informacion, fuente, fichasUsadas } = await buscarInformacion(consulta);
  if (process.env.NODE_ENV !== "production") {
    console.log(`[NOVA] Información de ${fuente}:`, fichasUsadas.map((f) => `${f.id} (${f.puntaje})`).join(", "));
  }

  const instrucciones = instruccionesNova(informacion);
  const generador = responder({ instrucciones, historial });
  const codificador = new TextEncoder();

  const flujo = new ReadableStream({
    async start(controlador) {
      let algoEnviado = false;
      try {
        for await (const pedazo of generador) {
          algoEnviado = true;
          controlador.enqueue(codificador.encode(pedazo));
        }
        if (!algoEnviado) controlador.enqueue(codificador.encode(AVISOS.error));
      } catch (error) {
        console.error("[NOVA] Error de la IA:", error?.status, error?.message);
        const aviso = esErrorDeCuota(error) ? AVISOS.cuotaAgotada : AVISOS.error;
        controlador.enqueue(codificador.encode(algoEnviado ? `\n\n${aviso}` : aviso));
      } finally {
        controlador.close();
      }
    },
  });

  return new Response(flujo, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}

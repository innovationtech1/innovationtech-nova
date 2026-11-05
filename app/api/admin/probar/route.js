import { verificarAdmin, respuestaJson } from "@/lib/adminAuth";
import { buscarInformacion } from "@/lib/buscar";
import { instruccionesNova } from "@/lib/instrucciones";
import { responder } from "@/lib/ia";

// POST /api/admin/probar  { pregunta }
// Hace una pregunta a NOVA y devuelve la respuesta completa, qué fichas usó
// y qué IA respondió. Solo para el administrador (no cuenta en el límite de visitantes).

export async function POST(request) {
  const { error } = await verificarAdmin(request);
  if (error) return error;

  const cuerpo = await request.json().catch(() => null);
  const pregunta = typeof cuerpo?.pregunta === "string" ? cuerpo.pregunta.trim().slice(0, 1000) : "";
  if (!pregunta) return respuestaJson({ error: "Escribe una pregunta." }, 400);

  try {
    const { informacion, fichasUsadas, fuente } = await buscarInformacion(pregunta);
    let respuesta = "";
    for await (const pedazo of responder({
      instrucciones: instruccionesNova(informacion),
      historial: [{ rol: "usuario", texto: pregunta }],
    })) {
      respuesta += pedazo;
    }
    return respuestaJson({ respuesta, fichasUsadas, fuente, ia: "Gemini" });
  } catch (e) {
    console.error("[admin] Error al probar NOVA:", e?.status, e?.message);
    return respuestaJson({ error: "La IA no respondió (puede estar saturada). Intenta en un minuto." }, 502);
  }
}

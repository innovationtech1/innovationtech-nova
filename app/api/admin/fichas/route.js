import { verificarAdmin, respuestaJson } from "@/lib/adminAuth";
import { listarFichas, crearFicha, validarFicha } from "@/lib/adminFichas";

// GET  /api/admin/fichas  → lista todas las fichas (sin las huellas)
// POST /api/admin/fichas  → crea una ficha nueva y calcula su huella

export async function GET(request) {
  const { error } = await verificarAdmin(request);
  if (error) return error;
  try {
    return respuestaJson({ fichas: await listarFichas() });
  } catch (e) {
    console.error("[admin] Error al listar fichas:", e?.message);
    return respuestaJson({ error: "No se pudieron leer las fichas." }, 500);
  }
}

export async function POST(request) {
  const { error } = await verificarAdmin(request);
  if (error) return error;

  const cuerpo = await request.json().catch(() => null);
  const { datos, error: invalido } = validarFicha(cuerpo);
  if (invalido) return respuestaJson({ error: invalido }, 400);

  try {
    return respuestaJson({ ficha: await crearFicha(datos) }, 201);
  } catch (e) {
    console.error("[admin] Error al crear ficha:", e?.status, e?.message);
    return respuestaJson({ error: "No se pudo guardar. Si Gemini está saturado, intenta en un minuto." }, 502);
  }
}

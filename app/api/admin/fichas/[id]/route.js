import { verificarAdmin, respuestaJson } from "@/lib/adminAuth";
import { editarFicha, borrarFicha, validarFicha, idValido } from "@/lib/adminFichas";

// PATCH  /api/admin/fichas/:id → edita (o oculta/muestra) una ficha
// DELETE /api/admin/fichas/:id → borra una ficha

export async function PATCH(request, { params }) {
  const { error } = await verificarAdmin(request);
  if (error) return error;

  const { id } = await params;
  if (!idValido(id)) return respuestaJson({ error: "Ficha no válida." }, 400);

  const cuerpo = await request.json().catch(() => null);
  const { datos, error: invalido } = validarFicha(cuerpo, { parcial: true });
  if (invalido) return respuestaJson({ error: invalido }, 400);
  if (!Object.keys(datos).length) return respuestaJson({ error: "No hay cambios." }, 400);

  try {
    const ficha = await editarFicha(id, datos);
    if (!ficha) return respuestaJson({ error: "Esa ficha ya no existe." }, 404);
    return respuestaJson({ ficha });
  } catch (e) {
    console.error("[admin] Error al editar ficha:", e?.status, e?.message);
    return respuestaJson({ error: "No se pudo guardar. Si Gemini está saturado, intenta en un minuto." }, 502);
  }
}

export async function DELETE(request, { params }) {
  const { error } = await verificarAdmin(request);
  if (error) return error;

  const { id } = await params;
  if (!idValido(id)) return respuestaJson({ error: "Ficha no válida." }, 400);

  try {
    const borrada = await borrarFicha(id);
    if (!borrada) return respuestaJson({ error: "Esa ficha ya no existe." }, 404);
    return respuestaJson({ ok: true });
  } catch (e) {
    console.error("[admin] Error al borrar ficha:", e?.message);
    return respuestaJson({ error: "No se pudo borrar la ficha." }, 500);
  }
}

import "server-only";
import { firestoreConfigurado } from "./firebaseAdmin";
import { verificarTokenFirebase } from "./verificarToken";

// Revisa que quien llama a /api/admin/* sea el administrador:
// 1. Trae un token válido de Firebase Auth (se verifica en el servidor).
// 2. Su correo está en la lista ADMIN_EMAILS de .env.local / Netlify.
// Devuelve { email } si todo está bien, o una Response de error para devolver tal cual.

function correosPermitidos() {
  return (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((c) => c.trim().toLowerCase())
    .filter(Boolean);
}

export function respuestaJson(datos, status = 200) {
  return Response.json(datos, { status, headers: { "Cache-Control": "no-store" } });
}

export async function verificarAdmin(request) {
  if (!firestoreConfigurado() || !correosPermitidos().length) {
    return { error: respuestaJson({ error: "El panel no está configurado en el servidor." }, 503) };
  }

  const encabezado = request.headers.get("authorization") || "";
  const token = encabezado.startsWith("Bearer ") ? encabezado.slice(7) : "";
  if (!token) return { error: respuestaJson({ error: "Inicia sesión para continuar." }, 401) };

  let datos;
  try {
    datos = await verificarTokenFirebase(token);
  } catch (error) {
    console.warn("[NOVA] Sesión de admin rechazada:", error?.message);
    return { error: respuestaJson({ error: "Tu sesión expiró. Vuelve a iniciar sesión." }, 401) };
  }

  const email = (datos.email || "").toLowerCase();
  if (!email || !correosPermitidos().includes(email)) {
    return { error: respuestaJson({ error: "Este correo no tiene permiso para usar el panel." }, 403) };
  }
  return { email };
}

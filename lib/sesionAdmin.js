// Sesión del administrador en el NAVEGADOR (no contiene secretos).
// Usa la API REST oficial de Firebase Authentication, sin instalar el SDK web:
//   https://firebase.google.com/docs/reference/rest/auth
// La clave NEXT_PUBLIC_FIREBASE_API_KEY es pública por diseño: solo identifica
// el proyecto. La seguridad real la pone el servidor (verifica el token y el correo).

const CLAVE_WEB = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
const GUARDADO = "nova-admin-sesion";

export const panelConfigurado = Boolean(CLAVE_WEB);

const MENSAJES = {
  INVALID_LOGIN_CREDENTIALS: "Correo o contraseña incorrectos.",
  EMAIL_NOT_FOUND: "Correo o contraseña incorrectos.",
  INVALID_PASSWORD: "Correo o contraseña incorrectos.",
  INVALID_EMAIL: "Escribe un correo válido.",
  USER_DISABLED: "Este usuario está desactivado.",
  TOO_MANY_ATTEMPTS_TRY_LATER: "Demasiados intentos. Espera unos minutos y vuelve a intentar.",
};

function leer() {
  try {
    return JSON.parse(sessionStorage.getItem(GUARDADO)) || null;
  } catch {
    return null;
  }
}

function guardar(sesion) {
  sessionStorage.setItem(GUARDADO, JSON.stringify(sesion));
}

export function sesionActual() {
  return typeof window === "undefined" ? null : leer();
}

export function cerrarSesion() {
  sessionStorage.removeItem(GUARDADO);
}

export async function iniciarSesion(email, password) {
  const r = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${CLAVE_WEB}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, returnSecureToken: true }),
    }
  );
  const datos = await r.json().catch(() => ({}));
  if (!r.ok) {
    const codigo = (datos?.error?.message || "").split(" ")[0];
    throw new Error(MENSAJES[codigo] || "No se pudo iniciar sesión. Intenta de nuevo.");
  }
  const sesion = {
    email: datos.email,
    idToken: datos.idToken,
    refreshToken: datos.refreshToken,
    expira: Date.now() + Number(datos.expiresIn) * 1000,
  };
  guardar(sesion);
  return sesion;
}

// «¿Olvidaste tu contraseña?»: Firebase manda el correo para cambiarla (gratis en el plan Spark).
// Siempre responde lo mismo, exista o no el correo, para no revelar quién tiene cuenta.
export const AVISO_RESTABLECER =
  "Si ese correo tiene cuenta, te enviamos un enlace para cambiar la contraseña. Revisa también Spam.";

export async function enviarRestablecer(email, clave = CLAVE_WEB) {
  const r = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${clave}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ requestType: "PASSWORD_RESET", email }),
  });
  if (r.ok) return AVISO_RESTABLECER;
  const datos = await r.json().catch(() => ({}));
  const codigo = (datos?.error?.message || "").split(" ")[0];
  if (codigo === "EMAIL_NOT_FOUND") return AVISO_RESTABLECER;
  if (codigo === "INVALID_EMAIL" || codigo === "MISSING_EMAIL") throw new Error("Escribe un correo válido.");
  if (codigo === "TOO_MANY_ATTEMPTS_TRY_LATER" || codigo === "RESET_PASSWORD_EXCEED_LIMIT") {
    throw new Error(MENSAJES.TOO_MANY_ATTEMPTS_TRY_LATER);
  }
  throw new Error("No se pudo enviar el correo. Intenta de nuevo.");
}

// Devuelve un token vigente; si está por vencer, lo renueva
async function tokenVigente() {
  const sesion = leer();
  if (!sesion) throw new Error("SIN_SESION");
  if (Date.now() < sesion.expira - 60_000) return sesion.idToken;

  const r = await fetch(`https://securetoken.googleapis.com/v1/token?key=${CLAVE_WEB}`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "refresh_token", refresh_token: sesion.refreshToken }),
  });
  const datos = await r.json().catch(() => ({}));
  if (!r.ok) {
    cerrarSesion();
    throw new Error("SIN_SESION");
  }
  guardar({
    ...sesion,
    idToken: datos.id_token,
    refreshToken: datos.refresh_token,
    expira: Date.now() + Number(datos.expires_in) * 1000,
  });
  return datos.id_token;
}

// fetch a /api/admin/* con la sesión. Lanza Error("SIN_SESION") si hay que volver a entrar.
export async function pedirAdmin(url, { method = "GET", cuerpo } = {}) {
  const token = await tokenVigente();
  const r = await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(cuerpo ? { "Content-Type": "application/json" } : {}),
    },
    body: cuerpo ? JSON.stringify(cuerpo) : undefined,
  });
  const datos = await r.json().catch(() => ({}));
  if (r.status === 401) {
    cerrarSesion();
    throw new Error("SIN_SESION");
  }
  if (!r.ok) throw new Error(datos.error || "Algo salió mal. Intenta de nuevo.");
  return datos;
}

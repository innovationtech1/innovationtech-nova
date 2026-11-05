import "server-only";
import { createPublicKey, createVerify } from "node:crypto";

// Verifica el token de sesión (ID token) de Firebase Auth sin usar firebase-admin/auth,
// porque esa pieza no carga en Netlify (error ERR_REQUIRE_ESM con la librería "jose").
// Se siguen los pasos de la documentación oficial de Firebase:
// https://firebase.google.com/docs/auth/admin/verify-id-tokens#verify_id_tokens_using_a_third-party_jwt_library
//
// 1. La firma (RS256) se comprueba con las llaves públicas de Google.
// 2. Se revisan las fechas, el proyecto (aud) y quién lo emitió (iss).
// 3. Se pregunta a Firebase si la cuenta sigue activa (no deshabilitada ni con la sesión revocada).

const URL_LLAVES =
  "https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com";

let llaves = null; // { kid: certificado }
let llavesVencen = 0;

async function obtenerLlaves() {
  if (llaves && Date.now() < llavesVencen) return llaves;
  const r = await fetch(URL_LLAVES, { signal: AbortSignal.timeout(8_000) });
  if (!r.ok) throw new Error(`No se pudieron leer las llaves de Google (${r.status})`);
  llaves = await r.json();
  // Google indica cuánto tiempo se pueden guardar (Cache-Control: max-age)
  const maxAge = Number(/max-age=(\d+)/.exec(r.headers.get("cache-control") || "")?.[1] || 3600);
  llavesVencen = Date.now() + maxAge * 1000;
  return llaves;
}

function decodificar(parte) {
  return JSON.parse(Buffer.from(parte, "base64url").toString("utf8"));
}

// Devuelve los datos del token ({ email, uid, ... }) o lanza un error si no es válido
export async function verificarTokenFirebase(token) {
  const proyecto = process.env.FIREBASE_PROJECT_ID;
  const partes = String(token).split(".");
  if (partes.length !== 3) throw new Error("Token con formato inválido");

  const encabezado = decodificar(partes[0]);
  const datos = decodificar(partes[1]);
  if (encabezado.alg !== "RS256") throw new Error("Algoritmo no permitido");

  const certificado = (await obtenerLlaves())[encabezado.kid];
  if (!certificado) throw new Error("Llave desconocida");

  const verificador = createVerify("RSA-SHA256");
  verificador.update(`${partes[0]}.${partes[1]}`);
  if (!verificador.verify(createPublicKey(certificado), Buffer.from(partes[2], "base64url"))) {
    throw new Error("Firma inválida");
  }

  const ahora = Math.floor(Date.now() / 1000);
  const margen = 60; // segundos de tolerancia por diferencias de reloj
  if (!(datos.exp > ahora - margen)) throw new Error("Token vencido");
  if (!(datos.iat <= ahora + margen)) throw new Error("Token con fecha futura");
  if (!(datos.auth_time <= ahora + margen)) throw new Error("Inicio de sesión con fecha futura");
  if (datos.aud !== proyecto) throw new Error("Token de otro proyecto");
  if (datos.iss !== `https://securetoken.google.com/${proyecto}`) throw new Error("Emisor inválido");
  if (!datos.sub) throw new Error("Token sin usuario");

  await revisarCuentaActiva(token, datos);
  return { ...datos, uid: datos.sub };
}

// Equivale a verifyIdToken(token, true): Firebase confirma que la cuenta no está
// deshabilitada y que la sesión no fue cerrada a la fuerza (revocada).
async function revisarCuentaActiva(token, datos) {
  const clave = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  if (!clave) throw new Error("Falta NEXT_PUBLIC_FIREBASE_API_KEY");
  const r = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${clave}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken: token }),
    signal: AbortSignal.timeout(8_000),
  });
  if (!r.ok) throw new Error(`Firebase rechazó la sesión (${r.status})`);
  const usuario = (await r.json()).users?.[0];
  if (!usuario || usuario.localId !== datos.sub) throw new Error("Usuario no encontrado");
  if (usuario.disabled) throw new Error("Cuenta deshabilitada");
  if (usuario.validSince && datos.auth_time < Number(usuario.validSince)) {
    throw new Error("Sesión revocada");
  }
}

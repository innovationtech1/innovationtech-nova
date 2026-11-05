import "server-only";
import { createHash } from "node:crypto";
import { obtenerDb, firestoreConfigurado } from "./firebaseAdmin";

// Límite de mensajes por visitante, para no agotar la cuota gratuita de Gemini.
// Se guarda en Firestore (colección "limites") porque en Netlify la memoria del
// servidor se borra seguido. Si Firestore falla, se usa la memoria como respaldo.
//
// Privacidad: no se guarda la IP. Se guarda una "huella" irreversible de la IP
// mezclada con la fecha, así no se puede seguir a un visitante de un día a otro.

export const LIMITES = {
  porMinuto: 6,
  porDia: 40,
  largoMaximoMensaje: 800, // caracteres
  mensajesDeHistorial: 12, // cuántos mensajes anteriores se envían a la IA
};

function claveDelDia(ip, dia) {
  const huella = createHash("sha256").update(`${dia}|${ip}|nova`).digest("hex").slice(0, 32);
  return `${dia}_${huella}`;
}

// Regla común: recibe el registro actual y devuelve { permitido, motivo, nuevo }
function aplicarRegla(actual, ahora) {
  const r = {
    total: actual?.total ?? 0,
    minutoInicio: actual?.minutoInicio ?? ahora,
    minutoCuenta: actual?.minutoCuenta ?? 0,
  };
  if (ahora - r.minutoInicio >= 60_000) {
    r.minutoInicio = ahora;
    r.minutoCuenta = 0;
  }
  if (r.total >= LIMITES.porDia) return { permitido: false, motivo: "dia" };
  if (r.minutoCuenta >= LIMITES.porMinuto) return { permitido: false, motivo: "minuto" };
  r.total += 1;
  r.minutoCuenta += 1;
  return { permitido: true, nuevo: r };
}

// ── Respaldo en memoria ──
const memoria = new Map();
function revisarEnMemoria(clave, ahora) {
  const resultado = aplicarRegla(memoria.get(clave), ahora);
  if (resultado.nuevo) memoria.set(clave, resultado.nuevo);
  if (memoria.size > 5000) memoria.clear();
  return resultado;
}

export async function revisarLimite(ip) {
  const ahora = Date.now();
  const dia = new Date().toISOString().slice(0, 10);
  const clave = claveDelDia(ip, dia);

  if (!firestoreConfigurado()) return revisarEnMemoria(clave, ahora);

  try {
    const db = obtenerDb();
    const ref = db.collection("limites").doc(clave);
    return await db.runTransaction(async (t) => {
      const doc = await t.get(ref);
      const resultado = aplicarRegla(doc.exists ? doc.data() : null, ahora);
      if (resultado.nuevo) t.set(ref, { ...resultado.nuevo, dia });
      return resultado;
    });
  } catch (error) {
    console.warn("[NOVA] Límite en Firestore no disponible; uso memoria:", error?.message);
    return revisarEnMemoria(clave, ahora);
  }
}

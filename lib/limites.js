import "server-only";

// Límite de mensajes por visitante, para no agotar la cuota gratuita de Gemini.
// FASE 2: se guarda en memoria (se reinicia al reiniciar el servidor).
// En la Fase 3 se guardará en Firestore para que sea permanente.

export const LIMITES = {
  porMinuto: 6,
  porDia: 40,
  largoMaximoMensaje: 800, // caracteres
  mensajesDeHistorial: 12, // cuántos mensajes anteriores se envían a la IA
};

const registro = new Map(); // ip → { dia, totalDia, recientes: [timestamps] }

export function revisarLimite(ip) {
  const ahora = Date.now();
  const hoy = new Date().toISOString().slice(0, 10);
  let r = registro.get(ip);

  if (!r || r.dia !== hoy) {
    r = { dia: hoy, totalDia: 0, recientes: [] };
    registro.set(ip, r);
  }

  r.recientes = r.recientes.filter((t) => ahora - t < 60_000);

  if (r.totalDia >= LIMITES.porDia) return { permitido: false, motivo: "dia" };
  if (r.recientes.length >= LIMITES.porMinuto) return { permitido: false, motivo: "minuto" };

  r.totalDia += 1;
  r.recientes.push(ahora);

  // Limpieza simple para que la memoria no crezca sin fin
  if (registro.size > 5000) {
    for (const [clave, valor] of registro) if (valor.dia !== hoy) registro.delete(clave);
  }

  return { permitido: true };
}

import "server-only";
import { obtenerDb, firestoreConfigurado } from "./firebaseAdmin";
import { crearHuella } from "./gemini";
import { textoDelNegocio } from "./conocimiento";

// FASE 3: búsqueda de fichas (RAG) con el "Plan B":
// se leen las fichas activas de Firestore y la similitud se calcula aquí,
// sin índice vectorial. Con unas decenas de fichas es igual de rápido y cuesta $0.

const FICHAS_POR_PREGUNTA = 6;
const MEMORIA_MS = 5 * 60 * 1000; // las fichas se guardan en memoria 5 minutos (menos lecturas)

let memoria = { fichas: null, hasta: 0 };

async function fichasActivas() {
  if (memoria.fichas && Date.now() < memoria.hasta) return memoria.fichas;

  const resultado = await obtenerDb().collection("conocimiento").where("activo", "==", true).get();
  const fichas = resultado.docs
    .map((doc) => {
      const d = doc.data();
      const huella = d.embedding?.toArray?.() ?? d.embedding;
      return { id: doc.id, titulo: d.titulo, categoria: d.categoria, contenido: d.contenido, huella };
    })
    .filter((f) => Array.isArray(f.huella) && f.huella.length);

  memoria = { fichas, hasta: Date.now() + MEMORIA_MS };
  return fichas;
}

function similitud(a, b) {
  let punto = 0;
  let normaA = 0;
  let normaB = 0;
  for (let i = 0; i < a.length; i++) {
    punto += a[i] * b[i];
    normaA += a[i] * a[i];
    normaB += b[i] * b[i];
  }
  return punto / (Math.sqrt(normaA) * Math.sqrt(normaB) || 1);
}

function formatear(fichas) {
  return fichas.map((f) => `### ${f.titulo}\n${f.contenido}`).join("\n\n");
}

// Devuelve { informacion, fichasUsadas, fuente } para armar las instrucciones de NOVA.
// Si Firestore no está configurado o falla, usa la información completa de
// datos/sitio.js (como en la Fase 2), así NOVA nunca se queda sin datos.
export async function buscarInformacion(pregunta) {
  if (!firestoreConfigurado()) {
    return { informacion: textoDelNegocio(), fichasUsadas: [], fuente: "datos/sitio.js" };
  }

  try {
    const [fichas, huellaPregunta] = await Promise.all([
      fichasActivas(),
      crearHuella(pregunta, { tipo: "pregunta" }),
    ]);
    if (!fichas.length) throw new Error("No hay fichas activas en Firestore");

    const ordenadas = fichas
      .map((f) => ({ ...f, puntaje: similitud(huellaPregunta, f.huella) }))
      .sort((a, b) => b.puntaje - a.puntaje);

    const elegidas = ordenadas.slice(0, FICHAS_POR_PREGUNTA);
    // Los datos de contacto siempre van, para que NOVA pueda ofrecerlos
    const contacto = ordenadas.find((f) => f.id === "contacto");
    if (contacto && !elegidas.includes(contacto)) elegidas.push(contacto);

    return {
      informacion: formatear(elegidas),
      fichasUsadas: elegidas.map((f) => ({ id: f.id, titulo: f.titulo, puntaje: Number(f.puntaje.toFixed(3)) })),
      fuente: "firestore",
    };
  } catch (error) {
    console.warn("[NOVA] Búsqueda en Firestore no disponible; uso datos/sitio.js:", error?.message);
    return { informacion: textoDelNegocio(), fichasUsadas: [], fuente: "datos/sitio.js" };
  }
}

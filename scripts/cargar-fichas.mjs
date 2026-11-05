// Carga (o actualiza) las fichas del negocio en Firestore con su huella.
// Uso:  npm run cargar-fichas
//
// - Lee la información de datos/sitio.js y la divide en fichas (lib/fichas.js).
// - Calcula la huella de cada ficha con Gemini Embedding (gratis).
// - Guarda cada ficha en la colección "conocimiento" de Firestore.
// - Si una ficha ya existía, respeta si estaba activa u oculta.
// - Borra las fichas creadas por este script que ya no existen en datos/sitio.js.
//   (Las fichas creadas a mano en el panel, Fase 4, no se tocan.)

import { FieldValue } from "firebase-admin/firestore";
import { crearFichas } from "../lib/fichas.js";
import { crearHuella, geminiConfigurado } from "../lib/gemini.js";
import { firestoreConfigurado, obtenerDb } from "../lib/firebaseAdmin.js";

const ORIGEN = "datos/sitio.js";
const esperar = (ms) => new Promise((r) => setTimeout(r, ms));

async function huellaConReintentos(ficha) {
  for (let intento = 1; ; intento++) {
    try {
      return await crearHuella(ficha.contenido, { tipo: "ficha", titulo: ficha.titulo });
    } catch (error) {
      if (intento >= 4) throw error;
      const espera = 3000 * intento;
      console.log(`   Gemini ocupado (${error?.status ?? error?.message}); reintento en ${espera / 1000} s…`);
      await esperar(espera);
    }
  }
}

async function principal() {
  if (!geminiConfigurado()) throw new Error("Falta GEMINI_API_KEY en .env.local");
  if (!firestoreConfigurado()) throw new Error("Faltan las variables FIREBASE_* en .env.local");

  const db = obtenerDb();
  const coleccion = db.collection("conocimiento");
  const fichas = crearFichas();
  console.log(`Cargando ${fichas.length} fichas en Firestore…\n`);

  for (const [i, ficha] of fichas.entries()) {
    const huella = await huellaConReintentos(ficha);
    const ref = coleccion.doc(ficha.id);
    const anterior = await ref.get();

    await ref.set({
      titulo: ficha.titulo,
      categoria: ficha.categoria,
      contenido: ficha.contenido,
      enlace: ficha.enlace,
      activo: anterior.exists ? anterior.get("activo") !== false : true,
      origen: ORIGEN,
      actualizado: FieldValue.serverTimestamp(),
      embedding: FieldValue.vector(huella),
    });

    console.log(`✓ ${String(i + 1).padStart(2)}/${fichas.length}  ${ficha.titulo}`);
    await esperar(700); // pausa corta para no pasar el límite por minuto del plan gratis
  }

  // Limpieza: fichas de este script que ya no existen
  const vigentes = new Set(fichas.map((f) => f.id));
  const viejas = await coleccion.where("origen", "==", ORIGEN).get();
  for (const doc of viejas.docs) {
    if (!vigentes.has(doc.id)) {
      await doc.ref.delete();
      console.log(`🗑  Borrada (ya no está en datos/sitio.js): ${doc.id}`);
    }
  }

  console.log("\n¡Listo! NOVA ya puede buscar en estas fichas.");
}

principal().catch((error) => {
  console.error("\n✗ No se pudieron cargar las fichas:", error?.message || error);
  process.exit(1);
});

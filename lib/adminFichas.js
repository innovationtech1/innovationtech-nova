import "server-only";
import { FieldValue } from "firebase-admin/firestore";
import { obtenerDb } from "./firebaseAdmin";
import { crearHuella } from "./gemini";
import { limpiarMemoriaFichas } from "./buscar";

// Operaciones del panel sobre la colección "conocimiento".
// Las fichas creadas o editadas aquí quedan marcadas con origen "panel":
// así el script `npm run cargar-fichas` ya no las sobrescribe.

export const CATEGORIAS = ["servicio", "plan", "faq", "portafolio", "contacto", "general"];
const LIMITES = { titulo: 150, contenido: 4000, enlace: 500 };

const coleccion = () => obtenerDb().collection("conocimiento");

function aFichaPublica(doc) {
  const d = doc.data();
  return {
    id: doc.id,
    titulo: d.titulo || "",
    categoria: d.categoria || "general",
    contenido: d.contenido || "",
    enlace: d.enlace || "",
    activo: d.activo !== false,
    origen: d.origen || "",
    actualizado: d.actualizado?.toDate?.().toISOString() ?? null,
  };
}

// Revisa y limpia lo que manda el navegador. Devuelve { datos } o { error }.
export function validarFicha(entrada, { parcial = false } = {}) {
  if (!entrada || typeof entrada !== "object") return { error: "Datos inválidos." };
  const datos = {};

  for (const campo of ["titulo", "contenido", "enlace"]) {
    if (entrada[campo] === undefined) continue;
    if (typeof entrada[campo] !== "string") return { error: `El campo ${campo} no es válido.` };
    const valor = entrada[campo].trim();
    if (valor.length > LIMITES[campo]) return { error: `El campo ${campo} es demasiado largo.` };
    datos[campo] = valor;
  }
  if (entrada.categoria !== undefined) {
    if (!CATEGORIAS.includes(entrada.categoria)) return { error: "Categoría no válida." };
    datos.categoria = entrada.categoria;
  }
  if (entrada.activo !== undefined) {
    if (typeof entrada.activo !== "boolean") return { error: "El estado no es válido." };
    datos.activo = entrada.activo;
  }
  if (datos.enlace && !/^https?:\/\//i.test(datos.enlace)) {
    return { error: "El enlace debe empezar con http:// o https://" };
  }

  if (!parcial) {
    if (!datos.titulo) return { error: "Escribe un título." };
    if (!datos.contenido) return { error: "Escribe el contenido de la ficha." };
    datos.categoria ??= "general";
    datos.enlace ??= "";
    datos.activo ??= true;
  } else {
    if (datos.titulo === "") return { error: "El título no puede quedar vacío." };
    if (datos.contenido === "") return { error: "El contenido no puede quedar vacío." };
  }
  return { datos };
}

export async function listarFichas() {
  const resultado = await coleccion().select("titulo", "categoria", "contenido", "enlace", "activo", "origen", "actualizado").get();
  return resultado.docs
    .map(aFichaPublica)
    .sort((a, b) => a.categoria.localeCompare(b.categoria) || a.titulo.localeCompare(b.titulo, "es"));
}

export async function crearFicha(datos) {
  const huella = await crearHuella(datos.contenido, { tipo: "ficha", titulo: datos.titulo });
  const ref = coleccion().doc();
  await ref.set({
    ...datos,
    origen: "panel",
    actualizado: FieldValue.serverTimestamp(),
    embedding: FieldValue.vector(huella),
  });
  limpiarMemoriaFichas();
  return aFichaPublica(await ref.get());
}

// Devuelve la ficha actualizada, o null si no existe
export async function editarFicha(id, cambios) {
  const ref = coleccion().doc(id);
  const actual = await ref.get();
  if (!actual.exists) return null;

  const actualizacion = { ...cambios, origen: "panel", actualizado: FieldValue.serverTimestamp() };
  const titulo = cambios.titulo ?? actual.get("titulo");
  const contenido = cambios.contenido ?? actual.get("contenido");
  // Solo se recalcula la huella si cambió el texto (ocultar/mostrar no gasta cuota)
  if (titulo !== actual.get("titulo") || contenido !== actual.get("contenido")) {
    actualizacion.embedding = FieldValue.vector(await crearHuella(contenido, { tipo: "ficha", titulo }));
  }

  await ref.update(actualizacion);
  limpiarMemoriaFichas();
  return aFichaPublica(await ref.get());
}

// Devuelve true si se borró, false si no existía
export async function borrarFicha(id) {
  const ref = coleccion().doc(id);
  if (!(await ref.get()).exists) return false;
  await ref.delete();
  limpiarMemoriaFichas();
  return true;
}

// IDs de Firestore: letras, números, guiones y guiones bajos
export function idValido(id) {
  return typeof id === "string" && /^[A-Za-z0-9_-]{1,100}$/.test(id);
}

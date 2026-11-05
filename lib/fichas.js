// Convierte la información de datos/sitio.js en "fichas": bloques cortos de un
// solo tema que se guardan en Firestore (colección "conocimiento").
// Lo usa scripts/cargar-fichas.mjs. No contiene secretos.
// (Importación relativa, sin "@/", para que también funcione fuera de Next.js.)
import {
  negocio,
  servicios,
  planes,
  condiciones,
  preguntasFrecuentes,
  portafolio,
} from "../datos/sitio.js";

const lista = (elementos) => elementos.map((e) => `- ${e}`).join("\n");

export function crearFichas() {
  const fichas = [];
  const agregar = (id, categoria, titulo, contenido, enlace = "") =>
    fichas.push({ id, categoria, titulo, contenido: contenido.trim(), enlace });

  // General y contacto
  agregar(
    "general-agencia",
    "general",
    `Quiénes somos: ${negocio.nombre}`,
    `${negocio.descripcion}
Eslogan: ${negocio.eslogan}
Ubicación: ${negocio.ciudad}. ${negocio.modalidad}.
A quién atendemos: ${negocio.cobertura}.
Idiomas: ${negocio.idiomas}.
Trabajando desde: ${negocio.inicio}.
Servicios: ${servicios.map((s) => s.titulo).join(", ")}.
Planes mensuales: ${planes.map((p) => `${p.nombre} (${p.precio}${p.periodo})`).join(", ")}.`
  );

  const redes = Object.entries(negocio.redes || {}).filter(([, link]) => link);
  agregar(
    "contacto",
    "contacto",
    "Contacto y horario",
    `Correo: ${negocio.correo}
Teléfono y WhatsApp: ${negocio.telefono}
Horario de atención: ${negocio.horario}
Atendemos en línea; no tenemos oficina física.${
      redes.length ? `\nRedes sociales: ${redes.map(([r, l]) => `${r}: ${l}`).join(", ")}` : ""
    }`
  );

  // Servicios
  for (const s of servicios) {
    agregar(
      `servicio-${s.id}`,
      "servicio",
      `Servicio: ${s.titulo}`,
      `${s.descripcion}
Incluye:
${lista(s.incluye || [])}
Tiempo de entrega: ${s.tiempo}
Precio: ${s.precio}`
    );
  }

  // Planes
  for (const p of planes) {
    agregar(
      `plan-${p.id}`,
      "plan",
      `Plan ${p.nombre}: ${p.precio}${p.periodo}`,
      `Precio: ${p.precio} ${p.periodo === "/mes" ? "al mes" : p.periodo}
Ideal para: ${p.ideal}
Incluye:
${lista(p.incluye)}
El presupuesto de anuncios que se paga a Meta (Facebook e Instagram) no está incluido.`
    );
  }

  // Condiciones comerciales
  agregar(
    "condiciones-contrato",
    "general",
    "Contrato, cancelación y anticipos",
    `Planes mensuales: ${condiciones.contrato}
Proyectos de una sola vez: ${condiciones.proyectos}`
  );
  agregar(
    "condiciones-pagos",
    "general",
    "Formas de pago, descuentos y promociones",
    `Formas de pago:
${lista(condiciones.formasDePago)}
Descuentos y promociones:
${lista(condiciones.descuentos)}`
  );

  // Preguntas frecuentes
  preguntasFrecuentes.forEach((f, i) => {
    agregar(`faq-${String(i + 1).padStart(2, "0")}`, "faq", f.p, f.r);
  });

  // Portafolio
  for (const t of portafolio) {
    agregar(
      `portafolio-${t.id}`,
      "portafolio",
      `Portafolio: ${t.titulo}`,
      `Tipo de proyecto: ${t.servicio}
${t.descripcion}${t.enlace ? `\nSe puede ver aquí: ${t.enlace}` : ""}`,
      t.enlace || ""
    );
  }

  return fichas;
}

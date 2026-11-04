import "server-only";
import {
  negocio,
  servicios,
  planes,
  portafolio,
  condiciones,
  preguntasFrecuentes,
} from "@/datos/sitio";

// FASE 2: NOVA conoce el negocio a partir de los mismos datos de la página
// (datos/sitio.js). En la Fase 3 esto se reemplaza por búsqueda en Firestore.

export function textoDelNegocio() {
  const lineas = [];

  lineas.push(`# ${negocio.nombre}`);
  lineas.push(negocio.descripcion);
  lineas.push(`Ubicación: ${negocio.ciudad}`);
  lineas.push(`Modalidad: ${negocio.modalidad}`);
  lineas.push(`A quién atendemos: ${negocio.cobertura}`);
  lineas.push(`Idiomas: ${negocio.idiomas}`);
  lineas.push(`Trabajando desde: ${negocio.inicio}`);
  const redes = Object.entries(negocio.redes || {}).filter(([, link]) => link);
  if (redes.length) lineas.push(`Redes sociales: ${redes.map(([red, link]) => `${red}: ${link}`).join(", ")}`);
  lineas.push(`Correo: ${negocio.correo}`);
  lineas.push(`Teléfono: ${negocio.telefono}`);
  if (negocio.whatsapp) lineas.push(`WhatsApp: ${negocio.whatsapp}`);
  lineas.push(`Horario: ${negocio.horario}`);

  lineas.push("\n## Servicios");
  for (const s of servicios) {
    lineas.push(`### ${s.titulo}`);
    lineas.push(s.descripcion);
    if (s.incluye?.length) lineas.push(`Incluye: ${s.incluye.join("; ")}`);
    if (s.tiempo) lineas.push(`Tiempo de entrega: ${s.tiempo}`);
    if (s.precio) lineas.push(`Precio: ${s.precio}`);
  }

  lineas.push("\n## Planes");
  for (const p of planes) {
    const precio =
      !p.precio || p.precio.toLowerCase().includes("confirmar")
        ? "precio no publicado (se cotiza con el equipo)"
        : `${p.precio}${p.periodo ? " " + p.periodo : ""}`;
    lineas.push(`### Plan ${p.nombre}: ${precio}`);
    lineas.push(`Ideal para: ${p.ideal}`);
    lineas.push(`Incluye: ${p.incluye.join("; ")}`);
  }
  lineas.push(
    "Nota: el presupuesto de anuncios que se paga a Meta (Facebook e Instagram) no está incluido en ningún plan ni servicio."
  );

  lineas.push("\n## Contratos, pagos y descuentos");
  lineas.push(`Planes mensuales: ${condiciones.contrato}`);
  lineas.push(`Proyectos de una sola vez: ${condiciones.proyectos}`);
  lineas.push(`Formas de pago: ${condiciones.formasDePago.join("; ")}`);
  lineas.push(`Descuentos y promociones: ${condiciones.descuentos.join("; ")}`);

  lineas.push("\n## Portafolio");
  for (const t of portafolio) {
    lineas.push(`- ${t.titulo} (${t.servicio}): ${t.descripcion}${t.enlace ? ` Puedes verlo aquí: ${t.enlace}` : ""}`);
  }

  lineas.push("\n## Preguntas frecuentes");
  for (const f of preguntasFrecuentes) lineas.push(`P: ${f.p}\nR: ${f.r}`);

  return lineas.join("\n");
}

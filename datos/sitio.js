// ─────────────────────────────────────────────────────────────
// TEXTOS DE LA PÁGINA DE INICIO
// Aquí está todo el contenido visible del sitio.
// Lo marcado con "EJEMPLO" o "POR CONFIRMAR" se reemplaza con la
// información de INFORMACION_NEGOCIO.md.
// ─────────────────────────────────────────────────────────────

export const negocio = {
  nombre: "InnovationTECH",
  eslogan: "Impulsamos tu marca en el mundo digital", // EJEMPLO
  descripcion:
    "Agencia de servicios digitales en San Antonio, TX. Marketing, contenido, video, identidad de marca y desarrollo web para negocios que quieren crecer.", // EJEMPLO
  ciudad: "San Antonio, TX",
  correo: "contacto@innovationtech.com", // POR CONFIRMAR
  telefono: "(210) 000-0000", // POR CONFIRMAR
  whatsapp: "", // POR CONFIRMAR: número con lada, ej. "12100000000"
  horario: "Lunes a viernes, 9:00 am a 6:00 pm", // POR CONFIRMAR
};

export const servicios = [
  {
    id: "marketing",
    icono: "marketing",
    titulo: "Marketing digital",
    descripcion:
      "Estrategia, campañas en redes sociales y anuncios pagados para atraer clientes reales.", // EJEMPLO
  },
  {
    id: "contenido",
    icono: "contenido",
    titulo: "Creación de contenido",
    descripcion:
      "Publicaciones, fotografía y textos que hablan el idioma de tu público.", // EJEMPLO
  },
  {
    id: "video",
    icono: "video",
    titulo: "Edición de video",
    descripcion:
      "Reels, videos promocionales y contenido corto con edición profesional.", // EJEMPLO
  },
  {
    id: "identidad",
    icono: "identidad",
    titulo: "Logos e identidad",
    descripcion:
      "Logotipo, paleta de colores y manual de marca para que te reconozcan al instante.", // EJEMPLO
  },
  {
    id: "web",
    icono: "web",
    titulo: "Desarrollo web",
    descripcion:
      "Sitios rápidos, modernos y adaptados a celular que convierten visitas en clientes.", // EJEMPLO
  },
];

export const planes = [
  {
    id: "basico",
    nombre: "Básico",
    precio: "Por confirmar", // POR CONFIRMAR
    periodo: "",
    ideal: "Para negocios que van empezando", // EJEMPLO
    incluye: [
      // EJEMPLO
      "Manejo de 2 redes sociales",
      "8 publicaciones al mes",
      "Reporte mensual",
    ],
    destacado: false,
  },
  {
    id: "profesional",
    nombre: "Profesional",
    precio: "Por confirmar", // POR CONFIRMAR
    periodo: "",
    ideal: "Para negocios en crecimiento", // EJEMPLO
    incluye: [
      // EJEMPLO
      "Manejo de 3 redes sociales",
      "12 publicaciones al mes",
      "2 videos editados al mes",
      "Campaña de anuncios básica",
    ],
    destacado: true,
  },
  {
    id: "premium",
    nombre: "Premium",
    precio: "Por confirmar", // POR CONFIRMAR
    periodo: "",
    ideal: "Para marcas que quieren dominar su mercado", // EJEMPLO
    incluye: [
      // EJEMPLO
      "Redes sociales ilimitadas",
      "20 publicaciones al mes",
      "4 videos editados al mes",
      "Campañas de anuncios avanzadas",
      "Asesoría estratégica mensual",
    ],
    destacado: false,
  },
];

export const portafolio = [
  // EJEMPLO: reemplazar con trabajos reales (imagen en /public/portafolio)
  { id: "p1", titulo: "Proyecto de ejemplo 1", servicio: "Identidad de marca", descripcion: "Logo y manual de marca para un negocio local." },
  { id: "p2", titulo: "Proyecto de ejemplo 2", servicio: "Desarrollo web", descripcion: "Sitio web moderno adaptado a celular." },
  { id: "p3", titulo: "Proyecto de ejemplo 3", servicio: "Edición de video", descripcion: "Serie de reels promocionales." },
];

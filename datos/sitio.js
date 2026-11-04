// ─────────────────────────────────────────────────────────────
// TEXTOS DE LA PÁGINA DE INICIO
// Aquí está todo el contenido visible del sitio.
// Lo marcado con "EJEMPLO" o "POR CONFIRMAR" se reemplaza con la
// información de INFORMACION_NEGOCIO.md.
// ─────────────────────────────────────────────────────────────

export const negocio = {
  nombre: "InnovationTECH",
  eslogan: "Impulsamos tu marca en el mundo digital",
  descripcion:
    "Somos una agencia de servicios digitales en San Antonio, TX. Ayudamos a negocios locales y emprendedores a crecer con marketing, contenido, video, identidad de marca y sitios web.",
  ciudad: "San Antonio, TX",
  modalidad: "Atendemos solo en línea (no tenemos oficina física)",
  cobertura: "Clientes en San Antonio y en cualquier lugar, en línea",
  idiomas: "Español e inglés",
  inicio: "2026",
  correo: "hectordehoyos@innovationtech1.com",
  telefono: "(210) 990-0532",
  whatsapp: "12109900532", // mismo número que el teléfono
  horario: "Lunes a viernes, 10:00 am a 5:00 pm",
  // PENDIENTE: pegar aquí los links completos de las redes
  redes: {
    facebook: "",
    instagram: "",
    youtube: "",
  },
};

export const servicios = [
  {
    id: "marketing",
    icono: "marketing",
    titulo: "Marketing digital",
    descripcion:
      "Estrategia, campañas en redes sociales y anuncios pagados para atraer clientes reales.",
    incluye: [
      "Estrategia mensual y análisis de tu competencia",
      "Configuración y manejo de anuncios en Facebook e Instagram (Meta Ads)",
      "Segmentación del público en San Antonio o donde estén tus clientes",
      "Reporte mensual de resultados",
    ],
    tiempo: "Arranque en 1 a 2 semanas; servicio mensual",
    precio: "Desde $600 al mes (el presupuesto de anuncios que se paga a Meta va aparte)",
  },
  {
    id: "contenido",
    icono: "contenido",
    titulo: "Creación de contenido",
    descripcion:
      "Publicaciones, diseños y textos que hablan el idioma de tu público.",
    incluye: [
      "12 publicaciones al mes (diseño gráfico y texto)",
      "Calendario de contenido mensual",
      "Textos en español, inglés o ambos",
      "Hashtags y programación de las publicaciones",
    ],
    tiempo: "Primera entrega en 7 días hábiles; servicio mensual",
    precio: "Desde $450 al mes",
  },
  {
    id: "video",
    icono: "video",
    titulo: "Edición de video",
    descripcion:
      "Reels, videos promocionales y contenido corto con edición profesional.",
    incluye: [
      "Videos cortos de hasta 60 segundos (Reels, TikTok, YouTube Shorts)",
      "Subtítulos, música libre de derechos y transiciones",
      "Logo y colores de tu marca",
      "2 rondas de cambios por video",
    ],
    tiempo: "3 a 5 días hábiles por video",
    precio: "$90 por video, o paquete de 4 videos por $320",
  },
  {
    id: "identidad",
    icono: "identidad",
    titulo: "Logos e identidad",
    descripcion:
      "Logotipo, paleta de colores y manual de marca para que te reconozcan al instante.",
    incluye: [
      "Logo: 3 propuestas iniciales y 2 rondas de cambios",
      "Archivos finales en PNG, JPG, SVG y PDF",
      "Identidad completa: además, paleta de colores, tipografías, variaciones del logo y manual de marca",
    ],
    tiempo: "Logo en 7 a 10 días hábiles; identidad completa en 2 a 3 semanas",
    precio: "Logo $350; identidad de marca completa $900",
  },
  {
    id: "web",
    icono: "web",
    titulo: "Desarrollo web",
    descripcion:
      "Sitios rápidos, modernos y adaptados a celular que convierten visitas en clientes.",
    incluye: [
      "Sitio de hasta 5 páginas, adaptado a celular",
      "Formulario de contacto y botón de WhatsApp",
      "Configuración básica para aparecer en Google (SEO básico)",
      "1 mes de soporte después de la entrega",
    ],
    tiempo: "2 a 4 semanas",
    precio: "Desde $1,500 (el dominio y el hospedaje se pagan aparte)",
  },
];

export const planes = [
  {
    id: "basico",
    nombre: "Básico",
    precio: "$350",
    periodo: "/mes",
    ideal: "Para negocios que van empezando",
    incluye: [
      "Manejo de 2 redes sociales",
      "8 publicaciones al mes (diseño y texto)",
      "Calendario de contenido",
      "Reporte mensual",
    ],
    destacado: false,
  },
  {
    id: "profesional",
    nombre: "Profesional",
    precio: "$850",
    periodo: "/mes",
    ideal: "Para negocios en crecimiento",
    incluye: [
      "Manejo de 3 redes sociales",
      "12 publicaciones al mes",
      "2 videos cortos editados al mes",
      "1 campaña de anuncios al mes en Facebook e Instagram",
      "Reporte mensual",
    ],
    destacado: true,
  },
  {
    id: "premium",
    nombre: "Premium",
    precio: "$1,500",
    periodo: "/mes",
    ideal: "Para marcas que quieren dominar su mercado",
    incluye: [
      "Manejo de hasta 5 redes sociales",
      "20 publicaciones al mes",
      "4 videos cortos editados al mes",
      "Campañas de anuncios continuas con pruebas y ajustes",
      "Llamada de estrategia mensual",
      "Reporte mensual detallado",
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

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

// Condiciones comerciales (propuestas el 4 nov 2026; revisar y ajustar)
export const condiciones = {
  contrato:
    "Planes mensuales sin contrato a largo plazo: se paga mes a mes por adelantado y se puede cancelar avisando con 15 días antes del siguiente cobro. Se puede cambiar de plan en cualquier momento a partir del siguiente mes.",
  proyectos:
    "Proyectos de una sola vez (logo, identidad de marca, sitio web): 50% de anticipo para empezar y 50% al entregar. Videos sueltos o paquetes de video: pago completo por adelantado.",
  formasDePago: [
    "Zelle",
    "Transferencia bancaria",
    "Tarjeta de crédito o débito mediante un link de pago seguro",
  ],
  descuentos: [
    "10% de descuento al pagar 3 meses de un plan por adelantado",
    "Primera consulta de 30 minutos sin costo, con un diagnóstico de tu presencia digital",
  ],
};

// Preguntas frecuentes (propuestas el 4 nov 2026; revisar y ajustar)
export const preguntasFrecuentes = [
  {
    p: "¿Cómo empiezo a trabajar con InnovationTECH?",
    r: "Agenda tu primera consulta de 30 minutos sin costo por correo, teléfono o WhatsApp. Revisamos tu negocio, te damos un diagnóstico de tu presencia digital y te enviamos una propuesta. Al aceptarla y hacer el primer pago, empezamos.",
  },
  {
    p: "¿Qué necesito para empezar?",
    r: "Información básica de tu negocio, tu logo y fotos si ya los tienes, y acceso a tus redes sociales. Si te falta algo, te ayudamos a prepararlo.",
  },
  {
    p: "¿Atienden fuera de San Antonio?",
    r: "Sí. Trabajamos 100% en línea, así que atendemos a negocios en San Antonio y en cualquier otro lugar.",
  },
  {
    p: "¿En qué idiomas trabajan?",
    r: "En español e inglés. También podemos crear tu contenido en los dos idiomas.",
  },
  {
    p: "¿Necesito tener redes sociales para contratar?",
    r: "No. Si todavía no tienes, te ayudamos a crear y configurar tus cuentas al empezar.",
  },
  {
    p: "¿El precio de los planes incluye el dinero de los anuncios?",
    r: "No. El presupuesto de anuncios se paga directamente a Meta (Facebook e Instagram) y lo decides tú. Nuestro precio cubre la estrategia, la creación y el manejo de las campañas.",
  },
  {
    p: "¿Puedo cambiar de plan o cancelar?",
    r: "Sí. Puedes cambiar de plan a partir del siguiente mes. Para cancelar, avísanos 15 días antes del siguiente cobro. No hay contrato a largo plazo.",
  },
  {
    p: "¿Cuántas revisiones incluyen?",
    r: "Los logos incluyen 3 propuestas y 2 rondas de cambios. Cada video incluye 2 rondas de cambios. Los cambios adicionales se cotizan aparte.",
  },
  {
    p: "¿Garantizan cierto número de seguidores o ventas?",
    r: "No prometemos cifras exactas, porque los resultados dependen de muchos factores. Sí te garantizamos trabajo profesional, una estrategia clara y un reporte mensual para que veas el avance.",
  },
  {
    p: "¿De quién son los diseños, el logo y los archivos?",
    r: "Son tuyos. Al terminar de pagar el proyecto te entregamos los archivos finales y todos los derechos de uso.",
  },
  {
    p: "¿Hacen reembolsos?",
    r: "El anticipo de un proyecto no se reembolsa una vez que empezamos a trabajar. Los meses de un plan ya pagados tampoco se reembolsan, pero el servicio continúa hasta terminar ese mes.",
  },
  {
    p: "¿Quién paga el dominio y el hospedaje de mi sitio web?",
    r: "Se pagan aparte y quedan a tu nombre. Te ayudamos a elegir opciones económicas y a configurarlas.",
  },
];

// Personalidad de NOVA (propuesta el 4 nov 2026)
export const personalidadNova = {
  trato: "Habla de \"tú\", con un tono cercano, profesional y positivo.",
  alContratar:
    "Cuando alguien quiera contratar o pida una cotización, invítalo a agendar la primera consulta de 30 minutos sin costo por WhatsApp, teléfono o correo.",
  nuncaPrometer: [
    "Resultados garantizados (número de seguidores, ventas o clientes)",
    "Descuentos, promociones o precios que no estén en la información del negocio",
    "Fechas exactas de entrega: solo los rangos de tiempo publicados",
    "Servicios que la agencia no ofrece",
  ],
};

export const portafolio = [
  // Trabajos reales. Imágenes en /public/portafolio (JPG ligero, ~960 px de ancho)
  {
    id: "studio",
    titulo: "InnovationTECH Studio",
    servicio: "Desarrollo web · App con IA",
    descripcion:
      "Aplicación web propia que crea textos, imágenes y videos de marketing con inteligencia artificial: publicaciones, calendario de contenido de 30 días y guiones para reels. Funciona desde el celular y se instala como app.",
    imagen: "/portafolio/innovationtech-studio.jpg",
    enlace: "https://innovationtech-studio.vercel.app/",
  },
  {
    id: "tortas-tortuga",
    titulo: "Tortas Tortuga",
    servicio: "App web (PWA) · Pedidos en línea",
    descripcion:
      "App de pedidos para un negocio de tortas en San Antonio: menú con fotos y precios, personalización de cada torta, pedidos para recoger en la unidad móvil o a domicilio con ubicación GPS, y panel de cajero. Bilingüe y se instala en el celular como app.",
    imagen: "/portafolio/tortas-tortuga.jpg",
    enlace: "https://innovationtech1.github.io/tortastortugav8/ordenar.html",
  },
  {
    id: "onroute",
    titulo: "OnRoute",
    servicio: "App moderna · Plataforma de comida",
    descripcion:
      "Plataforma que conecta clientes, food trucks y restaurantes, y repartidores: los clientes piden directo sin comisiones de apps de delivery, los negocios reciben pedidos y manejan su menú y promociones, y los repartidores ganan entregando en sus propios horarios.",
    imagen: "/portafolio/onroute.jpg",
    enlace: "https://getonroute.app/",
  },
];

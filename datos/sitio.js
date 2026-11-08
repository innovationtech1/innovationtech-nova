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

// InnovationTECH Studio: la app propia de la agencia (documentación para NOVA, 7 nov 2026).
// Solo lo que ya existe o ya está decidido. Los planes de pago están en preparación.
export const studio = {
  nombre: "InnovationTECH Studio",
  enlace: "https://innovationtech-studio.netlify.app/",
  queEs:
    "App web de InnovationTECH para crear el contenido de marketing de un negocio con inteligencia artificial: textos para redes sociales, imágenes, reels y videos con música, todo desde el celular o la computadora. No hace falta saber diseño ni edición.",
  paraQuien:
    "Pequeños negocios y emprendedores que quieren publicar contenido profesional por su cuenta, rápido y sin contratar a un diseñador para cada publicación.",
  comoSeUsa:
    "Se abre desde el navegador y se puede instalar en el celular como una app (Android: Instalar app; iPhone: Compartir → Agregar a pantalla de inicio). Funciona en español y en inglés. En «Mi marca» se guardan el nombre, el giro, el público, el tono y los colores del negocio, y Studio los usa en todo lo que crea.",
  herramientas: [
    "Textos: publicaciones, anuncios, descripciones y guiones para Instagram, Facebook y TikTok",
    "Asistente de marketing en forma de chat, al que se le pueden pedir cambios («más corto», «más formal», «dame 3 variantes») y hablar con el micrófono",
    "Imágenes creadas con IA, editor de imágenes y quitar fondo",
    "Plantillas, carrusel para Instagram y la misma imagen en todos los tamaños de redes sociales",
    "Calendario de contenido de 30 días",
    "Creador de reels con tus fotos, voz en off con IA y subtítulos automáticos",
    "Editor de video con música, textos, stickers y efectos de sonido",
    "Galería con todo lo creado",
  ],
  musica:
    "Música gratis y libre de derechos para videos y reels: la app compone canciones nuevas con grabaciones reales de instrumentos (piano, guitarras, bajo, violines, trompetas, acordeón, batería y percusión latina) en más de 20 estilos, entre ellos Comercial, Elegante, Cumbia, Norteño, Épico y Corporativo; se ajusta sola a la duración del video y cada versión es distinta. También tiene una biblioteca de 24 canciones completas de dominio público (FreePD) y 17 efectos de sonido (whoosh, impacto, ding, caja registradora, entre otros). Todo se puede usar en anuncios, Instagram, TikTok, Facebook y YouTube sin pagar ni dar crédito.",
  planes: {
    estado:
      "Los planes de pago de Studio están en preparación y todavía no se pueden contratar en línea. Quien quiera apartar su lugar o conocer la app puede escribirnos.",
    basico: {
      nombre: "Básico",
      precio: "$19 al mes",
      incluye: [
        "Textos, asistente de IA, Mi marca, plantillas y galería",
        "Imágenes con IA, editor de imágenes y quitar fondo",
        "Calendario de 30 días, carrusel y todos los tamaños",
        "Música compuesta, biblioteca de canciones y efectos de sonido",
        "1 persona por negocio",
        "Hasta 60 mensajes y textos y 20 imágenes al día",
      ],
    },
    pro: {
      nombre: "Pro",
      precio: "$39 al mes",
      incluye: [
        "Todo lo del plan Básico",
        "Creador de reels y editor de video",
        "Voz en off con IA y subtítulos automáticos",
        "Hasta 3 personas del mismo negocio",
        "Hasta 200 mensajes y textos, 60 imágenes y 30 voces al día",
      ],
    },
    detalles: [
      "Al registrarse se puede usar el plan Pro durante 10 minutos para conocer la app; después hay que contratar un plan para seguir.",
      "Se podrá pagar con tarjeta (cobro automático cada mes) o en efectivo, por Zelle o por Cash App, en cuyo caso InnovationTECH activa la cuenta al confirmar el pago.",
      "Si se cancela o el pago no pasa, la cuenta queda en pausa de inmediato; no se borra nada (marca, galería y contenido) y se reactiva al pagar.",
      "Quien conecte su propia cuenta de IA puede usar Studio sin los límites diarios, pero igual necesita un plan.",
      "Los precios y lo que incluye cada plan pueden cambiar antes del lanzamiento.",
    ],
  },
  preguntas: [
    {
      p: "¿Necesito saber diseño o edición de video para usar Studio?",
      r: "No. Studio está pensado para dueños de negocio: escribes lo que quieres (o lo dices con el micrófono) y la app te propone el texto, la imagen o el video. Luego puedes ajustarlo con un toque.",
    },
    {
      p: "¿Studio funciona en el celular?",
      r: "Sí. Funciona en el navegador del celular y de la computadora, y se puede instalar en el celular como una app, sin tienda de aplicaciones.",
    },
    {
      p: "¿La música de Studio tiene derechos de autor?",
      r: "No. La música que compone la app es nueva y libre de derechos, y las canciones de la biblioteca son de dominio público. Puedes usarlas en anuncios, Instagram, TikTok, Facebook y YouTube sin pagar ni dar crédito.",
    },
    {
      p: "¿Cuál es la diferencia entre Studio y contratar un plan de la agencia?",
      r: "Con Studio tú mismo creas tu contenido con ayuda de la IA, por una mensualidad baja. Con un plan de la agencia (Básico, Profesional o Premium), el equipo de InnovationTECH hace la estrategia, crea el contenido y maneja tus redes por ti.",
    },
    {
      p: "¿Puedo hacer videos con inteligencia artificial en Studio?",
      r: "Studio incluye reels con tus fotos, voz en off y subtítulos en el plan Pro. Además existe la opción de video generado por IA con Replicate, que es de pago aparte y requiere conectar tu propia cuenta de Replicate.",
    },
    {
      p: "¿Cuándo puedo contratar Studio?",
      r: "Los planes Básico ($19 al mes) y Pro ($39 al mes) están en preparación. Escríbenos para apartar tu lugar y te avisamos en cuanto estén disponibles.",
    },
  ],
};

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
    enlace: "https://innovationtech-studio.netlify.app/",
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

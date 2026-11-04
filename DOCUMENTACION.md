# Documentación de la aplicación NOVA, de InnovationTECH

> Describe **cómo será** la aplicación. Se irá actualizando a medida que la construyamos.
> Plan y fases: ver `PLAN.md`. Reglas para Claude: ver `CLAUDE.md`.

---

## 1. ¿Qué es?

Un sitio web para **InnovationTECH**, agencia de servicios digitales en San Antonio, TX, con dos partes:

1. **Sitio público:** presenta la agencia, sus servicios (marketing digital, creación de contenido, edición de video, diseño de logos e identidad, desarrollo web), los planes **Básico, Profesional y Premium**, el portafolio y el contacto. Incluye el chat de **NOVA**.
2. **Panel de administrador (`/admin`):** el dueño entra con correo y contraseña para editar la información que usa NOVA, sin tocar código.

---

## 2. ¿Quién es NOVA?

NOVA es una asistente virtual que responde preguntas de clientes **usando solo la información real del negocio**.

- Responde sobre servicios, planes, precios, preguntas frecuentes y portafolio.
- Si no tiene la información, lo dice y ofrece contactar al equipo. **Nunca inventa precios.**
- Tono profesional, cálido y breve.
- Muestra un aviso: *"Soy una asistente de IA. No compartas datos personales sensibles."*

---

## 3. Glosario (palabras técnicas explicadas)

| Término | Qué significa |
|---|---|
| **Next.js** | Herramienta para crear sitios web. Una misma app incluye la parte visible (páginas) y la parte del servidor (rutas secretas). |
| **App Router** | La forma moderna de organizar las páginas en Next.js: cada carpeta dentro de `app/` es una página. |
| **Servidor / ruta del servidor** | Código que corre en la computadora de Netlify, no en el navegador del cliente. Ahí se guardan las claves secretas. |
| **Firestore** | La base de datos de Google donde se guardan las fichas de información. |
| **Ficha** | Un bloque de información del negocio. Ejemplo: "Plan Premium: incluye…". |
| **Embedding (huella)** | Una lista de números que representa el *significado* de un texto. Textos con significado parecido tienen huellas parecidas. |
| **Búsqueda vectorial** | Buscar las fichas cuyas huellas se parecen más a la de la pregunta. |
| **RAG** | "Buscar y luego responder": primero se buscan las fichas relevantes y después la IA responde con ellas. |
| **Gemini** | La inteligencia artificial de Google que escribe las respuestas de NOVA. |
| **Streaming** | La respuesta aparece poco a poco, palabra por palabra, en vez de esperar a que esté completa. |
| **Clave de API** | Una contraseña que permite a tu servidor usar un servicio (Gemini, Firebase). Es secreta. |
| **`.env.local`** | Archivo en tu computadora donde se guardan las claves. **Nunca** se sube a GitHub. |
| **localhost** | Tu propia computadora funcionando como servidor de pruebas (`http://localhost:3000`). |
| **Netlify** | El servicio gratuito que publica tu página en internet. |
| **Plan Spark** | El plan gratuito de Firebase. No pide tarjeta. |

---

## 4. Tecnologías (todas gratuitas)

| Pieza | Tecnología | Plan |
|---|---|---|
| Sitio y servidor | Next.js 16 (App Router), JavaScript, CSS | Gratis (código abierto) |
| IA que responde (**por defecto**) | Google Gemini `gemini-3.8-flash` (SDK `@google/genai`) | Plan gratuito de Gemini API |
| IA que responde (**opcional**) | Claude de Anthropic: Opus 5.5, Sonnet 5.5 o Haiku 5.5 (SDK `@anthropic-ai/sdk`) | **De pago:** crédito prepagado desde $5 |
| Huellas (embeddings) | Google `gemini-embedding-2`, 768 dimensiones | Plan gratuito de Gemini API |
| Base de datos | Firebase Firestore, base `(default)` | Spark (gratis) |
| Login del admin | Firebase Authentication (correo/contraseña) | Spark (gratis) |
| Código | GitHub, repositorio privado | Gratis |
| Publicación | Netlify | Free |

---

## 5. Cómo funciona el chat, paso a paso

```
 Cliente               Servidor (Next.js)                 Servicios de Google
 ───────               ──────────────────                 ───────────────────
 Escribe:
 "¿Cuánto cuesta
  un logo?"  ───────►  /api/chat
                       1. Revisa el límite de mensajes
                          del visitante
                       2. Calcula la huella de la  ─────► Gemini Embedding
                          pregunta                 ◄───── [0.12, -0.03, ...]
                       3. Busca las 5 fichas más   ─────► Firestore
                          parecidas                ◄───── "Diseño de logos",
                                                          "Plan Profesional"...
                       4. Arma el mensaje para la IA:
                          instrucciones de NOVA
                          + fichas encontradas
                          + historial de la charla
                          + la pregunta
                       5. Pide la respuesta a la   ─────► Gemini Flash (por defecto)
                          IA elegida en el panel          o Claude (si está activado)
 Ve la respuesta ◄───  6. La reenvía poco a poco   ◄───── "El diseño de logo
 aparecer poco a poco                                      está incluido en..."
```

**¿Qué IA responde?** El servidor lee la configuración guardada en Firestore (`configuracion/nova`):
- Si dice **Gemini** (por defecto), responde Gemini, gratis.
- Si dice **Claude** y hay clave de Anthropic, responde Claude.
- Si Claude falla (sin crédito, sin clave o error), **el servidor reintenta con Gemini** de forma automática y anota el aviso para el panel. El cliente no nota la diferencia.

La búsqueda de fichas (pasos 2 y 3) **siempre** usa Gemini Embedding, sin importar qué IA responda.

**Si algo falla** (por ejemplo, se acabó la cuota gratuita del día), NOVA muestra:
*"Ahora mismo estoy recibiendo muchas consultas. Escríbenos a [correo] o [WhatsApp] y te respondemos pronto."*

---

## 6. Cómo funciona el panel de administrador

```
 Tú (admin)            Servidor (Next.js)                 Servicios de Google
 ──────────            ──────────────────                 ───────────────────
 Entras a /admin ───►  Pide correo y contraseña  ───────► Firebase Auth
                       Verifica que el correo sea el tuyo
 Editas la ficha
 "Plan Premium"  ───►  /api/admin/fichas
                       1. Verifica tu sesión
                       2. Calcula la nueva huella  ─────► Gemini Embedding
                       3. Guarda ficha + huella    ─────► Firestore
 Ves "Guardado ✓" ◄──
```

Funciones del panel:
- **Lista de fichas** con buscador y filtro por categoría.
- **Crear / editar** una ficha: título, categoría, contenido y enlace opcional.
- **Ocultar** una ficha (NOVA deja de usarla) sin borrarla.
- **Borrar** una ficha (pide confirmación).
- **Probar NOVA:** haces una pregunta y ves la respuesta, qué fichas usó y qué IA respondió.
- **Configuración de NOVA:**
  - Elegir la IA: **Gemini (gratis, por defecto)** o **Claude (de pago)**.
  - Si eliges Claude, elegir el modelo: **Opus 5.5** (recomendado, la mejor calidad), Sonnet 5.5 o Haiku 5.5 (el más económico).
  - Estado: "Claude disponible ✓" o "Claude no disponible: falta la clave de Anthropic".
  - Aviso si NOVA volvió a Gemini porque se acabó el crédito de Claude.
  - Recordatorio: *"Para usar Claude debes cargar crédito (desde $5) en console.anthropic.com. No actives la recarga automática."*

---

## 7. Datos (Firestore)

### Colección `conocimiento`: las fichas que usa NOVA

| Campo | Tipo | Ejemplo | Lo llena |
|---|---|---|---|
| `titulo` | texto | "Plan Profesional" | Tú |
| `categoria` | texto | `servicio`, `plan`, `faq`, `portafolio`, `contacto`, `general` | Tú |
| `contenido` | texto | "Incluye 12 publicaciones al mes y edición de 2 videos..." | Tú |
| `enlace` | texto (opcional) | Link a un trabajo del portafolio | Tú |
| `activo` | sí/no | sí | Tú |
| `actualizado` | fecha | 2026-11-03 | Automático |
| `embedding` | vector de 768 números | (no se muestra) | Automático |

**Consejo:** cada ficha debe tratar **un solo tema**, en 1 a 3 párrafos. Las fichas cortas y enfocadas dan mejores respuestas.

### Documento `configuracion/nova`: qué IA usa NOVA

| Campo | Ejemplo | Significado |
|---|---|---|
| `proveedor` | `gemini` (por defecto) o `claude` | Qué IA escribe las respuestas |
| `modeloClaude` | `claude-opus-5-5`, `claude-sonnet-5-5` o `claude-haiku-5-5` | Modelo de Claude, si está activado |
| `ultimoRespaldo` | fecha y motivo | Última vez que Claude falló y NOVA volvió a Gemini |

Si el documento no existe, NOVA usa **Gemini**.

### Colección `limites`: control de abuso del chat
Cuenta cuántos mensajes envió cada visitante hoy (por dirección IP anonimizada). Sirve para no agotar la cuota gratuita.

### Seguridad de la base de datos
Las reglas de Firestore **bloquean todo acceso directo desde el navegador**. Solo el servidor (con su credencial secreta) puede leer y escribir.

---

## 8. Estructura de carpetas (prevista)

```
innovationTECH1/
├── app/
│   ├── page.js              ← Página de inicio (servicios, planes, portafolio, contacto)
│   ├── layout.js            ← Marco común: fuentes, colores, encabezado, pie
│   ├── globals.css          ← Estilos generales y paleta de marca
│   ├── admin/
│   │   └── page.js          ← Panel de administrador
│   └── api/
│       ├── chat/route.js    ← Servidor del chat de NOVA (RAG + Gemini)
│       └── admin/
│           └── fichas/route.js ← Crear/editar/borrar fichas (protegido)
├── components/
│   ├── ChatNova.js          ← Burbuja y ventana del chat
│   └── ...                  ← Otras piezas visuales (tarjetas de planes, etc.)
├── lib/                     ← Código solo del servidor
│   ├── firebaseAdmin.js     ← Conexión segura a Firestore
│   ├── ia.js                ← Elige la IA (Gemini o Claude) y hace el respaldo automático
│   ├── gemini.js            ← Conexión a Gemini (chat y huellas)
│   ├── claude.js            ← Conexión a Claude (opcional, de pago)
│   ├── buscar.js            ← Búsqueda de fichas (RAG)
│   └── limites.js           ← Límite de mensajes por visitante
├── scripts/
│   └── cargar-fichas.js     ← Carga inicial de la información del negocio
├── public/                  ← Imágenes (logo, portafolio)
├── .env.local               ← CLAVES SECRETAS (nunca a GitHub)
├── .gitignore               ← Lista de archivos que NO se suben a GitHub
├── CLAUDE.md                ← Reglas para Claude
├── PLAN.md                  ← Plan y fases
└── DOCUMENTACION.md         ← Este archivo
```

---

## 9. Variables de entorno (claves)

Se guardan en `.env.local` (en tu computadora) y en **Netlify → Site configuration → Environment variables** (en internet).

| Variable | Qué es | ¿Secreta? |
|---|---|---|
| `GEMINI_API_KEY` | Clave de Google AI Studio | **Sí** |
| `GEMINI_MODEL` | Modelo del chat, por ejemplo `gemini-3.8-flash` | No |
| `ANTHROPIC_API_KEY` | Clave de Claude. **Opcional:** solo si se activa Claude. | **Sí** |
| `FIREBASE_PROJECT_ID` | ID del proyecto de Firebase | No |
| `FIREBASE_CLIENT_EMAIL` | Correo de la cuenta de servicio | **Sí** |
| `FIREBASE_PRIVATE_KEY` | Llave privada de la cuenta de servicio | **Sí** |
| `ADMIN_EMAILS` | Correos con permiso de entrar a `/admin` | Sí (mejor privado) |
| `NEXT_PUBLIC_FIREBASE_*` | Configuración pública de Firebase para la pantalla de login | No (es pública por diseño) |

**Regla:** nada secreto lleva el prefijo `NEXT_PUBLIC_`, porque ese prefijo hace que el navegador lo vea.

---

## 10. Diseño

- **Colores:** azul marino oscuro (fondo), rojo (botones y acentos), blanco y gris claro (texto).
- **Estilo:** tecnológico y moderno: tarjetas con bordes suaves, detalles brillantes en rojo y animaciones ligeras.
- **Celular primero:** todo se diseña para pantallas de ~375 px y después se adapta a computadora.
- **Chat:** burbuja roja flotante abajo a la derecha. Al tocarla, se abre en pantalla completa en el celular y como ventana lateral en computadora.
- **Accesibilidad:** buen contraste de colores, letra legible y botones grandes para el dedo.

---

## 11. Límites gratuitos que nos afectan

| Servicio | Límite gratuito | Qué pasa si se pasa |
|---|---|---|
| Gemini Flash / Embedding | Tope por minuto y por día (ver aistudio.google.com/rate-limit) | Error temporal. NOVA muestra el mensaje de contacto. **No cobra.** |
| Firestore (Spark) | 1 GiB, 50,000 lecturas/día, 20,000 escrituras/día | Deja de responder hasta el día siguiente. **No cobra.** |
| Firebase Auth | 50,000 usuarios/mes | No aplica (solo eres tú) |
| Netlify Free | 300 créditos/mes | El sitio se pausa hasta el mes siguiente. **No cobra.** |
| Claude (opcional, de pago) | El crédito prepagado que cargues (desde $5) | Claude deja de responder y NOVA vuelve sola a Gemini. **Sin recarga automática, no cobra más.** |

---

## 12. Historial de cambios del documento
- **2026-11-03:** primera versión. Cambio a stack 100% gratuito (Gemini + Firestore Spark + Netlify Free).
- **2026-11-03:** se agrega la opción de cambiar NOVA a Claude desde el panel (de pago, crédito desde $5), con Gemini por defecto y respaldo automático a Gemini.
- **2026-11-04:** Fase 2 probada con la IA real. Datos de contacto reales en `datos/sitio.js`. Si un modelo de Gemini no empieza a responder en 15 segundos, NOVA prueba el siguiente modelo gratuito. Si ninguno responde, muestra el mensaje de contacto (el cliente nunca se queda esperando sin respuesta).

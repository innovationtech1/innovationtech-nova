# CLAUDE.md: reglas del proyecto NOVA / InnovationTECH

## Sobre el usuario
- Es el dueño de InnovationTECH (agencia de servicios digitales en San Antonio, TX) y **no es técnico**.
- **Habla siempre en español**, paso a paso y en palabras sencillas. Explica cada término técnico la primera vez que aparezca (hay un glosario en `DOCUMENTACION.md`).
- **Pregunta antes de** instalar cualquier cosa (programas, paquetes npm), crear cuentas o tomar una decisión importante.
- No escribas código de una fase que el usuario no haya aprobado. Al inicio de cada sesión lee `PLAN.md` y `DOCUMENTACION.md`, y actualízalos cuando cambie algo.

## REGLA PRINCIPAL: costo cero
El proyecto debe construirse y operar **gratis**. Antes de proponer cualquier servicio, paquete o función, confirma que es gratuito en su plan gratis actual.
- **Nunca** pedirle al usuario que registre una tarjeta ni que active facturación.
- Firebase se queda en **Spark**: nada de Blaze, Cloud Functions, bases de datos con nombre ni extensiones de Firebase.
- Gemini API solo en el **plan gratuito** (sin facturación en AI Studio).
- Netlify solo en el **plan Free**, sin recarga automática de créditos.
- Si algo útil requiere pago, **explícalo y pregunta**. No lo agregues por tu cuenta.
- **Única excepción aprobada:** la opción de Claude (Anthropic). Es opcional, se activa desde el panel y la paga el dueño con crédito prepagado (desde $5, sin recarga automática). La app debe funcionar completa sin ella.

## Qué es el proyecto
Sitio web de InnovationTECH con **NOVA**, una asistente de IA que responde a clientes sobre servicios, planes (Básico, Profesional, Premium), precios, preguntas frecuentes y portafolio, usando RAG sobre Firestore. Detalles en `DOCUMENTACION.md`.

## Tecnologías (no cambiarlas sin preguntar)
- **Next.js 16+ con App Router**, en **JavaScript** (no TypeScript) y **CSS** puro o CSS Modules (sin Tailwind salvo que el usuario lo pida).
- **IA:** Google Gemini con el SDK oficial `@google/genai`. Modelo de chat en la variable `GEMINI_MODEL` (por defecto `gemini-3.8-flash`, del plan gratuito). Respuestas en streaming.
- **Embeddings:** `gemini-embedding-2` con `outputDimensionality: 768` (Firestore admite hasta 2048). Este modelo **no** usa `task_type`: se antepone `task: search result | query: ...` a las preguntas y `title: ... | text: ...` a las fichas.
- **Firebase:** Firestore (base `(default)`) y Firebase Authentication. En el servidor se usa `firebase-admin`.
- **Búsqueda:** `findNearest` de Firestore con índice vectorial. Plan B si el índice no está disponible en Spark: cargar las fichas activas y calcular la similitud en el servidor.
- **Desarrollo:** local (`localhost:3000`). **Publicación:** Netlify Free. **No usar Vercel Hobby**, porque prohíbe el uso comercial.
- **IA intercambiable:** `lib/ia.js` lee `configuracion/nova` en Firestore (`proveedor`: `gemini` por defecto o `claude`; `modeloClaude`) y llama a `lib/gemini.js` o a `lib/claude.js`.
- **Claude (opcional):** SDK oficial `@anthropic-ai/sdk`, con streaming. Modelos permitidos, solo estos IDs exactos y sin sufijos de fecha: `claude-opus-5-5` (por defecto al activar Claude), `claude-sonnet-5-5` y `claude-haiku-5-5`. En Opus 5.5 no se puede desactivar el razonamiento: usar `output_config: { effort: "low" }` para chat. Revisar `stop_reason` (incluido `refusal`) antes de leer la respuesta. Antes de escribir este código, revisar la documentación actual de la API de Anthropic.
- **Respaldo automático:** si Claude falla (sin crédito, sin `ANTHROPIC_API_KEY`, error 4xx/5xx o `refusal`), `lib/ia.js` responde con Gemini y guarda `ultimoRespaldo` para avisar en el panel.
- Las huellas (embeddings) **siempre** usan Gemini, sin importar qué IA responda.

## Reglas de seguridad (obligatorias)
- Las claves (`GEMINI_API_KEY`, `ANTHROPIC_API_KEY` opcional y las credenciales de la cuenta de servicio de Firebase) van **solo** en `.env.local` y en las variables de entorno de Netlify. La clave de Anthropic **no** se escribe en el panel ni se guarda en Firestore.
- `.env.local` y cualquier `*service-account*.json` deben estar en `.gitignore` **antes** del primer commit.
- **Nunca** uses `NEXT_PUBLIC_` para secretos. Solo la configuración pública del SDK web de Firebase (para el login) puede llevarlo.
- Las llamadas a Gemini y a Firestore van solo en rutas del servidor (`app/api/.../route.js`) o en `lib/` con `import "server-only"`.
- `/api/admin/*` verifica el token de Firebase Auth en el servidor y que el correo esté en `ADMIN_EMAILS`.
- Las reglas de Firestore niegan todo acceso directo desde el navegador.
- `/api/chat` tiene límite de mensajes por visitante y por día, y un tope de longitud por mensaje.

## Comportamiento de NOVA
- Responde **solo** con las fichas recuperadas. Si la información no está, lo dice y ofrece contactar al equipo. Nunca inventa precios.
- No pide datos sensibles. El chat muestra un aviso de privacidad, porque el plan gratuito de Gemini puede usar el contenido para mejorar productos de Google.
- Si Gemini devuelve un error de cuota (429) u otro fallo, muestra un mensaje amable con los datos de contacto.
- Tono profesional, cálido y breve.

## Marca y diseño
- Azul marino oscuro (fondo) + rojo (acentos y botones) + blanco y gris claro (texto). Estilo tecnológico.
- **Celular primero** (~375 px). Imágenes optimizadas y ligeras para cuidar el ancho de banda gratuito.

## Forma de trabajar
- Una fase a la vez, con cambios pequeños. Al terminar cada paso, explica qué se hizo y cómo probarlo.
- Antes de usar una función de Next.js, Firebase, Gemini o Netlify, verifica en su documentación actual, porque cambian seguido.
- Nada de commits, pushes ni despliegues sin pedírselo al usuario.

# Plan del proyecto: NOVA, asistente virtual de InnovationTECH

> **Versión 2: plan de costo cero.** Reemplaza al plan anterior (que usaba Claude y Vercel Pro).
> Estado: **plan aprobado.**
> - Fase 0: en curso (el dueño crea las cuentas y llena `INFORMACION_NEGOCIO.md`)
> - Fase 1: ✅ terminada (página de inicio)
> - Fase 2: ✅ terminada y probada con la IA real (4 nov 2026). NOVA responde en el chat y no inventa precios. Si Google está saturado (error 503), prueba solo otros modelos gratuitos y, si nada responde, muestra el mensaje de contacto.
> - Información del negocio (Fase 0): ✅ completa (pendiente: links de redes sociales).
> - Fase 3: ✅ terminada y probada (5 nov 2026). 27 fichas en Firestore (proyecto `innovationtech-nova`, base `(default)`, Standard, nam5, plan Spark). Búsqueda con el **Plan B** (similitud calculada en el servidor, sin índice vectorial). Si Firestore falla, NOVA usa `datos/sitio.js`.
> - Fase 4, parte 1: ✅ panel `/admin` (login con Firebase Auth, fichas: crear/editar/ocultar/borrar con buscador y filtro, "Probar NOVA"). Probado por API; falta que el dueño entre con su contraseña.
> - Fase 5: 🔄 en curso. Código listo para publicar (compila sin errores, límite de mensajes guardado en Firestore, respuestas que caben en los 60 s de Netlify). Reglas de Firestore comprobadas: bloquean todo acceso desde afuera. Falta crear la cuenta de Netlify y publicar.
> - Fase 5: publicada en Netlify (7 nov 2026), con las claves del servidor y `SECRETS_SCAN_OMIT_KEYS` para los valores que no son secretos (`GEMINI_MODEL`, `NEXT_PUBLIC_FIREBASE_API_KEY`, `FIREBASE_PROJECT_ID`, `ADMIN_EMAILS`).
> - Conocimiento de **InnovationTECH Studio** (7 nov 2026): sección `studio` en `datos/sitio.js`, que genera 12 fichas (qué es, herramientas, música, planes Básico $19 y Pro $39 «próximamente» y preguntas frecuentes). Para cargarlas: `npm run cargar-fichas`.
> - Después: Fase 4, parte 2 ("Configuración de NOVA": elegir Gemini o Claude, opcional y de pago).
> Fecha: 4 de noviembre de 2026
> Documentación técnica de la app: ver `DOCUMENTACION.md`.

---

## 1. Objetivo

Construir y operar la página web de InnovationTECH con el chat de **NOVA** **sin pagar nada**:

- $0 para construir.
- $0 para operar mientras el negocio sea pequeño.
- **Ninguna cuenta con tarjeta de crédito registrada.** Si no hay tarjeta, nadie te puede cobrar por error.

---

## 2. Decisiones tomadas

| Tema | Decisión | Por qué |
|---|---|---|
| Cerebro de NOVA (IA) | **Google Gemini, plan gratuito** (modelo `gemini-3.8-flash`). **Es la opción por defecto.** | Claude no tiene plan gratuito. Gemini sí, y sin tarjeta. |
| IA opcional | **Claude (Anthropic)**, que se activa desde el panel de administrador | Da mejores respuestas, pero **es de pago**: el dueño debe cargar crédito (desde $5) en Anthropic. Ver sección 2.1. |
| "Huellas" para buscar (embeddings) | **Google `gemini-embedding-2`, gratis**, con 768 números por huella | Gratis, usa la misma clave que el chat y es compatible con Firestore (máximo 2048). |
| Base de datos | **Firebase Firestore, plan Spark (gratis, sin tarjeta)** | 1 GiB de almacenamiento, 50,000 lecturas y 20,000 escrituras gratis **por día**. Te sobra. |
| Login del administrador | **Firebase Authentication (gratis)** | Correo y contraseña. Hasta 50,000 usuarios gratis (solo serás tú). |
| Construcción | **En tu computadora (localhost)** | Construir y probar en tu propia computadora no cuesta nada. |
| Publicación | **Netlify, plan Free** | A diferencia de Vercel Hobby, su plan gratis permite sitios de negocio. Soporta Next.js 16. Si pasas el límite, **pausa** el sitio en vez de cobrarte. |
| Código | **GitHub (gratis)**, repositorio **público** `innovationtech1/innovationtech-nova` (cambiado de privado a público por decisión del dueño, 4 nov 2026) | Guarda tu código y conecta con Netlify. Al ser público, **nunca** se suben claves: van solo en `.env.local` y en Netlify. |
| Dirección web | **`innovationtech.netlify.app`** (o similar, gratis) | Un dominio propio (.com) cuesta ~$12-20 al año. Es **opcional** y se deja para después. |

### Lo que cambia por usar planes gratis (tienes que saberlo)

1. **Privacidad:** en el plan gratuito de Gemini, **Google puede usar las conversaciones para mejorar sus productos.** Por eso:
   - El chat mostrará un aviso: *"No compartas datos personales sensibles en este chat."*
   - NOVA **no** pedirá datos sensibles (tarjetas, contraseñas, direcciones).
2. **Límites diarios:** el plan gratis de Gemini tiene un tope de preguntas por minuto y por día (Google lo ajusta; se ve en https://aistudio.google.com/rate-limit). Si se alcanza, **no te cobra**: NOVA mostrará *"Estoy recibiendo muchas consultas, escríbenos a [tu correo o WhatsApp]"*.
3. **Netlify Free** tiene 300 créditos al mes. Para una página con poco tráfico debería alcanzar. Si se acaban, el sitio se pausa hasta el mes siguiente (no cobra).
4. **Calidad:** Gemini Flash es bueno para responder preguntas de un negocio, pero no es el modelo más avanzado. Si quieres mejores respuestas, puedes activar Claude (sección 2.1).

### 2.1 Opción de pago: cambiar NOVA a Claude

La app **funciona gratis con Gemini**. Además, el panel de administrador tendrá un interruptor para cambiar la IA de NOVA a **Claude**, de Anthropic.

**Cómo funciona:**
1. Por defecto NOVA usa **Gemini (gratis)**. No hay que hacer nada.
2. Si el dueño quiere usar Claude, debe:
   - Crear una cuenta en **console.anthropic.com**.
   - **Comprar crédito prepagado, desde $5.** Se paga una vez con tarjeta. **No activar la recarga automática.**
   - Crear una clave de API y agregarla a la configuración (`.env.local` y Netlify).
3. En el panel (`/admin` → **Configuración de NOVA**) elige **"Claude"** y el modelo:

   | Modelo de Claude | Calidad | Mensajes aproximados con $5 |
   |---|---|---|
   | **Opus 5.5** (recomendado) | La mejor | ~250 |
   | Sonnet 5.5 | Muy buena | ~500 |
   | Haiku 5.5 | Buena | ~10,000 |

   *Estimación para mensajes de ~3,000 tokens de entrada y ~400 de salida. Precios por millón de tokens (entrada/salida): Opus 5.5 $4/$20, Sonnet 5.5 $2/$10, Haiku 5.5 $0.10/$0.50.*
4. El panel muestra **"Claude: no disponible"** mientras no exista la clave de Anthropic.

**Protección automática:** si el crédito de Claude se acaba o Claude falla, **NOVA vuelve sola a Gemini (gratis)** y el panel muestra un aviso: *"Se acabó el crédito de Claude, NOVA está usando Gemini."* Como es prepagado y sin recarga automática, **nunca se cobra más de lo que cargaste.**

**Lo que no cambia:** la búsqueda de fichas (huellas) **siempre usa Gemini Embedding, gratis**, aunque las respuestas las escriba Claude. Así no hay que recalcular nada al cambiar de IA.

**Ventaja extra de Claude:** según sus términos comerciales, Anthropic no usa los datos de su API para entrenar sus modelos. Esto mejora la privacidad frente al plan gratuito de Gemini.

---

## 3. Reglas para no gastar nunca (las seguiremos siempre)

1. **No registrar tarjeta** en Google Cloud, Firebase, Google AI Studio ni Netlify. *(La única excepción es Anthropic, y solo si el dueño decide activar Claude: crédito prepagado, sin recarga automática.)*
2. **No activar el plan Blaze de Firebase** ni la facturación de Google Cloud. Firestore se queda en Spark.
3. **No usar Cloud Functions de Firebase** (requieren Blaze). Todo el código del servidor corre en Next.js.
4. **No crear bases de datos adicionales** en Firestore. Solo la base `(default)`, que es la que tiene cuota gratis.
5. **No comprar créditos** en Netlify ni activar la recarga automática.
6. **Límite de mensajes por visitante** en el chat, para no agotar las cuotas gratuitas.
7. **Imágenes del portafolio optimizadas y ligeras**, para no gastar ancho de banda.
8. **Antes de instalar o activar cualquier cosa, Claude te pregunta** y te confirma que es gratis.

---

## 4. Arquitectura (resumen)

```
  CLIENTE (celular / PC)
        │ pregunta
        ▼
  ┌──────────────────────────────────────────────┐
  │  SERVIDOR Next.js (localhost → Netlify)      │
  │                                              │
  │  /api/chat                                   │
  │   1. Huella de la pregunta ──────────────────┼──► Gemini Embedding (gratis)
  │   2. Busca las fichas parecidas ─────────────┼──► Firestore Spark (gratis)
  │   3. Fichas + pregunta → respuesta ──────────┼──► Gemini Flash (gratis)
  │   4. Devuelve la respuesta poco a poco       │
  │                                              │
  │  /admin  (login con Firebase Auth, gratis)   │
  │   - Crear / editar / ocultar fichas          │
  │   - Al guardar, calcula la huella            │
  │                                              │
  │  Claves secretas: solo aquí (.env.local)     │
  └──────────────────────────────────────────────┘
```

La explicación completa está en `DOCUMENTACION.md`.

---

## 5. Fases

Cada fase termina con algo que puedes **ver y probar**. No avanzamos sin tu aprobación.

### Fase 0: Preparación (sin código, $0)
1. Crear las cuentas de la sección 6 (todas **sin tarjeta**).
2. Instalar en tu computadora **Node.js 20+**, **Git** y un editor (Visual Studio Code). Son programas gratuitos. *Te pediré permiso antes de cada instalación.*
3. Reunir la información del negocio en un documento:
   - Lista de servicios y qué incluye cada uno.
   - Planes Básico, Profesional y Premium: qué incluyen y su precio.
   - De 10 a 20 preguntas frecuentes con su respuesta.
   - De 3 a 6 trabajos del portafolio (título, descripción corta y una imagen).
   - Datos de contacto: correo, teléfono o WhatsApp, horario.
4. Logo y colores exactos de tu marca (si los tienes en código, por ejemplo `#0A1A3F` y `#E63946`; si no, los elegimos juntos).

**Resultado:** cuentas listas, programas instalados e información reunida.

### Fase 1: Página de inicio (solo en tu computadora)
- Crear el proyecto Next.js 16 (JavaScript + CSS).
- Secciones: inicio (hero), servicios, planes, portafolio, contacto.
- Diseño azul marino + rojo, estilo tecnológico, pensado primero para celular.
- **Resultado:** abres `http://localhost:3000` y ves tu página. También puedes verla en tu celular conectado al mismo Wi-Fi.

### Fase 2: NOVA mínima (la primera versión que funciona)
- Burbuja de chat en la esquina de la página.
- Ruta del servidor `/api/chat` conectada a Gemini Flash, con respuesta en streaming.
- La información del negocio va escrita en las instrucciones de NOVA (todavía sin base de datos).
- Límite de mensajes por visitante y aviso de privacidad.
- Mensaje amable si se alcanza el límite gratuito de Gemini.
- **Resultado:** NOVA ya contesta preguntas reales. Es la **versión mínima funcional**.

### Fase 3: Base de datos + búsqueda inteligente (RAG)
- Conectar Firestore (plan Spark) desde el servidor.
- Colección `conocimiento` con tus fichas.
- Script para cargar la información de la Fase 0 y calcular las huellas con `gemini-embedding-2`.
- Crear el índice vectorial y usar `findNearest` para buscar.
- **Plan B incluido:** si el índice vectorial no se pudiera crear en el plan gratuito (la documentación no lo aclara), el servidor lee todas las fichas activas y compara las huellas él mismo. Con unas pocas decenas de fichas es igual de rápido y sigue costando $0.
- **Resultado:** NOVA responde usando la base de datos.

### Fase 4: Panel de administrador
- `/admin` con inicio de sesión (Firebase Auth). Solo tu correo tiene acceso.
- Lista de fichas con buscador y filtro por categoría.
- Crear, editar, ocultar y borrar fichas. La huella se recalcula al guardar.
- Botón **"Probar NOVA"**, que muestra qué fichas usó para responder.
- Sección **"Configuración de NOVA"**: elegir la IA (**Gemini, gratis, por defecto** / **Claude, de pago**) y el modelo de Claude. Muestra si Claude está disponible y si NOVA volvió a Gemini por falta de crédito.
- Conexión con Claude mediante el SDK oficial de Anthropic. Solo se usa si el dueño la activa.
- **Resultado:** cambias precios o servicios sin tocar código, y eliges qué IA usa NOVA.

### Fase 5: Publicar gratis en Netlify
- ✅ Código subido a GitHub (repositorio público; `.env.local` queda fuera).
- Conectar GitHub con Netlify y copiar las claves en la configuración de Netlify.
- ✅ Código preparado: compila sin errores (`npm run build`), el límite de mensajes se guarda en Firestore (en Netlify la memoria se borra), cada respuesta termina antes de 48 s (Netlify corta a los 60 s) y, si el visitante cierra el chat, Gemini deja de escribir para no gastar cuota.
- ✅ Reglas de seguridad de Firestore comprobadas (5 nov 2026): leer y escribir desde afuera responde "403, prohibido".
- Pruebas en varios celulares.
- **Resultado:** tu página en internet, en `https://<nombre>.netlify.app`.

### Fase 6 (opcional, a futuro)
- NOVA guarda nombre y correo de interesados (con su permiso) en el panel.
- Botón para pasar a WhatsApp.
- Versión en inglés.
- Dominio propio (.com, ~$12-20 al año).
- Ver en el panel cuántos mensajes respondió cada IA en el mes.

---

## 6. Cuentas necesarias (todas gratis y sin tarjeta)

| # | Cuenta | Dónde | Para qué |
|---|---|---|---|
| 1 | **Cuenta de Google** (puede ser tu Gmail) | accounts.google.com | La usan Firebase y Gemini |
| 2 | **Firebase**, proyecto en plan **Spark** | console.firebase.google.com | Firestore + login del admin |
| 3 | **Google AI Studio** | aistudio.google.com | Crear la clave de Gemini (chat + huellas) |
| 4 | **GitHub** | github.com | Guardar el código (repositorio público) |
| 5 | **Netlify**, plan **Free** (puedes entrar con GitHub) | netlify.com | Publicar la página |

> Al crear la clave en AI Studio **no** hagas clic en "Set up billing" ni en "Upgrade". Así la clave se queda en el plan gratuito.

**Opcional (solo si quieres usar Claude):**

| # | Cuenta | Dónde | Para qué |
|---|---|---|---|
| 6 | **Anthropic Console** | console.anthropic.com | Clave de Claude. **De pago:** crédito prepagado desde $5, sin recarga automática. |

---

## 7. Costo

| Concepto | Costo |
|---|---|
| Programas en tu computadora (Node.js, Git, VS Code) | $0 |
| Firebase Spark (Firestore + Auth) | $0 |
| Gemini Flash + Gemini Embedding (plan gratuito) | $0 |
| GitHub | $0 |
| Netlify Free | $0 |
| Dominio `.netlify.app` | $0 |
| **Total para construir y operar** | **$0** |
| *Opcional:* dominio propio .com | ~$12-20 al año |
| *Opcional:* usar Claude en lugar de Gemini | Crédito prepagado desde **$5**, que se gasta según el uso (ver la tabla de la sección 2.1) |

---

## 8. Riesgos y cómo los manejamos

| Riesgo | Qué pasa | Cómo lo manejamos |
|---|---|---|
| Se acaba la cuota diaria de Gemini | NOVA no puede responder un rato | Mensaje amable con tu contacto. La cuota se reinicia cada día. |
| Google usa las conversaciones del plan gratis | Tema de privacidad | Aviso visible en el chat y NOVA no pide datos sensibles. |
| Google o Netlify cambian sus planes gratuitos | Podría dejar de ser gratis | Sin tarjeta no hay cobros sorpresa, solo pausas. Revisaremos los precios antes de publicar. |
| Se filtran las claves | Alguien usa tus cuotas | Claves solo en `.env.local` y Netlify. Nunca en GitHub ni en el navegador. |
| Alguien abusa del chat | Se agotan las cuotas | Límite de mensajes por visitante y por día. |
| Se acaba el crédito de Claude | Claude deja de responder | NOVA vuelve sola a Gemini (gratis) y el panel avisa. Sin recarga automática, no hay cobros extra. |
| NOVA inventa precios | Información incorrecta | Instrucciones estrictas: solo responde con las fichas y, si no sabe, ofrece contactarte. |

---

## 9. Lo que necesito de ti para empezar

1. **Aprobar este plan** (o decirme qué cambiar).
2. Avisarme cuando tengas lista la **información del negocio** (Fase 0, punto 3).
3. Darme permiso para revisar si ya tienes **Node.js y Git** instalados en tu computadora.

---

## Fuentes consultadas (noviembre 2026)
- Precios de Gemini API (plan gratuito y uso de datos): https://aistudio.google.com/docs/pricing
- Embeddings de Gemini: https://aistudio.google.com/docs/embeddings
- Límites de Gemini: https://aistudio.google.com/docs/rate-limits
- Firestore vector search: https://firebase.google.com/docs/firestore/vector-search
- Precios de Firebase: https://firebase.google.com/pricing
- Uso comercial en Vercel Hobby: https://vercel.com/docs/limits/fair-use-guidelines
- Precios de Netlify: https://www.netlify.com/pricing/
- Modelos y precios de Claude: https://platform.claude.com/docs/en/about-claude/pricing

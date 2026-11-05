import "server-only";
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

// Conexión segura a Firestore desde el servidor (nunca desde el navegador).
// Las credenciales salen de .env.local (en tu computadora) o de Netlify (en internet).

export function firestoreConfigurado() {
  return Boolean(
    process.env.FIREBASE_PROJECT_ID &&
      process.env.FIREBASE_CLIENT_EMAIL &&
      process.env.FIREBASE_PRIVATE_KEY
  );
}

function iniciar() {
  if (!getApps().length) {
    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        // En las variables de entorno los saltos de línea llegan como "\n"
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      }),
    });
  }
}

export function obtenerDb() {
  iniciar();
  // Siempre la base (default): es la única con cuota gratuita en el plan Spark
  return getFirestore();
}

// La sesión del administrador se verifica en lib/verificarToken.js (sin firebase-admin/auth,
// que no carga en Netlify).

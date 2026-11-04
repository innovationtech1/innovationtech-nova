import "server-only";
import { responderConGemini, geminiConfigurado } from "./gemini";

// Punto único para pedir respuestas a la IA.
// Hoy solo usa Gemini (gratis). En la Fase 4 aquí se agrega la opción de
// Claude con respaldo automático a Gemini.

export function iaDisponible() {
  return geminiConfigurado();
}

export function responder({ instrucciones, historial }) {
  return responderConGemini({ instrucciones, historial });
}

// Prueba de «¿Olvidaste tu contraseña?»: node --test pruebas/
import { test } from "node:test";
import assert from "node:assert/strict";
import { AVISO_RESTABLECER, enviarRestablecer } from "../lib/sesionAdmin.js";

function respuesta(ok, mensaje) {
  return { ok, json: async () => (ok ? {} : { error: { message: mensaje } }) };
}

test("pide a Firebase el correo PASSWORD_RESET", async () => {
  let pedido;
  globalThis.fetch = async (url, op) => ((pedido = { url, cuerpo: JSON.parse(op.body) }), respuesta(true));
  assert.equal(await enviarRestablecer("yo@ejemplo.com", "clave"), AVISO_RESTABLECER);
  assert.match(pedido.url, /accounts:sendOobCode\?key=clave$/);
  assert.deepEqual(pedido.cuerpo, { requestType: "PASSWORD_RESET", email: "yo@ejemplo.com" });
});

test("un correo sin cuenta recibe el mismo mensaje (no revela quién tiene cuenta)", async () => {
  globalThis.fetch = async () => respuesta(false, "EMAIL_NOT_FOUND");
  assert.equal(await enviarRestablecer("nadie@ejemplo.com", "clave"), AVISO_RESTABLECER);
});

test("correo no válido y demasiados intentos dan mensajes claros", async () => {
  globalThis.fetch = async () => respuesta(false, "INVALID_EMAIL");
  await assert.rejects(enviarRestablecer("x", "clave"), /Escribe un correo válido/);
  globalThis.fetch = async () => respuesta(false, "TOO_MANY_ATTEMPTS_TRY_LATER : Try again later.");
  await assert.rejects(enviarRestablecer("yo@ejemplo.com", "clave"), /Demasiados intentos/);
});

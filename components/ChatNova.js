"use client";

import { useEffect, useRef, useState } from "react";
import estilos from "./ChatNova.module.css";
import { negocio } from "@/datos/sitio";

const SALUDO = {
  rol: "nova",
  texto: "¡Hola! Soy NOVA, la asistente virtual de InnovationTECH. ¿En qué te puedo ayudar hoy?",
};

const SUGERENCIAS = [
  "¿Qué servicios ofrecen?",
  "¿Qué incluye el plan Profesional?",
  "¿Hacen logos?",
];

const LARGO_MAXIMO = 800;

export default function ChatNova() {
  const [abierto, setAbierto] = useState(false);
  const [mensajes, setMensajes] = useState([SALUDO]);
  const [texto, setTexto] = useState("");
  const [esperando, setEsperando] = useState(false);
  const finRef = useRef(null);
  const entradaRef = useRef(null);

  // Bajar automáticamente al último mensaje
  useEffect(() => {
    finRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [mensajes, abierto]);

  // Enfocar la caja de texto al abrir; cerrar con la tecla Escape
  useEffect(() => {
    if (!abierto) return;
    entradaRef.current?.focus();
    const alPresionar = (e) => e.key === "Escape" && setAbierto(false);
    window.addEventListener("keydown", alPresionar);
    return () => window.removeEventListener("keydown", alPresionar);
  }, [abierto]);

  async function enviar(contenido) {
    const pregunta = contenido.trim().slice(0, LARGO_MAXIMO);
    if (!pregunta || esperando) return;

    const historial = [...mensajes, { rol: "usuario", texto: pregunta }];
    setMensajes([...historial, { rol: "nova", texto: "" }]);
    setTexto("");
    setEsperando(true);

    try {
      const respuesta = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // El saludo inicial no se envía: no es parte de la conversación real
        body: JSON.stringify({ mensajes: historial.slice(1) }),
      });

      // Un fallo interno del servidor (500, 502…) no trae un mensaje de NOVA: se avisa con el contacto
      if (!respuesta.ok && respuesta.status >= 500 && respuesta.status !== 503) {
        throw new Error(`Servidor ${respuesta.status}`);
      }
      if (!respuesta.body) throw new Error("Sin respuesta");

      const lector = respuesta.body.getReader();
      const decodificador = new TextDecoder();
      let acumulado = "";

      while (true) {
        const { value, done } = await lector.read();
        if (done) break;
        acumulado += decodificador.decode(value, { stream: true });
        const parcial = acumulado;
        setMensajes((previos) => [...previos.slice(0, -1), { rol: "nova", texto: parcial }]);
      }
      // Si la respuesta llegó vacía, no se dejan los puntitos para siempre
      if (!acumulado.trim()) throw new Error("Respuesta vacía");
    } catch (error) {
      const sinInternet = error instanceof TypeError; // fetch falla así cuando no hay conexión
      setMensajes((previos) => [
        ...previos.slice(0, -1),
        {
          rol: "nova",
          texto: sinInternet
            ? "No pude conectarme. Revisa tu internet e intenta de nuevo."
            : `Tuve un problema para responder. Intenta de nuevo en un momento o escríbenos a ${negocio.correo} o llámanos al ${negocio.telefono}.`,
        },
      ]);
    } finally {
      setEsperando(false);
      entradaRef.current?.focus();
    }
  }

  function alEnviar(e) {
    e.preventDefault();
    enviar(texto);
  }

  function alTeclear(e) {
    // Enter envía; Shift+Enter hace un salto de línea
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      enviar(texto);
    }
  }

  const soloSaludo = mensajes.length === 1;

  return (
    <>
      {abierto && (
        <section
          className={estilos.ventana}
          role="dialog"
          aria-modal="false"
          aria-labelledby="titulo-nova"
        >
          <header className={estilos.cabecera}>
            <div className={estilos.avatar} aria-hidden="true">N</div>
            <div className={estilos.identidad}>
              <h2 id="titulo-nova">NOVA</h2>
              <p>Asistente virtual · InnovationTECH</p>
            </div>
            <button
              type="button"
              className={estilos.cerrar}
              onClick={() => setAbierto(false)}
              aria-label="Cerrar chat"
            >
              ✕
            </button>
          </header>

          <div className={estilos.mensajes} aria-live="polite">
            {mensajes.map((m, i) => (
              <div
                key={i}
                className={`${estilos.mensaje} ${m.rol === "usuario" ? estilos.usuario : estilos.nova}`}
              >
                {m.texto || (
                  <span className={estilos.escribiendo} aria-label="NOVA está escribiendo">
                    <span />
                    <span />
                    <span />
                  </span>
                )}
              </div>
            ))}

            {soloSaludo && (
              <div className={estilos.sugerencias}>
                {SUGERENCIAS.map((s) => (
                  <button key={s} type="button" onClick={() => enviar(s)}>
                    {s}
                  </button>
                ))}
              </div>
            )}
            <div ref={finRef} />
          </div>

          <form className={estilos.formulario} onSubmit={alEnviar}>
            <textarea
              ref={entradaRef}
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              onKeyDown={alTeclear}
              placeholder="Escribe tu pregunta…"
              rows={1}
              maxLength={LARGO_MAXIMO}
              aria-label="Escribe tu pregunta para NOVA"
            />
            <button
              type="submit"
              className={estilos.enviar}
              disabled={esperando || !texto.trim()}
              aria-label="Enviar"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M22 2 11 13" />
                <path d="M22 2 15 22l-4-9-9-4 20-7Z" />
              </svg>
            </button>
          </form>

          <p className={estilos.aviso}>
            NOVA es una asistente de IA y puede equivocarse. No compartas datos personales sensibles.
          </p>
        </section>
      )}

      <button
        type="button"
        className={`${estilos.burbuja} ${abierto ? estilos.burbujaOculta : ""}`}
        onClick={() => setAbierto(true)}
        aria-label="Abrir chat con NOVA"
      >
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2Z" />
        </svg>
        <span className={estilos.etiquetaBurbuja}>Pregúntale a NOVA</span>
      </button>
    </>
  );
}

"use client";

import { useState } from "react";
import estilos from "./Encabezado.module.css";

const enlaces = [
  { href: "#servicios", texto: "Servicios" },
  { href: "#planes", texto: "Planes" },
  { href: "#portafolio", texto: "Portafolio" },
  { href: "#contacto", texto: "Contacto" },
];

export default function Encabezado() {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const cerrar = () => setMenuAbierto(false);

  return (
    <header className={estilos.encabezado}>
      <div className={`contenedor ${estilos.barra}`}>
        <a href="#inicio" className={estilos.logo} onClick={cerrar}>
          Innovation<span>TECH</span>
        </a>

        <button
          type="button"
          className={estilos.botonMenu}
          aria-label={menuAbierto ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={menuAbierto}
          aria-controls="menu-principal"
          onClick={() => setMenuAbierto(!menuAbierto)}
        >
          <span className={menuAbierto ? estilos.iconoCerrar : estilos.iconoMenu} />
        </button>

        <nav
          id="menu-principal"
          className={`${estilos.menu} ${menuAbierto ? estilos.menuAbierto : ""}`}
        >
          {enlaces.map((enlace) => (
            <a key={enlace.href} href={enlace.href} onClick={cerrar}>
              {enlace.texto}
            </a>
          ))}
          <a href="#contacto" className="boton boton-primario" onClick={cerrar}>
            Cotiza gratis
          </a>
        </nav>
      </div>
    </header>
  );
}

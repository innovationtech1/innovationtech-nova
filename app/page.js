import Encabezado from "@/components/Encabezado";
import Icono from "@/components/Icono";
import { negocio, servicios, planes, portafolio } from "@/datos/sitio";
import estilos from "./page.module.css";

export default function Inicio() {
  const anio = new Date().getFullYear();

  return (
    <>
      <Encabezado />

      <main>
        {/* ── PORTADA ── */}
        <section id="inicio" className={estilos.portada}>
          <div className={estilos.cuadricula} aria-hidden="true" />
          <div className={`contenedor ${estilos.portadaContenido}`}>
            <p className={estilos.etiqueta}>Agencia digital · {negocio.ciudad}</p>
            <h1 className={estilos.titulo}>
              {negocio.eslogan.split(" ").slice(0, -2).join(" ")}{" "}
              <span>{negocio.eslogan.split(" ").slice(-2).join(" ")}</span>
            </h1>
            <p className={estilos.subtitulo}>{negocio.descripcion}</p>
            <div className={estilos.acciones}>
              <a href="#planes" className="boton boton-primario">
                Ver planes
              </a>
              <a href="#contacto" className="boton boton-secundario">
                Hablemos de tu proyecto
              </a>
            </div>
          </div>
        </section>

        {/* ── SERVICIOS ── */}
        <section id="servicios" className={estilos.seccion}>
          <div className="contenedor">
            <header className={estilos.cabecera}>
              <p className={estilos.etiqueta}>Servicios</p>
              <h2>Todo lo que tu marca necesita</h2>
              <p>Un solo equipo para tu presencia digital, de la idea al resultado.</p>
            </header>
            <div className={estilos.gridServicios}>
              {servicios.map((s) => (
                <article key={s.id} className={estilos.tarjeta}>
                  <div className={estilos.iconoServicio}>
                    <Icono nombre={s.icono} />
                  </div>
                  <h3>{s.titulo}</h3>
                  <p>{s.descripcion}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ── PLANES ── */}
        <section id="planes" className={`${estilos.seccion} ${estilos.seccionAlterna}`}>
          <div className="contenedor">
            <header className={estilos.cabecera}>
              <p className={estilos.etiqueta}>Planes</p>
              <h2>Elige el plan para tu negocio</h2>
              <p>Sin complicaciones. Puedes cambiar de plan cuando lo necesites.</p>
            </header>
            <div className={estilos.gridPlanes}>
              {planes.map((p) => (
                <article
                  key={p.id}
                  className={`${estilos.plan} ${p.destacado ? estilos.planDestacado : ""}`}
                >
                  {p.destacado && <span className={estilos.insignia}>Más popular</span>}
                  <h3>{p.nombre}</h3>
                  <p className={estilos.ideal}>{p.ideal}</p>
                  <p className={estilos.precio}>
                    {p.precio}
                    {p.periodo && <span>{p.periodo}</span>}
                  </p>
                  <ul className={estilos.lista}>
                    {p.incluye.map((item) => (
                      <li key={item}>
                        <Icono nombre="check" tamano={18} />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <a
                    href="#contacto"
                    className={`boton ${p.destacado ? "boton-primario" : "boton-secundario"}`}
                  >
                    Quiero el plan {p.nombre}
                  </a>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ── PORTAFOLIO ── */}
        <section id="portafolio" className={estilos.seccion}>
          <div className="contenedor">
            <header className={estilos.cabecera}>
              <p className={estilos.etiqueta}>Portafolio</p>
              <h2>Trabajos que hablan por nosotros</h2>
            </header>
            <div className={estilos.gridPortafolio}>
              {portafolio.map((t) => (
                <article key={t.id} className={estilos.trabajo}>
                  <div className={estilos.imagenTrabajo} aria-hidden="true">
                    <span>{t.servicio}</span>
                  </div>
                  <div className={estilos.textoTrabajo}>
                    <p className={estilos.servicioTrabajo}>{t.servicio}</p>
                    <h3>{t.titulo}</h3>
                    <p>{t.descripcion}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ── CONTACTO ── */}
        <section id="contacto" className={`${estilos.seccion} ${estilos.seccionAlterna}`}>
          <div className={`contenedor ${estilos.contacto}`}>
            <div>
              <p className={estilos.etiqueta}>Contacto</p>
              <h2>¿Listo para crecer?</h2>
              <p>Cuéntanos de tu negocio y te preparamos una propuesta sin costo.</p>
              <a href={`mailto:${negocio.correo}`} className="boton boton-primario">
                Escríbenos
              </a>
            </div>
            <ul className={estilos.datosContacto}>
              <li>
                <Icono nombre="correo" />
                <a href={`mailto:${negocio.correo}`}>{negocio.correo}</a>
              </li>
              <li>
                <Icono nombre="telefono" />
                <a href={`tel:${negocio.telefono.replace(/\D/g, "")}`}>{negocio.telefono}</a>
              </li>
              <li>
                <Icono nombre="ubicacion" />
                <span>{negocio.ciudad}</span>
              </li>
              <li>
                <Icono nombre="reloj" />
                <span>{negocio.horario}</span>
              </li>
            </ul>
          </div>
        </section>
      </main>

      <footer className={estilos.pie}>
        <div className="contenedor">
          <p>
            © {anio} {negocio.nombre} · {negocio.ciudad}
          </p>
        </div>
      </footer>
    </>
  );
}

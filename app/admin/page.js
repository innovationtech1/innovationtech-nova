"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  panelConfigurado,
  sesionActual,
  iniciarSesion,
  cerrarSesion,
  pedirAdmin,
} from "@/lib/sesionAdmin";
import estilos from "./admin.module.css";

const CATEGORIAS = {
  servicio: "Servicio",
  plan: "Plan",
  faq: "Pregunta frecuente",
  portafolio: "Portafolio",
  contacto: "Contacto",
  general: "General",
};

const FICHA_NUEVA = { titulo: "", categoria: "servicio", contenido: "", enlace: "", activo: true };

export default function PanelAdmin() {
  const [sesion, setSesion] = useState(null);
  const [listo, setListo] = useState(false);

  useEffect(() => {
    setSesion(sesionActual());
    setListo(true);
  }, []);

  const salir = useCallback(() => {
    cerrarSesion();
    setSesion(null);
  }, []);

  if (!listo) return null;
  if (!panelConfigurado) {
    return (
      <main className={estilos.centro}>
        <div className={estilos.tarjetaLogin}>
          <h1>Panel no configurado</h1>
          <p className={estilos.suave}>
            Falta la variable <code>NEXT_PUBLIC_FIREBASE_API_KEY</code> en <code>.env.local</code>.
          </p>
        </div>
      </main>
    );
  }
  if (!sesion) return <Login alEntrar={setSesion} />;
  return <Panel email={sesion.email} alSalir={salir} />;
}

/* ───────────── Inicio de sesión ───────────── */

function Login({ alEntrar }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  async function enviar(e) {
    e.preventDefault();
    setError("");
    setCargando(true);
    try {
      alEntrar(await iniciarSesion(email.trim(), password));
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  }

  return (
    <main className={estilos.centro}>
      <form className={estilos.tarjetaLogin} onSubmit={enviar}>
        <p className={estilos.etiqueta}>InnovationTECH</p>
        <h1>Panel de NOVA</h1>
        <p className={estilos.suave}>Solo para el administrador.</p>

        <label className={estilos.campo}>
          Correo
          <input type="email" autoComplete="username" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label className={estilos.campo}>
          Contraseña
          <input
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>

        {error && <p className={estilos.error} role="alert">{error}</p>}
        <button className="boton boton-primario" disabled={cargando}>
          {cargando ? "Entrando…" : "Entrar"}
        </button>
      </form>
    </main>
  );
}

/* ───────────── Panel ───────────── */

function Panel({ email, alSalir }) {
  const [pestana, setPestana] = useState("fichas");

  // Si la sesión vence en cualquier pedido, se vuelve al login
  const pedir = useCallback(
    async (url, opciones) => {
      try {
        return await pedirAdmin(url, opciones);
      } catch (err) {
        if (err.message === "SIN_SESION") alSalir();
        throw err;
      }
    },
    [alSalir]
  );

  return (
    <div className={estilos.panel}>
      <header className={estilos.barra}>
        <div>
          <p className={estilos.etiqueta}>Panel de NOVA</p>
          <p className={estilos.correo}>{email}</p>
        </div>
        <button className="boton boton-secundario" onClick={alSalir}>
          Salir
        </button>
      </header>

      <nav className={estilos.pestanas} aria-label="Secciones del panel">
        <button aria-pressed={pestana === "fichas"} onClick={() => setPestana("fichas")}>
          Fichas
        </button>
        <button aria-pressed={pestana === "probar"} onClick={() => setPestana("probar")}>
          Probar NOVA
        </button>
      </nav>

      <main className={estilos.contenido}>
        {pestana === "fichas" ? <Fichas pedir={pedir} /> : <Probar pedir={pedir} />}
      </main>
    </div>
  );
}

/* ───────────── Fichas ───────────── */

function Fichas({ pedir }) {
  const [fichas, setFichas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [aviso, setAviso] = useState({ tipo: "", texto: "" });
  const [busqueda, setBusqueda] = useState("");
  const [categoria, setCategoria] = useState("");
  const [editando, setEditando] = useState(null); // null | { id?, ...campos }
  const [ocupado, setOcupado] = useState(false);

  const avisar = (tipo, texto) => setAviso({ tipo, texto });

  const cargar = useCallback(async () => {
    setCargando(true);
    try {
      setFichas((await pedir("/api/admin/fichas")).fichas);
    } catch (err) {
      if (err.message !== "SIN_SESION") avisar("error", err.message);
    } finally {
      setCargando(false);
    }
  }, [pedir]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const visibles = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    return fichas.filter(
      (f) =>
        (!categoria || f.categoria === categoria) &&
        (!q || f.titulo.toLowerCase().includes(q) || f.contenido.toLowerCase().includes(q))
    );
  }, [fichas, busqueda, categoria]);

  function reemplazar(ficha) {
    setFichas((lista) => {
      const sin = lista.filter((f) => f.id !== ficha.id);
      return [...sin, ficha].sort(
        (a, b) => a.categoria.localeCompare(b.categoria) || a.titulo.localeCompare(b.titulo, "es")
      );
    });
  }

  async function guardar(e) {
    e.preventDefault();
    setOcupado(true);
    avisar("", "");
    const { id, titulo, categoria: cat, contenido, enlace, activo } = editando;
    try {
      const { ficha } = id
        ? await pedir(`/api/admin/fichas/${id}`, { method: "PATCH", cuerpo: { titulo, categoria: cat, contenido, enlace, activo } })
        : await pedir("/api/admin/fichas", { method: "POST", cuerpo: { titulo, categoria: cat, contenido, enlace, activo } });
      reemplazar(ficha);
      setEditando(null);
      avisar("ok", "Guardado ✓ NOVA ya usa esta información.");
    } catch (err) {
      if (err.message !== "SIN_SESION") avisar("error", err.message);
    } finally {
      setOcupado(false);
    }
  }

  async function cambiarEstado(ficha) {
    setOcupado(true);
    try {
      const { ficha: nueva } = await pedir(`/api/admin/fichas/${ficha.id}`, {
        method: "PATCH",
        cuerpo: { activo: !ficha.activo },
      });
      reemplazar(nueva);
      avisar("ok", nueva.activo ? "Ficha visible para NOVA ✓" : "Ficha oculta: NOVA ya no la usa.");
    } catch (err) {
      if (err.message !== "SIN_SESION") avisar("error", err.message);
    } finally {
      setOcupado(false);
    }
  }

  async function borrar(ficha) {
    if (!window.confirm(`¿Borrar la ficha "${ficha.titulo}"? Esto no se puede deshacer.\n\nSi solo quieres que NOVA deje de usarla, mejor ocúltala.`)) return;
    setOcupado(true);
    try {
      await pedir(`/api/admin/fichas/${ficha.id}`, { method: "DELETE" });
      setFichas((lista) => lista.filter((f) => f.id !== ficha.id));
      avisar("ok", "Ficha borrada.");
    } catch (err) {
      if (err.message !== "SIN_SESION") avisar("error", err.message);
    } finally {
      setOcupado(false);
    }
  }

  if (editando) {
    return (
      <form className={estilos.editor} onSubmit={guardar}>
        <h2>{editando.id ? "Editar ficha" : "Nueva ficha"}</h2>

        <label className={estilos.campo}>
          Título
          <input
            required
            maxLength={150}
            value={editando.titulo}
            onChange={(e) => setEditando({ ...editando, titulo: e.target.value })}
            placeholder="Ej. Plan Profesional: $850/mes"
          />
        </label>

        <label className={estilos.campo}>
          Categoría
          <select value={editando.categoria} onChange={(e) => setEditando({ ...editando, categoria: e.target.value })}>
            {Object.entries(CATEGORIAS).map(([valor, nombre]) => (
              <option key={valor} value={valor}>{nombre}</option>
            ))}
          </select>
        </label>

        <label className={estilos.campo}>
          Contenido
          <textarea
            required
            maxLength={4000}
            rows={10}
            value={editando.contenido}
            onChange={(e) => setEditando({ ...editando, contenido: e.target.value })}
            placeholder="Escribe la información como se la explicarías a un cliente. Un solo tema por ficha."
          />
          <span className={estilos.ayuda}>{editando.contenido.length} / 4000</span>
        </label>

        <label className={estilos.campo}>
          Enlace (opcional)
          <input
            type="url"
            maxLength={500}
            value={editando.enlace}
            onChange={(e) => setEditando({ ...editando, enlace: e.target.value })}
            placeholder="https://..."
          />
        </label>

        <label className={estilos.casilla}>
          <input
            type="checkbox"
            checked={editando.activo}
            onChange={(e) => setEditando({ ...editando, activo: e.target.checked })}
          />
          NOVA puede usar esta ficha
        </label>

        {aviso.tipo === "error" && <p className={estilos.error} role="alert">{aviso.texto}</p>}

        <div className={estilos.acciones}>
          <button className="boton boton-primario" disabled={ocupado}>
            {ocupado ? "Guardando…" : "Guardar"}
          </button>
          <button type="button" className="boton boton-secundario" disabled={ocupado} onClick={() => { setEditando(null); avisar("", ""); }}>
            Cancelar
          </button>
        </div>
      </form>
    );
  }

  return (
    <section>
      <div className={estilos.filtros}>
        <input
          type="search"
          placeholder="Buscar en las fichas…"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          aria-label="Buscar en las fichas"
        />
        <select value={categoria} onChange={(e) => setCategoria(e.target.value)} aria-label="Filtrar por categoría">
          <option value="">Todas las categorías</option>
          {Object.entries(CATEGORIAS).map(([valor, nombre]) => (
            <option key={valor} value={valor}>{nombre}</option>
          ))}
        </select>
        <button className="boton boton-primario" onClick={() => { setEditando({ ...FICHA_NUEVA }); avisar("", ""); }}>
          + Nueva ficha
        </button>
      </div>

      {aviso.texto && (
        <p className={aviso.tipo === "error" ? estilos.error : estilos.exito} role="status">{aviso.texto}</p>
      )}

      {cargando ? (
        <p className={estilos.suave}>Cargando fichas…</p>
      ) : (
        <>
          <p className={estilos.suave}>
            {visibles.length} de {fichas.length} fichas · {fichas.filter((f) => !f.activo).length} ocultas
          </p>
          <ul className={estilos.lista}>
            {visibles.map((f) => (
              <li key={f.id} className={`${estilos.ficha} ${f.activo ? "" : estilos.oculta}`}>
                <div className={estilos.fichaCabecera}>
                  <span className={estilos.chip}>{CATEGORIAS[f.categoria] || f.categoria}</span>
                  {!f.activo && <span className={`${estilos.chip} ${estilos.chipOculta}`}>Oculta</span>}
                </div>
                <h3>{f.titulo}</h3>
                <p className={estilos.extracto}>{f.contenido}</p>
                <div className={estilos.acciones}>
                  <button className={estilos.botonChico} disabled={ocupado} onClick={() => { setEditando({ ...f }); avisar("", ""); }}>
                    Editar
                  </button>
                  <button className={estilos.botonChico} disabled={ocupado} onClick={() => cambiarEstado(f)}>
                    {f.activo ? "Ocultar" : "Mostrar"}
                  </button>
                  <button className={`${estilos.botonChico} ${estilos.peligro}`} disabled={ocupado} onClick={() => borrar(f)}>
                    Borrar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}

/* ───────────── Probar NOVA ───────────── */

function Probar({ pedir }) {
  const [pregunta, setPregunta] = useState("");
  const [resultado, setResultado] = useState(null);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  async function preguntar(e) {
    e.preventDefault();
    setError("");
    setResultado(null);
    setCargando(true);
    try {
      setResultado(await pedir("/api/admin/probar", { method: "POST", cuerpo: { pregunta } }));
    } catch (err) {
      if (err.message !== "SIN_SESION") setError(err.message);
    } finally {
      setCargando(false);
    }
  }

  return (
    <section>
      <form className={estilos.editor} onSubmit={preguntar}>
        <h2>Probar NOVA</h2>
        <p className={estilos.suave}>Haz una pregunta como si fueras un cliente y mira qué fichas usó NOVA para responder.</p>
        <label className={estilos.campo}>
          Pregunta
          <textarea
            rows={3}
            maxLength={1000}
            required
            value={pregunta}
            onChange={(e) => setPregunta(e.target.value)}
            placeholder="Ej. ¿Cuánto cuesta un sitio web?"
          />
        </label>
        <div className={estilos.acciones}>
          <button className="boton boton-primario" disabled={cargando}>
            {cargando ? "NOVA está pensando…" : "Preguntar"}
          </button>
        </div>
      </form>

      {error && <p className={estilos.error} role="alert">{error}</p>}

      {resultado && (
        <div className={estilos.resultado}>
          <p className={estilos.etiqueta}>
            Respondió: {resultado.ia} · Información de: {resultado.fuente === "firestore" ? "Firestore" : "datos/sitio.js (respaldo)"}
          </p>
          <p className={estilos.respuesta}>{resultado.respuesta}</p>

          <h3>Fichas que usó</h3>
          {resultado.fichasUsadas.length ? (
            <ol className={estilos.fichasUsadas}>
              {resultado.fichasUsadas.map((f) => (
                <li key={f.id}>
                  {f.titulo} <span className={estilos.suave}>· parecido {Math.round(f.puntaje * 100)}%</span>
                </li>
              ))}
            </ol>
          ) : (
            <p className={estilos.suave}>Usó toda la información de datos/sitio.js (Firestore no respondió).</p>
          )}
        </div>
      )}
    </section>
  );
}

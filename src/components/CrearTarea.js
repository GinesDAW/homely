import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
// MODIFICADO:  import de Estilos de crear tarea
import "./CrearTarea.css";

//Este componente gestiona la creación de tareas


//Recibe los datos del usuario y una función que actualiza la lista de tareas
function CrearTarea({ usuario, actualizarListaTareas }) {
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [fechaLimite, setFechaLimite] = useState("");
  const [usuarios, setUsuarios] = useState([]);
  const [asignado, setAsignado] = useState("");
  const [tipos, setTipos] = useState([]);
  const [tipo, setTipo] = useState("");
  const [urgencia, setUrgencia] = useState("media"); // Valor por defecto
  const urgencias = ["alta", "media", "baja"]; // Urgencias definidas a mano

  // MODIFICADO:  anadida Función para obtener icono según urgencia
  const obtenerIconoUrgencia = (u) => {
    const iconos = { alta: "🔴", media: "🟡", baja: "🟢" };
    return iconos[u] || "⚪";
  };

  /*
  * UseEffect se encarga de cargar usuario y tipos de tareas de supabase
   */
  useEffect(() => {
    const cargarDatos = async () => {
      const { data: usuariosData } = await supabase.from("usuarios").select("*");
      setUsuarios(usuariosData || []);

      const { data: tiposData } = await supabase.from("tipos_tarea").select("*");
      setTipos(tiposData || []);
    };

    cargarDatos();
  }, []);

  //Función que se ejecuta al mandar el formulario
  const crearTarea = async (e) => {
    //Evita que se recargue la página
    e.preventDefault();

    if (!tipo || !urgencia) {
      alert("Debes seleccionar tipo y urgencia");
      return;
    }
//Inserción de los datos en la BBDD
    const { error } = await supabase
      .from("tareas")
      .insert([
        {
          titulo,
          descripcion,
          fecha_limite: fechaLimite || null,
          id_creador: usuario.id_usuario,
          id_asignado: asignado || null,
          id_tipo: tipo,
          urgencia,        // string
          estado: "pendiente",
        },
      ]);

    if (error) {
      alert("Error al crear tarea: " + error.message);
      return;
    }

    // MODIFICACION ANADIDA: Mostrar mensaje de éxito al usuario AL CREAR UNA NUEVA TAREA
    alert("✓ Tarea creada exitosamente");

    // Limpiamos el formulario
    setTitulo("");
    setDescripcion("");
    setFechaLimite("");
    setTipo("");
    setAsignado("");
    setUrgencia("media");

    // Actualiza la lista de tareas sin recargar página
    if (actualizarListaTareas) actualizarListaTareas();
  };


  // MODIFICADO:  Se han añadido las labels de titulo y descripcion de la tarea  
  // y se muestran un icono junto a la opción de urgencia y las clases de estilos
  
  return (
    //Formulario para la creación de la tarea
    <form onSubmit={crearTarea} className="crear-tarea-form">
      <h3>Crear tarea</h3>

      <div className="form-group">
        <label>Título:</label>
        <input
          className="input-field"
          placeholder="Título"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label>Tipo de tarea:</label>
        <select
          className="select-field"
          value={tipo}
          onChange={(e) => setTipo(e.target.value)}
          required
          disabled={tipos.length === 0}
        >
          <option value="">Selecciona tipo de tarea</option>
          {tipos.map((t) => (
            <option key={t.id_tipo} value={t.id_tipo}>
              {t.nombre_tipo} ({t.puntos_tipo} pts)
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Descripción:</label>
        <textarea
          className="textarea-field"
          placeholder="Descripción"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          required
        />
      </div>

      <div className="form-row">
        <div className="form-col">
          <label>Urgencia:</label>
          <select
            className="select-field"
            value={urgencia}
            onChange={(e) => setUrgencia(e.target.value)}
          >
            {urgencias.map((u) => (
              <option key={u} value={u}>
                {obtenerIconoUrgencia(u)} {u.charAt(0).toUpperCase() + u.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div className="form-col">
          <label>Fecha límite:</label>
          <input
            className="input-field"
            type="date"
            value={fechaLimite}
            onChange={(e) => setFechaLimite(e.target.value)}
          />
        </div>
      </div>

      {/* Solo los usuarios admin pueden asignar tareas a otros usuarios*/}
      {usuario.rol === "admin" && (
        <div className="form-group">
          <label>Asignar a:</label>
          <select className="select-field" value={asignado} onChange={(e) => setAsignado(e.target.value)}>
            <option value="">No asignar</option>
            {usuarios.map((u) => (
              <option key={u.id_usuario} value={u.id_usuario}>
                {u.nombre_usuario}
              </option>
            ))}
          </select>
        </div>
      )}

      <button type="submit" className="btn-primary">Crear</button>
    </form>
  );
}

export default CrearTarea;


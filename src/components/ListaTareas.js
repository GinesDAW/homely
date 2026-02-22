import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
// MODIFICADO: import de estilos de lista de tareas
import "./ListaTareas.css";
/*
* Componente para mostrar y gestionar la lista de tareas
* Recibe los datos del usuario y una fnción para actualizarlos 
*/
function ListaTareas({ usuario, setUsuario }) {
  const [tareas, setTareas] = useState([]);
  // MODIFICADO: Agregado estado para filtro de tareas - permite filtrar por pendiente, en curso, finalizada o todas
  const [filtroTareas, setFiltroTareas] = useState("todas");

//Carga las tareas desde supabase
  const cargarTareas = async () => {
    const { data, error } = await supabase
      .from("tareas")
      .select("*")
      .or(`id_asignado.eq.${usuario.id_usuario},id_asignado.is.null`);

    if (error) {
      console.error("Error al cargar tareas:", error.message);
    } else {
      setTareas(data || []);
    }
  };
 //Se ejecuta al cambiar el usuario
  useEffect(() => {
    cargarTareas();
  }, [usuario]);
 //El usuario puede asignarse tareas
  const asignarmeTarea = async (tarea) => {
    const { error } = await supabase
      .from("tareas")
      .update({ id_asignado: usuario.id_usuario, estado: "pendiente" })
      .eq("id_tarea", tarea.id_tarea);

    //Se actualiza si no hay error
    if (!error) {
      setTareas((prev) =>
        prev.map((t) =>
          t.id_tarea === tarea.id_tarea
            ? { ...t, id_asignado: usuario.id_usuario, estado: "pendiente" }
            : t
        )
      );
    }
  };
//Cambia el estado de "pendiente" a "en curso"
  const empezarTarea = async (tarea) => {
    const { error } = await supabase
      .from("tareas")
      .update({ estado: "en curso" })
      .eq("id_tarea", tarea.id_tarea);

    if (!error) {
      setTareas((prev) =>
        prev.map((t) =>
          t.id_tarea === tarea.id_tarea ? { ...t, estado: "en curso" } : t
        )
      );
    }
  };
//Marca la tarea como finalizada y actualiza los puntos
  const completarTarea = async (tarea) => {
    const { data: tipo, error: tipoError } = await supabase
      .from("tipos_tarea")
      .select("puntos_tipo")
      .eq("id_tipo", tarea.id_tipo)
      .single();

    if (tipoError) {
      console.error(tipoError);
      return;
    }

    const { error } = await supabase
      .from("tareas")
      .update({ estado: "finalizada" })
      .eq("id_tarea", tarea.id_tarea);

    if (!error) {
      setTareas((prev) =>
        prev.map((t) =>
          t.id_tarea === tarea.id_tarea ? { ...t, estado: "finalizada" } : t
        )
      );
      //Calculamos los puntos y los actualizamos
      const nuevosPuntos = usuario.puntos + (tipo?.puntos_tipo || 0);
      await supabase
        .from("usuarios")
        .update({ puntos: nuevosPuntos })
        .eq("id_usuario", usuario.id_usuario);
      //Actualizamos los datos del usuario
      setUsuario({ ...usuario, puntos: nuevosPuntos });
    }
  };
//Tareas asignadas
  // MODIFICADO: se anade el ordenamiento por estado - 1 Pendiente--2 En curso--3 Finalizada
  const misTareas = tareas
    .filter((t) => t.id_asignado === usuario.id_usuario)
    .sort((a, b) => {
      const orden = { pendiente: 1, "en curso": 2, finalizada: 3 };
      return orden[a.estado] - orden[b.estado];
    });

  // MODIFICADO: Agregada funcion para filtrar tareas segun estado seleccionado
  const tareasFiltradas = () => {
    if (filtroTareas === "todas") return misTareas;
    return misTareas.filter((t) => t.estado === filtroTareas);
  };
//Tareas sin asignar
  const tareasSinAsignar = tareas.filter((t) => t.id_asignado === null);

  // MODIFICADO: Se agregan las  clases CSS , además de 2 funciones para mostrar iconos de urgencia y colores de fondo según el estado y urgencia de la tarea
  return (
    <div className="lista-tareas-container">
      {/* Tareas del usuario */}
      <section className="tareas-section">
        <h3>Mis tareas</h3>
        
        <div className="puntos-card">
          <h3>Puntos actuales</h3>
          <p className="puntos-numero">{usuario.puntos}</p>
          <p className="puntos-subtexto">¡Sigue completando tareas para ganar más!</p>
        </div>

        {/* MODIFICADO: Agregados botones de filtro debajo de tarjeta de puntos con colores representativos */}
        <div className="filtros-tareas">
          <button
            onClick={() => setFiltroTareas("todas")}
            className={`filtro-btn filtro-btn--todas ${filtroTareas === "todas" ? "activo" : ""}`}
          >
            Todas
          </button>
          <button
            onClick={() => setFiltroTareas("pendiente")}
            className={`filtro-btn filtro-btn--pendiente ${filtroTareas === "pendiente" ? "activo" : ""}`}
          >
            Pendientes
          </button>
          <button
            onClick={() => setFiltroTareas("en curso")}
            className={`filtro-btn filtro-btn--encurso ${filtroTareas === "en curso" ? "activo" : ""}`}
          >
            En curso
          </button>
          <button
            onClick={() => setFiltroTareas("finalizada")}
            className={`filtro-btn filtro-btn--finalizada ${filtroTareas === "finalizada" ? "activo" : ""}`}
          >
            Completadas
          </button>
        </div>

        {tareasFiltradas().length === 0 ? (
          <p className="tareas-vacio">No tienes tareas {filtroTareas !== "todas" ? `${filtroTareas}` : "asignadas"}</p>
        ) : (
          <ul className="tareas-lista">
            {tareasFiltradas().map((t) => {
              // MODIFICADO: Creada función para obtener icono según urgencia
              const obtenerIconoUrgencia = (urgencia) => {
                const iconos = { alta: "🔴", media: "🟡", baja: "🟢" };
                return iconos[urgencia] || "⚪";
              };

              return (
              <li key={t.id_tarea} className={`tarea-item estado-${t.estado.replace(/\s+/g, '-')} tarea-item--urgencia-${t.urgencia}`}>
                {/* Sección izquierda: Información */}
                <div className="tarea-izquierda">
                  <p className="tarea-titulo">{t.titulo}</p>
                  <div className="tarea-meta">
                    <span className="tarea-urgencia">
                      {obtenerIconoUrgencia(t.urgencia)} {t.urgencia.charAt(0).toUpperCase() + t.urgencia.slice(1)}
                    </span>
                    <span className={`tarea-estado estado-${t.estado.replace(/\s+/g, '-')}`}>{t.estado}</span>
                    {t.fecha_limite && (
                      <span className="tarea-fecha">
                        📅 {new Date(t.fecha_limite).toLocaleDateString('es-ES')}
                      </span>
                    )}
                  </div>
                </div>

                {/* Sección derecha: Acciones */}
                <div className="tarea-derecha">
                  {t.estado === "pendiente" && (
                    <button className="btn-empezar" onClick={() => empezarTarea(t)}>Empezar</button>
                  )}
                  {t.estado === "en curso" && (
                    <button className="btn-completar" onClick={() => completarTarea(t)}>Completar</button>
                  )}
                </div>
              </li>
            );
            })}
          </ul>
        )}
      </section>

      {/* Tareas disponibles */}
      <section className="tareas-section">
        <h3>Tareas sin asignar</h3>
        {tareasSinAsignar.length === 0 ? (
          <p className="tareas-vacio">No hay tareas disponibles</p>
        ) : (
          <ul className="tareas-lista">
            {tareasSinAsignar.map((t) => (
              <li key={t.id_tarea} className="tarea-item estado-sin-asignar">
                <p className="tarea-titulo">{t.titulo}</p>
                <button className="btn-asignar" onClick={() => asignarmeTarea(t)}>Asignármela</button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

export default ListaTareas;

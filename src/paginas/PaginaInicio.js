import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
// MODIFICADO: Agregado import de estilos CSS para nueva apariencia visual
import "./PaginaInicio.css";
/*
*Página principal con resumen de tareas
*/
function PaginaInicio({ usuario }) {
  const [tareas, setTareas] = useState([]);
  // MODIFICADO: Agregado navigate para ir a la página de tareas al clickar notificación
  const navigate = useNavigate();

//Carga las tareas del usuario o sin asignar
  useEffect(() => {
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

    cargarTareas();
  }, [usuario]);
//Dividimos las tareas en función de su estado
  const pendientes = tareas.filter(
    (t) => t.id_asignado === usuario.id_usuario && t.estado === "pendiente"
  );
  const enCurso = tareas.filter(
    (t) => t.id_asignado === usuario.id_usuario && t.estado === "en curso"
  );
  const finalizadas = tareas.filter(
    (t) => t.id_asignado === usuario.id_usuario && t.estado === "finalizada"
  );
//Apartado para las tareas de mayor urgencia
  const urgentes = pendientes
    .filter((t) => t.urgencia === "alta")
// MODIFICADO:  se anade filtro de tareas sin asignar y se ordenaa por fecha límite más cercana primero
  const sinAsignar = tareas.filter(
    (t) => t.id_asignado === null
  )
// MODIFICADO: se anaden estilos y las siguientes modificasciones:
  return (
    <div className="pagina-inicio">
      {/* MODIFICADO: Header con saludo mejorado */}
      <div className="inicio-header">
        <h2>Bienvenido, {usuario.nombre_usuario} ({usuario.rol})</h2>
        <p className="saludo-usuario">Te damos la bienvenida a tu hogar</p>
      </div>

      {/* MODIFICADO: se anade notificación de tareas pendientes - posicionado al inicio y clickable por teclado y raston  para ir a tareas */}
      {pendientes.length > 0 && (
        <div 
          className="recordatorio recordatorio--clickeable"
          onClick={() => navigate("/tareas", { state: { tab: "listar" } })}
          role="button"
          tabIndex="0"
          onKeyDown={(e) => e.key === "Enter" && navigate("/tareas", { state: { tab: "listar" } })}
        >
           Tienes {pendientes.length} tarea{pendientes.length !== 1 ? "s" : ""} pendiente{pendientes.length !== 1 ? "s" : ""} por completar.
        </div>
      )}

      {/* MODIFICADO: Contenedor que agrupa puntos y stats */}
      <div className="puntos-stats-container">
        {/* MODIFICADO: Card destacada de puntos */}
        <div className="puntos-card">
          <h3>Puntos actuales</h3>
          <p className="puntos-numero">{usuario.puntos}</p>
          <p className="puntos-subtexto">¡Sigue completando tareas para ganar más!</p>
        </div>
      </div>

      {/* MODIFICADO: Sección de tareas urgentes con cards mejoradas y clickables poraton y teclasdo */}
      {urgentes.length > 0 && (
        <section className="urgentes-section">
          <h3>⚡ Tareas Urgentes</h3>
          <ul className="urgentes-list">
            {urgentes.map((t) => (
              <li 
                key={t.id_tarea} 
                className="tarea-urgente-item tarea-urgente-item--clickeable"
                onClick={() => navigate("/tareas", { state: { tab: "listar" } })}
                role="button"
                tabIndex="0"
                onKeyDown={(e) => e.key === "Enter" && navigate("/tareas", { state: { tab: "listar" } })}
              >
                <span className="tarea-urgente-icon">🔴</span>
                <div className="tarea-urgente-contenido">
                  <p className="tarea-urgente-titulo">{t.titulo}</p>
                  <p className="tarea-urgente-fecha">
                    📅 {t.fecha_limite ? new Date(t.fecha_limite).toLocaleDateString() : "Sin fecha límite"}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* MODIFICADO: Mensaje de no hay urgentes */}
      {urgentes.length === 0 && (
        <div className="urgentes-vacio">
           ¡Perfecto! No tienes tareas urgentes
        </div>
      )}

      {/* MODIFICADO: Sección de resumen en cards */}
      <section className="resumen-section">
        <h3>Resumen de tareas</h3>
        <ul className="resumen-lista">
          <li className="resumen-item resumen-pendientes">
            <p className="resumen-label">Pendientes</p>
            <p className="resumen-numero">{pendientes.length}</p>
          </li>

          <li className="resumen-item resumen-sin-asignar">
            <p className="resumen-label">Sin Asignar</p>
            <p className="resumen-numero">{sinAsignar.length}</p>
          </li>

          <li className="resumen-item resumen-en-curso">
            <p className="resumen-label">En Curso</p>
            <p className="resumen-numero">{enCurso.length}</p>
          </li>
          
          <li className="resumen-item resumen-finalizadas">
            <p className="resumen-label">Finalizadas</p>
            <p className="resumen-numero">{finalizadas.length}</p>
          </li>

          
        </ul>
      </section>
    </div>
  );
}

export default PaginaInicio;
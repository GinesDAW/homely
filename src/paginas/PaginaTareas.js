import { useState } from "react";
import { useLocation } from "react-router-dom";
import CrearTarea from "../components/CrearTarea";
import ListaTareas from "../components/ListaTareas";
import "./PaginaTareas.css";

/*
* Página para la gestión de tareas
*/
function PaginaTareas({ usuario, setUsuario }) {
  // MODIFICADO: useLocation para detectar si viene de notificación y mostrar tab "listar"
  const location = useLocation();
  const [tab, setTab] = useState(location.state?.tab || "crear"); // Pestaña por defecto

  // MODIFICADO: se anade la  logica para mostrar pestaña "listar" si se viene de  haber clickado notificación
  return (
    <div>
      {/* Pestañas internas */}
      <nav className="tareas-tabs">
        <button
          className={`tab-button ${tab === "crear" ? "active" : ""}`}
          onClick={() => setTab("crear")}
        >
          Crear Tarea
        </button>
        <button
          className={`tab-button ${tab === "listar" ? "active" : ""}`}
          onClick={() => setTab("listar")}
        >
          Mis Tareas
        </button>
      </nav>

      {/* Contenido de cada pestaña */}
      {tab === "crear" && <CrearTarea usuario={usuario} />}
      {tab === "listar" && <ListaTareas usuario={usuario} setUsuario={setUsuario}/>}
    </div>
  );
}

export default PaginaTareas;
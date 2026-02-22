import { NavLink } from "react-router-dom";
import logo from "../assets/logohorizontal.svg";
// MODIFICADO: import de Estilos del menú y se anade clase CSS para el logo y los enlaces de navegación
import "./Menu.css";

/*
* Menu de navegación usando NavLink
*/
function Menu() {
  return (
    <nav className="nav-menu">
      <img src={logo} alt="Homely Logo" className="nav-logo" />
      <NavLink to="/inicio" className="nav-link">Inicio</NavLink>
      <NavLink to="/tareas" className="nav-link">Tareas</NavLink>
      <NavLink to="/recompensas" className="nav-link">Recompensas</NavLink>
    </nav>
  );
}

export default Menu;
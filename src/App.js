import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Importados  estilos globales y componentes reutilizables
// MODIFICADO: Agregado import "./App.css" para nuevos estilos de layout
import "./App.css";
import "./styles/components.css";

import Login from "./components/Login";
import CrearUsuario from "./components/CrearUsuario";
import Menu from "./components/Menu";
import PaginaInicio from "./paginas/PaginaInicio";
import PaginaTareas from "./paginas/PaginaTareas";
import PaginaRecompensas from "./paginas/PaginaRecompensas";
import logo from "./assets/logo.svg";

function App() {
  const [usuario, setUsuario] = useState(null);

  //Al cargar comprueba si hay un usuario logeado
  useEffect(() => {
    const usuarioGuardado = localStorage.getItem("usuario");
    if (usuarioGuardado) {
      setUsuario(JSON.parse(usuarioGuardado));
    }
  }, []);

  //Maneja el login del usuario con localStorage
  const manejarLogin = (datosUsuario) => {
    localStorage.setItem("usuario", JSON.stringify(datosUsuario));
    setUsuario(datosUsuario);
  };

  //Cierre de sesión eliminando el usuario guardado
  const cerrarSesion = () => {
    localStorage.removeItem("usuario");
    setUsuario(null);
  };
  // Si no hay usuario logeado, pantalla de inicio de sesión
  // MODIFICADO: Cambió de layout inline style a estructura centrada con clases CSS
  if (!usuario) {
    return (
      <div className="App">
        {/* MODIFICADO: Nuevo layout login-page centrado (ver App.css) */}
        <div className="login-page">
          {/* MODIFICADO: Logo aumentado de tamaño, palabra "Homely" removida */}
          <img src={logo} alt="Homely" className="logo-login" />
          {/* MODIFICADO: Grid 2 columnas para Login y CrearUsuario lado a lado */}
          <div className="login-forms-container">
            <div className="login-form-wrapper">
              <Login onLogin={manejarLogin} />
            </div>
            <div className="login-form-wrapper">
              <CrearUsuario />
            </div>
          </div>
        </div>
      </div>
    );
  }
  //Si hay usuario conectado damos paso a la app
  
  // MODIFICADO: Cambió de inline styles a estructura con clases CSS
  return (
    <BrowserRouter>
      <div className="App">
        {/* MODIFICADO: app-wrapper es el contenedor principal centrado (max-width: 1200px) */}
        <div className="app-wrapper">
          
          {/* MODIFICADO: Navbar integrado con navegación y botón logout */}
          <nav className="app-navbar">
            <div className="navbar-left">
              <Menu />
            </div>
            <div className="navbar-right">
              {/* MODIFICADO: Botón cerrar sesión ahora con clases CSS (btn btn-primary) */}
              <button onClick={cerrarSesion} className="btn btn-primary">
                Cerrar sesión
              </button>
            </div>
          </nav>

          {/* MODIFICADO: Contenido principal en estructura app-content */}
          <main className="app-content">
            <Routes>
              <Route path="/" element={<PaginaInicio usuario={usuario} />} />
              <Route path="/inicio" element={<PaginaInicio usuario={usuario} />} />
              <Route path="/tareas/*" element={<PaginaTareas usuario={usuario} setUsuario={setUsuario} />} />
              <Route
                path="/recompensas"
                element={
                  <PaginaRecompensas
                    usuario={usuario}
                    setUsuario={setUsuario}
                  />
                }
              />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;

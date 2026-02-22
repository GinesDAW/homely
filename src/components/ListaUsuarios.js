import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
// MODIFICADO: import de estilos de lista de usuarios
import "./ListaUsuarios.css";

function ListaUsuarios() {
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    const cargarUsuarios = async () => {
      const { data } = await supabase.from("usuarios").select("*");
      setUsuarios(data || []);
    };

    cargarUsuarios();
  }, []);

  // MODIFICADO: estructura de la lista de usuarios con estilos
  return (
    <div className="lista-usuarios-container">
      <h3>Usuarios</h3>
      {usuarios.length === 0 ? (
        <p className="usuarios-vacio">No hay usuarios</p>
      ) : (
        <ul className="usuarios-lista">
          {usuarios.map((u) => (
            <li key={u.id_usuario} className="usuario-item">
              <span className="usuario-nombre">{u.nombre_usuario}</span>
              <span className="usuario-rol">{u.rol}</span>
              <span className="usuario-puntos">{u.puntos} pts</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ListaUsuarios;

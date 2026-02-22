import { useState } from "react";
import { supabase } from "../supabaseClient";
// MODIFICADO: import de estilos de crear usuario
import "./CrearUsuario.css";

function CrearUsuario({ onUsuarioCreado }) {
  const [nombreUsuario, setNombreUsuario] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rol, setRol] = useState("miembro");
  const [error, setError] = useState(null);

  const crearUsuario = async (e) => {
    e.preventDefault();

    const { error } = await supabase.from("usuarios").insert([
      {
        nombre_usuario: nombreUsuario,
        email: email,
        password_hash: password,
        rol: rol,
      },
    ]);

    if (error) {
      setError("Error creando usuario");
    } else {
      setNombreUsuario("");
      setEmail("");
      setPassword("");
      setRol("miembro");
      setError(null);
      if (onUsuarioCreado) onUsuarioCreado();
    }
  };

  // MODIFICADO: estructura del formulario y clases CSS para estilos.
  return (
    <div className="crear-usuario-container">
      <form onSubmit={crearUsuario} className="crear-usuario-form">
        <h3>Crear usuario</h3>
        {error && <p className="error-message">{error}</p>}

        <input
          className="input-field"
          placeholder="Nombre de usuario"
          value={nombreUsuario}
          onChange={(e) => setNombreUsuario(e.target.value)}
          required
        />

        <input
          className="input-field"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="input-field"
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <select className="select-field" value={rol} onChange={(e) => setRol(e.target.value)}>
          <option value="miembro">Miembro</option>
          <option value="admin">Administrador</option>
        </select>

        <button type="submit" className="btn-primary">Crear usuario</button>
      </form>
    </div>
  );
}

export default CrearUsuario;

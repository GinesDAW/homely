import { useState } from "react";
import { supabase } from "../supabaseClient";
// MODIFICADO: import de estilos del login
import "./Login.css";

function Login({ onLogin }) {
  const [nombreUsuario, setNombreUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const iniciarSesion = async (e) => {
    e.preventDefault();

    const { data, error } = await supabase
      .from("usuarios")
      .select("*")
      .eq("nombre_usuario", nombreUsuario)
      .eq("password_hash", password)
      .single();

    if (error || !data) {
      setError("Credenciales incorrectas");
    } else {
      onLogin(data);
    }
  };
// MODIFICADO: estructura del formulario de login con estilos
  return (
    <div className="login-container">
      <form onSubmit={iniciarSesion} className="login-form">
        <h3>Login</h3>
        {error && <p className="error-message">{error}</p>}

        <input
          className="input-field"
          placeholder="Usuario"
          value={nombreUsuario}
          onChange={(e) => setNombreUsuario(e.target.value)}
          required
        />

        <input
          className="input-field"
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" className="btn-primary">Entrar</button>
      </form>
    </div>
  );
}

export default Login;

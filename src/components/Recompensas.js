import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
// MODIFICADO: import de estilos de recompensas
import "./Recompensas.css";

function Recompensas({ usuario, setUsuario }) {
  const [recompensas, setRecompensas] = useState([]);

  useEffect(() => {
    const cargarRecompensas = async () => {
      const { data, error } = await supabase
        .from("recompensas")
        .select("*");

      if (error) {
        console.error("Error cargando recompensas:", error);
      } else {
        setRecompensas(data || []);
      }
    };

    cargarRecompensas();
  }, []);

  const canjear = async (recompensa) => {
    if (usuario.puntos < recompensa.puntos_requeridos) {
      alert("No tienes suficientes puntos");
      return;
    }

    // Restar puntos al usuario
    await supabase
      .from("usuarios")
      .update({
        puntos: usuario.puntos - recompensa.puntos_requeridos,
      })
      .eq("id_usuario", usuario.id_usuario);

    // Recargar usuario
    const { data: usuarioActualizado } = await supabase
      .from("usuarios")
      .select("*")
      .eq("id_usuario", usuario.id_usuario)
      .single();

    setUsuario(usuarioActualizado);

    alert(`¡Recompensa "${recompensa.nombre}" canjeada con éxito!\nTe quedan ${usuarioActualizado.puntos} puntos.`);
  };
  // MODIFICADO: estructura y estilos de recompensas
  return (
    <div className="recompensas-container">
      <section className="recompensas-section">
       <h3>Recompensas</h3> 
        <div className="puntos-card">
          <h3>Puntos actuales</h3>
          <p className="puntos-numero">{usuario.puntos}</p>
          <p className="puntos-subtexto">¡Canjea tus puntos por recompensas!</p>
        </div>

        {recompensas.length === 0 ? (
          <p className="recompensas-vacio">No hay recompensas disponibles</p>
        ) : (
          <ul className="recompensas-lista">
            {recompensas.map((r) => (
              <li 
                key={r.id_recompensa} 
                className={`recompensa-item ${usuario.puntos >= r.puntos_requeridos ? "canjeables" : ""}`}
              >
                <div className="recompensa-info">
                  <strong className="recompensa-nombre">{r.nombre}</strong>
                  {r.descripcion && <p className="recompensa-descripcion">{r.descripcion}</p>}
                </div>
                <div className="recompensa-footer">
                  <span className="recompensa-puntos">{r.puntos_requeridos} pts</span>
                  <button 
                    className="btn-canjear" 
                    onClick={() => canjear(r)}
                    disabled={usuario.puntos < r.puntos_requeridos}
                  >
                    Canjear
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

export default Recompensas;


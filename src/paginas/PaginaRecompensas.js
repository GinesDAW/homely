import Recompensas from "../components/Recompensas";

function PaginaRecompensas({ usuario, setUsuario }) {
  return (
    <div>
      <Recompensas usuario={usuario} setUsuario={setUsuario} />
    </div>
  );
}

export default PaginaRecompensas;

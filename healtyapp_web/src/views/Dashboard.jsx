import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div>
      <h2>Panel Principal</h2>
      <p>Bienvenido al sistema web de HealtyApp.</p>
      <button onClick={() => navigate("/pacientes")}>Ir a Pacientes</button>
    </div>
  );
}

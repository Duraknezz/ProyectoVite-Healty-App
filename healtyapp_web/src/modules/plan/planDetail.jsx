import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchPlanById } from "./plan.api";

export default function PlanDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);

  async function cargar() {
    try {
      const data = await fetchPlanById(id);
      setPlan(data);
    } catch (e) {
      console.error("Error cargando plan:", e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    cargar();
  }, []);

  if (loading) return <div className="loading">Cargando...</div>;
  if (!plan) return <div className="error">No se encontró el plan.</div>;

  return (
    <div className="contenedor" style={{ maxWidth: "600px" }}>
      <h2 className="titulo">Detalle del Plan Alimenticio</h2>

      <div className="tarjeta-detalle">
        <h3>{plan.pacienteNombre} {plan.pacienteApellido}</h3>

        <p><strong>Fecha:</strong> {plan.fecha}</p>
        <p><strong>Hora:</strong> {plan.hora}</p>
        <p><strong>Motivo:</strong> {plan.motivo}</p>

        <p><strong>Calorías:</strong> {plan.calorias ?? "-"}</p>
        <p><strong>Proteína (g):</strong> {plan.proteina_g ?? "-"}</p>
        <p><strong>Carbohidratos (g):</strong> {plan.carbohidratos_g ?? "-"}</p>
        <p><strong>Grasas (g):</strong> {plan.grasas_g ?? "-"}</p>

        <p><strong>Verduras:</strong> {plan.verduras}</p>
        <p><strong>Frutas:</strong> {plan.frutas}</p>

        <p>
          <strong>Recomendaciones:</strong><br />
          {plan.recomendaciones || "Sin recomendaciones"}
        </p>
      </div>

      <button className="btn editar" onClick={() => navigate(`/plan/${id}/editar`)}>
        Editar
      </button>

      <button className="btn cancelar" onClick={() => navigate("/plan")}>
        Volver
      </button>
    </div>
  );
}

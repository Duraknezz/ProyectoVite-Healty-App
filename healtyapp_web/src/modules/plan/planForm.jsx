import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { createPlan, fetchPlanById, updatePlan } from "./plan.api";
import { fetchCitas } from "../citas/citas.api";

export default function PlanForm() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const citaQuery = searchParams.get("cita") || "";
  const navigate = useNavigate();
  const esEdicion = Boolean(id);

  const [citas, setCitas] = useState([]);

  const [form, setForm] = useState({
    cita: "",
    fecha: "",
    hora: "",
    motivo: "",
    calorias: "",
    proteina_g: "",
    carbohidratos_g: "",
    grasas_g: "",
    verduras: "",
    frutas: "",
    recomendaciones: "",
  });

  const [loading, setLoading] = useState(false);
  const [cargandoInicial, setCargandoInicial] = useState(false);
  const [error, setError] = useState("");

  async function cargarCitas() {
    try {
      const data = await fetchCitas({ page: 1 });
      setCitas(data.resultados);
    } catch (e) {
      console.error("Error cargando citas:", e);
    }
  }

  async function cargarPlan() {
    if (!esEdicion) return;

    try {
      setCargandoInicial(true);
      const data = await fetchPlanById(id);

      setForm({
        cita: data.citaId,
        fecha: data.fecha ?? "",
        hora: data.hora ?? "",
        motivo: data.motivo ?? "",
        calorias: data.calorias ?? "",
        proteina_g: data.proteina_g ?? "",
        carbohidratos_g: data.carbohidratos_g ?? "",
        grasas_g: data.grasas_g ?? "",
        verduras: data.verduras ?? "",
        frutas: data.frutas ?? "",
        recomendaciones: data.recomendaciones ?? "",
      });
    } catch (e) {
      console.error("Error cargando plan:", e);
      setError("No se pudo cargar el plan.");
    } finally {
      setCargandoInicial(false);
    }
  }

  useEffect(() => {
    cargarCitas();
    cargarPlan();

    if (!esEdicion && citaQuery) {
      setForm((f) => ({ ...f, cita: Number(citaQuery) }));
    }
  }, [id]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!form.cita) {
      setError("Debe seleccionar una cita válida.");
      setLoading(false);
      return;
    }

    const payload = {
      cita: Number(form.cita),
      fecha: form.fecha,
      hora: form.hora || null,
      motivo: form.motivo,
      calorias: form.calorias ? Number(form.calorias) : null,
      proteina_g: form.proteina_g ? Number(form.proteina_g) : null,
      carbohidratos_g: form.carbohidratos_g ? Number(form.carbohidratos_g) : null,
      grasas_g: form.grasas_g ? Number(form.grasas_g) : null,
      verduras: form.verduras,
      frutas: form.frutas,
      recomendaciones: form.recomendaciones,
    };

    try {
      if (esEdicion) await updatePlan(id, payload);
      else await createPlan(payload);

      navigate("/plan");
    } catch (e) {
      console.error("Error guardando plan:", e);
      setError("Ocurrió un error al guardar.");
    } finally {
      setLoading(false);
    }
  }

  if (cargandoInicial) return <div className="loading">Cargando...</div>;

    return (
  <div className="form-contenedor" style={{ maxWidth: "650px", margin: "2rem auto" }}>
    <div
      style={{
        background: "white",
        padding: "2rem",
        borderRadius: "12px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
      }}
    >
      <h2
        style={{
          marginBottom: "1.5rem",
          fontSize: "1.6rem",
          textAlign: "center",
          color: "#333",
        }}
      >
        {esEdicion ? "Editar Plan Alimenticio" : "Nuevo Plan Alimenticio"}
      </h2>

      {error && (
        <div className="error" style={{ marginBottom: "1rem", textAlign: "center" }}>
          {error}
        </div>
      )}

      <form className="formulario" onSubmit={handleSubmit}>

        {/* CITA */}
        <div style={{ marginBottom: "1rem" }}>
          <label style={{ fontWeight: "600" }}>Cita</label>
          <select
            name="cita"
            value={form.cita}
            onChange={handleChange}
            required
            style={{
              width: "100%",
              padding: "8px",
              marginTop: "4px",
              borderRadius: "6px",
              border: "1px solid #ccc",
            }}
          >
            <option value="">Selecciona una cita</option>
            {citas.map((c) => (
              <option key={c.id} value={c.id}>
                {c.pacienteNombre} {c.pacienteApellido} — {c.fecha} {c.hora}
              </option>
            ))}
          </select>
        </div>

        {/* FECHA + HORA */}
        <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
          <div style={{ flex: 1 }}>
            <label style={{ fontWeight: "600" }}>Fecha</label>
            <input
              type="date"
              name="fecha"
              value={form.fecha}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "8px",
                marginTop: "4px",
                borderRadius: "6px",
                border: "1px solid #ccc",
              }}
            />
          </div>

          <div style={{ flex: 1 }}>
            <label style={{ fontWeight: "600" }}>Hora</label>
            <input
              type="time"
              name="hora"
              value={form.hora}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "8px",
                marginTop: "4px",
                borderRadius: "6px",
                border: "1px solid #ccc",
              }}
            />
          </div>
        </div>

        {/* MOTIVO */}
        <div style={{ marginBottom: "1rem" }}>
          <label style={{ fontWeight: "600" }}>Motivo</label>
          <input
            name="motivo"
            value={form.motivo}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "8px",
              marginTop: "4px",
              borderRadius: "6px",
              border: "1px solid #ccc",
            }}
          />
        </div>

        {/* NUTRIENTES */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: "1rem",
            marginBottom: "1rem",
          }}
        >
          <div>
            <label style={{ fontWeight: "600" }}>Calorías</label>
            <input
              type="number"
              name="calorias"
              value={form.calorias}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "8px",
                marginTop: "4px",
                borderRadius: "6px",
                border: "1px solid #ccc",
              }}
            />
          </div>

          <div>
            <label style={{ fontWeight: "600" }}>Proteína (g)</label>
            <input
              type="number"
              name="proteina_g"
              value={form.proteina_g}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "8px",
                marginTop: "4px",
                borderRadius: "6px",
                border: "1px solid #ccc",
              }}
            />
          </div>

          <div>
            <label style={{ fontWeight: "600" }}>Carbohidratos (g)</label>
            <input
              type="number"
              name="carbohidratos_g"
              value={form.carbohidratos_g}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "8px",
                marginTop: "4px",
                borderRadius: "6px",
                border: "1px solid #ccc",
              }}
            />
          </div>
        </div>

        {/* VERDURAS + FRUTAS */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "1rem",
            marginBottom: "1rem",
          }}
        >
          <div>
            <label style={{ fontWeight: "600" }}>Verduras</label>
            <input
              name="verduras"
              value={form.verduras}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "8px",
                marginTop: "4px",
                borderRadius: "6px",
                border: "1px solid #ccc",
              }}
            />
          </div>

          <div>
            <label style={{ fontWeight: "600" }}>Frutas</label>
            <input
              name="frutas"
              value={form.frutas}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "8px",
                marginTop: "4px",
                borderRadius: "6px",
                border: "1px solid #ccc",
              }}
            />
          </div>
        </div>

        {/* GRASAS */}
        <div style={{ marginBottom: "1rem" }}>
          <label style={{ fontWeight: "600" }}>Grasas (g)</label>
          <input
            type="number"
            name="grasas_g"
            value={form.grasas_g}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "8px",
              marginTop: "4px",
              borderRadius: "6px",
              border: "1px solid #ccc",
            }}
          />
        </div>

        {/* RECOMENDACIONES */}
        <div style={{ marginBottom: "1rem" }}>
          <label style={{ fontWeight: "600" }}>Recomendaciones</label>
          <textarea
            name="recomendaciones"
            value={form.recomendaciones}
            onChange={handleChange}
            rows="4"
            style={{
              width: "100%",
              padding: "8px",
              marginTop: "4px",
              borderRadius: "6px",
              border: "1px solid #ccc",
            }}
          />
        </div>

        {/* BOTONES */}
        <div style={{ display: "flex", justifyContent: "center", gap: "1rem" }}>
          <button type="submit" disabled={loading} className="btn editar">
            {loading ? "Guardando..." : "Guardar"}
          </button>

          <button type="button" className="btn cancelar" onClick={() => navigate("/plan")}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  </div>
);

}

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createCita, fetchCitaById, updateCita } from "./citas.api";
import { fetchPacientes } from "../pacientes/pacientes.api";

import "./citas.css"; // estilos

export default function CitaForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const esEdicion = Boolean(id);

  const [pacientes, setPacientes] = useState([]);
  const [form, setForm] = useState({
    paciente: "",
    fecha: "",
    hora: "",
    tipo: "",
    motivo: "",
  });

  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  async function cargarPacientes() {
    try {
      const data = await fetchPacientes({ page: 1, search: "" });
      setPacientes(data.resultados);
    } catch (e) {
      setError("Error cargando pacientes",e);
    }
  }

  async function cargarCita() {
    if (!esEdicion) return;

    try {
      setCargando(true);
      const data = await fetchCitaById(id);

      setForm({
        paciente: data.pacienteId,
        fecha: data.fecha,
        hora: data.hora,
        tipo: data.tipo,
        motivo: data.motivo,
      });

    } catch (e) {
      setError("Error cargando cita",e);
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    cargarPacientes();
    cargarCita();
  }, [id]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const payload = {
      paciente: Number(form.paciente),
      fecha: form.fecha,
      hora: form.hora,
      tipo: form.tipo,
      motivo: form.motivo,
      estado: "pendiente",
    };

    try {
      if (esEdicion) await updateCita(id, payload);
      else await createCita(payload);

      navigate("/citas");
    } catch (e) {
      setError("Error guardando cita",e);
    }
  }

  if (cargando) return <p>Cargando...</p>;

  return (
    <div className="citas-container">
      <h2 className="citas-title">{esEdicion ? "Editar cita" : "Nueva cita"}</h2>

      {error && <p>{error}</p>}

      <form className="form-container" onSubmit={handleSubmit}>
        <div>
          <label>Paciente</label>
          <select name="paciente" value={form.paciente} onChange={handleChange} required>
            <option value="">Selecciona un paciente</option>
            {pacientes.map((pac) => (
              <option key={pac.id} value={pac.id}>
                {pac.nombre} {pac.apellido}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Fecha</label>
          <input type="date" name="fecha" value={form.fecha} onChange={handleChange} required />
        </div>

        <div>
          <label>Hora</label>
          <input type="time" name="hora" value={form.hora} onChange={handleChange} required />
        </div>

        <div>
          <label>Tipo de cita</label>
          <select name="tipo" value={form.tipo} onChange={handleChange} required>
            <option value="">Selecciona un tipo</option>
            <option value="primera">Primera vez</option>
            <option value="seguimiento">Seguimiento</option>
          </select>
        </div>

        <div>
          <label>Motivo</label>
          <textarea name="motivo" value={form.motivo} onChange={handleChange} required />
        </div>

        <div className="form-buttons">
          <button className="btn btn-save" type="submit">
            Guardar
          </button>
          <button className="btn btn-cancel" type="button" onClick={() => navigate("/citas")}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

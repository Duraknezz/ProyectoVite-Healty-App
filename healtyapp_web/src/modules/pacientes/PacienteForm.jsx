// src/modules/pacientes/PacienteForm.jsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createPaciente, fetchPacienteById, updatePaciente } from "./pacientes.api";
import "./pacientes.css";

export default function PacienteForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    genero: "Masculino",
    edad: "",
  });

  const [loading, setLoading] = useState(false);

  const esEdicion = Boolean(id);

  useEffect(() => {
    if (!esEdicion) return;

    (async () => {
      const data = await fetchPacienteById(id);
      setForm({
        nombre: data.nombre,
        apellido: data.apellido,
        genero: data.genero,
        edad: data.edad,
      });
    })();
  }, [id, esEdicion]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      if (esEdicion) {
        await updatePaciente(id, form);
      } else {
        await createPaciente(form);
      }
      navigate("/pacientes");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="form-contenedor">
      <h2>{esEdicion ? "Editar Paciente" : "Nuevo Paciente"}</h2>

      <form onSubmit={handleSubmit} className="formulario">
        <label>Nombre</label>
        <input name="nombre" value={form.nombre} required onChange={handleChange} />

        <label>Apellido</label>
        <input name="apellido" value={form.apellido} required onChange={handleChange} />

        <label>Género</label>
        <select name="genero" value={form.genero} onChange={handleChange}>
          <option value="Masculino">Masculino</option>
          <option value="Femenino">Femenino</option>
        </select>

        <label>Edad</label>
        <input type="number" name="edad" value={form.edad} required onChange={handleChange} />

        <button type="submit" disabled={loading}>
          {loading ? "Guardando..." : "Guardar"}
        </button>

        <button type="button" className="cancelar" onClick={() => navigate("/pacientes")}>
          Cancelar
        </button>
      </form>
    </div>
  );
}

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchCitas, deleteCita } from "./citas.api";
import { fetchPacientes } from "../pacientes/pacientes.api"; // usando la API ya creada
// Asegúrate de que fetchPacientes pueda traerse todos o una cantidad suficiente

export default function CitasList() {
  const navigate = useNavigate();
  const { id: pacienteRutaId } = useParams(); // para ruta /pacientes/:id/citas

  const [citas, setCitas] = useState([]);
  const [pacientes, setPacientes] = useState([]);
  const [pacienteId, setPacienteId] = useState(pacienteRutaId || "");
  const [tipo, setTipo] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const pageSize = 10; // ajusta a tu configuración
  const totalPaginas = Math.ceil(total / pageSize);

  async function cargarPacientes() {
    try {
      // Podrías pedir la primera página con muchos resultados para llenar el combo
      const data = await fetchPacientes({ page: 1, search: "" });
      setPacientes(data.resultados);
    } catch (e) {
      // no es crítico si falla, pero lo puedes loggear
      console.error("Error cargando pacientes:", e);
    }
  }

  async function cargarCitas() {
    setLoading(true);
    setError("");
    try {
      const data = await fetchCitas({
        page,
        pacienteId,
        tipo,
        fechaInicio,
        fechaFin,
      });
      setCitas(data.resultados);
      setTotal(data.total);
    } catch (error) {
      console.error("Error cargando citas:", error);
      setError("Failed to load appointments.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    cargarPacientes();
  }, []);

  useEffect(() => {
    // si la ruta trae un paciente específico, forzar ese filtro
    if (pacienteRutaId) {
      setPacienteId(pacienteRutaId);
      setPage(1);
    }
  }, [pacienteRutaId]);

  useEffect(() => {
    cargarCitas();
  }, [page, pacienteId, tipo, fechaInicio, fechaFin]);

  function handleNuevaCita() {
    navigate("/citas/nueva");
  }

  function handleEditar(id) {
    navigate(`/citas/${id}/editar`);
  }

  async function handleEliminar(id) {
    const confirmar = window.confirm("¿Seguro que deseas eliminar esta cita?");
    if (!confirmar) return;

    try {
      await deleteCita(id);
      cargarCitas();
    } catch (error) {
      console.error("Error al eliminar la cita:", error);
      alert("Ocurrió un error al eliminar la cita.");
    }
  }

  return (
    <div>
      <h2>Citas</h2>

      {error && <p>{error}</p>}

      {/* Filtros */}
      <div style={{ marginBottom: "1rem" }}>
        <select
          value={pacienteId}
          onChange={(e) => {
            setPacienteId(e.target.value);
            setPage(1);
          }}
        >
          <option value="">Todos los pacientes</option>
          {pacientes.map((pac) => (
            <option key={pac.id} value={pac.id}>
              {pac.nombre} {pac.apellido}
            </option>
          ))}
        </select>

        <select
          value={tipo}
          onChange={(e) => {
            setTipo(e.target.value);
            setPage(1);
          }}
          style={{ marginLeft: "0.5rem" }}
        >
          <option value="">Todos los tipos</option>
          <option value="primera">Primera vez</option>
          <option value="seguimiento">Seguimiento</option>
        </select>

        <input
          type="date"
          value={fechaInicio}
          onChange={(e) => {
            setFechaInicio(e.target.value);
            setPage(1);
          }}
          style={{ marginLeft: "0.5rem" }}
        />

        <input
          type="date"
          value={fechaFin}
          onChange={(e) => {
            setFechaFin(e.target.value);
            setPage(1);
          }}
          style={{ marginLeft: "0.5rem" }}
        />

        <button onClick={handleNuevaCita} style={{ marginLeft: "1rem" }}>
          Nueva cita
        </button>
      </div>

      {loading ? (
        <p>Cargando...</p>
      ) : (
        <table border="1" cellPadding="6" cellSpacing="0">
          <thead>
            <tr>
              <th>Paciente</th>
              <th>Fecha</th>
              <th>Hora</th>
              <th>Tipo</th>
              <th>Motivo</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {citas.length === 0 ? (
              <tr>
                <td colSpan="6">No hay citas para mostrar.</td>
              </tr>
            ) : (
              citas.map((cita) => (
                <tr key={cita.id}>
                  <td>{cita.pacienteNombre || cita.pacienteId}</td>
                  <td>{cita.fecha}</td>
                  <td>{cita.hora}</td>
                  <td>{cita.tipo}</td>
                  <td>{cita.motivo}</td>
                  <td>
                    <button onClick={() => handleEditar(cita.id)}>
                      Editar
                    </button>
                    <button onClick={() => handleEliminar(cita.id)}>
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}

      {/* Paginación */}
      <div style={{ marginTop: "1rem" }}>
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
        >
          Anterior
        </button>

        <span style={{ margin: "0 0.5rem" }}>
          Página {page} de {totalPaginas || 1}
        </span>

        <button
          onClick={() => setPage((p) => p + 1)}
          disabled={page >= totalPaginas}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}

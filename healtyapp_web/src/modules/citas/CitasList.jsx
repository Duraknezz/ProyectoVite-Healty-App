import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchCitas, deleteCita } from "./citas.api";
import { fetchPacientes } from "../pacientes/pacientes.api";

import "./citas.css";

export default function CitasList() {
  const navigate = useNavigate();
  const { id: pacienteRutaId } = useParams();

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

  const pageSize = 10;
  const totalPaginas = Math.ceil(total / pageSize);

  // ----------------------------
  // CARGAR PACIENTES
  // ----------------------------
  useEffect(() => {
    async function cargar() {
      try {
        const data = await fetchPacientes({ page: 1, search: "" });
        setPacientes(data.resultados);
      } catch (e) {
        console.error("Error cargando pacientes:", e);
      }
    }
    cargar();
  }, []);

  // ----------------------------
  // CARGAR CITA SI VENÍA DESDE /pacientes/:id
  // ----------------------------
  useEffect(() => {
    if (pacienteRutaId) {
      setPacienteId(pacienteRutaId);
      setPage(1);
    }
  }, [pacienteRutaId]);


  // ----------------------------
  // CARGAR CITAS
  // ----------------------------
  useEffect(() => {
    async function cargar() {
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
      } catch (e) {
        console.error("Error cargando citas:", e);
        setError("Error al cargar citas");
      } finally {
        setLoading(false);
      }
    }

    cargar();
  }, [page, pacienteId, tipo, fechaInicio, fechaFin]);

  // ----------------------------
  // ACCIONES
  // ----------------------------
  function handleNuevaCita() {
    navigate("/citas/nueva");
  }

  function handleEditar(id) {
    navigate(`/citas/${id}/editar`);
  }

  async function handleEliminar(id) {
    if (!window.confirm("¿Seguro que deseas eliminar esta cita?")) return;

    try {
      await deleteCita(id);
      // recargar lista
      setPage(1);
    } catch (error) {
      alert("Error eliminando cita",error);
    }
  }

  return (
    <div className="citas-container">
      <h2 className="citas-title">Citas</h2>

      {error && <p>{error}</p>}

      {/* Filtros */}
      <div className="filtros">
        <select value={pacienteId} onChange={(e) => setPacienteId(e.target.value)}>
          <option value="">Todos los pacientes</option>
          {pacientes.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nombre} {p.apellido}
            </option>
          ))}
        </select>

        <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
          <option value="">Todos los tipos</option>
          <option value="primera">Primera vez</option>
          <option value="seguimiento">Seguimiento</option>
        </select>

        <input type="date" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} />
        <input type="date" value={fechaFin} onChange={(e) => setFechaFin(e.target.value)} />

        <button className="boton-nueva" onClick={handleNuevaCita}>Nueva cita</button>
      </div>

      {loading ? (
        <p>Cargando...</p>
      ) : (
        <table className="citas-table">
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
              <tr><td colSpan="6">No hay citas disponibles</td></tr>
            ) : (
              citas.map((cita) => (
                <tr key={cita.id}>
                  <td>{cita.pacienteNombre || cita.pacienteId}</td>
                  <td>{cita.fecha}</td>
                  <td>{cita.hora}</td>
                  <td>{cita.tipo}</td>
                  <td>{cita.motivo}</td>
                  <td>
                    <button className="btn btn-edit" onClick={() => handleEditar(cita.id)}>
                      Editar
                    </button>
                    <button className="btn btn-delete" onClick={() => handleEliminar(cita.id)}>
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
      <div className="pagination">
        <button disabled={page === 1} onClick={() => setPage(page - 1)}>Anterior</button>
        <span>Página {page} de {totalPaginas || 1}</span>
        <button disabled={page >= totalPaginas} onClick={() => setPage(page + 1)}>Siguiente</button>
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { fetchPlanes, deletePlan } from "./plan.api";
import { fetchCitas } from "../citas/citas.api";

export default function PlanList() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const citaQuery = searchParams.get("cita") || "";

  const [planes, setPlanes] = useState([]);
  const [citas, setCitas] = useState([]);
  const [citaId, setCitaId] = useState(citaQuery);
  const [fecha, setFecha] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const pageSize = 10;
  const totalPaginas = Math.ceil(total / pageSize);

  async function cargarCitas() {
    try {
      const data = await fetchCitas({ page: 1 });
      setCitas(data.resultados);
    } catch (e) {
      console.error("Error cargando citas:", e);
    }
  }

  async function cargarPlanes() {
    setLoading(true);
    setError("");
    try {
      const data = await fetchPlanes({ page, citaId, fecha, search });
      setPlanes(data.resultados);
      setTotal(data.total);
    } catch (e) {
      console.error("Error cargando planes:", e);
      setError("No se pudieron cargar los planes.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    cargarCitas();
  }, []);

  useEffect(() => {
    if (citaQuery) setCitaId(citaQuery);
    setPage(1);
  }, [citaQuery]);

  useEffect(() => {
    cargarPlanes();
  }, [page, citaId, fecha, search]);

  function handleNuevo() {
    navigate(`/plan/nuevo${citaId ? `?cita=${citaId}` : ""}`);
  }

  async function handleEliminar(id) {
    const confirmar = window.confirm("¿Eliminar este plan?");
    if (!confirmar) return;
    try {
      await deletePlan(id);
      cargarPlanes();
    } catch (e) {
      console.error("Error al eliminar:", e);
      alert("No se pudo eliminar.");
    }
  }

  return (
    <div className="contenedor">
      <h2 className="titulo">Planes alimenticios</h2>

      {error && <div className="error">{error}</div>}

      {/* FILTROS */}
      <div className="filtros">
        <select
          value={citaId}
          onChange={(e) => {
            setCitaId(e.target.value);
            setPage(1);
          }}
        >
          <option value="">Todas las citas</option>
          {citas.map((c) => (
            <option key={c.id} value={c.id}>
              {c.pacienteNombre} {c.pacienteApellido} — {c.fecha} {c.hora}
            </option>
          ))}
        </select>

        <input
          type="date"
          value={fecha}
          onChange={(e) => {
            setFecha(e.target.value);
            setPage(1);
          }}
        />

        <input
          type="text"
          placeholder="Buscar (motivo / recomendaciones)"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          style={{ flex: 1 }}
        />

        <button className="btn editar" onClick={handleNuevo}>
          Nuevo plan
        </button>
      </div>

      {/* TABLA */}
      {loading ? (
        <div className="loading">Cargando...</div>
      ) : (
        <table className="tabla">
          <thead>
            <tr>
              <th>Paciente</th>
              <th>Fecha</th>
              <th>Hora</th>
              <th>Motivo</th>
              <th>Calorías</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {planes.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: "center" }}>
                  No hay registros.
                </td>
              </tr>
            ) : (
              planes.map((p) => (
                <tr key={p.id}>
                  <td>
                    {p.pacienteNombre
                      ? `${p.pacienteNombre} ${p.pacienteApellido}`
                      : p.pacienteId}
                  </td>
                  <td>{p.fecha}</td>
                  <td>{p.hora}</td>
                  <td>{p.motivo}</td>
                  <td>{p.calorias ?? "-"}</td>
                  <td style={{ padding: 8, display: "flex", gap: "6px" }}>
                    <button
                        onClick={() => navigate(`/plan/${p.id}`)}
                        className="btn editar"
                        style={{ background: "#555", color: "white" }}
                    >
                    Ver
                    </button>

                <button
                    onClick={() => navigate(`/plan/${p.id}/editar`)}
                    className="btn editar"
                >
                Editar
                </button>

                <button
                    onClick={() => handleEliminar(p.id)}
                    className="btn eliminar"
                >
                Eliminar
                </button>
            </td>

                </tr>
              ))
            )}
          </tbody>
        </table>
      )}

      {/* PAGINACIÓN */}
      <div className="paginacion">
        <button onClick={() => setPage((p) => Math.max(p - 1, 1))} disabled={page === 1}>
          Anterior
        </button>

        <span>
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

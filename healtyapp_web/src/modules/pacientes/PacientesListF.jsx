// src/modules/pacientes/PacientesList.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchPacientes, deletePaciente } from "./pacientes.api";
import "./pacientes.css"; // estilos

export default function PacientesList() {
  const [pacientes, setPacientes] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [genero, setGenero] = useState("Todos");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function cargarPacientes() {
    setLoading(true);
    setError("");
    try {
      const data = await fetchPacientes({ page, search, genero });
      setPacientes(data.resultados);
      setTotal(data.total);
    } catch {
      setError("No se pudieron cargar los pacientes.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    cargarPacientes();
  }, [page, search, genero]);

  async function handleEliminar(id) {
    if (!window.confirm("¿Seguro que deseas eliminar este paciente?")) return;
    await deletePaciente(id);
    cargarPacientes();
  }

  const totalPaginas = Math.ceil(total / 10) || 1;

  return (
    <div className="contenedor">
      <h2 className="titulo">Pacientes</h2>

      {/* Filtros */}
      <div className="filtros">
        <input
          type="text"
          placeholder="Buscar por nombre o apellido"
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
        />

        <select
          value={genero}
          onChange={(e) => {
            setPage(1);
            setGenero(e.target.value);
          }}
        >
          <option value="Todos">Todos los géneros</option>
          <option value="Masculino">Masculino</option>
          <option value="Femenino">Femenino</option>
        </select>

        <button onClick={() => navigate("/pacientes/nuevo")}>
          Nuevo paciente
        </button>
      </div>

      {/* Mensaje de error (usa la variable `error` para evitar warnings/errores de linter) */}
      {error && (
        <p className="error" role="alert">{error}</p>
      )}

      {loading ? (
        <p className="loading">Cargando...</p>
      ) : (
        <table className="tabla">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Género</th>
              <th>Edad</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {pacientes.length === 0 ? (
              <tr><td colSpan="5">No hay resultados.</td></tr>
            ) : (
              pacientes.map((p) => (
                <tr key={p.id}>
                  <td>{p.nombre}</td>
                  <td>{p.apellido}</td>
                  <td>{p.genero}</td>
                  <td>{p.edad}</td>
                  <td>
                    <button className="btn editar" onClick={() => navigate(`/pacientes/${p.id}/editar`)}>Editar</button>
                    <button className="btn eliminar" onClick={() => handleEliminar(p.id)}>Eliminar</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}

      {/* Paginación */}
      <div className="paginacion">
        <button disabled={page === 1} onClick={() => setPage(page - 1)}>Anterior</button>
        <span>Página {page} de {totalPaginas}</span>
        <button disabled={page === totalPaginas} onClick={() => setPage(page + 1)}>Siguiente</button>
      </div>
    </div>
  );
}

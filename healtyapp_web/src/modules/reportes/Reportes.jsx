import { useEffect, useState } from "react";
import { fetchReportes } from "./reportes.api";
import { fetchPacientes } from "../pacientes/pacientes.api";

export default function Reportes() {
  const [pacientes, setPacientes] = useState([]);
  const [resultados, setResultados] = useState([]);

  const [pacienteId, setPacienteId] = useState("");
  const [tipo, setTipo] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPacientes({ page: 1 })
      .then((data) => setPacientes(data.resultados || []))
      .catch(() => setPacientes([]));
  }, []);

  async function generarReporte() {
  setLoading(true);
  setError("");

  console.log("🟡 Generando reporte con filtros:", {
    pacienteId,
    tipo,
    fechaInicio,
    fechaFin,
  });

  try {
    const data = await fetchReportes({
      pacienteId,
      tipo,
      fechaInicio,
      fechaFin,
    });

    console.log("🟢 Data final para la tabla:", data);

    setResultados(data);
  } catch (e) {
    console.error("🔴 Error generando reporte:", e);
    setError("Error al generar el reporte");
    setResultados([]);
  } finally {
    setLoading(false);
  }
}


  function exportToCSV(data, filename = "reporte_citas.csv") {
    if (data.length === 0) {
      alert("No hay datos para exportar");
      return;
    }

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [
        "Paciente,Fecha,Hora,Tipo,Motivo",
        ...data.map(
          (r) =>
            `"${r.paciente}","${r.fecha}","${r.hora}","${r.tipo}","${r.motivo}"`
        ),
      ].join("\n");

    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <div className="contenedor">
      <h2 className="titulo">Reportes de Citas</h2>

      {/* FILTROS */}
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

        <input
          type="date"
          value={fechaInicio}
          onChange={(e) => setFechaInicio(e.target.value)}
        />
        <input
          type="date"
          value={fechaFin}
          onChange={(e) => setFechaFin(e.target.value)}
        />

        <button onClick={generarReporte}>Generar reporte</button>
        <button onClick={() => exportToCSV(resultados)}>
          Exportar CSV
        </button>
      </div>

      {error && <p className="error">{error}</p>}

      {/* TABLA */}
      {loading ? (
        <p className="loading">Generando reporte...</p>
      ) : (
        <table className="tabla">
          <thead>
            <tr>
              <th>Paciente</th>
              <th>Fecha</th>
              <th>Hora</th>
              <th>Tipo</th>
              <th>Motivo</th>
            </tr>
          </thead>
          <tbody>
            {resultados.length === 0 ? (
              <tr>
                <td colSpan="5">No hay resultados</td>
              </tr>
            ) : (
              resultados.map((r) => (
                <tr key={r.id}>
                  <td>{r.paciente}</td>
                  <td>{r.fecha}</td>
                  <td>{r.hora}</td>
                  <td>{r.tipo}</td>
                  <td>{r.motivo}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}

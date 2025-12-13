import api from "../../api/axios";
import { mapReporteFromApi } from "./types";

export async function fetchReportes({
  pacienteId = "",
  tipo = "",
  fechaInicio = "",
  fechaFin = "",
}) {
  const params = {
    page: 1, // 🔴 CLAVE: el backend espera paginación
  };

  if (pacienteId) params.paciente = pacienteId;
  if (tipo) params.tipo = tipo;
  if (fechaInicio) params.fecha_inicio = fechaInicio;
  if (fechaFin) params.fecha_fin = fechaFin;

  console.log("➡️ Params enviados al backend:", params);

  const response = await api.get("/citas/", { params });

  console.log("⬅️ Respuesta cruda del backend:", response.data);

  // 🔎 Detectamos estructura real
  const resultados =
    response.data?.resultados ||
    response.data?.results ||
    response.data ||
    [];

  console.log("📊 Resultados procesados:", resultados);

  return Array.isArray(resultados)
    ? resultados.map(mapReporteFromApi)
    : [];
}

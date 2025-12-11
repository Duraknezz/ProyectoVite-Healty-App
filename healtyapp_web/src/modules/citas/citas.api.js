import api from "../../api/axios";
import { mapCitaFromApi, mapPageResponse } from "./types";

// Obtener citas con paginación y filtros
export async function fetchCitas({ page = 1, pacienteId = "", tipo = "", fechaInicio = "", fechaFin = "" }) {
  const params = { page };

  if (pacienteId) params.paciente = pacienteId;
  if (tipo) params.tipo = tipo;
  if (fechaInicio) params.fecha_inicio = fechaInicio;
  if (fechaFin) params.fecha_fin = fechaFin;

  console.log("📥 fetchCitas params:", params);

  const response = await api.get("/citas/", { params });
  console.log("📤 fetchCitas response:", response.data);

  return mapPageResponse(response.data, mapCitaFromApi);
}

// Obtener cita por ID
export async function fetchCitaById(id) {
  console.log("📥 fetchCitaById:", id);
  const response = await api.get(`/citas/${id}/`);
  console.log("📤 Cita recibida:", response.data);

  return mapCitaFromApi(response.data);
}

// Crear cita
export async function createCita(citaData) {
  console.log("🟦 POST /citas/ DATA:", citaData);
  try {
    const response = await api.post("/citas/", citaData);
    console.log("🟢 Respuesta POST:", response.data);
    return mapCitaFromApi(response.data);
  } catch (e) {
    console.error("❌ Error en createCita:", e);
    if (e.response) {
      console.error("Status:", e.response.status);
      console.error("Data:", e.response.data);
    }
    throw e;
  }
}

// Actualizar cita
export async function updateCita(id, citaData) {
  console.log("🟦 PUT /citas/:id DATA:", { id, citaData });

  try {
    const response = await api.put(`/citas/${id}/`, citaData);
    console.log("🟢 Respuesta PUT:", response.data);
    return mapCitaFromApi(response.data);
  } catch (e) {
    console.error("❌ Error en updateCita:");
    if (e.response) {
      console.error("Status:", e.response.status);
      console.error("Data:", e.response.data);
    }
    throw e;
  }
}

// Eliminar cita
export async function deleteCita(id) {
  console.log("🗑 DELETE /citas/:id", id);
  await api.delete(`/citas/${id}/`);
}

import api from "../../api/axios";
import { mapPacienteFromApi, mapPageResponse } from "./types";

// Debounce global
let debounceTimer;

// Obtener lista de pacientes con paginación y filtros
export async function fetchPacientes({ page = 1, search = "", genero = "Todos" }) {
  return new Promise((resolve) => {
    clearTimeout(debounceTimer);

    debounceTimer = setTimeout(async () => {
      try {
        const params = { page };

        if (search && search.trim() !== "") {
          params.search = search.trim();
        }

        if (genero && genero !== "Todos") {
          params["genero"] = genero; // <- CLAVE
        }

        const response = await api.get("/pacientes/", { params });
        const data = response.data;

        // Si la API responde sin paginación
        if (Array.isArray(data)) {
          return resolve({
            total: data.length,
            resultados: data.map(mapPacienteFromApi),
            next: null,
            previous: null,
          });
        }

        return resolve(mapPageResponse(data, mapPacienteFromApi));
      } catch (error) {
        console.error("Error cargando pacientes:", error);
        return resolve({
          total: 0,
          resultados: [],
          next: null,
          previous: null,
          error: true,
        });
      }
    }, 500); // debounce 0.5s
  });
}

export async function fetchPacienteById(id) {
  const response = await api.get(`/pacientes/${id}/`);
  return mapPacienteFromApi(response.data);
}

export async function createPaciente(pacienteData) {
  const response = await api.post("/pacientes/", pacienteData);
  return mapPacienteFromApi(response.data);
}

export async function updatePaciente(id, pacienteData) {
  const response = await api.put(`/pacientes/${id}/`, pacienteData);
  return mapPacienteFromApi(response.data);
}

export async function deletePaciente(id) {
  await api.delete(`/pacientes/${id}/`);
}

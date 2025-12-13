import api from "../../api/axios";
import { mapPlanFromApi, mapPageResponse } from "./types";

export async function fetchPlanes({ page = 1, citaId = "", fecha = "", search = "" }) {
  const params = { page };
  if (citaId) params.cita = citaId;
  if (fecha) params.fecha = fecha;
  if (search) params.search = search;

  const response = await api.get("/planes/", { params });
  return mapPageResponse(response.data, mapPlanFromApi);
}

export async function fetchPlanById(id) {
  const response = await api.get(`/planes/${id}/`);
  return mapPlanFromApi(response.data);
}

export async function createPlan(planData) {
  const response = await api.post("/planes/", planData);
  return mapPlanFromApi(response.data);
}

export async function updatePlan(id, planData) {
  const response = await api.put(`/planes/${id}/`, planData);
  return mapPlanFromApi(response.data);
}

export async function deletePlan(id) {
  await api.delete(`/planes/${id}/`);
}

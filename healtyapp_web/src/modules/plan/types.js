export function mapPlanFromApi(apiPlan) {
  return {
    id: apiPlan.id,
    citaId: apiPlan.cita,
    fecha: apiPlan.fecha,
    hora: apiPlan.hora,
    motivo: apiPlan.motivo,
    calorias: apiPlan.calorias,
    proteina_g: apiPlan.proteina_g,
    carbohidratos_g: apiPlan.carbohidratos_g,
    grasas_g: apiPlan.grasas_g,
    verduras: apiPlan.verduras,
    frutas: apiPlan.frutas,
    recomendaciones: apiPlan.recomendaciones,
    pacienteId: apiPlan.paciente_id,
    pacienteNombre: apiPlan.paciente_nombre,
    pacienteApellido: apiPlan.paciente_apellido,
    created_at: apiPlan.created_at,
  };
}

export function mapPageResponse(apiResponse, mapItemFn) {
  // Si tu backend a veces devuelve un array simple, maneja ambos casos
  if (Array.isArray(apiResponse)) {
    return {
      total: apiResponse.length,
      next: null,
      previous: null,
      resultados: apiResponse.map(mapItemFn),
    };
  }

  return {
    total: apiResponse.count,
    next: apiResponse.next,
    previous: apiResponse.previous,
    resultados: apiResponse.results.map(mapItemFn),
  };
}

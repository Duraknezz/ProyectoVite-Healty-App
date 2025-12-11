export function mapCitaFromApi(apiCita) {
  return {
    id: apiCita.id,
    pacienteId: apiCita.paciente,              // id del paciente
    pacienteNombre: apiCita.paciente_nombre,   // si expones el nombre en el serializer o en la API
    fecha: apiCita.fecha,
    hora: apiCita.hora,
    motivo: apiCita.motivo,
    tipo: apiCita.tipo,                        // "Primera vez" o "Seguimiento"
  };
}

// Estructura de respuesta paginada de DRF
export function mapPageResponse(apiResponse, mapItemFn) {
  return {
    total: apiResponse.count,
    next: apiResponse.next,
    previous: apiResponse.previous,
    resultados: apiResponse.results.map(mapItemFn),
  };
}

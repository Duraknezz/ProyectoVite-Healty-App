export function mapReporteFromApi(apiCita) {
  return {
    id: apiCita.id,
    paciente: apiCita.pacienteNombre || apiCita.paciente,
    fecha: apiCita.fecha,
    hora: apiCita.hora,
    tipo: apiCita.tipo,
    motivo: apiCita.motivo,
  };
}
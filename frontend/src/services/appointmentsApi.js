import { fetchApi } from './api'

export async function createAppointment(appointmentData) {
  const response = await fetchApi('/appointments', {
    method: 'POST',
    body: JSON.stringify(appointmentData)
  })
  return response.data
}

/**
 * Lista agendamentos, podendo filtrar por barbeiro e/ou data (YYYY-MM-DD).
 * @param {{ barberId?: number, date?: string }} params
 */
export async function getAppointments({ barberId = 1, date } = {}) {
  const query = new URLSearchParams({ barberId })
  if (date) query.set('date', date)
  const response = await fetchApi(`/appointments?${query.toString()}`)
  return response.data
}

/**
 * Busca as métricas agregadas para o topo do Dashboard.
 * @param {{ barberId?: number }} params
 */
export async function getAppointmentMetrics({ barberId = 1 } = {}) {
  const query = new URLSearchParams({ barberId })
  const response = await fetchApi(`/appointments/metrics?${query.toString()}`)
  return response.data
}

/**
 * Atualiza o status de um agendamento.
 * @param {number|string} id 
 * @param {string} status 
 */
export async function updateAppointmentStatus(id, status) {
  const response = await fetchApi(`/appointments/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status })
  })
  return response.data
}

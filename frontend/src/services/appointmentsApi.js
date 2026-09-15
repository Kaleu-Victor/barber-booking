import { fetchApi } from './api'

export async function createAppointment(appointmentData) {
  const response = await fetchApi('/appointments', {
    method: 'POST',
    body: JSON.stringify(appointmentData)
  })
  return response.data
}

export async function getAppointments() {
  const response = await fetchApi('/appointments')
  return response.data
}

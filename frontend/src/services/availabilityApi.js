import { fetchApi } from './api'

export async function getAvailability(date, serviceId, barberId = 1) {
  const params = new URLSearchParams({ date, serviceId, barberId })
  const response = await fetchApi(`/availability?${params.toString()}`)
  return response.data
}

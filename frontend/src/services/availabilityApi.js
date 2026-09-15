import { fetchApi } from './api'

export async function getAvailability(date, serviceId) {
  const params = new URLSearchParams({ date, serviceId })
  const response = await fetchApi(`/availability?${params.toString()}`)
  return response.data
}

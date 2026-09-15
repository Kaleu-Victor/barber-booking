import { fetchApi } from './api'

export async function getServices() {
  const response = await fetchApi('/services')
  return response.data
}

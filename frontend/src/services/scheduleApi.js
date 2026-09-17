import { fetchApi } from './api'

export async function getSchedule() {
  const response = await fetchApi('/working-hours')
  return response.data
}

export async function updateSchedule(scheduleData) {
  const response = await fetchApi('/working-hours', {
    method: 'PUT',
    body: JSON.stringify({ schedule: scheduleData })
  })
  return response
}

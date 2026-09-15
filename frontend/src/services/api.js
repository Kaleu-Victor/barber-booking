const API_BASE_URL = '/api'

export async function fetchApi(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  }

  const response = await fetch(url, { ...options, headers })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || 'Erro na requisição')
  }

  return data
}

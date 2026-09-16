const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'

export async function fetchApi(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  }

  const response = await fetch(url, { ...options, headers })

  if (!response.ok) {
    let errorMsg = 'Erro na requisição'
    try {
      const errorData = await response.json()
      errorMsg = errorData.error || errorMsg
    } catch (e) {
      // ignore json parse error
    }
    throw new Error(errorMsg)
  }

  const data = await response.json()

  return data
}

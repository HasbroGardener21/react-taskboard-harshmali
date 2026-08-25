const BASE_URL = import.meta.env.VITE_API_URL

const getHeaders = (token) => ({
  'Content-Type': 'application/json',
  ...(token && { Authorization: `Bearer ${token}` })
})

// Central fetch handler — catches 401 globally
const apiFetch = async (url, options = {}) => {
  const res = await fetch(url, options)
  
  if (res.status === 401) {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    window.location.href = '/login'
    return
  }

  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Something went wrong')
  return data
}

// AUTH
export const registerUser = async (email, password) => {
  return apiFetch(`${BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ email, password })
  })
}

export const loginUser = async (email, password) => {
  return apiFetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ email, password })
  })
}

// TASKS
export const fetchTasks = async (token) => {
  return apiFetch(`${BASE_URL}/api/tasks`, {
    headers: getHeaders(token)
  })
}

export const createTaskAPI = async (token, title, project) => {
  return apiFetch(`${BASE_URL}/api/tasks`, {
    method: 'POST',
    headers: getHeaders(token),
    body: JSON.stringify({ title, project })
  })
}

export const updateTaskAPI = async (token, id, updates) => {
  return apiFetch(`${BASE_URL}/api/tasks/${id}`, {
    method: 'PUT',
    headers: getHeaders(token),
    body: JSON.stringify(updates)
  })
}

export const toggleCompleteAPI = async (token, id) => {
  return apiFetch(`${BASE_URL}/api/tasks/${id}/complete`, {
    method: 'PATCH',
    headers: getHeaders(token)
  })
}

export const deleteTaskAPI = async (token, id) => {
  return apiFetch(`${BASE_URL}/api/tasks/${id}`, {
    method: 'DELETE',
    headers: getHeaders(token)
  })
}
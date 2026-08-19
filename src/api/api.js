const BASE_URL = import.meta.env.VITE_API_URL

const getHeaders = (token) => ({
  'Content-Type': 'application/json',
  ...(token && { Authorization: `Bearer ${token}` })
})

// AUTH
export const registerUser = async (email, password) => {
  const res = await fetch(`${BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ email, password })
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message)
  return data
}

export const loginUser = async (email, password) => {
  const res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ email, password })
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message)
  return data
}

// TASKS
export const fetchTasks = async (token) => {
  const res = await fetch(`${BASE_URL}/api/tasks`, {
    headers: getHeaders(token)
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message)
  return data
}

export const createTaskAPI = async (token, title, project) => {
  const res = await fetch(`${BASE_URL}/api/tasks`, {
    method: 'POST',
    headers: getHeaders(token),
    body: JSON.stringify({ title, project })
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message)
  return data
}
console.log('API BASE URL:', import.meta.env.VITE_API_URL)

export const updateTaskAPI = async (token, id, updates) => {
  const res = await fetch(`${BASE_URL}/api/tasks/${id}`, {
    method: 'PUT',
    headers: getHeaders(token),
    body: JSON.stringify(updates)
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message)
  return data
}

export const toggleCompleteAPI = async (token, id) => {
  const res = await fetch(`${BASE_URL}/api/tasks/${id}/complete`, {
    method: 'PATCH',
    headers: getHeaders(token)
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message)
  return data
}

export const deleteTaskAPI = async (token, id) => {
  const res = await fetch(`${BASE_URL}/api/tasks/${id}`, {
    method: 'DELETE',
    headers: getHeaders(token)
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message)
  return data
}
import { createContext, useContext, useState, useEffect } from 'react'
import {
  fetchTasks, createTaskAPI, updateTaskAPI,
  toggleCompleteAPI, deleteTaskAPI
} from '../api/api'

const AppContext = createContext()

export function AppProvider({ children, token }) {
  const [tasks, setTasks] = useState([])
  const [projects, setProjects] = useState(() => {
    const saved = localStorage.getItem('projects')
    return saved ? JSON.parse(saved) : [{ id: 1, name: 'Inbox', color: '#4dabf7' }]
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Persist projects to localStorage (tasks now live in DB)
  useEffect(() => {
    localStorage.setItem('projects', JSON.stringify(projects))
  }, [projects])

  // Fetch tasks from API when token is available
  useEffect(() => {
    if (!token) {
      setTasks([])
      return
    }

    const loadTasks = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await fetchTasks(token)
        setTasks(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadTasks()
  }, [token])

  // TASKS
  const addTask = async (title, projectName) => {
    try {
      const newTask = await createTaskAPI(token, title, projectName)
      setTasks(prev => [...prev, newTask])
    } catch (err) {
      setError(err.message)
    }
  }

  const deleteTask = async (id) => {
    try {
      await deleteTaskAPI(token, id)
      setTasks(prev => prev.filter(t => t._id !== id))
    } catch (err) {
      setError(err.message)
    }
  }

  const toggleDone = async (id) => {
    try {
      const updated = await toggleCompleteAPI(token, id)
      setTasks(prev => prev.map(t => t._id === id ? updated : t))
    } catch (err) {
      setError(err.message)
    }
  }

  const updateTask = async (id, newTitle) => {
    try {
      const updated = await updateTaskAPI(token, id, { title: newTitle })
      setTasks(prev => prev.map(t => t._id === id ? updated : t))
    } catch (err) {
      setError(err.message)
    }
  }

  const moveTask = async (taskId, newProject) => {
    try {
      const updated = await updateTaskAPI(token, taskId, { project: newProject })
      setTasks(prev => prev.map(t => t._id === taskId ? updated : t))
    } catch (err) {
      setError(err.message)
    }
  }

  const reorderTasks = (reorderedList) => {
    setTasks(prev => [
      ...prev.filter(t => t.project !== reorderedList[0].project),
      ...reorderedList
    ])
  }

  // PROJECTS (still local)
  const addProject = (name, color = '#888') => {
    setProjects(prev => [...prev, { id: Date.now(), name, color }])
  }

  const deleteProject = (id) => {
    const project = projects.find(p => p.id === id)
    setProjects(prev => prev.filter(p => p.id !== id))
    if (project) {
      setTasks(prev => prev.filter(t => t.project !== project.name))
    }
  }

  const renameProject = (id, newName) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, name: newName } : p))
  }

  const updateProjectColor = (id, color) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, color } : p))
  }

  return (
    <AppContext.Provider value={{
      projects, tasks, loading, error,
      addTask, deleteTask, toggleDone, updateTask, moveTask, reorderTasks,
      addProject, deleteProject, renameProject, updateProjectColor
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  return useContext(AppContext)
}
import { createContext, useContext, useState, useEffect } from 'react'
import {
  fetchTasks, createTaskAPI, updateTaskAPI,
  toggleCompleteAPI, deleteTaskAPI
} from '../api/api'
import { useAuth } from './AuthContext'

const AppContext = createContext()

export function AppProvider({ children }) {
  const { token, user } = useAuth()
  const userId = user?._id || user?.id || user?.email || 'default'

  const [tasks, setTasks] = useState([])
  const [projects, setProjects] = useState([{ id: 'inbox', name: 'Inbox', color: '#4dabf7' }])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [actionError, setActionError] = useState(null)
  
  // THE LOCK: Prevents overwriting local storage on refresh
  const [isInitialized, setIsInitialized] = useState(false)

  // 1. LOAD EFFECT
  useEffect(() => {
    if (!token || !user) {
      setTasks([])
      setProjects([{ id: 'inbox', name: 'Inbox', color: '#4dabf7' }])
      setIsInitialized(false)
      return
    }

    const key = `projects_${userId}`
    const saved = localStorage.getItem(key)
    if (saved) {
      setProjects(JSON.parse(saved))
    } else {
      setProjects([{ id: 'inbox', name: 'Inbox', color: '#4dabf7' }])
    }
    
    // Unlock saving only AFTER we have safely loaded the existing projects
    setIsInitialized(true)

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
  }, [token, user, userId])

  // 2. SAVE EFFECT
  useEffect(() => {
    // If we haven't finished loading yet, DO NOT SAVE.
    if (!user || !isInitialized) return
    localStorage.setItem(`projects_${userId}`, JSON.stringify(projects))
  }, [projects, user, userId, isInitialized])

  const addTask = async (title, projectName, attachmentUrl) => {
    try {
      setActionError(null)
      const newTask = await createTaskAPI(token, title, projectName, attachmentUrl)
      setTasks(prev => [...prev, newTask])
    } catch (err) {
      setActionError(err.message)
    }
  }

  const deleteTask = async (id) => {
    try {
      setActionError(null)
      await deleteTaskAPI(token, id)
      setTasks(prev => prev.filter(t => t._id !== id))
    } catch (err) {
      setActionError(err.message)
    }
  }

  const toggleDone = async (id) => {
    try {
      setActionError(null)
      const updated = await toggleCompleteAPI(token, id)
      setTasks(prev => prev.map(t => t._id === id ? updated : t))
    } catch (err) {
      setActionError(err.message)
    }
  }

  const updateTask = async (id, newTitle) => {
    try {
      setActionError(null)
      const updated = await updateTaskAPI(token, id, { title: newTitle })
      setTasks(prev => prev.map(t => t._id === id ? updated : t))
    } catch (err) {
      setActionError(err.message)
    }
  }

  const moveTask = async (taskId, newProject) => {
    try {
      setActionError(null)
      const updated = await updateTaskAPI(token, taskId, { project: newProject })
      setTasks(prev => prev.map(t => t._id === taskId ? updated : t))
    } catch (err) {
      setActionError(err.message)
    }
  }

  const reorderTasks = (reorderedList) => {
    if (!reorderedList.length) return
    setTasks(prev => [
      ...prev.filter(t => t.project !== reorderedList[0].project),
      ...reorderedList
    ])
  }

  const addProject = (name, color = '#888') => {
    setProjects(prev => [...prev, { id: Date.now(), name, color }])
  }

  const deleteProject = (id) => {
    const project = projects.find(p => p.id === id)
    setProjects(prev => prev.filter(p => p.id !== id))
    if (project) setTasks(prev => prev.filter(t => t.project !== project.name))
  }

  const renameProject = (id, newName) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, name: newName } : p))
  }

  const updateProjectColor = (id, color) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, color } : p))
  }

  return (
    <AppContext.Provider value={{
      projects, tasks, loading, error, actionError,
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
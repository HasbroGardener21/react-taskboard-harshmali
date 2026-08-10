import { createContext, useContext, useState, useEffect } from 'react'

const AppContext = createContext()

export function AppProvider({ children }) {
  const [projects, setProjects] = useState(() => {
    const saved = localStorage.getItem('projects')
    return saved ? JSON.parse(saved) : [{ id: 1, name: "Inbox" }]
  })

  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('tasks')
    return saved ? JSON.parse(saved) : []
  })

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'dark'
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark')
  }

  // PERSIST TO LOCALSTORAGE
  useEffect(() => {
    localStorage.setItem('projects', JSON.stringify(projects))
  }, [projects])

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks))
  }, [tasks])

  // SEED FROM API ON FIRST LOAD ONLY
  useEffect(() => {
    const alreadySeeded = localStorage.getItem('seeded')
    if (alreadySeeded) return

    fetch('https://jsonplaceholder.typicode.com/todos?_limit=10')
      .then(res => res.json())
      .then(data => {
        const seededTasks = data.map(item => ({
          id: item.id,
          title: item.title,
          done: item.completed,
          projectId: 1
        }))
        setTasks(seededTasks)
        localStorage.setItem('seeded', 'true')
      })
      .catch(err => console.error('Failed to fetch seed data:', err))
  }, [])

  // TASKS
  const addTask = (title, projectId) => {
    const newTask = {
      id: Date.now(),
      title,
      done: false,
      projectId
    }
    setTasks(prev => [...prev, newTask])
  }

  const deleteTask = (id) => {
    setTasks(prev => prev.filter(t => t.id !== id))
  }

  const toggleDone = (id) => {
    setTasks(prev => prev.map(t =>
      t.id === id ? { ...t, done: !t.done } : t
    ))
  }

  const updateTask = (id, newTitle) => {
    setTasks(prev => prev.map(t =>
      t.id === id ? { ...t, title: newTitle } : t
    ))
  }

  const moveTask = (taskId, newProjectId) => {
    setTasks(prev => prev.map(t =>
      t.id === taskId ? { ...t, projectId: newProjectId } : t
    ))
  }

  const reorderTasks = (reorderedList) => {
    setTasks(prev => [
      ...prev.filter(t => t.projectId !== reorderedList[0].projectId),
      ...reorderedList
    ])
  }

  // PROJECTS
  const addProject = (name) => {
    const newProject = { id: Date.now(), name }
    setProjects(prev => [...prev, newProject])
  }

  const deleteProject = (id) => {
    setProjects(prev => prev.filter(p => p.id !== id))
    setTasks(prev => prev.filter(t => t.projectId !== id))
  }

  const renameProject = (id, newName) => {
    setProjects(prev => prev.map(p =>
      p.id === id ? { ...p, name: newName } : p
    ))
  }

  return (
    <AppContext.Provider value={{
      projects, tasks,
      addTask, deleteTask, toggleDone, updateTask, moveTask, reorderTasks,
      addProject, deleteProject, renameProject, theme, toggleTheme
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  return useContext(AppContext)
}
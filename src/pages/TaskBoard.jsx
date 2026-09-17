import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { useAuth } from '../context/AuthContext'
import ProjectSidebar from '../components/ProjectSidebar'
import TaskList from '../components/TaskList'
import AddTaskForm from '../components/AddTaskForm' // Make sure this path is correct!

function TaskBoard({ toggleTheme, theme }) {
  const [activeProjectName, setActiveProjectName] = useState('Inbox')
  const { projects, tasks, loading, error } = useApp()

  const activeProject = projects.find(p => p.name === activeProjectName)
  const activeTasks = tasks.filter(t => t.project === activeProjectName)

  if (loading) return (
    <div style={{ padding: '40px', color: 'var(--text-muted)' }}>
      Loading tasks...
    </div>
  )

  if (error) return (
    <div style={{ padding: '40px', color: 'var(--danger)' }}>
      {error}
    </div>
  )

  return (
    <div className="board">
      <ProjectSidebar
        activeProjectName={activeProjectName}
        onSelectProject={setActiveProjectName}
        toggleTheme={toggleTheme}
        theme={theme}
      />
      <main className="main">
        <div className="main-header">
          <div
            className="project-color-dot"
            style={{ background: activeProject?.color || '#888' }}
          />
          <h1>{activeProjectName}</h1>
        </div>
        <p className="task-count">
          {activeTasks.filter(t => !t.done).length} tasks remaining
        </p>
        
        {/* THIS IS THE WIRING FIX: Rendering your new component instead of the old hardcoded HTML */}
        <AddTaskForm projectName={activeProjectName} />
        
        <TaskList tasks={activeTasks} />
      </main>
    </div>
  )
}

export default TaskBoard
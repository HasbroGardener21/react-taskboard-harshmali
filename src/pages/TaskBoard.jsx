import { useState } from 'react'
import { useApp } from '../context/AppContext'
import ProjectSidebar from '../components/ProjectSidebar'
import TaskList from '../components/TaskList'
import AddTaskForm from '../components/AddTaskForm'

function TaskBoard({ toggleTheme, theme }) {
  const [activeProjectId, setActiveProjectId] = useState(1)
  const { projects, tasks } = useApp()

  const activeTasks = tasks.filter(t => t.projectId === activeProjectId)
  const activeProject = projects.find(p => p.id === activeProjectId)

  return (
    <div className="board">
      <ProjectSidebar
        activeProjectId={activeProjectId}
        onSelectProject={setActiveProjectId}
        toggleTheme={toggleTheme}
        theme={theme}
      />
      <main className="main">
        <div className="main-header">
          <div className="project-color-dot" style={{ background: activeProject?.color || '#888' }} />
          <h1>{activeProject?.name}</h1>
        </div>
        <p className="task-count">{activeTasks.filter(t => !t.done).length} tasks remaining</p>
        
        <AddTaskForm projectId={activeProjectId} />
        <TaskList tasks={activeTasks} />
      </main>
    </div>
  )
}

export default TaskBoard
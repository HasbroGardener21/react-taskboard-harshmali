import { useState } from 'react'
import { useApp } from '../context/AppContext'
import ProjectSidebar from '../components/ProjectSidebar'
import TaskList from '../components/TaskList'
import AddTaskForm from '../components/AddTaskForm'

function TaskBoard() {
  const [activeProjectId, setActiveProjectId] = useState(1)
  const { projects, tasks } = useApp()

  const activeTasks = tasks.filter(t => t.projectId === activeProjectId)
  const activeProject = projects.find(p => p.id === activeProjectId)

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <ProjectSidebar
        activeProjectId={activeProjectId}
        onSelectProject={setActiveProjectId}
      />
      <main style={{ flex: 1, padding: '20px' }}>
        <h1>{activeProject?.name}</h1>
        <p>{activeTasks.filter(t => !t.done).length} tasks remaining</p>
        <AddTaskForm projectId={activeProjectId} />
        <TaskList tasks={activeTasks} />
      </main>
    </div>
  )
}

export default TaskBoard
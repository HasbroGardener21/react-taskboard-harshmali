import { useParams, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'

function TaskDetails() {
  const { id } = useParams()
  const { tasks, toggleDone, deleteTask, projects } = useApp()
  const navigate = useNavigate()

  const task = tasks.find(t => t.id === Number(id))
  const project = projects.find(p => p.id === task?.projectId)

  if (!task) return (
    <div className="task-details">
      <button className="back-btn" onClick={() => navigate('/')}>← Back</button>
      <p style={{ marginTop: '24px', color: 'var(--text-muted)' }}>Task not found.</p>
    </div>
  )

  return (
    <div className="task-details">
      <button className="back-btn" onClick={() => navigate('/')}>← Back</button>

      <h1 style={{ fontSize: '24px', marginTop: '16px', marginBottom: '8px', fontWeight: 700 }}>
        {task.title}
      </h1>

      <p className="detail-status">
        Project: {project?.name || 'Unknown'}
      </p>

      <p className="detail-status">
        Status: {task.done ? '✅ Complete' : '⏳ Pending'}
      </p>

      <div className="detail-actions">
        <button onClick={() => toggleDone(task.id)}>
          {task.done ? 'Mark Incomplete' : 'Mark Complete'}
        </button>
        <button
          className="btn-danger"
          onClick={() => { deleteTask(task.id); navigate('/') }}
        >
          Delete Task
        </button>
      </div>
    </div>
  )
}

export default TaskDetails
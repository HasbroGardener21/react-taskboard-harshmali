import { useParams, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'

function TaskDetails() {
  const { id } = useParams()
  const { tasks, toggleDone, deleteTask } = useApp()
  const navigate = useNavigate()

  const task = tasks.find(t => t.id === Number(id))

  if (!task) return (
    <div>
      <p>Task not found.</p>
      <button onClick={() => navigate('/')}>Back to Board</button>
    </div>
  )

  return (
    <div style={{ padding: '40px' }}>
      <button onClick={() => navigate('/')}>← Back</button>
      <h1>{task.title}</h1>
      <p>Status: {task.done ? "✅ Complete" : "⏳ Pending"}</p>
      <button onClick={() => toggleDone(task.id)}>
        {task.done ? "Mark Incomplete" : "Mark Complete"}
      </button>
      <button
        onClick={() => { deleteTask(task.id); navigate('/') }}
        style={{ marginLeft: '8px', color: 'red' }}
      >
        Delete Task
      </button>
    </div>
  )
}

export default TaskDetails
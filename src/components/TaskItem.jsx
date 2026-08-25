import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'

function TaskItem({ task }) {
  const { deleteTask, toggleDone, updateTask, moveTask, reorderTasks, projects, tasks } = useApp()
  const [editing, setEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(task.title)
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const handleSave = () => {
    if (!editTitle.trim() || editTitle.trim().length < 3) {
      setError("Title must be at least 3 characters")
      return
    }
    updateTask(task._id, editTitle.trim())
    setEditing(false)
    setError("")
  }

  const handleMoveUp = () => {
    const projectTasks = tasks.filter(t => t.project === task.project)
    const idx = projectTasks.findIndex(t => t._id === task._id)
    if (idx === 0) return
    const reordered = [...projectTasks]
    ;[reordered[idx - 1], reordered[idx]] = [reordered[idx], reordered[idx - 1]]
    reorderTasks(reordered)
  }

  const handleMoveDown = () => {
    const projectTasks = tasks.filter(t => t.project === task.project)
    const idx = projectTasks.findIndex(t => t._id === task._id)
    if (idx === projectTasks.length - 1) return
    const reordered = [...projectTasks]
    ;[reordered[idx], reordered[idx + 1]] = [reordered[idx + 1], reordered[idx]]
    reorderTasks(reordered)
  }

  return (
    <div className={`task-item ${task.done ? 'done' : ''} ${editing ? 'editing' : ''}`} style={{ opacity: task.done ? 0.6 : 1 }}>
      <input
        type="checkbox"
        checked={task.done}
        onChange={() => toggleDone(task._id)}
      />
      {editing ? (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div className="task-edit">
            <input
              value={editTitle}
              onChange={e => {
                setEditTitle(e.target.value)
                if (error) setError("")
              }}
            />
            <button className="edit-save" onClick={handleSave}>Save</button>
            <button className="edit-cancel" onClick={() => {
              setEditing(false)
              setEditTitle(task.title)
              setError("")
            }}>Cancel</button>
          </div>
          {error && <span className="error-msg" style={{ marginTop: '4px' }}>{error}</span>}
        </div>
      ) : (
        <span
          className={`task-title ${task.done ? 'done' : ''}`}
          onClick={() => navigate(`/task/${task._id}`)}
        >
          {task.title}
        </span>
      )}

      <div className="task-actions">
        <select
          value={task.project}
          onChange={e => moveTask(task._id, e.target.value)}
        >
          {projects.map(p => (
            <option key={p.id} value={p.name}>{p.name}</option>
          ))}
        </select>
        <button onClick={handleMoveUp} title="Move Up">↑</button>
        <button onClick={handleMoveDown} title="Move Down">↓</button>
        <button onClick={() => setEditing(true)} title="Edit">✎</button>
        <button className="delete-task-btn" onClick={() => deleteTask(task._id)} title="Delete">❌</button>
      </div>
    </div>
  )
}

export default TaskItem
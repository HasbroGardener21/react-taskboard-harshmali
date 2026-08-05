import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'

function TaskItem({ task }) {
  const { deleteTask, toggleDone, updateTask, moveTask, reorderTasks, projects, tasks } = useApp()
  const [editing, setEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(task.title)
  const navigate = useNavigate()

  const handleSave = () => {
    if (!editTitle.trim() || editTitle.trim().length < 3) return
    updateTask(task.id, editTitle.trim())
    setEditing(false)
  }

  const handleMoveUp = () => {
    const projectTasks = tasks.filter(t => t.projectId === task.projectId)
    const idx = projectTasks.findIndex(t => t.id === task.id)
    if (idx === 0) return
    const reordered = [...projectTasks]
    ;[reordered[idx - 1], reordered[idx]] = [reordered[idx], reordered[idx - 1]]
    reorderTasks(reordered)
  }

  const handleMoveDown = () => {
    const projectTasks = tasks.filter(t => t.projectId === task.projectId)
    const idx = projectTasks.findIndex(t => t.id === task.id)
    if (idx === projectTasks.length - 1) return
    const reordered = [...projectTasks]
    ;[reordered[idx], reordered[idx + 1]] = [reordered[idx + 1], reordered[idx]]
    reorderTasks(reordered)
  }

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '8px',
      borderBottom: '1px solid #eee',
      opacity: task.done ? 0.6 : 1
    }}>
      <input
        type="checkbox"
        checked={task.done}
        onChange={() => toggleDone(task.id)}
      />

      {editing ? (
        <>
          <input value={editTitle} onChange={e => setEditTitle(e.target.value)} />
          <button onClick={handleSave}>Save</button>
          <button onClick={() => setEditing(false)}>Cancel</button>
        </>
      ) : (
        <span
          onClick={() => navigate(`/task/${task.id}`)}
          style={{
            flex: 1,
            cursor: 'pointer',
            textDecoration: task.done ? 'line-through' : 'none'
          }}
        >
          {task.title}
        </span>
      )}

      <select
        value={task.projectId}
        onChange={e => moveTask(task.id, Number(e.target.value))}
      >
        {projects.map(p => (
          <option key={p.id} value={p.id}>{p.name}</option>
        ))}
      </select>

      <button onClick={handleMoveUp}>↑</button>
      <button onClick={handleMoveDown}>↓</button>
      <button onClick={() => setEditing(true)}>✏️</button>
      <button onClick={() => deleteTask(task.id)}>🗑️</button>
    </div>
  )
}

export default TaskItem
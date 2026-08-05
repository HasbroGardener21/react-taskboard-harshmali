import { useState } from 'react'
import { useApp } from '../context/AppContext'

function AddTaskForm({ projectId }) {
  const { addTask } = useApp()
  const [title, setTitle] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = () => {
    if (!title.trim() || title.trim().length < 3) {
      setError("Title must be at least 3 characters")
      return
    }
    addTask(title.trim(), projectId)
    setTitle("")
    setError("")
  }

  return (
    <div style={{ marginBottom: '16px' }}>
      <input
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="Add a task..."
        onKeyDown={e => e.key === 'Enter' && handleSubmit()}
      />
      <button onClick={handleSubmit}>Add</button>
      {error && <p style={{ color: 'red', fontSize: '12px' }}>{error}</p>}
    </div>
  )
}

export default AddTaskForm
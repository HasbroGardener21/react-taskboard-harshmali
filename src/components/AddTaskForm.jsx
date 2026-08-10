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
    <div className="add-task-form">
      <div className="add-task-row">
        <input
          value={title}
          onChange={e => {
            setTitle(e.target.value)
            if (error) setError("") // Clear error when typing
          }}
          placeholder="Add a task..."
          onKeyDown={e => e.key === 'Enter' && handleSubmit()}
        />
        <button onClick={handleSubmit}>Add</button>
      </div>
      {error && <span className="error-msg">{error}</span>}
    </div>
  )
}

export default AddTaskForm
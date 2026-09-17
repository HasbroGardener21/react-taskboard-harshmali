import { useState } from 'react'
import { useApp } from '../context/AppContext'

function AddTaskForm({ projectName }) {
  const { addTask } = useApp()
  const [title, setTitle] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = async () => {
    if (!title.trim() || title.trim().length < 3) {
      setError("Title must be at least 3 characters")
      return
    }
    await addTask(title.trim(), projectName)
    setTitle("")
    setError("")
  }

  return (
    <div className="add-task-form">
      <div className="add-task-row">
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Add a task..."
          onKeyDown={e => e.key === 'Enter' && handleSubmit()}
        />
        <button onClick={handleSubmit}>Add</button>
      </div>
      {error && <p className="error-msg">{error}</p>}
    </div>
  )
}

export default AddTaskForm
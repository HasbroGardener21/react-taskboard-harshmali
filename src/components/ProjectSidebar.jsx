import { useState } from 'react'
import { useApp } from '../context/AppContext'

function ProjectSidebar({ activeProjectId, onSelectProject }) {
  const { projects, addProject, deleteProject, renameProject } = useApp()
  const [newProjectName, setNewProjectName] = useState("")
  const [editingId, setEditingId] = useState(null)
  const [editName, setEditName] = useState("")

  const handleAdd = () => {
    if (!newProjectName.trim()) return
    addProject(newProjectName.trim())
    setNewProjectName("")
  }

  const handleRename = (id) => {
    if (!editName.trim()) return
    renameProject(id, editName.trim())
    setEditingId(null)
  }

  return (
    <aside style={{ width: '220px', borderRight: '1px solid #ccc', padding: '20px' }}>
      <h2>Projects</h2>

      {projects.map(p => (
        <div key={p.id} style={{ marginBottom: '8px' }}>
          {editingId === p.id ? (
            <>
              <input
                value={editName}
                onChange={e => setEditName(e.target.value)}
              />
              <button onClick={() => handleRename(p.id)}>Save</button>
              <button onClick={() => setEditingId(null)}>Cancel</button>
            </>
          ) : (
            <>
              <span
                onClick={() => onSelectProject(p.id)}
                style={{
                  cursor: 'pointer',
                  fontWeight: activeProjectId === p.id ? 'bold' : 'normal'
                }}
              >
                {p.name}
              </span>
              <button onClick={() => { setEditingId(p.id); setEditName(p.name) }}>✏️</button>
              {p.id !== 1 && (
                <button onClick={() => deleteProject(p.id)}>🗑️</button>
              )}
            </>
          )}
        </div>
      ))}

      <div style={{ marginTop: '16px' }}>
        <input
          value={newProjectName}
          onChange={e => setNewProjectName(e.target.value)}
          placeholder="New project..."
        />
        <button onClick={handleAdd}>Add</button>
      </div>
    </aside>
  )
}

export default ProjectSidebar
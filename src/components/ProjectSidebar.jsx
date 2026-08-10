import { useState } from 'react'
import { useApp } from '../context/AppContext'

const COLORS = [
  "#ff6b6b", "#ffa94d", "#ffd43b",
  "#69db7c", "#4dabf7", "#da77f2",
  "#888888", "#ffffff"
]

function ProjectSidebar({ activeProjectId, onSelectProject, toggleTheme, theme }) {
  const { projects, addProject, deleteProject, renameProject, updateProjectColor } = useApp()
  const [newProjectName, setNewProjectName] = useState("")
  const [newProjectColor, setNewProjectColor] = useState("#4dabf7")
  const [editingId, setEditingId] = useState(null)
  const [editName, setEditName] = useState("")
  const [showColorPicker, setShowColorPicker] = useState(false)

  const handleAdd = () => {
    if (!newProjectName.trim()) return
    addProject(newProjectName.trim(), newProjectColor)
    setNewProjectName("")
    setNewProjectColor("#4dabf7")
    setShowColorPicker(false)
  }

  const handleRename = (id) => {
    if (!editName.trim()) return
    renameProject(id, editName.trim())
    setEditingId(null)
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>Projects</h2>
        <button className="theme-toggle" onClick={toggleTheme}>
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
      </div>

      {projects.map(p => (
        <div
          key={p.id}
          className={`project-item ${activeProjectId === p.id ? 'active' : ''}`}
        >
          <div
            className="project-dot"
            style={{ background: p.color || '#888' }}
          />
          {editingId === p.id ? (
            <>
              <input
                value={editName}
                onChange={e => setEditName(e.target.value)}
              />
              <button onClick={() => handleRename(p.id)}>Save</button>
              <button onClick={() => setEditingId(null)}>✕</button>
            </>
          ) : (
            <>
              <span onClick={() => onSelectProject(p.id)}>{p.name}</span>
              <button onClick={() => { setEditingId(p.id); setEditName(p.name) }}>✏️</button>
              {p.id !== 1 && (
                <button onClick={() => deleteProject(p.id)}>🗑️</button>
              )}
            </>
          )}
        </div>
      ))}

      <div className="new-project">
        <div className="new-project-row">
          <input
            value={newProjectName}
            onChange={e => setNewProjectName(e.target.value)}
            placeholder="New project..."
            onKeyDown={e => e.key === 'Enter' && handleAdd()}
          />
          <button onClick={handleAdd}>Add</button>
        </div>

        <button
          style={{ fontSize: '12px', background: 'none', border: 'none', color: 'var(--text-muted)', padding: '0', textAlign: 'left' }}
          onClick={() => setShowColorPicker(!showColorPicker)}
        >
          {showColorPicker ? 'Hide colors' : '🎨 Pick color'}
        </button>

        {showColorPicker && (
          <div className="color-picker-row">
            {COLORS.map(color => (
              <div
                key={color}
                className={`color-swatch ${newProjectColor === color ? 'selected' : ''}`}
                style={{ background: color }}
                onClick={() => setNewProjectColor(color)}
              />
            ))}
          </div>
        )}
      </div>
    </aside>
  )
}

export default ProjectSidebar
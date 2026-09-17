import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { useAuth } from '../context/AuthContext'

const COLORS = [
  "#ff6b6b", "#ffa94d", "#ffd43b",
  "#69db7c", "#4dabf7", "#da77f2",
  "#888888", "#ffffff"
]

function ProjectSidebar({ activeProjectName, onSelectProject, toggleTheme, theme }) {
  const { logout, user } = useAuth()
  const { projects, addProject, deleteProject, renameProject } = useApp()
  const [newProjectName, setNewProjectName] = useState("")
  const [newProjectColor, setNewProjectColor] = useState("#4dabf7")
  const [editingId, setEditingId] = useState(null)
  const [editName, setEditName] = useState("")
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)

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
    <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        {!isCollapsed && <h2>Projects</h2>}
        <div className="sidebar-header-actions">
          <button className="theme-toggle" onClick={toggleTheme}>
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
          <button
            className="sidebar-toggle"
            onClick={() => setIsCollapsed(!isCollapsed)}
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isCollapsed ? '☰' : '◀'}
          </button>
        </div>
      </div>

      <div className="project-list">
        {projects.map(p => (
          <div
            key={p.id}
            className={`project-item ${p.name === activeProjectName ? 'active' : ''}`}
          >
            <div
              className="project-dot"
              style={{ background: p.color || '#888' }}
              onClick={() => { if (isCollapsed) onSelectProject(p.name) }}
            />

            {!isCollapsed && (
              <>
                {editingId === p.id ? (
                  <div className="project-edit">
                    <input
                      value={editName}
                      onChange={e => setEditName(e.target.value)}
                    />
                    <button onClick={() => handleRename(p.id)}></button>
                    <button onClick={() => setEditingId(null)}></button>
                  </div>
                ) : (
                  <>
                    <span onClick={() => onSelectProject(p.name)}>{p.name}</span>
                    <div className="project-actions">
                      <button onClick={() => { setEditingId(p.id); setEditName(p.name) }}>✎</button>
                      {p.id !== 'inbox' && (
                        <button onClick={() => deleteProject(p.id)}>🗑️</button>
                      )}
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        ))}
      </div>

      {!isCollapsed && (
        <div className="new-project">
          <div className="new-project-row">
            <input
              value={newProjectName}
              onChange={e => setNewProjectName(e.target.value)}
              placeholder="New project..."
              onKeyDown={e => e.key === 'Enter' && handleAdd()}
            />
            <button className="add-project-btn" onClick={handleAdd}>Add</button>
          </div>
          <button
            className="color-picker-toggle"
            onClick={() => setShowColorPicker(!showColorPicker)}
          >
            {showColorPicker ? 'Hide colors' : 'Pick color'}
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
      )}

      <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
        <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>
          {user?.email}
        </p>
        <button onClick={logout} style={{ width: '100%' }}>
          Logout
        </button>
      </div>
    </aside>
  )
}

export default ProjectSidebar
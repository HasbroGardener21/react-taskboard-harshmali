import { useState } from 'react'
import { useApp } from '../context/AppContext'

const COLORS = [
  "#ff6b6b", "#ffa94d", "#ffd43b",
  "#69db7c", "#4dabf7", "#da77f2",
  "#888888", "#ffffff"
]

function ProjectSidebar({ activeProjectId, onSelectProject, toggleTheme, theme }) {
  const { projects, addProject, deleteProject, renameProject } = useApp()
  const [newProjectName, setNewProjectName] = useState("")
  const [newProjectColor, setNewProjectColor] = useState("#4dabf7")
  const [editingId, setEditingId] = useState(null)
  const [editName, setEditName] = useState("")
  const [showColorPicker, setShowColorPicker] = useState(false)
  
  // 1. Add state for the sidebar
  const [isCollapsed, setIsCollapsed] = useState(false)

  const handleAdd = () => {
    if (!newProjectName.trim()) return
    // Note: Assuming addProject context handles color, if not, update AppContext.jsx later
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
    // 2. Conditionally apply the 'collapsed' class based on state
    <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        {!isCollapsed && <h2>Projects</h2>}
        <div className="sidebar-header-actions">
          <button className="theme-toggle" onClick={toggleTheme}>
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
          {/* 3. Add the toggle button your CSS expects */}
          <button 
            className="sidebar-toggle" 
            onClick={() => setIsCollapsed(!isCollapsed)}
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isCollapsed ? '☰' : '◀'}
          </button>
        </div>
      </div>

      {/* 4. Wrap projects in the project-list div for CSS targeting */}
      <div className="project-list">
        {projects.map(p => (
          <div
            key={p.id}
            className={`project-item ${activeProjectId === p.id ? 'active' : ''}`}
          >
            <div
              className="project-dot"
              style={{ background: p.color || '#888' }}
              onClick={() => { if(isCollapsed) onSelectProject(p.id) }} 
            />
            
            {/* 5. Hide text and actions when collapsed */}
            {!isCollapsed && (
              <>
                {editingId === p.id ? (
                  <div className="project-edit">
                    <input
                      value={editName}
                      onChange={e => setEditName(e.target.value)}
                    />
                    <button onClick={() => handleRename(p.id)}>💾</button>
                    <button onClick={() => setEditingId(null)}>❌</button>
                  </div>
                ) : (
                  <>
                    <span onClick={() => onSelectProject(p.id)}>{p.name}</span>
                    {/* 6. Wrap actions in project-actions div so they show on hover */}
                    <div className="project-actions">
                      <button onClick={() => { setEditingId(p.id); setEditName(p.name) }}>✎</button>
                      {p.id !== 1 && (
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
      )}
    </aside>
  )
}

export default ProjectSidebar
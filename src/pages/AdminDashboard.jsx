import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    fetch('http://localhost:5000/api/admin/tasks', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(async res => {
        if (!res.ok) throw new Error('Unauthorized or failed to fetch admin tasks');
        return res.json();
      })
      .then(data => {
        setTasks(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleDeleteTask = async (taskId) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:5000/api/admin/tasks/${taskId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setTasks(tasks.filter(t => t._id !== taskId));
      }
    } catch (err) {
      console.error('Failed to delete task', err);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'var(--bg-main, #121212)',
      color: 'var(--text-main, #e0e0e0)',
      padding: '40px 20px',
      fontFamily: 'Inter, sans-serif'
    }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        
        {/* Header Section */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '8px', color: '#fff' }}>
               Admin Control Center
            </h1>
            <p style={{ color: '#a0aec0', fontSize: '14px' }}>
              Manage system-wide tasks and monitor application resources.
            </p>
          </div>
          <button
            onClick={() => navigate('/')}
            style={{
              backgroundColor: '#2d3748',
              color: '#fff',
              border: 'none',
              padding: '10px 16px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '500',
              transition: 'background 0.2s'
            }}
          >
            ← Back to TaskBoard
          </button>
        </div>

        {error && (
          <div style={{ backgroundColor: '#fed7d7', color: '#9b2c2c', padding: '12px 16px', borderRadius: '6px', marginBottom: '20px' }}>
            {error}
          </div>
        )}

        {/* Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' }}>
          <div style={{ backgroundColor: '#1e1e1e', border: '1px solid #2d2d2d', padding: '20px', borderRadius: '8px' }}>
            <p style={{ fontSize: '13px', color: '#a0aec0', marginBottom: '4px' }}>System-Wide Tasks</p>
            <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: '#fff' }}>{tasks.length}</h3>
          </div>
        </div>

        {/* Tasks Container */}
        <div style={{ backgroundColor: '#1e1e1e', border: '1px solid #2d2d2d', borderRadius: '8px', padding: '24px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: '#fff' }}>
            All User Tasks
          </h2>

          {loading ? (
            <p style={{ color: '#a0aec0', textAlign: 'center', padding: '20px' }}>Loading system tasks...</p>
          ) : tasks.length === 0 ? (
            <p style={{ color: '#a0aec0', textAlign: 'center', padding: '20px' }}>No tasks found in the system.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {tasks.map(task => {
                // Determine owner display string safely
                const ownerDisplay = typeof task.user === 'object' && task.user !== null
                  ? task.user.email
                  : task.user;

                return (
                  <div
                    key={task._id}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '16px',
                      backgroundColor: '#252525',
                      border: '1px solid #2e2e2e',
                      borderRadius: '6px'
                    }}
                  >
                    <div>
                      <h4 style={{ fontSize: '15px', fontWeight: '600', color: '#fff', marginBottom: '4px' }}>
                        {task.title}
                      </h4>
                      <p style={{ fontSize: '13px', color: '#a0aec0', margin: 0 }}>
                        {task.description || 'No description provided.'}
                      </p>
                      <span style={{ fontSize: '11px', color: '#718096', marginTop: '6px', display: 'inline-block' }}>
                        Owner: {ownerDisplay || 'Unknown'}
                      </span>
                    </div>
                    <button
                      onClick={() => handleDeleteTask(task._id)}
                      style={{
                        backgroundColor: '#9b2c2c',
                        color: '#fff',
                        border: 'none',
                        padding: '8px 12px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: '500',
                        transition: 'background 0.2s'
                      }}
                    >
                      Force Delete
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
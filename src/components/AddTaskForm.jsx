import { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';

export default function AddTaskForm({ projectName }) {
  const [title, setTitle] = useState('');
  const [attachmentUrl, setAttachmentUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const { addTask } = useApp();
  const fileInputRef = useRef(null);

  const handleFileUpload = async (file) => {
    if (!file) return;
    setIsUploading(true);
    
    const formData = new FormData();
    formData.append('image', file);
    
    const token = localStorage.getItem('token');
    
    try {
      const res = await fetch('http://localhost:5000/api/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });
      
      if (!res.ok) throw new Error('Upload failed');
      const data = await res.json();
      setAttachmentUrl(data.imageUrl);
    } catch (err) {
      console.error("Upload error:", err);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setAttachmentUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    addTask(title, projectName, attachmentUrl);
    setTitle('');
    setAttachmentUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = ''; 
  };

  return (
    <form onSubmit={handleSubmit} style={{ backgroundColor: '#1e1e1e', padding: '20px', borderRadius: '12px', border: '1px solid #333', marginBottom: '24px', boxShadow: '0 4px 6px rgba(0,0,0,0.3)' }}>
      <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
        <input
          type="text"
          placeholder="What needs to be done?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ flex: 1, backgroundColor: '#252525', color: '#fff', padding: '12px 16px', borderRadius: '8px', border: '1px solid #444', outline: 'none', fontSize: '14px' }}
        />
        <button
          type="submit"
          disabled={isUploading || !title.trim()}
          style={{ backgroundColor: '#4dabf7', color: '#000', fontWeight: 'bold', padding: '0 20px', borderRadius: '8px', border: 'none', cursor: (isUploading || !title.trim()) ? 'not-allowed' : 'pointer', opacity: (isUploading || !title.trim()) ? 0.6 : 1 }}
        >
          {isUploading ? 'Uploading...' : 'Add Task'}
        </button>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {/* Custom Clean File Upload Button */}
        <div style={{ position: 'relative', overflow: 'hidden', display: 'inline-block' }}>
          <button type="button" style={{ backgroundColor: '#2a2a2a', border: '1px solid #444', color: '#a0aec0', padding: '8px 16px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' }}>
            Choose Image
          </button>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={(e) => handleFileUpload(e.target.files[0])}
            style={{ position: 'absolute', left: 0, top: 0, opacity: 0, cursor: 'pointer', height: '100%', width: '100%' }}
          />
        </div>

        {attachmentUrl && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#252525', padding: '6px 12px', borderRadius: '6px', border: '1px solid #333' }}>
            {/* Real SVG Checkmark (No more broken diamonds) */}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <span style={{ color: '#4ade80', fontSize: '12px', fontWeight: 'bold' }}>Attached</span>
            <button
              type="button"
              onClick={handleRemoveImage}
              style={{ marginLeft: '8px', background: 'none', border: 'none', color: '#f87171', fontSize: '12px', textDecoration: 'underline', cursor: 'pointer' }}
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </form>
  );
}
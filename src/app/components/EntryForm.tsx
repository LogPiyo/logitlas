import { useState, useEffect } from 'react';

export default function EntryForm() {
    const [position, setPosition] = useState({ x: 0, y: 100 });
    const [isDragging, setIsDragging] = useState(false);
  
    const [theoremName, setTheoremName] = useState('');
    const [dependency, setDependency] = useState('');
  
    // ドラッグ処理
    useEffect(() => {
      const handleMouseMove = (e: MouseEvent) => {
        if (isDragging) {
          setPosition((prev) => ({
            x: prev.x + e.movementX,
            y: prev.y + e.movementY,
          }));
        }
      };
  
      const handleMouseUp = () => setIsDragging(false);
  
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }, [isDragging]);
  
    const handleMouseDown = () => setIsDragging(true);
  
    // フォーム送信
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
  
      if (!theoremName) {
        alert('Theorem name is required');
        return;
      }
  
      try {
        const res = await fetch('/api/add-theorem', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            theoremName,
            dependencies: dependency,
          }),
        });
  
        if (res.ok) {
          alert('Theorem added successfully!');
          setTheoremName('');
          setDependency('');
        } else {
          alert('Failed to add theorem');
        }
      } catch (error) {
        alert('Error: ' + error);
      }
    };
  
    return (
      <div
        style={{
          position: 'absolute',
          left: position.x,
          top: position.y,
          border: '2px solid white',
          borderRadius: '4px',
          padding: '10px',
          cursor: 'move',
          backgroundColor: 'black',
          zIndex: 2000,
          userSelect: 'none',
          width: 250,
        }}
        onMouseDown={handleMouseDown}
      >
        <h2 style={{ color: 'white' }}>Add Theorem</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label style={{ color: 'white' }}>Theorem Name</label>
            <br />
            <input
              name="theoremName"
              value={theoremName}
              onChange={(e) => setTheoremName(e.target.value)}
              required
              style={{ width: '100%' }}
            />
          </div>
          <div style={{ marginTop: 8 }}>
            <label style={{ color: 'white' }}>Dependencies (comma separated)</label>
            <br />
            <input
              name="dependency"
              value={dependency}
              onChange={(e) => setDependency(e.target.value)}
              placeholder="e.g. 0,2"
              style={{ width: '100%' }}
            />
          </div>
          <button
            type="submit"
            style={{
              marginTop: 10,
              padding: '6px 12px',
              cursor: 'pointer',
              backgroundColor: '#4caf50',
              color: 'white',
              border: 'none',
              borderRadius: 4,
              width: '100%',
            }}
          >
            Add
          </button>
        </form>
      </div>
    );
  }
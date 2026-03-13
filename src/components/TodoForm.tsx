'use client';

import { useState } from 'react';

interface TodoFormProps {
  onCreate: (title: string, description: string) => Promise<void>;
}

export default function TodoForm({ onCreate }: TodoFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await onCreate(title, description);
      setTitle('');
      setDescription('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create todo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-card">
      <h2>➕ Add New Todo</h2>
      <form onSubmit={handleSubmit}>
        {error && (
          <div className="error-banner">
            <span>⚠️</span> {error}
          </div>
        )}
        <div className="form-group">
          <label htmlFor="todo-title">Title <span style={{ color: '#ef4444' }}>*</span></label>
          <input
            id="todo-title"
            type="text"
            className="form-control"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What needs to be done?"
            disabled={loading}
            autoComplete="off"
          />
        </div>
        <div className="form-group">
          <label htmlFor="todo-description">Description <span style={{ color: '#94a3b8', fontSize: '0.8em' }}>(optional)</span></label>
          <textarea
            id="todo-description"
            className="form-control"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add more details..."
            disabled={loading}
            rows={3}
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Adding...' : '+ Add Todo'}
        </button>
      </form>
    </div>
  );
}

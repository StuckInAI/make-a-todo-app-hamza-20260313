'use client';

import { useState } from 'react';
import type { Todo } from './TodoList';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: number, completed: boolean) => Promise<void>;
  onUpdate: (id: number, title: string, description: string) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

export default function TodoItem({ todo, onToggle, onUpdate, onDelete }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [editDescription, setEditDescription] = useState(todo.description || '');
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  const handleToggle = () => {
    onToggle(todo.id, !todo.completed);
  };

  const handleEditStart = () => {
    setEditTitle(todo.title);
    setEditDescription(todo.description || '');
    setEditError(null);
    setIsEditing(true);
  };

  const handleEditCancel = () => {
    setIsEditing(false);
    setEditError(null);
  };

  const handleEditSave = async () => {
    if (!editTitle.trim()) {
      setEditError('Title is required');
      return;
    }
    setSaving(true);
    setEditError(null);
    try {
      await onUpdate(todo.id, editTitle, editDescription);
      setIsEditing(false);
    } catch (e) {
      setEditError(e instanceof Error ? e.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Delete this todo?')) return;
    setDeleting(true);
    await onDelete(todo.id);
  };

  const formattedDate = new Date(todo.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className={`todo-item${todo.completed ? ' completed' : ''}`}>
      <div className="todo-item-header">
        <input
          type="checkbox"
          className="todo-checkbox"
          checked={todo.completed}
          onChange={handleToggle}
          title={todo.completed ? 'Mark as pending' : 'Mark as completed'}
        />
        <div className="todo-content">
          <div className="todo-title">{todo.title}</div>
          {todo.description && (
            <div className="todo-description">{todo.description}</div>
          )}
          <div className="todo-meta">
            <span className="todo-date">📅 {formattedDate}</span>
            <span className={`badge ${todo.completed ? 'badge-completed' : 'badge-pending'}`}>
              {todo.completed ? '✓ Done' : '⏳ Pending'}
            </span>
          </div>
        </div>
        <div className="todo-actions">
          {!isEditing && (
            <button
              className="btn btn-ghost"
              onClick={handleEditStart}
              title="Edit todo"
            >
              ✏️ Edit
            </button>
          )}
          <button
            className="btn btn-danger"
            onClick={handleDelete}
            disabled={deleting}
            title="Delete todo"
          >
            {deleting ? '...' : '🗑️ Delete'}
          </button>
        </div>
      </div>

      {isEditing && (
        <div className="edit-form">
          {editError && (
            <div className="error-banner" style={{ marginBottom: '0.75rem' }}>
              <span>⚠️</span> {editError}
            </div>
          )}
          <div className="form-group">
            <label>Title *</label>
            <input
              type="text"
              className="form-control"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              placeholder="Todo title"
              autoFocus
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              className="form-control"
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              placeholder="Optional description"
              rows={2}
            />
          </div>
          <div className="edit-actions">
            <button className="btn btn-ghost" onClick={handleEditCancel} disabled={saving}>
              Cancel
            </button>
            <button className="btn btn-save" onClick={handleEditSave} disabled={saving}>
              {saving ? 'Saving...' : '💾 Save'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

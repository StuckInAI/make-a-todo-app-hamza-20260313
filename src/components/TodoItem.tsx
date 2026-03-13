"use client";

import { useState } from 'react';

export interface TodoData {
  id: number;
  title: string;
  description: string | null;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

interface TodoItemProps {
  todo: TodoData;
  onToggle: (id: number, completed: boolean) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  onUpdate: (id: number, title: string, description: string) => Promise<void>;
}

export default function TodoItem({ todo, onToggle, onDelete, onUpdate }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [editDescription, setEditDescription] = useState(todo.description || '');
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  const handleToggle = async () => {
    await onToggle(todo.id, !todo.completed);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(todo.id);
    } catch {
      setIsDeleting(false);
    }
  };

  const handleEditSubmit = async () => {
    setEditError(null);
    if (!editTitle.trim()) {
      setEditError('Title cannot be empty.');
      return;
    }
    setIsSaving(true);
    try {
      await onUpdate(todo.id, editTitle.trim(), editDescription.trim());
      setIsEditing(false);
    } catch {
      setEditError('Failed to save changes.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditCancel = () => {
    setEditTitle(todo.title);
    setEditDescription(todo.description || '');
    setEditError(null);
    setIsEditing(false);
  };

  const formattedDate = new Date(todo.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div
      className={`bg-white rounded-2xl shadow-sm border transition-all ${
        todo.completed ? 'border-green-200 opacity-75' : 'border-gray-200'
      } p-4 mb-3`}
    >
      {isEditing ? (
        <div>
          {editError && (
            <div className="mb-2 text-xs text-red-600 bg-red-50 border border-red-200 rounded px-2 py-1">
              {editError}
            </div>
          )}
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm mb-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            disabled={isSaving}
            autoFocus
          />
          <textarea
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            placeholder="Description (optional)"
            rows={2}
            className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
            disabled={isSaving}
          />
          <div className="flex gap-2">
            <button
              onClick={handleEditSubmit}
              disabled={isSaving}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white text-xs font-medium py-1.5 rounded-lg transition-colors"
            >
              {isSaving ? 'Saving...' : 'Save'}
            </button>
            <button
              onClick={handleEditCancel}
              disabled={isSaving}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium py-1.5 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={handleToggle}
            className="mt-1 h-4 w-4 cursor-pointer accent-indigo-600 flex-shrink-0"
            title={todo.completed ? 'Mark incomplete' : 'Mark complete'}
          />
          <div className="flex-1 min-w-0">
            <p
              className={`text-sm font-medium break-words ${
                todo.completed ? 'line-through text-gray-400' : 'text-gray-800'
              }`}
            >
              {todo.title}
            </p>
            {todo.description && (
              <p
                className={`text-xs mt-0.5 break-words ${
                  todo.completed ? 'line-through text-gray-300' : 'text-gray-500'
                }`}
              >
                {todo.description}
              </p>
            )}
            <p className="text-xs text-gray-300 mt-1">{formattedDate}</p>
          </div>
          <div className="flex gap-1 flex-shrink-0">
            <button
              onClick={() => setIsEditing(true)}
              className="text-xs text-indigo-500 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-2 py-1 rounded-lg transition-colors font-medium"
              title="Edit"
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="text-xs text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 disabled:opacity-50 px-2 py-1 rounded-lg transition-colors font-medium"
              title="Delete"
            >
              {isDeleting ? '...' : 'Delete'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

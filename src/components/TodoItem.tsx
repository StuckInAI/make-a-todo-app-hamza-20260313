'use client';

import { useState } from 'react';
import { TodoItem as TodoItemType } from '@/app/page';

interface TodoItemProps {
  todo: TodoItemType;
  onToggle: (id: number, completed: boolean) => Promise<void>;
  onUpdate: (
    id: number,
    title: string,
    description: string,
    completed: boolean
  ) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

export default function TodoItem({
  todo,
  onToggle,
  onUpdate,
  onDelete,
}: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [editDescription, setEditDescription] = useState(
    todo.description || ''
  );
  const [saving, setSaving] = useState(false);
  const [toggling, setToggling] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [titleError, setTitleError] = useState('');

  const handleToggle = async () => {
    setToggling(true);
    try {
      await onToggle(todo.id, !todo.completed);
    } finally {
      setToggling(false);
    }
  };

  const handleEdit = () => {
    setEditTitle(todo.title);
    setEditDescription(todo.description || '');
    setTitleError('');
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setTitleError('');
  };

  const handleSave = async () => {
    if (!editTitle.trim()) {
      setTitleError('Title is required');
      return;
    }
    setSaving(true);
    try {
      await onUpdate(todo.id, editTitle.trim(), editDescription.trim(), todo.completed);
      setIsEditing(false);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await onDelete(todo.id);
    } finally {
      setDeleting(false);
    }
  };

  const formattedDate = new Date(todo.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  if (isEditing) {
    return (
      <div className="bg-white rounded-2xl shadow-md border border-indigo-100 p-5 transition-all">
        <div className="flex flex-col gap-3">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={editTitle}
              onChange={(e) => {
                setEditTitle(e.target.value);
                if (e.target.value.trim()) setTitleError('');
              }}
              className={`w-full border ${
                titleError ? 'border-red-400' : 'border-gray-200'
              } rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition`}
              autoFocus
            />
            {titleError && (
              <p className="text-red-500 text-xs mt-1">{titleError}</p>
            )}
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Description
            </label>
            <textarea
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              rows={2}
              className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition resize-none"
            />
          </div>
          <div className="flex gap-2 justify-end">
            <button
              onClick={handleCancel}
              className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 rounded-xl transition-colors flex items-center gap-2"
            >
              {saving ? (
                <>
                  <svg
                    className="animate-spin h-3.5 w-3.5"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    />
                  </svg>
                  Saving...
                </>
              ) : (
                'Save'
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`bg-white rounded-2xl shadow-sm border transition-all duration-200 p-5 flex items-start gap-4 group ${
        todo.completed
          ? 'border-gray-100 opacity-70'
          : 'border-gray-100 hover:shadow-md hover:border-indigo-100'
      }`}
    >
      {/* Checkbox */}
      <button
        onClick={handleToggle}
        disabled={toggling}
        className={`mt-0.5 flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
          todo.completed
            ? 'bg-green-500 border-green-500 text-white'
            : 'border-gray-300 hover:border-indigo-400'
        } disabled:opacity-50`}
        title={todo.completed ? 'Mark as incomplete' : 'Mark as complete'}
      >
        {toggling ? (
          <svg
            className="animate-spin h-3 w-3"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            />
          </svg>
        ) : todo.completed ? (
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M5 13l4 4L19 7"
            />
          </svg>
        ) : null}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p
          className={`text-base font-semibold break-words ${
            todo.completed
              ? 'line-through text-gray-400'
              : 'text-gray-800'
          }`}
        >
          {todo.title}
        </p>
        {todo.description && (
          <p
            className={`text-sm mt-1 break-words ${
              todo.completed ? 'text-gray-300 line-through' : 'text-gray-500'
            }`}
          >
            {todo.description}
          </p>
        )}
        <p className="text-xs text-gray-300 mt-2">{formattedDate}</p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <button
          onClick={handleEdit}
          className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
          title="Edit todo"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
        </button>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
          title="Delete todo"
        >
          {deleting ? (
            <svg
              className="animate-spin h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              />
            </svg>
          ) : (
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}

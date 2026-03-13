'use client';

import { useState } from 'react';

interface TodoFormProps {
  onSubmit: (title: string, description: string) => Promise<void>;
}

export default function TodoForm({ onSubmit }: TodoFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [titleError, setTitleError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setTitleError('Title is required');
      return;
    }
    setTitleError('');
    setSubmitting(true);
    try {
      await onSubmit(title.trim(), description.trim());
      setTitle('');
      setDescription('');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
    >
      <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
        <span className="text-2xl">➕</span> Add New Todo
      </h2>
      <div className="flex flex-col gap-3">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-semibold text-gray-700 mb-1"
          >
            Title <span className="text-red-500">*</span>
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (e.target.value.trim()) setTitleError('');
            }}
            placeholder="What needs to be done?"
            className={`w-full border ${
              titleError ? 'border-red-400' : 'border-gray-200'
            } rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition`}
          />
          {titleError && (
            <p className="text-red-500 text-xs mt-1">{titleError}</p>
          )}
        </div>
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-semibold text-gray-700 mb-1"
          >
            Description <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add more details..."
            rows={2}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition resize-none"
          />
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="self-end bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-semibold px-6 py-2.5 rounded-xl transition-colors duration-200 text-sm flex items-center gap-2 shadow-sm"
        >
          {submitting ? (
            <>
              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
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
              Adding...
            </>
          ) : (
            'Add Todo'
          )}
        </button>
      </div>
    </form>
  );
}

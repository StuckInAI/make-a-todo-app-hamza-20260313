'use client';

import { TodoItem as TodoItemType } from '@/app/page';
import TodoItem from './TodoItem';

interface TodoListProps {
  todos: TodoItemType[];
  loading: boolean;
  onToggle: (id: number, completed: boolean) => Promise<void>;
  onUpdate: (
    id: number,
    title: string,
    description: string,
    completed: boolean
  ) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

export default function TodoList({
  todos,
  loading,
  onToggle,
  onUpdate,
  onDelete,
}: TodoListProps) {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-400">
        <svg
          className="animate-spin h-10 w-10 mb-4 text-indigo-400"
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
        <p className="text-lg font-medium">Loading todos...</p>
      </div>
    );
  }

  if (todos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-400">
        <span className="text-6xl mb-4">📋</span>
        <p className="text-xl font-semibold text-gray-500">No todos yet!</p>
        <p className="text-sm mt-1">Add your first todo above to get started.</p>
      </div>
    );
  }

  const pending = todos.filter((t) => !t.completed);
  const completed = todos.filter((t) => t.completed);

  return (
    <div className="flex flex-col gap-6">
      {pending.length > 0 && (
        <div>
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-3 px-1">
            Pending ({pending.length})
          </h3>
          <div className="flex flex-col gap-3">
            {pending.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={onToggle}
                onUpdate={onUpdate}
                onDelete={onDelete}
              />
            ))}
          </div>
        </div>
      )}

      {completed.length > 0 && (
        <div>
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3 px-1">
            Completed ({completed.length})
          </h3>
          <div className="flex flex-col gap-3">
            {completed.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={onToggle}
                onUpdate={onUpdate}
                onDelete={onDelete}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

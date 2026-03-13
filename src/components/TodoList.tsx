"use client";

import { useState, useEffect, useCallback } from 'react';
import TodoForm from './TodoForm';
import TodoItem, { TodoData } from './TodoItem';

export default function TodoList() {
  const [todos, setTodos] = useState<TodoData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTodos = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/todos');
      if (!res.ok) throw new Error('Failed to fetch todos');
      const data = await res.json() as TodoData[];
      setTodos(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const handleAdd = async (title: string, description: string) => {
    const res = await fetch('/api/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description }),
    });
    if (!res.ok) {
      const data = await res.json() as { error?: string };
      throw new Error(data.error || 'Failed to create todo');
    }
    const newTodo = await res.json() as TodoData;
    setTodos((prev) => [newTodo, ...prev]);
  };

  const handleToggle = async (id: number, completed: boolean) => {
    const res = await fetch(`/api/todos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed }),
    });
    if (!res.ok) throw new Error('Failed to update todo');
    const updated = await res.json() as TodoData;
    setTodos((prev) => prev.map((t) => (t.id === id ? updated : t)));
  };

  const handleDelete = async (id: number) => {
    const res = await fetch(`/api/todos/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete todo');
    setTodos((prev) => prev.filter((t) => t.id !== id));
  };

  const handleUpdate = async (id: number, title: string, description: string) => {
    const res = await fetch(`/api/todos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description }),
    });
    if (!res.ok) {
      const data = await res.json() as { error?: string };
      throw new Error(data.error || 'Failed to update todo');
    }
    const updated = await res.json() as TodoData;
    setTodos((prev) => prev.map((t) => (t.id === id ? updated : t)));
  };

  const completedCount = todos.filter((t) => t.completed).length;
  const totalCount = todos.length;

  return (
    <div>
      <TodoForm onAdd={handleAdd} />

      <div className="bg-white rounded-2xl shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-700">Your Todos</h2>
          {!isLoading && !error && totalCount > 0 && (
            <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
              {completedCount}/{totalCount} done
            </span>
          )}
        </div>

        {isLoading && (
          <div className="flex items-center justify-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            <span className="ml-3 text-sm text-gray-500">Loading todos...</span>
          </div>
        )}

        {!isLoading && error && (
          <div className="text-center py-8">
            <p className="text-red-500 text-sm mb-3">{error}</p>
            <button
              onClick={fetchTodos}
              className="text-sm text-indigo-600 hover:text-indigo-800 underline"
            >
              Try again
            </button>
          </div>
        )}

        {!isLoading && !error && todos.length === 0 && (
          <div className="text-center py-10">
            <p className="text-4xl mb-3">🎉</p>
            <p className="text-gray-400 text-sm">No todos yet. Add one above!</p>
          </div>
        )}

        {!isLoading && !error && todos.length > 0 && (
          <div>
            {todos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={handleToggle}
                onDelete={handleDelete}
                onUpdate={handleUpdate}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

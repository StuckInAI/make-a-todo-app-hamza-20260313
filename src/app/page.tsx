import TodoList from '@/components/TodoList';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-indigo-700 mb-2">📝 Todo App</h1>
          <p className="text-gray-500">Stay organized and get things done</p>
        </div>
        <TodoList />
      </div>
    </main>
  );
}

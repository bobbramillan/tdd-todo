import { useState, useEffect } from 'react';
import { Trash2, Plus, Check, Calendar, Moon, Sun } from 'lucide-react';

export default function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved === 'true';
  });

  // Persist dark mode preference
  useEffect(() => {
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  // Auto-delete expired todos
  useEffect(() => {
    const checkExpiredTodos = () => {
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      
      setTodos(prevTodos => 
        prevTodos.filter(todo => {
          const todoDueDate = new Date(todo.dueDate);
          todoDueDate.setHours(0, 0, 0, 0);
          return todoDueDate >= now;
        })
      );
    };

    checkExpiredTodos();
    const interval = setInterval(checkExpiredTodos, 1000);
    return () => clearInterval(interval);
  }, []);

  const addTodo = () => {
    if (input.trim() && dueDate) {
      const newTodo = {
        id: Date.now(),
        text: input,
        completed: false,
        dueDate: dueDate
      };
      
      const updatedTodos = [...todos, newTodo].sort((a, b) => 
        new Date(a.dueDate) - new Date(b.dueDate)
      );
      
      setTodos(updatedTodos);
      setInput('');
      setDueDate('');
    }
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id) => {
    const todo = todos.find(t => t.id === id);
    if (todo && todo.completed) {
      setTodos(todos.filter(todo => todo.id !== id));
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addTodo();
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const isOverdue = (dateString) => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const dueDate = new Date(dateString);
    dueDate.setHours(0, 0, 0, 0);
    return dueDate < now;
  };

  const isDueToday = (dateString) => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const dueDate = new Date(dateString);
    dueDate.setHours(0, 0, 0, 0);
    return dueDate.getTime() === now.getTime();
  };

  return (
    <div 
      className={`min-h-screen py-12 px-4 transition-colors duration-300 ${
        darkMode 
          ? 'bg-gradient-to-br from-gray-900 to-gray-800' 
          : 'bg-gradient-to-br from-slate-100 to-slate-200'
      } ${darkMode ? 'dark' : ''}`}
      data-testid="app-container"
    >
      <div className="max-w-3xl mx-auto">
        <div className={`rounded-2xl shadow-xl p-8 md:p-12 transition-colors duration-300 ${
          darkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
          <div className="flex justify-between items-center mb-10">
            <h1 className={`text-5xl font-bold text-center flex-1 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              My To-Do List
            </h1>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-3 rounded-lg transition-all hover:scale-110 ${
                darkMode 
                  ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              data-testid="dark-mode-toggle"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun size={24} /> : <Moon size={24} />}
            </button>
          </div>
          
          <div className="flex flex-col md:flex-row gap-3 mb-10" data-testid="add-todo-form">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Add a new task..."
              className={`flex-1 px-6 py-4 text-lg border-2 rounded-xl focus:outline-none focus:ring-4 transition-all ${
                darkMode
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-400 focus:ring-blue-900'
                  : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-100'
              }`}
              data-testid="todo-input"
            />
            <div className="relative">
              <Calendar className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${
                darkMode ? 'text-gray-400' : 'text-gray-400'
              }`} size={20} />
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                onKeyPress={handleKeyPress}
                className={`w-full md:w-auto px-12 py-4 text-lg border-2 rounded-xl focus:outline-none focus:ring-4 transition-all ${
                  darkMode
                    ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-400 focus:ring-blue-900'
                    : 'bg-white border-gray-200 text-gray-900 focus:border-blue-500 focus:ring-blue-100'
                }`}
                data-testid="date-input"
              />
            </div>
            <button
              onClick={addTodo}
              className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-xl flex items-center justify-center gap-2 transition-all font-medium text-lg shadow-md hover:shadow-lg"
              data-testid="add-button"
            >
              <Plus size={24} />
              Add
            </button>
          </div>

          <div className="space-y-3 mb-8" data-testid="todo-list">
            {todos.length === 0 ? (
              <p className={`text-center py-16 text-xl ${
                darkMode ? 'text-gray-500' : 'text-gray-400'
              }`} data-testid="empty-state">
                No tasks yet. Add one above!
              </p>
            ) : (
              todos.map(todo => (
                <div
                  key={todo.id}
                  className={`flex items-center gap-4 p-5 rounded-xl transition-all group ${
                    darkMode 
                      ? 'bg-gray-700 hover:bg-gray-650' 
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                  data-testid={`todo-item-${todo.id}`}
                >
                  <button
                    onClick={() => toggleTodo(todo.id)}
                    className={`flex-shrink-0 w-7 h-7 rounded-lg border-2 flex items-center justify-center transition-all ${
                      todo.completed
                        ? 'bg-green-500 border-green-500 scale-100'
                        : darkMode
                        ? 'border-gray-500 hover:border-green-400 hover:scale-110'
                        : 'border-gray-300 hover:border-green-400 hover:scale-110'
                    }`}
                    data-testid={`toggle-${todo.id}`}
                  >
                    {todo.completed && <Check size={18} className="text-white" strokeWidth={3} />}
                  </button>
                  
                  <div className="flex-1">
                    <span
                      className={`block text-lg ${
                        todo.completed
                          ? darkMode ? 'line-through text-gray-500' : 'line-through text-gray-400'
                          : darkMode ? 'text-white' : 'text-gray-800'
                      }`}
                      data-testid={`todo-text-${todo.id}`}
                    >
                      {todo.text}
                    </span>
                    <span 
                      className={`text-sm flex items-center gap-1 mt-1 ${
                        isDueToday(todo.dueDate) 
                          ? 'text-orange-500 font-medium' 
                          : isOverdue(todo.dueDate)
                          ? 'text-red-500 font-medium'
                          : darkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}
                    >
                      <Calendar size={14} />
                      {formatDate(todo.dueDate)}
                      {isDueToday(todo.dueDate) && ' (Today)'}
                      {isOverdue(todo.dueDate) && ' (Overdue)'}
                    </span>
                  </div>
                  
                  <button
                    onClick={() => deleteTodo(todo.id)}
                    disabled={!todo.completed}
                    className={`transition-all ${
                      todo.completed
                        ? darkMode 
                          ? 'text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 cursor-pointer'
                          : 'text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 cursor-pointer'
                        : darkMode
                        ? 'text-gray-700 cursor-not-allowed opacity-50'
                        : 'text-gray-300 cursor-not-allowed opacity-50'
                    }`}
                    data-testid={`delete-${todo.id}`}
                    title={todo.completed ? 'Delete task' : 'Complete task first to delete'}
                  >
                    <Trash2 size={22} />
                  </button>
                </div>
              ))
            )}
          </div>

          <div className={`text-center text-base border-t pt-6 ${
            darkMode ? 'text-gray-400 border-gray-700' : 'text-gray-500 border-gray-200'
          }`}>
            {todos.length} {todos.length === 1 ? 'task' : 'tasks'} total
            {todos.filter(t => t.completed).length > 0 && (
              <span className="ml-3">
                • {todos.filter(t => t.completed).length} completed
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
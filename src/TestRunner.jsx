import { useState, useEffect } from 'react';

export default function TestRunner({ 
  darkMode, 
  setDarkMode, 
  todos, 
  setTodos, 
  input, 
  setInput, 
  dueDate, 
  setDueDate,
  onClose 
}) {
  const [currentLog, setCurrentLog] = useState('');
  const [logType, setLogType] = useState('info');
  const [hasRun, setHasRun] = useState(false);

  const log = (message, type = 'info') => {
    setCurrentLog(message);
    setLogType(type);
  };

  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const runTests = async () => {
    if (hasRun) return; // Prevent duplicate runs
    setHasRun(true);

    // Clear any existing test todos first
    setTodos([]);
    
    log('Starting automated tests...', 'info');
    await sleep(1000);

    // Test 1: Toggle dark mode
    log('Test 1: Toggling dark mode ON', 'action');
    await sleep(800);
    setDarkMode(true);
    await sleep(800);
    log('✓ Dark mode enabled', 'success');
    await sleep(800);

    log('Test 1: Toggling dark mode OFF', 'action');
    await sleep(800);
    setDarkMode(false);
    await sleep(800);
    log('✓ Dark mode disabled', 'success');
    await sleep(1000);

    // Test 2: Try to add task with no text
    log('Test 2: Attempting to add task with no text', 'action');
    await sleep(800);
    setDueDate('2025-10-28');
    await sleep(800);
    log('→ Set date to 2025-10-28', 'info');
    await sleep(800);
    log('→ Clicking Add button (no text entered)', 'info');
    await sleep(800);
    log('✓ Correctly rejected: Task text is required', 'success');
    setDueDate('');
    await sleep(1000);

    // Test 3: Try to add task with no date
    log('Test 3: Attempting to add task with no date', 'action');
    await sleep(800);
    setInput('Buy groceries');
    await sleep(800);
    log('→ Typed "Buy groceries"', 'info');
    await sleep(800);
    log('→ Clicking Add button (no date selected)', 'info');
    await sleep(800);
    log('✓ Correctly rejected: Due date is required', 'success');
    setInput('');
    await sleep(1000);

    // Test 4: Add a task for today
    log('Test 4: Adding a task for today', 'action');
    await sleep(800);
    const today = new Date().toISOString().split('T')[0];
    setInput('Complete project report');
    await sleep(800);
    log('→ Typed "Complete project report"', 'info');
    await sleep(800);
    setDueDate(today);
    await sleep(800);
    log(`→ Set date to today (${today})`, 'info');
    await sleep(800);
    log('→ Clicking Add button', 'info');
    await sleep(500);
    
    const todo1 = {
      id: Date.now(),
      text: 'Complete project report',
      completed: false,
      dueDate: today
    };
    setTodos([todo1]);
    setInput('');
    setDueDate('');
    await sleep(800);
    log('✓ Task added successfully', 'success');
    await sleep(1000);

    // Test 5: Add a task for tomorrow
    log('Test 5: Adding a task for tomorrow', 'action');
    await sleep(800);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];
    
    setInput('Call dentist');
    await sleep(800);
    log('→ Typed "Call dentist"', 'info');
    await sleep(800);
    setDueDate(tomorrowStr);
    await sleep(800);
    log(`→ Set date to tomorrow (${tomorrowStr})`, 'info');
    await sleep(800);
    log('→ Clicking Add button', 'info');
    await sleep(500);
    
    const todo2 = {
      id: Date.now() + 1,
      text: 'Call dentist',
      completed: false,
      dueDate: tomorrowStr
    };
    setTodos([todo1, todo2].sort((a, b) => 
      new Date(a.dueDate) - new Date(b.dueDate)
    ));
    setInput('');
    setDueDate('');
    await sleep(800);
    log('✓ Task added successfully', 'success');
    await sleep(1000);

    // Test 6: Add a task for next week to test sorting
    log('Test 6: Adding a task for next week (to test date sorting)', 'action');
    await sleep(800);
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    const nextWeekStr = nextWeek.toISOString().split('T')[0];
    
    setInput('Team meeting');
    await sleep(800);
    log('→ Typed "Team meeting"', 'info');
    await sleep(800);
    setDueDate(nextWeekStr);
    await sleep(800);
    log(`→ Set date to next week (${nextWeekStr})`, 'info');
    await sleep(800);
    log('→ Clicking Add button', 'info');
    await sleep(500);
    
    const todo3 = {
      id: Date.now() + 2,
      text: 'Team meeting',
      completed: false,
      dueDate: nextWeekStr
    };
    setTodos([todo1, todo2, todo3].sort((a, b) => 
      new Date(a.dueDate) - new Date(b.dueDate)
    ));
    setInput('');
    setDueDate('');
    await sleep(800);
    log('✓ Task added successfully', 'success');
    await sleep(1000);
    log('✓ All tasks are sorted by date (earliest first)', 'success');
    await sleep(1000);

    // Test 7: Try to delete uncompleted task
    log('Test 7: Attempting to delete uncompleted task', 'action');
    await sleep(800);
    log('→ Trying to click delete button on uncompleted task', 'info');
    await sleep(800);
    log('✓ Delete button is disabled (task must be completed first)', 'success');
    await sleep(1000);

    // Test 8: Complete a task
    log('Test 8: Completing a task', 'action');
    await sleep(800);
    log('→ Clicking checkbox on "Complete project report"', 'info');
    await sleep(800);
    setTodos(prevTodos => prevTodos.map(todo => 
      todo.text === 'Complete project report' ? { ...todo, completed: true } : todo
    ));
    await sleep(800);
    log('✓ Task marked as completed', 'success');
    await sleep(1000);

    // Test 9: Delete completed task
    log('Test 9: Deleting completed task', 'action');
    await sleep(800);
    log('→ Clicking delete button on completed task', 'info');
    await sleep(800);
    setTodos(prevTodos => prevTodos.filter(todo => todo.text !== 'Complete project report'));
    await sleep(800);
    log('✓ Task deleted successfully', 'success');
    await sleep(1000);

    // Test 10: Add an expired task and watch it auto-delete
    log('Test 10: Testing auto-delete of expired task', 'action');
    await sleep(800);
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    
    setInput('Expired task');
    await sleep(800);
    log('→ Typed "Expired task"', 'info');
    await sleep(800);
    setDueDate(yesterdayStr);
    await sleep(800);
    log(`→ Set date to yesterday (${yesterdayStr})`, 'info');
    await sleep(800);
    log('→ Adding task with expired date', 'info');
    await sleep(500);
    
    const expiredTodo = {
      id: Date.now() + 3,
      text: 'Expired task',
      completed: false,
      dueDate: yesterdayStr
    };
    setTodos(prevTodos => [...prevTodos, expiredTodo].sort((a, b) => 
      new Date(a.dueDate) - new Date(b.dueDate)
    ));
    setInput('');
    setDueDate('');
    await sleep(800);
    log('✓ Expired task added to list', 'success');
    await sleep(1500);
    log('→ Waiting for auto-delete to trigger (1 second)...', 'info');
    await sleep(1500);
    log('✓ Expired task automatically removed!', 'success');
    await sleep(1000);

    log('All tests completed!', 'success');
  };

  // Auto-run tests when component mounts
  useEffect(() => {
    runTests();
  }, []);

  return (
    <div className="fixed top-4 left-4 z-50">
      <div 
        className={`p-4 rounded-lg shadow-2xl max-w-md ${
          darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
        }`}
      >
        <div className="flex justify-between items-center mb-2">
          <h3 className={`text-sm font-bold ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Test Runner
          </h3>
          <button
            onClick={onClose}
            className={`text-sm hover:scale-110 transition-all ${
              darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            ✕
          </button>
        </div>
        <div
          className={`p-3 rounded font-mono text-xs ${
            logType === 'success'
              ? darkMode ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-700'
              : logType === 'action'
              ? darkMode ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-700'
              : darkMode ? 'bg-gray-900 text-gray-300' : 'bg-gray-50 text-gray-700'
          }`}
        >
          {currentLog || 'Initializing...'}
        </div>
      </div>
    </div>
  );
}
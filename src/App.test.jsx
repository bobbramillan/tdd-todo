import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, within, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import App from './App';

describe('TodoApp', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('renders the app title', () => {
    render(<App />);
    expect(screen.getByText('My To-Do List')).toBeInTheDocument();
  });

  it('shows empty state when no todos', () => {
    render(<App />);
    expect(screen.getByTestId('empty-state')).toHaveTextContent('No tasks yet');
  });

  it('requires a due date to add a todo', async () => {
    const user = userEvent.setup({ delay: null });
    render(<App />);
    
    const input = screen.getByTestId('todo-input');
    const addButton = screen.getByTestId('add-button');
    
    await user.type(input, 'Buy groceries');
    await user.click(addButton);
    
    expect(screen.getByTestId('empty-state')).toBeInTheDocument();
  });

  it('adds a new todo with due date', async () => {
    const user = userEvent.setup({ delay: null });
    render(<App />);
    
    const input = screen.getByTestId('todo-input');
    const dateInput = screen.getByTestId('date-input');
    const addButton = screen.getByTestId('add-button');
    
    await user.type(input, 'Buy groceries');
    await user.type(dateInput, '2025-12-31');
    await user.click(addButton);
    
    expect(screen.getByText('Buy groceries')).toBeInTheDocument();
    // Just check that a date exists with the task
    const todoItem = screen.getByText('Buy groceries').closest('[data-testid^="todo-item-"]');
    expect(within(todoItem).getByText(/2025/)).toBeInTheDocument();
    expect(input).toHaveValue('');
    expect(dateInput).toHaveValue('');
  });

  it('adds todo on Enter key press with due date', async () => {
    const user = userEvent.setup({ delay: null });
    render(<App />);
    
    const input = screen.getByTestId('todo-input');
    const dateInput = screen.getByTestId('date-input');
    
    await user.type(input, 'Walk the dog');
    await user.type(dateInput, '2025-12-25');
    await user.type(dateInput, '{Enter}');
    
    expect(screen.getByText('Walk the dog')).toBeInTheDocument();
  });

  it('cannot delete unchecked todo', async () => {
    const user = userEvent.setup({ delay: null });
    render(<App />);
    
    const input = screen.getByTestId('todo-input');
    const dateInput = screen.getByTestId('date-input');
    
    await user.type(input, 'Cannot delete me');
    await user.type(dateInput, '2025-12-31');
    await user.click(screen.getByTestId('add-button'));
    
    const todoItem = screen.getByText('Cannot delete me').closest('[data-testid^="todo-item-"]');
    const todoId = todoItem.getAttribute('data-testid').replace('todo-item-', '');
    const deleteButton = screen.getByTestId(`delete-${todoId}`);
    
    // Delete button should be disabled
    expect(deleteButton).toBeDisabled();
  });

  it('can delete checked todo', async () => {
    const user = userEvent.setup({ delay: null });
    render(<App />);
    
    const input = screen.getByTestId('todo-input');
    const dateInput = screen.getByTestId('date-input');
    
    await user.type(input, 'Delete me after check');
    await user.type(dateInput, '2025-12-31');
    await user.click(screen.getByTestId('add-button'));
    
    const todoItem = screen.getByText('Delete me after check').closest('[data-testid^="todo-item-"]');
    const todoId = todoItem.getAttribute('data-testid').replace('todo-item-', '');
    
    // Check the todo first
    const toggleButton = screen.getByTestId(`toggle-${todoId}`);
    await user.click(toggleButton);
    
    // Now delete button should be enabled
    const deleteButton = screen.getByTestId(`delete-${todoId}`);
    expect(deleteButton).not.toBeDisabled();
    
    await user.click(deleteButton);
    expect(screen.queryByText('Delete me after check')).not.toBeInTheDocument();
  });

  it('displays todos sorted by due date (earliest first)', async () => {
    const user = userEvent.setup({ delay: null });
    render(<App />);
    
    // Add tasks in random order
    await user.type(screen.getByTestId('todo-input'), 'Task C');
    await user.type(screen.getByTestId('date-input'), '2025-12-31');
    await user.click(screen.getByTestId('add-button'));
    
    await user.type(screen.getByTestId('todo-input'), 'Task A');
    await user.type(screen.getByTestId('date-input'), '2025-11-15');
    await user.click(screen.getByTestId('add-button'));
    
    await user.type(screen.getByTestId('todo-input'), 'Task B');
    await user.type(screen.getByTestId('date-input'), '2025-12-01');
    await user.click(screen.getByTestId('add-button'));
    
    const todoItems = screen.getAllByTestId(/^todo-item-/);
    const todoTexts = todoItems.map(item => 
      within(item).getByTestId(/^todo-text-/).textContent
    );
    
    // Should be sorted by date
    expect(todoTexts).toEqual(['Task A', 'Task B', 'Task C']);
  });

  it('auto-deletes todo when due date is reached', async () => {
    const user = userEvent.setup({ delay: null });
    const now = new Date('2025-10-27T00:00:00');
    vi.setSystemTime(now);
    
    render(<App />);
    
    // Add a task that expires today
    await user.type(screen.getByTestId('todo-input'), 'Expires today');
    await user.type(screen.getByTestId('date-input'), '2025-10-27');
    await user.click(screen.getByTestId('add-button'));
    
    expect(screen.getByText('Expires today')).toBeInTheDocument();
    
    // Fast forward to next day
    const tomorrow = new Date('2025-10-28T00:00:01');
    vi.setSystemTime(tomorrow);
    
    // Run the timer that checks for expired todos
    await act(async () => {
      vi.advanceTimersByTime(1000);
    });
    
    // Task should be auto-deleted
    expect(screen.queryByText('Expires today')).not.toBeInTheDocument();
  });

  it('does not delete todo before due date', async () => {
    const user = userEvent.setup({ delay: null });
    const now = new Date('2025-10-27T12:00:00');
    vi.setSystemTime(now);
    
    render(<App />);
    
    await user.type(screen.getByTestId('todo-input'), 'Future task');
    await user.type(screen.getByTestId('date-input'), '2025-10-30');
    await user.click(screen.getByTestId('add-button'));
    
    expect(screen.getByText('Future task')).toBeInTheDocument();
    
    // Fast forward 1 day (still before due date)
    vi.setSystemTime(new Date('2025-10-28T12:00:00'));
    
    await act(async () => {
      vi.advanceTimersByTime(1000);
    });
    
    // Task should still be there
    expect(screen.getByText('Future task')).toBeInTheDocument();
  });

  it('shows correct task count with dates', async () => {
    const user = userEvent.setup({ delay: null });
    render(<App />);
    
    await user.type(screen.getByTestId('todo-input'), 'Task 1');
    await user.type(screen.getByTestId('date-input'), '2025-12-01');
    await user.click(screen.getByTestId('add-button'));
    
    expect(screen.getByText(/1 task total/)).toBeInTheDocument();
    
    await user.type(screen.getByTestId('todo-input'), 'Task 2');
    await user.type(screen.getByTestId('date-input'), '2025-12-02');
    await user.click(screen.getByTestId('add-button'));
    
    expect(screen.getByText(/2 tasks total/)).toBeInTheDocument();
  });

  it('does not add empty todos even with date', async () => {
    const user = userEvent.setup({ delay: null });
    render(<App />);
    
    await user.type(screen.getByTestId('date-input'), '2025-12-31');
    await user.click(screen.getByTestId('add-button'));
    
    expect(screen.getByTestId('empty-state')).toBeInTheDocument();
  });

  it('does not add todos with only whitespace', async () => {
    const user = userEvent.setup({ delay: null });
    render(<App />);
    
    await user.type(screen.getByTestId('todo-input'), '   ');
    await user.type(screen.getByTestId('date-input'), '2025-12-31');
    await user.click(screen.getByTestId('add-button'));
    
    expect(screen.getByTestId('empty-state')).toBeInTheDocument();
  });

  it('renders dark mode toggle button', () => {
    render(<App />);
    expect(screen.getByTestId('dark-mode-toggle')).toBeInTheDocument();
  });

  it('toggles dark mode when button is clicked', async () => {
    const user = userEvent.setup({ delay: null });
    render(<App />);
    
    const toggleButton = screen.getByTestId('dark-mode-toggle');
    const container = screen.getByTestId('app-container');
    
    // Initially light mode
    expect(container).not.toHaveClass('dark');
    
    // Click to enable dark mode
    await user.click(toggleButton);
    expect(container).toHaveClass('dark');
    
    // Click again to disable dark mode
    await user.click(toggleButton);
    expect(container).not.toHaveClass('dark');
  });

  it('persists dark mode preference across renders', async () => {
    const user = userEvent.setup({ delay: null });
    const { unmount } = render(<App />);
    
    const toggleButton = screen.getByTestId('dark-mode-toggle');
    
    // Enable dark mode
    await user.click(toggleButton);
    expect(screen.getByTestId('app-container')).toHaveClass('dark');
    
    // Unmount and remount component
    unmount();
    render(<App />);
    
    // Dark mode should still be enabled
    expect(screen.getByTestId('app-container')).toHaveClass('dark');
  });
});
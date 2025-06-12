import { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Checkbox,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Paper,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Todo, TodoSortOption, TodoFilterOption } from '../types/todo';

const TodoList = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [sortOption, setSortOption] = useState<TodoSortOption>('date');
  const [filterOption, setFilterOption] = useState<TodoFilterOption>('all');
  const [error, setError] = useState('');

  // Load todos from localStorage on component mount
  useEffect(() => {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      const parsedTodos = JSON.parse(savedTodos);
      // Convert string dates back to Date objects
      setTodos(parsedTodos.map((todo: any) => ({
        ...todo,
        createdAt: new Date(todo.createdAt)
      })));
    }
  }, []);

  // Save todos to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const validateTodo = (text: string): boolean => {
    if (text.trim().length === 0) {
      setError('Todo cannot be empty');
      return false;
    }
    if (text.length > 100) {
      setError('Todo must be less than 100 characters');
      return false;
    }
    setError('');
    return true;
  };

  const handleAddTodo = () => {
    if (!validateTodo(newTodo)) return;

    const todo: Todo = {
      id: crypto.randomUUID(),
      text: newTodo.trim(),
      completed: false,
      createdAt: new Date(),
    };

    setTodos([...todos, todo]);
    setNewTodo('');
  };

  const handleToggleTodo = (id: string) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const handleDeleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const sortTodos = (todos: Todo[]): Todo[] => {
    switch (sortOption) {
      case 'date':
        return [...todos].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      case 'alphabetical':
        return [...todos].sort((a, b) => a.text.localeCompare(b.text));
      case 'completed':
        return [...todos].sort((a, b) => (a.completed === b.completed ? 0 : a.completed ? 1 : -1));
      default:
        return todos;
    }
  };

  const filterTodos = (todos: Todo[]): Todo[] => {
    switch (filterOption) {
      case 'active':
        return todos.filter(todo => !todo.completed);
      case 'completed':
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  };

  const displayTodos = sortTodos(filterTodos(todos));

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4, p: 2 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Todo List
      </Typography>

      <Paper sx={{ p: 2, mb: 2 }}>
        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          <TextField
            fullWidth
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddTodo()}
            placeholder="Add a new todo"
            error={!!error}
            helperText={error}
          />
          <Button
            variant="contained"
            onClick={handleAddTodo}
            sx={{ minWidth: 100 }}
          >
            Add
          </Button>
        </Box>

        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Sort by</InputLabel>
            <Select
              value={sortOption}
              label="Sort by"
              onChange={(e) => setSortOption(e.target.value as TodoSortOption)}
            >
              <MenuItem value="date">Date</MenuItem>
              <MenuItem value="alphabetical">Alphabetical</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Filter</InputLabel>
            <Select
              value={filterOption}
              label="Filter"
              onChange={(e) => setFilterOption(e.target.value as TodoFilterOption)}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Paper>

      <List>
        {displayTodos.map((todo) => (
          <ListItem
            key={todo.id}
            sx={{
              bgcolor: 'background.paper',
              mb: 1,
              borderRadius: 1,
              '&:hover': { bgcolor: 'action.hover' },
            }}
          >
            <Checkbox
              checked={todo.completed}
              onChange={() => handleToggleTodo(todo.id)}
            />
            <ListItemText
              primary={todo.text}
              sx={{
                textDecoration: todo.completed ? 'line-through' : 'none',
                color: todo.completed ? 'text.secondary' : 'text.primary',
              }}
              secondary={todo.createdAt.toLocaleString()}
            />
            <ListItemSecondaryAction>
              <IconButton
                edge="end"
                aria-label="delete"
                onClick={() => handleDeleteTodo(todo.id)}
              >
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>

      <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
        {todos.length} total items, {todos.filter(t => !t.completed).length} remaining
      </Typography>
    </Box>
  );
};

export default TodoList; 
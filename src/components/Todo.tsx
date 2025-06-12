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
  Container,
  Fade,
  Zoom,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import SortIcon from '@mui/icons-material/Sort';
import FilterListIcon from '@mui/icons-material/FilterList';
import type { Todo, TodoSortOption, TodoFilterOption } from '../types/todo';

const TodoList = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [sortOption, setSortOption] = useState<TodoSortOption>('date');
  const [filterOption, setFilterOption] = useState<TodoFilterOption>('all');
  const [error, setError] = useState('');

  useEffect(() => {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      const parsedTodos = JSON.parse(savedTodos);
      setTodos(parsedTodos.map((todo: any) => ({
        ...todo,
        createdAt: new Date(todo.createdAt)
      })));
    }
  }, []);

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
  const activeTodosCount = todos.filter(t => !t.completed).length;

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Fade in timeout={800}>
        <Box>
          <Typography 
            variant="h4" 
            component="h1" 
            gutterBottom 
            sx={{ 
              textAlign: 'center',
              color: 'primary.main',
              mb: 4,
              fontWeight: 600,
              '& span': {
                color: 'secondary.main',
              }
            }}
          >
            My <span>Todo</span> List
          </Typography>

          <Paper 
            elevation={0}
            sx={{ 
              p: 3,
              mb: 4,
              background: 'linear-gradient(145deg, #ffffff 0%, #f8faff 100%)',
            }}
          >
            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
              <TextField
                fullWidth
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddTodo()}
                placeholder="What needs to be done?"
                error={!!error}
                helperText={error}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#ffffff',
                  }
                }}
              />
              <Button
                variant="contained"
                onClick={handleAddTodo}
                startIcon={<AddIcon />}
                sx={{
                  minWidth: 130,
                  height: 56,
                  fontSize: '1rem',
                }}
              >
                Add Task
              </Button>
            </Box>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <SortIcon fontSize="small" />
                    Sort by
                  </Box>
                </InputLabel>
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

              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <FilterListIcon fontSize="small" />
                    Filter
                  </Box>
                </InputLabel>
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

          <List sx={{ mb: 2 }}>
            {displayTodos.map((todo, index) => (
              <Zoom in key={todo.id} style={{ transitionDelay: `${index * 50}ms` }}>
                <ListItem
                  sx={{
                    mb: 1,
                    bgcolor: 'background.paper',
                    borderRadius: 2,
                    boxShadow: '0 2px 14px 0 rgba(32, 40, 45, 0.08)',
                    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 18px 0 rgba(32, 40, 45, 0.12)',
                    },
                  }}
                >
                  <Checkbox
                    checked={todo.completed}
                    onChange={() => handleToggleTodo(todo.id)}
                    sx={{
                      color: 'primary.light',
                      '&.Mui-checked': {
                        color: 'primary.main',
                      },
                    }}
                  />
                  <ListItemText
                    primary={todo.text}
                    secondary={todo.createdAt.toLocaleString()}
                    sx={{
                      '& .MuiListItemText-primary': {
                        textDecoration: todo.completed ? 'line-through' : 'none',
                        color: todo.completed ? 'text.secondary' : 'text.primary',
                        fontWeight: 500,
                      },
                      '& .MuiListItemText-secondary': {
                        fontSize: '0.75rem',
                      },
                    }}
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => handleDeleteTodo(todo.id)}
                      sx={{
                        color: 'error.light',
                        '&:hover': {
                          color: 'error.main',
                          bgcolor: 'error.lighter',
                        },
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              </Zoom>
            ))}
          </List>

          <Fade in timeout={1000}>
            <Paper 
              elevation={0}
              sx={{ 
                p: 2, 
                textAlign: 'center',
                background: 'linear-gradient(145deg, #ffffff 0%, #f8faff 100%)',
              }}
            >
              <Typography 
                variant="body1" 
                color="text.secondary"
                sx={{ 
                  fontWeight: 500,
                  '& span': { 
                    color: 'primary.main',
                    fontWeight: 600,
                  }
                }}
              >
                {todos.length === 0 ? (
                  'No tasks yet. Add your first task!'
                ) : (
                  <>
                    <span>{activeTodosCount}</span> {activeTodosCount === 1 ? 'task' : 'tasks'} remaining out of <span>{todos.length}</span> total
                  </>
                )}
              </Typography>
            </Paper>
          </Fade>
        </Box>
      </Fade>
    </Container>
  );
};

export default TodoList; 
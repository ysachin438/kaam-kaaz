import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  IconButton,
  Checkbox,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import { Close as CloseIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';

const TaskDialog = ({
  open,
  onClose,
  currentTask,
  setCurrentTask,
  handleSaveTask,
  isEditing,
}) => {
  const [localTask, setLocalTask] = useState(currentTask || {});
  const [subtaskInput, setSubtaskInput] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    let taskToSet = currentTask || {};
    // Convert due_date to dueDate in YYYY-MM-DD format if needed
    if (taskToSet.due_date && !taskToSet.dueDate) {
      const date = new Date(taskToSet.due_date);
      if (!isNaN(date)) {
        taskToSet.dueDate = date.toISOString().split('T')[0];
      }
    }
    setLocalTask(taskToSet);
    setSubtaskInput('');
    setError('');
  }, [currentTask, open]);

  // Subtask handlers
  const handleAddSubtask = () => {
    if (!subtaskInput.trim()) return;
    setLocalTask((prev) => ({
      ...prev,
      subtasks: [...(prev.subtasks || []), { title: subtaskInput, completed: false }],
    }));
    setSubtaskInput('');
  };

  const handleRemoveSubtask = (idx) => {
    setLocalTask((prev) => ({
      ...prev,
      subtasks: prev.subtasks.filter((_, i) => i !== idx),
    }));
  };

  const handleToggleSubtask = (idx) => {
    setLocalTask((prev) => ({
      ...prev,
      subtasks: prev.subtasks.map((st, i) => i === idx ? { ...st, completed: !st.completed } : st),
    }));
  };

  const handleSubtaskTitleChange = (idx, value) => {
    setLocalTask((prev) => ({
      ...prev,
      subtasks: prev.subtasks.map((st, i) => i === idx ? { ...st, title: value } : st),
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocalTask((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    // Validation
    if (!localTask.title || !localTask.description || !localTask.dueDate) {
      setError('Title, description, and due date are required');
      return;
    }
    // Convert dueDate to due_date for backend
    const payload = {
      ...localTask,
      due_date: localTask.dueDate,
    };
    delete payload.dueDate;
    setError('');
    handleSaveTask(payload);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ color: '#ff5722' }}>
        {isEditing ? 'Edit Task' : 'Add New Task'}
        <IconButton onClick={onClose} sx={{ position: 'absolute', right: 8, top: 8 }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        {error && (
          <Box mb={2} color="error.main">
            {error}
          </Box>
        )}
        <TextField
          autoFocus
          margin="dense"
          label="Title"
          type="text"
          fullWidth
          value={localTask.title}
          onChange={handleChange}
          name="title"
          sx={{
            mb: 2,
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: 'rgba(255, 87, 34, 0.3)',
              },
              '&:hover fieldset': {
                borderColor: 'rgba(255, 87, 34, 0.5)',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#ff5722',
              },
            },
          }}
        />
        <TextField
          margin="dense"
          label="Description"
          type="text"
          fullWidth
          multiline
          rows={4}
          value={localTask.description}
          onChange={handleChange}
          name="description"
          sx={{
            mb: 2,
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: 'rgba(255, 87, 34, 0.3)',
              },
              '&:hover fieldset': {
                borderColor: 'rgba(255, 87, 34, 0.5)',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#ff5722',
              },
            },
          }}
        />
        <TextField
          margin="dense"
          label="Due Date"
          type="date"
          fullWidth
          value={localTask.dueDate}
          onChange={handleChange}
          name="dueDate"
          InputLabelProps={{ shrink: true }}
          sx={{
            mb: 2,
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: 'rgba(255, 87, 34, 0.3)',
              },
              '&:hover fieldset': {
                borderColor: 'rgba(255, 87, 34, 0.5)',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#ff5722',
              },
            },
          }}
        />
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={localTask.status || 'pending'}
            onChange={handleChange}
            name="status"
            label="Status"
            sx={{
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(255, 87, 34, 0.3)',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(255, 87, 34, 0.5)',
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#ff5722',
              },
            }}
          >
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="inprogress">In Progress</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Priority</InputLabel>
          <Select
            value={localTask.priority || 'medium'}
            onChange={handleChange}
            name="priority"
            label="Priority"
            sx={{
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(255, 87, 34, 0.3)',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(255, 87, 34, 0.5)',
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#ff5722',
              },
            }}
          >
            <MenuItem value="low">Low</MenuItem>
            <MenuItem value="medium">Medium</MenuItem>
            <MenuItem value="high">High</MenuItem>
          </Select>
        </FormControl>
        {/* Subtasks Section */}
        <Box mt={2}>
          <Box display="flex" alignItems="center" gap={1} mb={1}>
            <TextField
              label="Add Subtask"
              value={subtaskInput}
              onChange={e => setSubtaskInput(e.target.value)}
              size="small"
              fullWidth
            />
            <IconButton onClick={handleAddSubtask} color="primary">
              <AddIcon />
            </IconButton>
          </Box>
          <List dense>
            {(localTask.subtasks || []).map((subtask, idx) => (
              <ListItem key={idx} secondaryAction={
                <IconButton edge="end" onClick={() => handleRemoveSubtask(idx)}>
                  <DeleteIcon />
                </IconButton>
              }>
                <Checkbox
                  checked={!!subtask.completed}
                  onChange={() => handleToggleSubtask(idx)}
                />
                <TextField
                  value={subtask.title}
                  onChange={e => handleSubtaskTitleChange(idx, e.target.value)}
                  size="small"
                  variant="standard"
                  sx={{ flex: 1, textDecoration: subtask.completed ? 'line-through' : 'none', opacity: subtask.completed ? 0.6 : 1 }}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} sx={{ color: 'rgba(255, 87, 34, 0.7)' }}>
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          sx={{
            background: 'linear-gradient(45deg, #ff5722 30%, #ff9800 90%)',
            color: '#fff',
          }}
        >
          {isEditing ? 'Update' : 'Add'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TaskDialog; 
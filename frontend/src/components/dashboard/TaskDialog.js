import React from 'react';
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
} from '@mui/material';

const TaskDialog = ({
  open,
  onClose,
  currentTask,
  setCurrentTask,
  handleSaveTask,
  isEditing,
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ color: '#ff5722' }}>
        {isEditing ? 'Edit Task' : 'Add New Task'}
      </DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Title"
          type="text"
          fullWidth
          value={currentTask.title}
          onChange={(e) => setCurrentTask({ ...currentTask, title: e.target.value })}
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
          value={currentTask.description}
          onChange={(e) => setCurrentTask({ ...currentTask, description: e.target.value })}
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
          value={currentTask.dueDate}
          onChange={(e) => setCurrentTask({ ...currentTask, dueDate: e.target.value })}
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
            value={currentTask.status || 'pending'}
            onChange={(e) => setCurrentTask({ ...currentTask, status: e.target.value })}
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
            value={currentTask.priority || 'medium'}
            onChange={(e) => setCurrentTask({ ...currentTask, priority: e.target.value })}
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
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} sx={{ color: 'rgba(255, 87, 34, 0.7)' }}>
          Cancel
        </Button>
        <Button
          onClick={handleSaveTask}
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
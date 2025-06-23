import React from 'react';
import DOMPurify from 'dompurify';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  IconButton,
  Box,
  Button,
  Checkbox,
  LinearProgress,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Close as CloseIcon } from '@mui/icons-material';

const TaskDetailDialog = ({ open, task, onClose, onEdit, onDelete, onToggleSubtask }) => {
  if (!task) return null;

  // Progress calculation
  const subtasks = task.subtasks || [];
  const completedCount = subtasks.filter(st => st.completed).length;
  const progress = subtasks.length > 0 ? (completedCount / subtasks.length) * 100 : 0;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#ff5722' }}>
            {task.title}
          </Typography>
          <Box>
            <IconButton onClick={() => onEdit(task)} sx={{ color: '#ff9800' }}>
              <EditIcon />
            </IconButton>
            <IconButton onClick={() => onDelete(task)} sx={{ color: '#e91e63' }}>
              <DeleteIcon />
            </IconButton>
            <IconButton onClick={onClose} sx={{ color: 'grey.500' }}>
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        <Typography variant="subtitle1" gutterBottom>
          Description
        </Typography>
        <Typography
          variant="body1"
          paragraph
          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(task.description) }}
        />
        <Typography variant="body2" color="textSecondary">
          Due: {new Date(task.due_date).toLocaleDateString()}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Priority: {task.priority}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Status: {task.status}
        </Typography>

        {/* Checklist & Progress */}
        {subtasks.length > 0 && (
          <Box mt={3}>
            <Typography variant="subtitle1" gutterBottom>
              Progress
            </Typography>
            <LinearProgress 
              variant="determinate" 
              value={progress} 
              sx={{ mb: 1, height: 8, borderRadius: 4, 
                '& .MuiLinearProgress-bar': {
                  backgroundColor: '#4caf50', // green
                },
                backgroundColor: 'rgba(76, 175, 80, 0.15)', // light green background
              }} 
            />
            <Typography variant="caption" color="textSecondary" sx={{ mb: 1, display: 'block' }}>
              {completedCount} of {subtasks.length} completed
            </Typography>
            <List dense>
              {subtasks.map((subtask, idx) => (
                <ListItem key={subtask.id || idx} disableGutters>
                  <Checkbox
                    checked={!!subtask.completed}
                    onChange={() => onToggleSubtask && onToggleSubtask(idx)}
                  />
                  <ListItemText
                    primary={subtask.title}
                    sx={{ textDecoration: subtask.completed ? 'line-through' : 'none', opacity: subtask.completed ? 0.6 : 1 }}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TaskDetailDialog; 
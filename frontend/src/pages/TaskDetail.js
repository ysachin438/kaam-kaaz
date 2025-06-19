import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Container,
  Paper,
  Typography,
  Button,
  TextField,
  MenuItem,
  Box,
  Chip,
  LinearProgress,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { ArrowBack as ArrowBackIcon, Edit as EditIcon } from '@mui/icons-material';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: '15px',
  boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
}));

const StatusChip = styled(Chip)(({ status }) => ({
  backgroundColor: status === 'completed' ? 'rgba(0, 230, 118, 0.2)' :
    status === 'in-progress' ? 'rgba(255, 145, 0, 0.2)' : 'rgba(255, 23, 68, 0.2)',
  color: status === 'completed' ? '#00e676' :
    status === 'in-progress' ? '#ff9100' : '#ff1744',
  fontWeight: 'bold',
  boxShadow: status === 'completed' ? '0 0 10px rgba(0, 230, 118, 0.3)' :
    status === 'in-progress' ? '0 0 10px rgba(255, 145, 0, 0.3)' : '0 0 10px rgba(255, 23, 68, 0.3)',
  '&:hover': {
    boxShadow: status === 'completed' ? '0 0 20px rgba(0, 230, 118, 0.5)' :
      status === 'in-progress' ? '0 0 20px rgba(255, 145, 0, 0.5)' : '0 0 20px rgba(255, 23, 68, 0.5)',
  },
}));

const TaskItem = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  background: 'linear-gradient(145deg, #1e1e1e 0%, #2d2d2d 100%)',
  border: '1px solid rgba(255, 215, 0, 0.1)',
  boxShadow: '0 0 20px rgba(255, 215, 0, 0.1)',
  '&:hover': {
    boxShadow: '0 0 30px rgba(255, 215, 0, 0.2)',
  },
}));

const TaskDetail = () => {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editedTask, setEditedTask] = useState(null);

  useEffect(() => {
    // TODO: Fetch task details from API
    // Mock data for demonstration
    const mockTask = {
      id: taskId,
      title: 'Complete Project Proposal',
      description: 'Write and submit the project proposal for the new client. Include all necessary details about the project scope, timeline, and budget.',
      dueDate: '2024-03-20',
      status: 'in-progress',
      priority: 'high',
      createdAt: '2024-03-15',
      progress: 60,
      comments: [
        {
          id: 1,
          text: 'Started working on the proposal',
          timestamp: '2024-03-15T10:00:00',
        },
        {
          id: 2,
          text: 'Added budget section',
          timestamp: '2024-03-16T14:30:00',
        },
      ],
    };
    setTask(mockTask);
    setEditedTask(mockTask);
  }, [taskId]);

  const handleStatusChange = (newStatus) => {
    setTask({ ...task, status: newStatus });
    // TODO: Update status in API
  };

  const handleSaveEdit = () => {
    setTask(editedTask);
    setOpenEditDialog(false);
    // TODO: Update task in API
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return {
          bg: 'rgba(255, 23, 68, 0.2)',
          color: '#ff1744',
          glow: '0 0 10px rgba(255, 23, 68, 0.3)',
          hoverGlow: '0 0 20px rgba(255, 23, 68, 0.5)',
        };
      case 'medium':
        return {
          bg: 'rgba(255, 145, 0, 0.2)',
          color: '#ff9100',
          glow: '0 0 10px rgba(255, 145, 0, 0.3)',
          hoverGlow: '0 0 20px rgba(255, 145, 0, 0.5)',
        };
      case 'low':
        return {
          bg: 'rgba(0, 230, 118, 0.2)',
          color: '#00e676',
          glow: '0 0 10px rgba(0, 230, 118, 0.3)',
          hoverGlow: '0 0 20px rgba(0, 230, 118, 0.5)',
        };
      default:
        return {
          bg: 'rgba(255, 215, 0, 0.2)',
          color: '#ffd700',
          glow: '0 0 10px rgba(255, 215, 0, 0.3)',
          hoverGlow: '0 0 20px rgba(255, 215, 0, 0.5)',
        };
    }
  };

  if (!task) {
    return <LinearProgress />;
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <StyledPaper>
          <Box display="flex" alignItems="center" mb={3}>
            <IconButton onClick={() => navigate('/dashboard')} sx={{ mr: 2 }}>
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h4" component="h1" sx={{ flexGrow: 1 }}>
              {task.title}
            </Typography>
            <IconButton onClick={() => setOpenEditDialog(true)}>
              <EditIcon />
            </IconButton>
          </Box>

          <Box mb={4}>
            <Typography variant="body1" paragraph>
              {task.description}
            </Typography>
            <Box display="flex" gap={2} mb={2}>
              <StatusChip
                label={task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                status={task.status}
              />
              <Chip
                label={`Priority: ${task.priority}`}
                style={{
                  backgroundColor: getPriorityColor(task.priority).bg,
                  color: getPriorityColor(task.priority).color,
                  boxShadow: getPriorityColor(task.priority).glow,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = getPriorityColor(task.priority).hoverGlow;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = getPriorityColor(task.priority).glow;
                }}
              />
            </Box>
            <Typography variant="body2" color="textSecondary">
              Created: {new Date(task.createdAt).toLocaleDateString()}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Due: {new Date(task.dueDate).toLocaleDateString()}
            </Typography>
          </Box>

          <Box mb={4}>
            <Typography variant="h6" gutterBottom>
              Progress
            </Typography>
            <LinearProgress
              variant="determinate"
              value={task.progress}
              sx={{ height: 10, borderRadius: 5 }}
            />
            <Typography variant="body2" color="textSecondary" align="right" mt={1}>
              {task.progress}% Complete
            </Typography>
          </Box>

          <Box mb={4}>
            <Typography variant="h6" gutterBottom>
              Status
            </Typography>
            <Box display="flex" gap={2}>
              <Button
                variant={task.status === 'pending' ? 'contained' : 'outlined'}
                onClick={() => handleStatusChange('pending')}
                color="warning"
              >
                Pending
              </Button>
              <Button
                variant={task.status === 'in-progress' ? 'contained' : 'outlined'}
                onClick={() => handleStatusChange('in-progress')}
                color="primary"
              >
                In Progress
              </Button>
              <Button
                variant={task.status === 'completed' ? 'contained' : 'outlined'}
                onClick={() => handleStatusChange('completed')}
                color="success"
              >
                Completed
              </Button>
            </Box>
          </Box>

          <Box>
            <Typography variant="h6" gutterBottom>
              Comments
            </Typography>
            {task.comments.map((comment) => (
              <Paper
                key={comment.id}
                sx={{ p: 2, mb: 2, backgroundColor: '#f5f5f5' }}
              >
                <Typography variant="body2">{comment.text}</Typography>
                <Typography variant="caption" color="textSecondary">
                  {new Date(comment.timestamp).toLocaleString()}
                </Typography>
              </Paper>
            ))}
          </Box>
        </StyledPaper>
      </motion.div>

      {/* Edit Dialog */}
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Task</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Title"
            fullWidth
            value={editedTask.title}
            onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            multiline
            rows={4}
            value={editedTask.description}
            onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Due Date"
            type="date"
            fullWidth
            value={editedTask.dueDate}
            onChange={(e) => setEditedTask({ ...editedTask, dueDate: e.target.value })}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            margin="dense"
            label="Priority"
            select
            fullWidth
            value={editedTask.priority}
            onChange={(e) => setEditedTask({ ...editedTask, priority: e.target.value })}
          >
            <MenuItem value="high">High</MenuItem>
            <MenuItem value="medium">Medium</MenuItem>
            <MenuItem value="low">Low</MenuItem>
          </TextField>
          <TextField
            margin="dense"
            label="Progress"
            type="number"
            fullWidth
            value={editedTask.progress}
            onChange={(e) => setEditedTask({ ...editedTask, progress: parseInt(e.target.value) })}
            InputProps={{ inputProps: { min: 0, max: 100 } }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)}>Cancel</Button>
          <Button onClick={handleSaveEdit} variant="contained" color="primary">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default TaskDetail; 
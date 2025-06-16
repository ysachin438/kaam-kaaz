import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Avatar,
  Box,
  Chip,
  Popover,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: '15px',
  background: 'linear-gradient(145deg, #1e1e1e 0%, #2d2d2d 100%)',
  boxShadow: '0 0 10px rgba(255, 87, 34, 0.1)',
  border: '1px solid rgba(255, 87, 34, 0.1)',
  '&:hover': {
    boxShadow: '0 0 15px rgba(255, 87, 34, 0.15)',
  },
}));

const TaskItem = styled(ListItem)(({ theme }) => ({
  margin: '8px 0',
  borderRadius: '8px',
  background: 'linear-gradient(145deg, #1e1e1e 0%, #2d2d2d 100%)',
  border: '1px solid rgba(255, 87, 34, 0.1)',
  boxShadow: '0 0 8px rgba(255, 87, 34, 0.05)',
  padding: theme.spacing(2),
  display: 'flex',
  flexDirection: 'column',
  '&:hover': {
    boxShadow: '0 0 12px rgba(255, 87, 34, 0.1)',
    transform: 'translateY(-2px)',
    transition: 'all 0.3s ease',
  },
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: 50,
  height: 50,
  background: 'linear-gradient(45deg, #ff5722 30%, #ff9800 90%)',
  fontSize: '1.2rem',
  cursor: 'pointer',
  boxShadow: '0 0 10px rgba(255, 87, 34, 0.2)',
  '&:hover': {
    boxShadow: '0 0 15px rgba(255, 87, 34, 0.3)',
  },
}));

const StatusChip = styled(Chip)(({ status }) => ({
  backgroundColor: status === 'completed' ? 'rgba(76, 175, 80, 0.2)' :
    status === 'in-progress' ? 'rgba(255, 87, 34, 0.2)' : 'rgba(233, 30, 99, 0.2)',
  color: status === 'completed' ? '#4caf50' :
    status === 'in-progress' ? '#ff5722' : '#e91e63',
  fontWeight: 'bold',
  boxShadow: status === 'completed' ? '0 0 5px rgba(76, 175, 80, 0.2)' :
    status === 'in-progress' ? '0 0 5px rgba(255, 87, 34, 0.2)' : '0 0 5px rgba(233, 30, 99, 0.2)',
  '&:hover': {
    boxShadow: status === 'completed' ? '0 0 8px rgba(76, 175, 80, 0.3)' :
      status === 'in-progress' ? '0 0 8px rgba(255, 87, 34, 0.3)' : '0 0 8px rgba(233, 30, 99, 0.3)',
  },
}));

// API service functions
const API_BASE_URL = 'http://localhost:3000'; // Update this with your actual backend URL

const api = {
  getTasks: async (userId) => {
    const response = await axios.get(`${API_BASE_URL}/tasks/${userId}`);
    return response.data;
  },
  
  createTask: async (userId, taskData) => {
    const response = await axios.post(`${API_BASE_URL}/tasks/create/${userId}`, taskData);
    return response.data;
  },
  
  updateTask: async (taskId, taskData) => {
    const response = await axios.put(`${API_BASE_URL}/tasks/${taskId}/update`, taskData);
    return response.data;
  },
  
  deleteTask: async (taskId) => {
    const response = await axios.delete(`${API_BASE_URL}/tasks/${taskId}`);
    return response.data;
  },
  
  getUserProfile: async (userId) => {
    const response = await axios.get(`${API_BASE_URL}/users/${userId}`);
    return response.data;
  },
  
  updateUserProfile: async (userId, profileData) => {
    const response = await axios.put(`${API_BASE_URL}/users/${userId}`, profileData);
    return response.data;
  }
};

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openTaskDialog, setOpenTaskDialog] = useState(false);
  const [openProfileDialog, setOpenProfileDialog] = useState(false);
  const [profileAnchorEl, setProfileAnchorEl] = useState(null);
  const [currentTask, setCurrentTask] = useState({
    title: '',
    description: '',
    dueDate: '',
    status: 'pending',
  });
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    avatar: '',
  });
  const navigate = useNavigate();

  // Get userId from localStorage or your auth context
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [tasksData, profileData] = await Promise.all([
          api.getTasks(userId),
          api.getUserProfile(userId)
        ]);
        setTasks(tasksData);
        setProfile({
          ...profileData,
          avatar: profileData.name.split(' ').map(n => n[0]).join('').toUpperCase()
        });
      } catch (err) {
        setError(err.message);
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchData();
    } else {
      navigate('/login');
    }
  }, [userId, navigate]);

  const handleProfileClick = (event) => {
    setProfileAnchorEl(event.currentTarget);
  };

  const handleProfileClose = () => {
    setProfileAnchorEl(null);
  };

  const handleAddTask = () => {
    setCurrentTask({
      title: '',
      description: '',
      dueDate: '',
      status: 'pending',
    });
    setOpenTaskDialog(true);
  };

  const handleSaveTask = async () => {
    try {
      if (currentTask.id) {
        const updatedTask = await api.updateTask(currentTask.id, currentTask);
        setTasks(tasks.map(task => 
          task.id === currentTask.id ? updatedTask : task
        ));
      } else {
        const newTask = await api.createTask(userId, currentTask);
        setTasks([...tasks, newTask]);
      }
      setOpenTaskDialog(false);
    } catch (err) {
      setError(err.message);
      console.error('Error saving task:', err);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await api.deleteTask(taskId);
      setTasks(tasks.filter(task => task.id !== taskId));
    } catch (err) {
      setError(err.message);
      console.error('Error deleting task:', err);
    }
  };

  const handleEditTask = (task) => {
    setCurrentTask(task);
    setOpenTaskDialog(true);
  };

  const handleUpdateProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.put(
        `http://localhost:3000/users/${userId}/update`,
        {
          name: profile.name,
          email: profile.email
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'auth_token': `Bearer ${token}`
          }
        }
      );

      if (response.data) {
        setProfile({
          ...response.data,
          avatar: response.data.name.split(' ').map(n => n[0]).join('').toUpperCase()
        });
        setOpenProfileDialog(false);
        // Show success message
        setError(null);
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err.response?.data?.message || 'Failed to update profile. Please try again.');
    }
  };

  const open = Boolean(profileAnchorEl);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {error && (
        <Box sx={{ mb: 2, p: 2, bgcolor: 'error.main', color: 'white', borderRadius: 1 }}>
          {error}
        </Box>
      )}
      
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <Typography>Loading...</Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {/* Tasks Section */}
          <Grid item xs={12} md={9}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <StyledPaper>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} flexWrap="wrap" gap={2}>
                  <Typography variant="h5" sx={{ color: '#ff5722', flex: '1 1 auto' }}>My Tasks</Typography>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleAddTask}
                    sx={{
                      background: 'linear-gradient(45deg, #ff5722 30%, #ff9800 90%)',
                      color: '#fff',
                      flex: '0 0 auto',
                    }}
                  >
                    Add Task
                  </Button>
                </Box>
                <List>
                  {tasks.length === 0 ? (
                    <Box 
                      display="flex" 
                      justifyContent="center" 
                      alignItems="center" 
                      minHeight="200px"
                      sx={{ 
                        background: 'rgba(255, 87, 34, 0.05)',
                        borderRadius: '8px',
                        border: '1px dashed rgba(255, 87, 34, 0.2)'
                      }}
                    >
                      <Typography variant="body1" color="textSecondary">
                        No tasks yet. Click "Add Task" to create one!
                      </Typography>
                    </Box>
                  ) : (
                    tasks.map((task) => (
                      <motion.div
                        key={task.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <TaskItem>
                          <Box display="flex" justifyContent="space-between" alignItems="flex-start" width="100%">
                            <Box flex={1} mr={2}>
                              <Typography variant="h6" sx={{ color: '#ff5722', mb: 1 }}>
                                {task.title}
                              </Typography>
                              <Typography variant="body2" color="textSecondary" paragraph>
                                {task.description}
                              </Typography>
                              <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
                                <Typography variant="caption" color="textSecondary">
                                  Due: {new Date(task.dueDate).toLocaleDateString()}
                                </Typography>
                                <StatusChip
                                  label={task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                                  status={task.status}
                                  size="small"
                                />
                              </Box>
                            </Box>
                            <Box display="flex" gap={1}>
                              <IconButton
                                onClick={() => handleEditTask(task)}
                                sx={{
                                  color: '#ff5722',
                                  '&:hover': {
                                    color: '#ff9800',
                                    boxShadow: '0 0 8px rgba(255, 87, 34, 0.2)',
                                  },
                                }}
                              >
                                <EditIcon />
                              </IconButton>
                              <IconButton
                                onClick={() => handleDeleteTask(task.id)}
                                sx={{
                                  color: '#e91e63',
                                  '&:hover': {
                                    color: '#f48fb1',
                                    boxShadow: '0 0 8px rgba(233, 30, 99, 0.2)',
                                  },
                                }}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Box>
                          </Box>
                        </TaskItem>
                      </motion.div>
                    ))
                  )}
                </List>
              </StyledPaper>
            </motion.div>
          </Grid>

          {/* Profile Section */}
          <Grid item xs={12} md={3}>
            <Box display="flex" justifyContent="flex-end" mb={2}>
              <StyledAvatar onClick={handleProfileClick}>
                {profile.avatar}
              </StyledAvatar>
            </Box>
            <Popover
              open={open}
              anchorEl={profileAnchorEl}
              onClose={handleProfileClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              <Box sx={{ p: 2, minWidth: 200 }}>
                <Typography variant="h6" sx={{ color: '#ff5722', mb: 1 }}>
                  {profile.name}
                </Typography>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  {profile.email}
                </Typography>
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={() => {
                    handleProfileClose();
                    setOpenProfileDialog(true);
                  }}
                  sx={{
                    mt: 2,
                    borderColor: 'rgba(255, 87, 34, 0.3)',
                    color: '#ff5722',
                    '&:hover': {
                      borderColor: '#ff5722',
                      boxShadow: '0 0 8px rgba(255, 87, 34, 0.2)',
                    },
                  }}
                >
                  Edit Profile
                </Button>
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={() => {
                    handleProfileClose();
                    localStorage.removeItem('token');
                    localStorage.removeItem('userId');
                    navigate('/login');
                  }}
                  sx={{
                    mt: 1,
                    borderColor: 'rgba(233, 30, 99, 0.3)',
                    color: '#e91e63',
                    '&:hover': {
                      borderColor: '#e91e63',
                      boxShadow: '0 0 8px rgba(233, 30, 99, 0.2)',
                    },
                  }}
                >
                  Logout
                </Button>
              </Box>
            </Popover>
          </Grid>
        </Grid>
      )}

      {/* Task Dialog */}
      <Dialog 
        open={openTaskDialog} 
        onClose={() => setOpenTaskDialog(false)}
        PaperProps={{
          sx: {
            background: 'linear-gradient(145deg, #1e1e1e 0%, #2d2d2d 100%)',
            boxShadow: '0 0 10px rgba(255, 87, 34, 0.1)',
          }
        }}
      >
        <DialogTitle sx={{ color: '#ff5722' }}>
          {currentTask.id ? 'Edit Task' : 'Add New Task'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Title"
            fullWidth
            value={currentTask.title}
            onChange={(e) => setCurrentTask({ ...currentTask, title: e.target.value })}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: 'rgba(255, 87, 34, 0.3)' },
                '&:hover fieldset': { borderColor: 'rgba(255, 87, 34, 0.5)' },
                '&.Mui-focused fieldset': { borderColor: '#ff5722' },
              },
              '& .MuiInputLabel-root': { color: 'rgba(255, 87, 34, 0.7)' },
              '& .MuiInputBase-input': { color: '#fff' },
            }}
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            multiline
            rows={3}
            value={currentTask.description}
            onChange={(e) => setCurrentTask({ ...currentTask, description: e.target.value })}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: 'rgba(255, 87, 34, 0.3)' },
                '&:hover fieldset': { borderColor: 'rgba(255, 87, 34, 0.5)' },
                '&.Mui-focused fieldset': { borderColor: '#ff5722' },
              },
              '& .MuiInputLabel-root': { color: 'rgba(255, 87, 34, 0.7)' },
              '& .MuiInputBase-input': { color: '#fff' },
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
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: 'rgba(255, 87, 34, 0.3)' },
                '&:hover fieldset': { borderColor: 'rgba(255, 87, 34, 0.5)' },
                '&.Mui-focused fieldset': { borderColor: '#ff5722' },
              },
              '& .MuiInputLabel-root': { color: 'rgba(255, 87, 34, 0.7)' },
              '& .MuiInputBase-input': { color: '#fff' },
            }}
          />
          <TextField
            margin="dense"
            label="Status"
            select
            fullWidth
            value={currentTask.status}
            onChange={(e) => setCurrentTask({ ...currentTask, status: e.target.value })}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: 'rgba(255, 87, 34, 0.3)' },
                '&:hover fieldset': { borderColor: 'rgba(255, 87, 34, 0.5)' },
                '&.Mui-focused fieldset': { borderColor: '#ff5722' },
              },
              '& .MuiInputLabel-root': { color: 'rgba(255, 87, 34, 0.7)' },
              '& .MuiInputBase-input': { color: '#fff' },
            }}
          >
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="in-progress">In Progress</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setOpenTaskDialog(false)}
            sx={{ color: '#b0b0b0' }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSaveTask} 
            variant="contained"
            sx={{
              background: 'linear-gradient(45deg, #ff5722 30%, #ff9800 90%)',
              color: '#fff',
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Profile Dialog */}
      <Dialog 
        open={openProfileDialog} 
        onClose={() => setOpenProfileDialog(false)}
        PaperProps={{
          sx: {
            background: 'linear-gradient(145deg, #1e1e1e 0%, #2d2d2d 100%)',
            boxShadow: '0 0 10px rgba(255, 87, 34, 0.1)',
          }
        }}
      >
        <DialogTitle sx={{ color: '#ff5722' }}>Edit Profile</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Name"
            fullWidth
            value={profile.name}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: 'rgba(255, 87, 34, 0.3)' },
                '&:hover fieldset': { borderColor: 'rgba(255, 87, 34, 0.5)' },
                '&.Mui-focused fieldset': { borderColor: '#ff5722' },
              },
              '& .MuiInputLabel-root': { color: 'rgba(255, 87, 34, 0.7)' },
              '& .MuiInputBase-input': { color: '#fff' },
            }}
          />
          <TextField
            margin="dense"
            label="Email"
            fullWidth
            value={profile.email}
            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: 'rgba(255, 87, 34, 0.3)' },
                '&:hover fieldset': { borderColor: 'rgba(255, 87, 34, 0.5)' },
                '&.Mui-focused fieldset': { borderColor: '#ff5722' },
              },
              '& .MuiInputLabel-root': { color: 'rgba(255, 87, 34, 0.7)' },
              '& .MuiInputBase-input': { color: '#fff' },
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setOpenProfileDialog(false)}
            sx={{ color: '#b0b0b0' }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleUpdateProfile} 
            variant="contained"
            sx={{
              background: 'linear-gradient(45deg, #ff5722 30%, #ff9800 90%)',
              color: '#fff',
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Dashboard; 
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
  Checkbox,
  Tabs,
  Tab,
  Select,
  FormControl,
  InputLabel,
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
  cursor: 'pointer',
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
    status === 'inprogress' ? 'rgba(255, 87, 34, 0.2)' : 'rgba(233, 30, 99, 0.2)',
  color: status === 'completed' ? '#4caf50' :
    status === 'inprogress' ? '#ff5722' : '#e91e63',
  fontWeight: 'bold',
  boxShadow: status === 'completed' ? '0 0 5px rgba(76, 175, 80, 0.2)' :
    status === 'inprogress' ? '0 0 5px rgba(255, 87, 34, 0.2)' : '0 0 5px rgba(233, 30, 99, 0.2)',
  '&:hover': {
    boxShadow: status === 'completed' ? '0 0 8px rgba(76, 175, 80, 0.3)' :
      status === 'inprogress' ? '0 0 8px rgba(255, 87, 34, 0.3)' : '0 0 8px rgba(233, 30, 99, 0.3)',
  },
  pointerEvents: 'none',
}));

const PriorityChip = styled(Chip)(({ priority }) => ({
  backgroundColor: priority === 'high' ? 'rgba(244, 67, 54, 0.2)' :
    priority === 'medium' ? 'rgba(255, 152, 0, 0.2)' :
    'rgba(76, 175, 80, 0.2)',
  color: priority === 'high' ? '#f44336' :
    priority === 'medium' ? '#ff9800' :
    '#4caf50',
  fontWeight: 'bold',
  boxShadow: priority === 'high' ? '0 0 5px rgba(244, 67, 54, 0.2)' :
    priority === 'medium' ? '0 0 5px rgba(255, 152, 0, 0.2)' :
    '0 0 5px rgba(76, 175, 80, 0.2)',
  '&:hover': {
    boxShadow: priority === 'high' ? '0 0 8px rgba(244, 67, 54, 0.3)' :
      priority === 'medium' ? '0 0 8px rgba(255, 152, 0, 0.3)' :
      '0 0 8px rgba(76, 175, 80, 0.3)',
  },
  pointerEvents: 'none',
}));

// API service functions
const API_BASE_URL = 'http://localhost:3000'; // Update this with your actual backend URL

const api = {
  getTasks: async (userId) => {
    const response = await axios.get(`${API_BASE_URL}/tasks`);
    return response.data;
  },
  
  createTask: async (userId, taskData) => {
    const response = await axios.post(`${API_BASE_URL}/tasks/create`, taskData);
    return response.data;
  },
  
  updateTask: async (taskId, taskData) => {
    const response = await axios.put(`${API_BASE_URL}/tasks/${taskId}/update/`, taskData);
    return response.data;
  },
  
  deleteTask: async (taskId) => {
    const token = localStorage.getItem('token');
    const response = await axios.delete(`${API_BASE_URL}/tasks/${taskId}/delete`, {
      headers: {
        'auth_token': `Bearer ${token}`
      }
    });
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
    priority: 'medium',
  });
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    avatar: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [activeTab, setActiveTab] = useState(0);
  const [sortBy, setSortBy] = useState('newest');
  const [selectedMonth, setSelectedMonth] = useState('all');
  const navigate = useNavigate();

  // Get userId from localStorage or your auth context
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }

        const [tasksResponse, profileResponse] = await Promise.all([
          axios.get(`http://localhost:3000/tasks`, {
            headers: {
              'auth_token': `Bearer ${token}`
            }
          }),
          api.getUserProfile(userId)
        ]);

        setTasks(tasksResponse.data);
        setProfile({
          ...profileResponse,
          avatar: profileResponse.name.split(' ').map(n => n[0]).join('').toUpperCase()
        });
        setError(null);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.response?.data?.message || 'Failed to fetch data. Please try again.');
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('userId');
          navigate('/login');
        }
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
      priority: 'medium',
    });
    setOpenTaskDialog(true);
  };

  const handleSaveTask = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Validate required fields
      if (!currentTask.title || !currentTask.description || !currentTask.dueDate) {
        setError('Title, description, and due date are required');
        return;
      }

      // Format due_date as datetime
      const dueDate = new Date(currentTask.dueDate);
      dueDate.setHours(0, 0, 0, 0); // Set time to start of day

      const taskData = {
        title: currentTask.title,
        description: currentTask.description,
        status: currentTask.status || 'pending',
        priority: currentTask.priority || 'medium',
        due_date: dueDate.toISOString().slice(0, 19).replace('T', ' ')
      };

      const headers = {
        'Content-Type': 'application/json',
        'auth_token': `Bearer ${token}`
      };

      if (currentTask.taskId) {
        // Update existing task
        const response = await axios.put(
          `http://localhost:3000/tasks/${currentTask.taskId}/update`,
          taskData,
          { headers }
        );
        
        if (response.data) {
          setTasks(tasks.map(task => 
            task.taskId === currentTask.taskId ? { ...task, ...taskData } : task
          ));
          setOpenTaskDialog(false);
          setError(null);
        }
      } else {
        // Create new task
        const response = await axios.post(
          `http://localhost:3000/tasks/create`,
          taskData,
          { headers }
        );
        
        if (response.data) {
          setTasks([...tasks, { ...taskData, id: response.data }]);
          setOpenTaskDialog(false);
          setError(null);
        }
      }
    } catch (err) {
      console.error('Error saving task:', err);
      setError(err.response?.data?.message || 'Failed to save task. Please try again.');
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      if (!taskId) {
        throw new Error('Invalid task ID');
      }

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      await axios.delete(`${API_BASE_URL}/tasks/${taskId}/delete`, {
        headers: {
          'auth_token': `Bearer ${token}`
        }
      });
      
      setTasks(tasks.filter(task => task.taskId !== taskId));
      setError(null);
    } catch (err) {
      console.error('Error deleting task:', err);
      setError(err.response?.data?.message || 'Failed to delete task. Please try again.');
    }
  };

  const handleEditTask = (task) => {
    // Format the due_date for the date input field (YYYY-MM-DD)
    const dueDate = task.due_date ? new Date(task.due_date).toISOString().split('T')[0] : '';
    
    setCurrentTask({
      ...task,
      dueDate: dueDate
    });
    setOpenTaskDialog(true);
  };

  const handleUpdateProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Validate passwords if any password field is filled
      if (profile.newPassword || profile.currentPassword || profile.confirmPassword) {
        if (!profile.currentPassword) {
          setError('Current password is required to update password');
          return;
        }
        if (!profile.newPassword) {
          setError('New password is required');
          return;
        }
        if (profile.newPassword !== profile.confirmPassword) {
          setError('New passwords do not match');
          return;
        }
      }

      const updateData = {
        name: profile.name,
        email: profile.email,
      };

      // Only include password fields if they are being updated
      if (profile.newPassword) {
        updateData.currentPassword = profile.currentPassword;
        updateData.newPassword = profile.newPassword;
      }

      const response = await axios.put(
        `http://localhost:3000/users/${userId}/update`,
        updateData,
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
          avatar: response.data.name.split(' ').map(n => n[0]).join('').toUpperCase(),
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
        setOpenProfileDialog(false);
        setError(null);
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err.response?.data?.message || 'Failed to update profile. Please try again.');
    }
  };

  const handleTaskStatusChange = async (taskId, currentStatus) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';
      const taskData = {
        status: newStatus
      };

      await axios.put(
        `${API_BASE_URL}/tasks/${taskId}/update`,
        taskData,
        {
          headers: {
            'Content-Type': 'application/json',
            'auth_token': `Bearer ${token}`
          }
        }
      );

      setTasks(tasks.map(task => 
        task.taskId === taskId ? { ...task, status: newStatus } : task
      ));
      setError(null);
    } catch (err) {
      console.error('Error updating task status:', err);
      setError(err.response?.data?.message || 'Failed to update task status. Please try again.');
    }
  };

  const getMonthName = (date) => {
    return new Date(date).toLocaleString('default', { month: 'long' });
  };

  const sortTasks = (tasks) => {
    let sortedTasks = [...tasks];

    // First filter by month if selected
    if (selectedMonth !== 'all') {
      sortedTasks = sortedTasks.filter(task => 
        getMonthName(task.due_date) === selectedMonth
      );
    }

    // Then sort by date
    return sortedTasks.sort((a, b) => {
      const dateA = new Date(a.due_date);
      const dateB = new Date(b.due_date);
      
      if (sortBy === 'newest') {
        return dateB - dateA;
      } else if (sortBy === 'oldest') {
        return dateA - dateB;
      }
      return 0;
    });
  };

  const getUniqueMonths = (tasks) => {
    const months = tasks.map(task => getMonthName(task.due_date));
    return ['all', ...new Set(months)];
  };

  const filteredTasks = tasks.filter(task => {
    if (activeTab === 0) return task.status === 'pending';
    if (activeTab === 1) return task.status === 'inprogress';
    if (activeTab === 2) return task.status === 'completed';
    return true;
  });

  const filteredAndSortedTasks = sortTasks(filteredTasks);

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
                  <Box display="flex" gap={2} alignItems="center">
                    <FormControl size="small" sx={{ minWidth: 120 }}>
                      <InputLabel sx={{ color: 'rgba(255, 87, 34, 0.7)' }}>Sort By</InputLabel>
                      <Select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        label="Sort By"
                        sx={{
                          color: '#ff5722',
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
                        <MenuItem value="newest">Newest First</MenuItem>
                        <MenuItem value="oldest">Oldest First</MenuItem>
                      </Select>
                    </FormControl>

                    <FormControl size="small" sx={{ minWidth: 120 }}>
                      <InputLabel sx={{ color: 'rgba(255, 87, 34, 0.7)' }}>Filter Month</InputLabel>
                      <Select
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(e.target.value)}
                        label="Filter Month"
                        sx={{
                          color: '#ff5722',
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
                        {getUniqueMonths(tasks).map((month) => (
                          <MenuItem key={month} value={month}>
                            {month.charAt(0).toUpperCase() + month.slice(1)}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <Button
                      variant="contained"
                      startIcon={<AddIcon />}
                      onClick={handleAddTask}
                      sx={{
                        background: 'linear-gradient(45deg, #ff5722 30%, #ff9800 90%)',
                        color: '#fff',
                      }}
                    >
                      Add Task
                    </Button>
                  </Box>
                </Box>

                <Tabs
                  value={activeTab}
                  onChange={(e, newValue) => setActiveTab(newValue)}
                  sx={{
                    mb: 2,
                    '& .MuiTab-root': {
                      color: 'rgba(255, 87, 34, 0.7)',
                      '&.Mui-selected': {
                        color: '#ff5722',
                      },
                    },
                    '& .MuiTabs-indicator': {
                      backgroundColor: '#ff5722',
                    },
                  }}
                >
                  <Tab label="Pending Tasks" />
                  <Tab label="In Progress" />
                  <Tab label="Completed Tasks" />
                </Tabs>

                <List>
                  {filteredAndSortedTasks.length === 0 ? (
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
                        {activeTab === 0 ? 'No pending tasks. Click "Add Task" to create one!' :
                         activeTab === 1 ? 'No tasks in progress.' :
                         'No completed tasks yet.'}
                      </Typography>
                    </Box>
                  ) : (
                    filteredAndSortedTasks.map((task) => (
                      <motion.div
                        key={task.taskId}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <TaskItem onClick={() => handleEditTask(task)}>
                          <Box display="flex" justifyContent="space-between" alignItems="flex-start" width="100%">
                            <Box display="flex" alignItems="flex-start" flex={1} mr={2}>
                              <Checkbox
                                checked={task.status === 'completed'}
                                onChange={(e) => {
                                  e.stopPropagation(); // Prevent task item click when clicking checkbox
                                  handleTaskStatusChange(task.taskId, task.status);
                                }}
                                sx={{
                                  color: 'rgba(255, 87, 34, 0.7)',
                                  '&.Mui-checked': {
                                    color: '#ff5722',
                                  },
                                }}
                              />
                              <Box>
                                <Typography 
                                  variant="h6" 
                                  sx={{ 
                                    color: '#ff5722', 
                                    mb: 1,
                                    textDecoration: task.status === 'completed' ? 'line-through' : 'none',
                                    opacity: task.status === 'completed' ? 0.7 : 1
                                  }}
                                >
                                  {task.title}
                                </Typography>
                                <Typography 
                                  variant="body2" 
                                  color="textSecondary" 
                                  paragraph
                                  sx={{
                                    textDecoration: task.status === 'completed' ? 'line-through' : 'none',
                                    opacity: task.status === 'completed' ? 0.7 : 1
                                  }}
                                >
                                  {task.description}
                                </Typography>
                                <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
                                  <Typography 
                                    variant="caption" 
                                    color="textSecondary"
                                    sx={{
                                      textDecoration: task.status === 'completed' ? 'line-through' : 'none',
                                      opacity: task.status === 'completed' ? 0.7 : 1
                                    }}
                                  >
                                    Due: {new Date(task.due_date).toLocaleDateString()}
                                  </Typography>
                                  <PriorityChip
                                    label={task.priority ? task.priority.charAt(0).toUpperCase() + task.priority.slice(1) : 'Medium'}
                                    priority={task.priority || 'medium'}
                                    size="small"
                                  />
                                  <StatusChip
                                    label={task.status ? task.status.charAt(0).toUpperCase() + task.status.slice(1) : 'Pending'}
                                    status={task.status || 'pending'}
                                    size="small"
                                  />
                                </Box>
                              </Box>
                            </Box>
                            <Box display="flex" gap={1}>
                              <IconButton
                                onClick={(e) => {
                                  e.stopPropagation(); // Prevent task item click when clicking edit button
                                  handleEditTask(task);
                                }}
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
                                onClick={(e) => {
                                  e.stopPropagation(); // Prevent task item click when clicking delete button
                                  handleDeleteTask(task.taskId);
                                }}
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
          {currentTask.taskIdd ? 'Edit Task' : 'Add New Task'}
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
            <MenuItem value="inprogress">In Progress</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
          </TextField>
          <TextField
            margin="dense"
            label="Priority"
            select
            fullWidth
            value={currentTask.priority}
            onChange={(e) => setCurrentTask({ ...currentTask, priority: e.target.value })}
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
            <MenuItem value="high">High</MenuItem>
            <MenuItem value="medium">Medium</MenuItem>
            <MenuItem value="low">Low</MenuItem>
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
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  ListItem,
  MenuItem,
  Avatar,
  Box,
  Chip,
  Popover,
  Tabs,
  Tab,
  Select,
  FormControl,
  InputLabel,
  IconButton,
  Tooltip,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  AccountCircle as AccountCircleIcon,
  Group as GroupIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import TaskHeader from '../components/dashboard/TaskHeader';
import TaskTabs from '../components/dashboard/TaskTabs';
import TaskList from '../components/dashboard/TaskList';
import TaskDialog from '../components/dashboard/TaskDialog';
import ProfileDialog from '../components/dashboard/ProfileDialog';
import SharedTasks from '../components/dashboard/SharedTasks';

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

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  background: 'linear-gradient(45deg, #ff5722 30%, #ff9800 90%)',
  color: '#fff',
  padding: '12px',
  marginLeft: '8px',
  '&:hover': {
    background: 'linear-gradient(45deg, #ff5722 40%, #ff9800 100%)',
    boxShadow: '0 0 15px rgba(255, 87, 34, 0.3)',
  },
}));

// API service functions
const API_BASE_URL = 'http://localhost:3000'; // Update this with your actual backend URL

const api = {
  getTasks: async (userId, status = null) => {
    const token = localStorage.getItem('token');
    const url = status 
      ? `${API_BASE_URL}/tasks?status=${status}`
      : `${API_BASE_URL}/tasks`;
    
    const response = await axios.get(url, {
      headers: {
        'auth_token': `Bearer ${token}`
      }
    });
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
  });
  const [activeTab, setActiveTab] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedMonth, setSelectedMonth] = useState('all');
  const [showCollaboration, setShowCollaboration] = useState(false);
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
          api.getTasks(userId, activeTab === 'all' ? null : activeTab),
          api.getUserProfile(userId)
        ]);

        setTasks(tasksResponse);
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
  }, [userId, navigate, activeTab]);

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

      const updateData = {
        name: profile.name,
        email: profile.email,
      };

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

  const filteredAndSortedTasks = sortTasks(tasks);

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
                <Typography variant="h5" sx={{ color: '#ff5722', mb: 3 }}>My Tasks</Typography>
                
                <TaskHeader
                  sortBy={sortBy}
                  setSortBy={setSortBy}
                  selectedMonth={selectedMonth}
                  setSelectedMonth={setSelectedMonth}
                  tasks={tasks}
                  onAddTask={handleAddTask}
                  getUniqueMonths={getUniqueMonths}
                />

                <TaskTabs 
                  activeTab={activeTab} 
                  setActiveTab={setActiveTab}
                  tabs={[
                    { value: 'all', label: 'All Tasks' },
                    { value: 'pending', label: 'Pending Tasks' },
                    { value: 'inprogress', label: 'In Progress' },
                    { value: 'completed', label: 'Completed Tasks' }
                  ]}
                />

                <TaskList
                  tasks={filteredAndSortedTasks}
                  onEditTask={handleEditTask}
                  onDeleteTask={handleDeleteTask}
                  onStatusChange={handleTaskStatusChange}
                  activeTab={activeTab}
                />
              </StyledPaper>
            </motion.div>

            {/* Shared Tasks Section */}
            <AnimatePresence>
              {showCollaboration && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  style={{ marginTop: '2rem' }}
                >
                  <SharedTasks />
                </motion.div>
              )}
            </AnimatePresence>
          </Grid>

          {/* Profile Section */}
          <Grid item xs={12} md={3}>
            <Box display="flex" justifyContent="flex-end" mb={2}>
              <StyledAvatar onClick={handleProfileClick}>
                {profile.avatar}
              </StyledAvatar>
              <Tooltip title="Collaboration">
                <StyledIconButton
                  onClick={() => setShowCollaboration(!showCollaboration)}
                  sx={{
                    background: showCollaboration ? 'linear-gradient(45deg, #ff5722 40%, #ff9800 100%)' : 'linear-gradient(45deg, #ff5722 30%, #ff9800 90%)',
                  }}
                >
                  <GroupIcon />
                </StyledIconButton>
              </Tooltip>
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
      <TaskDialog
        open={openTaskDialog}
        onClose={() => setOpenTaskDialog(false)}
        currentTask={currentTask}
        setCurrentTask={setCurrentTask}
        handleSaveTask={handleSaveTask}
        isEditing={!!currentTask.taskId}
      />

      {/* Profile Dialog */}
      <ProfileDialog
        open={openProfileDialog}
        onClose={() => setOpenProfileDialog(false)}
        profile={profile}
        setProfile={setProfile}
        onSave={handleUpdateProfile}
      />
    </Container>
  );
};

export default Dashboard; 
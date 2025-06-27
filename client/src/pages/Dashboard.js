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
  useMediaQuery,
  useTheme,
  CircularProgress,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  AccountCircle as AccountCircleIcon,
  Group as GroupIcon,
  Brightness4 as Brightness4Icon,
  Brightness7 as Brightness7Icon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../api';
import TaskHeader from '../components/dashboard/TaskHeader';
import TaskTabs from '../components/dashboard/TaskTabs';
import TaskList from '../components/dashboard/TaskList';
import TaskDialog from '../components/dashboard/TaskDialog';
import ProfileDialog from '../components/dashboard/ProfileDialog';
import SharedTasks from '../components/dashboard/SharedTasks';
import TaskDetailDialog from '../components/dashboard/TaskDetailDialog';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: '15px',
  background: 'linear-gradient(145deg, #1e1e1e 0%, #2d2d2d 100%)',
  boxShadow: '0 0 10px rgba(255, 87, 34, 0.1)',
  border: '1px solid rgba(255, 87, 34, 0.1)',
  '&:hover': {
    boxShadow: '0 0 15px rgba(255, 87, 34, 0.15)',
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
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
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(1.5),
    flexDirection: 'column',
    alignItems: 'flex-start',
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
  const [openTaskDetailDialog, setOpenTaskDetailDialog] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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
          apiService.getTasks(activeTab === 'all' ? null : activeTab),
          apiService.getUserProfile(userId)
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
        if (err.response?.status === 401 || err.response?.status === 403) {
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

  const handleSaveTask = async (taskData) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Validate required fields
      if (!taskData.title || !taskData.description || !taskData.due_date) {
        setError('Title, description, and due date are required');
        return;
      }

      // Format due_date as datetime
      const dueDate = new Date(taskData.due_date);
      dueDate.setHours(0, 0, 0, 0);

      const payload = {
        ...taskData,
        due_date: dueDate.toISOString().slice(0, 19).replace('T', ' '),
        subtasks: Array.isArray(taskData.subtasks) ? taskData.subtasks : [],
      };

      if (taskData.taskId) {
        // Update existing task
        await apiService.updateTask(taskData.taskId, payload);
        setTasks(tasks.map(task =>
          task.taskId === taskData.taskId ? { ...task, ...payload } : task
        ));
      } else {
        // Create new task
        const response = await apiService.createTask(payload);
        setTasks([...tasks, { ...payload, id: response, taskId: response }]);
      }

      setOpenTaskDialog(false);
      setError(null);
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

      await apiService.deleteTask(taskId);
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
      const updateData = {
        name: profile.name,
        email: profile.email,
      };

      const response = await apiService.updateUserProfile(userId, updateData);
      setProfile({
        ...response,
        avatar: response.name.split(' ').map(n => n[0]).join('').toUpperCase(),
      });
      setOpenProfileDialog(false);
      setError(null);
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

      await apiService.updateTask(taskId, taskData);

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

  const filteredTasks = sortTasks(tasks);

  const open = Boolean(profileAnchorEl);

  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setOpenTaskDetailDialog(true);
  };

  const handleCloseTaskDetailDialog = () => {
    setOpenTaskDetailDialog(false);
    setSelectedTask(null);
  };

  const handleEditTaskFromDialog = (task) => {
    setOpenTaskDetailDialog(false);
    setCurrentTask({
      ...task,
      dueDate: task.due_date ? new Date(task.due_date).toISOString().split('T')[0] : '',
    });
    setOpenTaskDialog(true);
  };

  const handleDeleteTaskFromDialog = async (task) => {
    await handleDeleteTask(task.id || task.taskId);
    setOpenTaskDetailDialog(false);
  };

  const handleToggleSubtask = (subtaskIdx) => {
    if (!selectedTask) return;
    setSelectedTask((prev) => {
      const newSubtasks = prev.subtasks.map((st, idx) =>
        idx === subtaskIdx ? { ...st, completed: !st.completed } : st
      );
      return { ...prev, subtasks: newSubtasks };
    });
    setTasks((prevTasks) =>
      prevTasks.map((t) =>
        (t.id || t.taskId) === (selectedTask.id || selectedTask.taskId)
          ? { ...t, subtasks: t.subtasks.map((st, idx) => idx === subtaskIdx ? { ...st, completed: !st.completed } : st) }
          : t
      )
    );
  };

  return (
    <Container
      maxWidth="xl"
      sx={{
        py: { xs: 3, md: 5 },
        px: { xs: 2, md: 4 },
        mt: 4,
      }}
    >
      {loading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          sx={{ minHeight: '50vh', color: '#fff' }}
        >
          <CircularProgress color="inherit" />
        </Box>
      ) : error ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          sx={{ minHeight: '50vh', color: 'red' }}
        >
          <Typography>{error}</Typography>
        </Box>
      ) : (
        <>
          <StyledPaper>
            <TaskHeader
              profile={profile}
              onProfileClick={handleProfileClick}
              onAddTask={handleAddTask}
              onToggleTheme={() => {
                /* Implement theme toggle logic */
              }}
              onToggleCollaboration={() => setShowCollaboration(!showCollaboration)}
              isMobile={isMobile}
            />

            <Popover
              open={Boolean(profileAnchorEl)}
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

            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: isMobile ? 'stretch' : 'center',
                flexDirection: isMobile ? 'column' : 'row',
                my: 4,
                gap: 2,
              }}
            >
              <Typography
                variant={isMobile ? 'h5' : 'h4'}
                sx={{
                  color: '#ff5722',
                  fontWeight: 'bold',
                  textAlign: isMobile ? 'center' : 'left',
                }}
              >
                {activeTab === 'all'
                  ? 'All Tasks'
                  : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  gap: 2,
                  justifyContent: isMobile ? 'center' : 'flex-end',
                  flexWrap: 'wrap',
                }}
              >
                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <InputLabel sx={{ color: 'rgba(255, 87, 34, 0.7)' }}>Sort By</InputLabel>
                  <Select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    label="Sort By"
                    sx={{
                      color: '#fff',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(255, 87, 34, 0.3)',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(255, 87, 34, 0.5)',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#ff5722',
                      },
                      '& .MuiSvgIcon-root': {
                        color: 'rgba(255, 87, 34, 0.7)',
                      },
                    }}
                  >
                    <MenuItem value="newest">Newest</MenuItem>
                    <MenuItem value="oldest">Oldest</MenuItem>
                  </Select>
                </FormControl>
                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <InputLabel sx={{ color: 'rgba(255, 87, 34, 0.7)' }}>Month</InputLabel>
                  <Select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    label="Month"
                    sx={{
                      color: '#fff',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(255, 87, 34, 0.3)',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(255, 87, 34, 0.5)',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#ff5722',
                      },
                      '& .MuiSvgIcon-root': {
                        color: 'rgba(255, 87, 34, 0.7)',
                      },
                    }}
                  >
                    {getUniqueMonths(tasks).map((month) => (
                      <MenuItem key={month} value={month}>{month}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Box>

            <TaskTabs
              activeTab={activeTab}
              onTabChange={(e, newTab) => setActiveTab(newTab)}
              isMobile={isMobile}
              tabs={[
                { value: 'all', label: 'All Tasks' },
                { value: 'pending', label: 'Pending' },
                { value: 'inprogress', label: 'In Progress' },
                { value: 'completed', label: 'Completed' },
              ]}
            />

            <AnimatePresence>
              <TaskList
                tasks={sortTasks(filteredTasks)}
                onEdit={handleEditTask}
                onDelete={handleDeleteTask}
                onStatusChange={handleTaskStatusChange}
                onTaskClick={handleTaskClick}
                isMobile={isMobile}
              />
            </AnimatePresence>
          </StyledPaper>

          {/* Shared Tasks Section */}
          <AnimatePresence>
            {/* {showCollaboration && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                style={{ marginTop: '2rem' }}
              >
                <SharedTasks />
              </motion.div>
            )} */}
          </AnimatePresence>
        </>
      )}

      {/* Task Detail Dialog */}
      <TaskDetailDialog
        open={openTaskDetailDialog}
        onClose={handleCloseTaskDetailDialog}
        task={selectedTask}
        onEdit={handleEditTaskFromDialog}
        onDelete={handleDeleteTaskFromDialog}
        onToggleSubtask={handleToggleSubtask}
      />

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
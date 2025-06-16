import React from 'react';
import { motion } from 'framer-motion';
import {
  Box,
  Typography,
  Checkbox,
  IconButton,
  List,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { TaskItem, StatusChip, PriorityChip } from './StyledComponents';

const TaskList = ({ 
  tasks, 
  onStatusChange, 
  onEditTask, 
  onDeleteTask,
  activeTab
}) => {
  if (!tasks || tasks.length === 0) {
    return (
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
          {activeTab === 'all' ? 'No tasks found. Click "Add Task" to create one!' :
           activeTab === 'pending' ? 'No pending tasks. Click "Add Task" to create one!' :
           activeTab === 'inprogress' ? 'No tasks in progress. Start working on a pending task!' :
           activeTab === 'completed' ? 'No completed tasks yet. Keep going!' :
           'No tasks found. Click "Add Task" to create one!'}
        </Typography>
      </Box>
    );
  }

  return (
    <List>
      {tasks.map((task) => (
        <motion.div
          key={task.id || task.taskId}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <TaskItem>
            <Box display="flex" justifyContent="space-between" alignItems="flex-start" width="100%">
              <Box display="flex" alignItems="flex-start" flex={1} mr={2}>
                <Checkbox
                  checked={task.status === 'completed'}
                  onChange={(e) => {
                    e.stopPropagation();
                    onStatusChange(task.id || task.taskId, task.status);
                  }}
                  onClick={(e) => e.stopPropagation()}
                  sx={{
                    color: 'rgba(255, 87, 34, 0.7)',
                    '&.Mui-checked': {
                      color: '#ff5722',
                    },
                  }}
                />
                <Box flex={1} onClick={() => onEditTask(task)}>
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
                  <Box display="flex" gap={1} alignItems="center" flexWrap="wrap">
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
                    e.stopPropagation();
                    onEditTask(task);
                  }}
                  size="small"
                  sx={{ color: 'rgba(255, 87, 34, 0.7)' }}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteTask(task.id || task.taskId);
                  }}
                  size="small"
                  sx={{ color: 'rgba(233, 30, 99, 0.7)' }}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Box>
          </TaskItem>
        </motion.div>
      ))}
    </List>
  );
};

export default TaskList; 
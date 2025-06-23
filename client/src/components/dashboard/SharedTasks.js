import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Avatar,
  IconButton,
  TextField,
  Button,
  Chip,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Send as SendIcon, PersonAdd as PersonAddIcon } from '@mui/icons-material';

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

const CommentBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  marginTop: theme.spacing(2),
  borderRadius: '8px',
  background: 'rgba(255, 87, 34, 0.05)',
  border: '1px solid rgba(255, 87, 34, 0.1)',
}));

// Dummy data for demonstration
const dummySharedTasks = [
  {
    id: 1,
    title: 'Project Documentation',
    description: 'Create comprehensive documentation for the new feature',
    assignedTo: [
      { id: 1, name: 'John Doe', avatar: 'JD' },
      { id: 2, name: 'Jane Smith', avatar: 'JS' },
    ],
    comments: [
      {
        id: 1,
        user: { id: 1, name: 'John Doe', avatar: 'JD' },
        text: "I'll start working on the API documentation",
        timestamp: '2024-03-20T10:00:00',
      },
      {
        id: 2,
        user: { id: 2, name: 'Jane Smith', avatar: 'JS' },
        text: "I'll handle the frontend documentation",
        timestamp: '2024-03-20T10:30:00',
      },
    ],
  },
  {
    id: 2,
    title: 'Code Review',
    description: 'Review the latest pull requests',
    assignedTo: [
      { id: 3, name: 'Mike Johnson', avatar: 'MJ' },
    ],
    comments: [
      {
        id: 3,
        user: { id: 3, name: 'Mike Johnson', avatar: 'MJ' },
        text: 'Started reviewing PR #123',
        timestamp: '2024-03-20T11:00:00',
      },
    ],
  },
];

const SharedTasks = () => {
  const [tasks] = useState(dummySharedTasks);
  const [newComment, setNewComment] = useState('');
  const [selectedTask, setSelectedTask] = useState(null);

  const handleAddComment = (taskId) => {
    if (!newComment.trim()) return;
    
    // In a real implementation, this would make an API call
    console.log('Adding comment:', newComment, 'to task:', taskId);
    setNewComment('');
  };

  const handleShareTask = (taskId) => {
    // In a real implementation, this would open a user selection dialog
    console.log('Sharing task:', taskId);
  };

  return (
    <StyledPaper>
      <Typography variant="h5" sx={{ color: '#ff5722', mb: 3 }}>
        Shared Tasks
      </Typography>

      <List>
        {tasks.map((task) => (
          <React.Fragment key={task.id}>
            <ListItem
              alignItems="flex-start"
              sx={{
                flexDirection: 'column',
                mb: 2,
                p: 2,
                borderRadius: '8px',
                background: 'rgba(255, 87, 34, 0.05)',
                border: '1px solid rgba(255, 87, 34, 0.1)',
              }}
            >
              <Box width="100%" display="flex" justifyContent="space-between" alignItems="flex-start">
                <Box>
                  <Typography variant="h6" sx={{ color: '#ff5722' }}>
                    {task.title}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" paragraph>
                    {task.description}
                  </Typography>
                </Box>
                <IconButton
                  onClick={() => handleShareTask(task.id)}
                  sx={{ color: 'rgba(255, 87, 34, 0.7)' }}
                >
                  <PersonAddIcon />
                </IconButton>
              </Box>

              <Box display="flex" gap={1} mb={2} flexWrap="wrap">
                <Typography variant="caption" color="textSecondary">
                  Assigned to:
                </Typography>
                {task.assignedTo.map((user) => (
                  <Chip
                    key={user.id}
                    avatar={<Avatar>{user.avatar}</Avatar>}
                    label={user.name}
                    size="small"
                    sx={{
                      background: 'rgba(255, 87, 34, 0.1)',
                      color: '#ff5722',
                    }}
                  />
                ))}
              </Box>

              <CommentBox>
                <Typography variant="subtitle2" sx={{ color: '#ff5722', mb: 2 }}>
                  Comments
                </Typography>
                <List>
                  {task.comments.map((comment) => (
                    <ListItem key={comment.id} alignItems="flex-start" sx={{ px: 0 }}>
                      <ListItemAvatar>
                        <Avatar>{comment.user.avatar}</Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box display="flex" justifyContent="space-between">
                            <Typography variant="subtitle2" component="span">
                              {comment.user.name}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                              {new Date(comment.timestamp).toLocaleString()}
                            </Typography>
                          </Box>
                        }
                        secondary={comment.text}
                      />
                    </ListItem>
                  ))}
                </List>

                <Box display="flex" gap={1} mt={2}>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Add a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    sx={{
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
                  <Button
                    variant="contained"
                    endIcon={<SendIcon />}
                    onClick={() => handleAddComment(task.id)}
                    sx={{
                      background: 'linear-gradient(45deg, #ff5722 30%, #ff9800 90%)',
                      color: '#fff',
                    }}
                  >
                    Send
                  </Button>
                </Box>
              </CommentBox>
            </ListItem>
            <Divider sx={{ my: 2 }} />
          </React.Fragment>
        ))}
      </List>
    </StyledPaper>
  );
};

export default SharedTasks; 
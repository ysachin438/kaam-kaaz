import { styled } from '@mui/material/styles';
import { Paper, ListItem, Avatar, Chip } from '@mui/material';

export const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: '15px',
  background: 'linear-gradient(145deg, #1e1e1e 0%, #2d2d2d 100%)',
  boxShadow: '0 0 10px rgba(255, 87, 34, 0.1)',
  border: '1px solid rgba(255, 87, 34, 0.1)',
  '&:hover': {
    boxShadow: '0 0 15px rgba(255, 87, 34, 0.15)',
  },
}));

export const TaskItem = styled(ListItem)(({ theme }) => ({
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

export const StyledAvatar = styled(Avatar)(({ theme }) => ({
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

export const StatusChip = styled(Chip)(({ status }) => ({
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

export const PriorityChip = styled(Chip)(({ priority }) => ({
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
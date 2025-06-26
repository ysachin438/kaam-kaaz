import React from 'react';
import {
  Box,
  Typography,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Add as AddIcon,
  Group as GroupIcon,
  Brightness4 as Brightness4Icon,
  Brightness7 as Brightness7Icon,
} from '@mui/icons-material';
import { StyledAvatar, StyledIconButton } from './StyledComponents';

const TaskHeader = ({
  profile,
  onProfileClick,
  onAddTask,
  onToggleTheme,
  onToggleCollaboration,
  isMobile,
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        p: 2,
        mb: 2,
        flexWrap: 'wrap',
        gap: 2,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <StyledAvatar onClick={onProfileClick}>
          {profile.avatar}
        </StyledAvatar>
        {!isMobile && (
          <Box>
            <Typography variant="h6" sx={{ color: '#fff' }}>
              {profile.name}
            </Typography>
            <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
              {profile.email}
            </Typography>
          </Box>
        )}
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <StyledIconButton onClick={onAddTask}>
          <AddIcon />
        </StyledIconButton>
        <Tooltip title="Toggle Theme">
          <IconButton onClick={onToggleTheme} sx={{ color: '#fff' }}>
            <Brightness4Icon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Collaboration">
          <IconButton onClick={onToggleCollaboration} sx={{ color: '#fff' }}>
            <GroupIcon />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
};

export default TaskHeader; 
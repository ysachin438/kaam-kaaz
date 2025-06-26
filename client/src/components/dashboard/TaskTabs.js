import React from 'react';
import { Tabs, Tab } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledTabs = styled(Tabs)(({ theme }) => ({
  borderBottom: '1px solid rgba(255, 87, 34, 0.1)',
  '& .MuiTabs-indicator': {
    backgroundColor: '#ff5722',
  },
}));

const StyledTab = styled(Tab)(({ theme }) => ({
  textTransform: 'none',
  color: 'rgba(255, 87, 34, 0.7)',
  '&.Mui-selected': {
    color: '#ff5722',
  },
  '&:hover': {
    color: '#ff5722',
  },
}));

const TaskTabs = ({ activeTab, onTabChange, tabs, isMobile }) => {
  return (
    <StyledTabs
      value={activeTab}
      onChange={onTabChange}
      aria-label="task status tabs"
      variant={isMobile ? 'scrollable' : 'standard'}
      scrollButtons="auto"
    >
      {tabs.map((tab) => (
        <StyledTab
          key={tab.value}
          value={tab.value}
          label={tab.label}
        />
      ))}
    </StyledTabs>
  );
};

export default TaskTabs; 
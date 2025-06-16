import React from 'react';
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';

const TaskHeader = ({
  sortBy,
  setSortBy,
  selectedMonth,
  setSelectedMonth,
  tasks,
  onAddTask,
  getUniqueMonths,
}) => {
  return (
    <Box display="flex" justifyContent="flex-end" alignItems="center" mb={3} flexWrap="wrap" gap={2}>
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
          <MenuItem value="all">All Months</MenuItem>
          {getUniqueMonths(tasks).filter(month => month !== 'all').map((month) => (
            <MenuItem key={month} value={month}>
              {month.charAt(0).toUpperCase() + month.slice(1)}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={onAddTask}
        sx={{
          background: 'linear-gradient(45deg, #ff5722 30%, #ff9800 90%)',
          color: '#fff',
        }}
      >
        Add Task
      </Button>
    </Box>
  );
};

export default TaskHeader; 
import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from '@mui/material';

const ProfileDialog = ({
  open,
  onClose,
  profile,
  setProfile,
  onSave,
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ color: '#ff5722' }}>
        Edit Profile
      </DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Name"
          type="text"
          fullWidth
          value={profile.name}
          onChange={(e) => setProfile({ ...profile, name: e.target.value })}
          sx={{
            mb: 2,
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
        <TextField
          margin="dense"
          label="Email"
          type="email"
          fullWidth
          value={profile.email}
          onChange={(e) => setProfile({ ...profile, email: e.target.value })}
          sx={{
            mb: 2,
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
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} sx={{ color: 'rgba(255, 87, 34, 0.7)' }}>
          Cancel
        </Button>
        <Button
          onClick={onSave}
          sx={{
            background: 'linear-gradient(45deg, #ff5722 30%, #ff9800 90%)',
            color: '#fff',
          }}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProfileDialog; 
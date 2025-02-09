import React from 'react';
import { Snackbar, Alert } from '@mui/material';

const FailSnackbar = ({ open, message, onClose }) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={2000} // Auto hide after 2 seconds
      onClose={onClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
    <Alert onClose={onClose} severity="warning" sx={{ width: '100%' }}>
            {message}
          </Alert>
    </Snackbar>
  );
};

export default FailSnackbar;

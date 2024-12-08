import React from 'react';
import { Dialog, DialogContent, CircularProgress, Typography } from '@mui/material';

const LoadingDialog = ({ open }) => {
  return (
    <Dialog open={open} PaperProps={{ style: { boxShadow: 'none' } }}>
      <DialogContent style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '30px' }}>
        <CircularProgress />
        <Typography variant="h6" style={{ marginTop: '16px' }}>
          Loading data, please wait...
        </Typography>
      </DialogContent>
    </Dialog>
  );
};

export default LoadingDialog;
import React from 'react';
import { Box } from '@mui/material'; // Import Box from Material-UI

const BackgroundImage = () => {
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundImage: 'url(/images/losma1.png)', // Image from public directory
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        zIndex: -1, // Make sure it stays behind other content
      }}
    />
  );
};

export default BackgroundImage;

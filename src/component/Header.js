import React from 'react';
import { useTheme } from '@mui/material/styles';
import { Box, Button, Typography } from '@mui/material';

const Header = ({ onSwitch }) => {
  const theme = useTheme();
  
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: { xs: '20px', sm: 'var(--sidebar-width)' },
        right: 0,
        height: '80px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: { xs: '0 8px', sm: '0 16px' },
        backgroundColor: '#fff',
        borderBottom: '1px solid #ddd',
        zIndex: 1000,
        transition: 'left 0.3s ease',
      }}
    >
      
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          width: '100%',
          position: 'absolute',
          left: 0,
          right: 0,
          marginLeft: 'auto',
          marginRight: 'auto',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: theme.spacing(3), // Increased spacing between buttons
            width: { xs: '100%', sm: '50%' },
            padding: '0 16px', // Padding to keep spacing on smaller screens
          }}
        >
          <Button variant="contained" color="primary" onClick={() => onSwitch('Forward Orders')}>
            Forward
          </Button>
          <Button variant="contained" color="primary" onClick={() => onSwitch('Reversal Orders')}>
            Reversal
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Header;
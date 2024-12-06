import React from 'react';
import { useTheme } from '@mui/material/styles';
import { Box, Button, Typography } from '@mui/material';

const Header = ({ onSwitch, isSidebarCollapsed }) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: isSidebarCollapsed ? '80px' : '250px', // Dynamically adjust based on sidebar state
        right: 0,
        minHeight: '60px',
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: { xs: '8px 16px', sm: '16px 32px' },
        backgroundColor: '#fff',
        borderBottom: '1px solid #ddd',
        zIndex: 1000,
        transition: 'left 0.3s ease', // Smooth transition for alignment
      }}
    >
      <Typography
        variant="h6"
        noWrap
        sx={{
          flexGrow: { xs: 0, sm: 1 },
          fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' },
          textAlign: { xs: 'center', sm: 'left' }
        }}
      >
        Order Details
      </Typography>

      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-around',
          gap: theme.spacing(2),
          width: { xs: '100%', sm: 'auto' },
          paddingTop: { xs: '8px', sm: '0' },
        }}
      >
        <Button
          variant="contained"
          color="primary"
          fullWidth={true}
          onClick={() => onSwitch('Forward Orders')}
          sx={{ margin: { xs: '4px 0', sm: '0 4px' } }}
        >
          Forward
        </Button>
        <Button
          variant="contained"
          color="primary"
          fullWidth={true}
          onClick={() => onSwitch('Reversal Orders')}
          sx={{ margin: { xs: '4px 0', sm: '0 4px' } }}
        >
          Reversal
        </Button>
      </Box>
    </Box>
  );
};

export default Header;
import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Box, Typography, Button } from '@mui/material';

function Root() {
  return (
    <Container maxWidth="sm">
      <Box sx={{ 
          marginTop: 8, 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          gap: 2,
          backgroundColor: '#f5f5f5',
          padding: 3, 
          borderRadius: 2,
          boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)' 
      }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome to Hauler
        </Typography>
        <Button variant="contained" color="secondary" component={Link} to="/signup" fullWidth>
          Sign Up
        </Button>
        <Button variant="contained" color="secondary" component={Link} to="/signin" fullWidth>
          Sign In
        </Button>
      </Box>
    </Container>
  );
}

export default Root;
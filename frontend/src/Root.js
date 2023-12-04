import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Box, Typography, Button } from '@mui/material';

function Root() {
  return (
    <Container maxWidth="sm">
      <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
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

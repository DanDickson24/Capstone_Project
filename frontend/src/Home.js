import React, { useContext } from 'react';
import { AuthContext } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import { Container, Box, Typography, Button } from '@mui/material';

function Home() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleButtonClick = () => {
    if (user && user.user_type === 'customer') {
      navigate('/load');
    } else if (user && user.user_type === 'driver') {
      navigate('/mylocation'); 
    }
  };

  const handleEditVehicleButtonClick = () => {
    if (user && user.user_type === 'driver') {
      navigate('/editvehicle');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Home Page
        </Typography>
        {user && (
          <>
            <Button variant="contained" color="secondary" onClick={handleButtonClick}>
              {user.user_type === 'customer' ? 'Create New Load To Haul' : 'Find Customers'}
            </Button>
            {user.user_type === 'driver' && (
              <Button variant="contained" color="secondary" onClick={handleEditVehicleButtonClick} sx={{ mt: 2 }}>
                Edit Vehicle Info
              </Button>
            )}
          </>
        )}
      </Box>
    </Container>
  );
}

export default Home;
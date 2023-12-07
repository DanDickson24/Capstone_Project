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
      <Box sx={{
        marginTop: 8, 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        backgroundColor: '#f5f5f5',
        padding: 3, 
        borderRadius: 2, 
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)'
      }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Welcome to Hauler!
      </Typography>
      <Typography variant="h6" component="h3" gutterBottom> 
          What would you like to do?
        </Typography>
        {user && (
          <>
            <Button variant="contained" color="secondary" onClick={handleButtonClick} sx={{ mt: 2 }}>
              {user.user_type === 'customer' ? 'Create New Load To Haul' : 'Find Customers'}
            </Button>
            {user.user_type === 'driver' && (
              <Button variant="contained" color="secondary" onClick={handleEditVehicleButtonClick} sx={{ mt: 2 }}>
                Edit Vehicle Info
              </Button>
            )}
            <Button
              variant="contained"
              color="secondary" 
              onClick={() => navigate('/pastjourneys')}
              sx={{ mt: 2 }} 
            >
              View Past Journeys
            </Button>
          </>
        )}
      </Box>
    </Container>
  );
}

export default Home;
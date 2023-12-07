import React, { useContext } from 'react';
import DriverLocationForm from './Forms/DriverLocationForm';
import { AuthContext } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getCoordinatesFromAddress } from './api/mapboxApi';
import { Container, Typography, Box } from '@mui/material';

const MyLocation = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleDriverLocationSubmit = async (locationData) => {
        try {
            const fullAddress = `${locationData.address}, ${locationData.city}, ${locationData.state}, ${locationData.zip}`;
            const coordinates = await getCoordinatesFromAddress(fullAddress);
            if (coordinates) {
                const token = localStorage.getItem('token');
                await axios.post('http://localhost:3000/user/updateDriverLocation', {
                    driverId: user.user_id,
                    newLocation: { lat: coordinates[1], lng: coordinates[0] }
                }, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                navigate('/journey'); 
            }
        } catch (error) {
            console.error('Error updating driver location:', error);
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
            <Typography variant="h4" gutterBottom>
            </Typography>
            <DriverLocationForm onSubmit={handleDriverLocationSubmit} />
          </Box>
        </Container>
    );
};

export default MyLocation;

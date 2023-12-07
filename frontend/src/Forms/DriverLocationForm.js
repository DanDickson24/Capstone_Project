import React, { useState, useContext } from 'react';
import { AuthContext } from '../AuthContext';
import { getCoordinatesFromAddress } from '../api/mapboxApi';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Box, Container, Typography } from '@mui/material';

const DriverLocationForm = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [locationData, setLocationData] = useState({
        address: '',
        city: '',
        state: '',
        zip: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLocationData({ ...locationData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (locationData.address && locationData.city && locationData.state && locationData.zip) {
            const fullAddress = `${locationData.address}, ${locationData.city}, ${locationData.state}, ${locationData.zip}`;
            const coordinates = await getCoordinatesFromAddress(fullAddress);
            if (coordinates) {
                console.log(`Coordinates received:`, coordinates);
                updateDriverLocation(coordinates);
            }
        }
    };

    const updateDriverLocation = async (coordinates) => {
        const token = localStorage.getItem('token');
        try {
            await axios.post('http://localhost:3000/user/updateDriverLocation', {
                driverId: user.user_id,
                newLocation: { lat: coordinates[1], lng: coordinates[0] }
            }, { headers: { Authorization: `Bearer ${token}` } });
            navigate('/journey');
        } catch (error) {
            console.error('Error updating driver location:', error);
        }
    };

    return (
        <Container maxWidth="sm">
          <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography component="h1" variant="h5" color="textSecondary">
              Update Location
            </Typography>
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
              <TextField type="text" name="address" label="Address" variant="outlined" fullWidth margin="normal" onChange={handleChange} color="secondary" />
              <TextField type="text" name="city" label="City" variant="outlined" fullWidth margin="normal" onChange={handleChange} color="secondary" />
              <TextField type="text" name="state" label="State" variant="outlined" fullWidth margin="normal" onChange={handleChange} color="secondary" />
              <TextField type="text" name="zip" label="Zip Code" variant="outlined" fullWidth margin="normal" onChange={handleChange} color="secondary" />
              <Button type="submit" variant="contained" color="secondary" fullWidth sx={{ mt: 3, mb: 2 }}>
                Update Location
              </Button>
            </Box>
          </Box>
        </Container>
      );
};

export default DriverLocationForm;


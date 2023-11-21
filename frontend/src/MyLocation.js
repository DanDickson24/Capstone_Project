import React, { useContext } from 'react';
import DriverLocationForm from './Forms/DriverLocationForm';
import { AuthContext } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getCoordinatesFromAddress } from './api/mapboxApi';

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
        <div>
        <h1>Update My Location</h1>
        <DriverLocationForm onSubmit={handleDriverLocationSubmit} />
      </div>
    );
};

export default MyLocation;

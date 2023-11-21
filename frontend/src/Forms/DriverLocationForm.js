import React, { useState, useContext } from 'react';
import { AuthContext } from '../AuthContext';
import { getCoordinatesFromAddress } from '../api/mapboxApi';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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
        <form onSubmit={handleSubmit}>
            <input type="text" name="address" placeholder="Address" onChange={handleChange} />
            <input type="text" name="city" placeholder="City" onChange={handleChange} />
            <input type="text" name="state" placeholder="State" onChange={handleChange} />
            <input type="text" name="zip" placeholder="Zip Code" onChange={handleChange} />
            <button type="submit">Update Location</button>
        </form>
    );
};

export default DriverLocationForm;


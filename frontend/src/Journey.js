import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import Map from './Map';
import { AuthContext } from './AuthContext';

const Journey = () => {
    const { user } = useContext(AuthContext);
    const [locations, setLocations] = useState([]);
    const [center, setCenter] = useState(null);

    useEffect(() => {
        console.log("User in Journey.js:", user);
        if (user && user.user_type === 'driver' && user.vehicleInfo) {
            fetchJourneyData();
        } else if (user && user.user_type === 'customer') {
            fetchJourneyData();
        } else {
            console.error('Waiting for user data to load...');
        }
    }, [user]);

    const fetchJourneyData = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:3000/user/journey', {
                headers: { Authorization: `Bearer ${token}` }
            });
    
            console.log("Fetched journey data:", response.data);
                if (user.user_type === 'customer' && response.data.loadLocation) {
                setLocations(previousLocations => [...previousLocations, response.data.loadLocation]);
                setCenter([response.data.loadLocation.lng, response.data.loadLocation.lat]);
            } 
            else if (user.user_type === 'driver' && response.data.driverLocation) {
                setCenter([response.data.driverLocation.lng, response.data.driverLocation.lat]);
                setLocations([{ lng: response.data.driverLocation.lng, lat: response.data.driverLocation.lat }]);
            }
        } catch (error) {
            console.error('Error fetching journey data:', error.response || error);
        }
    };

    return (
        <div>
            <Map locations={locations} userType={user.user_type} center={center} />
        </div>
    );
};

export default Journey;
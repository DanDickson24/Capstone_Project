import React, { useEffect, useState } from 'react';
import { getRouteData } from './api/mapboxApi';
import { Card, CardContent, Typography, Grid, Button } from '@mui/material';

const isValidCoordinate = (lat, lng) => {
    return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
};

const NearbyLoads = ({ loads, driverLat, driverLng, onPickupLoad }) => {
    const [selectedLoadId, setSelectedLoadId] = useState(null);
    const [loadDistances, setLoadDistances] = useState({});

    const pickUpLoad = async (load) => {
        setSelectedLoadId(load.load_id);
        onPickupLoad(load);
    };

    useEffect(() => {
        loads.forEach(async load => {
            if (isValidCoordinate(driverLat, driverLng) && isValidCoordinate(load.pickup_lat, load.pickup_lng)) {
                const routeData = await getRouteData(driverLng, driverLat, load.pickup_lng, load.pickup_lat);
                if (routeData) {
                    const distance = (routeData.distance / 1000 * 0.621371).toFixed(2);
                    const duration = (routeData.duration / 60).toFixed(2);
                    setLoadDistances(prevDistances => ({
                        ...prevDistances,
                        [load.load_id]: { distance, duration }
                    }));
                }
            }
        });
    }, [loads, driverLat, driverLng]);

    return (
        <Grid container spacing={2}>
            {loads.slice(0, 6).map(load => (
                <Grid item key={load.load_id} xs={12} sm={6} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6">Load Description: {load.description}</Typography>
                            <Typography>Distance: {loadDistances[load.load_id]?.distance} mi</Typography>
                            <Typography>Time to Pickup: {loadDistances[load.load_id]?.duration} minutes</Typography>
                            <Button 
                                variant="contained" 
                                color="primary" 
                                onClick={() => pickUpLoad(load)} 
                                disabled={selectedLoadId === load.load_id}
                            >
                                {selectedLoadId === load.load_id ? 'Load Confirmed' : 'Pick Up Load'}
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
};

export default NearbyLoads;


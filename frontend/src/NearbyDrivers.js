import React, { useEffect, useState } from 'react';
import { getRouteData } from './api/mapboxApi';
import { Card, CardContent, Typography, Grid, Button } from '@mui/material';
import './NearbyDrivers.css';

const isValidCoordinate = (lat, lng) => {
    return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
};

const NearbyDrivers = ({ drivers, loadLat, loadLng, onDriverBooked, bookedDriverId, setBookedDriverId, isSingleDriverBooked }) => {
    const [driverDistances, setDriverDistances] = useState({});

    const bookDriver = async (driver) => {
        setBookedDriverId(driver.driver_id);
        onDriverBooked(driver);
    };


    useEffect(() => {
        drivers.forEach(async driver => {
            if (isValidCoordinate(loadLat, loadLng) && isValidCoordinate(driver.lat, driver.lng)) {
                const routeData = await getRouteData(driver.lng, driver.lat, loadLng, loadLat);
                if (routeData) {
                    const distance = (routeData.distance / 1000 * 0.621371).toFixed(2); 
                    const duration = (routeData.duration / 60).toFixed(2);
                    setDriverDistances(prevDistances => ({
                        ...prevDistances,
                        [driver.driver_id]: { distance, duration }
                    }));
                }
            }
        });
    }, [drivers, loadLat, loadLng]);

    
    return (
        <Grid container spacing={2} className={bookedDriverId ? 'gridContainerBooked' : 'gridContainer'}>
            {drivers.filter(driver => !bookedDriverId || driver.driver_id === bookedDriverId).map(driver => (
                <Grid item key={driver.driver_id} xs={12}>
                    <Card className={bookedDriverId ? 'cardBooked' : 'card'}>
                        <CardContent>
                            <Typography variant="h6">Driver: {driver.first_name} {driver.last_name}</Typography>
                            <Typography>Vehicle: {driver.vehicle_make} {driver.vehicle_model}</Typography>
                            <Typography>Distance: {driverDistances[driver.driver_id]?.distance} mi</Typography>
                            <Typography>Time to Arrival: {driverDistances[driver.driver_id]?.duration} minutes</Typography>
                            <Button 
                                variant="contained" 
                                color="primary" 
                                onClick={() => bookDriver(driver)} 
                                disabled={bookedDriverId === driver.driver_id}
                            >
                                {bookedDriverId === driver.driver_id ? 'Booked' : 'Book Driver'}
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
            }    

export default NearbyDrivers;

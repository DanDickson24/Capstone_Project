import React, { useEffect, useState } from 'react';
import { getRouteData } from './api/mapboxApi';
import { Card, CardContent, Typography, Grid, Button } from '@mui/material';
import './NearbyDrivers.css';

const isValidCoordinate = (lat, lng) => {
    return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
};

/**
 * The NearbyDrivers component displays a list of nearby drivers to the user.
 * It shows information about each driver including distance and estimated time of arrival.
 * 
 * Props:
 * - drivers: Array of driver objects to display.
 * - loadLat: Latitude of the load location.
 * - loadLng: Longitude of the load location.
 * - onDriverBooked: Function to call when a driver is booked.
 * - bookedDriverId: ID of the driver who has been booked.
 * - setBookedDriverId: Function to set the ID of the booked driver.
 * - isSingleDriverBooked: Boolean indicating if only a single driver is booked.
 */
const NearbyDrivers = ({ drivers, loadLat, loadLng, onDriverBooked, bookedDriverId, setBookedDriverId, isSingleDriverBooked }) => {
// State to keep track of distances and durations to drivers
    const [driverDistances, setDriverDistances] = useState({});

// Function to handle booking a driver
    const bookDriver = async (driver) => {
        setBookedDriverId(driver.driver_id);
        onDriverBooked(driver);
    };

// Effect to calculate distance and duration to each driver
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
        <div className="nearbyDriversContainer">
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
        </div>
    );
            }    

export default NearbyDrivers;

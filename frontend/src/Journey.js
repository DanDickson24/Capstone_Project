import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import Map from './Map';
import { AuthContext } from './AuthContext';
import NearbyDrivers from './NearbyDrivers';
import NearbyLoads from './NearbyLoads';
import { Container, Grid, Box } from '@mui/material';
import { getRouteData } from './api/mapboxApi';
import polyline from '@mapbox/polyline';

const Journey = () => {
    const { user } = useContext(AuthContext);
    const [load, setLoad] = useState(null);
    const [nearbyDrivers, setNearbyDrivers] = useState([]);
    const [nearbyLoads, setNearbyLoads] = useState([]);
    const [center, setCenter] = useState(null);
    const [driverLocation, setDriverLocation] = useState(null); 
    const [route, setRoute] = useState(null);
    const [bookedDriverId, setBookedDriverId] = useState(null);
    console.log("Initial States:", { load, nearbyDrivers, nearbyLoads, center, driverLocation, route, bookedDriverId });
    console.log("User Context:", user);

    const fetchJourneyData = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:3000/user/journey', {
                headers: { Authorization: `Bearer ${token}` }
            });
    
            console.log("Journey Data Response:", response.data);
    
            if (user.user_type === 'customer' && response.data.latestLoad) {
                setLoad(response.data.latestLoad);
                setNearbyDrivers(response.data.nearbyDrivers);
                setCenter([parseFloat(response.data.latestLoad.pickup_lng), parseFloat(response.data.latestLoad.pickup_lat)]);
            } else if (user.user_type === 'driver' && response.data.driverLocation) {
                setNearbyLoads(response.data.loadRequests || []); 
                setDriverLocation(response.data.driverLocation); 
                setCenter([parseFloat(response.data.driverLocation.lng), parseFloat(response.data.driverLocation.lat)]);
            }
        } catch (error) {
            console.error('Error fetching journey data:', error);
        }
    };

    useEffect(() => {
        console.log("User updated:", user);
        if (user) {
            fetchJourneyData();
        }
    }, [user]);

const isValidCoordinate = (lat, lng) => {
    return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
};
const onDriverBooked = async (driver) => {
    console.log("Driver booked:", driver);
    if (isValidCoordinate(load?.pickup_lat, load?.pickup_lng) && isValidCoordinate(driver.lat, driver.lng)) {
        try {
            const routeData = await getRouteData(driver.lng, driver.lat, load.pickup_lng, load.pickup_lat);
            console.log("Route Data from API:", routeData);

            if (routeData && routeData.geometry) {
                console.log("Polyline from API:", routeData.geometry);

                try {
                    const coordinates = polyline.decode(routeData.geometry);
                    console.log("Decoded Coordinates:", coordinates);
                    const transformedCoordinates = coordinates.map(coord => ({ lng: coord[1], lat: coord[0] }));
                    if (transformedCoordinates.every(coord => coord.hasOwnProperty('lat') && coord.hasOwnProperty('lng'))) {
                        setRoute({
                            coordinates: transformedCoordinates,
                            distance: routeData.distance,
                            duration: routeData.duration
                        });
                        console.log("Route State Updated:", transformedCoordinates);
                    } else {
                        console.error("Invalid coordinate format");
                    }
                } catch (error) {
                    console.error("Error decoding polyline:", error);
                }
            } else {
                console.error("Invalid or missing geometry in route data");
            }
        } catch (error) {
            console.error("Error fetching route data:", error);
        }
    }
    setBookedDriverId(driver.driver_id);
};

const onPickupLoad = async (load) => {
    console.log("Load picked up:", load);
    if (isValidCoordinate(driverLocation?.lat, driverLocation?.lng) && isValidCoordinate(load.pickup_lat, load.pickup_lng)) {
        try {
            const routeData = await getRouteData(driverLocation.lng, driverLocation.lat, load.pickup_lng, load.pickup_lat);
            console.log("Route Data from API:", routeData);

            if (routeData && routeData.geometry) {
                console.log("Polyline from API:", routeData.geometry);

                try {
                    const coordinates = polyline.decode(routeData.geometry);
                    console.log("Decoded Coordinates:", coordinates);
                    const transformedCoordinates = coordinates.map(coord => ({ lng: coord[1], lat: coord[0] }));
                    if (transformedCoordinates.every(coord => coord.hasOwnProperty('lat') && coord.hasOwnProperty('lng'))) {
                        setRoute({
                            coordinates: transformedCoordinates,
                            distance: routeData.distance,
                            duration: routeData.duration
                        });
                        console.log("Route State Updated for Driver:", transformedCoordinates);
                    } else {
                        console.error("Invalid coordinate format");
                    }
                } catch (error) {
                    console.error("Error decoding polyline:", error);
                }
            } else {
                console.error("Invalid or missing geometry in route data");
            }
        } catch (error) {
            console.error("Error fetching route data:", error);
        }
    }
};


useEffect(() => {
    console.log("Nearby Loads updated:", nearbyLoads);
    if (user.user_type === 'driver' && nearbyLoads.length > 0) {
        setCenter({ lng: parseFloat(nearbyLoads[0].pickup_lng), lat: parseFloat(nearbyLoads[0].pickup_lat) });
    }
}, [nearbyLoads, user.user_type]);

let mapLocations = [];
let componentToShow = null;
let userMapLocation = null;

if (user.user_type === 'customer' && nearbyDrivers.length > 0) {
    mapLocations = nearbyDrivers.map(d => ({ lng: parseFloat(d.lng), lat: parseFloat(d.lat) }));
    componentToShow = <NearbyDrivers
                          setBookedDriverId={setBookedDriverId}
                          bookedDriverId={bookedDriverId}
                          setRoute={setRoute}
                          onDriverBooked={onDriverBooked}
                          drivers={nearbyDrivers}
                          loadLat={parseFloat(load?.pickup_lat)}
                          loadLng={parseFloat(load?.pickup_lng)}
                          isSingleDriverBooked={bookedDriverId && nearbyDrivers.length === 1}
                      />;
    userMapLocation = load ? { lng: parseFloat(load.pickup_lng), lat: parseFloat(load.pickup_lat) } : null;
} else if (user.user_type === 'driver') {
    // Add driver's current location
    if (driverLocation) {
        userMapLocation = { lng: parseFloat(driverLocation.lng), lat: parseFloat(driverLocation.lat) };
        mapLocations.push(userMapLocation);
    }

    if (nearbyLoads && nearbyLoads.length > 0) {
        mapLocations = [...mapLocations, ...nearbyLoads.map(l => ({ lng: parseFloat(l.pickup_lng), lat: parseFloat(l.pickup_lat) }))];
        componentToShow = <NearbyLoads loads={nearbyLoads} driverLat={driverLocation?.lat} driverLng={driverLocation?.lng} onPickupLoad={onPickupLoad} />;
    }
}
console.log("Rendering with:", { mapLocations, userMapLocation, center, userType: user.user_type });
    return (
        <Container maxWidth="lg" style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}> 
            <Box sx={{ height: '50%', marginBottom: '1rem' }}>
                <Map 
                    key={route?.coordinates ? route.coordinates.map(coord => `${coord.lat},${coord.lng}`).join('|') : 'no-route'}
                    locations={mapLocations}
                    userLocation={userMapLocation}
                    center={center}
                    userType={user.user_type}
                    route={route}
                    bookedDriverId={bookedDriverId}
                />
            </Box>
            <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
                {componentToShow}
            </Box>
        </Container>
    );
};

export default Journey;


import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MAPBOX_ACCESS_TOKEN } from './api/mapboxApi';
import './Map.css';

const Map = ({ locations, userLocation, center, userType, route, bookedDriverId }) => {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const [mapLoaded, setMapLoaded] = useState(false);
    const driverMarker = useRef(null);
    const driverMarkers = useRef([]);

    useEffect(() => {
        console.log('Initializing map and markers');
        if (!map.current) {
            mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;
            map.current = new mapboxgl.Map({
                container: mapContainer.current,
                style: 'mapbox://styles/mapbox/streets-v11',
                center: center || [0, 0],
                zoom: 12
            });

            map.current.on('load', () => {
                setMapLoaded(true);
            });
        } else {
            map.current.setCenter(center || [0, 0]);
        }

        locations.forEach(location => {
            const el = document.createElement('div');
            el.className = 'marker';
            const icon = userType === 'driver' ? 'loadicon.png' : 'caricon.png';
            el.innerHTML = `<img src="${icon}" class="${userType === 'driver' ? 'load-icon' : 'car-icon'}">`;

            const marker = new mapboxgl.Marker(el)
                .setLngLat([location.lng, location.lat])
                .addTo(map.current);

            driverMarkers.current.push(marker);
        });

        if (userLocation) {
            new mapboxgl.Marker({ color: 'blue' })
                .setLngLat([userLocation.lng, userLocation.lat])
                .addTo(map.current);
        }

        return () => {
            driverMarkers.current.forEach(marker => marker.remove());
            driverMarkers.current = [];
            if (map.current) {
                map.current.remove();
                map.current = null;
            }
        };
    }, [center, locations, userType, userLocation]);

    useEffect(() => {
        console.log('Updating route and moving driver marker');
        if (!mapLoaded || !route || !route.coordinates) return;


        if (!driverMarker.current) {
            const el = document.createElement('div');
            el.className = 'marker';
            el.innerHTML = '<img src="caricon.png" class="car-icon">';

            driverMarker.current = new mapboxgl.Marker(el)
                .setLngLat(route.coordinates[0])
                .addTo(map.current);
        }

        let index = 0;
        const moveMarkerAndUpdateRoute = () => {
            if (index < route.coordinates.length) {
                const currentCoord = route.coordinates[index];
                driverMarker.current.setLngLat([currentCoord.lng, currentCoord.lat]);

                const remainingRoute = {
                    ...route,
                    coordinates: route.coordinates.slice(index)
                };
                updateRouteOnMap(remainingRoute);

                index++;
                setTimeout(moveMarkerAndUpdateRoute, 3000);
            }
        };

        moveMarkerAndUpdateRoute();

    }, [route, mapLoaded]);

    useEffect(() => {
        console.log(`Booked driver ID: ${bookedDriverId}`);
        if (bookedDriverId && driverMarkers.current.length) {
            console.log('Removing non-booked driver markers');
            driverMarkers.current.forEach(marker => marker.remove());
            driverMarkers.current = [];
        }
    }, [bookedDriverId]);

    const updateRouteOnMap = (route) => {
        const routeCoordinates = route.coordinates.map(coord => [coord.lng, coord.lat]);
        if (map.current.getSource('route')) {
            map.current.getSource('route').setData({
                type: 'Feature',
                properties: {},
                geometry: {
                    type: 'LineString',
                    coordinates: routeCoordinates,
                },
            });
        } else {
            map.current.addSource('route', {
                type: 'geojson',
                data: {
                    type: 'Feature',
                    properties: {},
                    geometry: {
                        type: 'LineString',
                        coordinates: routeCoordinates,
                    },
                },
            });
        
            map.current.addLayer({
                id: 'route',
                type: 'line',
                source: 'route',
                layout: {
                    'line-join': 'round',
                    'line-cap': 'round',
                },
                paint: {
                    'line-color': '#888',
                    'line-width': 8,
                },
            });
        }
    };

    return <div ref={mapContainer} style={{ height: '500px', width: '100%' }} />;
};

export default Map;

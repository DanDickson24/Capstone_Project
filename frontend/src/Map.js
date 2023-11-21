import React, { useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MAPBOX_ACCESS_TOKEN } from './api/mapboxApi';

const Map = ({ locations, userType, center }) => {
    useEffect(() => {
        mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;
        const map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/streets-v11',
            center: center && Array.isArray(center) && center.length === 2 ? center : [0, 0],
            zoom: 9
        });

        if (Array.isArray(locations)) {
            locations.forEach(location => {
                if (location && location.lng && location.lat) {
                    new mapboxgl.Marker()
                        .setLngLat([location.lng, location.lat])
                        .addTo(map);
                }
            });
        }

        if (Array.isArray(center) && center.length === 2 && !isNaN(center[0]) && !isNaN(center[1])) {
            map.jumpTo({ center });
        }

        return () => {
            map.remove(); 
        };
    }, [locations, userType, center]);

    return <div id="map" style={{ height: '500px', width: '100%' }} />;
};

export default Map;

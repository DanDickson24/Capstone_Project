import axios from 'axios';

const MAPBOX_ACCESS_TOKEN = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;

/**
 * Fetches geographical coordinates from a given address using the MapBox Geocoding API.
 * Address - The address to be geocoded.
 * Returns an array containing longitude and latitude of the given address or null if no coordinates are found or there's an error.
 */
const getCoordinatesFromAddress = async (address) => {
    const geocodingUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${MAPBOX_ACCESS_TOKEN}`;
  
    try {
      const response = await axios.get(geocodingUrl);
      if (response.data.features && response.data.features.length > 0) {
        console.log('MapBox API response:', response.data.features[0]);
        return response.data.features[0].center;
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error fetching location data from MapBox API:', error);
      return null; 
    }
  };


  /**
 * Fetches route data between two geographical points using the MapBox Directions API.
 * startLng - Longitude of the start point.
 * startLat - Latitude of the start point.
 * endLng - Longitude of the end point.
 * endLat - Latitude of the end point.
 * Returns an object containing route data or null if there's an error.
 */
  const getRouteData = async (startLng, startLat, endLng, endLat) => {
    const directionsUrl = `https://api.mapbox.com/directions/v5/mapbox/driving/${startLng},${startLat};${endLng},${endLat}?access_token=${MAPBOX_ACCESS_TOKEN}`;
    try {
        const response = await axios.get(directionsUrl);
        return response.data.routes[0];
    } catch (error) {
        console.error('Error fetching route data from MapBox API:', error);
        return null;
    }
};

export { getRouteData, getCoordinatesFromAddress, MAPBOX_ACCESS_TOKEN };


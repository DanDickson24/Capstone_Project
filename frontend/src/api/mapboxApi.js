import axios from 'axios';

const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1IjoiZGFuZGlja3NvbjI0IiwiYSI6ImNscDRpNXM2NzAxMjYyanFzNm4zbjZwNDEifQ.sWbsPOOaEYheYbLL8yg4cQ';

const getCoordinatesFromAddress = async (address) => {
    const geocodingUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${MAPBOX_ACCESS_TOKEN}`;
  
    try {
      console.log(`Making request to MapBox API for address: ${address}`);
      const response = await axios.get(geocodingUrl);
      if (response.data.features && response.data.features.length > 0) {
        console.log('MapBox API response:', response.data.features[0]);
        return response.data.features[0].center;
      } else {
        console.warn('No coordinates found for address:', address);
        return null;
      }
    } catch (error) {
      console.error('Error fetching location data from MapBox API:', error);
      return null; 
    }
  };

export { getCoordinatesFromAddress, MAPBOX_ACCESS_TOKEN };

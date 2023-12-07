import axios from 'axios';

const BASE_URL = 'https://vpic.nhtsa.dot.gov/api';
const automotiveMakes = [
  "FORD", 
  "CHEVROLET", 
  "TOYOTA", 
  "HONDA", 
  "NISSAN", 
  "JEEP", 
  "HYUNDAI", 
  "SUBARU", 
  "RAM", 
  "GMC", 
  "KIA", 
  "DODGE", 
  "MERCEDES-BENZ", 
  "VOLKSWAGEN", 
  "BMW", 
  "MAZDA", 
  "LEXUS", 
  "AUDI", 
  "BUICK", 
  "CADILLAC", 
  "CHRYSLER", 
  "TESLA", 
  "VOLVO", 
  "ACURA", 
  "INFINITI"
];

/**
 * Fetches a list of vehicle years from the NHTSA API.
 * Returns an array of vehicle years. Returns an empty array if there's an error.
 */
export const fetchVehicleYears = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/vehicles/getvehiclevariablevalueslist/modelyear?format=json`);
      return response.data.Results.map(year => year.Value);
    } catch (error) {
      console.error("Error fetching vehicle years", error);
      return [];
    }
};

/**
 * Fetches a list of vehicle makes from the NHTSA API and filters it based on predefined makes.
 * Returns an array of filtered vehicle makes. Returns an empty array if there's an error.
 */
export const fetchVehicleMakes = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/vehicles/getallmakes?format=json`);
    const filteredMakes = response.data.Results
      .map(make => make.Make_Name)
      .filter(makeName => automotiveMakes.includes(makeName));
    return filteredMakes;
  } catch (error) {
    console.error("Error fetching vehicle makes", error);
    return [];
  }
};

/**
 * Fetches a list of vehicle models for a specific make from the NHTSA API.
 * Returns an array of models for the specified make. Returns an empty array if there's an error or the make is not provided.
 */
export const fetchVehicleModels = async (make) => { 
  try {
    if (make) {
        const response = await axios.get(`${BASE_URL}/vehicles/GetModelsForMake/${make}?format=json`);
        return response.data.Results.map(model => model.Model_Name);
    } else {
        return []; 
    }
  } catch (error) {
    console.error("Error fetching vehicle models", error);
    return []; 
  }
};


export default { fetchVehicleMakes, fetchVehicleModels, fetchVehicleYears};
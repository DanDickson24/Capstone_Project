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


export const fetchVehicleYears = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/vehicles/getvehiclevariablevalueslist/modelyear?format=json`);
      console.log("Vehicle Years: ", response.data.Results);
      return response.data.Results.map(year => year.Value);
    } catch (error) {
      console.error("Error fetching vehicle years", error);
      return [];
    }
};

export const fetchVehicleMakes = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/vehicles/getallmakes?format=json`);
    console.log("Vehicle Makes: ", response.data.Results);
    const filteredMakes = response.data.Results
      .map(make => make.Make_Name)
      .filter(makeName => automotiveMakes.includes(makeName));
    return filteredMakes;
  } catch (error) {
    console.error("Error fetching vehicle makes", error);
    return [];
  }
};


export const fetchVehicleModels = async (make) => { 
  try {
    if (make) {
        const response = await axios.get(`${BASE_URL}/vehicles/GetModelsForMake/${make}?format=json`);
        console.log("Vehicle Models: ", response.data.Results);
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
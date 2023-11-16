import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { fetchVehicleYears, fetchVehicleMakes, fetchVehicleModels } from './api/nhtsaApi';

export function DriverSignUpForm() {
    const [formData, setFormData] = useState({
      firstName: '',
      lastName: '',
      username: '',
      email: '',
      password: '',
      phoneNumber: '',
      address: '',
      servicePreference: '',
      vehicleYear: '',
      vehicleMake: '',
      vehicleModel: '',
      vehicleTrim: '',
      vehiclePayloadCapacity: '',
      vehicleTowingCapacity: '',
      preferredPayloadCapacity: '',
      preferredTowingCapacity: ''
    });
  
    const [vehicleYears, setVehicleYears] = useState(Array.from({length: 45}, (_, i) => i + 1980));
    const [vehicleMakes, setVehicleMakes] = useState([]);
    const [vehicleModels, setVehicleModels] = useState([]);

  //   useEffect(() => {
  //     const loadVehicleYears = async () => {
  //         const years = await fetchVehicleYears();
  //         console.log('Loaded Vehicle Years: ', years);
  //         setVehicleYears(years);
  //     };
  //     loadVehicleYears();
  // }, []);

  useEffect(() => {
    const loadVehicleMakes = async () => {
        const makes = await fetchVehicleMakes();
        console.log('Loaded Vehicle Makes: ', makes);
        setVehicleMakes(makes);
    };
    loadVehicleMakes();
}, []);

useEffect(() => {
  const loadVehicleModels = async () => {
      if (formData.vehicleMake) {
          const models = await fetchVehicleModels(formData.vehicleMake);
          console.log('Loaded Vehicle Models: ', models);
          setVehicleModels(models);
      } else {
          setVehicleModels([]);
      }
  };
  loadVehicleModels();
}, [formData.vehicleMake]);

    const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const driverData = {
        ...formData,
        userType: 'driver'
    };
    try {
        const response = await axios.post('http://localhost:3000/user/signup', driverData);
        console.log(response.data);
    } catch (error) {
        console.error(error);
    }
};
  
    return (
      <form onSubmit={handleSubmit}>
        <input type="text" name="firstName" placeholder="First Name" onChange={handleChange} />
        <input type="text" name="lastName" placeholder="Last Name" onChange={handleChange} />
        <input type="text" name="username" placeholder="Username" onChange={handleChange} />
        <input type="email" name="email" placeholder="Email" onChange={handleChange} />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} />
        <input type="text" name="phoneNumber" placeholder="Phone Number" onChange={handleChange} />
        <input type="text" name="address" placeholder="Address" onChange={handleChange} />
        <select name="servicePreference" onChange={handleChange}>
          <option value="">Service Preference</option>
          <option value="towing">Towing</option>
          <option value="hauling">Hauling</option>
          <option value="both">Both</option>
        </select>
        <select name="vehicleYear" onChange={handleChange}>
                <option value="">Select Year</option>
                {vehicleYears.map(year => (
                    <option key={year} value={year}>{year}</option>
                ))}
            </select>
        <select name="vehicleMake" onChange={handleChange}>
        <option value="">Select Make</option>
        {vehicleMakes.length > 0 && vehicleMakes.map(make => (
          <option key={make} value={make}>{make}</option>
        ))}
        </select>
        <select name="vehicleModel" onChange={handleChange}>
        <option value="">Select Model</option>
        {vehicleModels.length > 0 && vehicleModels.map(model => (
          <option key={model} value={model}>{model}</option>
        ))}
        </select>
        <input type="text" name="vehicleTrim" placeholder="Vehicle Trim (optional)" onChange={handleChange} />
        <input type="number" name="vehiclePayloadCapacity" placeholder="Vehicle Payload Capacity" onChange={handleChange} />
        <input type="number" name="vehicleTowingCapacity" placeholder="Vehicle Towing Capacity" onChange={handleChange} />
        <input type="number" name="preferredPayloadCapacity" placeholder="Preferred Payload Capacity" onChange={handleChange} />
        <input type="number" name="preferredTowingCapacity" placeholder="Preferred Towing Capacity" onChange={handleChange} />
        <button type="submit">Sign Up</button>
      </form>
    );
  }
  
  export function CustomerSignUpForm() {
    const [formData, setFormData] = useState({
      firstName: '',
      lastName: '',
      username: '',
      email: '',
      password: '',
      phoneNumber: '',
      address: ''
    });
  
    const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      const customerData = {
          ...formData,
          userType: 'customer' 
      };
      try {
          const response = await axios.post('http://localhost:3000/user/signup', customerData);
          console.log(response.data);
      } catch (error) {
          console.error(error);
      }
  };
  
    return (
      <form onSubmit={handleSubmit}>
        <input type="text" name="firstName" placeholder="First Name" onChange={handleChange} />
        <input type="text" name="lastName" placeholder="Last Name" onChange={handleChange} />
        <input type="text" name="username" placeholder="Username" onChange={handleChange} />
        <input type="email" name="email" placeholder="Email" onChange={handleChange} />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} />
        <input type="text" name="phoneNumber" placeholder="Phone Number" onChange={handleChange} />
        <input type="text" name="address" placeholder="Address" onChange={handleChange} />
        <button type="submit">Sign Up</button>
      </form>
    );
  }

  export default { DriverSignUpForm, CustomerSignUpForm };
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { fetchVehicleMakes, fetchVehicleModels } from '../api/nhtsaApi';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';



export function DriverSignUpForm() {
    const { signIn } = useContext(AuthContext);
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
    const [servicePreference, setServicePreference] = useState('');
    const navigate = useNavigate();
    const [vehicleYears] = useState(Array.from({length: 45}, (_, i) => i + 1980));
    const [vehicleMakes, setVehicleMakes] = useState([]);
    const [vehicleModels, setVehicleModels] = useState([]);


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
  if (e.target.name === 'servicePreference') {
    setServicePreference(e.target.value);
  }
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    const driverData = {
      ...formData,
      userType: 'driver'
    };
  
    try {
      const signUpResponse = await axios.post('http://localhost:3000/user/signup', driverData);
  
      if (signUpResponse.status === 201) {
        console.log('Sign-up successful:', signUpResponse.data);
        
        const { user, token } = signUpResponse.data;
        signIn({ ...user, token }); 
        navigate('/home');
      } else {
        console.error('Sign-up was not successful. Status:', signUpResponse.status);
      }
    } catch (error) {
      if (error.response && error.response.data.error) {
        alert(error.response.data.error); 
      } else {
        console.error('Error during sign-up:', error);
      }
    }
  };
  const shouldDisplayField = (field) => {
    if (servicePreference === 'both') return true;
    if (servicePreference === 'towing' && field.includes('Towing')) return true;
    if (servicePreference === 'hauling' && field.includes('Payload')) return true;
    return false;
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
        <input type="text" name="city" placeholder="City" onChange={handleChange} />
        <input type="text" name="state" placeholder="State" onChange={handleChange} />
        <input type="text" name="zipCode" placeholder="Zip Code" onChange={handleChange} />
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
        {shouldDisplayField('VehiclePayloadCapacity') && (
  <div>
    <label htmlFor="vehiclePayloadCapacity">Vehicle Payload Capacity(lb): {formData.vehiclePayloadCapacity}</label>
    <input
      type="range"
      name="vehiclePayloadCapacity"
      min="0"
      max="8000"
      step="100"
      onChange={handleChange}
      value={formData.vehiclePayloadCapacity}
    />
  </div>
)}

{shouldDisplayField('VehicleTowingCapacity') && (
  <div>
    <label htmlFor="vehicleTowingCapacity">Vehicle Towing Capacity(lb): {formData.vehicleTowingCapacity}</label>
    <input
      type="range"
      name="vehicleTowingCapacity"
      min="0"
      max="35000"
      step="100"
      onChange={handleChange}
      value={formData.vehicleTowingCapacity}
    />
  </div>
)}

{shouldDisplayField('PreferredPayloadCapacity') && (
  <div>
    <label htmlFor="preferredPayloadCapacity">Preferred Payload Capacity(lb): {formData.preferredPayloadCapacity}</label>
    <input
      type="range"
      name="preferredPayloadCapacity"
      min="0"
      max="8000"
      step="100"
      onChange={handleChange}
      value={formData.preferredPayloadCapacity}
    />
  </div>
)}

{shouldDisplayField('PreferredTowingCapacity') && (
  <div>
    <label htmlFor="preferredTowingCapacity">Preferred Towing Capacity(lb): {formData.preferredTowingCapacity}</label>
    <input
      type="range"
      name="preferredTowingCapacity"
      min="0"
      max="35000"
      step="100"
      onChange={handleChange}
      value={formData.preferredTowingCapacity}
    />
  </div>
)}

      <button type="submit">Sign Up</button>
    </form>
    );
  }

export default DriverSignUpForm;
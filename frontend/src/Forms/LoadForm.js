import React, { useState, useContext } from 'react';
import { AuthContext } from '../AuthContext';
import { getCoordinatesFromAddress } from '../api/mapboxApi';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


function LoadForm() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    serviceType: '',
    loadSize: '',
    loadWeight: '',
    pickupAddress: '',
    pickupCity: '',
    pickupState: '',
    pickupZip: '',
    dropoffAddress: '',
    dropoffCity: '',
    dropoffState: '',
    dropoffZip: '',
  });

  const handleLocationChange = async (e) => {
    const { name, value } = e.target;
    const updatedFormData = { ...formData, [name]: value };
    setFormData(updatedFormData);
  
    if (name.includes('Address') || name.includes('City') || name.includes('State') || name.includes('Zip')) {
      const addressType = name.includes('pickup') ? 'pickup' : 'dropoff';
      if (updatedFormData[`${addressType}Address`] && updatedFormData[`${addressType}City`] && updatedFormData[`${addressType}State`] && updatedFormData[`${addressType}Zip`]) {
        const fullAddress = `${updatedFormData[`${addressType}Address`]}, ${updatedFormData[`${addressType}City`]}, ${updatedFormData[`${addressType}State`]}, ${updatedFormData[`${addressType}Zip`]}`;
        console.log(`Fetching coordinates for ${addressType} location: ${fullAddress}`);
        const coordinates = await getCoordinatesFromAddress(fullAddress);
        if (coordinates) {
          setFormData({ ...updatedFormData, [`${addressType}Location`]: coordinates });
          console.log(`${addressType} coordinates:`, coordinates);
        }
      }
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token'); 
    console.log("Token retrieved for submission:", token);
    if (!token) {
      console.error('No token found');
      return; 
    }
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };
    const loadData = {
      description: `${formData.loadSize} size, ${formData.loadWeight} weight`,
      load_size: formData.loadSize,
      load_weight: formData.loadWeight,
      need_hauling: formData.serviceType === 'hauling' || formData.serviceType === 'both',
      need_towing: formData.serviceType === 'towing' || formData.serviceType === 'both',
      service_type: formData.serviceType,
      pickup_location: formData.pickupLocation,
      dropoff_location: formData.dropoffLocation,
      customer_id: user.user_id
    };
    try {
      const response = await axios.post('http://localhost:3000/user/load', loadData, config);
      console.log('Load created:', response.data);
      navigate('/journey');
    } catch (error) {
      console.error('Error creating load:', error);
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <select name="serviceType" onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}>
        <option value="">I need...</option>
        <option value="hauling">Hauling</option>
        <option value="towing">Towing</option>
        <option value="both">Both</option>
      </select>
      <input type="text" name="loadSize" placeholder="Load Size" onChange={(e) => setFormData({ ...formData, loadSize: e.target.value })} />
      <input type="number" name="loadWeight" placeholder="Load Weight" onChange={(e) => setFormData({ ...formData, loadWeight: e.target.value })} />
      <input type="text" name="pickupAddress" placeholder="Pickup Address" onChange={handleLocationChange} />
      <input type="text" name="pickupCity" placeholder="Pickup City" onChange={handleLocationChange} />
      <input type="text" name="pickupState" placeholder="Pickup State" onChange={handleLocationChange} />
      <input type="text" name="pickupZip" placeholder="Pickup Zip Code" onChange={handleLocationChange} />
      <input type="text" name="dropoffAddress" placeholder="Dropoff Address" onChange={handleLocationChange} />
      <input type="text" name="dropoffCity" placeholder="Dropoff City" onChange={handleLocationChange} />
      <input type="text" name="dropoffState" placeholder="Dropoff State" onChange={handleLocationChange} />
      <input type="text" name="dropoffZip" placeholder="Dropoff Zip Code" onChange={handleLocationChange} />
      <button type="submit">Haul my stuff!</button>
    </form>
  );
}

export default LoadForm;

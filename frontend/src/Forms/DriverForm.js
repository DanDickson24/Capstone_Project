import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { fetchVehicleMakes, fetchVehicleModels } from '../api/nhtsaApi';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Select, MenuItem, InputLabel, FormControl, Slider, Typography, Box, Container } from '@mui/material';


export function DriverSignUpForm() {
    const [formData, setFormData] = useState({
      firstName: '',
      lastName: '',
      username: '',
      email: '',
      password: '',
      phoneNumber: '',
      address: '',
      serviceType: '',
      vehicleYear: '',
      vehicleMake: '',
      vehicleModel: '',
      vehicleTrim: '',
      vehiclePayloadCapacity: '',
      vehicleTowingCapacity: '',
      preferredPayloadCapacity: '',
      preferredTowingCapacity: ''
    });
    const [serviceType, setserviceType] = useState('');
    const navigate = useNavigate();
    const [vehicleYears] = useState(Array.from({length: 45}, (_, i) => i + 1980));
    const [vehicleMakes, setVehicleMakes] = useState([]);
    const [vehicleModels, setVehicleModels] = useState([]);


  useEffect(() => {
    const loadVehicleMakes = async () => {
        const makes = await fetchVehicleMakes();
        setVehicleMakes(makes);
    };
    loadVehicleMakes();
}, []);

useEffect(() => {
  const loadVehicleModels = async () => {
      if (formData.vehicleMake) {
          const models = await fetchVehicleModels(formData.vehicleMake);
          setVehicleModels(models);
      } else {
          setVehicleModels([]);
      }
  };
  loadVehicleModels();
}, [formData.vehicleMake]);

const handleChange = (e) => {
  setFormData({ ...formData, [e.target.name]: e.target.value });
  if (e.target.name === 'serviceType') {
    setserviceType(e.target.value);
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

        
        navigate('/signin');
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
    if (serviceType === 'hauling_and_towing') return true;
    if (serviceType === 'towing' && field.includes('Towing')) return true;
    if (serviceType === 'hauling' && field.includes('Payload')) return true;
    return false;
  };
  return (
    <Container maxWidth="sm">
      <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5" color="textSecondary">
          Driver Sign Up
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <TextField label="First Name" name="firstName" onChange={handleChange} fullWidth margin="normal" variant="outlined" color="secondary" />
          <TextField label="Last Name" name="lastName" onChange={handleChange} fullWidth margin="normal" variant="outlined" color="secondary" />
          <TextField label="Username" name="username" onChange={handleChange} fullWidth margin="normal" variant="outlined" color="secondary" />
          <TextField label="Email" name="email" type="email" onChange={handleChange} fullWidth margin="normal" variant="outlined" color="secondary" />
          <TextField label="Password" name="password" type="password" onChange={handleChange} fullWidth margin="normal" variant="outlined" color="secondary" />
          <TextField label="Phone Number" name="phoneNumber" onChange={handleChange} fullWidth margin="normal" variant="outlined" color="secondary" />
          <TextField label="Address" name="address" onChange={handleChange} fullWidth margin="normal" variant="outlined" color="secondary" />
          <TextField label="City" name="city" onChange={handleChange} fullWidth margin="normal" variant="outlined" color="secondary" />
          <TextField label="State" name="state" onChange={handleChange} fullWidth margin="normal" variant="outlined" color="secondary" />
          <TextField label="Zip Code" name="zipCode" onChange={handleChange} fullWidth margin="normal" variant="outlined" color="secondary" />
  
          <FormControl fullWidth margin="normal">
            <InputLabel>Service Preference</InputLabel>
            <Select name="serviceType" value={formData.serviceType} onChange={handleChange} color="secondary">
              <MenuItem value="towing">Towing</MenuItem>
              <MenuItem value="hauling">Hauling</MenuItem>
              <MenuItem value="hauling_and_towing">Both</MenuItem>
            </Select>
          </FormControl>
  
          <FormControl fullWidth margin="normal">
            <InputLabel>Vehicle Year</InputLabel>
            <Select name="vehicleYear" value={formData.vehicleYear} onChange={handleChange} color="secondary">
              {vehicleYears.map(year => (
                <MenuItem key={year} value={year}>{year}</MenuItem>
              ))}
            </Select>
          </FormControl>
  
          <FormControl fullWidth margin="normal">
            <InputLabel>Vehicle Make</InputLabel>
            <Select name="vehicleMake" value={formData.vehicleMake} onChange={handleChange} color="secondary">
              {vehicleMakes.map(make => (
                <MenuItem key={make} value={make}>{make}</MenuItem>
              ))}
            </Select>
          </FormControl>
  
          <FormControl fullWidth margin="normal">
            <InputLabel>Vehicle Model</InputLabel>
            <Select name="vehicleModel" value={formData.vehicleModel} onChange={handleChange} color="secondary">
              {vehicleModels.map(model => (
                <MenuItem key={model} value={model}>{model}</MenuItem>
              ))}
            </Select>
          </FormControl>
  
          <TextField label="Vehicle Trim (optional)" name="vehicleTrim" onChange={handleChange} fullWidth margin="normal" variant="outlined" color="secondary" />
  
          {shouldDisplayField('VehiclePayloadCapacity') && (
            <Box margin="normal">
              <Typography gutterBottom>Vehicle Payload Capacity (lb): {formData.vehiclePayloadCapacity}</Typography>
              <Slider name="vehiclePayloadCapacity" min={0} max={8000} step={100} value={formData.vehiclePayloadCapacity || 0} onChange={handleChange} valueLabelDisplay="auto" />
            </Box>
          )}
  
          {shouldDisplayField('VehicleTowingCapacity') && (
            <Box margin="normal">
              <Typography gutterBottom>Vehicle Towing Capacity (lb): {formData.vehicleTowingCapacity}</Typography>
              <Slider name="vehicleTowingCapacity" min={0} max={35000} step={100} value={formData.vehicleTowingCapacity || 0} onChange={handleChange} valueLabelDisplay="auto" />
            </Box>
          )}
  
          {shouldDisplayField('PreferredPayloadCapacity') && (
            <Box margin="normal">
              <Typography gutterBottom>Preferred Payload Capacity (lb): {formData.preferredPayloadCapacity}</Typography>
              <Slider name="preferredPayloadCapacity" min={0} max={8000} step={100} value={formData.preferredPayloadCapacity || 0} onChange={handleChange} valueLabelDisplay="auto" />
            </Box>
          )}
  
          {shouldDisplayField('PreferredTowingCapacity') && (
            <Box margin="normal">
              <Typography gutterBottom>Preferred Towing Capacity (lb): {formData.preferredTowingCapacity}</Typography>
              <Slider name="preferredTowingCapacity" min={0} max={35000} step={100} value={formData.preferredTowingCapacity || 0} onChange={handleChange} valueLabelDisplay="auto" />
            </Box>
          )}
  
          <Button variant="contained" color="secondary" type="submit" fullWidth sx={{ mt: 3, mb: 2 }}>
            Sign Up
          </Button>
        </Box>
      </Box>
    </Container>
  );
  
  }

export default DriverSignUpForm;
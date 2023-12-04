import React, { useState, useContext } from 'react';
import { AuthContext } from '../AuthContext';
import { getCoordinatesFromAddress } from '../api/mapboxApi';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Container, Box, Typography, TextField, FormControl, InputLabel, Select, MenuItem, Button, Grid } from '@mui/material';

function LoadForm() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    serviceType: '',
    loadSize: '',
    loadWeight: '',
    loadDescription: '', 
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
      description: formData.loadDescription, 
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
    <Container maxWidth="lg">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Load Details
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Typography variant="h6">Load Info:</Typography>
              <FormControl fullWidth margin="normal">
                <InputLabel>I need...</InputLabel>
                <Select name="serviceType" value={formData.serviceType} onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })} color="secondary">
                  <MenuItem value="hauling">Hauling</MenuItem>
                  <MenuItem value="towing">Towing</MenuItem>
                  <MenuItem value="hauling_and_towing">Both</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth margin="normal">
              <InputLabel>Size</InputLabel>
              <Select name="loadSize" value={formData.loadSize} onChange={(e) => setFormData({ ...formData, loadSize: e.target.value })} color="secondary">
                <MenuItem value="Small">Small</MenuItem>
                <MenuItem value="Medium">Medium</MenuItem>
                <MenuItem value="Large">Large</MenuItem>
              </Select>
            </FormControl>

            <TextField name="loadWeight" label="Load Weight(lb)" variant="outlined" fullWidth margin="normal" type="number" onChange={(e) => setFormData({ ...formData, loadWeight: e.target.value })} color="secondary" />
            <TextField name="loadDescription" label="Load Description" variant="outlined" fullWidth margin="normal"onChange={(e) => setFormData({ ...formData, loadDescription: e.target.value })} color="secondary"/>
          </Grid>

            <Grid item xs={12} md={4}>
              <Typography variant="h6">Pickup Info:</Typography>
              <TextField name="pickupAddress" label="Pickup Address" variant="outlined" fullWidth margin="normal" onChange={handleLocationChange} color="secondary" />
              <TextField name="pickupCity" label="Pickup City" variant="outlined" fullWidth margin="normal" onChange={handleLocationChange} color="secondary" />
              <TextField name="pickupState" label="Pickup State" variant="outlined" fullWidth margin="normal" onChange={handleLocationChange} color="secondary" />
              <TextField name="pickupZip" label="Pickup Zip Code" variant="outlined" fullWidth margin="normal" onChange={handleLocationChange} color="secondary" />
            </Grid>

            <Grid item xs={12} md={4}>
              <Typography variant="h6">Drop-off Info:</Typography>
              <TextField name="dropoffAddress" label="Drop-off Address" variant="outlined" fullWidth margin="normal" onChange={handleLocationChange} color="secondary" />
              <TextField name="dropoffCity" label="Drop-off City" variant="outlined" fullWidth margin="normal" onChange={handleLocationChange} color="secondary" />
              <TextField name="dropoffState" label="Drop-off State" variant="outlined" fullWidth margin="normal" onChange={handleLocationChange} color="secondary" />
              <TextField name="dropoffZip" label="Drop-off Zip Code" variant="outlined" fullWidth margin="normal" onChange={handleLocationChange} color="secondary" />
            </Grid>
          </Grid>
          <Button type="submit" variant="contained" color="secondary" fullWidth sx={{ mt: 3, mb: 2 }}>
            Haul my stuff!
          </Button>
        </form>
      </Box>
    </Container>
  );
}

export default LoadForm;

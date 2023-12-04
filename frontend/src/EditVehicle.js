import React, { useState, useEffect, useCallback, useContext } from 'react';
import axios from 'axios';
import { fetchVehicleMakes, fetchVehicleModels } from './api/nhtsaApi';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import { TextField, Button, Select, MenuItem, InputLabel, FormControl, Slider, Typography, Box, Container, Card, CardContent } from '@mui/material';

function EditVehicle() {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [vehicleYears] = useState(Array.from({ length: 45 }, (_, i) => i + 1980));
    const [vehicleMakes, setVehicleMakes] = useState([]);
    const [vehicleModels, setVehicleModels] = useState([]);
    const [currentVehicle, setCurrentVehicle] = useState({});
    const [serviceType, setServiceType] = useState('');
    const [formData, setFormData] = useState({
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

    const fetchVehicleData = useCallback(async () => {
        if (user && user.user_id) {
            const token = localStorage.getItem('token');
            try {
                const vehicleResponse = await axios.get(`http://localhost:3000/user/vehicles/${user.user_id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setCurrentVehicle(vehicleResponse.data);

                const serviceResponse = await axios.get(`http://localhost:3000/user/serviceType/${user.user_id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setServiceType(serviceResponse.data.service_type);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }
    }, [user]);

    useEffect(() => {
        fetchVehicleMakes().then(makes => {
            setVehicleMakes(makes);
        });
        fetchVehicleData();
    }, [user, fetchVehicleData]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (e.target.name === 'vehicleMake') {
            fetchVehicleModels(e.target.value).then(setVehicleModels);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
    
        const vehiclePayloadCapacity = formData.vehiclePayloadCapacity ? parseInt(formData.vehiclePayloadCapacity, 10) : null;
        const vehicleTowingCapacity = formData.vehicleTowingCapacity ? parseInt(formData.vehicleTowingCapacity, 10) : null;
        const preferredPayloadCapacity = formData.preferredPayloadCapacity ? parseInt(formData.preferredPayloadCapacity, 10) : null;
        const preferredTowingCapacity = formData.preferredTowingCapacity ? parseInt(formData.preferredTowingCapacity, 10) : null;
    
        const updatedFormData = {
            ...formData,
            vehiclePayloadCapacity,
            vehicleTowingCapacity,
            preferredPayloadCapacity,
            preferredTowingCapacity
        };
    
        try {
            await axios.post(`http://localhost:3000/user/editvehicle/${user.user_id}`, updatedFormData, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            alert('Vehicle Updated');
            navigate('/home');
        } catch (error) {
            console.error('Error updating vehicle:', error);
        }
    };

    const shouldDisplayField = (field) => {
        const serviceType = formData.serviceType;
        if (serviceType === 'hauling_and_towing') return true;
        if (serviceType === 'towing' && field.includes('Towing')) return true;
        if (serviceType === 'hauling' && field.includes('Payload')) return true;
        return false;
    };

    return (
        <Container maxWidth="sm">
            {Object.keys(currentVehicle).length > 0 && (
                <Card sx={{ mb: 3 }}>
                    <CardContent>
                        <Typography variant="h6">Current Vehicle Settings</Typography>
                        <Typography variant="body1">Service Type: {serviceType}</Typography>
                        <Typography variant="body1">Year: {currentVehicle.vehicle_year}</Typography>
                        <Typography variant="body1">Make: {currentVehicle.vehicle_make}</Typography>
                        <Typography variant="body1">Model: {currentVehicle.vehicle_model}</Typography>
                        <Typography variant="body1">Trim: {currentVehicle.vehicle_trim || 'N/A'}</Typography>
                        <Typography variant="body1">Payload Capacity: {currentVehicle.vehicle_payload_capacity}</Typography>
                        <Typography variant="body1">Towing Capacity: {currentVehicle.vehicle_towing_capacity}</Typography>
                        <Typography variant="body1">Preferred Payload Capacity: {currentVehicle.user_set_payload_capacity}</Typography>
                        <Typography variant="body1">Preferred Towing Capacity: {currentVehicle.user_set_towing_capacity}</Typography>
                    </CardContent>
                </Card>
            )}
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}> 
      <Typography component="h1" variant="h5" color="textSecondary">
        Update Vehicle Settings
      </Typography>
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

    <Button variant="contained" color="secondary" type="submit" fullWidth sx={{ mt: 3, mb: 2 }}>Update Vehicle
    </Button>
    </Box>
    </Container>
  );
}

export default EditVehicle;

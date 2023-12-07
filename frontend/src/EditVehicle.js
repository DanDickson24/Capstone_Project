import React, { useState, useEffect, useCallback, useContext } from 'react';
import axios from 'axios';
import { fetchVehicleMakes, fetchVehicleModels } from './api/nhtsaApi';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import { Typography,  Container, Card, CardContent, Box } from '@mui/material';
import EditVehicleForm from './Forms/EditVehicleForm';

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

    const getFormattedServiceType = (serviceType) => {
      switch (serviceType) {
        case 'hauling_and_towing':
          return 'Hauling & Towing';
        case 'towing':
          return 'Towing';
        case 'hauling':
          return 'Hauling';
        default:
          return serviceType;
      }
    };

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
      <Box sx={{
        marginTop: 8, 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        backgroundColor: '#f5f5f5',
        padding: 3, 
        borderRadius: 2, 
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)'
      }}>
          {Object.keys(currentVehicle).length > 0 && (
            <Card raised sx={{ mb: 4 }}>
              <CardContent sx={{
                bgcolor: 'background.default',
                boxShadow: 1,
                borderRadius: 2,
                p: 2,
                mb: 2,
                borderBottom: 0,
                '.MuiTypography-h6': {
                  fontSize: '1.25rem',
                  fontWeight: 'bold',
                  mb: 1,
                },
                '.MuiTypography-body1': {
                  mb: 0.5,
                }
              }}>
                <Typography variant="h6" gutterBottom>
                  Current Vehicle Settings
                </Typography>
                <Typography variant="body1">Service Type: {getFormattedServiceType(serviceType)}</Typography>
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
          <EditVehicleForm
            vehicleYears={vehicleYears}
            vehicleMakes={vehicleMakes}
            vehicleModels={vehicleModels}
            formData={formData}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            shouldDisplayField={shouldDisplayField}
          />
        </Box>
      </Container>
    );
  }
  
  export default EditVehicle;
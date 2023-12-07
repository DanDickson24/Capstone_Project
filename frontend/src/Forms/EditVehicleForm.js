import React from 'react';
import { TextField, Button, Select, MenuItem, InputLabel, FormControl, Slider, Typography, Box } from '@mui/material';

const EditVehicleForm = ({ vehicleYears, vehicleMakes, vehicleModels, formData, handleChange, handleSubmit, shouldDisplayField }) => {
  return (

    <Box component="form" onSubmit={handleSubmit} sx={{
        width: '100%',
        marginTop: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: '#f5f5f5', 
        padding: 3,
        borderRadius: 2,
        mb: 0,
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
        marginBottom: 3 
      }}>
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

<Button variant="contained" color="secondary" type="submit" fullWidth sx={{ mt: 3, mb: 0 }}>Update Vehicle
</Button>
</Box>

);
}

export default EditVehicleForm;
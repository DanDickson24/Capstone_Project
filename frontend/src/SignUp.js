import React, { useState } from 'react';
import CustomerForm from './Forms/CustomerForm';
import DriverForm from './Forms/DriverForm';
import { Container, Box, Typography, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

function SignUp() {
  const [userType, setUserType] = useState('');

  const handleUserTypeChange = (event) => {
    setUserType(event.target.value);
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
        <Typography variant="h4" component="h2" gutterBottom>
          Sign Up for Hauler
        </Typography>
        <FormControl fullWidth margin="normal">
          <InputLabel>I want to...</InputLabel>
          <Select value={userType} onChange={handleUserTypeChange} color="secondary">
            <MenuItem value="">Select your role</MenuItem>
            <MenuItem value="driver">Drive for Hauler</MenuItem>
            <MenuItem value="customer">Move my stuff with Hauler</MenuItem>
          </Select>
        </FormControl>
        {userType === 'driver' && <DriverForm />}
        {userType === 'customer' && <CustomerForm />}
      </Box>
    </Container>
  );
}

export default SignUp;

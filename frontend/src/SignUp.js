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
      <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
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

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Box, Container, Typography } from '@mui/material';

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
    const navigate = useNavigate();
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
        const signUpResponse = await axios.post('http://localhost:3000/user/signup', customerData);

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
  
  return (
    <Container maxWidth="sm">
      <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5" color="textSecondary">
          Customer Sign Up
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <TextField
            label="First Name"
            variant="outlined"
            name="firstName"
            onChange={handleChange}
            fullWidth
            margin="normal"
            color="secondary"
          />
          <TextField
            label="Last Name"
            variant="outlined"
            name="lastName"
            onChange={handleChange}
            fullWidth
            margin="normal"
            color="secondary"
          />
          <TextField
            label="Username"
            variant="outlined"
            name="username"
            onChange={handleChange}
            fullWidth
            margin="normal"
            color="secondary"
          />
          <TextField
            label="Email"
            variant="outlined"
            name="email"
            type="email"
            onChange={handleChange}
            fullWidth
            margin="normal"
            color="secondary"
          />
          <TextField
            label="Password"
            variant="outlined"
            name="password"
            type="password"
            onChange={handleChange}
            fullWidth
            margin="normal"
            color="secondary"
          />
          <TextField
            label="Phone Number"
            variant="outlined"
            name="phoneNumber"
            onChange={handleChange}
            fullWidth
            margin="normal"
            color="secondary"
          />
          <TextField
            label="Address"
            variant="outlined"
            name="address"
            onChange={handleChange}
            fullWidth
            margin="normal"
            color="secondary"
          />
          <TextField
            label="City"
            variant="outlined"
            name="city"
            onChange={handleChange}
            fullWidth
            margin="normal"
            color="secondary"
          />
          <TextField
            label="State"
            variant="outlined"
            name="state"
            onChange={handleChange}
            fullWidth
            margin="normal"
            color="secondary"
          />
          <TextField
            label="Zip Code"
            variant="outlined"
            name="zipCode"
            onChange={handleChange}
            fullWidth
            margin="normal"
            color="secondary"
          />
          <Button variant="contained" color="secondary" type="submit" fullWidth sx={{ mt: 3, mb: 2 }}>
            Sign Up
          </Button>
        </Box>
      </Box>
    </Container>
  );
  
  }

  export default CustomerSignUpForm;
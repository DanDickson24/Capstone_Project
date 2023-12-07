import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './AuthContext';
import { Container, Box, TextField, Button, Typography } from '@mui/material';

function SignIn() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { signIn } = useContext(AuthContext); 

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/user/login', { username, password });
      console.log(response.data);
      const userData = response.data.user;
      const token = response.data.token;
      signIn(userData, token); 
      navigate('/home');
    } catch (error) {
    }
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
       <Typography component="h1" variant="h6"> 
          Sign In to Hauler
        </Typography>
        <Box component="form" onSubmit={handleSignIn} sx={{ mt: 3 }}>
          <TextField 
            label="Username" 
            variant="outlined" 
            fullWidth 
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            color="secondary"
          />
          <TextField 
            label="Password" 
            variant="outlined" 
            type="password" 
            fullWidth 
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            color="secondary"
          />
          <Button type="submit" variant="contained" color="secondary" fullWidth sx={{ mt: 3, mb: 2 }}>
            Sign In
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default SignIn;
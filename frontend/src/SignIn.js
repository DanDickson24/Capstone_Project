import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './AuthContext';

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
    <div>
      <h2>Sign In to Hauler</h2>
      <form onSubmit={handleSignIn}>
        <input 
          type="text" 
          placeholder="Username" 
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Sign In</button>
      </form>
    </div>
  );
}

export default SignIn;

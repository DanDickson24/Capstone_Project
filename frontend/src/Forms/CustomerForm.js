import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';

export function CustomerSignUpForm() {
    const { signIn } = useContext(AuthContext);
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
          console.log('Sign-up successful:', signUpResponse.data);
          
          const { user, token } = signUpResponse.data;
          signIn({ ...user, token });
          navigate('/home');
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
      <form onSubmit={handleSubmit}>
        <input type="text" name="firstName" placeholder="First Name" onChange={handleChange} />
        <input type="text" name="lastName" placeholder="Last Name" onChange={handleChange} />
        <input type="text" name="username" placeholder="Username" onChange={handleChange} />
        <input type="email" name="email" placeholder="Email" onChange={handleChange} />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} />
        <input type="text" name="phoneNumber" placeholder="Phone Number" onChange={handleChange} />
        <input type="text" name="address" placeholder="Address" onChange={handleChange} />
        <input type="text" name="city" placeholder="City" onChange={handleChange} />
        <input type="text" name="state" placeholder="State" onChange={handleChange} />
        <input type="text" name="zipCode" placeholder="Zip Code" onChange={handleChange} />
        <button type="submit">Sign Up</button>
      </form>
    );
  }

  export default CustomerSignUpForm;
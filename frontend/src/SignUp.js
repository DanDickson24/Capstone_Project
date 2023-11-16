import React, { useState } from 'react';
import { DriverSignUpForm, CustomerSignUpForm } from './Forms';

function SignUp() {
  const [userType, setUserType] = useState('');

  const handleUserTypeChange = (e) => {
    setUserType(e.target.value);
  };

  return (
    <div>
      <h2>Sign Up for Hauler</h2>
      <select onChange={handleUserTypeChange}>
        <option value="">I want to...</option>
        <option value="driver">Drive for Hauler</option>
        <option value="customer">Move my stuff with Hauler</option>
      </select>
      {userType === 'driver' && <DriverSignUpForm />}
      {userType === 'customer' && <CustomerSignUpForm />}
    </div>
  );
}



export default SignUp;

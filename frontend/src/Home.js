import React, { useContext } from 'react';
import Navbar from './NavBar';
import { AuthContext } from './AuthContext';
import { useNavigate } from 'react-router-dom';

function Home() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  console.log("User type in Home:", user ? user.user_type : "No user");

  const handleButtonClick = () => {
    if (user && user.user_type === 'customer') {
      navigate('/load');
    } else if (user && user.user_type === 'driver') {
      navigate('/mylocation'); 
    }
  };

  return (
    <div>
      <Navbar />
      <h1>Home Page</h1>
      {user && (
        <button onClick={handleButtonClick}>
          {user.user_type === 'customer' ? 'Create New Load To Haul' : 'Find Customers'}
        </button>
      )}
    </div>
  );
}

export default Home;

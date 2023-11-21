import React, { useContext } from 'react';
import { AuthContext } from './AuthContext';
import { useNavigate } from 'react-router-dom';

function Navbar() {
  const { user, signOut } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSignOut = () => {
    signOut();
    navigate('/');
  };

  return (
    <div>
      <span>Hauler</span>
      {user && (
        <div>
          <span>Welcome {user.username}</span>
          <button onClick={handleSignOut}>Sign Out</button>
        </div>
      )}
    </div>
  );
}

export default Navbar;

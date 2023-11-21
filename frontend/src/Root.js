import React from 'react';
import { Link } from 'react-router-dom';

function Root() {
  return (
    <div>
      <h1>Welcome to Hauler</h1>
      <Link to="/signup">Sign Up</Link>
      <Link to="/signin">Sign In</Link>
    </div>
  );
}

export default Root;

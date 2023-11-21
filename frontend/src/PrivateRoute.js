import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';

const PrivateRoute = ({ element: Component, ...rest }) => {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <Navigate to="/signin" />;
  }

  return <Component {...rest} />;
};

export default PrivateRoute;
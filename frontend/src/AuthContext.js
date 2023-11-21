import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const signIn = (userData, token) => {
    console.log('Signing in user:', userData);
    if (userData.user_type === 'driver' && !userData.vehicleInfo) {
      console.error('Vehicle info missing for driver');
      return; 
    }
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', token); 
    console.log("AuthContext user:", userData);
  };
  
  const signOut = () => {
    setUser(null);
    localStorage.removeItem('user'); 
  };

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      console.log('Retrieving user from local storage:', parsedUser);
      setUser(parsedUser);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
import React, { useContext } from 'react';
import { AuthContext } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';

function Navbar() {
  const { user, signOut } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSignOut = () => {
    signOut();
    navigate('/');
  };

  return (
    <AppBar position="static" color="secondary">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Hauler
        </Typography>
        {user && (
          <Box display="flex" alignItems="center">
            <Typography variant="subtitle1" component="span" sx={{ marginRight: 2 }}>
              Welcome {user.username}
            </Typography>
            <Button color="inherit" onClick={handleSignOut}>Sign Out</Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;

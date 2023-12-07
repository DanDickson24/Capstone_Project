const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const h3 = require('h3-js');
const User = require('../models/User');
const Driver = require('../models/Driver');
const Load = require('../models/Load');
const { verifyToken } = require('../middleware/auth');
const Vehicle = require('../models/Vehicle');
const router = express.Router();

// Route to display the signup form.
router.get('/signup', (req, res) => {
    res.json({ message: 'Signup form' });
});

// Route to handle user signup.
router.post('/signup', async (req, res) => {
    try {
        console.log(req.body); 
        let newUser;
        if (req.body.userType === 'customer') {
            newUser = await User.createCustomer(req.body);
        } else if (req.body.userType === 'driver') {
            newUser = await User.createDriver(req.body);
        } else {
            throw new Error("Invalid user type");
        }
        res.status(201).json({ message: 'User created', user: newUser });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Route to handle user login.
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log('Login attempt for username:', username);

    const user = await User.findByUsername(username);
    if (!user) {
      console.log('User not found for username:', username);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.hashed_password);
    if (!isMatch) {
      console.log('Password does not match for username:', username);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (user.user_type === 'driver') {
      const vehicleInfo = await Vehicle.fetchByDriverId(user.user_id);
      if (!vehicleInfo) {
        console.log('Vehicle information not found for driver:', user.user_id);
        return res.status(404).json({ message: 'Vehicle information not found' });
      }
      user.vehicleInfo = vehicleInfo;
    }

    const token = jwt.sign({ userId: user.user_id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ message: 'Login successful', token, user });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Route to display home page based on user type.
router.get('/home', verifyToken, (req, res) => {
    if (req.user.user_type === 'driver') {
        res.json({ message: 'Driver home page' });
    } else {
        res.json({ message: 'Customer home page' });
    }
});

// Route to fetch the past journeys of a user.
router.get('/pastjourneys', verifyToken, async (req, res) => {
  try {
    console.log(`Received /pastjourneys request from user ${req.user.user_id}`);
    const userId = req.user.user_id;
    const userType = req.user.user_type;

    const journeys = await User.getPastJourneys(userId, userType);
    
    if (journeys.length === 0) {
      return res.status(404).json({ message: 'No past journeys found' });
    }

    res.json(journeys);
  } catch (error) {
    console.error('Error in /pastjourneys route:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to create a new load request.
router.post('/load', verifyToken, async (req, res) => {
  try {
    console.log('Received load request body:', req.body); 

    const loadDetails = {
      ...req.body,
    };

    console.log('Modified load details:', loadDetails); 

    const load = await Load.createLoad(loadDetails);
    res.status(201).json({ message: 'Load created successfully', load });
  } catch (error) {
    console.error('Error in /load route:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to update a driver's current location.
router.post('/updateDriverLocation', verifyToken, async (req, res) => {
  try {
  console.log('Update Driver Location Request Received:', req.body);

    const { driverId, newLocation } = req.body;
    if (!driverId || !newLocation || typeof newLocation.lat !== 'number' || typeof newLocation.lng !== 'number') {
    console.log('Invalid request body:', req.body);
    return res.status(400).json({ error: 'Invalid request data' });
    }

    await Driver.updateCurrentLocation(driverId, newLocation);
    res.status(200).json({ message: 'Driver location updated successfully' });
    } catch (error) {
    console.error('Error in /user/updateDriverLocation route:', error);
     res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
});

// Route to fetch journey data for a user.
router.get('/journey', verifyToken, async (req, res) => {
  try {
    const journeyData = await User.getJourneyData(req.user.userId);
    res.json(journeyData);
  } catch (error) {
    console.error('Error in /journey route:', error);
    res.status(error.status || 500).json({ error: error.message });
  }
});

// Route to edit vehicle information for a driver.
router.post('/editvehicle/:driverId', verifyToken, async (req, res) => {
  try {
    const driverId = req.params.driverId;
    const vehicleData = req.body;

    await Vehicle.updateVehicle(driverId, vehicleData);

    res.status(200).json({ message: 'Vehicle updated successfully' });
  } catch (error) {
    console.error('Error in /user/editvehicle/:driverId route:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to get vehicle information for a driver.
router.get('/vehicles/:driverId', verifyToken, async (req, res) => {
  try {
    const driverId = req.params.driverId;
    const vehicleInfo = await Vehicle.fetchByDriverId(driverId);

    if (!vehicleInfo) {
      return res.status(404).json({ message: 'Vehicle information not found' });
    }

    res.json(vehicleInfo);
  } catch (error) {
    console.error('Error in /vehicles/:driverId route:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }

// Route to get the service type of a driver.
  router.get('/serviceType/:driverId', verifyToken, async (req, res) => {
    console.log("Driver ID:", req.params.driverId);
    try {
      const driverId = req.params.driverId;
      const serviceType = await Driver.fetchServiceType(driverId);
  
      if (!serviceType) {
        return res.status(404).json({ message: 'Service type not found' });
      }
  
      res.json({ service_type: serviceType });
    } catch (error) {
      console.error('Error in /user/serviceType/:driverId route:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });


});


module.exports = router;





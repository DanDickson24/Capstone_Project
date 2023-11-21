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

router.get('/signup', (req, res) => {
    res.json({ message: 'Signup form' });
});

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
        return res.status(500).json({ message: 'Vehicle information not found for driver' });
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

router.get('/home', verifyToken, (req, res) => {
    if (req.user.user_type === 'driver') {
        res.json({ message: 'Driver home page' });
    } else {
        res.json({ message: 'Customer home page' });
    }
});


router.post('/load', verifyToken, async (req, res) => {
    try {
      const loadDetails = req.body;
      console.log('Creating load with details:', loadDetails);
      const load = await Load.createLoad(loadDetails);
      res.status(201).json({ message: 'Load created successfully', load });
    } catch (error) {
      console.error('Error in /load route:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  router.post('/updateDriverLocation', verifyToken, async (req, res) => {
    try {
        console.log('Update Driver Location Request Received:', req.body); 

        const { driverId, newLocation } = req.body;
        if (!driverId || !newLocation || !newLocation.lat || !newLocation.lng) {
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


  router.get('/journey', verifyToken, async (req, res) => {
    try {
      const user = await User.findByUserId(req.user.userId);
      if (!user) {
        console.log('User not found:', req.user.userId);
        return res.status(404).json({ message: 'User not found' });
      }
  
      if (user.user_type === 'customer') {
        const latestLoad = await Load.findLatestLoadByCustomerId(req.user.userId);
        if (!latestLoad) {
          console.log('No recent load found for customer:', req.user.userId);
          return res.status(404).json({ message: 'No recent load found' });
        }
  
        const loadLocation = latestLoad ? { lat: latestLoad.pickup_lat, lng: latestLoad.pickup_lng } : null;
        if (!loadLocation) {
          console.log('Invalid load location format for customer:', req.user.userId);
          return res.status(500).json({ message: 'Invalid load location format' });
        }
  
        const h3Index = h3.geoToH3(loadLocation.lat, loadLocation.lng, 9);
        const nearbyIndices = h3.kRing(h3Index, 2);
        const availableDrivers = await Driver.findNearbyDrivers(nearbyIndices, latestLoad.service_type);
        res.json({ nearbyDrivers: availableDrivers, loadLocation });
        
      } else if (user.user_type === 'driver') {
        const driverLocation = await Driver.fetchLocation(req.user.userId);
        console.log("driverLocation for driver:", driverLocation);
  
        if (!driverLocation || !user.vehicleInfo || !user.vehicleInfo.payloadCapacity || !user.vehicleInfo.towingCapacity) {
          console.log('Missing driver location or vehicle information');
          return res.status(400).json({ message: 'Missing driver location or vehicle information' });
        }
  
        const h3Index = h3.geoToH3(driverLocation.lat, driverLocation.lng, 9);
        const nearbyIndices = h3.kRing(h3Index, 2);
        const loadRequests = await Load.findNearbyLoadRequests(nearbyIndices, user.servicePreference, user.vehicleInfo);
        res.json({ nearbyLoadRequests: loadRequests, driverLocation });
    } else {
        console.log('Access denied for user type:', user.user_type);
        res.status(403).json({ message: 'Access denied' });
      }
    } catch (error) {
      console.error('Error in /journey route:', error);
      res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
  });
module.exports = router;

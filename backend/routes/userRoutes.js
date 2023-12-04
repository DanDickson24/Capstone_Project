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

router.get('/home', verifyToken, (req, res) => {
    if (req.user.user_type === 'driver') {
        res.json({ message: 'Driver home page' });
    } else {
        res.json({ message: 'Customer home page' });
    }
});


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

// router.get('/journey', verifyToken, async (req, res) => {
//   try {
//     const user = await User.findByUserId(req.user.userId);
//     console.log(`User type: ${user.user_type}, User ID: ${req.user.userId}`);

//     if (!user) {
//       console.log('User not found:', req.user.userId);
//       return res.status(404).json({ message: 'User not found' });
//     }

//     if (user.user_type === 'customer') {
//       const latestLoad = await Load.findLatestLoadByCustomerId(req.user.userId);

//       if (!latestLoad) {
//         console.log('No recent load found for customer:', req.user.userId);
//         return res.status(404).json({ message: 'No recent load found' });
//       }

//       const vehiclePayloadCapacity = latestLoad.need_hauling ? parseFloat(latestLoad.load_weight) : null;
//       const vehicleTowingCapacity = latestLoad.need_towing ? parseFloat(latestLoad.load_weight) : null;

//       const nearbyDrivers = await Driver.findNearbyDrivers(
//         { lat: latestLoad.pickup_lat, lng: latestLoad.pickup_lng },
//         latestLoad.service_type,
//         vehiclePayloadCapacity,
//         vehicleTowingCapacity
//       );

//       res.json({ 
//         nearbyDrivers: nearbyDrivers.map(driver => ({
//           driver_id: driver.driver_id,
//           first_name: driver.first_name,
//           last_name: driver.last_name,
//           lat: driver.lat,
//           lng: driver.lng,
//           h3_index: driver.grid_cell_id,
//           vehicle_make: driver.vehicle_make,
//           vehicle_model: driver.vehicle_model
//         })),
//         latestLoad
//       });
//     } else if (user.user_type === 'driver') {
//       const driverLocation = await Driver.fetchLocation(req.user.userId);
//       if (!driverLocation) {
//         return res.status(400).json({ message: 'Driver location not found' });
//       }

//       const vehicleInfo = await Vehicle.fetchByDriverId(req.user.userId);
//       if (!vehicleInfo) {
//         return res.status(400).json({ message: 'Vehicle information not found' });
//       }

//       const loadRequests = await Load.findNearbyLoadRequests(
//         driverLocation,  
//         vehicleInfo
//       );

//       const loadRequestsWithLocation = loadRequests.map(load => ({
//         load_id: load.load_id,
//         description: load.description,
//         pickup_lng: load.pickup_lng, 
//         pickup_lat: load.pickup_lat,
//       }));

//       res.json({
//         nearbyLoadRequests: loadRequestsWithLocation,
//         driverLocation,
//         vehicleInfo
//       });
//     } else {
//       res.status(403).json({ message: 'Access denied' });
//     }
//   } catch (error) {
//     console.error('Error in /journey route:', error);
//     res.status(500).json({ error: 'Internal Server Error', details: error.message });
//   }
// });

router.get('/journey', verifyToken, async (req, res) => {
  try {
    const journeyData = await User.getJourneyData(req.user.userId);
    res.json(journeyData);
  } catch (error) {
    console.error('Error in /journey route:', error);
    res.status(error.status || 500).json({ error: error.message });
  }
});

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





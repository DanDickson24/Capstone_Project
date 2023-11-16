const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const h3 = require('h3-js');
const User = require('../models/User');
const Driver = require('../models/Driver');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

router.get('/signup', (req, res) => {
    res.json({ message: 'Signup form' });
});

router.post('/signup', async (req, res) => {
    try {
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
        const user = await User.findByUsername(username);

        if (user && await bcrypt.compare(password, user.hashed_password)) {
            const token = jwt.sign({ userId: user.user_id }, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.json({ message: 'Login successful', token });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
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

router.get('/load', verifyToken, (req, res) => {
    if (req.user.user_type !== 'customer') {
        return res.status(403).json({ message: 'Access denied' });
    }
    res.json({ message: 'Load details form' });
});

router.post('/load', verifyToken, async (req, res) => {
    const loadDetails = req.body;

    if (req.user.user_type !== 'customer') {
        return res.status(403).json({ message: 'Access denied' });
    }

    try {
        const customerId = req.user.userId; 
        const newLoad = await Customer.createLoadRequest(customerId, loadDetails);
        res.status(201).json({ message: 'Load request created', loadDetails: newLoad });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/journey', verifyToken, async (req, res) => {
    const userLocation = { lat: req.user.latitude, lng: req.user.longitude };
    const resolution = 9;
    const ringSize = 2;
    const userIndex = h3.geoToH3(userLocation.lat, userLocation.lng, resolution);
    const nearbyIndices = h3.kRing(userIndex, ringSize);

    try {
        if (req.user.user_type === 'customer') {
            const loadRequests = await Customer.fetchLoadRequests(req.user.userId);
            const latestLoadRequest = loadRequests[0];

            if (!latestLoadRequest) {
                return res.status(404).json({ message: 'No load requests found' });
            }

            const serviceType = latestLoadRequest.service_type; 
            const availableDrivers = await Driver.findNearbyDrivers(nearbyIndices, serviceType);
            res.json({ availableDrivers });
        } else if (req.user.user_type === 'driver') {
            const servicePreference = await Driver.fetchServicePreference(req.user.userId);
            const vehicleInfo = await Vehicle.fetchVehicleInfo(req.user.userId); 

            const nearbyLoadRequests = await Customer.findNearbyLoadRequestsFiltered(
                nearbyIndices, 
                servicePreference, 
                vehicleInfo
            );

            res.json({ nearbyLoadRequests });
        } else {
            res.status(403).json({ message: 'Access denied' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;

const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'Welcome to the service. Please login or sign up.' });
});

module.exports = router;
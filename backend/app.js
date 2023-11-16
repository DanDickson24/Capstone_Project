const express = require('express');
const cors = require('cors');
const app = express();
const authMiddleware = require('./middleware/auth');
const errorHandler = require('./middleware/errorHandler');

app.use(cors()); 
app.use(express.json());

const rootRoutes = require('./routes/rootRoutes');
const userRoutes = require('./routes/userRoutes');

app.use('/', rootRoutes);
app.use('/user', userRoutes);

app.use(express.json());

app.get('/protected-route', authMiddleware.authenticate, (req, res) => {
  res.send('This is a protected route');
});

app.use(errorHandler);


module.exports = app;
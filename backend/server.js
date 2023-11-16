"use strict";

const app = require("./app");
const cors = require("cors"); 
const { PORT } = require("./config");

app.use(cors({
  origin: 'http://localhost:3001', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true 
}));

app.listen(PORT, function () {
  console.log(`Started on http://localhost:${PORT}`);
});

"use strict";
const { Client } = require("pg");
const { getDatabaseUri } = require("./config");

let db;

db = new Client({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME
});


getDatabaseUri()

db.connect();

module.exports = db;


"use strict";
const { Client } = require("pg");
const { getDatabaseUri } = require("./config");

let db;

db = new Client({
  user: "postgres",
  password: "test",
  host: "localhost",
  port: 5432,
  database: "hauler"
});

getDatabaseUri()

db.connect();

module.exports = db;



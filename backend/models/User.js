const db = require('../db');
const bcrypt = require('bcrypt');
const Vehicle = require('./Vehicle'); 

class User {
    constructor(user_id, user_type, first_name, last_name, username, hashed_password, email, phone_number, address, rating, created_at, updated_at) {
      this.user_id = user_id;
      this.user_type = user_type;
      this.first_name = first_name;
      this.last_name = last_name;
      this.username = username;
      this.hashed_password = hashed_password;
      this.email = email;
      this.phone_number = phone_number;
      this.address = address;
      this.rating = rating;
      this.created_at = created_at;
      this.updated_at = updated_at;
    }
  //   static async createUser(userData) {
  //     const query = `INSERT INTO users (user_type, first_name, last_name, username, hashed_password, email, phone_number, address, rating) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`;
  //     const values = [
  //         userData.user_type, 
  //         userData.first_name, 
  //         userData.last_name,
  //         userData.username, 
  //         userData.hashed_password, 
  //         userData.email, 
  //         userData.phone_number, 
  //         userData.address, 
  //         userData.rating
  //     ];
  //     const result = await db.query(query, values);
  //     return result.rows[0];
  // }
    
  static async createCustomer(userData) {
    const query = `INSERT INTO users (user_type, first_name, last_name, username, hashed_password, email, phone_number, address) 
                   VALUES ('customer', $1, $2, $3, $4, $5, $6, $7) RETURNING *`;
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const values = [userData.first_name, userData.last_name, userData.username, hashedPassword, userData.email, userData.phone_number, userData.address];
    const result = await db.query(query, values);
    return new User(result.rows[0]);
}

static async createDriver(userData) {
  const query = `INSERT INTO users (user_type, first_name, last_name, username, hashed_password, email, phone_number, address) 
                 VALUES ('driver', $1, $2, $3, $4, $5, $6, $7) RETURNING *`;
  const hashedPassword = await bcrypt.hash(userData.password, 10);
  const driverValues = [userData.first_name, userData.last_name, userData.username, hashedPassword, userData.email, userData.phone_number, userData.address];
  const driverResult = await db.query(query, driverValues);
  const newDriver = new User(driverResult.rows[0]);

  await Vehicle.createVehicle(newDriver.user_id, userData);

  return newDriver;
}


  }
  
  module.exports = User;
const db = require('../db');
const bcrypt = require('bcrypt');
const Vehicle = require('./Vehicle'); 

class User {
  constructor(userData) {
      this.user_id = userData.user_id;
      this.user_type = userData.user_type;
      this.first_name = userData.first_name;
      this.last_name = userData.last_name;
      this.username = userData.username;
      this.hashed_password = userData.hashed_password;
      this.email = userData.email;
      this.phone_number = userData.phone_number;
      this.address = userData.address;
      this.rating = userData.rating;
      this.created_at = userData.created_at;
      this.updated_at = userData.updated_at;
  }
    
  static async createCustomer(userData) {
    try {
      const existingUser = await db.query(
        'SELECT * FROM users WHERE email = $1 OR username = $2 OR phone_number = $3',
        [userData.email, userData.username, userData.phoneNumber]
      );
      if (existingUser.rows.length > 0) {
        throw new Error('Email, username, or phone number already in use');
      }
  
      const query = `INSERT INTO users 
        (user_type, first_name, last_name, username, hashed_password, email, phone_number, address, city, state, zip_code) 
        VALUES ('customer', $1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`;
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const values = [
        userData.firstName, userData.lastName, userData.username, 
        hashedPassword, userData.email, userData.phoneNumber, 
        userData.address, userData.city, userData.state, userData.zipCode
      ];
      const result = await db.query(query, values);
      return new User(result.rows[0]);
    } catch (error) {
      console.error("Error in createCustomer:", error);
      throw error;
    }
  }

static async createDriver(userData) {
  try {
    const existingUser = await db.query(
      'SELECT * FROM users WHERE email = $1 OR username = $2 OR phone_number = $3',
      [userData.email, userData.username, userData.phoneNumber]
    );
    if (existingUser.rows.length > 0) {
      throw new Error('Email, username, or phone number already in use');
    }

    const userQuery = `INSERT INTO users 
      (user_type, first_name, last_name, username, hashed_password, email, phone_number, address, city, state, zip_code) 
      VALUES ('driver', $1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`;
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const userValues = [
      userData.firstName, userData.lastName, userData.username, 
      hashedPassword, userData.email, userData.phoneNumber, 
      userData.address, userData.city, userData.state, userData.zipCode
    ];
    const userResult = await db.query(userQuery, userValues);
    
    if (userResult.rows.length === 0) {
      throw new Error('Driver creation failed');
    }

    const newDriver = new User(userResult.rows[0]);

    const driverQuery = 'INSERT INTO drivers (driver_id) VALUES ($1)';
    await db.query(driverQuery, [newDriver.user_id]);


    await Vehicle.createVehicle(newDriver.user_id, userData);

    return newDriver;
  } catch (error) {
    console.error('Error in createDriver:', error);
    throw error;
  }
}


static async findByUsername(username) {
  try {
    const query = `SELECT * FROM users WHERE username = $1`;
    const result = await db.query(query, [username]);
    if (result.rows.length === 0) return null;

    const user = new User(result.rows[0]);

    if (user.user_type === 'driver') {
      const vehicleInfo = await Vehicle.fetchByDriverId(user.user_id);
      user.vehicleInfo = vehicleInfo; 
    }

    return user;
  } catch (error) {
    console.error("Error in findByUsername:", error);
    throw error;
  }
}

static async fetchLocation(userId) {
  try {
      const query = `SELECT latitude, longitude FROM users WHERE user_id = $1`;
      const result = await db.query(query, [userId]);
      if (result.rows.length === 0) throw new Error('User location not found');
      return { latitude: result.rows[0].latitude, longitude: result.rows[0].longitude };
  } catch (error) {
      console.error("Error in fetchLocation:", error);
      throw error;
  }
}

static async findByUserId(userId) {
  try {
      const query = `SELECT * FROM users WHERE user_id = $1`;
      const result = await db.query(query, [userId]);
      if (result.rows.length === 0) return null;
      return new User(result.rows[0]);
  } catch (error) {
      console.error("Error in findByUserId:", error);
      throw error;
  }
}

  }
  
  module.exports = User;
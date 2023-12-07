const db = require('../db'); 

// The Vehicle class handles operations related to vehicle data in the application.
class Vehicle {
    constructor(vehicle_id, driver_id, vehicle_year, vehicle_make, vehicle_model, vehicle_trim, vehicle_payload_capacity, vehicle_towing_capacity, user_set_payload_capacity, user_set_towing_capacity) {
      this.vehicle_id = vehicle_id;
      this.driver_id = driver_id;
      this.vehicle_year = vehicle_year;
      this.vehicle_make = vehicle_make;
      this.vehicle_model = vehicle_model;
      this.vehicle_trim = vehicle_trim;
      this.vehicle_payload_capacity = vehicle_payload_capacity;
      this.vehicle_towing_capacity = vehicle_towing_capacity;
      this.user_set_payload_capacity = user_set_payload_capacity;
      this.user_set_towing_capacity = user_set_towing_capacity;
    }

// Creates a new vehicle record in the database.
    static async createVehicle(driverId, vehicleData) {
      const query = `INSERT INTO vehicles (driver_id, vehicle_year, vehicle_make, vehicle_model, vehicle_trim, vehicle_payload_capacity, vehicle_towing_capacity, user_set_payload_capacity, user_set_towing_capacity) 
                     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`;
      const values = [driverId, vehicleData.vehicleYear, vehicleData.vehicleMake, vehicleData.vehicleModel, vehicleData.vehicleTrim, vehicleData.vehiclePayloadCapacity, vehicleData.vehicleTowingCapacity, vehicleData.preferredPayloadCapacity, vehicleData.preferredTowingCapacity];
      await db.query(query, values);
  }

// Fetches vehicle data for a given driver ID.
  static async fetchByDriverId(driverId) {
    try {
      const query = `SELECT * FROM vehicles WHERE driver_id = $1`;
      const result = await db.query(query, [driverId]);
      if (result.rows.length === 0) {
        console.log(`No vehicle found for driverId: ${driverId}`);
        return null;
      }
      return result.rows[0];
    } catch (error) {
      console.error('Error in fetchByDriverId:', error);
      throw error;
    }
  }
  
// Updates vehicle information for a given driver ID.
  static async updateVehicle(driverId, vehicleData) {
    try {
      const query = `
        UPDATE vehicles 
        SET vehicle_year = $1, 
            vehicle_make = $2, 
            vehicle_model = $3, 
            vehicle_trim = $4, 
            vehicle_payload_capacity = $5, 
            vehicle_towing_capacity = $6, 
            user_set_payload_capacity = $7, 
            user_set_towing_capacity = $8 
        WHERE driver_id = $9`;
      const values = [
        vehicleData.vehicleYear, 
        vehicleData.vehicleMake, 
        vehicleData.vehicleModel, 
        vehicleData.vehicleTrim, 
        vehicleData.vehiclePayloadCapacity, 
        vehicleData.vehicleTowingCapacity, 
        vehicleData.preferredPayloadCapacity, 
        vehicleData.preferredTowingCapacity, 
        driverId
      ];
      await db.query(query, values);
    } catch (error) {
      console.error('Error in updateVehicle:', error);
      throw error;
    }
  }
}

  
  module.exports = Vehicle;
const db = require('../db'); 

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
    static async createVehicle(driverId, vehicleData) {
      const query = `INSERT INTO vehicles (driver_id, vehicle_year, vehicle_make, vehicle_model, vehicle_trim, vehicle_payload_capacity, vehicle_towing_capacity, user_set_payload_capacity, user_set_towing_capacity) 
                     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`;
      const values = [driverId, vehicleData.vehicleYear, vehicleData.vehicleMake, vehicleData.vehicleModel, vehicleData.vehicleTrim, vehicleData.vehiclePayloadCapacity, vehicleData.vehicleTowingCapacity, vehicleData.preferredPayloadCapacity, vehicleData.preferredTowingCapacity];
      await db.query(query, values);
  }

  }
  
  module.exports = Vehicle;
const db = require('../db'); 
const h3 = require('h3-js');
class Driver {
  constructor(driver_id, current_location, grid_cell_id, available, service_preference) {
    this.driver_id = driver_id;
    this.current_location = current_location;
    this.grid_cell_id = grid_cell_id;
    this.available = available;
    this.service_preference = service_preference;
  }
  static async updateServicePreference(driverId, newPreference) {
    try {
      const query = `UPDATE drivers SET service_preference = $1 WHERE driver_id = $2`;
      await db.query(query, [newPreference, driverId]);
    } catch (error) {
      throw new Error('Error updating service preference');
    }
  }

  static async fetchServicePreference(driverId) {
    try {
      const query = `SELECT service_preference FROM drivers WHERE driver_id = $1`;
      const result = await db.query(query, [driverId]);
      return result.rows[0]?.service_preference;
    } catch (error) {
      throw new Error('Error fetching service preference');
    }
  }
  
    static async findNearbyDrivers(h3Indices, serviceType) {
      try {
        const query = 'SELECT * FROM drivers WHERE grid_cell_id = ANY($1) AND available = true AND service_type = $2';
        const values = [h3Indices, serviceType];
  
        const result = await db.query(query, values);
        return result.rows.map(row => new Driver(row.driver_id, row.current_location, row.grid_cell_id, row.available));
      } catch (error) {
        throw new Error('Error fetching nearby drivers');
      }
    }
  
    static async updateCurrentLocation(driverId, newLocation) {
      try {
        const newH3Index = h3.geoToH3(newLocation.lat, newLocation.lng, resolution);
  
        const query = 'UPDATE drivers SET current_location = $1, grid_cell_id = $2 WHERE driver_id = $3';
        const values = [newLocation, newH3Index, driverId];
  
        await db.query(query, values);
      } catch (error) {
        throw new Error('Error updating driver location');
      }
    }

    static async fetchServiceRates(driverId) {
      const query = `SELECT * FROM service_rates WHERE driver_id = $1`;
      const result = await db.query(query, [driverId]);
      return result.rows;
    }

    static async fetchAvailability(driverId) {
      const query = `SELECT available FROM drivers WHERE driver_id = $1`;
      const result = await db.query(query, [driverId]);
      return result.rows[0]?.available;
    }
}

  module.exports = Driver;
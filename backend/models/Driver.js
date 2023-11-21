const db = require('../db'); 
const h3 = require('h3-js');

class Driver {
  constructor(driverData) {
    this.driver_id = driverData.driver_id;
    this.current_location = driverData.current_location;
    this.grid_cell_id = driverData.grid_cell_id;
    this.available = driverData.available;
    this.service_preference = driverData.service_preference;
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
  
  static async fetchLocation(driverId) {
    try {
        const query = `SELECT current_location FROM drivers WHERE driver_id = $1`;
        const result = await db.query(query, [driverId]);
        if (result.rows.length === 0 || !result.rows[0].current_location) {
            console.log('Driver location not found or not set for driver_id:', driverId);
            return null;
        }
        const location = result.rows[0].current_location;
        return { lat: location.y, lng: location.x };
    } catch (error) {
        console.error('Error in fetchLocation:', error);
        throw error;
    }
}
static async updateCurrentLocation(driverId, newLocation) {
  const h3Index = h3.geoToH3(newLocation.lat, newLocation.lng, 9);
  const query = `
      UPDATE drivers 
      SET current_location = ST_SetSRID(ST_MakePoint($1, $2), 4326), 
          grid_cell_id = $3 
      WHERE driver_id = $4`;
  await db.query(query, [newLocation.lng, newLocation.lat, h3Index, driverId]);
}

static async findNearbyDrivers(h3Indices, serviceType) {
  try {
      const query = `
          SELECT * FROM drivers
          WHERE grid_cell_id = ANY($1) AND
                service_preference = $2 AND
                available = true`;
      const values = [h3Indices, serviceType];
      const result = await db.query(query, values);
      return result.rows.map(row => new Driver(row));
  } catch (error) {
      console.error('Error in findNearbyDrivers:', error);
      throw error;
  }
}

}

  module.exports = Driver;
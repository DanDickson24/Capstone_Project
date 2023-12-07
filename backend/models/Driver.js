const db = require('../db'); 
const h3 = require('h3-js');

// The Driver class represents a driver in the application.
// It includes properties related to the driver's details and their vehicle.
class Driver {
// The constructor initializes a new instance of the Driver class.
  constructor(driverData) {
    this.driver_id = driverData.driver_id;
    this.current_location = driverData.current_location; 
    this.lat = driverData.lat; 
    this.lng = driverData.lng; 
    this.grid_cell_id = driverData.grid_cell_id;
    this.available = driverData.available;
    this.service_type = driverData.service_type;
    this.first_name = driverData.first_name;
    this.last_name = driverData.last_name;
    this.vehicle_make = driverData.vehicle_make;
    this.vehicle_model = driverData.vehicle_model;
  }
// Updates the service type of a driver in the database.
  static async updateServiceType(driverId, newType) {
    try {
      const query = `UPDATE drivers SET service_type = $1 WHERE driver_id = $2`;
      await db.query(query, [newType, driverId]);
    } catch (error) {
      throw new Error('Error updating service preference');
    }
  }
// Retrieves the current service type of a driver.
  static async fetchServiceType(driverId) {
    try {
      const query = `SELECT service_type FROM drivers WHERE driver_id = $1`;
      const result = await db.query(query, [driverId]);
      return result.rows[0]?.service_type;
    } catch (error) {
      console.error('Error in fetchServiceType:', error);
      throw error;
    }
  }
// Fetches the current location of a driver.
  static async fetchType(driverId) {
    try {
      const query = `SELECT service_type FROM drivers WHERE driver_id = $1`;
      const result = await db.query(query, [driverId]);
      return result.rows[0]?.service_type;
    } catch (error) {
      throw new Error('Error fetching service preference');
    }
  }

  // Finds nearby drivers for a specific load based on location and service requirements.
  static async fetchLocation(driverId) {
    try {
        console.log(`Fetching location for driver with driverId: ${driverId}`);
        const query = `SELECT ST_X(current_location::geometry) AS longitude, ST_Y(current_location::geometry) AS latitude FROM drivers WHERE driver_id = $1`;
        const result = await db.query(query, [driverId]);
        console.log(`Query result for fetchLocation:`, result.rows);

        if (result.rows.length === 0 || !result.rows[0].latitude || !result.rows[0].longitude) {
            console.log('Driver location not found or not set for driverId:', driverId);
            return null;
        }
        const location = result.rows[0];
        console.log(`Parsed location for driverId ${driverId}:`, location);
        return { lat: location.latitude, lng: location.longitude };
    } catch (error) {
        console.error('Error in fetchLocation:', error);
        throw error;
    }
}
  // Finds nearby drivers for a specific load based on location and service requirements.
static async findNearbyDriversForLoad(load) {
  const vehiclePayloadCapacity = load.need_hauling ? parseFloat(load.load_weight) : null;
  const vehicleTowingCapacity = load.need_towing ? parseFloat(load.load_weight) : null;

  return this.findNearbyDrivers(
    { lat: load.pickup_lat, lng: load.pickup_lng },
    load.service_type,
    vehiclePayloadCapacity,
    vehicleTowingCapacity
  );
}
  // Finds nearby drivers within a certain radius based on the driver's location and service type.
  static async findNearbyDrivers(loadLocation, serviceType, vehiclePayloadCapacity, vehicleTowingCapacity, maxRadius = 20) {
    const loadH3Index = h3.geoToH3(loadLocation.lat, loadLocation.lng, 9);
    let radius = 1;
    let nearbyDrivers = [];

    while (radius <= maxRadius && nearbyDrivers.length === 0) {
      const nearbyH3Indices = h3.kRing(loadH3Index, radius);
      let queryParams = [nearbyH3Indices];
      let query = `
      SELECT d.driver_id, u.first_name, u.last_name, d.service_type, d.available, d.grid_cell_id,
             ST_Y(d.current_location::geometry) AS lat, 
             ST_X(d.current_location::geometry) AS lng,
             v.vehicle_payload_capacity, v.vehicle_towing_capacity,
             v.vehicle_make, v.vehicle_model
      FROM drivers d
      JOIN users u ON d.driver_id = u.user_id
      LEFT JOIN vehicles v ON d.driver_id = v.driver_id
      WHERE d.grid_cell_id = ANY($1)
        AND d.available = true
        AND (d.service_type = $2 OR d.service_type = 'hauling_and_towing')
      `;

      queryParams.push(serviceType === 'hauling_and_towing' ? 'hauling_and_towing' : serviceType);

      if (serviceType !== 'towing' && vehiclePayloadCapacity) {
        query += ` AND v.vehicle_payload_capacity >= $${queryParams.length + 1}`;
        queryParams.push(vehiclePayloadCapacity);
      }

      if (serviceType !== 'hauling' && vehicleTowingCapacity) {
        query += ` AND v.vehicle_towing_capacity >= $${queryParams.length + 1}`;
        queryParams.push(vehicleTowingCapacity);
      }

      query += ` LIMIT 4`;

      console.log("Query Parameters:", queryParams);
      const result = await db.query(query, queryParams);
      nearbyDrivers = result.rows.map(driver => new Driver(driver));

      radius++;
    }

    return nearbyDrivers;
  }

// Updates the current location of a driver in the database.
  static async updateCurrentLocation(driverId, newLocation) {
    try {
      const h3Index = h3.geoToH3(newLocation.lat, newLocation.lng, 9);
      const query = `
        UPDATE drivers 
        SET current_location = ST_SetSRID(ST_MakePoint($1, $2), 4326), 
            grid_cell_id = $3 
        WHERE driver_id = $4`;
      await db.query(query, [newLocation.lng, newLocation.lat, h3Index, driverId]);
    } catch (error) {
      console.error('Error in updateCurrentLocation:', error);
      throw new Error('Error updating driver location');
    }
  }
}


  module.exports = Driver;




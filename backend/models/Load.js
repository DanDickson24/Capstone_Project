const db = require('../db');
console.log('About to import h3');
const h3 = require('h3-js');
console.log('H3 Version:', h3.version);
console.log('h3 imported', h3);

function isValidLatLng(lat, lng) {
    return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
}

class Load {
    constructor(loadData) {
        Object.assign(this, loadData);
    }
    toString() {
        return JSON.stringify(this, null, 2);
    }
    static async createLoad(loadData) {
        console.log('Received load data:', loadData);
        
        if (!Array.isArray(loadData.pickup_location) || loadData.pickup_location.length !== 2) {
            console.error('Invalid pickup location format:', loadData.pickup_location);
            throw new Error('Invalid pickup location format');
        }
        if (!Array.isArray(loadData.dropoff_location) || loadData.dropoff_location.length !== 2) {
            console.error('Invalid dropoff location format:', loadData.dropoff_location);
            throw new Error('Invalid dropoff location format');
        }

        if (!isValidLatLng(loadData.pickup_location[1], loadData.pickup_location[0])) {
            console.error('Invalid latitude or longitude for pickup location');
            throw new Error('Invalid latitude or longitude for pickup location');
        }

        let serviceType = loadData.service_type;
        if (serviceType === 'both') {
            serviceType = 'hauling_and_towing';
        }
        console.log('Calculating H3 index for', loadData.pickup_location[1], loadData.pickup_location[0]);
        if (!isValidLatLng(loadData.pickup_location[1], loadData.pickup_location[0])) {
            console.error('Invalid latitude or longitude for pickup location');
            throw new Error('Invalid latitude or longitude for pickup location');
          }
      
          const h3Index = h3.geoToH3(loadData.pickup_location[1], loadData.pickup_location[0], 9);
          console.log('H3 index generated:', h3Index);
        console.log('H3 index generated:', h3Index);

        const query = `
            INSERT INTO loads 
              (customer_id, description, load_size, load_weight, need_hauling, 
               need_towing, service_type, pickup_location, dropoff_location, h3_index, status) 
            VALUES 
              ($1, $2, $3, $4, $5, $6, $7, ST_SetSRID(ST_MakePoint($8, $9), 4326), 
               ST_SetSRID(ST_MakePoint($10, $11), 4326), $12, 'pending') 
            RETURNING *`;

            const values = [
                loadData.customer_id, loadData.description, loadData.load_size, 
                loadData.load_weight, loadData.need_hauling, loadData.need_towing, 
                serviceType,
                loadData.pickup_location[0], loadData.pickup_location[1],
                loadData.dropoff_location[0], loadData.dropoff_location[1], h3Index
            ];

        try {
            const result = await db.query(query, values);
            console.log('Load created:', result.rows[0]);
            return new Load(result.rows[0]);
        } catch (error) {
            console.error('Error in createLoad:', error);
            throw error;
        }

    }

    static async findNearbyLoadRequests(h3Index, servicePreference, vehicleInfo) {
        const nearbyIndices = h3.kRing(h3Index, 2);
        const query = `
            SELECT * FROM loads
            WHERE h3_index = ANY($1) AND
                  service_type = $2 AND
                  load_size <= $3 AND
                  load_weight <= $4`;
        const values = [nearbyIndices, servicePreference, vehicleInfo.payloadCapacity, vehicleInfo.towingCapacity];
        const result = await db.query(query, values);
        return result.rows.map(row => new Load(row));
    }

    static pointToLatLng(point) {
        if (!point) return null;
        const buffer = Buffer.from(point, 'hex');
        const lng = buffer.readDoubleBE(5);
        const lat = buffer.readDoubleBE(13);
        return { lat, lng };
    }

    static async findLatestLoadByCustomerId(customerId) {
        console.log('Fetching latest load for customer_id:', customerId);
    
        const query = `
            SELECT load_id, customer_id, description, load_size, load_weight, need_hauling,
                   need_towing, service_type, status, created_at, updated_at,
                   ST_Y(pickup_location::geometry) AS pickup_lat,
                   ST_X(pickup_location::geometry) AS pickup_lng,
                   ST_Y(dropoff_location::geometry) AS dropoff_lat,
                   ST_X(dropoff_location::geometry) AS dropoff_lng
            FROM loads 
            WHERE customer_id = $1 
            ORDER BY created_at DESC 
            LIMIT 1`;
        console.log('Executing query:', query, 'with customerId:', customerId);
    
        try {
            const result = await db.query(query, [customerId]);
            console.log('SQL Query Result:', result.rows);  
    
            if (result.rows.length === 0) {
                console.log('No load found for customer_id:', customerId);
                return null;
            }
            const loadRow = result.rows[0];
            const load = new Load({
                ...loadRow,
                pickup_location: { lat: loadRow.pickup_lat, lng: loadRow.pickup_lng },
                dropoff_location: { lat: loadRow.dropoff_lat, lng: loadRow.dropoff_lng }
            });
            console.log('Constructed Load Object:', load);
            return load;
        } catch (error) {
            console.error('Error in findLatestLoadByCustomerId:', error);
            throw error;
        }
    }
}
  module.exports = Load;
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
          const pickupH3Index = h3.geoToH3(loadData.pickup_location[1], loadData.pickup_location[0], 9);
          const h3Index = h3.geoToH3(loadData.pickup_location[1], loadData.pickup_location[0], 9);
          console.log('H3 index generated:', h3Index);
        console.log('H3 index generated:', h3Index);

        const query = `
            INSERT INTO loads 
              (customer_id, description, load_size, load_weight, need_hauling, 
               need_towing, service_type, pickup_location, dropoff_location, h3_index, grid_cell_id, status) 
            VALUES 
              ($1, $2, $3, $4, $5, $6, $7, ST_SetSRID(ST_MakePoint($8, $9), 4326), 
               ST_SetSRID(ST_MakePoint($10, $11), 4326), $12, $13, 'pending') 
            RETURNING *`;

        const values = [
            loadData.customer_id, loadData.description, loadData.load_size, 
            loadData.load_weight, loadData.need_hauling, loadData.need_towing, 
            loadData.service_type,
            loadData.pickup_location[0], loadData.pickup_location[1],
            loadData.dropoff_location[0], loadData.dropoff_location[1], 
            pickupH3Index, pickupH3Index 
        ];
        console.log('SQL Query:', query);
        console.log('Query values:', values);
        try {
            const result = await db.query(query, values);
            console.log('Load created:', result.rows[0]);
            return new Load(result.rows[0]);
        } catch (error) {
            console.error('Error in createLoad:', error);
            throw error;
        }

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


    static async findNearbyLoadRequests(driverLocation, vehicleInfo, maxRadius = 20) {
        console.log(`Driver location for H3 Index Calculation: Lat - ${driverLocation.lat}, Lng - ${driverLocation.lng}`);
        const driverH3Index = h3.geoToH3(driverLocation.lat, driverLocation.lng, 9);
        console.log(`Calculated driver H3 Index: ${driverH3Index}`);
        let radius = 1;
        let nearbyLoadRequests = [];

        while (radius <= maxRadius && nearbyLoadRequests.length === 0) {
            console.log(`Searching within radius: ${radius}`);
            const nearbyH3Indices = h3.kRing(driverH3Index, radius);
            console.log(`Nearby H3 Indices: ${JSON.stringify(nearbyH3Indices)}`);
            let queryParams = [nearbyH3Indices];

            let query = `
            SELECT *, 
                   ST_Y(pickup_location::geometry) AS pickup_lat, 
                   ST_X(pickup_location::geometry) AS pickup_lng
            FROM loads
            WHERE grid_cell_id = ANY($1)
            AND status = 'pending'`;
        
        if (vehicleInfo.vehicle_payload_capacity && vehicleInfo.vehicle_towing_capacity) {
            query += ` AND ((service_type = 'hauling' AND load_weight <= $2)
                     OR (service_type = 'towing' AND load_weight <= $3)
                     OR (service_type = 'hauling_and_towing' AND load_weight <= LEAST($2, $3)))`;
            queryParams.push(vehicleInfo.vehicle_payload_capacity, vehicleInfo.vehicle_towing_capacity);
        } else if (vehicleInfo.vehicle_payload_capacity) {
            query += ` AND (service_type IN ('hauling', 'hauling_and_towing') AND load_weight <= $2)`;
            queryParams.push(vehicleInfo.vehicle_payload_capacity);
        } else if (vehicleInfo.vehicle_towing_capacity) {
            query += ` AND (service_type IN ('towing', 'hauling_and_towing') AND load_weight <= $2)`;
            queryParams.push(vehicleInfo.vehicle_towing_capacity);
        }

        query += ` LIMIT 4`; 
        
        console.log("Executing SQL Query:", query);
            try {
                const result = await db.query(query, queryParams);
                console.log(`Found ${result.rows.length} load requests.`);
                nearbyLoadRequests = result.rows.map(load => new Load(load));
            } catch (error) {
                console.error("SQL Query Error:", error);
            }

            radius++;
        }

        console.log(`Total nearby load requests found: ${nearbyLoadRequests.length}`);
        return nearbyLoadRequests;
    }
}
  module.exports = Load;



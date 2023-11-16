class Customer {
    constructor(customer_id, approximate_load_size, approximate_load_weight, need_hauling, need_towing, current_location, grid_cell_id, destination_location) {
      this.customer_id = customer_id;
      this.approximate_load_size = approximate_load_size;
      this.approximate_load_weight = approximate_load_weight;
      this.need_hauling = need_hauling;
      this.need_towing = need_towing;
      this.current_location = current_location;
      this.grid_cell_id = grid_cell_id;
      this.destination_location = destination_location;
    }
    static async createCustomer(customerData) {
      const query = `INSERT INTO customers (approximate_load_size, approximate_load_weight, need_hauling, need_towing, current_location, grid_cell_id, destination_location) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`;
      const values = [customerData.approximate_load_size, customerData.approximate_load_weight, customerData.need_hauling, customerData.need_towing, customerData.current_location, customerData.grid_cell_id, customerData.destination_location];
      const result = await db.query(query, values);
      return result.rows[0];
    }

    static async updateLocation(customerId, newLocation) {
      const newH3Index = h3.geoToH3(newLocation.lat, newLocation.lng, resolution);
      const query = `UPDATE customers SET current_location = ST_Point($1, $2), grid_cell_id = $3 WHERE customer_id = $4`;
      await db.query(query, [newLocation.lat, newLocation.lng, newH3Index, customerId]);
    }

    static async fetchLoadRequests(customerId) {
      const query = `SELECT * FROM loads WHERE customer_id = $1`;
      const result = await db.query(query, [customerId]);
      return result.rows;
    }

    static async createLoadRequest(customerId, loadDetails) {
      const query = `INSERT INTO loads (customer_id, description, load_size, load_weight, need_hauling, need_towing, pickup_location, dropoff_location, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`;
      const values = [customerId, loadDetails.description, loadDetails.load_size, loadDetails.load_weight, loadDetails.need_hauling, loadDetails.need_towing, loadDetails.pickup_location, loadDetails.dropoff_location, 'pending']; 
      const result = await db.query(query, values);
      return result.rows[0];
  }

  static async findNearbyLoadRequestsFiltered(h3Indices, servicePreference, vehicleInfo) {
    try {
        const query = `
            SELECT * FROM loads
            WHERE grid_cell_id = ANY($1)
            AND status = 'pending'
            AND (
                ($2 = 'both') OR
                (need_hauling = true AND $2 = 'hauling') OR
                (need_towing = true AND $2 = 'towing')
            )
            AND load_weight <= $3
            AND load_size <= $4
        `;
        const values = [
            h3Indices,
            servicePreference,
            vehicleInfo.vehicle_payload_capacity,
            vehicleInfo.vehicle_towing_capacity
        ];
        const result = await db.query(query, values);
        return result.rows;
    } catch (error) {
        throw new Error('Error fetching filtered load requests');
    }
}
}

  module.exports = Customer;
  
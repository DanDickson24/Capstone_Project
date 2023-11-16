class Location {
    constructor(location_id, user_id, latitude, longitude, location_type, description) {
      this.location_id = location_id;
      this.user_id = user_id;
      this.latitude = latitude;
      this.longitude = longitude;
      this.location_type = location_type;
      this.description = description;
    }

  }
  

  module.exports = Location;
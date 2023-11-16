class ServiceRate {
    constructor(rate_id, driver_id, service_type, rate) {
      this.rate_id = rate_id;
      this.driver_id = driver_id;
      this.service_type = service_type;
      this.rate = rate;
    }
  }
  
  module.exports = ServiceRate;
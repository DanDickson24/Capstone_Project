class Transaction {
    constructor(transaction_id, customer_id, driver_id, vehicle_id, status, transaction_amount, transaction_date) {
      this.transaction_id = transaction_id;
      this.customer_id = customer_id;
      this.driver_id = driver_id;
      this.vehicle_id = vehicle_id;
      this.status = status;
      this.transaction_amount = transaction_amount;
      this.transaction_date = transaction_date;
    }
  }
  
  module.exports = Transaction;
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    user_type VARCHAR(50) NOT NULL CHECK (user_type IN ('driver', 'customer')),
    first_name VARCHAR(255) NOT NULL,  
    last_name VARCHAR(255) NOT NULL,  
    username VARCHAR(255) UNIQUE NOT NULL,
    hashed_password TEXT NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone_number VARCHAR(50) UNIQUE NOT NULL,
    address VARCHAR(255) NOT NULL,
    rating DECIMAL(3, 2),  -- Can be computed based on reviews
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- Drivers table
CREATE TABLE drivers (
    driver_id INTEGER PRIMARY KEY REFERENCES users(user_id),
    current_location GEOGRAPHY(Point, 4326),
    grid_cell_id VARCHAR(50);
    available BOOLEAN NOT NULL DEFAULT true;
);


-- Vehicles table
CREATE TABLE vehicles (
    vehicle_id SERIAL PRIMARY KEY,
    driver_id INTEGER REFERENCES drivers(driver_id),
    vehicle_year INTEGER,
    vehicle_make VARCHAR(100),
    vehicle_model VARCHAR(100),
    vehicle_trim VARCHAR(100),
    vehicle_payload_capacity DECIMAL(10, 2),
    vehicle_towing_capacity DECIMAL(10, 2),
    user_set_payload_capacity DECIMAL(10, 2),
    user_set_towing_capacity DECIMAL(10, 2)
);


-- Customers table
CREATE TABLE customers (
    customer_id INTEGER PRIMARY KEY REFERENCES users(user_id),
    approximate_load_size VARCHAR(100),
    approximate_load_weight DECIMAL(10, 2),
    need_hauling BOOLEAN NOT NULL,
    need_towing BOOLEAN NOT NULL,
    current_location GEOGRAPHY(Point, 4326),
    grid_cell_id VARCHAR(50),
    destination_location GEOGRAPHY(Point, 4326);
);


-- Reviews table
CREATE TABLE reviews (
    review_id SERIAL PRIMARY KEY,
    reviewer_id INTEGER REFERENCES users(user_id),
    reviewed_id INTEGER REFERENCES users(user_id),
    rating DECIMAL(3, 2) NOT NULL,
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    incident_reported BOOLEAN DEFAULT false,
    feedback_type VARCHAR(50) CHECK (feedback_type IN ('positive', 'negative', 'neutral'));
);


-- Transactions table
CREATE TABLE transactions (
    transaction_id SERIAL PRIMARY KEY,
    customer_id INTEGER REFERENCES customers(customer_id),
    driver_id INTEGER REFERENCES drivers(driver_id),
    vehicle_id INTEGER REFERENCES vehicles(vehicle_id), 
    status VARCHAR(50) CHECK (status IN ('pending', 'confirmed', 'in-progress', 'completed', 'canceled')),
    transaction_amount DECIMAL(10, 2), 
    transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Rates for services
CREATE TABLE service_rates (
    rate_id SERIAL PRIMARY KEY,
    driver_id INTEGER REFERENCES drivers(driver_id),
    service_type VARCHAR(100) NOT NULL,
    rate DECIMAL(10, 2) NOT NULL
);


-- Locations table
CREATE TABLE locations (
    location_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id),
    latitude DECIMAL(10, 7),
    longitude DECIMAL(10, 7),
    location_type VARCHAR(50) CHECK (location_type IN ('current', 'destination', 'other')),
    description VARCHAR(255)
);

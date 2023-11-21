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
    city VARCHAR(255),
    state VARCHAR(255),
    zip_code VARCHAR(20);

    rating DECIMAL(3, 2), 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE drivers (
    driver_id INTEGER PRIMARY KEY REFERENCES users(user_id),
    current_location GEOGRAPHY(Point, 4326),
    h3_index VARCHAR(50),
    grid_cell_id VARCHAR(50),
    service_preference VARCHAR(50) CHECK (service_preference IN ('towing', 'hauling', 'both')),
    available BOOLEAN NOT NULL DEFAULT true
);

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

CREATE TABLE reviews (
    review_id SERIAL PRIMARY KEY,
    reviewer_id INTEGER REFERENCES users(user_id),
    reviewed_id INTEGER REFERENCES users(user_id),
    rating DECIMAL(3, 2) NOT NULL,
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    incident_reported BOOLEAN DEFAULT false,
    feedback_type VARCHAR(50) CHECK (feedback_type IN ('positive', 'negative', 'neutral'))
);

CREATE TABLE transactions (
    transaction_id SERIAL PRIMARY KEY,
    customer_id INTEGER REFERENCES users(user_id),
    driver_id INTEGER REFERENCES drivers(driver_id),
    vehicle_id INTEGER REFERENCES vehicles(vehicle_id), 
    status VARCHAR(50) CHECK (status IN ('pending', 'confirmed', 'in-progress', 'completed', 'canceled')),
    transaction_amount DECIMAL(10, 2), 
    transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE service_rates (
    rate_id SERIAL PRIMARY KEY,
    driver_id INTEGER REFERENCES drivers(driver_id),
    service_type VARCHAR(100) NOT NULL,
    rate DECIMAL(10, 2) NOT NULL
);

CREATE TABLE loads (
    load_id SERIAL PRIMARY KEY,
    customer_id INTEGER REFERENCES users(user_id),
    description TEXT,
    load_size VARCHAR(100),
    load_weight DECIMAL(10, 2),
    need_hauling BOOLEAN NOT NULL,
    need_towing BOOLEAN NOT NULL,
    service_type VARCHAR(50) CHECK (service_type IN ('hauling', 'towing', 'hauling_and_towing')),
    pickup_location GEOGRAPHY(Point, 4326),
    dropoff_location GEOGRAPHY(Point, 4326),
    h3_index VARCHAR(50),
    status VARCHAR(50) CHECK (status IN ('pending', 'assigned', 'in-transit', 'completed', 'canceled')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

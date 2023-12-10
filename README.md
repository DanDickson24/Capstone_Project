# README for Hauler

## Project Overview
This application facilitates an on-demand load hauling and towing service, connecting drivers with customers who need to transport goods.

## Database Setup

### Schema
The database schema is defined in `dbschema.sql`. It includes tables for users, drivers, vehicles, loads, transactions, and reviews. The schema is designed to support various features like user management, load tracking, driver location updates, and service reviews.

### Test Data
The `testdata.sql` file contains sample data to populate the database for testing. It includes entries for drivers, customers, vehicles, and loads. This data is essential for running the application in a test environment.

## Application Components

### Server
- Written in Node.js.
- Uses Express.js for handling HTTP requests.
- Implements JWT for authentication.
- Connects to a PostgreSQL database.
- Uses bcrypt for password hashing.
- Incorporates the h3 library for geospatial data indexing and querying.

### Models
- **User**: Manages customer and driver data.
- **Driver**: Handles driver-specific functionalities.
- **Load**: Manages load creation and tracking.
- **Vehicle**: Handles vehicle data linked to drivers.

### Routes
- User authentication (signup, login).
- Load management (createLoad, findNearbyLoadRequests).
- Driver functionalities (updateDriverLocation, findNearbyDriversForLoad).
- Driver/Customer journeys (getJourneyData).

### Frontend
- Built with React.js.
- Implements routing with react-router-dom.
- Uses Material-UI for styling.
- Integrates Mapbox API for map visualization and routing.

## Installation and Setup
1. Clone the repository.
2. Install dependencies: `npm install`.
3. Set up the PostgreSQL database using `dbschema.sql` and `testdata.sql`.
4. Configure environment variables: `JWT_SECRET`, `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `MAPBOX_ACCESS_TOKEN`.
5. Start the server: `npm start`.

## Usage
- **Sign Up/Login**: Users must sign up and log in to access the application.
- **Create Load**: Customers can create load requests, which will then find drivers nearby able to handle the request.
- **Update Driver Location**: Drivers can update their current location and find customers nearby that have loads that meet their parameters.
- **Journey**: Customers are presented a map view of drivers near to them who are able to move their load. Drivers are also presented a map view that shows them the nearest loads to them that their vehicle is able to handle.

## Future Updates
- **Transaction history/past journeys**: A route that will show users their previous completed journeys
- **Reviews**: Drivers and customers will be able to leave one another reviews.
- **Custom pricing**: Drivers will be able to set their own prices for the services they offer.
-- Test Drivers
INSERT INTO users (user_type, first_name, last_name, username, hashed_password, email, phone_number, address, city, state, zip_code) VALUES 
('driver', 'Alex', 'Thompson', 'alex.thompson01', 'hashed_password', 'alex.thompson01@example.com', '987-654-3210', '1234 Main St', 'Anytown', 'CA', '12345'),
('driver', 'Brian', 'White', 'brian.white02', 'hashed_password', 'brian.white02@example.com', '876-543-2109', '2345 Oak St', 'Springfield', 'TX', '23456'),
('driver', 'Carla', 'Garcia', 'carla.garcia03', 'hashed_password', 'carla.garcia03@example.com', '765-432-1098', '3456 Pine St', 'Liberty', 'NY', '34567'),
('driver', 'David', 'Miller', 'david.miller04', 'hashed_password', 'david.miller04@example.com', '654-321-0987', '4567 Maple Ave', 'Union', 'FL', '45678'),
('driver', 'Eva', 'Davis', 'eva.davis05', 'hashed_password', 'eva.davis05@example.com', '543-210-9876', '5678 Elm St', 'Harmony', 'WA', '56789'),
('driver', 'Frank', 'Lopez', 'frank.lopez06', 'hashed_password', 'frank.lopez06@example.com', '432-109-8765', '6789 Cedar Rd', 'Prosperity', 'CO', '67890'),
('driver', 'Grace', 'Hernandez', 'grace.hernandez07', 'hashed_password', 'grace.hernandez07@example.com', '321-098-7654', '7890 Birch Ln', 'Peace', 'MI', '78901'),
('driver', 'Henry', 'Martinez', 'henry.martinez08', 'hashed_password', 'henry.martinez08@example.com', '210-987-6543', '8901 Willow St', 'Tranquility', 'IL', '89012'),
('driver', 'Ivy', 'Wilson', 'ivy.wilson09', 'hashed_password', 'ivy.wilson09@example.com', '109-876-5432', '9012 Oak Dr', 'Bliss', 'TN', '90123'),
('driver', 'Jack', 'Anderson', 'jack.anderson10', 'hashed_password', 'jack.anderson10@example.com', '098-765-4321', '1012 Pine Blvd', 'Utopia', 'NE', '10124'),
('driver', 'Kara', 'Thomas', 'kara.thomas11', 'hashed_password', 'kara.thomas11@example.com', '987-654-3211', '1112 Cedar St', 'Serenity', 'KS', '11234'),
('driver', 'Liam', 'Jackson', 'liam.jackson12', 'hashed_password', 'liam.jackson12@example.com', '876-543-2108', '1213 Spruce Ave', 'Harmony', 'MS', '12345'),
('driver', 'Mona', 'Harris', 'mona.harris13', 'hashed_password', 'mona.harris13@example.com', '765-432-1097', '1314 Birch Rd', 'Joy', 'AL', '13456'),
('driver', 'Nate', 'Clark', 'nate.clark14', 'hashed_password', 'nate.clark14@example.com', '654-321-0986', '1415 Elm Ln', 'Elysium', 'AK', '14567'),
('driver', 'Olivia', 'Lewis', 'olivia.lewis15', 'hashed_password', 'olivia.lewis15@example.com', '543-210-9875', '1516 Maple St', 'Nirvana', 'SC', '15678'),
('driver', 'Pete', 'Robinson', 'pete.robinson16', 'hashed_password', 'pete.robinson16@example.com', '432-109-8764', '1617 Oak Rd', 'Eden', 'NV', '16789'),
('driver', 'Quinn', 'Walker', 'quinn.walker17', 'hashed_password', 'quinn.walker17@example.com', '321-098-7653', '1718 Pine St', 'Bliss', 'AR', '17890'),
('driver', 'Rita', 'Perez', 'rita.perez18', 'hashed_password', 'rita.perez18@example.com', '210-987-6542', '1819 Cedar Ave', 'Haven', 'MT', '18901'),
('driver', 'Sam', 'Moore', 'sam.moore19', 'hashed_password', 'sam.moore19@example.com', '109-876-5431', '1920 Spruce Blvd', 'Paradise', 'ID', '19012'),
('driver', 'Tina', 'Taylor', 'tina.taylor20', 'hashed_password', 'tina.taylor20@example.com', '098-765-4320', '2021 Birch Ln', 'Arcadia', 'RI', '20123');



-- Test Customers
INSERT INTO users (user_type, first_name, last_name, username, hashed_password, email, phone_number, address, city, state, zip_code) VALUES 
('customer', 'John', 'Doe', 'john.doe01', 'hashed_password', 'john.doe01@example.com', '123-456-7890', '1234 Main St', 'Anytown', 'CA', '12345'),
('customer', 'Jane', 'Smith', 'jane.smith02', 'hashed_password', 'jane.smith02@example.com', '234-567-8901', '2345 Oak St', 'Springfield', 'TX', '23456'),
('customer', 'Emily', 'Jones', 'emily.jones03', 'hashed_password', 'emily.jones03@example.com', '345-678-9012', '3456 Pine St', 'Liberty', 'NY', '34567'),
('customer', 'Michael', 'Brown', 'michael.brown04', 'hashed_password', 'michael.brown04@example.com', '456-789-0123', '4567 Maple Ave', 'Union', 'FL', '45678'),
('customer', 'Sarah', 'Johnson', 'sarah.johnson05', 'hashed_password', 'sarah.johnson05@example.com', '567-890-1234', '5678 Elm St', 'Harmony', 'WA', '56789'),
('customer', 'Chris', 'Davis', 'chris.davis06', 'hashed_password', 'chris.davis06@example.com', '678-901-2345', '6789 Cedar Rd', 'Prosperity', 'CO', '67890'),
('customer', 'Ashley', 'Wilson', 'ashley.wilson07', 'hashed_password', 'ashley.wilson07@example.com', '789-012-3456', '7890 Birch Ln', 'Peace', 'MI', '78901'),
('customer', 'Justin', 'Martinez', 'justin.martinez08', 'hashed_password', 'justin.martinez08@example.com', '890-123-4567', '8901 Willow St', 'Tranquility', 'IL', '89012'),
('customer', 'Olivia', 'Anderson', 'olivia.anderson09', 'hashed_password', 'olivia.anderson09@example.com', '901-234-5678', '9012 Oak Dr', 'Bliss', 'TN', '90123'),
('customer', 'Ethan', 'Taylor', 'ethan.taylor10', 'hashed_password', 'ethan.taylor10@example.com', '012-345-6789', '1012 Pine Blvd', 'Utopia', 'NE', '10124'),
('customer', 'Sophia', 'Moore', 'sophia.moore11', 'hashed_password', 'sophia.moore11@example.com', '123-456-7891', '1112 Cedar St', 'Serenity', 'KS', '11234'),
('customer', 'Aiden', 'Jackson', 'aiden.jackson12', 'hashed_password', 'aiden.jackson12@example.com', '234-567-8902', '1213 Spruce Ave', 'Harmony', 'MS', '12345'),
('customer', 'Emma', 'White', 'emma.white13', 'hashed_password', 'emma.white13@example.com', '345-678-9013', '1314 Birch Rd', 'Joy', 'AL', '13456'),
('customer', 'Noah', 'Harris', 'noah.harris14', 'hashed_password', 'noah.harris14@example.com', '456-789-0124', '1415 Elm Ln', 'Elysium', 'AK', '14567'),
('customer', 'Mia', 'Lewis', 'mia.lewis15', 'hashed_password', 'mia.lewis15@example.com', '567-890-1235', '1516 Maple St', 'Nirvana', 'SC', '15678'),
('customer', 'Lucas', 'Clark', 'lucas.clark16', 'hashed_password', 'lucas.clark16@example.com', '678-901-2346', '1617 Oak Rd', 'Eden', 'NV', '16789'),
('customer', 'Isabella', 'Rodriguez', 'isabella.rodriguez17', 'hashed_password', 'isabella.rodriguez17@example.com', '789-012-3457', '1718 Pine St', 'Bliss', 'AR', '17890'),
('customer', 'Mason', 'Lewis', 'mason.lewis18', 'hashed_password', 'mason.lewis18@example.com', '890-123-4568', '1819 Cedar Ave', 'Paradise', 'NM', '18901'),
('customer', 'Lily', 'Walker', 'lily.walker19', 'hashed_password', 'lily.walker19@example.com', '901-234-5679', '1920 Spruce Blvd', 'Heaven', 'ND', '19012'),
('customer', 'Jacob', 'Young', 'jacob.young20', 'hashed_password', 'jacob.young20@example.com', '012-345-6780', '2021 Birch Ln', 'Arcadia', 'VT', '20123');


-- Test vehicles
INSERT INTO vehicles (driver_id, vehicle_year, vehicle_make, vehicle_model, vehicle_trim, vehicle_payload_capacity, vehicle_towing_capacity, user_set_payload_capacity, user_set_towing_capacity) 
VALUES (117, 2020, 'Ford', 'F-150', 'XLT', 2000, 5000, 1800, 4500);
(118, 2019, 'Chevrolet', 'Silverado', 'LT', 2100, 7000, 1900, 6500);
(119, 2021, 'Ram', '1500', 'Laramie', 2300, 8000, 2200, 7500);
(120, 2018, 'Toyota', 'Tundra', 'SR5', 2000, 7300, 1900, 7000);
(121, 2017, 'GMC', 'Sierra', 'SLT', 2200, 7600, 2100, 7200);
(122, 2022, 'Nissan', 'Titan', 'Platinum Reserve', 2000, 9300, 1800, 8800);
(123, 2020, 'Honda', 'Ridgeline', 'RTL-E', 1584, 5000, 1500, 4800);
(124, 2021, 'Jeep', 'Gladiator', 'Mojave', 1700, 7650, 1600, 7400);
(125, 2019, 'Dodge', 'Ram 2500', 'Laramie Longhorn', 3100, 14000, 3000, 13500);
(126, 2018, 'Chevrolet', 'Colorado', 'Z71', 1570, 7700, 1500, 7500);
(127, 2022, 'Ford', 'Ranger', 'Lariat', 1860, 7500, 1800, 7300);
(128, 2017, 'Toyota', 'Tacoma', 'TRD Off-Road', 1620, 6800, 1500, 6500);
(129, 2020, 'GMC', 'Canyon', 'Denali', 1600, 7700, 1550, 7400);
(130, 2021, 'Nissan', 'Frontier', 'Pro-4X', 1460, 6720, 1400, 6500);
(131, 2019, 'Jeep', 'Gladiator', 'Rubicon', 1600, 7000, 1550, 6800);
(132, 2018, 'Ford', 'F-250', 'XLT', 3500, 15000, 3400, 14500);
(133, 2022, 'Chevrolet', 'Silverado 3500HD', 'High Country', 4180, 36000, 4000, 35000);
(134, 2021, 'Ram', '3500', 'Limited', 4030, 35300, 3900, 34000);
(135, 2017, 'GMC', 'Sierra 2500HD', 'Denali', 2810, 13000, 2700, 12500);
(136, 2018, 'Toyota', 'Tundra', '1794 Edition', 1730, 10200, 1650, 9800);



-- Test pending loads
INSERT INTO loads (customer_id, description, load_size, load_weight, need_hauling, need_towing, service_type, pickup_location, dropoff_location, h3_index, grid_cell_id, status) VALUES
(137, 'Furniture for new home', 'Medium', 1800, true, false, 'hauling', ST_SetSRID(ST_MakePoint(-82.4584, 27.9506), 4326), ST_SetSRID(ST_MakePoint(-81.3792, 28.5383), 4326), '89441a1340bffff', '89441a1340bffff', 'pending');
(138, 'Home appliances', 'Small', 1200, true, false, 'hauling', ST_SetSRID(ST_MakePoint(-118.2437, 34.0522), 4326), ST_SetSRID(ST_MakePoint(-121.4944, 38.5816), 4326), '89441a13457ffff', '89441a13457ffff', 'pending');
(139, 'Office equipment', 'Medium', 2000, true, true, 'hauling_and_towing', ST_SetSRID(ST_MakePoint(-96.7970, 32.7767), 4326), ST_SetSRID(ST_MakePoint(-97.3308, 32.7555), 4326), '89441a13447ffff', '89441a13447ffff', 'pending');
(140, 'Garden tools and supplies', 'Small', 700, true, false, 'hauling', ST_SetSRID(ST_MakePoint(-73.9352, 40.7306), 4326), ST_SetSRID(ST_MakePoint(-74.0060, 40.7128), 4326), '89441a13473ffff', '89441a13473ffff', 'pending');
(141, 'Building materials', 'Large', 2500, true, true, 'hauling_and_towing', ST_SetSRID(ST_MakePoint(-87.6298, 41.8781), 4326), ST_SetSRID(ST_MakePoint(-88.2434, 40.1164), 4326), '89441a1340fffff', '89441a1340fffff', 'pending');
(142, 'Electronic goods for sale', 'Medium', 1500, false, true, 'towing', ST_SetSRID(ST_MakePoint(-122.3321, 47.6062), 4326), ST_SetSRID(ST_MakePoint(-122.4194, 37.7749), 4326), '89441a13403ffff', '89441a13403ffff', 'pending');
(143, 'Sports equipment', 'Small', 800, true, false, 'hauling', ST_SetSRID(ST_MakePoint(-104.9903, 39.7392), 4326), ST_SetSRID(ST_MakePoint(-105.7821, 39.5501), 4326), '89441a1341bffff', '89441a1341bffff', 'pending');
(144, 'Music band instruments', 'Medium', 1100, true, false, 'hauling', ST_SetSRID(ST_MakePoint(-83.0458, 42.3314), 4326), ST_SetSRID(ST_MakePoint(-84.5555, 42.7325), 4326), '89441a134cfffff', '89441a134cfffff', 'pending');
(145, 'Retail store merchandise', 'Large', 2200, true, true, 'hauling_and_towing', ST_SetSRID(ST_MakePoint(-87.6298, 41.8781), 4326), ST_SetSRID(ST_MakePoint(-89.4012, 43.0731), 4326), '89441a13453ffff', '89441a13453ffff', 'pending');
(146, 'Artwork for exhibition', 'Small', 600, true, false, 'hauling', ST_SetSRID(ST_MakePoint(-122.4194, 37.7749), 4326), ST_SetSRID(ST_MakePoint(-118.2437, 34.0522), 4326), '89441a13443ffff', '89441a13443ffff', 'pending');



-- Completed loads - review info
INSERT INTO loads (customer_id, description, load_size, load_weight, need_hauling, need_towing, service_type, pickup_location, dropoff_location, h3_index, grid_cell_id, status) VALUES
(137, 'Furniture - Load 1', 'Medium', 1500, true, false, 'hauling', ST_SetSRID(ST_MakePoint(-82.4584, 27.9506), 4326), ST_SetSRID(ST_MakePoint(-81.3792, 28.5383), 4326), '89441a1340bffff', '89441a1340bffff', 'completed'),
(138, 'Appliances - Load 2', 'Medium', 1200, true, false, 'hauling', ST_SetSRID(ST_MakePoint(-118.2437, 34.0522), 4326), ST_SetSRID(ST_MakePoint(-121.4944, 38.5816), 4326), '89441a13457ffff', '89441a13457ffff', 'completed'),
(139, 'Office Supplies - Load 3', 'Medium', 1300, true, false, 'hauling', ST_SetSRID(ST_MakePoint(-96.7970, 32.7767), 4326), ST_SetSRID(ST_MakePoint(-97.3308, 32.7555), 4326), '89441a13447ffff', '89441a13447ffff', 'completed'),
(140, 'Garden Equipment - Load 4', 'Medium', 1100, true, false, 'hauling', ST_SetSRID(ST_MakePoint(-73.9352, 40.7306), 4326), ST_SetSRID(ST_MakePoint(-74.0060, 40.7128), 4326), '89441a13473ffff', '89441a13473ffff', 'completed'),
(141, 'Building Materials - Load 5', 'Large', 2000, true, true, 'hauling_and_towing', ST_SetSRID(ST_MakePoint(-87.6298, 41.8781), 4326), ST_SetSRID(ST_MakePoint(-88.2434, 40.1164), 4326), '89441a1340fffff', '89441a1340fffff', 'completed'),
(142, 'Electronic Goods - Load 6', 'Medium', 1000, false, true, 'towing', ST_SetSRID(ST_MakePoint(-122.3321, 47.6062), 4326), ST_SetSRID(ST_MakePoint(-122.4194, 37.7749), 4326), '89441a13403ffff', '89441a13403ffff', 'completed'),
(143, 'Sports Equipment - Load 7', 'Small', 800, true, false, 'hauling', ST_SetSRID(ST_MakePoint(-104.9903, 39.7392), 4326), ST_SetSRID(ST_MakePoint(-105.7821, 39.5501), 4326), '89441a1341bffff', '89441a1341bffff', 'completed'),
(144, 'Musical Instruments - Load 8', 'Medium', 900, true, false, 'hauling', ST_SetSRID(ST_MakePoint(-83.0458, 42.3314), 4326), ST_SetSRID(ST_MakePoint(-84.5555, 42.7325), 4326), '89441a134cfffff', '89441a134cfffff', 'completed'),
(145, 'Retail Merchandise - Load 9', 'Large', 1800, true, true, 'hauling_and_towing', ST_SetSRID(ST_MakePoint(-87.6298, 41.8781), 4326), ST_SetSRID(ST_MakePoint(-89.4012, 43.0731), 4326), '89441a13453ffff', '89441a13453ffff', 'completed'),
(146, 'Artwork - Load 10', 'Small', 500, true, false, 'hauling', ST_SetSRID(ST_MakePoint(-122.4194, 37.7749), 4326), ST_SetSRID(ST_MakePoint(-118.2437, 34.0522), 4326), '89441a13443ffff', '89441a13443ffff', 'completed');

INSERT INTO transactions (customer_id, driver_id, vehicle_id, status, load_id) VALUES
(137, 117, 1, 'completed', 1),
(138, 118, 2, 'completed', 2),
(139, 119, 3, 'completed', 3),
(140, 120, 4, 'completed', 4),
(141, 121, 5, 'completed', 5),
(142, 122, 6, 'completed', 6),
(143, 123, 7, 'completed', 7),
(144, 124, 8, 'completed', 8),
(145, 125, 9, 'completed', 9),
(146, 126, 10, 'completed', 10);

INSERT INTO reviews (reviewer_id, reviewed_id, rating, comment, transaction_id) VALUES
(137, 117, 4.5, 'Great service!', 1),
(138, 118, 4.0, 'Good job, but a bit late.', 2),
(139, 119, 5.0, 'Excellent service, highly recommended!', 3),
(140, 120, 3.5, 'Service was okay, could be better.', 4),
(141, 121, 4.8, 'Very professional and efficient.', 5),
(142, 122, 4.2, 'Satisfied with the service.', 6),
(143, 123, 4.7, 'Handled my items with care.', 7),
(144, 124, 3.8, 'Decent service, but room for improvement.', 8),
(145, 125, 5.0, 'Outstanding service! Will use again.', 9),
(146, 126, 4.6, 'Very efficient and friendly.', 10);



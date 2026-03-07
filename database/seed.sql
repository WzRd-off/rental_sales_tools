-- Seed script for SQLite3 database
-- Populates tables with sample data for testing and demo

PRAGMA foreign_keys = OFF;

BEGIN TRANSACTION;

-- Users
INSERT INTO users (email, login, fullname, password_hash, number) VALUES
('test1@example.com','testuser1','Test User One','hash1', 1234567890),
('test2@example.com','testuser2','Test User Two','hash2', 2345678901),
('demo@example.com','demouser','Demo Client','hash3', 3456789012);

-- Products
INSERT INTO products (name, category, description, cost, photo, status) VALUES
('Hammer','Tools','16 oz claw hammer',19.99, X'' , 'available'),
('Drill','Tools','Cordless drill 18V',79.95, X'' , 'available'),
('Ladder','Equipment','6-foot step ladder',49.50, X'' , 'rented');

-- Reviews
INSERT INTO reviews (prod_id, user_id, comment, rating) VALUES
(1, 1, 'Great hammer, very sturdy.', 5),
(2, 2, 'Drill battery life could be better.', 3);

-- Wishlist
INSERT INTO wishlist (user_id, prod_id) VALUES
(1, 2),
(2, 1);

-- History Purchases
INSERT INTO history_purchases (user_id, prod_id) VALUES
(1, 1);

-- History Rentals
INSERT INTO history_rentals (user_id, prod_id) VALUES
(3, 3);

COMMIT;

PRAGMA foreign_keys = ON;

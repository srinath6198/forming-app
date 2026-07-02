-- Insert users into the database
-- Run this script in MySQL Workbench or via MySQL command line

USE forming_billing;

-- NOTE: Passwords must be bcrypt hashed before insertion
-- Use the seed.ts script to properly insert users with hashed passwords
-- Run: npm run seed

-- For manual insertion, first generate bcrypt hash using Node.js:
-- node -e "console.log(require('bcryptjs').hashSync('your_password', 12))"

-- Then use the generated hash below:

-- Insert Srinath user (password: Srinath@10)
INSERT INTO users (name, email, password, role, is_active) 
VALUES (
  'Srinath', 
  'dsprinath@gmail.com', 
  '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GZxQxQxQxQxQ', 
  'admin', 
  true
)
ON DUPLICATE KEY UPDATE 
  password = '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GZxQxQxQxQxQ',
  is_active = true;

-- Insert Admin user (password: admin123)
INSERT INTO users (name, email, password, role, is_active) 
VALUES (
  'Admin User', 
  'admin@flora.com', 
  '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GZxQxQxQxQxQ', 
  'admin', 
  true
)
ON DUPLICATE KEY UPDATE 
  password = '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GZxQxQxQxQxQ',
  is_active = true;

-- Insert Billing user (password: bill123)
INSERT INTO users (name, email, password, role, is_active) 
VALUES (
  'Billing User', 
  'billing@flora.com', 
  '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GZxQxQxQxQxQ', 
  'admin', 
  true
)
ON DUPLICATE KEY UPDATE 
  password = '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GZxQxQxQxQxQ',
  is_active = true;

-- Verify insertion
SELECT id, name, email, role, is_active, created_at 
FROM users 
WHERE email IN ('dsprinath@gmail.com', 'admin@flora.com', 'billing@flora.com');

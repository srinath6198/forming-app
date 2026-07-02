-- Run this in MySQL Workbench
CREATE DATABASE IF NOT EXISTS forming_billing;
USE forming_billing;

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  name            VARCHAR(100)  NOT NULL,
  email           VARCHAR(150)  NOT NULL UNIQUE,
  password        VARCHAR(255)  NOT NULL,
  role            ENUM('admin', 'user') DEFAULT 'user',
  is_active       BOOLEAN DEFAULT TRUE,
  first_name      VARCHAR(50),
  last_name       VARCHAR(50),
  date_of_birth   DATE,
  profile_image   VARCHAR(500),
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Sessions table (for DB-backed sessions)
CREATE TABLE IF NOT EXISTS user_sessions (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  user_id     INT NOT NULL,
  token       VARCHAR(500) NOT NULL,
  ip_address  VARCHAR(45),
  user_agent  TEXT,
  expires_at  TIMESTAMP NOT NULL,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Refresh tokens
CREATE TABLE IF NOT EXISTS refresh_tokens (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  user_id     INT NOT NULL,
  token       VARCHAR(500) NOT NULL UNIQUE,
  expires_at  TIMESTAMP NOT NULL,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Customers table
CREATE TABLE IF NOT EXISTS customers (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  customer_name   VARCHAR(100)  NOT NULL,
  email           VARCHAR(150),
  phone           VARCHAR(20)   NOT NULL,
  alternate_phone VARCHAR(20),
  address         TEXT,
  city            VARCHAR(100),
  state           VARCHAR(100),
  pincode         VARCHAR(10),
  gst_number      VARCHAR(20),
  customer_type   ENUM('retail', 'wholesale', 'corporate') DEFAULT 'retail',
  credit_limit    DECIMAL(10,2) DEFAULT 0.00,
  opening_balance DECIMAL(10,2) DEFAULT 0.00,
  current_balance DECIMAL(10,2) DEFAULT 0.00,
  notes           TEXT,
  is_active       BOOLEAN DEFAULT TRUE,
  created_by      INT,
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_phone (phone),
  INDEX idx_email (email),
  INDEX idx_customer_name (customer_name),
  INDEX idx_is_active (is_active)
);

CREATE DATABASE IF NOT EXISTS restaurante_db;
USE restaurante_db;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(120) NOT NULL,
  username VARCHAR(80) NOT NULL UNIQUE,
  email VARCHAR(150) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('admin', 'garcom', 'delivery') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  customer_name VARCHAR(120) NOT NULL,
  customer_email VARCHAR(150) NOT NULL,
  order_type ENUM('mesa', 'delivery') NOT NULL,
  delivery_address VARCHAR(255),
  total DECIMAL(10,2) NOT NULL DEFAULT 0,
  status VARCHAR(60) NOT NULL DEFAULT 'pendente',
  created_by_user_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by_user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  item_name VARCHAR(150) NOT NULL,
  quantity INT NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS receipts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  customer_name VARCHAR(120) NOT NULL,
  customer_email VARCHAR(150) NOT NULL,
  issued_by_user_id INT,
  issued_by_name VARCHAR(120) NOT NULL,
  receipt_html LONGTEXT,
  email_sent BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (issued_by_user_id) REFERENCES users(id)
);

INSERT INTO users (full_name, username, email, password_hash, role)
VALUES
  ('Admin da Casa', 'admin', 'admin@restaurante.com', '$2a$10$1xDskfTQKfPBxb9R7WwI7uYgH/1n/dA0d.BzQYJ8Wb9b8yQI7LQOe', 'admin'),
  ('Garçom Principal', 'garcom', 'garcom@restaurante.com', '$2a$10$1xDskfTQKfPBxb9R7WwI7uYgH/1n/dA0d.BzQYJ8Wb9b8yQI7LQOe', 'garcom'),
  ('Entregador', 'delivery', 'delivery@restaurante.com', '$2a$10$1xDskfTQKfPBxb9R7WwI7uYgH/1n/dA0d.BzQYJ8Wb9b8yQI7LQOe', 'delivery')
ON DUPLICATE KEY UPDATE username = username;

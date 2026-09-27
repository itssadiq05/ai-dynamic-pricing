CREATE DATABASE IF NOT EXISTS dynamic_pricing_db;
USE dynamic_pricing_db;

CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category_id INT NOT NULL,
    current_price DECIMAL(10, 2) NOT NULL,
    cost_price DECIMAL(10, 2) NOT NULL,
    current_stock INT NOT NULL DEFAULT 0,
    min_stock INT NOT NULL DEFAULT 10,
    competitor_price DECIMAL(10, 2) NOT NULL,
    status ENUM('Active', 'Inactive', 'Discontinued') DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS sales (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    date DATE NOT NULL,
    quantity_sold INT NOT NULL,
    selling_price DECIMAL(10, 2) NOT NULL,
    discount_percent DECIMAL(5, 2) DEFAULT 0.00,
    competitor_price DECIMAL(10, 2) NOT NULL,
    stock_available INT NOT NULL,
    is_promotion TINYINT(1) DEFAULT 0,
    is_holiday TINYINT(1) DEFAULT 0,
    revenue DECIMAL(12, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS model_metrics (
    id INT AUTO_INCREMENT PRIMARY KEY,
    model_name VARCHAR(100) NOT NULL,
    mae DECIMAL(10, 4) NOT NULL,
    rmse DECIMAL(10, 4) NOT NULL,
    r2_score DECIMAL(10, 4) NOT NULL,
    training_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    dataset_size INT NOT NULL,
    features_used JSON NOT NULL,
    is_selected TINYINT(1) DEFAULT 0
);

CREATE TABLE IF NOT EXISTS price_recommendations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    recommended_price DECIMAL(10, 2) NOT NULL,
    current_price DECIMAL(10, 2) NOT NULL,
    predicted_demand INT NOT NULL,
    price_change_percent DECIMAL(5, 2) NOT NULL,
    explanation TEXT NOT NULL,
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);


CREATE TABLE users
(
    id INT
    AUTO_INCREMENT PRIMARY KEY,
    firstname VARCHAR(100) NOT NULL,
    lastname VARCHAR(100) NOT NULL,
    introduction TEXT NOT NULL,
    deposit DECIMAL(10, 2) NOT NULL,
    total_confirmed_amount DECIMAL(10, 2) NOT NULL,
    currency ENUM('INR', 'USD', 'AUD') DEFAULT 'INR',
    status TINYINT(1) DEFAULT 1,
    due_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE transactions
(
    id INT
    AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    currency ENUM('INR', 'USD', 'AUD') DEFAULT 'INR',
    status TINYINT(1) DEFAULT 1,
    paymethod ENUM('cash', 'cheque', 'online') NOT NULL,
    datetime DATETIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

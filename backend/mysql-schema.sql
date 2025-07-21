-- MySQL Database Schema for Smriti Pustakalaya
-- Created: 2025-07-21
-- Updated for MySQL from MongoDB

-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS smriti_pustakalaya;
USE smriti_pustakalaya;

-- Drop tables if they exist (for fresh setup)
DROP TABLE IF EXISTS books;
DROP TABLE IF EXISTS employees;
DROP TABLE IF EXISTS users;

-- Create employees table
CREATE TABLE employees (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE,
    phone VARCHAR(15),
    department VARCHAR(50),
    designation VARCHAR(50),
    password VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_employee_id (employee_id),
    INDEX idx_email (email),
    INDEX idx_department (department)
);

-- Create books table
CREATE TABLE books (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    isbn VARCHAR(20) UNIQUE,
    genre VARCHAR(50),
    condition_status ENUM('New', 'Good', 'Fair', 'Poor') DEFAULT 'Good',
    donor_name VARCHAR(100),
    donor_mobile VARCHAR(15),
    donor_address TEXT,
    donation_date DATE,
    image_url VARCHAR(500),
    status ENUM('Available', 'Issued', 'Reserved', 'Damaged') DEFAULT 'Available',
    destination_of_book VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_isbn (isbn),
    INDEX idx_title (title),
    INDEX idx_author (author),
    INDEX idx_genre (genre),
    INDEX idx_status (status),
    INDEX idx_donation_date (donation_date)
);

-- Create users table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE,
    phone VARCHAR(15),
    address TEXT,
    user_type ENUM('Student', 'Faculty', 'Public') DEFAULT 'Public',
    membership_id VARCHAR(50) UNIQUE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_email (email),
    INDEX idx_membership_id (membership_id),
    INDEX idx_user_type (user_type)
);

-- Insert default admin employee
INSERT INTO employees (employee_id, name, email, password, department, designation) VALUES 
('user1', 'Administrator', 'admin@library.com', 'sml@2025', 'Administration', 'System Admin'),
('emp001', 'Library Staff', 'staff@library.com', 'staff123', 'Library', 'Librarian');

-- Insert sample books
INSERT INTO books (title, author, isbn, genre, donor_name, donor_mobile, donation_date, status) VALUES
('The Great Gatsby', 'F. Scott Fitzgerald', '978-0-7432-7356-5', 'Fiction', 'John Doe', '9876543210', '2024-01-15', 'Available'),
('To Kill a Mockingbird', 'Harper Lee', '978-0-06-112008-4', 'Fiction', 'Jane Smith', '9876543211', '2024-01-20', 'Available'),
('1984', 'George Orwell', '978-0-452-28423-4', 'Dystopian Fiction', 'Bob Wilson', '9876543212', '2024-02-01', 'Available'),
('Pride and Prejudice', 'Jane Austen', '978-0-14-143951-8', 'Romance', 'Alice Brown', '9876543213', '2024-02-10', 'Available'),
('The Catcher in the Rye', 'J.D. Salinger', '978-0-316-76948-0', 'Fiction', 'Charlie Davis', '9876543214', '2024-02-15', 'Available');

-- Insert sample users
INSERT INTO users (name, email, phone, user_type, membership_id) VALUES
('Rahul Kumar', 'rahul.kumar@email.com', '9123456789', 'Student', 'STU001'),
('Priya Sharma', 'priya.sharma@email.com', '9123456790', 'Faculty', 'FAC001'),
('Amit Singh', 'amit.singh@email.com', '9123456791', 'Public', 'PUB001');

-- Create views for easier data access
CREATE VIEW book_summary AS
SELECT 
    id,
    title,
    author,
    genre,
    status,
    donor_name,
    donation_date,
    created_at
FROM books
ORDER BY created_at DESC;

CREATE VIEW employee_summary AS
SELECT 
    id,
    employee_id,
    name,
    email,
    department,
    designation,
    is_active,
    created_at
FROM employees
WHERE is_active = true
ORDER BY name;

-- Show table information
SHOW TABLES;
SELECT 'Database setup completed successfully!' as message;

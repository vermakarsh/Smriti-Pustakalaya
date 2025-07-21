-- =====================================================
-- Smriti Pustakalaya Library Management System
-- Database Schema (SQL Version)
-- =====================================================

-- Create database
CREATE DATABASE IF NOT EXISTS smriti_pustakalaya;
USE smriti_pustakalaya;

-- Users table (for admin panel)
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'librarian', 'assistant') DEFAULT 'librarian',
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(15),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Employees table (for mobile app)
CREATE TABLE employees (
    id INT PRIMARY KEY AUTO_INCREMENT,
    employee_id VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('librarian', 'assistant', 'volunteer') DEFAULT 'assistant',
    phone VARCHAR(15),
    address TEXT,
    join_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Books table (main donations table)
CREATE TABLE books (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(100) NOT NULL,
    isbn VARCHAR(20) UNIQUE,
    year INT,
    genre VARCHAR(50),
    description TEXT,
    destination_of_book VARCHAR(100) DEFAULT '',
    status ENUM('pending', 'verified', 'rejected') DEFAULT 'pending',
    donation_date DATE DEFAULT CURRENT_DATE,
    image_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Donors table (many-to-many relationship with books)
CREATE TABLE donors (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    phone VARCHAR(15),
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Book-Donor relationship table
CREATE TABLE book_donors (
    id INT PRIMARY KEY AUTO_INCREMENT,
    book_id INT NOT NULL,
    donor_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE,
    FOREIGN KEY (donor_id) REFERENCES donors(id) ON DELETE CASCADE,
    UNIQUE KEY unique_book_donor (book_id, donor_id)
);

-- Create indexes for better performance
CREATE INDEX idx_books_status ON books(status);
CREATE INDEX idx_books_genre ON books(genre);
CREATE INDEX idx_books_donation_date ON books(donation_date);
CREATE INDEX idx_books_title ON books(title);
CREATE INDEX idx_books_author ON books(author);
CREATE INDEX idx_employees_email ON employees(email);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_donors_name ON donors(name);

-- Insert sample data

-- Sample users
INSERT INTO users (username, email, password, role, name, phone) VALUES
('admin', 'admin@library.com', 'admin123', 'admin', 'सिस्टम एडमिन', '9876543200'),
('librarian', 'librarian@library.com', 'librarian123', 'librarian', 'मुख्य लाइब्रेरियन', '9876543201');

-- Sample employees
INSERT INTO employees (employee_id, name, email, password, role, phone, address, join_date) VALUES
('EMP001', 'राजेश कुमार', 'rajesh@library.com', 'password123', 'librarian', '9876543210', 'मुख्य सड़क, शहर', '2023-01-15'),
('EMP002', 'सुनीता देवी', 'sunita@library.com', 'password123', 'assistant', '9876543211', 'पार्क सड़क, शहर', '2023-03-20'),
('EMP003', 'अमित शर्मा', 'amit@library.com', 'password123', 'volunteer', '9876543212', 'गांधी मार्ग, शहर', '2023-06-10');

-- Sample donors
INSERT INTO donors (name, email, phone, address) VALUES
('राजेश कुमार', 'rajesh@email.com', '9876543210', 'मुख्य सड़क, शहर'),
('सुनीता देवी', 'sunita@email.com', '9876543211', 'पार्क सड़क, शहर'),
('अमित शर्मा', 'amit@email.com', '9876543212', 'गांधी मार्ग, शहर'),
('प्रिया वर्मा', 'priya@email.com', '9876543213', 'राजपथ, शहर'),
('राहुल गुप्ता', 'rahul@email.com', '9876543214', 'मॉल रोड, शहर'),
('मीना यादव', 'meena@email.com', '9876543215', 'स्कूल रोड, शहर'),
('दीपक सिंह', 'deepak@email.com', '9876543216', 'हॉस्पिटल रोड, शहर'),
('अंजलि पटेल', 'anjali@email.com', '9876543217', 'स्टेशन रोड, शहर');

-- Sample books
INSERT INTO books (title, author, isbn, year, genre, description, destination_of_book, status, donation_date) VALUES
('रामायण', 'वाल्मीकि', '978-81-291-1234-1', 2020, 'Religious', 'प्राचीन भारतीय महाकाव्य', 'मुख्य पुस्तकालय', 'verified', '2024-01-15'),
('महाभारत', 'वेद व्यास', '978-81-291-1234-2', 2019, 'Religious', 'भारतीय महाकाव्य', 'मुख्य पुस्तकालय', 'verified', '2024-02-20'),
('गीता', 'कृष्ण', '978-81-291-1234-3', 2021, 'Religious', 'भगवद्गीता', 'धार्मिक खंड', 'pending', '2024-03-10'),
('पंचतंत्र', 'विष्णु शर्मा', '978-81-291-1234-4', 2018, 'Children', 'बच्चों की कहानियां', 'बाल खंड', 'verified', '2024-01-25'),
('कबीर के दोहे', 'कबीर दास', '978-81-291-1234-5', 2022, 'Poetry', 'कबीर के प्रसिद्ध दोहे', 'कविता खंड', 'pending', '2024-03-15'),
('तुलसीदास रामायण', 'तुलसीदास', '978-81-291-1234-6', 2020, 'Religious', 'रामचरितमानस', 'धार्मिक खंड', 'verified', '2024-02-05'),
('सूरदास की सूरसागर', 'सूरदास', '978-81-291-1234-7', 2021, 'Poetry', 'कृष्ण भक्ति काव्य', 'कविता खंड', 'verified', '2024-01-30'),
('मीराबाई के पद', 'मीराबाई', '978-81-291-1234-8', 2019, 'Poetry', 'कृष्ण भक्ति पद', 'कविता खंड', 'pending', '2024-03-20');

-- Link books with donors
INSERT INTO book_donors (book_id, donor_id) VALUES
(1, 1), -- रामायण - राजेश कुमार
(2, 2), -- महाभारत - सुनीता देवी
(3, 3), -- गीता - अमित शर्मा
(4, 4), -- पंचतंत्र - प्रिया वर्मा
(5, 5), -- कबीर के दोहे - राहुल गुप्ता
(6, 6), -- तुलसीदास रामायण - मीना यादव
(7, 7), -- सूरदास की सूरसागर - दीपक सिंह
(8, 8); -- मीराबाई के पद - अंजलि पटेल

-- Create views for common queries

-- View for donation statistics
CREATE VIEW donation_stats AS
SELECT 
    COUNT(*) as total_books,
    SUM(CASE WHEN status = 'verified' THEN 1 ELSE 0 END) as verified_books,
    SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_books,
    COUNT(DISTINCT d.id) as total_donors
FROM books b
LEFT JOIN book_donors bd ON b.id = bd.book_id
LEFT JOIN donors d ON bd.donor_id = d.id;

-- View for recent donations
CREATE VIEW recent_donations AS
SELECT 
    b.title,
    b.author,
    b.genre,
    b.status,
    b.donation_date,
    d.name as donor_name,
    b.destination_of_book
FROM books b
LEFT JOIN book_donors bd ON b.id = bd.book_id
LEFT JOIN donors d ON bd.donor_id = d.id
ORDER BY b.donation_date DESC;

-- Stored procedure for adding a new donation
DELIMITER //
CREATE PROCEDURE AddDonation(
    IN p_title VARCHAR(255),
    IN p_author VARCHAR(100),
    IN p_isbn VARCHAR(20),
    IN p_year INT,
    IN p_genre VARCHAR(50),
    IN p_description TEXT,
    IN p_donor_name VARCHAR(100),
    IN p_donor_email VARCHAR(100),
    IN p_donor_phone VARCHAR(15)
)
BEGIN
    DECLARE v_book_id INT;
    DECLARE v_donor_id INT;
    
    -- Insert or get donor
    INSERT IGNORE INTO donors (name, email, phone) 
    VALUES (p_donor_name, p_donor_email, p_donor_phone);
    
    SET v_donor_id = LAST_INSERT_ID();
    IF v_donor_id = 0 THEN
        SELECT id INTO v_donor_id FROM donors WHERE name = p_donor_name LIMIT 1;
    END IF;
    
    -- Insert book
    INSERT INTO books (title, author, isbn, year, genre, description)
    VALUES (p_title, p_author, p_isbn, p_year, p_genre, p_description);
    
    SET v_book_id = LAST_INSERT_ID();
    
    -- Link book with donor
    INSERT INTO book_donors (book_id, donor_id) VALUES (v_book_id, v_donor_id);
    
    SELECT v_book_id as book_id, v_donor_id as donor_id;
END //
DELIMITER ;

-- Sample usage of stored procedure:
-- CALL AddDonation('नई पुस्तक', 'लेखक', '978-123-456-789', 2024, 'Fiction', 'विवरण', 'दाता नाम', 'donor@email.com', '9876543210');

-- Create triggers for audit logging
CREATE TABLE audit_log (
    id INT PRIMARY KEY AUTO_INCREMENT,
    table_name VARCHAR(50) NOT NULL,
    action VARCHAR(20) NOT NULL,
    record_id INT,
    old_values JSON,
    new_values JSON,
    changed_by VARCHAR(100),
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

DELIMITER //
CREATE TRIGGER books_audit_insert
AFTER INSERT ON books
FOR EACH ROW
BEGIN
    INSERT INTO audit_log (table_name, action, record_id, new_values)
    VALUES ('books', 'INSERT', NEW.id, JSON_OBJECT(
        'title', NEW.title,
        'author', NEW.author,
        'status', NEW.status
    ));
END //

CREATE TRIGGER books_audit_update
AFTER UPDATE ON books
FOR EACH ROW
BEGIN
    INSERT INTO audit_log (table_name, action, record_id, old_values, new_values)
    VALUES ('books', 'UPDATE', NEW.id, 
        JSON_OBJECT('status', OLD.status, 'destination_of_book', OLD.destination_of_book),
        JSON_OBJECT('status', NEW.status, 'destination_of_book', NEW.destination_of_book)
    );
END //
DELIMITER ;

-- Grant permissions (adjust as needed)
-- GRANT ALL PRIVILEGES ON smriti_pustakalaya.* TO 'library_user'@'localhost';
-- FLUSH PRIVILEGES;

-- Show final statistics
SELECT 
    'Database Setup Complete' as message,
    (SELECT COUNT(*) FROM books) as total_books,
    (SELECT COUNT(*) FROM donors) as total_donors,
    (SELECT COUNT(*) FROM employees) as total_employees,
    (SELECT COUNT(*) FROM users) as total_users; 
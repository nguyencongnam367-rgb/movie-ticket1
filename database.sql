
SET NAMES utf8mb4;

DROP DATABASE IF EXISTS movie_ticket;
CREATE DATABASE movie_ticket CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE movie_ticket;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('CUSTOMER', 'STAFF', 'ADMIN') NOT NULL DEFAULT 'CUSTOMER',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE movies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    poster VARCHAR(500),
    trailer VARCHAR(500),
    genre VARCHAR(100),
    duration INT NOT NULL,
    director VARCHAR(150),
    actors TEXT,
    release_date DATE,
    status ENUM('SHOWING', 'COMING_SOON', 'ENDED') NOT NULL DEFAULT 'COMING_SOON',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE cinemas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address VARCHAR(500),
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE rooms (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cinema_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    total_seats INT NOT NULL,
    FOREIGN KEY (cinema_id) REFERENCES cinemas(id) ON DELETE CASCADE
);

CREATE TABLE seats (
    id INT AUTO_INCREMENT PRIMARY KEY,
    room_id INT NOT NULL,
    seat_code VARCHAR(10) NOT NULL,
    seat_type ENUM('REGULAR', 'VIP') NOT NULL DEFAULT 'REGULAR',
    UNIQUE KEY uq_room_seat (room_id, seat_code),
    FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE
);

CREATE TABLE showtimes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    movie_id INT NOT NULL,
    room_id INT NOT NULL,
    show_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE,
    FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE
);

CREATE TABLE bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    showtime_id INT NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    status ENUM('PENDING', 'PAID', 'CANCELLED') NOT NULL DEFAULT 'PENDING',
    booking_code VARCHAR(50) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (showtime_id) REFERENCES showtimes(id)
);

CREATE TABLE booking_seats (
    id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id INT NOT NULL,
    seat_id INT NOT NULL,
    UNIQUE KEY uq_booking_seat (booking_id, seat_id),
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
    FOREIGN KEY (seat_id) REFERENCES seats(id)
);

CREATE TABLE payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id INT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    payment_method ENUM('BANKING', 'MOMO') NOT NULL,
    payment_status ENUM('PENDING', 'SUCCESS', 'FAILED') NOT NULL DEFAULT 'PENDING',
    paid_at TIMESTAMP NULL,
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE
);

INSERT INTO users (name, email, password, role) VALUES
('Quản trị viên', 'admin@gmail.com', '$2b$10$GmRQWLHQfZ5ye3zPJQhzTernAGC8/KQ7Y3rGADzjT10iTC1HV/5/q', 'ADMIN'),
('Nguyễn Văn A', 'customer@gmail.com', '$2b$10$GmRQWLHQfZ5ye3zPJQhzTernAGC8/KQ7Y3rGADzjT10iTC1HV/5/q', 'CUSTOMER'),
('Nhân viên rạp', 'staff@gmail.com', '$2b$10$GmRQWLHQfZ5ye3zPJQhzTernAGC8/KQ7Y3rGADzjT10iTC1HV/5/q', 'STAFF');

INSERT INTO movies
(title, description, poster, trailer, genre, duration, director, actors, release_date, status)
VALUES
('Avengers: Endgame', 'Các siêu anh hùng chiến đấu để cứu vũ trụ.', 'https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg', 'https://www.youtube.com/embed/TcMBFSGVi1c', 'Hành động, Phiêu lưu', 181, 'Anthony Russo, Joe Russo', 'Robert Downey Jr., Chris Evans, Scarlett Johansson', CURDATE() - INTERVAL 30 DAY, 'SHOWING'),
('Spider-Man: No Way Home', 'Peter Parker đối mặt với những kẻ thù từ các vũ trụ khác.', 'https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg', 'https://www.youtube.com/embed/JfVOs4VSpmA', 'Hành động, Phiêu lưu', 148, 'Jon Watts', 'Tom Holland, Zendaya, Benedict Cumberbatch', CURDATE() - INTERVAL 20 DAY, 'SHOWING'),
('Interstellar', 'Một chuyến du hành xuyên không gian để tìm tương lai cho nhân loại.', 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg', 'https://www.youtube.com/embed/zSWdZVtXT7E', 'Khoa học viễn tưởng', 169, 'Christopher Nolan', 'Matthew McConaughey, Anne Hathaway, Jessica Chastain', CURDATE() - INTERVAL 10 DAY, 'SHOWING'),
('Avatar: The Way of Water', 'Hành trình mới của gia đình Sully trên hành tinh Pandora.', 'https://image.tmdb.org/t/p/w500/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg', 'https://www.youtube.com/embed/d9MyW72ELq0', 'Khoa học viễn tưởng', 192, 'James Cameron', 'Sam Worthington, Zoe Saldana, Sigourney Weaver', CURDATE() + INTERVAL 7 DAY, 'COMING_SOON'),
('The Batman', 'Batman điều tra những bí ẩn đen tối trong thành phố Gotham.', 'https://image.tmdb.org/t/p/w500/74xTEgt7R36Fpooo50r9T25onhq.jpg', 'https://www.youtube.com/embed/mqqft2x_Aa4', 'Hành động, Tội phạm', 176, 'Matt Reeves', 'Robert Pattinson, Zoë Kravitz, Paul Dano', CURDATE() - INTERVAL 5 DAY, 'SHOWING'),
('Inside Out 2', 'Những cảm xúc mới xuất hiện trong tâm trí Riley.', 'https://image.tmdb.org/t/p/w500/vpnVM9B6NMmQpWeZvzLvDESb2QY.jpg', 'https://www.youtube.com/embed/LEjhY15eCx0', 'Hoạt hình, Hài', 96, 'Kelsey Mann', 'Amy Poehler, Maya Hawke, Kensington Tallman', CURDATE() + INTERVAL 3 DAY, 'COMING_SOON'),
('Dune: Part Two', 'Paul Atreides sát cánh cùng người Fremen trong hành trình bảo vệ Arrakis.', 'https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg', 'https://www.youtube.com/embed/Way9Dexny3w', 'Khoa học viễn tưởng, Phiêu lưu', 166, 'Denis Villeneuve', 'Timothée Chalamet, Zendaya, Rebecca Ferguson', '2024-02-28', 'SHOWING'),
('Oppenheimer', 'Câu chuyện về nhà vật lý J. Robert Oppenheimer và dự án Manhattan.', 'https://image.tmdb.org/t/p/w500/ptpr0kGAckfQkJeJIt8st5dglvd.jpg', 'https://www.youtube.com/embed/uYPbbksJxIg', 'Chính kịch, Lịch sử', 180, 'Christopher Nolan', 'Cillian Murphy, Emily Blunt, Robert Downey Jr.', '2023-07-21', 'SHOWING'),
('Kung Fu Panda 4', 'Po bước vào chuyến phiêu lưu mới để tìm người kế nhiệm Thần Long Đại Hiệp.', 'https://image.tmdb.org/t/p/w500/kDp1vUBnMpe8ak4rjgl3cLELqjU.jpg', 'https://www.youtube.com/embed/fUYJKnzWp7Y', 'Hoạt hình, Hài, Phiêu lưu', 94, 'Mike Mitchell', 'Jack Black, Awkwafina, Viola Davis', '2024-03-07', 'SHOWING');

INSERT INTO cinemas (name, address, phone) VALUES
('MovieTicket Cinema Quận 1', '123 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh', '0901000001'),
('MovieTicket Cinema Cầu Giấy', '45 Cầu Giấy, Hà Nội', '0901000002');

INSERT INTO rooms (cinema_id, name, total_seats) VALUES
(1, 'Phòng 1', 50),
(1, 'Phòng 2', 50),
(2, 'Phòng 1', 50);

INSERT INTO seats (room_id, seat_code, seat_type)
SELECT r.id,
       CONCAT(CHAR(65 + rows_data.row_no), LPAD(seat_data.seat_no, 2, '0')),
       CASE WHEN rows_data.row_no >= 4 THEN 'VIP' ELSE 'REGULAR' END
FROM rooms r
CROSS JOIN (
    SELECT 0 AS row_no UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4
) rows_data
CROSS JOIN (
    SELECT 1 AS seat_no UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5
    UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9 UNION ALL SELECT 10
) seat_data;

INSERT INTO showtimes (movie_id, room_id, show_date, start_time, end_time, price) VALUES
(1, 1, CURDATE() + INTERVAL 1 DAY, '10:00:00', '13:01:00', 90000),
(1, 1, CURDATE() + INTERVAL 1 DAY, '19:00:00', '22:01:00', 110000),
(1, 2, CURDATE() + INTERVAL 1 DAY, '14:00:00', '17:01:00', 90000),
(2, 2, CURDATE() + INTERVAL 1 DAY, '13:30:00', '15:58:00', 90000),
(2, 3, CURDATE() + INTERVAL 1 DAY, '20:00:00', '22:28:00', 110000),
(3, 3, CURDATE() + INTERVAL 2 DAY, '09:30:00', '12:19:00', 90000),
(3, 1, CURDATE() + INTERVAL 2 DAY, '19:30:00', '22:19:00', 110000),
(5, 2, CURDATE() + INTERVAL 3 DAY, '18:00:00', '20:56:00', 100000),
(4, 1, CURDATE() + INTERVAL 7 DAY, '19:00:00', '22:12:00', 120000),
(6, 3, CURDATE() + INTERVAL 3 DAY, '15:00:00', '16:36:00', 80000);

INSERT INTO showtimes (movie_id, room_id, show_date, start_time, end_time, price)
SELECT id, 1, CURDATE() + INTERVAL 1 DAY, '16:00:00', '18:46:00', 110000 FROM movies WHERE title = 'Dune: Part Two'
UNION ALL
SELECT id, 2, CURDATE() + INTERVAL 1 DAY, '17:00:00', '20:00:00', 100000 FROM movies WHERE title = 'Oppenheimer'
UNION ALL
SELECT id, 3, CURDATE() + INTERVAL 1 DAY, '15:00:00', '16:34:00', 90000 FROM movies WHERE title = 'Kung Fu Panda 4';

INSERT INTO bookings (user_id, showtime_id, total_price, status, booking_code)
VALUES (2, 1, 90000, 'PAID', 'MT-DEMO-0001');

INSERT INTO booking_seats (booking_id, seat_id)
SELECT 1, id FROM seats WHERE room_id = 1 AND seat_code = 'A01';

INSERT INTO payments (booking_id, amount, payment_method, payment_status, paid_at)
VALUES (1, 90000, 'BANKING', 'SUCCESS', NOW());
USE movie_ticket;

START TRANSACTION;
DELETE FROM bookings;
COMMIT;

USE movie_ticket;
SELECT id, name, email, role, created_at
FROM users;

USE movie_ticket;
SELECT * FROM movies;
CREATE DATABASE IF NOT EXISTS gqldemo;
USE gqldemo;

CREATE TABLE IF NOT EXISTS authors (
id INT AUTO_INCREMENT PRIMARY KEY,
name VARCHAR(100) NOT NULL,
country VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS books (
id INT AUTO_INCREMENT PRIMARY KEY,
title VARCHAR(255) NOT NULL,
year INT NOT NULL,
author_id INT NOT NULL,
FOREIGN KEY (author_id) REFERENCES authors(id)
);

INSERT INTO authors (name, country)
SELECT 'Asha Patel', 'India'
WHERE NOT EXISTS (
SELECT 1 FROM authors WHERE name = 'Asha Patel'
);

INSERT INTO authors (name, country)
SELECT 'Ravi Kumar', 'India'
WHERE NOT EXISTS (
SELECT 1 FROM authors WHERE name = 'Ravi Kumar'
);

INSERT INTO books (title, year, author_id)
SELECT 'Learning GraphQL', 2023, id
FROM authors
WHERE name = 'Asha Patel'
AND NOT EXISTS (
SELECT 1 FROM books WHERE title = 'Learning GraphQL'
);

INSERT INTO books (title, year, author_id)
SELECT 'Web Services Fundamentals', 2022, id
FROM authors
WHERE name = 'Asha Patel'
AND NOT EXISTS (
SELECT 1 FROM books WHERE title = 'Web Services Fundamentals'
);

INSERT INTO books (title, year, author_id)
SELECT 'Node.js Essentials', 2024, id
FROM authors
WHERE name = 'Ravi Kumar'
AND NOT EXISTS (
SELECT 1 FROM books WHERE title = 'Node.js Essentials'
);

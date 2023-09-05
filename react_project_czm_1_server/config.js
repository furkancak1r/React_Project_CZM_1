// Here is the part where the MySQL connection values are stored.

// config.js dosyası
require('dotenv').config({path: './config.env'});

const config = {
  host: process.env.DB_HOSTA,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
};
module.exports= config;

/*
CREATE TABLE sys.files (
  id INT AUTO_INCREMENT PRIMARY KEY,
  fileName VARCHAR(255) NOT NULL,
  fileExtension VARCHAR(10) NOT NULL,
  location VARCHAR(255) NOT NULL,
  file_version INT NOT NULL,
  fileBase64 LONGTEXT NOT NULL
);
CREATE TABLE sys.users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL,
  passwordHash TEXT NOT NULL
);
CREATE TABLE sys.navbar (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  title_version INT NOT NULL
);
CREATE TABLE sys.colors (
  id INT AUTO_INCREMENT PRIMARY KEY,
  location VARCHAR(255) NOT NULL,
  color VARCHAR(255) NOT NULL,
  color_version INT NOT NULL
);
INSERT INTO sys.users (username, passwordHash)
VALUES ('admin', '$2a$10$kiNjIzoDa7.KwJ5FNUUOMeUVovdDeyMT9rY7q79Fx2c3Qx4WM0puu');

INSERT INTO sys.navbar (title, title_version) VALUES
    ('Ana sayfa', 1),
    ('Ürünler', 1),
    ('Hakkında', 1),
    ('Vizyonumuz', 1),
    ('İletişim', 1);
INSERT INTO sys.users(username,passwordHash) VALUES ('admin','$2y$10$VmUvZPFuQ6r/VQYV7Ddzu.NtZeGLnwWIlwoAkzX4QKvNtqztIdCG.');
          
DROP TABLE sys.users;
DROP TABLE sys.files;
DROP TABLE sys.navbar;


SELECT * FROM sys.files;
SELECT * FROM sys.users;
SELECT * FROM sys.navbar;
SELECT * FROM sys.colors;

ALTER TABLE sys.navbar
ADD saved_version INT NOT NULL;
ALTER TABLE sys.colors
ADD saved_version INT NOT NULL;
ALTER TABLE sys.files
ADD saved_version INT NOT NULL;
*/

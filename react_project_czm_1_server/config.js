// Here is the part where the MySQL connection values are stored.

// config.js dosyası
const config = {
  // host: "sql7.freemysqlhosting.net",
  //user: "sql7637435",
  //password: "sIKCLcIep1",
  //database: "sql7637435",
  host: "db4free.net",
  user: "adminczmtest",
  password: "12345678",
  database: "czmtestdb",
};

module.exports = config;
/*
CREATE TABLE czmtestdb.files (
  id INT AUTO_INCREMENT PRIMARY KEY,
  fileName VARCHAR(255) NOT NULL,
  fileExtention VARCHAR(10) NOT NULL,
  location VARCHAR(255) NOT NULL,
  file_version INT NOT NULL,
  fileBase64 LONGTEXT NOT NULL
);
CREATE TABLE czmtestdb.users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL,
  passwordHash TEXT NOT NULL
);
CREATE TABLE czmtestdb.navbar (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  title_version INT NOT NULL
);
INSERT INTO czmtestdb.users (username, passwordHash)
VALUES ('admin', '$2a$10$kiNjIzoDa7.KwJ5FNUUOMeUVovdDeyMT9rY7q79Fx2c3Qx4WM0puu');

DROP TABLE czmtestdb.users;
DROP TABLE czmtestdb.files;

SELECT * FROM czmtestdb.files;
SELECT * FROM czmtestdb.users;
SELECT * FROM czmtestdb.navbar; */

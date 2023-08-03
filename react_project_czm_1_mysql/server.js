const mysql = require('mysql');

// Veritabanına bağlan
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'navbardb'
});

// Veritabanına bağlanın
connection.connect(function(err) {
  if (err) {
    console.log(err);
  } else {
    console.log('Veritabanına bağlanıldı');
  }
});
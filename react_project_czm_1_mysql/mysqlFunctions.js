const mysql = require("mysql");
const config = require("./config");

// Veritabanına bağlan
const connection = mysql.createConnection(config);

// Veritabanına bağlanın
connection.connect(function (err) {
  if (err) {
    console.error("Veritabanına bağlanırken hata oluştu:", err);
  } else {
    console.log("Veritabanına bağlanıldı");
  }
});

function createTable(table_names) {
  const createTableQuery = `CREATE TABLE IF NOT EXISTS \`${table_names}\` (
    id INT AUTO_INCREMENT PRIMARY KEY
  )`;

  connection.query(createTableQuery, function (err) {
    if (err) {
      console.error("Tablo oluşturulurken bir hata oluştu:", err);
    } else {
      console.log(`"${table_names}" tablosu başarıyla oluşturuldu`);
    }
  });
}

function dropTable(table_names) {
  const dropTableQuery = `DROP TABLE \`${table_names}\`;`;

  connection.query(dropTableQuery, function (err) {
    if (err) {
      console.error("Tablo silinirken bir hata oluştu:", err);
    } else {
      console.log(`"${table_names}" tablosu başarıyla silindi`);
    }
  });
}

function insertRow(table_names, columns, values) {

//KOLON VE VALUES KISMI JSON FORMATINA GÖRE VİRGÜL VS İLE AYARLANACAK VE BÜTÜN FONKSİYONLAR İÇİN YAPILACAK BU İŞLEM

  const insertRowQuery = `INSERT INTO \`${table_names}\` (${columns}) VALUES (${values})`;

  connection.query(insertRowQuery, function (err) {
    if (err) {
      console.error("Satır eklenirken bir hata oluştu:", err);
    } else {
      console.log(`"${table_names}" tablosuna satır başarıyla eklendi`);
    }
  });
}

function selectRows(table_names, columns) {
  const selectRowsQuery = `SELECT ${columns} FROM \`${table_names}\`;`;

  connection.query(selectRowsQuery, function (err, results) {
    if (err) {
      console.error("Satırlar alınırken bir hata oluştu:", err);
    } else {
      console.log(`Satırlar başarıyla alındı`);
      console.log(results);
    }
  });
}

module.exports = {
  createTable,
  dropTable,
  insertRow,
  selectRows,
};

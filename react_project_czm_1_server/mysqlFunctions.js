const mysql = require("mysql");
const config = require("./config");

const connection = mysql.createConnection(config);

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

function insertRow(table_name, columns, values, title_version) {
  let newTitleVersion = title_version || 0;
  newTitleVersion += 1;

  let insertRowQuery = `INSERT INTO ${table_name} (${columns}, title_version) VALUES `;

  for (let i = 0; i < values.length; i++) {
    insertRowQuery += `('${values[i]}', ${newTitleVersion})`;
    if (i < values.length - 1) {
      insertRowQuery += ", ";
    }
  }

  console.log(`Executing query: ${insertRowQuery}`);
  connection.query(insertRowQuery, function (err) {
    if (err) {
      console.error(
        `An error occurred while inserting rows into the "${table_name}" table:`,
        err
      );
    } else {
      console.log(
        `Rows were successfully inserted into the "${table_name}" table with the following values: ${values}`
      );
    }
  });
}

function selectMaxTitleVersion(table_names) {
  return new Promise((resolve, reject) => {
    const selectMaxTitleVersionQuery = `SELECT MAX(title_version) as max_title_version FROM \`${table_names}\`;`;

    connection.query(selectMaxTitleVersionQuery, function (err, results) {
      if (err) {
        reject(err);
      } else {
        resolve(results[0].max_title_version);
      }
    });
  });
}

function selectRows(table_names, columns) {
  return new Promise((resolve, reject) => {
    const selectRowsQuery = `SELECT ${columns} FROM \`${table_names}\`;`;

    connection.query(selectRowsQuery, function (err, results) {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
}

function selectRowsWithLatestTitleVersion(table_names, columns) {
  return new Promise((resolve, reject) => {
    const selectRowsQuery = `
      SELECT ${columns}
      FROM ${table_names}
      WHERE title_version = (SELECT MAX(title_version) FROM ${table_names})
    `;

    connection.query(selectRowsQuery, function (err, results) {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
}
function findByUsername(username) {
  return new Promise((resolve, reject) => {
    const findByUsernameQuery = `SELECT * FROM users WHERE username = '${username}';`;

    connection.query(findByUsernameQuery, function (err, results) {
      if (err) {
        reject(err);
      } else {
        if (results.length > 0) {
          resolve(results[0]);
        } else {
          resolve(null);
        }
      }
    });
  });
}

function selectMaxFileVersion(location) {
  return new Promise((resolve, reject) => {
    const selectMaxFileVersionQuery =
      "SELECT MAX(file_version) as max_file_version FROM files WHERE location = ?";

    connection.query(
      selectMaxFileVersionQuery,
      [location],
      function (err, results) {
        if (err) {
          reject(err);
        } else {
          resolve(
            results[0].max_file_version !== null
              ? results[0].max_file_version
              : 0
          );
        }
      }
    );
  });
}

function uploadFile(fileName, fileExtention, location, fileBase64) {
  return new Promise((resolve, reject) => {
    selectMaxFileVersion(location)
      .then((maxFileVersion) => {
        const newFileVersion = maxFileVersion + 1;

        const insertQuery =
          "INSERT INTO files (fileName, fileExtention, location, file_version, fileBase64) VALUES (?, ?, ?, ?, ?)";

        connection.query(
          insertQuery,
          [fileName, fileExtention, location, newFileVersion, fileBase64],
          function (err, results) {
            if (err) {
              reject(err);
            } else {
              resolve(results);
            }
          }
        );
      })
      .catch((error) => {
        reject(error);
      });
  });
}

module.exports = {
  createTable,
  dropTable,
  insertRow,
  selectRows,
  selectMaxTitleVersion,
  selectRowsWithLatestTitleVersion,
  findByUsername,
  selectMaxFileVersion,
  uploadFile,
};

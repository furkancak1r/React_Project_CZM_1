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

function insertRow(table_name, columns, values, title_version) {
  let newTitleVersion = title_version || 0; // If title_version is null, set it to 0
  newTitleVersion += 1; // Increment newTitleVersion by 1

  let insertRowQuery = `INSERT INTO ${table_name} (${columns}, title_version) VALUES `;

  // Concatenate the values as separate rows
  for (let i = 0; i < values.length; i++) {
    insertRowQuery += `('${values[i]}', ${newTitleVersion})`;
    if (i < values.length - 1) {
      insertRowQuery += ', ';
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
        reject(err); // Reject the promise on error
      } else {
        resolve(results[0].max_title_version); // Resolve the promise with the max title_version
      }
    });
  });
}

function selectRows(table_names, columns) {
  return new Promise((resolve, reject) => {
    const selectRowsQuery = `SELECT ${columns} FROM \`${table_names}\`;`;

    connection.query(selectRowsQuery, function (err, results) {
      if (err) {
        reject(err); // Reject the promise on error
      } else {
        resolve(results); // Resolve the promise with the query results
      }
    });
  });
}



module.exports = {
  createTable,
  dropTable,
  insertRow,
  selectRows,
  selectMaxTitleVersion,
};

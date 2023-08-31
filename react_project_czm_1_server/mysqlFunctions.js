const mysql2 = require("mysql2");
const config = require("./config");

const connection = mysql2.createConnection(config);

connection.connect();

async function runQuery(query, values = []) {
  return new Promise((resolve, reject) => {
    connection.query(query, values, (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
}

async function createTable(tableName) {
  const query = `
    CREATE TABLE IF NOT EXISTS \`${tableName}\` (
      id INT AUTO_INCREMENT PRIMARY KEY
    )
  `;
  await runQuery(query);
}

async function dropTable(tableName) {
  const query = `DROP TABLE \`${tableName}\``;
  await runQuery(query);
}

async function insertRow(values, title_version,savedVersion) {
  let newTitleVersion = title_version || 0;
  newTitleVersion += 1;

  let insertRowQuery = `INSERT INTO navbar (title, title_version, saved_version) VALUES `;

  for (let i = 0; i < values.length; i++) {
    insertRowQuery += `('${values[i]}', ${newTitleVersion},${savedVersion})`;
    if (i < values.length - 1) {
      insertRowQuery += ", ";
    }
  }

  const query = `
    ${insertRowQuery}
  `;

  try {
    const results = await runQuery(query);
    return results;
  } catch (err) {
    console.error("An error occurred while inserting rows:", err);
  }
}


async function selectMaxTitleVersion(tableName) {
  const query = `SELECT MAX(title_version) AS max_title_version FROM \`${tableName}\``;
  const results = await runQuery(query);
  return results[0].max_title_version;
}

async function selectRows(tableName, columns) {
  const query = `SELECT ${columns} FROM \`${tableName}\``;
  return runQuery(query);
}

async function selectRowsWithLatestTitleVersion(tableName, columns) {
  const subQuery = `SELECT MAX(title_version) FROM ${tableName}`;
  const query = `
    SELECT ${columns}
    FROM ${tableName}
    WHERE title_version = (${subQuery})
  `;
  return runQuery(query);
}

async function findByUsername(username) {
  const query = `SELECT * FROM users WHERE username = ?`;
  const results = await runQuery(query, [username]);
  return results[0] || null;
}

async function selectMaxFileVersion(location) {
  const query = `
    SELECT MAX(file_version) AS max_file_version
    FROM files
    WHERE location = ?
  `;
  const results = await runQuery(query, [location]);
  return results[0].max_file_version || 0;
}

async function uploadFile(
  fileName,
  fileExtension,
  location,
  fileBase64,
  savedVersion
) {
  const maxFileVersion = await selectMaxFileVersion(location);
  const newFileVersion = Number(maxFileVersion) + 1;

  const query = `
    INSERT INTO files (fileName, fileExtension, location, file_version, fileBase64, saved_version)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  const values = [
    fileName,
    fileExtension,
    location,
    newFileVersion,
    fileBase64,
    savedVersion || 0,
  ];
  const results = await runQuery(query, values);
  return results;
}

async function getFileByVersionAndLocation(location, version) {
  const query = `
    SELECT *
    FROM files
    WHERE location = ? AND file_version = ?
  `;
  const results = await runQuery(query, [location, version]);
  return results[0];
}

async function selectMaxColorVersion(tableName) {
  const query = `SELECT MAX(color_version) AS max_color_version FROM \`${tableName}\``;
  const results = await runQuery(query);
  return results[0].max_color_version || 0;
}

async function uploadColor(location, color, newColorVersion, savedVersion) {
  const query = `
    INSERT INTO colors (location, color, color_version, saved_version)
    VALUES (?, ?, ?, ?)
  `;
  const values = [
    location,
    JSON.stringify(color),
    newColorVersion,
    savedVersion || 0,
  ];
  const results=await runQuery(query, values);
  return results;
}

async function selectRowsWithLatestColorVersion() {
  const subQuery = `SELECT MAX(color_version) FROM colors`;
  const query = `
    SELECT *
    FROM colors
    WHERE color_version = (${subQuery})
  `;
  return await runQuery(query);
}

async function selectMaxSavedVersion(tableName) {
  const query = `SELECT MAX(saved_version) AS max_saved_version FROM \`${tableName}\``;
  const results = await runQuery(query);
  return results[0].max_saved_version || 0;
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
  getFileByVersionAndLocation,
  uploadColor,
  selectMaxColorVersion,
  selectRowsWithLatestColorVersion,
  selectMaxSavedVersion,
};

const express = require("express");
const mysqlFunctions = require("./mysqlFunctions");

const app = express();
const port = 3000;

app.use(express.json()); // Middleware to parse JSON data

app.post("/sqldata/createtable", (req, res) => {
  // İstekten gelen verileri alıyoruz
  const { table_names } = req.body;

  // Create the table using the received values
  mysqlFunctions.createTable(table_names[0]);

  // Yanıt olarak 200 OK dönüyoruz
  res.sendStatus(200);
});

app.post("/sqldata/droptable", (req, res) => {
  // İstekten gelen verileri alıyoruz
  const { table_names } = req.body;

  // Drop the table using the received values
  mysqlFunctions.dropTable(table_names[0]);

  // Yanıt olarak 200 OK dönüyoruz
  res.sendStatus(200);
});

app.post("/sqldata/insertrow", (req, res) => {
  // İstekten gelen verileri alıyoruz
  const { table_names, columns, values } = req.body;

  // Insert the row using the received values
  mysqlFunctions.insertRow(table_names, columns, values);

  // Yanıt olarak 200 OK dönüyoruz
  res.sendStatus(200);
});

app.post("/sqldata/selectrows", (req, res) => {
  // İstekten gelen verileri alıyoruz
  const { table_names, columns } = req.body;

  // Select the rows using the received values
  mysqlFunctions.selectRows(table_names, columns);

  // Yanıt olarak 200 OK dönüyoruz
  res.sendStatus(200);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});


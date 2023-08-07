const express = require("express");
const mysqlFunctions = require("./mysqlFunctions");
const cors = require("cors"); // Import the cors package
const bodyParser = require("body-parser");
const app = express();
const port = 4000;

app.use(express.json()); // Middleware to parse JSON data
app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.json());
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
  // Retrieve the max title_version from the database
  console.log("table_names[0]:", req.body);
  mysqlFunctions
    .selectMaxTitleVersion(table_names[0])
    .then((max_title_version) => {
      // Update the row using the received values and max_title_version
      console.log("max_title_version", max_title_version);
      mysqlFunctions.insertRow(
        table_names[0],
        columns[0],
        values,
        max_title_version
      );

      // Yanıt olarak 200 OK dönüyoruz
      res.sendStatus(200);
    });
});

app.post("/sqldata/selectrows", async (req, res) => {
  // Add async keyword to the route handler
  // İstekten gelen verileri alıyoruz
  const { table_names, columns } = req.body;

  try {
    // Select the rows using the received values
    const rows = await mysqlFunctions.selectRows(table_names, columns);

    // Yanıt olarak JSON formatında yanıt döndürüyoruz
    res.json(rows);
  } catch (error) {
    console.error("Satırlar alınırken bir hata oluştu:", error);
    // Hata durumunda uygun bir hata kodu ve mesajı dönülebilir
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

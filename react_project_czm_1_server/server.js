const express = require("express");
const mysqlFunctions = require("./mysqlFunctions");
const cors = require("cors");
const app = express();
const port = 8080;
const bcrypt = require("bcryptjs");

app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.post("/sqldata/createtable", (req, res) => {
  const { table_names } = req.body;

  mysqlFunctions.createTable(table_names[0]);

  res.sendStatus(200);
});

app.post("/sqldata/droptable", (req, res) => {
  const { table_names } = req.body;

  mysqlFunctions.dropTable(table_names[0]);

  res.sendStatus(200);
});

app.post("/sqldata/insertrow", (req, res) => {
  const { table_names, columns, values } = req.body;
  console.log("table_names[0]:", req.body);
  mysqlFunctions
    .selectMaxTitleVersion(table_names[0])
    .then((max_title_version) => {
      console.log("max_title_version", max_title_version);
      mysqlFunctions.insertRow(
        table_names[0],
        columns[0],
        values,
        max_title_version
      );

      res.json({ status: "success" });
    });
});

app.post("/sqldata/selectRowsWithLatestTitleVersion", async (req, res) => {
  const { table_names, columns } = req.body;

  try {
    const rows = await mysqlFunctions.selectRowsWithLatestTitleVersion(
      table_names,
      columns
    );

    res.json(rows);
  } catch (error) {
    console.error("Satırlar alınırken bir hata oluştu:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/sqldata/selectrows", async (req, res) => {
  const { table_names, columns } = req.body;

  try {
    const rows = await mysqlFunctions.selectRows(table_names, columns);

    res.json(rows);
  } catch (error) {
    console.error("Satırlar alınırken bir hata oluştu:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/adminLogin", async (req, res) => {
  // async ekledik
  const { username, password } = req.body;

  try {
    // Kullanıcının veritabanında kayıtlı şifresini alın
    const user = await mysqlFunctions.findByUsername(username);

    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // Kullanıcının girdiği şifreyi kayıtlı şifre ile karşılaştır
    const isPasswordMatch = bcrypt.compare(password, user.passwordHash);

    if (isPasswordMatch) {
      return res.status(200).json({ message: "Login successful" });
    } else {
      return res
        .status(401)
        .json({ message: "Invalid username or password" });
    }
  } catch (error) {
    console.error("Error during admin login:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/sqldata/uploadFiles", async (req, res) => {
  const { fileName, fileExtention ,fileBase64} = req.body;

  try {
    const response = await mysqlFunctions.uploadFiles(fileName, fileExtention ,fileBase64);

    res.json(response);
  } catch (error) {
    console.error("Dosya yüklenirken bir hata oluştu:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

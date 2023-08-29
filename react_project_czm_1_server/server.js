const express = require("express");
const mysqlFunctions = require("./mysqlFunctions");
const cors = require("cors");
const app = express();
const port = 8080;
const bcrypt = require("bcryptjs");
const bodyParser = require("body-parser");

app.use(express.json({ limit: "50mb" }));

app.use(bodyParser.json({ limit: "50mb" })); // Örneğin, limiti 50 MB olarak ayarlayabilirsiniz.
app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 50000,
  })
);
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
  mysqlFunctions
    .selectMaxTitleVersion(table_names[0])
    .then((max_title_version) => {
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
  const { username, password } = req.body;

  try {
    const user = await mysqlFunctions.findByUsername(username);

    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const isPasswordMatch = bcrypt.compare(password, user.passwordHash);

    if (isPasswordMatch) {
      return res.status(200).json({ message: "Login successful" });
    } else {
      return res.status(401).json({ message: "Invalid username or password" });
    }
  } catch (error) {
    console.error("Error during admin login:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/sqldata/uploadFile", async (req, res) => {
  const { fileName, fileExtention, location, fileBase64 } = req.body;

  try {
    const response = await mysqlFunctions.uploadFile(
      fileName,
      fileExtention,
      location,
      fileBase64
    );

    res.json(response);
  } catch (error) {
    console.error("Dosya yüklenirken bir hata oluştu:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/sqldata/getLatestFileVersionsByLocation", async (req, res) => {
  const { location, count } = req.body;

  try {
    const latestFileVersion = await mysqlFunctions.selectMaxFileVersion(
      location
    );
    const fileVersions = [];

    for (
      let i = latestFileVersion;
      i > Math.max(latestFileVersion - count, 0);
      i--
    ) {
      const fileInfo = await mysqlFunctions.getFileByVersionAndLocation(
        location,
        i
      );
      if (fileInfo) {
        fileVersions.push(fileInfo);
      }
    }

    res.json(fileVersions);
  } catch (error) {
    console.error("Veri çekilirken bir hata oluştu:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

app.post("/sqldata/uploadColors", async (req, res) => {
  const { allColors } = req.body;

  try {
    const responsePromises = [];

    for (const colorName in allColors) {
      const color = allColors[colorName];
      const location = colorName;

      const responsePromise = uploadColors(location, color);
      responsePromises.push(responsePromise);
    }

    const responses = await Promise.all(responsePromises);

    res.json(responses);
  } catch (error) {
    console.error("Renkler yüklenirken bir hata oluştu:", error);
    res.status(500).json({ error: "İçsel sunucu hatası" });
  }
});

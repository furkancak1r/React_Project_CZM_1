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
  const { values, savedVersion } = req.body;
  mysqlFunctions.selectMaxTitleVersion("navbar").then((max_title_version) => {
    mysqlFunctions.insertRow(values, max_title_version, savedVersion);

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
  const { username } = req.body;

  try {
    const user = await mysqlFunctions.findByUsername(username);

    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    } else {
      return res.json(user.passwordHash); 
    }
  } catch (error) {
    console.error("Error during admin login:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});


app.post("/sqldata/uploadFile", async (req, res) => {
  const { fileName, fileExtension, location, fileBase64, savedVersion } =
    req.body;

  try {
    const response = await mysqlFunctions.uploadFile(
      fileName,
      fileExtension,
      location,
      fileBase64,
      savedVersion
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

app.get("/sqldata/fetchMaxColorVersion", async (req, res) => {
  try {
    const responseMaxColorVersion = await mysqlFunctions.selectMaxColorVersion(
      "colors"
    );

    res.json(responseMaxColorVersion);
  } catch (error) {
    console.error("Max_Color_Version alırken bir hata oluştu:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/sqldata/uploadColor", async (req, res) => {
  const { location, color, newColorVersion, savedVersion } = req.body;
  try {
    const response = await mysqlFunctions.uploadColor(
      location,
      color,
      newColorVersion,
      savedVersion
    );
    res.json(response);
  } catch (error) {
    console.error("Renk yüklenirken bir hata oluştu:", error);
    res.status(500).json({ error: "İçsel sunucu hatası" });
  }
});

app.get("/sqldata/selectRowsWithLatestColorVersion", async (req, res) => {
  try {
    const rows = await mysqlFunctions.selectRowsWithLatestColorVersion();
    res.json(rows);
  } catch (error) {
    console.error("Satırlar alınırken bir hata oluştu:", error);
    res.status(500).json({ error: "İçsel sunucu hatası" });
  }
});

app.post("/sqldata/selectMaxSavedVersion", async (req, res) => {
  const { tableName } = req.body;
  try {
    const response = await mysqlFunctions.selectMaxSavedVersion(tableName);
    res.json(response);
  } catch (error) {
    console.error("Max saved_version alınırken bir hata oluştu:", error);
    res.status(500).json({ error: "İçsel sunucu hatası" });
  }
});

app.post("/sqldata/selectTableBySavedVersion", async (req, res) => {
  const { tableName, savedVersion } = req.body;
  try {
    const response = await mysqlFunctions.selectTableBySavedVersion(
      tableName,
      savedVersion
    );
    res.json(response);
  } catch (error) {
    console.error(
      "Max saved_version tablo infosu alınırken bir hata oluştu:",
      error
    );
    res.status(500).json({ error: "İçsel sunucu hatası" });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

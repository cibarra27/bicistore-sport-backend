// backend/initDb.js
const fs = require("fs");
const path = require("path");
const db = require("./db");

const schema = fs.readFileSync(path.join(__dirname, "schema.sql"), "utf-8");

db.exec(schema, (err) => {
  if (err) console.error("Error ejecutando schema:", err);
  else console.log("Esquema SQLite inicial listo.");
});

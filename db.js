// backend/db.js
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const DB_PATH = path.join(__dirname, "bicistore.db");

const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) console.error("Error abriendo SQLite:", err);
  else console.log("SQLite conectado en", DB_PATH);
});

module.exports = db;

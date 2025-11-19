// backend/routes/auth.js
const express = require("express");
const router = express.Router();

// Solo importamos la función que sí existe en el controlador
const { login } = require("../controllers/authController");

// Ruta de login
router.post("/login", login);

const { getAllUsers } = require("../controllers/authController");

router.get("/debug-users", async (req, res) => {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener usuarios" });
  }
});
router.get("/debug-users", async (req, res) => {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener usuarios" });
  }
});
router.get("/debug-tables", (req, res) => {
  const sqlite3 = require("sqlite3").verbose();
  const dbPath = require("path").join(__dirname, "..", "bicistore.db");
  const db = new sqlite3.Database(dbPath);

  db.all("SELECT name FROM sqlite_master WHERE type='table'", (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});
// Crear tabla admin_users sin borrar datos existentes
router.get("/create-admin-table", (req, res) => {
  const sqlite3 = require("sqlite3").verbose();
  const dbPath = require("path").join(__dirname, "..", "bicistore.db");
  const db = new sqlite3.Database(dbPath);

  db.run(
    `CREATE TABLE IF NOT EXISTS admin_users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT DEFAULT 'admin'
    )`,
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      return res.json({ message: "Tabla admin_users creada OK" });
    }
  );
});
router.get("/create-admin", (req, res) => {
  const sqlite3 = require("sqlite3").verbose();
  const dbPath = require("path").join(__dirname, "..", "bicistore.db");
  const db = new sqlite3.Database(dbPath);

  db.run(
    "INSERT INTO admin_users (username, password) VALUES (?, ?)",
    ["admin", "admin123"],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      return res.json({ message: "Usuario admin creado", id: this.lastID });
    }
  );
});
module.exports = router;

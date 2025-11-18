// backend/controllers/authController.js
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../db");

function seedAdminUser() {
  const username = process.env.ADMIN_USERNAME || "admin";
  const password = process.env.ADMIN_PASSWORD || "admin123";

  const sql = "SELECT id FROM users WHERE username = ?";
  db.get(sql, [username], async (err, row) => {
    if (err) {
      console.error("Error buscando admin:", err);
      return;
    }
    if (row) return; // ya existe

    try {
      const hash = await bcrypt.hash(password, 10);
      const insert =
        "INSERT INTO users (username, password_hash, role) VALUES (?, ?, 'admin')";
      db.run(insert, [username, hash], (err2) => {
        if (err2) console.error("Error creando admin:", err2);
        else console.log("Usuario admin inicial creado:", username);
      });
    } catch (error) {
      console.error("Error generando hash:", error);
    }
  });
}

function login(req, res) {
  const { username, password } = req.body;
  if (!username || !password)
    return res
      .status(400)
      .json({ message: "Usuario y contraseña son requeridos" });

  const sql = "SELECT * FROM users WHERE username = ?";
  db.get(sql, [username], async (err, user) => {
    if (err) return res.status(500).json({ message: "Error interno" });
    if (!user) return res.status(401).json({ message: "Credenciales inválidas" });

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ message: "Credenciales inválidas" });

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );
    res.json({ token });
  });
}

module.exports = { login, seedAdminUser };

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
module.exports = router;

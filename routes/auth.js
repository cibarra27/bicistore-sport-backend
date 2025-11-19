// backend/routes/auth.js
const express = require("express");
const router = express.Router();

// Solo importamos la función que sí existe en el controlador
const { login } = require("../controllers/authController");

// Ruta de login
router.post("/login", login);

module.exports = router;

// backend/routes/auth.js
const express = require("express");
const router = express.Router();
const { login, seedAdminUser } = require("../controllers/authController");

seedAdminUser();

router.post("/login", login);

module.exports = router;

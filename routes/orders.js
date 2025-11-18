// backend/routes/orders.js
const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const ctrl = require("../controllers/ordersController");

// Crear pedido (público)
router.post("/", ctrl.createOrder);

// Listar pedidos (solo admin)
router.get("/", auth, ctrl.listOrders);

module.exports = router;

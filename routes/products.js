// backend/routes/products.js
const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const ctrl = require("../controllers/productsController");

router.get("/", ctrl.listProducts);
router.get("/:id", ctrl.getProduct);
router.post("/", auth, ctrl.createProduct);
router.put("/:id", auth, ctrl.updateProduct);
router.delete("/:id", auth, ctrl.deleteProduct);

module.exports = router;

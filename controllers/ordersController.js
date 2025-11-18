// backend/controllers/ordersController.js
const db = require("../db");

function createOrder(req, res) {
  const { customer_name, customer_email, items } = req.body;
  if (!items || !items.length) {
    return res.status(400).json({ message: "Carrito vacío" });
  }

  const total = items.reduce(
    (acc, i) => acc + Number(i.price || 0) * Number(i.quantity || 0),
    0
  );

  db.run(
    "INSERT INTO orders (customer_name, customer_email, total) VALUES (?, ?, ?)",
    [customer_name || null, customer_email || null, total],
    function (err) {
      if (err) return res.status(500).json({ message: "Error creando pedido" });
      const orderId = this.lastID;

      const stmt = db.prepare(
        "INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)"
      );

      for (const item of items) {
        stmt.run(orderId, item.id, item.quantity, item.price);
      }
      stmt.finalize();

      res.status(201).json({ id: orderId, total });
    }
  );
}

function listOrders(req, res) {
  db.all(
    "SELECT id, customer_name, customer_email, total, created_at FROM orders ORDER BY id DESC",
    [],
    (err, rows) => {
      if (err) return res.status(500).json({ message: "Error listando pedidos" });
      res.json(rows);
    }
  );
}

module.exports = { createOrder, listOrders };

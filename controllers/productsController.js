// backend/controllers/productsController.js
const db = require("../db");

function listProducts(req, res) {
  db.all("SELECT * FROM products ORDER BY id DESC", [], (err, rows) => {
    if (err) return res.status(500).json({ message: "Error interno" });
    res.json(rows);
  });
}

function getProduct(req, res) {
  db.get("SELECT * FROM products WHERE id = ?", [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ message: "Error interno" });
    if (!row) return res.status(404).json({ message: "Producto no encontrado" });
    res.json(row);
  });
}

function createProduct(req, res) {
  const { name, brand, category, price, stock, image_url, description } = req.body;
  if (!name || !brand || !category || price == null || stock == null) {
    return res.status(400).json({
      message: "name, brand, category, price y stock son obligatorios",
    });
  }

  const sql = `
    INSERT INTO products (name, brand, category, price, stock, image_url, description)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  db.run(
    sql,
    [name, brand, category, price, stock, image_url || null, description || null],
    function (err) {
      if (err) return res.status(500).json({ message: "Error interno" });
      res
        .status(201)
        .json({
          id: this.lastID,
          name,
          brand,
          category,
          price,
          stock,
          image_url,
          description,
        });
    }
  );
}

function updateProduct(req, res) {
  const { id } = req.params;
  const { name, brand, category, price, stock, image_url, description } = req.body;

  const sql = `
    UPDATE products
    SET name = ?, brand = ?, category = ?, price = ?, stock = ?, image_url = ?, description = ?
    WHERE id = ?
  `;
  db.run(
    sql,
    [name, brand, category, price, stock, image_url || null, description || null, id],
    function (err) {
      if (err) return res.status(500).json({ message: "Error interno" });
      if (this.changes === 0)
        return res.status(404).json({ message: "Producto no encontrado" });
      res.json({
        id,
        name,
        brand,
        category,
        price,
        stock,
        image_url,
        description,
      });
    }
  );
}

function deleteProduct(req, res) {
  db.run("DELETE FROM products WHERE id = ?", [req.params.id], function (err) {
    if (err) return res.status(500).json({ message: "Error interno" });
    if (this.changes === 0)
      return res.status(404).json({ message: "Producto no encontrado" });
    res.status(204).send();
  });
}

module.exports = {
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};

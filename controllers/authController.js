// controllers/authController.js
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const jwt = require('jsonwebtoken');

// Ruta a la base de datos SQLite
const dbPath = path.join(__dirname, '..', 'bicistore.db');
const db = new sqlite3.Database(dbPath);

// Clave secreta para JWT (de variables de entorno)
const JWT_SECRET = process.env.JWT_SECRET;

// Helper para verificar que exista la clave
function ensureJwtSecret(res) {
  if (!JWT_SECRET) {
    console.error('😱 JWT_SECRET NO está configurado en las variables de entorno');
    return res
      .status(500)
      .json({ error: 'Error de configuración del servidor (JWT_SECRET faltante)' });
  }
  return true;
}

// POST /api/auth/login
exports.login = (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Usuario y contraseña son requeridos' });
  }

  db.get(
    'SELECT * FROM admin_users WHERE username = ?',
    [username],
    (err, user) => {
      if (err) {
        console.error('Error consultando admin_users:', err);
        return res.status(500).json({ error: 'Error al autenticar' });
      }

      if (!user || user.password !== password) {
        return res.status(401).json({ error: 'Credenciales inválidas' });
      }

      if (!ensureJwtSecret(res)) return;

      const token = jwt.sign(
        {
          id: user.id,
          username: user.username,
          role: user.role || 'admin',
        },
        JWT_SECRET,
        { expiresIn: '8h' }
      );

      res.json({ token });
    }
  );
};

// 🟣 NUEVO: Obtener lista de usuarios (para debug)
async function getAllUsers() {
  return new Promise((resolve, reject) => {
    db.all("SELECT id, username, role FROM admin_users", (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
}

// Middleware para proteger rutas (si lo usas)
exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // "Bearer xxx"

  if (!token) {
    return res.status(401).json({ error: 'Token requerido' });
  }

  if (!ensureJwtSecret(res)) return;

  jwt.verify(token, JWT_SECRET, (err, payload) => {
    if (err) {
      console.error('Error verificando token:', err);
      return res.status(401).json({ error: 'Token inválido' });
    }

    req.user = payload;
    next();
  });
};

exports.getAllUsers = getAllUsers;

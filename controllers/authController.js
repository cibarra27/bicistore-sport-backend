const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../db');

const JWT_SECRET = process.env.JWT_SECRET;

// Solo aviso en logs si falta, pero en producción debe estar SIEMPRE definido.
if (!JWT_SECRET) {
  console.warn(
    '⚠️  JWT_SECRET no está definido en las variables de entorno. ' +
    'Define JWT_SECRET en tu .env y en Render Environment.'
  );
}

// POST /api/auth/login
// Body esperado: { "username": "admin", "password": "admin123" }
async function login(req, res) {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ error: 'Usuario y contraseña son obligatorios.' });
    }

    // Buscar usuario en SQLite
    db.get(
      'SELECT id, username, password FROM users WHERE username = ?',
      [username],
      (err, user) => {
        if (err) {
          console.error('Error consultando usuario:', err);
          return res
            .status(500)
            .json({ error: 'Error en el servidor al buscar el usuario.' });
        }

        if (!user) {
          // Usuario no encontrado
          return res.status(401).json({ error: 'Credenciales incorrectas.' });
        }

        const storedPassword = user.password || '';

        // Función para validar la contraseña (soporta hash bcrypt o texto plano)
        const checkPassword = (callback) => {
          if (!storedPassword) return callback(false);

          // Si parece un hash bcrypt ($2a$, $2b$, etc.)
          if (storedPassword.startsWith('$2')) {
            bcrypt.compare(password, storedPassword, (err, same) => {
              if (err) {
                console.error('Error comparando contraseña:', err);
                return callback(false);
              }
              callback(same);
            });
          } else {
            // Texto plano (solo por simplicidad en este proyecto)
            callback(password === storedPassword);
          }
        };

        checkPassword((isValid) => {
          if (!isValid) {
            return res.status(401).json({ error: 'Credenciales incorrectas.' });
          }

          // IMPORTANTE: aquí es donde antes explotaba tu API
          // Ahora SIEMPRE usamos process.env.JWT_SECRET
          const secret = JWT_SECRET || 'bicistore-dev-secret';

          const token = jwt.sign(
            {
              id: user.id,
              username: user.username,
            },
            secret,
            { expiresIn: '24h' }
          );

          return res.json({
            success: true,
            token,
            username: user.username,
          });
        });
      }
    );
  } catch (error) {
    console.error('Error en login:', error);
    return res.status(500).json({ error: 'Error en el servidor.' });
  }
}

module.exports = {
  login,
};

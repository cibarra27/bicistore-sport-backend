# BiciStore Sport - Backend (Node.js + Express + SQLite)

## Requisitos

- Node.js 18+
- No necesitas instalar SQLite por separado (usa archivo `bicistore.db` local).

## Instalación

```bash
cd backend
npm install
```

Crea tu archivo `.env`:

```bash
cp .env.example .env
```

Edita `.env` y define:

```env
PORT=4000
JWT_SECRET=algo_super_largo_y_unico
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
```

## Ejecutar en local

```bash
node server.js
```

El backend:
- crea automáticamente `bicistore.db`
- ejecuta `schema.sql`
- crea un usuario admin inicial.

La API queda en: `http://localhost:4000/api`

## Endpoints principales

- `POST /api/auth/login`
- `GET /api/products`
- `POST /api/products` (requiere token)
- `PUT /api/products/:id` (requiere token)
- `DELETE /api/products/:id` (requiere token)
- `POST /api/orders` (crea pedido a partir del carrito)
- `GET /api/orders` (requiere token, lista pedidos)

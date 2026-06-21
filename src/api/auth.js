// src/api/auth.js
const express = require('express');
const router = express.Router();

/**
 * @swagger
 * /auth:
 *   post:
 *     summary: Autenticar un usuario (Login)
 *     description: Inicia sesión en el sistema usando credenciales de usuario y contraseña. Llama al procedimiento almacenado `Autenticacion`.
 *     tags:
 *       - Autenticación
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               usuario:
 *                 type: string
 *                 description: El nombre de usuario (ej. 'wduran').
 *                 example: 'wduran'
 *               pass:
 *                 type: string
 *                 format: password
 *                 description: La contraseña del usuario.
 *                 example: 'wduran1234'
 *     responses:
 *       200:
 *         description: Autenticación exitosa. Retorna el objeto del usuario.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   IdUsuario:
 *                     type: integer
 *                   Nombre:
 *                     type: string
 *                   Email:
 *                     type: string
 *                   IdRol:
 *                     type: integer
 *                   codigo_invitacion:
 *                     type: string
 *       500:
 *         description: Error interno del servidor o error de conexión a la base de datos.
 */
router.post('/', (req, res) => {
  const { usuario, pass } = req.body || {};

  req.getConnection((err, conn) => {
    if (err) {
      return res.status(500).json({ ok: false, message: 'DB conn error' });
    }

    //Parametrizado (evita inyección)
    conn.query('CALL Autenticacion(?, ?)', [usuario, pass], (err, rows) => {
      if (err) {
        console.error('AUTH DB ERROR:', err);
        return res.status(500).json({ ok: false, error: 'AUTH_SQL_ERROR' });
      }

      // El front espera [] cuando no hay match
      const payload = Array.isArray(rows) && Array.isArray(rows[0]) ? rows[0] : rows;
      if (!Array.isArray(payload) || payload.length === 0) {
        return res.json([]);
      }

      return res.json(payload);
    });
  });
});

module.exports = router;
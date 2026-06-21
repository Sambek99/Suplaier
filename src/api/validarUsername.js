var express = require('express');
var router = express.Router();

/**
 * @swagger
 * /validarUsername:
 *   get:
 *     summary: Validar si el nombre de usuario existe
 *     description: Revisa si un nombre de usuario ('username') ya está en uso en la tabla 'Usuario'.
 *     tags:
 *       - Usuarios
 *     parameters:
 *       - in: query
 *         name: username
 *         required: true
 *         description: El nombre de usuario a verificar.
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Lista de usuarios que coinciden (0 o 1). Si 'rows.length > 0', el usuario ya existe.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 rows:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       Usuario:
 *                         type: string
 *       '500':
 *         description: Error interno del servidor.
 */
router.get('/', function(req, res, next) {
  const username = req.query.username === undefined ? null : req.query.username;
  req.getConnection((err, conn) =>{
    if(err) return res.send(err);
    conn.query(
      ` SELECT Usuario FROM Usuario u
        WHERE Usuario = COALESCE('${username}', u.Usuario)`, 
      (err, rows) => {
        if(err) res.json(err);
        res.json({rows});
    });
  });
});

module.exports = router;
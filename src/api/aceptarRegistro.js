var express = require('express');
var router = express.Router();

/**
 * @swagger
 * /aceptarRegistro/validarcodigo:
 *   get:
 *     summary: Validar código de invitación
 *     description: Verifica si un código de invitación de referido existe en la base de datos.
 *     tags:
 *       - Registro
 *     parameters:
 *       - in: query
 *         name: codigo
 *         required: true
 *         description: El código de invitación a validar.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: El código fue validado con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Código válido"
 *       400:
 *         description: No se proporcionó el parámetro 'codigo' en la query.
 *       500:
 *         description: Error interno del servidor.
 */
// Endpoint para validar si existe el código de invitación
router.get('/validarcodigo', function (req, res) {
  const { codigo } = req.query;
  if (!codigo) {
    return res.status(400).json({ success: false, message: 'Código no proporcionado' });
  }
  req.getConnection((err, conn) => {
    if (err) return res.status(500).json(err);
    conn.query(
      'SELECT IdUsuario FROM Usuario WHERE codigo_invitacion = ?',
      [codigo],
      (err, rows) => {
        if (err) return res.status(500).json(err);
        if (rows.length > 0) {
          res.json({ success: true, message: 'Código válido' });
        } else {
          res.json({ success: false, message: 'Código no existe' });
        }
      }
    );
  });
});

/**
 * @swagger
 * /aceptarRegistro:
 *   get:
 *     summary: Obtener solicitudes de registro
 *     description: Obtiene todas las solicitudes de registro. Si se provee un 'id' en la query, retorna solo esa solicitud.
 *     tags:
 *       - Registro
 *     parameters:
 *       - in: query
 *         name: id
 *         required: false
 *         description: El ID de una solicitud de registro específica (opcional).
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de solicitudes de registro.
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
 *                       IdSolicitud:
 *                         type: integer
 *                       Nombre:
 *                         type: string
 *                       Email:
 *                         type: string
 *       500:
 *         description: Error interno del servidor o de la base de datos.
 */
router.get('/', function (req, res, next) {
  const id = req.query.id === undefined ? null : req.query.id;
  req.getConnection((err, conn) => {
    if (err) return res.send(err);
    conn.query(
      `SELECT * FROM solicitudesregistro WHERE IdSolicitud = COALESCE(${id}, solicitudesregistro.IdSolicitud)`,
      (err, rows) => {
        err ? res.json(err) : res.json({ rows });

      });
  });
});

module.exports = router;
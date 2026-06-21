var express = require('express');
var router = express.Router();

/**
 * @swagger
 * /historialOferta:
 *   get:
 *     summary: Obtener historial de auditoría de ofertas
 *     description: Obtiene el log completo de auditoría de las ofertas (desde la tabla `ofertaauditlog`).
 *     tags:
 *       - Auditoría
 *     responses:
 *       '200':
 *         description: Historial de auditoría obtenido con éxito.
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
 *                       IdLog:
 *                         type: integer
 *                       IdOferta:
 *                         type: integer
 *                       Accion:
 *                         type: string
 *                       Fecha:
 *                         type: string
 *                         format: date-time
 *       '500':
 *         description: Error interno del servidor.
 */
router.get('/', function(req, res, next) {
  const id = req.query.id === undefined ? null : req.query.id;
  req.getConnection((err, conn) =>{
    if(err) return res.send(err);
    conn.query(
      `SELECT * FROM ofertaauditlog `, 
      (err, rows) => {
        err? res.json(err) :  res.json({rows});
      
    });
  });
});

module.exports = router;
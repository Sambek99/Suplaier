var express = require('express');
var router = express.Router();
var mailer = require('../mailer');

/**
 * @swagger
 * /cambiarOfertaEstado:
 *   patch:
 *     summary: Actualizar el estado de una oferta
 *     description: Modifica el estado (IdEstadosOferta) de una oferta existente usando su IdOferta. También envía un correo de notificación.
 *     tags:
 *       - Ofertas
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               IdOferta:
 *                 type: integer
 *                 description: El ID de la oferta que se va a modificar.
 *                 example: 101
 *               IdEstadosOferta:
 *                 type: integer
 *                 description: El ID del nuevo estado para la oferta (ej. 1=Activa, 2=Cerrada).
 *                 example: 2
 *     responses:
 *       200:
 *         description: Actualización exitosa. Retorna el resultado de la consulta SQL (affectedRows, etc.).
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 affectedRows:
 *                   type: integer
 *                 changedRows:
 *                   type: integer
 *       500:
 *         description: Error interno del servidor o de la base de datos.
 */
//patch para actualizar el ActualProductos de una oferta
router.patch('/', (req, res, next) => {
  const {IdOferta, IdEstadosOferta} = req.body;
  console.log(req.body)
  req.getConnection((err, conn) => {
    if(err) return res.send(err);
    conn.query(
      `UPDATE Oferta ofe
        SET ofe.IdEstadosOferta = COALESCE(${IdEstadosOferta}, ofe.IdEstadosOferta)
        WHERE ofe.IdOferta = COALESCE(${IdOferta}, ofe.IdOferta)`,
      (err, rows) => {
        if(err) console.log(err);
        mailer.enviarCorreo();
        res.json(rows);
      }
    )
  })
});

module.exports = router;
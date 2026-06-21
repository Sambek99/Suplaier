var express = require('express');
const { enviarNotificacionTopic } = require('../firebaseMesagging');
var router = express.Router();

/**
 * @swagger
 * /enviarNotificacionCompra:
 *   get:
 *     summary: Enviar una notificación de compra
 *     description: Obtiene el Comprador y Proveedor de una compra específica (por 'idCompra') y luego dispara una notificación de Firebase.
 *     tags:
 *       - Notificaciones
 *     parameters:
 *       - in: query
 *         name: idCompra
 *         required: true
 *         description: El ID de la compra que dispara la notificación.
 *         schema:
 *           type: integer
 *         example: 15
 *     responses:
 *       '200':
 *         description: Notificación enviada (implícitamente). Retorna los IDs del comprador y proveedor involucrados.
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
 *                       IdComprador:
 *                         type: integer
 *                       IdProveedor:
 *                         type: integer
 *             example:
 *               rows:
 *                 - IdComprador: 4
 *                   IdProveedor: 9
 *       '500':
 *         description: Error interno del servidor.
 */
router.get('/', function(req, res, next) {
  const idCompra = req.query.idCompra === undefined ? null : req.query.idCompra;
  console.log("asdkasdkkdskasdk")
  req.getConnection((err, conn) =>{
    if(err) return res.send(err);
    conn.query(
      `SELECT IdComprador, IdProveedor FROM Compra WHERE IdCompra = COALESCE(${idCompra}, Compra.IdCompra)`, 
      (err, rows) => {
        if(err) res.json(err);
        // escribir desde el back la nueva notificacion
        const idUsersInvolved = rows[0];
        enviarNotificacionTopic({
          data: {
            usuariosId: idUsersInvolved,
            tipoNotificacion: 1,
          },
          token: "cihtSbtdqjnCsteQQZ10bW:APA91bFvDHZI1y5KR48Lus-zOn-SmAf_P2Plq49jtxxhsu60sQUJiaLm0I7PzPDKAdf43RWbsErONjwm7CJN5Gl6ZgZMJggJpJjXM62Mfoa7FRC_sbpT07JBLM0T_8mquEBWFdiiE-d9"
        })
        //mailer.enviarCorreo('kaduran1998@gmail.com', 'tema de prueba', rows[0].Estado.toString());  
        res.json({rows});
    });
  });
});

module.exports = router;
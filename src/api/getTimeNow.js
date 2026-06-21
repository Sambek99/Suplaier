var express = require('express');


var router = express.Router();
const app = express();
const connection = '';

/**
 * @swagger
 * /getTimeNow:
 *   get:
 *     summary: Obtener la hora actual del servidor
 *     description: Retorna la hora y fecha actual directamente desde la base de datos (llamando a la función `getnow()`).
 *     tags:
 *       - Utilidades
 *     responses:
 *       '200':
 *         description: Hora del servidor obtenida con éxito.
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
 *                       getnow():
 *                         type: string
 *                         format: date-time
 *             example:
 *               rows:
 *                 - getnow(): "2025-11-07T13:45:00Z"
 *       '500':
 *         description: Error interno del servidor.
 */
router.get('/', function(req, res, next) {
  req.getConnection((err, conn) =>{
    if(err) return res.send(err);
    conn.query(
      `SELECT getnow()`, 
      (err, rows) => {
        if(err) res.json(err);
        res.json({rows});
    });
  });
});

module.exports = router;
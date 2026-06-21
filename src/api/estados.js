var express = require('express');

var router = express.Router();
const app = express();
const connection = '';

/**
 * @swagger
 * /estados:
 *   get:
 *     summary: Obtener estados de oferta
 *     description: Obtiene una lista de los posibles estados de una oferta (ej. 'Activa', 'Cerrada', 'Pendiente'). Se puede filtrar opcionalmente por 'id' o 'descripcion'.
 *     tags:
 *       - Estados
 *     parameters:
 *       - in: query
 *         name: id
 *         required: false
 *         description: El ID del estado a buscar.
 *         schema:
 *           type: integer
 *         example: 2
 *       - in: query
 *         name: descripcion
 *         required: false
 *         description: La descripción del estado a buscar (ej. 'Activa').
 *         schema:
 *           type: string
 *         example: "Activa"
 *     responses:
 *       '200':
 *         description: Lista de estados de oferta obtenida con éxito.
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
 *                       IdEstadosOferta:
 *                         type: integer
 *                       Descripcion:
 *                         type: string
 *             example:
 *               rows:
 *                 - IdEstadosOferta: 1
 *                   Descripcion: "Activa"
 *                 - IdEstadosOferta: 2
 *                   Descripcion: "Pendiente"
 *                 - IdEstadosOferta: 3
 *                   Descripcion: "Cerrada"
 *       '500':
 *         description: Error interno del servidor.
 */
/* GET users listing. */
router.get('/', function(req, res, next) {
  const id = req.query.id === undefined ? null : req.query.id;
  const descripcion = req.query.descripcion === undefined ? null : req.query.descripcion;
  req.getConnection((err, conn) =>{
    if(err) return res.send(err);
    conn.query(
      `SELECT * FROM EstadosOferta eo WHERE IdEstadosOferta = COALESCE(${id}, eo.IdEstadosOferta)
      AND Descripcion = COALESCE(${descripcion}, eo.Descripcion)`, 
      (err, rows) => {
        if(err) res.json(err);
        res.json({rows});
    });
  });
});

module.exports = router;
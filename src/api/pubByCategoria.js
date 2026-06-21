var express = require('express');


var router = express.Router();
const app = express();
const connection = '';

/**
 * @swagger
 * /pubByCategoria:
 *   get:
 *     summary: Obtener ofertas por categoría de producto
 *     description: Obtiene todas las ofertas que pertenecen a una categoría de producto específica, usando el 'id' de la categoría.
 *     tags:
 *       - Productos
 *     parameters:
 *       - in: query
 *         name: id
 *         required: false
 *         description: El ID de la categoría de producto para filtrar las ofertas. Si se omite, devuelve todas las ofertas.
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Una lista de ofertas (unidas con productos) que pertenecen a la categoría.
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
 *                       IdOferta:
 *                         type: integer
 *                       IdProducto:
 *                         type: integer
 *                       IdCatProducto:
 *                         type: integer
 *                       Name:
 *                         type: string
 *       '500':
 *         description: Error interno del servidor.
 */
router.get('/', function(req, res, next){
  const idCat = req.query.id === undefined ? null : req.query.id;
  req.getConnection((err, conn) => {
    if (err) return res.send(err);
    conn.query(`SELECT * FROM Oferta ofe 
    JOIN Producto pr ON ofe.IdProducto = pr.IdProducto
    AND IdCatProducto = COALESCE(${idCat}, pr.IdCatProducto)`, 
    (err, rows) => {
      if(err) res.json(err);
      res.json({rows});
    })
  })
});

module.exports = router;
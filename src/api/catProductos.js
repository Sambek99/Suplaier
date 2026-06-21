var express = require('express');


var router = express.Router();
const app = express();
const connection = '';

/**
 * @swagger
 * /catProductos:
 *   get:
 *     summary: Obtener categorías de productos
 *     description: Obtiene una lista de categorías de productos. Se puede filtrar opcionalmente por 'id' o 'nombre'.
 *     tags:
 *       - Productos
 *     parameters:
 *       - in: query
 *         name: id
 *         required: false
 *         description: El ID de la categoría de producto a buscar.
 *         schema:
 *           type: integer
 *       - in: query
 *         name: nombre
 *         required: false
 *         description: El nombre de la categoría de producto a buscar.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de categorías de productos obtenida con éxito.
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
 *                       IdCatProducto:
 *                         type: integer
 *                       Nombre:
 *                         type: string
 *                       Descripcion:
 *                         type: string
 *       500:
 *         description: Error interno del servidor.
 */

router.get('/', function(req, res, next) {
  const id = req.query.id === undefined ? null : req.query.id;
  const nombre = req.query.nombre === undefined ? null : req.query.nombre;
  req.getConnection((err, conn) =>{
    if(err) return res.send(err);
    conn.query(
      `SELECT * FROM CatProducto cp WHERE IdCatProducto = COALESCE(${id}, cp.IdCatProducto)
      AND Nombre = COALESCE(${nombre}, cp.Nombre)`, 
      (err, rows) => {
        if(err) res.json(err);
        res.json({rows});
    });
  });
});

module.exports = router;
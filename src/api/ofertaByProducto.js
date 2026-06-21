var express = require('express');
var router = express.Router();

/**
 * @swagger
 * /ofertaByProducto:
 *   get:
 *     summary: Buscar ofertas por nombre de producto
 *     description: |
 *       Obtiene una lista de ofertas que coinciden con un término de búsqueda ('q') en el nombre del producto.
 *       Opcionalmente, se puede filtrar por 'idProveedor'.
 *     tags:
 *       - Ofertas
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         description: El término de búsqueda para el nombre del producto (ej. 'algodon').
 *         schema:
 *           type: string
 *       - in: query
 *         name: idProveedor
 *         required: false
 *         description: El ID del proveedor para filtrar las ofertas (opcional).
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Lista de ofertas que coinciden con la búsqueda.
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
 *                       Name:
 *                         type: string
 *                       Descripcion:
 *                         type: string
 *       '500':
 *         description: Error interno del servidor.
 */
router.get('/', function(req, res, next) {
  const q = req.query.q === undefined ? null : req.query.q;
  const idProveedor = req.query.idProveedor === undefined ? null : req.query.idProveedor;
  req.getConnection((err, conn) =>{
    if(err) return res.send(err);
    conn.query(
      `SELECT * 
      FROM Oferta ofe
      JOIN Producto pr
      WHERE ofe.IdProducto = pr.IdProducto
      AND ofe.IdProveedor = COALESCE(${idProveedor}, ofe.IdProveedor)
      AND pr.Name LIKE "%${q}%"`, 
      (err, rows) => {
        if(err) res.json(err);
        res.json({rows});
    });
  });
});

//%${q}%

module.exports = router;
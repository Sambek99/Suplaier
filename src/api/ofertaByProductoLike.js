var express = require('express');
var router = express.Router();

/**
 * @swagger
 * /ofertaByProductoLike:
 *   get:
 *     summary: Buscar ofertas por nombre de producto (LIKE)
 *     description: |
 *       Obtiene una lista de ofertas que coinciden (usando LIKE) con un término de búsqueda ('nombreProducto') en el nombre del producto.
 *       Opcionalmente, se puede filtrar por 'idProveedor'.
 *     tags:
 *       - Ofertas
 *     parameters:
 *       - in: query
 *         name: nombreProducto
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
 *             example:
 *               rows:
 *                 - IdOferta: 1
 *                   IdProducto: 101
 *                   Name: "Algodón natural"
 *                   Descripcion: "Algodón 100% orgánico, ideal para uso médico."
 *                 - IdOferta: 2
 *                   IdProducto: 102
 *                   Name: "Algodón industrial"
 *                   Descripcion: "Algodón para limpieza y mantenimiento."
 *       '500':
 *         description: Error interno del servidor.
 */
router.get('/', function(req, res, next) {
  const nombreProducto = req.query.nombreProducto === undefined ? null : req.query.nombreProducto;
  console.log(nombreProducto)
  const idProveedor = req.query.idProveedor === undefined ? null : req.query.idProveedor;
  req.getConnection((err, conn) =>{
    if(err) return res.send(err);
    conn.query(
      `SELECT * 
      FROM Oferta ofe
      JOIN Producto pr
      WHERE ofe.IdProducto = pr.IdProducto
      AND ofe.IdProveedor = COALESCE(${idProveedor}, ofe.IdProveedor)
      AND pr.Name LIKE "%${nombreProducto}%"`, 
      (err, rows) => {
        if(err) res.json(err);
        res.json({rows});
    });
  });
});

//%${q}%

module.exports = router;
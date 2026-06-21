var express = require('express');


var router = express.Router();
const app = express();
const connection = '';

/**
 * @swagger
 * /provFavoritos:
 *   get:
 *     summary: Obtener proveedores favoritos
 *     description: |
 *       Obtiene una lista de los proveedores marcados como favoritos por un comprador.
 *       Se puede filtrar por el 'idProvFavorito', 'idComprador', o 'idProveedor'.
 *     tags:
 *       - Proveedores
 *     parameters:
 *       - in: query
 *         name: idProvFavorito
 *         required: false
 *         description: El ID único del registro de favorito.
 *         schema:
 *           type: integer
 *       - in: query
 *         name: idComprador
 *         required: false
 *         description: El ID del comprador para ver sus favoritos.
 *         schema:
 *           type: integer
 *       - in: query
 *         name: idProveedor
 *         required: false
 *         description: El ID del proveedor para ver si es favorito.
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Lista de proveedores favoritos obtenida con éxito.
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
 *                       IdProvFavorito:
 *                         type: integer
 *                       IdUsuarioComp:
 *                         type: integer
 *                       IdUsuarioProv:
 *                         type: integer
 *       '500':
 *         description: Error interno del servidor.
 */
router.get('/', function(req, res, next) {
  const id = req.query.idProvFavorito === undefined ? null : req.query.idProvFavorito;
  const idComprador = req.query.idComprador === undefined ? null : req.query.idComprador;
  const idProveedor = req.query.idProveedor === undefined ? null : req.query.idProveedor;
  req.getConnection((err, conn) =>{
    if(err) return res.send(err);
    conn.query(
      `SELECT * FROM ProvFavorito pf WHERE IdProvFavorito = COALESCE(${id}, pf.IdProvFavorito)
      AND IdUsuarioComp = COALESCE(${idComprador}, pf.IdUsuarioComp)
      AND IdUsuarioProv = COALESCE(${idProveedor}, pf.IdUsuarioProv)`, 
      (err, rows) => {
        if(err) res.json(err);
        res.json({rows});
    });
  });
});

module.exports = router;

//`SELECT * FROM ProvFavorito pf WHERE IdComprador = COALESCE(${idComprador}, pf.IdComprador)
//AND IdProveedor = COALESCE(${idProveedor}, pf.IdProveedor)`
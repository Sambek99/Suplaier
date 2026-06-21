var express = require('express');
var router = express.Router();

/**
 * @swagger
 * /reportes:
 *   get:
 *     summary: Obtener reportes
 *     description: Obtiene una lista de reportes, filtrados opcionalmente por 'id' del reporte o 'idUsuario' que lo creó.
 *     tags:
 *       - Reportes
 *     parameters:
 *       - in: query
 *         name: id
 *         required: false
 *         description: El ID del reporte específico a buscar.
 *         schema:
 *           type: integer
 *       - in: query
 *         name: idUsuario
 *         required: false
 *         description: El ID del usuario para el cual se quieren obtener los reportes.
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Lista de reportes obtenida con éxito.
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
 *                       IdReporte:
 *                         type: integer
 *                       IdUsuario:
 *                         type: integer
 *                       Motivo:
 *                         type: string
 *                       Descripcion:
 *                         type: string
 *       '500':
 *         description: Error interno del servidor.
 */
/* GET users listing. */
router.get('/', function(req, res, next) {
  const id = req.query.id === undefined ? null : req.query.id;
  const idUsuario = req.query.idUsuario === undefined ? null : req.query.idUsuario;
  req.getConnection((err, conn) =>{
    if(err) return res.send(err);
    conn.query(
      `SELECT * FROM Reportes rep WHERE IdReporte = COALESCE(${id}, rep.IdReporte)
      AND IdUsuario = COALESCE(${idUsuario}, rep.IdUsuario)`, 
      (err, rows) => {
        if(err) res.json(err);
        res.json({rows});
    });
  });
});

/**
 * @swagger
 * /reportes:
 *   post:
 *     summary: Crear un nuevo reporte
 *     description: Registra un nuevo reporte (queja) de un usuario sobre una oferta o compra.
 *     tags:
 *       - Reportes
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               IdComprador:
 *                 type: integer
 *                 description: ID del usuario que crea el reporte (etiquetado como 'IdComprador' en el body).
 *                 example: 12
 *               IdOferta:
 *                 type: integer
 *                 description: ID de la oferta reportada (opcional).
 *                 example: 34
 *               IdCompra:
 *                 type: integer
 *                 description: ID de la compra reportada (opcional).
 *                 example: 56
 *               Motivo:
 *                 type: string
 *                 description: La razón o categoría del reporte (ej. 'Estafa', 'Producto defectuoso').
 *                 example: 'Estafa'
 *               Descripcion:
 *                 type: string
 *                 description: Detalles adicionales del reporte.
 *                 example: 'El proveedor no entregó el producto después de 3 días.'
 *     responses:
 *       '201':
 *         description: Reporte creado con éxito.
 *       '500':
 *         description: Error interno del servidor.
 */
router.post('/', (req, res, next) =>{
  const {IdComprador, IdOferta, Motivo, Descripcion, IdCompra} = req.body;
  req.getConnection((err, conn) =>{
    if(err) return res.send(err);
    conn.query(
      `INSERT INTO Reportes(IdUsuario, IdOferta, Motivo, FechaCrea, Descripcion, IdCompra) 
        VALUES (${IdComprador},${IdOferta},"${Motivo}", NOW(), "${Descripcion}", ${IdCompra})`, 
      (err, rows) => {
        if(err) console.log(err);
        res.json(rows);
    });
  });
});


module.exports = router;
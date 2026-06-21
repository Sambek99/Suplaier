var express = require('express');
var router = express.Router();

/**
 * @swagger
 * /demandas:
 *   get:
 *     summary: Obtener demandas
 *     description: |
 *       Obtiene una lista de demandas con filtros opcionales.
 *       - Si se provee 'idsEstadosOferta' (ej. "1,2,3"), filtra por una lista de estados.
 *       - Si no, se puede filtrar por 'id', 'IdComprador' o un 'idEstadosOferta' individual.
 *     tags:
 *       - Demandas
 *     parameters:
 *       - in: query
 *         name: id
 *         required: false
 *         description: El ID de la demanda a buscar.
 *         schema:
 *           type: integer
 *       - in: query
 *         name: IdComprador
 *         required: false
 *         description: El ID del comprador para filtrar demandas.
 *         schema:
 *           type: integer
 *       - in: query
 *         name: idEstadosOferta
 *         required: false
 *         description: Filtrar por un ID de estado individual (ignorado si se usa 'idsEstadosOferta').
 *         schema:
 *           type: integer
 *       - in: query
 *         name: idsEstadosOferta
 *         required: false
 *         description: Filtrar por una lista de IDs de estado (ej. "1,2,3").
 *         schema:
 *           type: string
 *           example: "1,2,3"
 *     responses:
 *       '200':
 *         description: Lista de demandas obtenida con éxito.
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
 *                       IdDemanda:
 *                         type: integer
 *                         example: 12
 *                       IdProducto:
 *                         type: integer
 *                         example: 45
 *                       IdComprador:
 *                         type: integer
 *                         example: 8
 *                       Cantidad:
 *                         type: integer
 *                         example: 100
 *                       Estado:
 *                         type: string
 *                         example: "Activa"
 *             example:
 *               rows:
 *                 - IdDemanda: 12
 *                   IdProducto: 45
 *                   IdComprador: 8
 *                   Cantidad: 100
 *                   Estado: "Activa"
 *                 - IdDemanda: 13
 *                   IdProducto: 46
 *                   IdComprador: 9
 *                   Cantidad: 50
 *                   Estado: "Pendiente"
 *       '500':
 *         description: Error interno del servidor.
 */
router.get('/', function (req, res, next) {
  const { idsEstadosOferta } = req.query;
  if (!idsEstadosOferta || idsEstadosOferta.trim() === '') {
    const id = req.query.id === undefined ? null : req.query.id;
    const IdComprador = req.query.IdComprador === undefined ? null : req.query.IdComprador;
    const idEstadosOferta = req.query.idEstadosOferta === undefined ? null : req.query.idEstadosOferta;
    req.getConnection((err, conn) => {
      if (err) return res.send(err);
      conn.query(
        `SELECT * FROM demanda WHERE IdDemanda = COALESCE(${id}, demanda.IdDemanda)
        AND IdComprador = COALESCE(${IdComprador}, demanda.IdComprador)
        AND IdEstadosOferta = COALESCE(${idEstadosOferta}, demanda.IdEstadosOferta)`,
        (err, rows) => {
          err ? console.log(res.json(err)) : res.json({ rows });;
          //mailer.enviarCorreo('kaduran1998@gmail.com', 'tema de prueba', rows[0].Estado.toString());
          // enviarNotificacionTopic({
          //   title: "Oferta ha cambiado", 
          //   message: "Prueba", 
          //   token: "cihtSbtdqjnCsteQQZ10bW:APA91bFvDHZI1y5KR48Lus-zOn-SmAf_P2Plq49jtxxhsu60sQUJiaLm0I7PzPDKAdf43RWbsErONjwm7CJN5Gl6ZgZMJggJpJjXM62Mfoa7FRC_sbpT07JBLM0T_8mquEBWFdiiE-d9"
          // })
        });
    });
  } else {
    const idsArray = idsEstadosOferta.split(',').map(Number);
    const IdComprador = req.query.IdComprador === undefined ? null : req.query.IdComprador;
    const idEstadosOferta = req.query.idEstadosOferta === undefined ? null : req.query.idEstadosOferta;
    req.getConnection((err, conn) => {
      if (err) return res.send(err);
      conn.query(
        `SELECT * FROM demanda WHERE IdEstadosOferta IN (?) 
        AND IdComprador = COALESCE(${IdComprador}, demanda.IdComprador)
        AND IdEstadosOferta = COALESCE(${idEstadosOferta}, Oferta.IdEstadosOferta)
        `, [idsArray],
        (err, rows) => {
          err ? console.log(res.json(err)) : res.json(rows);;

        });
    });

  }

});

//IdDemanda, IdProducto, IdComprador, IdEstadosOferta, Minimo, Maximo, PrecioMinimo, PrecioMaximo, Descripcion, ActualProductos, FechaLimite, FechaCreacion, FechaModificacion, Estado

/**
 * @swagger
 * /demandas:
 *   post:
 *     summary: Crear una nueva demanda
 *     description: Registra una nueva demanda de un comprador en el sistema.
 *     tags:
 *       - Demandas
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               IdProducto:
 *                 type: integer
 *               IdComprador:
 *                 type: integer
 *               IdEstadosOferta:
 *                 type: integer
 *               Minimo:
 *                 type: integer
 *               Maximo:
 *                 type: integer
 *               PrecioMinimo:
 *                 type: number
 *                 format: double
 *               PrecioMaximo:
 *                 type: number
 *                 format: double
 *               Descripcion:
 *                 type: string
 *               ActualProductos:
 *                 type: integer
 *               FechaLimite:
 *                 type: string
 *                 format: date-time
 *               Estado:
 *                 type: integer
 *           example:
 *             IdProducto: 5
 *             IdComprador: 2
 *             IdEstadosOferta: 1
 *             Minimo: 10
 *             Maximo: 100
 *             PrecioMinimo: 5.50
 *             PrecioMaximo: 7.00
 *             Descripcion: "Demanda de tomates frescos"
 *             ActualProductos: 20
 *             FechaLimite: "2025-12-31T23:59:59Z"
 *             Estado: 1
 *     responses:
 *       '200':
 *         description: Demanda creada con éxito.
 *       '500':
 *         description: Error interno del servidor.
 */
router.post('/', (req, res, next) => {
  const { IdProducto, IdComprador, IdEstadosOferta, Minimo, Maximo, PrecioMinimo, PrecioMaximo, Descripcion, ActualProductos, FechaLimite, Estado } = req.body;
  req.getConnection((err, conn) => {
    if (err) { return res.send(err) };
    conn.query(
      `INSERT INTO Demanda (IdProducto, IdComprador, IdEstadosOferta, Minimo, Maximo, PrecioMinimo, PrecioMaximo, Descripcion, ActualProductos, FechaLimite, FechaCreacion, FechaModificacion, Estado) 
          VALUES (${IdProducto},${IdComprador},${IdEstadosOferta},${Minimo}, ${Maximo},${PrecioMinimo}, ${PrecioMaximo}, "${Descripcion}", ${ActualProductos}, "${FechaLimite}", NOW(), NOW(), ${Estado})`,
      (err, rows) => {
        err ? console.log(res.json(err)) : res.json(rows);;

      });
  });
});

/**
 * @swagger
 * /demandas:
 *   patch:
 *     summary: Actualizar la cantidad actual de una demanda
 *     description: Modifica el campo 'ActualProductos' de una demanda específica.
 *     tags:
 *       - Demandas
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               IdDemanda:
 *                 type: integer
 *                 description: El ID de la demanda a modificar.
 *               NuevoActualProductos:
 *                 type: integer
 *                 description: El nuevo valor para el campo 'ActualProductos'.
 *           example:
 *             IdDemanda: 3
 *             NuevoActualProductos: 45
 *     responses:
 *       '200':
 *         description: Actualización exitosa.
 *       '500':
 *         description: Error interno del servidor.
 */
router.patch('/', (req, res, next) => {
  const { IdDemanda, NuevoActualProductos } = req.body;
  req.getConnection((err, conn) => {
    if (err) return res.send(err);
    conn.query(
      `UPDATE demanda
        SET ofe.ActualProductos = COALESCE(${NuevoActualProductos}, ofe.ActualProductos)
        WHERE ofe.IdDemanda = COALESCE(${IdDemanda}, ofe.IdDemanda)`,
      (err, rows) => {
        err ? console.log(res.json(err)) : res.json(rows);;

      }
    )
  })
});

/**
 * @swagger
 * /demandas/estadoOferta:
 *   patch:
 *     summary: Actualizar el estado de una demanda
 *     description: Modifica el campo 'IdEstadosOferta' de una demanda específica.
 *     tags:
 *       - Demandas
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               IdDemanda:
 *                 type: integer
 *                 description: El ID de la demanda a modificar.
 *               IdEstadosOferta:
 *                 type: integer
 *                 description: El nuevo ID de estado para la demanda.
 *           example:
 *             IdDemanda: 7
 *             IdEstadosOferta: 3
 *     responses:
 *       '200':
 *         description: Actualización exitosa.
 *       '500':
 *         description: Error interno del servidor.
 */
router.patch('/estadoOferta', (req, res, next) => {
  const { IdDemanda, IdEstadosOferta } = req.body;
  req.getConnection((err, conn) => {
    if (err) return res.send(err);
    conn.query(
      `UPDATE demanda
        SET IdEstadosOferta = '${IdEstadosOferta}'
        WHERE demanda =${IdDemanda}`,
      (err, rows) => {
        err ? console.log(err) : res.json(rows);
      }
    )
  })
});

module.exports = router;

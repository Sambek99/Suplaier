var express = require('express');
const { enviarNotificacionTopic } = require('../firebaseMesagging');
var router = express.Router();
var mailer = require('../mailer');

/**
 * @swagger
 * /ofertas:
 *   get:
 *     summary: Obtener ofertas
 *     description: |
 *       Obtiene una lista de ofertas con filtros.
 *       - Si se provee 'idsEstadosOferta' (ej. "1,2,3"), filtra por una lista de estados.
 *       - Si no, se puede filtrar por 'id', 'idProveedor' o un 'idEstadosOferta' individual.
 *     tags:
 *       - Ofertas
 *     parameters:
 *       - in: query
 *         name: id
 *         required: false
 *         description: El ID de la oferta a buscar.
 *         schema:
 *           type: integer
 *       - in: query
 *         name: idProveedor
 *         required: false
 *         description: El ID del proveedor para filtrar ofertas.
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
 *     responses:
 *       '200':
 *         description: Lista de ofertas obtenida con éxito.
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
 *                       IdProveedor:
 *                         type: integer
 *             example:
 *               rows:
 *                 - IdOferta: 10
 *                   IdProducto: 200
 *                   IdProveedor: 15
 *                 - IdOferta: 11
 *                   IdProducto: 201
 *                   IdProveedor: 15
 *       '500':
 *         description: Error interno del servidor.
 */
/* GET ofertas listing. */
router.get('/', function(req, res, next) {
  const {idsEstadosOferta} = req.query;
  if (!idsEstadosOferta || idsEstadosOferta.trim() === '') {
  const id = req.query.id === undefined ? null : req.query.id;
  const idProveedor = req.query.idProveedor === undefined ? null : req.query.idProveedor;
  const idEstadosOferta = req.query.idEstadosOferta === undefined ? null : req.query.idEstadosOferta;
  req.getConnection((err, conn) =>{
    if(err) return res.send(err);
    conn.query(
      `SELECT * FROM Oferta WHERE IdOferta = COALESCE(${id}, Oferta.IdOferta)
      AND IdProveedor = COALESCE(${idProveedor}, Oferta.IdProveedor)
      AND IdEstadosOferta = COALESCE(${idEstadosOferta}, Oferta.IdEstadosOferta)`, 
      (err, rows) => {
        if(err) res.json(err);
        //mailer.enviarCorreo('kaduran1998@gmail.com', 'tema de prueba', rows[0].Estado.toString());
        // enviarNotificacionTopic({
        //   title: "Oferta ha cambiado", 
        //   message: "Prueba", 
        //   token: "cihtSbtdqjnCsteQQZ10bW:APA91bFvDHZI1y5KR48Lus-zOn-SmAf_P2Plq49jtxxhsu60sQUJiaLm0I7PzPDKAdf43RWbsErONjwm7CJN5Gl6ZgZMJggJpJjXM62Mfoa7FRC_sbpT07JBLM0T_8mquEBWFdiiE-d9"
        // })
  
        res.json({rows});
    });
  });
}else{
  const idsArray = idsEstadosOferta.split(',').map(Number);
  const idProveedor = req.query.idProveedor === undefined ? null : req.query.idProveedor;
  const idEstadosOferta = req.query.idEstadosOferta === undefined ? null : req.query.idEstadosOferta; 
  req.getConnection((err, conn) =>{
    if(err) return res.send(err);
    conn.query(
      `SELECT * FROM oferta WHERE IdEstadosOferta IN (?) 
      AND IdProveedor = COALESCE(${idProveedor}, Oferta.IdProveedor)
      AND IdEstadosOferta = COALESCE(${idEstadosOferta}, Oferta.IdEstadosOferta)
      `, [idsArray], 
      (err, rows) => {
        if(err) res.json(err);
        res.json({rows});
    });
  });

}

});

/**
 * @swagger
 * /ofertas/orderFechaMayor:
 *   get:
 *     summary: Obtener ofertas (ordenadas por fecha desc)
 *     description: Obtiene una lista de ofertas, con los mismos filtros que el GET /ofertas, pero ordenadas por FechaLimite de forma descendente (más nuevas primero).
 *     tags:
 *       - Ofertas
 *     parameters:
 *       - in: query
 *         name: id
 *         required: false
 *         schema:
 *           type: integer
 *       - in: query
 *         name: idProveedor
 *         required: false
 *         schema:
 *           type: integer
 *       - in: query
 *         name: idEstadosOferta
 *         required: false
 *         schema:
 *           type: integer
 *       - in: query
 *         name: idsEstadosOferta
 *         required: false
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Lista de ofertas ordenada.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OfertasResponse'
 *             example:
 *               rows:
 *                 - IdOferta: 21
 *                   IdProducto: 301
 *                   IdProveedor: 8
 *                   FechaLimite: "2025-11-30T00:00:00Z"
 *                 - IdOferta: 20
 *                   IdProducto: 299
 *                   IdProveedor: 8
 *                   FechaLimite: "2025-11-15T00:00:00Z"
 *       '500':
 *         description: Error interno del servidor.
 */
router.get('/orderFechaMayor', function(req, res, next) {
  const {idsEstadosOferta} = req.query;
  if (!idsEstadosOferta || idsEstadosOferta.trim() === '') {
  const id = req.query.id === undefined ? null : req.query.id;
  const idProveedor = req.query.idProveedor === undefined ? null : req.query.idProveedor;
  const idEstadosOferta = req.query.idEstadosOferta === undefined ? null : req.query.idEstadosOferta;
  req.getConnection((err, conn) =>{
    if(err) return res.send(err);
    conn.query(
      `SELECT * FROM Oferta WHERE IdOferta = COALESCE(${id}, Oferta.IdOferta)
      AND IdProveedor = COALESCE(${idProveedor}, Oferta.IdProveedor)
      AND IdEstadosOferta = COALESCE(${idEstadosOferta}, Oferta.IdEstadosOferta)
      ORDER BY FechaLimite DESC`, 
      (err, rows) => {
        if(err) res.json(err);
  
        res.json({rows});
    });
  });
  }else{
    const idsArray = idsEstadosOferta.split(',').map(Number);
    const idProveedor = req.query.idProveedor === undefined ? null : req.query.idProveedor;
    const idEstadosOferta = req.query.idEstadosOferta === undefined ? null : req.query.idEstadosOferta; 
    req.getConnection((err, conn) =>{
      if(err) return res.send(err);
      conn.query(
        `SELECT * FROM oferta WHERE IdEstadosOferta IN (?) 
        AND IdProveedor = COALESCE(${idProveedor}, Oferta.IdProveedor)
        AND IdEstadosOferta = COALESCE(${idEstadosOferta}, Oferta.IdEstadosOferta)
        ORDER BY FechaLimite DESC `, [idsArray], 
        (err, rows) => {
          if(err) res.json(err);
          res.json({rows});
      });
    });

  }

});

/**
 * @swagger
 * /ofertas/orderFechaMenor:
 *   get:
 *     summary: Obtener ofertas (ordenadas por fecha asc)
 *     description: Obtiene una lista de ofertas, con los mismos filtros que el GET /ofertas, pero ordenadas por FechaLimite de forma ascendente (más antiguas primero).
 *     tags:
 *       - Ofertas
 *     parameters:
 *       - in: query
 *         name: id
 *         required: false
 *         schema:
 *           type: integer
 *       - in: query
 *         name: idProveedor
 *         required: false
 *         schema:
 *           type: integer
 *       - in: query
 *         name: idEstadosOferta
 *         required: false
 *         schema:
 *           type: integer
 *       - in: query
 *         name: idsEstadosOferta
 *         required: false
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Lista de ofertas ordenada.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OfertasResponse'
 *             example:
 *               rows:
 *                 - IdOferta: 5
 *                   IdProducto: 102
 *                   IdProveedor: 3
 *                   FechaLimite: "2024-10-15T00:00:00Z"
 *                 - IdOferta: 8
 *                   IdProducto: 205
 *                   IdProveedor: 4
 *                   FechaLimite: "2024-12-01T00:00:00Z"
 *       '500':
 *         description: Error interno del servidor.
 */
router.get('/orderFechaMenor', function(req, res, next) {
  const {idsEstadosOferta} = req.query;
  if (!idsEstadosOferta || idsEstadosOferta.trim() === '') {
  const id = req.query.id === undefined ? null : req.query.id;
  const idProveedor = req.query.idProveedor === undefined ? null : req.query.idProveedor;
  const idEstadosOferta = req.query.idEstadosOferta === undefined ? null : req.query.idEstadosOferta;
  req.getConnection((err, conn) =>{
    if(err) return res.send(err);
    conn.query(
      `SELECT * FROM Oferta WHERE IdOferta = COALESCE(${id}, Oferta.IdOferta)
      AND IdProveedor = COALESCE(${idProveedor}, Oferta.IdProveedor)
      AND IdEstadosOferta = COALESCE(${idEstadosOferta}, Oferta.IdEstadosOferta)
      ORDER BY FechaLimite ASC`, 
      (err, rows) => {
        if(err) res.json(err);
  
        res.json({rows});
    });
  });
  }else{
    const idsArray = idsEstadosOferta.split(',').map(Number);
    const idProveedor = req.query.idProveedor === undefined ? null : req.query.idProveedor;
    const idEstadosOferta = req.query.idEstadosOferta === undefined ? null : req.query.idEstadosOferta; 
    req.getConnection((err, conn) =>{
      if(err) return res.send(err);
      conn.query(
        `SELECT * FROM oferta WHERE IdEstadosOferta IN (?) 
        AND IdProveedor = COALESCE(${idProveedor}, Oferta.IdProveedor)
        AND IdEstadosOferta = COALESCE(${idEstadosOferta}, Oferta.IdEstadosOferta)
        ORDER BY FechaLimite ASC `, [idsArray], 
        (err, rows) => {
          if(err) res.json(err);
          res.json({rows});
      });
    });

  }
});


//IdOferta, IdProducto, IdProveedor, IdEstadosOferta, Minimo, Maximo, Descripcion, ActualProductos, FechaLimite, FechaCreacion, FechaModificacion, Estado, ValorUProducto

/**
 * @swagger
 * /ofertas:
 *   post:
 *     summary: Crear una nueva oferta
 *     description: Registra una nueva oferta de un proveedor en el sistema.
 *     tags:
 *       - Ofertas
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               IdProducto:
 *                 type: integer
 *                 example: 12
 *               IdProveedor:
 *                 type: integer
 *                 example: 3
 *               IdEstadosOferta:
 *                 type: integer
 *                 example: 1
 *               Minimo:
 *                 type: integer
 *                 example: 10
 *               Maximo:
 *                 type: integer
 *                 example: 100
 *               Descripcion:
 *                 type: string
 *                 example: "Oferta especial de algodón premium"
 *               ActualProductos:
 *                 type: integer
 *                 example: 50
 *               FechaLimite:
 *                 type: string
 *                 format: date-time
 *                 example: "2024-12-31T23:59:59Z"
 *               Estado:
 *                 type: integer
 *                 example: 1
 *               ValorUProducto:
 *                 type: number
 *                 format: double
 *                 example: 12.5
 *               ValorUInstantaneo:
 *                 type: number
 *                 format: double
 *                 example: 11.75
 *     responses:
 *       '201':
 *         description: Oferta creada con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Oferta creada correctamente"
 *                 idOferta:
 *                   type: integer
 *                   example: 45
 *       '500':
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Error al registrar la oferta"
 */
router.post("/", (req, res, next) => {
  const {
    IdProducto,
    IdProveedor,
    IdEstadosOferta,
    Minimo,
    Maximo,
    Descripcion,
    ActualProductos,
    FechaLimite,
    Estado,
    ValorUProducto,
    ValorUInstantaneo,
  } = req.body;

  req.getConnection((err, conn) => {
    if (err) return res.send(err);

    conn.query(
      `INSERT INTO Oferta 
      (IdProducto, IdProveedor, IdEstadosOferta, Minimo, Maximo, Descripcion, ActualProductos, FechaLimite, FechaCreacion, FechaModificacion, Estado, ValorUProducto, ValorUInstantaneo) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW(), ?, ?, ?)`,
      [
        IdProducto,
        IdProveedor,
        IdEstadosOferta,
        Minimo,
        Maximo,
        Descripcion,
        ActualProductos,
        FechaLimite,
        Estado,
        ValorUProducto,
        ValorUInstantaneo,
      ],
      (err, rows) => {
        if (err) return res.json(err);

        const idOferta = rows.insertId;

        conn.query(
          `SELECT IdUsuarioComp 
           FROM ProvFavorito 
           WHERE IdUsuarioProv = ?`,
          [IdProveedor],
          (errFav, favoritosRows) => {
            if (errFav) {
              console.log("Error buscando favoritos:", errFav);
              return res.json({ rows, idOferta });
            }

            if (!favoritosRows || favoritosRows.length === 0) {
              return res.json({ rows, idOferta });
            }

            const notificaciones = favoritosRows.map((fav) => [
              fav.IdUsuarioComp,
              idOferta,
              null,
              "Un proveedor que tienes en favoritos publicó una nueva oferta.",
              4,
            ]);

            conn.query(
              `INSERT INTO Notificacion
              (IdUsuario, IdOferta, IdCompra, Descripcion, FechaCrea, IdTipoNotificacion)
              VALUES ?`,
              [notificaciones],
              (errNotificacion) => {
                if (errNotificacion) {
                  console.log(
                    "Error creando notificaciones de oferta:",
                    errNotificacion
                  );
                }

                res.json({ rows, idOferta });
              }
            );
          }
        );
      }
    );
  });
});

/**
 * @swagger
 * /ofertas:
 *   patch:
 *     summary: Actualizar cantidad actual de una oferta
 *     description: Modifica el campo 'ActualProductos' de una oferta específica.
 *     tags:
 *       - Ofertas
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               IdOferta:
 *                 type: integer
 *                 description: El ID de la oferta a modificar.
 *                 example: 45
 *               NuevoActualProductos:
 *                 type: integer
 *                 description: El nuevo valor para el campo 'ActualProductos'.
 *                 example: 75
 *     responses:
 *       '200':
 *         description: Actualización exitosa.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Cantidad actual actualizada correctamente."
 *       '500':
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Error al actualizar la cantidad actual de la oferta."
 */
//patch para actualizar el ActualProductos de una oferta
router.patch('/', (req, res, next) => {
  const {IdOferta, NuevoActualProductos} = req.body;
  req.getConnection((err, conn) => {
    if(err) return res.send(err);
    conn.query(
      `UPDATE Oferta ofe
      SET ofe.ActualProductos = COALESCE(${NuevoActualProductos}, ofe.ActualProductos)
      WHERE ofe.IdOferta = COALESCE(${IdOferta}, ofe.IdOferta)`,
      (err, rows) => {
        if(err) console.log(err);
        res.json(rows);
      }
    )
  })
});

/**
 * @swagger
 * /ofertas/estadoOferta:
 *   patch:
 *     summary: Actualizar estado de una oferta
 *     description: Modifica el campo 'IdEstadosOferta' de una oferta específica.
 *     tags:
 *       - Ofertas
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               IdOferta:
 *                 type: integer
 *                 description: El ID de la oferta a modificar.
 *                 example: 12
 *               IdEstadosOferta:
 *                 type: integer
 *                 description: El nuevo ID de estado para la oferta.
 *                 example: 3
 *     responses:
 *       '200':
 *         description: Actualización exitosa.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Estado de la oferta actualizado correctamente."
 *       '500':
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Error al actualizar el estado de la oferta."
 */
router.patch('/estadoOferta', (req, res, next) => {
  const {IdOferta, IdEstadosOferta} = req.body;
  req.getConnection((err, conn) => {
    if(err) return res.send(err);
    conn.query(
      `UPDATE oferta
      SET IdEstadosOferta = '${IdEstadosOferta}'
      WHERE IdOferta =${IdOferta}`,
      (err, rows) => {
        err ? console.log(err) : res.json(rows);
      }
    )
  })
});

// /**
//  * @swagger
//  * /ofertas/join:
//  *   post:
//  *     summary: Unirse a una oferta
//  *     description: Permite a un comprador unirse a una oferta. Llama al procedimiento almacenado `UnirseOferta`.
//  *     tags:
//  *       - Ofertas
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               IdPublicacion:
//  *                 type: integer
//  *                 description: El ID de la oferta/publicación a la que se une.
//  *                 example: 5
//  *               IdUsuario:
//  *                 type: integer
//  *                 description: El ID del usuario (comprador) que se une.
//  *                 example: 18
//  *               Cantidad:
//  *                 type: integer
//  *                 description: La cantidad de productos que desea comprar.
//  *                 example: 10
//  *     responses:
//  *       '200':
//  *         description: Se unió a la oferta con éxito.
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 success:
//  *                   type: boolean
//  *                   example: true
//  *                 message:
//  *                   type: string
//  *                   example: "El comprador se unió correctamente a la oferta."
//  *       '500':
//  *         description: Error interno del servidor.
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 success:
//  *                   type: boolean
//  *                   example: false
//  *                 message:
//  *                   type: string
//  *                   example: "Error al intentar unirse a la oferta."
//  */
// router.post('/join', (req, res, next) => {
//   const {IdPublicacion, IdUsuario, Cantidad} = req.body;
//   req.getConnection((err, conn) => {
//     if(err) return res.send(err);
//     conn.query(
//       `CALL UnirseOferta ("${IdPublicacion}","${IdUsuario}", ${Cantidad})`, 
//           (err, rows) => {
//             if(err) console.log(err);
//             res.json(rows[0]);
//     });
//   });
// });


module.exports = router;
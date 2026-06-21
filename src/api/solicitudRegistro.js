var express = require('express');
var router = express.Router();

/**
 * @swagger
 * /solicitudRegistro:
 *   get:
 *     summary: Obtener solicitudes de registro pendientes
 *     description: Obtiene todas las solicitudes de registro que tienen estado 'pendiente'. Se puede filtrar opcionalmente por 'id'.
 *     tags:
 *       - Registro
 *     parameters:
 *       - in: query
 *         name: id
 *         required: false
 *         description: El ID de la solicitud de registro específica a buscar.
 *         schema:
 *           type: integer
 *           example: 15
 *     responses:
 *       '200':
 *         description: Lista de solicitudes pendientes obtenida con éxito.
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
 *                       IdSolicitud:
 *                         type: integer
 *                         example: 15
 *                       IdRol:
 *                         type: integer
 *                         example: 2
 *                       Nombre:
 *                         type: string
 *                         example: "Juan Pérez"
 *                       Email:
 *                         type: string
 *                         example: "juan.perez@example.com"
 *                       Estado:
 *                         type: string
 *                         example: "pendiente"
 *       '500':
 *         description: Error interno del servidor.
 */
router.get('/', function(req, res, next) {
  const id = req.query.id === undefined ? null : req.query.id;
  req.getConnection((err, conn) =>{
    if(err) return res.send(err);
    conn.query(
      `SELECT * FROM solicitudesregistro WHERE IdSolicitud = COALESCE(${id}, solicitudesregistro.IdSolicitud) AND solicitudesregistro.Estado='pendiente'`, 
      (err, rows) => {
        err? res.json(err) :  res.json({rows});
        //mailer.enviarCorreo('kaduran1998@gmail.com', 'tema de prueba', rows[0].Estado.toString());
        // enviarNotificacionTopic({
        //   title: "Oferta ha cambiado", 
        //   message: "Prueba", 
        //   token: "cihtSbtdqjnCsteQQZ10bW:APA91bFvDHZI1y5KR48Lus-zOn-SmAf_P2Plq49jtxxhsu60sQUJiaLm0I7PzPDKAdf43RWbsErONjwm7CJN5Gl6ZgZMJggJpJjXM62Mfoa7FRC_sbpT07JBLM0T_8mquEBWFdiiE-d9"
        // })
  
      
    });
  });
});

/**
 * @swagger
 * /solicitudRegistro:
 *   post:
 *     summary: Enviar una nueva solicitud de registro
 *     description: Un nuevo usuario (comprador o proveedor) envía sus datos para ser aprobados por un administrador.
 *     tags:
 *       - Registro
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               IdRol:
 *                 type: integer
 *                 example: 1
 *               Nombre:
 *                 type: string
 *                 example: "María López"
 *               Identificacion:
 *                 type: string
 *                 example: "0102030405"
 *               Usuario:
 *                 type: string
 *                 example: "maria123"
 *               Contrasena:
 *                 type: string
 *                 format: password
 *                 example: "passSegura123"
 *               Provincia:
 *                 type: string
 *                 example: "Pichincha"
 *               Email:
 *                 type: string
 *                 format: email
 *                 example: "maria.lopez@example.com"
 *               Numero:
 *                 type: string
 *                 example: "+593987654321"
 *               Pais:
 *                 type: string
 *                 example: "Ecuador"
 *               Ciudad:
 *                 type: string
 *                 example: "Quito"
 *               Direccion:
 *                 type: string
 *                 example: "Av. Amazonas N25-30"
 *               urlImg:
 *                 type: string
 *                 format: uri
 *                 example: "https://example.com/img/maria.jpg"
 *     responses:
 *       '200':
 *         description: Solicitud creada exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "Solicitud creada exitosamente"
 *       '500':
 *         description: Error interno del servidor.
 */
router.post('/',function(req, res){
    const { IdRol, Nombre, Identificacion, Usuario, Contrasena, Provincia, Email, Numero, Pais, Ciudad, Direccion, urlImg } = req.body;
    req.getConnection((err, conn) =>{
      if (err) return res.send(err);
      conn.query(
        `INSERT INTO solicitudesregistro (IdRol, Nombre, Identificacion, Usuario, Provincia, Contrasena, Email, Numero, Pais, Ciudad, Direccion, UrlLogoEmpresa, FechaSolicitud) VALUES 
        (${IdRol}, '${Nombre}', '${Identificacion}', '${Usuario}','${Provincia}' ,'${Contrasena}', '${Email}', '${Numero}', '${Pais}', '${Ciudad}', '${Direccion}', '${urlImg}', NOW() )`,
        (err, rows) => {
          err ? res.json(err):  res.json("Solicitud creada exitosamente");      
        }
      );
    })
});

/**
 * @swagger
 * /solicitudRegistro:
 *   patch:
 *     summary: Aprobar o rechazar una solicitud de registro
 *     description: Actualiza el estado ('Estado') de una solicitud de registro (ej. 'aprobada', 'rechazada').
 *     tags:
 *       - Registro
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               IdSolicitud:
 *                 type: integer
 *                 example: 15
 *               Estado:
 *                 type: string
 *                 example: "aprobada"
 *     responses:
 *       '200':
 *         description: Actualización exitosa.
 *       '500':
 *         description: Error interno del servidor.
 */
router.patch('/', (req, res, next) => {
  const {IdSolicitud, Estado} = req.body;
  req.getConnection((err, conn) => {
    if(err) return res.send(err);
    conn.query(
      `UPDATE solicitudesregistro 
      SET Estado = '${Estado}'
      WHERE IdSolicitud =${IdSolicitud}`,
      (err, rows) => {
        err ? console.log(err) : res.json(rows);
      }
    )
  })
});

/**
 * @swagger
 * /solicitudRegistro/{IdUser}:
 *   delete:
 *     summary: Eliminar una solicitud de registro
 *     description: Elimina permanentemente una solicitud de registro (ej. una solicitud de spam).
 *     tags:
 *       - Registro
 *     parameters:
 *       - in: path
 *         name: IdUser
 *         required: true
 *         description: El ID de la solicitud de registro a eliminar.
 *         schema:
 *           type: integer
 *     responses:
 *       '204':
 *         description: Solicitud eliminada con éxito (No Content).
 *       '500':
 *         description: Error interno del servidor.
 */
router.delete('/:IdUser', function (req, res) {
  const IdUser = req.params.IdUser;
  req.getConnection((err, conn) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Internal server error' });
    }
    conn.query(
      `DELETE FROM solicitudesregistro WHERE IdSolicitud = ${IdUser};`,
      (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: 'Failed to delete user' });
        }
       
      }
    );
  });
});

module.exports = router;
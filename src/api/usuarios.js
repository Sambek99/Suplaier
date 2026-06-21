var express = require('express');
var router = express.Router();

/**
 * @swagger
 * /usuarios:
 *   get:
 *     summary: Obtener usuarios
 *     description: Obtiene una lista de todos los usuarios. Se puede filtrar opcionalmente por 'idUsuario' o 'nombre'.
 *     tags:
 *       - Usuarios
 *     parameters:
 *       - in: query
 *         name: idUsuario
 *         required: false
 *         description: El ID del usuario a buscar.
 *         schema:
 *           type: integer
 *       - in: query
 *         name: nombre
 *         required: false
 *         description: El nombre del usuario a buscar.
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Lista de usuarios obtenida con éxito.
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
 *                       IdUsuario:
 *                         type: integer
 *                       IdRol:
 *                         type: integer
 *                       Nombre:
 *                         type: string
 *                       Email:
 *                         type: string
 *                       codigo_invitacion:
 *                         type: string
 *       '500':
 *         description: Error interno del servidor.
 */
/* GET users listing. */
router.get('/', function(req, res, next) {
    const id = req.query.idUsuario === undefined ? null : req.query.idUsuario;
    const nombre = req.query.nombre === undefined ? null : req.query.nombre;
    req.getConnection((err, conn) =>{
      if(err) return res.send(err);
      conn.query(
        `SELECT * FROM Usuario u 
        WHERE IdUsuario = COALESCE(${id}, u.IdUsuario) 
        AND Nombre = COALESCE(${nombre}, u.Nombre)`, 
        (err, rows) => {
          if(err) res.json(err);
          res.json({rows});
      });
    });
  });

/**
 * @swagger
 * /usuarios:
 *   post:
 *     summary: Crear un nuevo usuario (desde solicitud aprobada)
 *     description: |
 *       Registra un nuevo usuario en la tabla 'Usuario' (usualmente después de ser aprobado).
 *       1. Genera un 'codigoGenerado' único para este nuevo usuario.
 *       2. Si se provee un 'CodigoInvitacion', valida ese código y registra quién lo invitó ('invitado_por_id').
 *       3. Si no se provee, 'invitado_por_id' es null.
 *     tags:
 *       - Usuarios
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               IdRol:
 *                 type: integer
 *               Nombre:
 *                 type: string
 *               Identificacion:
 *                 type: string
 *               Usuario:
 *                 type: string
 *               Contrasena:
 *                 type: string
 *                 format: password
 *               Provincia:
 *                 type: string
 *               Email:
 *                 type: string
 *                 format: email
 *               Numero:
 *                 type: string
 *               Pais:
 *                 type: string
 *               Ciudad:
 *                 type: string
 *               Direccion:
 *                 type: string
 *               UrlLogoEmpresa:
 *                 type: string
 *                 format: uri
 *               CodigoInvitacion:
 *                 type: string
 *                 description: Opcional. El código de invitación de la persona que lo refirió.
 *     responses:
 *       '201':
 *         description: Usuario registrado exitosamente.
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
 *                   example: "Usuario registrado exitosamente"
 *                 userId:
 *                   type: integer
 *       '400':
 *         description: Código de invitación inválido.
 *       '409':
 *         description: El usuario ya existe (Conflicto por email o usuario duplicado).
 *       '500':
 *         description: Error interno del servidor.
 */
/* Post para crear un nuevo usuario en la bd */
router.post('/', function(req, res){
  const { 
    IdRol, Nombre, Identificacion, Usuario, Contrasena, Provincia, Email, Numero, Pais, Ciudad, Direccion, UrlLogoEmpresa, 
    CodigoInvitacion
  } = req.body;

  // 1. OBTENCIÓN DE DATOS NECESARIOS PARA EL CÓDIGO
  const nombreCompleto = Nombre || ''; // Usamos 'Nombre' del body
  const partesNombre = nombreCompleto.trim().split(/\s+/);
  const primerNombre = partesNombre[0] || '';
  const apellido = partesNombre.length > 1 ? partesNombre[partesNombre.length - 1] : '';

  // 2. GENERACIÓN DE LA FECHA Y FORMATO (DÍA/MES/AÑO)
  const ahora = new Date();
  const dia = ahora.getDate();
  // Se suma 1 a getMonth() porque devuelve un valor de 0 (enero) a 11 (diciembre)
  const mes = ahora.getMonth() + 1; 
  const anio = ahora.getFullYear();

  // 3. CREACIÓN DEL CÓDIGO DE INVITACIÓN BASADO EN LA LÓGICA
  const codigoGenerado = `${primerNombre.charAt(0).toLowerCase()}${apellido.toLowerCase()}-${dia}${mes}${anio}${Identificacion}`;

  let invitado_por_id = null;
  req.getConnection((err, conn) =>{
    if (err) return res.status(500).json(err);

    const registrarUsuario = (codigo_invitacion_nuevo) => {
      const sql = `INSERT INTO Usuario 
                     (IdRol, Nombre, Identificacion, Usuario, Provincia, Contrasena, Email, Numero, Pais, Ciudad, Direccion, UrlLogoEmpresa, invitado_por_id,codigo_invitacion) 
                   VALUES 
                     (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
      const values = [
        IdRol, Nombre, Identificacion, Usuario, Provincia, Contrasena, Email, Numero, Pais, Ciudad, Direccion, UrlLogoEmpresa, 
        invitado_por_id, codigo_invitacion_nuevo];
      conn.query(sql, values, (err, result) => {
         if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
              return res.status(409).json({ success: false, message: 'El usuario ya existe.' });
            }
            return res.status(500).json(err);
        }
        res.status(201).json({ success: true, message: 'Usuario registrado exitosamente', userId: result.insertId });
      });
    };
    if (CodigoInvitacion) {
      conn.query(
        'SELECT IdUsuario FROM Usuario WHERE codigo_invitacion = ?',
        [CodigoInvitacion],
        (err, rows) => {
          if (err) return res.status(500).json(err);
          if (rows.length > 0) {
            invitado_por_id = rows[0].IdUsuario;
            registrarUsuario(codigoGenerado);
          } else {
            return res.status(400).json({ success: false, message: 'Código de invitación inválido' });
          }
        }
      );
    } else {
      registrarUsuario(codigoGenerado); 
    }
  })
});

module.exports = router;
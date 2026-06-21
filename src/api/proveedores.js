var express = require('express');


var router = express.Router();
const app = express();
const connection = '';

/**
 * @swagger
 * /proveedores:
 *   get:
 *     summary: Obtener proveedores
 *     description: Obtiene una lista de proveedores. Se puede filtrar opcionalmente por 'id' o 'nombre'.
 *     tags:
 *       - Proveedores
 *     parameters:
 *       - in: query
 *         name: id
 *         required: false
 *         description: El ID del proveedor a buscar.
 *         schema:
 *           type: integer
 *       - in: query
 *         name: nombre
 *         required: false
 *         description: El nombre del proveedor a buscar.
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Lista de proveedores obtenida con éxito.
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
 *                       IdProveedor:
 *                         type: integer
 *                         example: 1
 *                       Nombre:
 *                         type: string
 *                         example: "Proveedor ABC"
 *                       Email:
 *                         type: string
 *                         example: "proveedor@correo.com"
 *       '500':
 *         description: Error interno del servidor.
 */
/* GET users listing. */
router.get('/', function(req, res, next) {
  const id = req.query.id === undefined ? null : req.query.id;
  const nombre = req.query.nombre === undefined ? null : req.query.nombre;
  req.getConnection((err, conn) =>{
    if(err) return res.send(err);
    conn.query(
      `SELECT * FROM Proveedor p WHERE IdProveedor = COALESCE(${id}, p.IdProveedor)
      AND Nombre = COALESCE(${nombre}, p.Nombre)`, 
      (err, rows) => {
        if(err) res.json(err);
        res.json({rows});
    });
  });
});

/**
 * @swagger
 * /proveedores:
 *   post:
 *     summary: Crear un nuevo proveedor (Incompleto)
 *     description: (Endpoint incompleto) La lógica de inserción no está implementada.
 *     tags:
 *       - Proveedores
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Nombre:
 *                 type: string
 *                 example: "Proveedor Ejemplo"
 *               Email:
 *                 type: string
 *                 example: "correo@proveedor.com"
 *               Usuario:
 *                 type: string
 *                 example: "usuario123"
 *     responses:
 *       '501':
 *         description: No implementado.
 */
router.post('/', function(req, res){
    const { title, director, year, rating } = req.body;
    let query = `INSERT INTO Proveedor VALUES ${req.res}`;
});

/**
 * @swagger
 * /proveedores/auth:
 *   post:
 *     summary: Autenticar un proveedor
 *     description: Inicia sesión para un usuario de tipo Proveedor. Llama al procedimiento almacenado `AutenticarProveedor`.
 *     tags:
 *       - Proveedores
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               usuario:
 *                 type: string
 *                 example: 'proveedor_test'
 *               pass:
 *                 type: string
 *                 format: password
 *                 example: 'pass1234'
 *     responses:
 *       '200':
 *         description: Autenticación exitosa. Retorna el objeto del proveedor.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   IdUsuario:
 *                     type: integer
 *                   Nombre:
 *                     type: string
 *       '500':
 *         description: Error interno del servidor.
 */
router.post('/auth', (req, res) => {
    const {usuario, pass} = req.body;
    req.getConnection((err, conn) =>{
        if(err) return res.send(err);
        conn.query(
          `CALL AutenticarProveedor(${usuario}, ${pass})`, 
          (err, rows) => {
            if(err) console.log(err);
            res.json(rows);
        });
    });
});

/**
 * @swagger
 * /proveedores/{id}:
 *   put:
 *     summary: Actualizar un proveedor (Incompleto)
 *     description: (Endpoint incompleto) Actualiza el nombre de un proveedor. La lógica de actualización no está implementada.
 *     tags:
 *       - Proveedores
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: El ID del proveedor a actualizar.
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: 'Nuevo Nombre Proveedor'
 *               precio:
 *                 type: number
 *     responses:
 *       '501':
 *         description: No implementado.
 */
router.put('/:id', function(req, res){
    const { id } = req.params;
    const { nombre, precio } = req.body;
    let sql = `UPDATE Proveedor SET nombre = ${nombre} WHERE ProductoId = ${id}`;

});

/**
 * @swagger
 * /proveedores:
 *   delete:
 *     summary: Eliminar un proveedor (Vacío)
 *     description: (Endpoint vacío / No implementado)
 *     tags:
 *       - Proveedores
 *     responses:
 *       '501':
 *         description: No implementado.
 */
router.delete('', function(req,res){
});

module.exports = router;
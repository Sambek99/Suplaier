var express = require('express');


var router = express.Router();
const app = express();
const connection = '';

/**
 * @swagger
 * /compradores:
 *   get:
 *     summary: Obtener compradores
 *     description: Obtiene una lista de compradores. Se puede filtrar opcionalmente por 'idComprador' o 'nombre'.
 *     tags:
 *       - Compradores
 *     parameters:
 *       - in: query
 *         name: idComprador
 *         required: false
 *         description: El ID del comprador a buscar.
 *         schema:
 *           type: integer
 *       - in: query
 *         name: nombre
 *         required: false
 *         description: El nombre del comprador a buscar.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de compradores obtenida con éxito.
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
 *                       IdComprador:
 *                         type: integer
 *                       Nombre:
 *                         type: string
 *                       Email:
 *                         type: string
 *       500:
 *         description: Error interno del servidor.
 */
/* GET users listing. */
router.get('/', function (req, res, next) {
  const id = req.query.idComprador === undefined ? null : req.query.idComprador;
  const nombre = req.query.nombre === undefined ? null : req.query.nombre;
  req.getConnection((err, conn) => {
    if (err) return res.send(err);
    conn.query(
      `SELECT * FROM Comprador c WHERE IdComprador = COALESCE(${id}, c.IdComprador) AND Nombre = COALESCE(${nombre}, c.Nombre)`,
      (err, rows) => {
        if (err) res.json(err);
        res.json({ rows });
      });
  });
});

/**
 * @swagger
 * /compradores:
 *   post:
 *     summary: Crear un nuevo comprador (Incompleto)
 *     description: (Endpoint incompleto) Crea un nuevo comprador. La lógica de inserción no está implementada.
 *     tags:
 *       - Compradores
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Nombre:
 *                 type: string
 *               Email:
 *                 type: string
 *               Usuario:
 *                 type: string
 *     responses:
 *       501:
 *         description: No implementado.
 */
router.post('/', function (req, res) {
  const { title, director, year, rating } = req.body;
  let query = `INSERT INTO Comprador VALUES ${req.body}`;
});

/**
 * @swagger
 * /compradores/auth:
 *   post:
 *     summary: Autenticar un comprador
 *     description: Inicia sesión para un usuario de tipo Comprador. Llama al procedimiento almacenado `AutenticarComprador`.
 *     tags:
 *       - Compradores
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               usuario:
 *                 type: string
 *                 example: 'comprador_test'
 *               pass:
 *                 type: string
 *                 format: password
 *                 example: 'pass1234'
 *     responses:
 *       200:
 *         description: Autenticación exitosa. Retorna el objeto del comprador.
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
 *       500:
 *         description: Error interno del servidor.
 */
router.post('/auth', (req, res) => {
  const { usuario, pass } = req.body;
  req.getConnection((err, conn) => {
    if (err) return res.send(err);
    conn.query(
      `CALL AutenticarComprador ("${usuario}","${pass}")`,
      (err, rows) => {
        if (err) console.log(err);
        res.json(rows[0]);
      });
  });
});

/**
 * @swagger
 * /compradores/{id}:
 *   put:
 *     summary: Actualizar un comprador (Incompleto)
 *     description: (Endpoint incompleto) Actualiza el nombre de un comprador existente.
 *     tags:
 *       - Compradores
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: El ID del comprador a actualizar.
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
 *                 example: 'Nuevo Nombre Comprador'
 *     responses:
 *       '501':
 *         description: No implementado.
 */
router.put('/:id', function (req, res) {
  const { id } = req.params;
  const { nombre } = req.body;
  let sql = `UPDATE Comprador SET nombre = ${nombre} WHERE ProductoId = ${id}`;

});

/**
 * @swagger
 * /compradores:
 *   delete:
 *     summary: Eliminar un comprador (Incompleto)
 *     description: (Endpoint vacío / No implementado)
 *     tags:
 *       - Compradores
 *     responses:
 *       '501':
 *         description: No implementado.
 */
router.delete('', function (req, res) {
});

module.exports = router;
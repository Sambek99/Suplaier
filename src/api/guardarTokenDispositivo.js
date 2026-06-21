const express = require('express');
const router = express.Router();

/**
 * @swagger
 * /guardarTokenDispositivo:
 *   post:
 *     summary: Guardar token de dispositivo
 *     description: Guarda un token de dispositivo (para notificaciones push de Firebase) asociado a un usuario.
 *     tags:
 *       - Notificaciones
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               idUsuario:
 *                 type: integer
 *                 description: ID del usuario al que pertenece el token.
 *                 example: 12
 *               token:
 *                 type: string
 *                 description: El token de registro de Firebase (FCM token).
 *                 example: "cE_...-d9"
 *               tipoDispositivo:
 *                 type: string
 *                 description: El tipo de dispositivo (ej. 'web', 'android', 'ios').
 *                 example: "web"
 *     responses:
 *       '201':
 *         description: Token guardado con éxito.
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
 *                   example: "Token de dispositivo guardado con éxito"
 *       '500':
 *         description: Error interno del servidor al guardar el token.
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
 *                   example: "Error al guardar el token de dispositivo"
 */
router.post('/', async (req, res) => {
    try {
        const { idUsuario, token, tipoDispositivo } = req.body;

        const query = 'INSERT INTO TokenDispositivo (IdUsuario, Token, TipoDispositivo) VALUES (?, ?, ?)';
        await db.query(query, [idUsuario, token, tipoDispositivo]);

        res.json({
            success: true,
            message: 'Token de dispositivo guardado con éxito'
        });
    } catch (error) {
        console.error('Error al guardar el token de dispositivo:', error);
        res.status(500).send({
            success: false,
            message: 'Error al guardar el token de dispositivo'
        });
    }
});

module.exports = router;

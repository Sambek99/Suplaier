const express = require('express');
const router = express.Router();

/**
 * @swagger
 * /obtenerTokenDispositivo/token-dispositivo/{idUsuario}:
 *   get:
 *     summary: Obtener tokens de dispositivo por usuario
 *     description: Obtiene todos los tokens de dispositivo (FCM tokens) asociados a un ID de usuario específico.
 *     tags:
 *       - Notificaciones
 *     parameters:
 *       - in: path
 *         name: idUsuario
 *         required: true
 *         description: El ID del usuario del cual se quieren obtener los tokens.
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Lista de tokens obtenida con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 tokens:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       Token:
 *                         type: string
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
 *                   example: "Error al obtener tokens de dispositivo"
 */
// Endpoint para obtener los tokens de dispositivo de un usuario específico
router.get('/token-dispositivo/:idUsuario', async (req, res) => {
    try {
        const { idUsuario } = req.params;
        const query = 'SELECT Token FROM TokenDispositivo WHERE IdUsuario = ?';
        const tokens = await db.query(query, [idUsuario]);

        res.json({
            success: true,
            tokens: tokens
        });
    } catch (error) {
        console.error('Error al obtener tokens de dispositivo:', error);
        res.status(500).send({
            success: false,
            message: 'Error al obtener tokens de dispositivo'
        });
    }
});

module.exports = router;

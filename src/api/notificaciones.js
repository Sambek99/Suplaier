var express = require("express");
var router = express.Router();

/* GET notificaciones */
router.get("/", function (req, res) {
  const id = req.query.id || null;
  const idUsuario = req.query.idUsuario || null;
  const soloNoLeidas = req.query.soloNoLeidas || null;

  req.getConnection((err, conn) => {
    if (err) return res.send(err);

    let query = `
      SELECT * 
      FROM Notificacion noti 
      WHERE noti.IdNotificacion = COALESCE(?, noti.IdNotificacion)
      AND noti.IdUsuario = COALESCE(?, noti.IdUsuario)
    `;

    const params = [id, idUsuario];

    if (soloNoLeidas === "1") {
      query += ` AND COALESCE(noti.Leida, 0) = 0 `;
    }

    query += ` ORDER BY noti.FechaCrea DESC`;

    conn.query(query, params, (err, rows) => {
      if (err) return res.json(err);
      res.json({ rows });
    });
  });
});

/* POST notificación manual */
router.post("/", function (req, res) {
  const {
    IdUsuario,
    IdOferta = null,
    IdCompra = null,
    Descripcion,
    IdTipoNotificacion = 1,
  } = req.body;

  req.getConnection((err, conn) => {
    if (err) return res.send(err);

    conn.query(
      `INSERT INTO Notificacion
      (IdUsuario, IdOferta, IdCompra, Descripcion, FechaCrea, IdTipoNotificacion, Leida)
      VALUES (?, ?, ?, ?, NOW(), ?, 0)`,
      [IdUsuario, IdOferta, IdCompra, Descripcion, IdTipoNotificacion],
      (err, rows) => {
        if (err) return res.json(err);
        res.json({ rows });
      }
    );
  });
});

/* Marcar una notificación como leída */
router.put("/:idNotificacion/leida", function (req, res) {
  const { idNotificacion } = req.params;

  req.getConnection((err, conn) => {
    if (err) return res.send(err);

    conn.query(
      `UPDATE Notificacion
       SET Leida = 1
       WHERE IdNotificacion = ?`,
      [idNotificacion],
      (err, rows) => {
        if (err) return res.json(err);
        res.json({ rows });
      }
    );
  });
});

module.exports = router;
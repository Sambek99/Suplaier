USE DbContabilly;

CREATE TABLE IF NOT EXISTS InvitacionCanje (
  Id INT AUTO_INCREMENT PRIMARY KEY,
  IdUsuario INT NOT NULL,
  Codigo VARCHAR(64) NOT NULL,
  Estrellas INT NOT NULL,
  Fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_usuario_codigo (IdUsuario, Codigo),
  INDEX idx_usuario (IdUsuario),
  CONSTRAINT fk_invitacion_canje_usuario
    FOREIGN KEY (IdUsuario) REFERENCES Usuario (IdUsuario)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Añadir columna si no existe
SET @existe := (
  SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME='Usuario' AND COLUMN_NAME='estrellas_acumuladas'
);
SET @sql := IF(@existe=0,
  'ALTER TABLE Usuario ADD COLUMN estrellas_acumuladas INT NOT NULL DEFAULT 0',
  'SELECT "ok"'
);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

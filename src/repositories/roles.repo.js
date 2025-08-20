// src/repositories/roles.repo.js
import { pool } from '../config/db.js';

export const getRolesByUsuario = async (usuarioId) => {
  const [rows] = await pool.query(`
    SELECT r.id, r.nombre
    FROM Usuarios_Roles ur
    JOIN Roles r ON r.id = ur.rol_id
    WHERE ur.usuario_id = ?`,
    [usuarioId]
  );
  return rows; // [{id:1, nombre:'Admin'}, ...]
};

/**
 * Soporte legacy: si Usuario.rol_id aún tiene datos, si no hay filas en Usuarios_Roles
 * se inserta el rol "antiguo" para ese usuario (migración suave).
 */
export const ensureLegacyRoleSynced = async (usuario) => {
  if (usuario.rol_id == null) return;
  // ¿Ya tiene filas en la pivote?
  const [exist] = await pool.query(
    `SELECT 1 FROM Usuarios_Roles WHERE usuario_id=? LIMIT 1`,
    [usuario.id]
  );
  if (exist.length) return;
  // Inserta el rol heredado
  await pool.query(
    `INSERT IGNORE INTO Usuarios_Roles(usuario_id, rol_id) VALUES (?, ?)`,
    [usuario.id, usuario.rol_id]
  );
};

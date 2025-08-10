import { pool } from '../config/db.js';

export async function spLoginUsuario(correo, contrasena) {
  // Usa tu SP de MySQL (texto plano)
  const [resultsets] = await pool.query('CALL sp_login_usuario(?, ?)', [correo, contrasena]);
  // CALL retorna un arreglo de recordsets; el primero está en [0]
  const rows = resultsets?.[0] || [];
  return rows[0] || null;
}

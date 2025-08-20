// src/services/auth.service.js
import { pool } from '../config/db.js';
import { getRolesByUsuario, ensureLegacyRoleSynced } from '../repositories/roles.repo.js';

/**
 * Autenticación básica (para entorno demo/examen).
 * - Busca Usuario por correo y contraseña (texto plano, tal como tienes hoy).
 * - Sincroniza rol legacy si aplica (Usuario.rol_id -> Usuarios_Roles).
 * - Devuelve el usuario con roles como arreglo de IDs (y nombres opcional).
 */
export async function loginBasico({ correo, contrasena }) {
  // 1) Buscar usuario por correo + contraseña
  const [rows] = await pool.query(
    `SELECT id, nombre, apellido, correo, contrasena, rol_id
       FROM Usuario
      WHERE correo=? AND contrasena=?
      LIMIT 1`,
    [correo, contrasena]
  );
  const user = rows[0];

  if (!user) {
    return { ok: false, error: 'Credenciales inválidas' };
  }

  // 2) Migración suave: si aún hay rol_id legacy y no tiene filas en pivote, copia
  try {
    await ensureLegacyRoleSynced(user);
  } catch { /* ignorar errores de sync legacy */ }

  // 3) Traer roles desde la pivote
  const rolesRows = await getRolesByUsuario(user.id);
  const rolesIds = rolesRows.map(r => r.id);           // [1,2,...]
  const rolesNames = rolesRows.map(r => r.nombre);     // ['Admin','Profesor',...]

  // 4) Armar payload para el frontend (sin contraseña)
  const data = {
    id: user.id,
    nombre: user.nombre,
    apellido: user.apellido,
    correo: user.correo,
    roles: rolesIds,
    roles_nombres: rolesNames, // opcional (útil para UI)
  };

  return { ok: true, data };
}

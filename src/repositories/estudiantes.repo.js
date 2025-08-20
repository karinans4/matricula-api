// src/repositories/estudiantes.repo.js
import { pool } from '../config/db.js';

// ==============================
// Listado con info de usuario y plan/carrera
// ==============================
export const list = async () => {
  const [rows] = await pool.query(`
    SELECT e.id, e.nombre, e.apellido, e.carnet, e.correo,
           e.direccion, e.cedula,
           e.usuario_id, u.correo AS usuario_correo,
           e.plan_id,
           CONCAT('Plan ', pe.id, ' - ', IFNULL(c.nombre,'')) AS plan_nombre
    FROM Estudiantes e
    LEFT JOIN Usuario u         ON u.id = e.usuario_id
    LEFT JOIN Planes_Estudio pe ON pe.id = e.plan_id
    LEFT JOIN Carreras c        ON c.id = pe.carrera_id
    ORDER BY e.nombre, e.apellido
  `);
  return rows;
};

// ==============================
// CRUD estudiante
// ==============================
export const create = async ({
  nombre, apellido, carnet, correo, direccion, cedula, usuario_id, plan_id
}) => {
  return (
    await pool.query(
      `
      INSERT INTO Estudiantes(nombre, apellido, carnet, correo, direccion, cedula, usuario_id, plan_id)
      VALUES(?,?,?,?,?,?,?,?)
    `,
      [nombre, apellido || '', carnet, correo, direccion || '', cedula || '', usuario_id, plan_id]
    )
  )[0];
};

export const update = async (id, {
  nombre, apellido, carnet, correo, direccion, cedula, usuario_id, plan_id
}) => {
  return (
    await pool.query(
      `
      UPDATE Estudiantes
         SET nombre=?, apellido=?, carnet=?, correo=?, direccion=?, cedula=?, usuario_id=?, plan_id=?
       WHERE id=?
    `,
      [nombre, apellido || '', carnet, correo, direccion || '', cedula || '', usuario_id, plan_id, id]
    )
  )[0];
};

export const remove = async (id) => {
  return (await pool.query(`DELETE FROM Estudiantes WHERE id=?`, [id]))[0];
};

// ==============================
// Opciones para selects (usuarios/planes)
// ==============================
export const optionsUsuarios = async () => {
  const [rows] = await pool.query(`SELECT id, correo AS label FROM Usuario ORDER BY correo`);
  return rows;
};

export const optionsPlanes = async () => {
  const [rows] = await pool.query(`
    SELECT pe.id, CONCAT('Plan ', pe.id, ' – ', IFNULL(c.nombre,'')) AS label
    FROM Planes_Estudio pe
    LEFT JOIN Carreras c ON c.id = pe.carrera_id
    ORDER BY pe.id DESC
  `);
  return rows;
};

// ==============================
// Validaciones simples
// ==============================
export const existsCarnet = async (carnet, excludeId = null) => {
  let sql = `SELECT COUNT(*) AS c FROM Estudiantes WHERE carnet=?`;
  const params = [carnet];
  if (excludeId) { sql += ` AND id<>?`; params.push(excludeId); }
  const [rows] = await pool.query(sql, params);
  return rows[0].c > 0;
};

export const existsCedula = async (cedula, excludeId = null) => {
  let sql = `SELECT COUNT(*) AS c FROM Estudiantes WHERE cedula=?`;
  const params = [cedula];
  if (excludeId) { sql += ` AND id<>?`; params.push(excludeId); }
  const [rows] = await pool.query(sql, params);
  return rows[0].c > 0;
};

export const existsUsuarioVinculado = async (usuario_id, excludeId = null) => {
  if (!usuario_id) return false;
  let sql = `SELECT COUNT(*) AS c FROM Estudiantes WHERE usuario_id=?`;
  const params = [usuario_id];
  if (excludeId) { sql += ` AND id<>?`; params.push(excludeId); }
  const [rows] = await pool.query(sql, params);
  return rows[0].c > 0;
};

// ==============================
// Soporte para creación de usuario en transacción
// ==============================

/** Devuelve { id } del usuario por correo si existe; si no, null */
export const usuarioByCorreo = async (correo) => {
  const [r] = await pool.query(`SELECT id FROM Usuario WHERE correo=?`, [correo]);
  return r[0] || null;
};

/**
 * Crea un Usuario usando la conexión de una transacción abierta.
 * Por defecto rol_id = 3 (Estudiante). Ajusta si usas otro mapping.
 */
export const createUsuario = async (conn, { nombre, apellido, correo, contrasena, rol_id = 3 }) => {
  const [r] = await conn.query(
    `INSERT INTO Usuario(nombre, apellido, correo, contrasena, rol_id) VALUES(?,?,?,?,?)`,
    [nombre || '', apellido || '', correo, contrasena, rol_id]
  );
  return r.insertId;
};

// ==============================
// NUEVO: obtener estudiante por usuario_id (para matrícula)
// ==============================
export const getByUsuarioId = async (usuario_id) => {
  const [rows] = await pool.query(`
    SELECT e.*, pe.carrera_id
    FROM Estudiantes e
    JOIN Planes_Estudio pe ON pe.id = e.plan_id
    WHERE e.usuario_id = ?
    LIMIT 1
  `, [usuario_id]);
  return rows[0] || null;
};

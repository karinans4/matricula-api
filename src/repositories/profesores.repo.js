// src/repositories/profesores.repo.js
import { pool } from '../config/db.js';

// Listado (incluye direccion y cedula)
export const list = () =>
  pool
    .query(
      `SELECT id, nombre, apellido, correo, direccion, cedula
         FROM Profesores
        ORDER BY nombre, apellido`
    )
    .then(r => r[0]);

// Crear (incluye direccion y cedula)
export const create = ({ nombre, apellido, correo, direccion, cedula }) =>
  pool
    .query(
      `INSERT INTO Profesores(nombre, apellido, correo, direccion, cedula)
       VALUES(?,?,?,?,?)`,
      [nombre, apellido || '', correo || '', direccion || '', cedula || '']
    )
    .then(r => r[0]);

// Actualizar (incluye direccion y cedula)
export const update = (id, { nombre, apellido, correo, direccion, cedula }) =>
  pool
    .query(
      `UPDATE Profesores
          SET nombre=?, apellido=?, correo=?, direccion=?, cedula=?
        WHERE id=?`,
      [nombre, apellido || '', correo || '', direccion || '', cedula || '', id]
    )
    .then(r => r[0]);

// Eliminar
export const remove = (id) =>
  pool.query(`DELETE FROM Profesores WHERE id=?`, [id]).then(r => r[0]);

// --------- Validación opcional: cédula única ---------
export const existsCedula = async (cedula, excludeId = null) => {
  if (!cedula) return false;
  let sql = `SELECT COUNT(*) AS c FROM Profesores WHERE cedula=?`;
  const params = [cedula];
  if (excludeId) { sql += ` AND id<>?`; params.push(excludeId); }
  const [rows] = await pool.query(sql, params);
  return rows[0]?.c > 0;
};

import { pool } from '../config/db.js';

export const list = () =>
  pool.query(`SELECT id, nombre, apellido, correo FROM Profesores ORDER BY nombre, apellido`).then(r=>r[0]);

export const create = ({ nombre, apellido, correo }) =>
  pool.query(`INSERT INTO Profesores(nombre, apellido, correo) VALUES(?,?,?)`, [nombre, apellido, correo]).then(r=>r[0]);

export const update = (id, { nombre, apellido, correo }) =>
  pool.query(`UPDATE Profesores SET nombre=?, apellido=?, correo=? WHERE id=?`, [nombre, apellido, correo, id]).then(r=>r[0]);

export const remove = (id) =>
  pool.query(`DELETE FROM Profesores WHERE id=?`, [id]).then(r=>r[0]);

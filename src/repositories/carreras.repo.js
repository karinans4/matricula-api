import { pool } from '../config/db.js';

export const list = () =>
  pool.query(`SELECT id, nombre, codigo FROM Carreras ORDER BY nombre`).then(r=>r[0]);

export const create = ({ nombre, codigo }) =>
  pool.query(`INSERT INTO Carreras(nombre, codigo) VALUES(?,?)`, [nombre, codigo || null]).then(r=>r[0]);

export const update = (id, { nombre, codigo }) =>
  pool.query(`UPDATE Carreras SET nombre=?, codigo=? WHERE id=?`, [nombre, codigo || null, id]).then(r=>r[0]);

export const remove = (id) =>
  pool.query(`DELETE FROM Carreras WHERE id=?`, [id]).then(r=>r[0]);

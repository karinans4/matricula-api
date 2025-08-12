import { pool } from '../config/db.js';

export const getAllTipos = () =>
  pool.query('SELECT id, descripcion, costo FROM Tipo_Matricula ORDER BY descripcion')
      .then(r => r[0]);

export const createTipo = ({ descripcion, costo }) =>
  pool.query('INSERT INTO Tipo_Matricula(descripcion, costo) VALUES(?,?)', [descripcion, costo])
      .then(r => r[0]);

export const updateTipo = (id, { descripcion, costo }) =>
  pool.query('UPDATE Tipo_Matricula SET descripcion=?, costo=? WHERE id=?', [descripcion, costo, id])
      .then(r => r[0]);

export const deleteTipo = (id) =>
  pool.query('DELETE FROM Tipo_Matricula WHERE id=?', [id])
      .then(r => r[0]);

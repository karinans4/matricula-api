import { pool } from '../config/db.js';

export const getAllPeriodos = () =>
  pool.query('SELECT id, nombre, anio, activo FROM Periodos ORDER BY anio DESC, nombre DESC').then(r=>r[0]);

export const createPeriodo = ({nombre, anio, activo}) =>
  pool.query('INSERT INTO Periodos(nombre, anio, activo) VALUES(?,?,?)',[nombre,anio,activo?1:0]).then(r=>r[0]);

export const updatePeriodo = (id,{nombre, anio, activo}) =>
  pool.query('UPDATE Periodos SET nombre=?, anio=?, activo=? WHERE id=?',[nombre,anio,activo?1:0,id]).then(r=>r[0]);

export const deletePeriodo = (id) =>
  pool.query('DELETE FROM Periodos WHERE id=?',[id]).then(r=>r[0]);

import { pool } from '../config/db.js';

export const list = () =>
  pool.query(`
    SELECT pe.id, pe.version, pe.carrera_id, c.nombre AS carrera
    FROM Planes_Estudio pe
    JOIN Carreras c ON c.id = pe.carrera_id
    ORDER BY pe.id DESC
  `).then(r=>r[0]);

export const create = ({ carrera_id, version }) =>
  pool.query(`INSERT INTO Planes_Estudio(carrera_id, version) VALUES(?,?)`, [carrera_id, version]).then(r=>r[0]);

export const update = (id, { carrera_id, version }) =>
  pool.query(`UPDATE Planes_Estudio SET carrera_id=?, version=? WHERE id=?`, [carrera_id, version, id]).then(r=>r[0]);

export const remove = (id) =>
  pool.query(`DELETE FROM Planes_Estudio WHERE id=?`, [id]).then(r=>r[0]);

// opciones para selects
export const optionsCarreras = () =>
  pool.query(`SELECT id, nombre AS label FROM Carreras ORDER BY nombre`).then(r=>r[0]);

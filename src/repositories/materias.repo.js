import { pool } from '../config/db.js';

/* ===== Listado y CRUD de Materias ===== */

export const list = async () => {
  const [rows] = await pool.query(`
    SELECT m.id, m.nombre, m.creditos, m.codigo, m.plan_id,
           pe.version AS plan_version,
           c.nombre AS carrera
    FROM Materias m
    JOIN Planes_Estudio pe ON pe.id = m.plan_id
    JOIN Carreras c ON c.id = pe.carrera_id
    ORDER BY c.nombre, pe.id DESC, m.codigo
  `);
  return rows;
};

export const create = async ({ nombre, creditos, codigo, plan_id }) => {
  return (await pool.query(
    `INSERT INTO Materias(nombre, creditos, codigo, plan_id) VALUES(?,?,?,?)`,
    [nombre, creditos, codigo, plan_id]
  ))[0];
};

export const update = async (id, { nombre, creditos, codigo, plan_id }) => {
  return (await pool.query(
    `UPDATE Materias SET nombre=?, creditos=?, codigo=?, plan_id=? WHERE id=?`,
    [nombre, creditos, codigo, plan_id, id]
  ))[0];
};

export const remove = async (id) => {
  return (await pool.query(`DELETE FROM Materias WHERE id=?`, [id]))[0];
};

/* ===== Opciones para selects ===== */

export const optionsPlanes = async () => {
  const [rows] = await pool.query(`
    SELECT pe.id, CONCAT('Plan ', pe.id, ' – ', c.nombre, ' (', pe.version, ')') AS label
    FROM Planes_Estudio pe
    JOIN Carreras c ON c.id = pe.carrera_id
    ORDER BY c.nombre, pe.id DESC
  `);
  return rows;
};

export const optionsMateriasByPlan = async (plan_id) => {
  const [rows] = await pool.query(
    `SELECT id, CONCAT(codigo,' - ',nombre) AS label FROM Materias WHERE plan_id=? ORDER BY codigo, nombre`,
    [plan_id]
  );
  return rows;
};

/* ===== Validaciones ===== */

export const existsCodigoInPlan = async (codigo, plan_id, excludeId = null) => {
  let sql = `SELECT COUNT(*) c FROM Materias WHERE codigo=? AND plan_id=?`;
  const params = [codigo, plan_id];
  if (excludeId) { sql += ` AND id<>?`; params.push(excludeId); }
  const [r] = await pool.query(sql, params);
  return r[0].c > 0;
};

/* ===== Requisitos / Correquisitos ===== */

export const listRequisitos = async (materia_id) => {
  const [rows] = await pool.query(`
    SELECT r.id, r.requisito_id AS materia_rel_id, m.codigo, m.nombre
    FROM Requisitos r
    JOIN Materias m ON m.id = r.requisito_id
    WHERE r.materia_id = ?
    ORDER BY m.codigo
  `, [materia_id]);
  return rows;
};

export const listCorrequisitos = async (materia_id) => {
  const [rows] = await pool.query(`
    SELECT r.id, r.correquisito_id AS materia_rel_id, m.codigo, m.nombre
    FROM Correquisitos r
    JOIN Materias m ON m.id = r.correquisito_id
    WHERE r.materia_id = ?
    ORDER BY m.codigo
  `, [materia_id]);
  return rows;
};

export const addRequisito = async ({ materia_id, requisito_id }) => {
  return (await pool.query(
    `INSERT INTO Requisitos(materia_id, requisito_id) VALUES(?,?)`,
    [materia_id, requisito_id]
  ))[0];
};

export const removeRequisito = async (id) => {
  return (await pool.query(`DELETE FROM Requisitos WHERE id=?`, [id]))[0];
};

export const addCorrequisito = async ({ materia_id, correquisito_id }) => {
  return (await pool.query(
    `INSERT INTO Correquisitos(materia_id, correquisito_id) VALUES(?,?)`,
    [materia_id, correquisito_id]
  ))[0];
};

export const removeCorrequisito = async (id) => {
  return (await pool.query(`DELETE FROM Correquisitos WHERE id=?`, [id]))[0];
};

export const existsReq = async (materia_id, requisito_id) => {
  const [r] = await pool.query(
    `SELECT COUNT(*) c FROM Requisitos WHERE materia_id=? AND requisito_id=?`,
    [materia_id, requisito_id]
  );
  return r[0].c > 0;
};

export const existsCo = async (materia_id, correquisito_id) => {
  const [r] = await pool.query(
    `SELECT COUNT(*) c FROM Correquisitos WHERE materia_id=? AND correquisito_id=?`,
    [materia_id, correquisito_id]
  );
  return r[0].c > 0;
};

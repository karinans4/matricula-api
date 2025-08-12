import { pool } from '../config/db.js';

export const list = async () => {
  const [rows] = await pool.query(`
    SELECT mi.id, mi.materia_id, mi.profesor_id, mi.periodo_id,
           mi.cupo_maximo, mi.cupo_actual, mi.horario,
           m.codigo AS materia_codigo, m.nombre AS materia_nombre,
           p.nombre AS profesor_nombre, p.apellido AS profesor_apellido,
           per.nombre AS periodo_nombre, per.year AS periodo_anio
    FROM Materias_Impartidas mi
    JOIN Materias m   ON m.id = mi.materia_id
    JOIN Profesores p ON p.id = mi.profesor_id
    JOIN Periodos per ON per.id = mi.periodo_id
    ORDER BY per.year DESC, per.nombre DESC, m.codigo
  `);
  return rows;
};

export const create = async ({ materia_id, profesor_id, periodo_id, cupo_maximo, horario }) => {
  return (await pool.query(
    `INSERT INTO Materias_Impartidas(materia_id, profesor_id, periodo_id, cupo_maximo, cupo_actual, horario)
     VALUES(?,?,?,?,0,?)`,
    [materia_id, profesor_id, periodo_id, cupo_maximo, horario]
  ))[0];
};

export const update = async (id, { materia_id, profesor_id, periodo_id, cupo_maximo, horario }) => {
  return (await pool.query(
    `UPDATE Materias_Impartidas
       SET materia_id=?, profesor_id=?, periodo_id=?, cupo_maximo=?, horario=?
     WHERE id=?`,
    [materia_id, profesor_id, periodo_id, cupo_maximo, horario, id]
  ))[0];
};

export const remove = async (id) => {
  return (await pool.query(`DELETE FROM Materias_Impartidas WHERE id=?`, [id]))[0];
};

// opciones
export const optionsMaterias = async () => {
  const [rows] = await pool.query(`
    SELECT m.id, CONCAT(m.codigo,' - ', m.nombre,' (Plan ', m.plan_id,')') AS label
    FROM Materias m ORDER BY m.codigo, m.nombre
  `);
  return rows;
};

export const optionsProfesores = async () => {
  const [rows] = await pool.query(`
    SELECT id, CONCAT(nombre,' ',IFNULL(apellido,'')) AS label
    FROM Profesores ORDER BY nombre, apellido
  `);
  return rows;
};

export const optionsPeriodos = async () => {
  const [rows] = await pool.query(`
    SELECT id, CONCAT(nombre,' (',year,')') AS label
    FROM Periodos ORDER BY year DESC, nombre DESC
  `);
  return rows;
};

export const hasCupoActualMayorQueMax = async (id, nuevoMax) => {
  const [r] = await pool.query(`SELECT cupo_actual FROM Materias_Impartidas WHERE id=?`, [id]);
  if (!r.length) return false;
  return Number(r[0].cupo_actual) > Number(nuevoMax);
};

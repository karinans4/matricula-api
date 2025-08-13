import { pool } from '../config/db.js';

/** Ejecuta múltiples sentencias y te da el último SELECT como objeto fila */
const runMultiAndPickLastRow = async (sql, params = []) => {
  const [results] = await pool.query(sql, params);
  // results es un array por cada statement; el ÚLTIMO es el SELECT final
  const last = results[results.length - 1];
  // last es un array de filas; toma la primera
  return (Array.isArray(last) && last[0]) ? last[0] : null;
};

export const crearMatricula = async ({ estudiante_id, periodo_id, tipo_matricula_id }) => {
  const sql = `
    SET @matricula_id := 0; SET @ok := 0; SET @msg := '';
    CALL sp_registrar_matricula(?,?,?, @matricula_id, @ok, @msg);
    SELECT @matricula_id AS matricula_id, @ok AS ok, @msg AS mensaje;
  `;
  const out = await runMultiAndPickLastRow(sql, [estudiante_id, periodo_id, tipo_matricula_id]);
  if (!out) return { ok: 0, mensaje: 'Sin respuesta del procedimiento' };
  return out; // { matricula_id, ok, mensaje }
};

export const agregarDetalle = async ({ matricula_id, materia_impartida_id }) => {
  const sql = `
    SET @ok := 0; SET @msg := '';
    CALL sp_agregar_detalle_matricula(?, ?, @ok, @msg);
    SELECT @ok AS ok, @msg AS mensaje;
  `;
  const out = await runMultiAndPickLastRow(sql, [matricula_id, materia_impartida_id]);
  if (!out) return { ok: 0, mensaje: 'Sin respuesta del procedimiento' };
  return out; // { ok, mensaje }
};

export const listarDetalle = async (matricula_id) => {
  const [rows] = await pool.query(`
    SELECT dm.id AS detalle_id,
           mi.id  AS grupo_id,
           m.codigo, m.nombre, m.creditos,
           p.nombre AS profesor_nombre, COALESCE(p.apellido,'') AS profesor_apellido,
           mi.horario
    FROM Detalle_Matricula dm
    JOIN Materias_Impartidas mi ON mi.id = dm.materia_impartida_id
    JOIN Materias m ON m.id = mi.materia_id
    JOIN Profesores p ON p.id = mi.profesor_id
    WHERE dm.matricula_id = ?
    ORDER BY m.codigo
  `, [matricula_id]);
  return rows;
};

// src/repositories/prof.repo.js
import { pool } from '../config/db.js';

/**
 * Lista los grupos (Materias_Impartidas) de un profesor.
 * Filtro opcional por periodo_id.
 */
export const listGruposDelProfesor = async ({ profesor_id, periodo_id = null }) => {
  const params = [profesor_id];
  let where = 'mi.profesor_id = ?';
  if (periodo_id) { where += ' AND mi.periodo_id = ?'; params.push(periodo_id); }

  const [rows] = await pool.query(
    `
    SELECT
      mi.id AS grupo_id,
      m.codigo,
      m.nombre AS materia,
      mi.horario,
      mi.periodo_id,
      p.nombre AS periodo,
      p.anio
    FROM Materias_Impartidas mi
    JOIN Materias m ON m.id = mi.materia_id
    JOIN Periodos p ON p.id = mi.periodo_id
    WHERE ${where}
    ORDER BY p.anio DESC, p.nombre, m.codigo
    `,
    params
  );
  return rows;
};

/**
 * Lista estudiantes inscritos en un grupo (mi.id),
 * con su nota (si existe) para (estudiante, materia, periodo).
 */
export const listEstudiantesDeGrupo = async (grupo_id) => {
  const [rows] = await pool.query(
    `
    SELECT
      e.id  AS estudiante_id,
      e.nombre,
      COALESCE(e.apellido,'') AS apellido,
      e.correo,
      m.id  AS materia_id,
      p.id  AS periodo_id,
      m.codigo,
      m.nombre AS materia,
      p.nombre AS periodo,
      p.anio,
      n.nota
    FROM Detalle_Matricula dm
    JOIN Matricula ma           ON ma.id = dm.matricula_id
    JOIN Estudiantes e          ON e.id  = ma.estudiante_id
    JOIN Materias_Impartidas mi ON mi.id = dm.materia_impartida_id
    JOIN Materias m             ON m.id  = mi.materia_id
    JOIN Periodos p             ON p.id  = mi.periodo_id
    LEFT JOIN Notas n
      ON n.estudiante_id = e.id
     AND n.materia_id    = m.id
     AND n.periodo_id    = p.id
    WHERE dm.materia_impartida_id = ?
    ORDER BY e.apellido, e.nombre
    `,
    [grupo_id]
  );
  return rows;
};

/**
 * Inserta/actualiza nota. Valida:
 *  - que el profesor sea dueño del grupo,
 *  - que el estudiante esté inscrito en ese grupo.
 */
export const upsertNota = async ({ profesor_id, grupo_id, estudiante_id, nota }) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // 1) Validar propiedad del grupo y obtener materia/periodo
    const [[mi]] = await conn.query(
      `SELECT id, profesor_id, materia_id, periodo_id FROM Materias_Impartidas WHERE id=?`,
      [grupo_id]
    );
    if (!mi) {
      await conn.rollback();
      return { ok: 0, mensaje: 'Grupo no existe' };
    }
    if (Number(mi.profesor_id) !== Number(profesor_id)) {
      await conn.rollback();
      return { ok: 0, mensaje: 'No autorizado para este grupo' };
    }

    // 2) Validar que el estudiante esté inscrito en el grupo
    const [[ins]] = await conn.query(
      `
      SELECT 1
      FROM Detalle_Matricula dm
      JOIN Matricula ma ON ma.id = dm.matricula_id
      WHERE dm.materia_impartida_id=? AND ma.estudiante_id=?
      `,
      [grupo_id, estudiante_id]
    );
    if (!ins) {
      await conn.rollback();
      return { ok: 0, mensaje: 'Estudiante no está inscrito en este grupo' };
    }

    // 3) Upsert en Notas por (estudiante_id, materia_id, periodo_id)
    await conn.query(
      `
      INSERT INTO Notas (estudiante_id, materia_id, periodo_id, nota)
      VALUES (?,?,?,?)
      ON DUPLICATE KEY UPDATE nota = VALUES(nota), fecha_actualizacion = CURRENT_TIMESTAMP
      `,
      [estudiante_id, mi.materia_id, mi.periodo_id, nota]
    );

    await conn.commit();
    return { ok: 1, mensaje: 'Nota guardada' };
  } catch (e) {
    await conn.rollback();
    return { ok: 0, mensaje: e.message };
  } finally {
    conn.release();
  }
};

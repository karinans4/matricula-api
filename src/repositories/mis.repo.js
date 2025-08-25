// src/repositories/mis.repo.js
import { pool } from '../config/db.js';

/**
 * Lista materias de un estudiante cuya matrícula tenga al menos un pago "Pagado".
 * Une la nota con la tabla Notas usando (estudiante_id, materia_id, periodo_id).
 * Filtro opcional: periodo_id.
 */
export const materiasPagadasByEstudiante = async (estudiante_id, { periodo_id } = {}) => {
  const params = [estudiante_id];
  let filtroPeriodo = '';
  if (periodo_id) { filtroPeriodo = ' AND mat.periodo_id = ?'; params.push(Number(periodo_id)); }

  const sql = `
    SELECT
      dm.id           AS detalle_id,
      mat.id          AS matricula_id,
      per.id          AS periodo_id,
      per.nombre      AS periodo,
      per.anio        AS anio,
      mi.id           AS grupo_id,
      mi.horario      AS horario,
      m.codigo        AS codigo,
      m.nombre        AS materia,
      m.creditos      AS creditos,
      p.nombre        AS profesor_nombre,
      COALESCE(p.apellido,'') AS profesor_apellido,
      n.nota          AS nota
    FROM Matricula mat
    JOIN Pagos pg                  ON pg.matricula_id = mat.id AND pg.estado = 'Pagado'
    JOIN Detalle_Matricula dm      ON dm.matricula_id = mat.id
    JOIN Materias_Impartidas mi    ON mi.id = dm.materia_impartida_id
    JOIN Materias m                ON m.id  = mi.materia_id
    JOIN Profesores p              ON p.id  = mi.profesor_id
    JOIN Periodos per              ON per.id = mat.periodo_id
    LEFT JOIN Notas n
      ON  n.estudiante_id = mat.estudiante_id
      AND n.materia_id    = mi.materia_id
      AND n.periodo_id    = mat.periodo_id
    WHERE mat.estudiante_id = ?
    ${filtroPeriodo}
    GROUP BY dm.id
    ORDER BY per.anio DESC, per.nombre DESC, m.codigo
  `;

  const [rows] = await pool.query(sql, params);
  return rows;
};

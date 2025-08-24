import { pool } from '../config/db.js';

export async function estudianteByUsuario(usuario_id) {
  if (!usuario_id) throw new Error('usuario_id inválido');
  const [rows] = await pool.query(
    `SELECT id, nombre, apellido, correo, plan_id
       FROM Estudiantes
      WHERE usuario_id = ?
      LIMIT 1`,
    [usuario_id]
  );
  if (!rows.length) throw new Error('Estudiante no encontrado para ese usuario');
  return rows[0];
}

export async function periodosActivos() {
  const [rows] = await pool.query(
    `SELECT id, nombre, anio, activo
       FROM Periodos
      WHERE activo = 1
      ORDER BY anio, nombre`
  );
  return rows;
}

export async function tiposMatricula() {
  const [rows] = await pool.query(
    `SELECT id, descripcion, costo
       FROM Tipo_Matricula
      ORDER BY id`
  );
  return rows;
}

export async function materiasImpartidas({ periodo_id, plan_id }) {
  if (!periodo_id || !plan_id) throw new Error('Faltan parámetros (periodo_id, plan_id)');
  const [rows] = await pool.query(
    `SELECT
        mi.id AS grupo_id,
        m.id  AS materia_id,
        m.codigo,
        m.nombre       AS materia,
        m.creditos,
        p.nombre       AS profesor_nombre,
        COALESCE(p.apellido,'') AS profesor_apellido,
        mi.horario,
        mi.cupo_actual,
        mi.cupo_maximo
     FROM Materias_Impartidas mi
     JOIN Materias   m ON m.id  = mi.materia_id
     JOIN Profesores p ON p.id  = mi.profesor_id
    WHERE mi.periodo_id = ? AND m.plan_id = ?
    ORDER BY m.codigo`,
    [periodo_id, plan_id]
  );
  return rows;
}

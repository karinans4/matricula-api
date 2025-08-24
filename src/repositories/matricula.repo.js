// src/repositories/matricula.repo.js
import { pool } from '../config/db.js';

/**
 * Helper: asegura números válidos o null
 */
const toInt = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};

/**
 * Crea (o reutiliza) una matrícula para (estudiante_id, periodo_id, tipo_matricula_id).
 * Requiere índice único en DB:  UNIQUE KEY UNQ_Mat (estudiante_id, periodo_id)
 *
 * Devuelve: { ok:1, matricula_id, mensaje }
 */
export const crearMatricula = async (payload = {}) => {
  const estudiante_id     = toInt(payload.estudiante_id);
  const periodo_id        = toInt(payload.periodo_id);
  const tipo_matricula_id = toInt(payload.tipo_matricula_id);

  if (!estudiante_id || !periodo_id || !tipo_matricula_id) {
    return { ok: 0, mensaje: 'Faltan parámetros requeridos' };
  }

  // Validaciones de existencia básicas
  const [[estu]] = await pool.query(
    'SELECT id, plan_id FROM Estudiantes WHERE id=? LIMIT 1',
    [estudiante_id]
  );
  if (!estu) return { ok: 0, mensaje: 'Estudiante no existe' };

  const [[peri]] = await pool.query(
    'SELECT id FROM Periodos WHERE id=? LIMIT 1',
    [periodo_id]
  );
  if (!peri) return { ok: 0, mensaje: 'Período no existe' };

  const [[tipo]] = await pool.query(
    'SELECT id FROM Tipo_Matricula WHERE id=? LIMIT 1',
    [tipo_matricula_id]
  );
  if (!tipo) return { ok: 0, mensaje: 'Tipo de matrícula no existe' };

  // Crear o reutilizar matrícula (LAST_INSERT_ID trick)
  const sql = `
    INSERT INTO Matricula(estudiante_id, periodo_id, tipo_matricula_id)
    VALUES(?,?,?)
    ON DUPLICATE KEY UPDATE
      id = LAST_INSERT_ID(id),
      tipo_matricula_id = VALUES(tipo_matricula_id)
  `;
  const [r] = await pool.query(sql, [estudiante_id, periodo_id, tipo_matricula_id]);
  const matricula_id = r.insertId;

  return { ok: 1, matricula_id, mensaje: 'Matrícula lista' };
};

/**
 * Agrega detalle a una matrícula con control de cupo y consistencia de plan/período.
 * - La Materia_Impartida debe ser del mismo período que la matrícula
 * - La Materia de esa MI debe pertenecer al mismo plan que el estudiante
 * - Controla cupo (cupo_actual < cupo_maximo) con FOR UPDATE
 * - Evita duplicados con UNIQUE KEY UNQ_Det (matricula_id, materia_impartida_id)
 * - Incrementa cupo_actual cuando inserta
 *
 * Devuelve: { ok:1, mensaje } o { ok:0, mensaje }
 */
export const agregarDetalle = async (payload = {}) => {
  const matricula_id         = toInt(payload.matricula_id);
  const materia_impartida_id = toInt(payload.materia_impartida_id);

  if (!matricula_id || !materia_impartida_id) {
    return { ok: 0, mensaje: 'Faltan parámetros' };
  }

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // 1) Traer matrícula con estudiante/periodo y el plan del estudiante
    const [[mat]] = await conn.query(
      `SELECT m.id, m.periodo_id, e.plan_id
         FROM Matricula m
         JOIN Estudiantes e ON e.id = m.estudiante_id
        WHERE m.id = ?`,
      [matricula_id]
    );
    if (!mat) {
      await conn.rollback();
      return { ok: 0, mensaje: 'Matrícula no existe' };
    }

    // 2) Traer MI con su materia y bloquear para control de cupo
    const [[mi]] = await conn.query(
      `SELECT mi.id, mi.periodo_id, mi.cupo_maximo, mi.cupo_actual, m.plan_id AS materia_plan_id
         FROM Materias_Impartidas mi
         JOIN Materias m ON m.id = mi.materia_id
        WHERE mi.id = ?
        FOR UPDATE`,
      [materia_impartida_id]
    );
    if (!mi) {
      await conn.rollback();
      return { ok: 0, mensaje: 'Grupo no existe' };
    }

    // 2.a) Validar periodo consistente
    if (Number(mi.periodo_id) !== Number(mat.periodo_id)) {
      await conn.rollback();
      return { ok: 0, mensaje: 'El grupo no pertenece a ese período' };
    }

    // 2.b) Validar plan consistente (curso debe ser del plan del estudiante)
    if (Number(mi.materia_plan_id) !== Number(mat.plan_id)) {
      await conn.rollback();
      return { ok: 0, mensaje: 'La materia no pertenece a tu plan de estudios' };
    }

    // 2.c) Control de cupo
    if (mi.cupo_actual >= mi.cupo_maximo) {
      await conn.rollback();
      return { ok: 0, mensaje: 'Cupo lleno' };
    }

    // 3) Insertar detalle (evita duplicado con UNIQUE y/o INSERT IGNORE)
    const [ins] = await conn.query(
      `INSERT IGNORE INTO Detalle_Matricula (matricula_id, materia_impartida_id)
       VALUES (?, ?)`,
      [matricula_id, materia_impartida_id]
    );
    if (ins.affectedRows === 0) {
      await conn.rollback();
      return { ok: 0, mensaje: 'Ya estaba inscrita' };
    }

    // 4) Actualizar cupo_actual
    await conn.query(
      `UPDATE Materias_Impartidas
          SET cupo_actual = cupo_actual + 1
        WHERE id = ?`,
      [materia_impartida_id]
    );

    await conn.commit();
    return { ok: 1, mensaje: 'Materia agregada' };
  } catch (e) {
    await conn.rollback();
    return { ok: 0, mensaje: e.message };
  } finally {
    conn.release();
  }
};

/**
 * Lista el detalle de una matrícula (para la tabla "Mis materias…")
 * Devuelve columnas esperadas por el frontend.
 */
export const listarDetalle = async (matricula_id) => {
  const id = toInt(matricula_id);
  if (!id) return [];

  const [rows] = await pool.query(
    `
    SELECT
      dm.id     AS detalle_id,
      mi.id     AS grupo_id,
      m.codigo,
      m.nombre,
      m.creditos,
      p.nombre  AS profesor_nombre,
      COALESCE(p.apellido,'') AS profesor_apellido,
      mi.horario
    FROM Detalle_Matricula dm
    JOIN Materias_Impartidas mi ON mi.id = dm.materia_impartida_id
    JOIN Materias            m  ON m.id  = mi.materia_id
    JOIN Profesores          p  ON p.id  = mi.profesor_id
    WHERE dm.matricula_id = ?
    ORDER BY m.codigo
    `,
    [id]
  );
  return rows;
};

/**
 * Quita un detalle de la matrícula y devuelve el cupo al grupo.
 * Devuelve el resultado crudo de MySQL (con affectedRows).
 */
export const eliminarDetalle = async (detalle_id) => {
  const detId = toInt(detalle_id);
  if (!detId) return { affectedRows: 0 };

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // localizar mi.id del detalle (para ajustar cupo)
    const [[det]] = await conn.query(
      `SELECT materia_impartida_id
         FROM Detalle_Matricula
        WHERE id = ?
        FOR UPDATE`,
      [detId]
    );
    if (!det) {
      await conn.rollback();
      return { affectedRows: 0 };
    }

    // borrar detalle
    const [del] = await conn.query(
      `DELETE FROM Detalle_Matricula
        WHERE id = ?`,
      [detId]
    );

    // si borró, liberar cupo
    if (del.affectedRows) {
      await conn.query(
        `UPDATE Materias_Impartidas
            SET cupo_actual = GREATEST(cupo_actual - 1, 0)
          WHERE id = ?`,
        [det.materia_impartida_id]
      );
    }

    await conn.commit();
    return del; // { affectedRows: 1|0 }
  } catch (e) {
    await conn.rollback();
    throw e;
  } finally {
    conn.release();
  }
};

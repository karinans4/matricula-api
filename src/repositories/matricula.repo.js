// src/repositories/matricula.repo.js
import { pool } from '../config/db.js';

/**
 * Crea (o reutiliza) una matrícula para (estudiante_id, periodo_id).
 * Usa ON DUPLICATE KEY para el índice único UNQ_Mat.
 * Devuelve: { matricula_id, ok:1, mensaje }
 */
export const crearMatricula = async ({ estudiante_id, periodo_id, tipo_matricula_id }) => {
  if (!estudiante_id || !periodo_id || !tipo_matricula_id) {
    return { ok: 0, mensaje: 'Faltan parámetros requeridos' };
  }

  // IMPORTANTE: UNQ_Mat(estudiante_id, periodo_id) existe en tu DB
  // (ver dump). Esto permite reusar la matrícula si ya existe.
  const sql = `
    INSERT INTO Matricula(estudiante_id, periodo_id, tipo_matricula_id)
    VALUES(?,?,?)
    ON DUPLICATE KEY UPDATE id = LAST_INSERT_ID(id), tipo_matricula_id = VALUES(tipo_matricula_id)
  `;
  const [r] = await pool.query(sql, [estudiante_id, periodo_id, tipo_matricula_id]);
  const matricula_id = r.insertId;
  return { matricula_id, ok: 1, mensaje: 'Matrícula lista' };
};

/**
 * Agrega detalle a una matrícula con control de cupo/periodo y evita duplicados.
 * - Verifica que la MI pertenezca al mismo periodo que la matrícula
 * - Verifica que cupo_actual < cupo_maximo
 * - Inserta en Detalle_Matricula (UNQ_Det)
 * - Incrementa cupo_actual si insertó
 */
export const agregarDetalle = async ({ matricula_id, materia_impartida_id }) => {
  if (!matricula_id || !materia_impartida_id) return { ok: 0, mensaje: 'Faltan parámetros' };

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // 1) Traer periodo de la matrícula
    const [[mat]] = await conn.query(
      `SELECT id, periodo_id FROM Matricula WHERE id=?`,
      [matricula_id]
    );
    if (!mat) {
      await conn.rollback(); return { ok: 0, mensaje: 'Matrícula no existe' };
    }

    // 2) Traer MI y validar que es del mismo periodo y tiene cupo
    const [[mi]] = await conn.query(
      `SELECT id, periodo_id, cupo_maximo, cupo_actual
         FROM Materias_Impartidas
        WHERE id=? FOR UPDATE`,
      [materia_impartida_id]
    );
    if (!mi) {
      await conn.rollback(); return { ok: 0, mensaje: 'Grupo no existe' };
    }
    if (Number(mi.periodo_id) !== Number(mat.periodo_id)) {
      await conn.rollback(); return { ok: 0, mensaje: 'El grupo no pertenece a ese periodo' };
    }
    if (mi.cupo_actual >= mi.cupo_maximo) {
      await conn.rollback(); return { ok: 0, mensaje: 'Cupo lleno' };
    }

    // 3) Insertar detalle (UNQ_Det evita duplicados)
    const [ins] = await conn.query(
      `INSERT IGNORE INTO Detalle_Matricula(matricula_id, materia_impartida_id) VALUES(?,?)`,
      [matricula_id, materia_impartida_id]
    );
    if (ins.affectedRows === 0) {
      await conn.rollback(); return { ok: 0, mensaje: 'Ya estaba inscrita' };
    }

    // 4) Actualizar cupo_actual
    await conn.query(
      `UPDATE Materias_Impartidas
          SET cupo_actual = cupo_actual + 1
        WHERE id=?`,
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
 * Lista detalle (lo que ya tienes en tu dump: códigos, nombres, horario, profesor)
 */
export const listarDetalle = async (matricula_id) => {
  const [rows] = await pool.query(`
    SELECT dm.id AS detalle_id,
           mi.id  AS grupo_id,
           m.codigo, m.nombre, m.creditos,
           p.nombre AS profesor_nombre, COALESCE(p.apellido,'') AS profesor_apellido,
           mi.horario
    FROM Detalle_Matricula dm
    JOIN Materias_Impartidas mi ON mi.id = dm.materia_impartida_id
    JOIN Materias m            ON m.id  = mi.materia_id
    JOIN Profesores p          ON p.id  = mi.profesor_id
    WHERE dm.matricula_id = ?
    ORDER BY m.codigo
  `, [matricula_id]);
  return rows;
};

/**
 * Quitar detalle y devolver cupo
 */
export const eliminarDetalle = async (detalle_id) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // localizar mi.id del detalle (para bajar cupo)
    const [[det]] = await conn.query(
      `SELECT materia_impartida_id FROM Detalle_Matricula WHERE id=? FOR UPDATE`,
      [detalle_id]
    );
    if (!det) { await conn.rollback(); return { affectedRows: 0 }; }

    const [del] = await conn.query(
      `DELETE FROM Detalle_Matricula WHERE id=?`,
      [detalle_id]
    );

    if (del.affectedRows) {
      await conn.query(
        `UPDATE Materias_Impartidas
            SET cupo_actual = GREATEST(cupo_actual - 1, 0)
          WHERE id=?`,
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

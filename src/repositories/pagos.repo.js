import { pool } from '../config/db.js';

// helpers
const toInt = (v) => (Number.isFinite(Number(v)) ? Number(v) : null);
const toMoney = (x) => Number.parseFloat(x || 0).toFixed ? Number.parseFloat(x || 0) : 0;

// lee Parametros.precio_credito (o 0 si no existe)
async function getPrecioCredito(conn) {
  const [rows] = await conn.query(
    `SELECT valor FROM Parametros WHERE clave='precio_credito' LIMIT 1`
  );
  const val = rows?.[0]?.valor ?? '0';
  return Number.parseFloat(val) || 0;
}

/**
 * Calcula el monto total de una matrícula:
 * total = Tipo_Matricula.costo + (SUM(creditos) * precio_credito)
 * Devuelve un objeto con breakdown y totales.
 */
export async function cotizarMatricula(matricula_id) {
  const id = toInt(matricula_id);
  if (!id) throw new Error('matricula_id inválido');

  const conn = await pool.getConnection();
  try {
    // tipo matricula + estudiante
    const [[m]] = await conn.query(
      `SELECT m.id, m.estudiante_id, m.tipo_matricula_id, tm.costo AS costo_matricula
         FROM Matricula m
         JOIN Tipo_Matricula tm ON tm.id = m.tipo_matricula_id
        WHERE m.id = ?`,
      [id]
    );
    if (!m) throw new Error('Matrícula no existe');

    // créditos inscritos
    const [[cred]] = await conn.query(
      `SELECT COALESCE(SUM(mat.creditos),0) AS total_creditos
         FROM Detalle_Matricula dm
         JOIN Materias_Impartidas mi ON mi.id = dm.materia_impartida_id
         JOIN Materias mat           ON mat.id = mi.materia_id
        WHERE dm.matricula_id = ?`,
      [id]
    );
    const total_creditos = Number(cred?.total_creditos || 0);

    // precio por crédito
    const precio_credito = await getPrecioCredito(conn);

    const subtotal_creditos = total_creditos * precio_credito;
    const monto_total = toMoney((Number(m.costo_matricula) || 0) + subtotal_creditos);

    return {
      ok: 1,
      matricula_id: m.id,
      estudiante_id: m.estudiante_id,
      tipo_matricula_id: m.tipo_matricula_id,
      costo_matricula: Number(m.costo_matricula) || 0,
      total_creditos,
      precio_credito,
      subtotal_creditos,
      monto_total
    };
  } finally {
    conn.release();
  }
}

/**
 * Crea (o reutiliza) un pago PENDIENTE para una matrícula.
 * - Si ya existe un pago 'Pendiente', lo ACTUALIZA con el nuevo monto (idempotente).
 * - Si no existe, lo inserta.
 */
export async function crearPagoDeMatricula(matricula_id) {
  const id = toInt(matricula_id);
  if (!id) throw new Error('matricula_id inválido');

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // cotización (usa la misma conexión)
    const [[m]] = await conn.query(
      `SELECT m.id, m.estudiante_id, m.tipo_matricula_id, tm.costo AS costo_matricula
         FROM Matricula m
         JOIN Tipo_Matricula tm ON tm.id = m.tipo_matricula_id
        WHERE m.id = ? FOR UPDATE`,
      [id]
    );
    if (!m) { await conn.rollback(); throw new Error('Matrícula no existe'); }

    const [[cred]] = await conn.query(
      `SELECT COALESCE(SUM(mat.creditos),0) AS total_creditos
         FROM Detalle_Matricula dm
         JOIN Materias_Impartidas mi ON mi.id = dm.materia_impartida_id
         JOIN Materias mat           ON mat.id = mi.materia_id
        WHERE dm.matricula_id = ?`,
      [id]
    );
    const precio_credito = await getPrecioCredito(conn);
    const total_creditos = Number(cred?.total_creditos || 0);
    const subtotal_creditos = total_creditos * precio_credito;
    const monto_total = toMoney((Number(m.costo_matricula) || 0) + subtotal_creditos);

    // ¿existe pago pendiente?
    const [[pend]] = await conn.query(
      `SELECT id FROM Pagos WHERE matricula_id=? AND estado='Pendiente' LIMIT 1`,
      [id]
    );

    if (pend) {
      await conn.query(
        `UPDATE Pagos SET monto_total=? WHERE id=?`,
        [monto_total, pend.id]
      );
      await conn.commit();
      return { ok: 1, pago_id: pend.id, estado: 'Pendiente', monto_total };
    }

    // insertar nuevo pendiente
    const [ins] = await conn.query(
      `INSERT INTO Pagos (matricula_id, estudiante_id, monto_total, estado)
       VALUES (?,?,?,'Pendiente')`,
      [m.id, m.estudiante_id, monto_total]
    );

    await conn.commit();
    return { ok: 1, pago_id: ins.insertId, estado: 'Pendiente', monto_total };
  } catch (e) {
    await conn.rollback();
    return { ok: 0, mensaje: e.message };
  } finally {
    conn.release();
  }
}

/**
 * Confirmar pago: pasa a 'Pagado' y marca la matrícula como 'Pagada'
 */
export async function confirmarPago(pago_id) {
  const id = toInt(pago_id);
  if (!id) throw new Error('pago_id inválido');

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // traer pago pendiente
    const [[pago]] = await conn.query(
      `SELECT id, matricula_id, estado
         FROM Pagos
        WHERE id=? FOR UPDATE`,
      [id]
    );
    if (!pago) { await conn.rollback(); return { ok: 0, mensaje: 'Pago no existe' }; }
    if (pago.estado !== 'Pendiente') {
      await conn.rollback();
      return { ok: 0, mensaje: 'El pago no está en estado Pendiente' };
    }

    await conn.query(`UPDATE Pagos SET estado='Pagado' WHERE id=?`, [id]);
    await conn.query(`UPDATE Matricula SET estado='Pagada' WHERE id=?`, [pago.matricula_id]);

    await conn.commit();
    return { ok: 1, mensaje: 'Pago confirmado' };
  } catch (e) {
    await conn.rollback();
    return { ok: 0, mensaje: e.message };
  } finally {
    conn.release();
  }
}

export async function obtenerPagoPorMatricula(matricula_id) {
  const id = toInt(matricula_id);
  const [rows] = await pool.query(
    `SELECT id, matricula_id, estudiante_id, monto_total, fecha, estado
       FROM Pagos
      WHERE matricula_id=?
      ORDER BY id DESC
      LIMIT 1`,
    [id]
  );
  return rows?.[0] || null;
}

export async function listarPagosPorEstudiante(estudiante_id) {
  const id = toInt(estudiante_id);
  const [rows] = await pool.query(
    `SELECT id, matricula_id, estudiante_id, monto_total, fecha, estado
       FROM Pagos
      WHERE estudiante_id=?
      ORDER BY fecha DESC, id DESC`,
    [id]
  );
  return rows;
}

// src/controllers/pagos.controller.js
import * as svc from '../services/pagos.service.js';

const toInt = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};

// Cotización por matrícula
export const cotizar = async (req, res) => {
  try {
    const id = toInt(req.params?.matricula_id || req.query?.matricula_id);
    const out = await svc.cotizar(id);
    return res.json(out);
  } catch (e) {
    return res.status(400).json({ ok: 0, mensaje: e.message });
  }
};

// Crear/actualizar pago pendiente para una matrícula
export const crear = async (req, res) => {
  try {
    const id = toInt(req.body?.matricula_id);
    const out = await svc.crear(id);
    if (out?.ok === 1) return res.json(out);
    return res.status(400).json(out || { ok: 0, mensaje: 'No fue posible crear el pago' });
  } catch (e) {
    return res.status(400).json({ ok: 0, mensaje: e.message });
  }
};

// Confirmar pago (cambia estado a Pagado)
export const confirmar = async (req, res) => {
  try {
    const pago_id = toInt(req.params?.pago_id);
    const out = await svc.confirmar(pago_id);
    if (out?.ok === 1) return res.json(out);
    return res.status(400).json(out || { ok: 0, mensaje: 'No fue posible confirmar el pago' });
  } catch (e) {
    return res.status(400).json({ ok: 0, mensaje: e.message });
  }
};

// Obtener último pago por matrícula
export const getByMatricula = async (req, res) => {
  try {
    const id = toInt(req.params?.matricula_id);
    const out = await svc.getByMat(id);
    return res.json(out || {});
  } catch (e) {
    return res.status(400).json({ ok: 0, mensaje: e.message });
  }
};

// Listar pagos por estudiante
export const listByEstudiante = async (req, res) => {
  try {
    const id = toInt(req.params?.estudiante_id);
    const out = await svc.listByEst(id);
    return res.json(out || []);
  } catch (e) {
    return res.status(400).json({ ok: 0, mensaje: e.message });
  }
};

// =========== MODO DEMO (sin pasarela) ===========
// Crea el pago pendiente y lo confirma enseguida.
export const mockConfirm = async (req, res) => {
  try {
    const matricula_id = toInt(req.body?.matricula_id);
    if (!matricula_id) return res.status(400).json({ ok: 0, mensaje: 'matricula_id inválido' });

    // Asegurar que hay total a cobrar
    const c = await svc.cotizar(matricula_id);
    if (!c?.monto_total) return res.status(400).json({ ok: 0, mensaje: 'No hay monto para cobrar' });

    // Crear/actualizar pago pendiente
    const p = await svc.crear(matricula_id);
    if (p?.ok !== 1) return res.status(400).json(p || { ok: 0, mensaje: 'No fue posible crear el pago' });

    // Confirmar inmediatamente (sin pasarela)
    const conf = await svc.confirmar(p.pago_id);
    if (conf?.ok !== 1) return res.status(400).json(conf || { ok: 0, mensaje: 'No fue posible confirmar' });

    return res.json({ ok: 1, pago_id: p.pago_id, mensaje: 'Pago simulado confirmado' });
  } catch (e) {
    return res.status(400).json({ ok: 0, mensaje: e.message });
  }
};

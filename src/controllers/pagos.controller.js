import * as svc from '../services/pagos.service.js';

const toInt = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};

export const cotizar = async (req, res) => {
  try {
    const id = toInt(req.params?.matricula_id || req.query?.matricula_id);
    const out = await svc.cotizar(id);
    return res.json(out);
  } catch (e) {
    return res.status(400).json({ ok: 0, mensaje: e.message });
  }
};

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

export const getByMatricula = async (req, res) => {
  try {
    const id = toInt(req.params?.matricula_id);
    const out = await svc.getByMat(id);
    return res.json(out || {});
  } catch (e) {
    return res.status(400).json({ ok: 0, mensaje: e.message });
  }
};

export const listByEstudiante = async (req, res) => {
  try {
    const id = toInt(req.params?.estudiante_id);
    const out = await svc.listByEst(id);
    return res.json(out || []);
  } catch (e) {
    return res.status(400).json({ ok: 0, mensaje: e.message });
  }
};

// src/controllers/matricula.controller.js
import * as svc from '../services/matricula.service.js';

const toInt = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};

/**
 * Crear (o reutilizar) una matrícula para (estudiante_id, periodo_id, tipo_matricula_id).
 * Responde 200 si ok=1 (o si viene matricula_id); de lo contrario 400 con el mensaje del service.
 */
export const crear = async (req, res) => {
  try {
    const estudiante_id     = toInt(req.body?.estudiante_id);
    const periodo_id        = toInt(req.body?.periodo_id);
    const tipo_matricula_id = toInt(req.body?.tipo_matricula_id);

    const out = await svc.crear({ estudiante_id, periodo_id, tipo_matricula_id });

    if (out?.ok === 1 || out?.matricula_id) return res.json(out);
    return res.status(400).json(out || { ok: 0, mensaje: 'No se pudo crear la matrícula' });
  } catch (e) {
    return res.status(400).json({ ok: 0, mensaje: e.message });
  }
};

/**
 * Agrega un detalle (materia_impartida_id) a la matrícula con control de cupo.
 * Responde 200 si ok=1; si no, 400 con el mensaje del service.
 */
export const agregar = async (req, res) => {
  try {
    const matricula_id         = toInt(req.body?.matricula_id);
    const materia_impartida_id = toInt(req.body?.materia_impartida_id);

    const out = await svc.agregar({ matricula_id, materia_impartida_id });

    if (out?.ok === 1) return res.json(out);
    return res.status(400).json(out || { ok: 0, mensaje: 'No fue posible inscribir' });
  } catch (e) {
    return res.status(400).json({ ok: 0, mensaje: e.message });
  }
};

/**
 * Lista el detalle de una matrícula (materias inscritas).
 */
export const detalle = async (req, res) => {
  try {
    const id = toInt(req.params?.matricula_id);
    if (!id) return res.status(400).json({ error: 'matricula_id inválido' });

    const rows = await svc.detalle(id);
    return res.json(rows);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};

/**
 * Quita un detalle y devuelve cupo.
 */
export const quitar = async (req, res) => {
  try {
    const detalle_id = toInt(req.params?.detalle_id);
    if (!detalle_id) return res.status(400).json({ error: 'detalle_id inválido' });

    const r = await svc.quitar(detalle_id);
    return res.json({ deleted: r?.affectedRows || 0 });
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
};

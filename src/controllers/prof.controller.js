// src/controllers/prof.controller.js
import * as svc from '../services/prof.service.js';

const toInt = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};

export const getGrupos = async (req, res) => {
  try {
    const profesor_id = toInt(req.query?.profesor_id);
    const periodo_id  = toInt(req.query?.periodo_id);
    if (!profesor_id) return res.status(400).json({ ok: 0, mensaje: 'profesor_id requerido' });

    const rows = await svc.gruposDelProfesor(profesor_id, periodo_id);
    return res.json(rows);
  } catch (e) {
    return res.status(400).json({ ok: 0, mensaje: e.message });
  }
};

export const getEstudiantes = async (req, res) => {
  try {
    const grupo_id = toInt(req.params?.grupo_id);
    const rows = await svc.estudiantesDeGrupo(grupo_id);
    return res.json(rows || []);
  } catch (e) {
    return res.status(400).json({ ok: 0, mensaje: e.message });
  }
};

export const setNota = async (req, res) => {
  try {
    const grupo_id      = toInt(req.params?.grupo_id);
    const profesor_id   = toInt(req.body?.profesor_id);
    const estudiante_id = toInt(req.body?.estudiante_id);
    const nota          = Number(req.body?.nota);

    if (!grupo_id || !profesor_id || !estudiante_id || !Number.isFinite(nota))
      return res.status(400).json({ ok: 0, mensaje: 'Parámetros inválidos' });

    // Validación simple de rango (ajusta a tu escala)
    if (nota < 0 || nota > 100) {
      return res.status(400).json({ ok: 0, mensaje: 'La nota debe estar entre 0 y 100' });
    }

    const out = await svc.guardarNota({ profesor_id, grupo_id, estudiante_id, nota });
    if (out?.ok === 1) return res.json(out);
    return res.status(400).json(out || { ok: 0, mensaje: 'No fue posible guardar la nota' });
  } catch (e) {
    return res.status(400).json({ ok: 0, mensaje: e.message });
  }
};

// src/controllers/mis.controller.js
import * as svc from '../services/mis.service.js';

const toInt = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};

/**
 * GET /mis-materias/:estudiante_id?periodo_id=#
 * Devuelve las materias de matrículas PAGADAS del estudiante.
 */
export const getMateriasPagadas = async (req, res) => {
  try {
    const estudiante_id = toInt(req.params?.estudiante_id);
    if (!estudiante_id) return res.status(400).json({ ok:0, mensaje:'estudiante_id inválido' });

    const periodo_id = toInt(req.query?.periodo_id);
    const rows = await svc.materiasPagadas(estudiante_id, { periodo_id });

    return res.json(rows || []);
  } catch (e) {
    return res.status(400).json({ ok:0, mensaje: e.message });
  }
};

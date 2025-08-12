import * as svc from '../services/estudiantes.service.js';

export const getAll = async (_req, res) => {
  try { res.json(await svc.listar()); }
  catch (e) { res.status(500).json({ error: e.message }); }
};

export const post = async (req, res) => {
  try {
    const r = await svc.crear(req.body || {});
    res.status(201).json({ id: r.insertId });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

export const put = async (req, res) => {
  try {
    const r = await svc.actualizar(Number(req.params.id), req.body || {});
    res.json({ updated: r.affectedRows });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

export const del = async (req, res) => {
  try {
    const r = await svc.eliminar(Number(req.params.id));
    res.json({ deleted: r.affectedRows });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

export const getOpciones = async (_req, res) => {
  try { res.json(await svc.opciones()); }
  catch (e) { res.status(500).json({ error: e.message }); }
};

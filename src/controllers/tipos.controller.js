import * as svc from '../services/tipos.service.js';

export const getAll = async (_req, res) => res.json(await svc.listar());
export const post   = async (req, res) => {
  const { descripcion, costo } = req.body || {};
  if (!descripcion || costo == null) return res.status(400).json({ error: 'descripcion y costo son obligatorios' });
  const r = await svc.crear({ descripcion, costo });
  return res.status(201).json({ id: r.insertId });
};
export const put    = async (req, res) => {
  const { descripcion, costo } = req.body || {};
  if (!descripcion || costo == null) return res.status(400).json({ error: 'descripcion y costo son obligatorios' });
  const r = await svc.actualizar(req.params.id, { descripcion, costo });
  return res.json({ updated: r.affectedRows });
};
export const del    = async (req, res) => {
  const r = await svc.eliminar(req.params.id);
  return res.json({ deleted: r.affectedRows });
};

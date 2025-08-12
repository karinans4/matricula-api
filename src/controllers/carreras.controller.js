import * as svc from '../services/carreras.service.js';

export const getAll = async (_req,res)=> res.json(await svc.listar());
export const post   = async (req,res)=> {
  try { const r = await svc.crear(req.body||{}); res.status(201).json({ id:r.insertId }); }
  catch(e){ res.status(400).json({ error:e.message }); }
};
export const put    = async (req,res)=> {
  try { const r = await svc.actualizar(req.params.id, req.body||{}); res.json({ updated:r.affectedRows }); }
  catch(e){ res.status(400).json({ error:e.message }); }
};
export const del    = async (req,res)=> res.json({ deleted:(await svc.eliminar(req.params.id)).affectedRows });

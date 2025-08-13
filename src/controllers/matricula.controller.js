import * as svc from '../services/matricula.service.js';

export const crear = async (req, res) => {
  try { res.json(await svc.crear(req.body||{})); }
  catch(e){ res.status(400).json({ error: e.message }); }
};

export const agregar = async (req, res) => {
  try { res.json(await svc.agregar(req.body||{})); }
  catch(e){ res.status(400).json({ error: e.message }); }
};

export const detalle = async (req, res) => {
  try { res.json(await svc.detalle(Number(req.params.matricula_id))); }
  catch(e){ res.status(500).json({ error: e.message }); }
};

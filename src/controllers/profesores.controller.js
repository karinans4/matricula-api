import * as svc from '../services/profesores.service.js';

export const getAll = async (_req,res)=> res.json(await svc.listar());

export const post = async (req,res)=>{
  const { nombre, apellido, correo } = req.body || {};
  if(!nombre || !correo) return res.status(400).json({ error:'nombre y correo son obligatorios' });
  const r = await svc.crear({ nombre, apellido: apellido||'', correo });
  res.status(201).json({ id: r.insertId });
};

export const put = async (req,res)=>{
  const { nombre, apellido, correo } = req.body || {};
  if(!nombre || !correo) return res.status(400).json({ error:'nombre y correo son obligatorios' });
  const r = await svc.actualizar(req.params.id, { nombre, apellido: apellido||'', correo });
  res.json({ updated: r.affectedRows });
};

export const del = async (req,res)=>{
  const r = await svc.eliminar(req.params.id);
  res.json({ deleted: r.affectedRows });
};

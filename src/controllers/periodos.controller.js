import * as svc from '../services/periodos.service.js';

export const getAll = async (_req,res)=> res.json(await svc.listar());
export const post   = async (req,res)=> res.status(201).json({ id:(await svc.crear(req.body)).insertId });
export const put    = async (req,res)=> res.json({ updated:(await svc.actualizar(req.params.id, req.body)).affectedRows });
export const del    = async (req,res)=> res.json({ deleted:(await svc.eliminar(req.params.id)).affectedRows });

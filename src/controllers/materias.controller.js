import * as svc from '../services/materias.service.js';

export const getAll = async (_req, res) => {
  try { res.json(await svc.listar()); }
  catch (e) { res.status(500).json({ error: e.message }); }
};

export const getOpciones = async (req, res) => {
  try { res.json(await svc.opciones(req.query.plan_id ? Number(req.query.plan_id) : null)); }
  catch (e) { res.status(500).json({ error: e.message }); }
};

export const post = async (req, res) => {
  try { const r = await svc.crear(req.body || {}); res.status(201).json({ id: r.insertId }); }
  catch (e) { res.status(400).json({ error: e.message }); }
};

export const put = async (req, res) => {
  try { const r = await svc.actualizar(Number(req.params.id), req.body || {}); res.json({ updated: r.affectedRows }); }
  catch (e) { res.status(400).json({ error: e.message }); }
};

export const del = async (req, res) => {
  try { const r = await svc.eliminar(Number(req.params.id)); res.json({ deleted: r.affectedRows }); }
  catch (e) { res.status(500).json({ error: e.message }); }
};

/* ===== Requisitos / Correquisitos ===== */

export const getRequisitos = async (req, res) => {
  try { res.json(await svc.listarRequisitos(Number(req.params.id))); }
  catch (e) { res.status(500).json({ error: e.message }); }
};

export const getCorrequisitos = async (req, res) => {
  try { res.json(await svc.listarCorrequisitos(Number(req.params.id))); }
  catch (e) { res.status(500).json({ error: e.message }); }
};

export const addRequisito = async (req, res) => {
  try { const r = await svc.agregarRequisito({ materia_id: Number(req.params.id), requisito_id: Number(req.body.requisito_id) }); res.status(201).json({ id: r.insertId }); }
  catch (e) { res.status(400).json({ error: e.message }); }
};

export const removeRequisito = async (req, res) => {
  try { const r = await svc.eliminarRequisito(Number(req.params.req_id)); res.json({ deleted: r.affectedRows }); }
  catch (e) { res.status(500).json({ error: e.message }); }
};

export const addCorrequisito = async (req, res) => {
  try { const r = await svc.agregarCorrequisito({ materia_id: Number(req.params.id), correquisito_id: Number(req.body.correquisito_id) }); res.status(201).json({ id: r.insertId }); }
  catch (e) { res.status(400).json({ error: e.message }); }
};

export const removeCorrequisito = async (req, res) => {
  try { const r = await svc.eliminarCorrequisito(Number(req.params.co_id)); res.json({ deleted: r.affectedRows }); }
  catch (e) { res.status(500).json({ error: e.message }); }
};

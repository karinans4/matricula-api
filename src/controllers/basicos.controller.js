import * as svc from '../services/basicos.service.js';

export const estudianteByUsuario = async (req, res) => {
  try { res.json(await svc.estudianteByUsuario(Number(req.params.usuario_id))); }
  catch (e) { res.status(400).json({ error: e.message }); }
};

export const periodosActivos = async (_req, res) => {
  try { res.json(await svc.periodosActivos()); }
  catch (e) { res.status(500).json({ error: e.message }); }
};

export const tiposMatricula = async (_req, res) => {
  try { res.json(await svc.tiposMatricula()); }
  catch (e) { res.status(500).json({ error: e.message }); }
};

export const materiasImpartidas = async (req, res) => {
  try {
    const periodo_id = Number(req.query.periodo_id);
    const plan_id = Number(req.query.plan_id);
    res.json(await svc.materiasImpartidas({ periodo_id, plan_id }));
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

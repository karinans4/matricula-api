import { Router } from 'express';
import { pool } from '../config/db.js';

const r = Router();

/** Oferta de grupos por periodo y plan (usa tu SP) */
r.get('/materias-impartidas', async (req, res) => {
  try {
    const { periodo_id, plan_id } = req.query;
    if (!periodo_id || !plan_id) {
      return res.status(400).json({ error: 'periodo_id y plan_id son requeridos' });
    }
    const [resultsets] = await pool.query(
      'CALL sp_listar_materias_impartidas(?, ?)',
      [Number(periodo_id), Number(plan_id)]
    );
    // CALL devuelve arrays anidados; el primer resultset está en [0]
    res.json(resultsets[0] || []);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default r;

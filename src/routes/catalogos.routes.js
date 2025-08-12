import { Router } from 'express';
import { pool } from '../config/db.js';
const r = Router();

r.get('/periodos/activos', async (_req, res) => {
  try {
    const [rows] = await pool.query('CALL sp_listar_periodos_activos()');
    res.json(rows[0]);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

r.get('/tipos-matricula', async (_req, res) => {
  try {
    const [rows] = await pool.query('CALL sp_listar_tipos_matricula()');
    res.json(rows[0]);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

export default r;
    
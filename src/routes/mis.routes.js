// src/routes/mis.routes.js
import { Router } from 'express';
import * as ctl from '../controllers/mis.controller.js';

const r = Router();

/**
 * Lista materias de matrículas pagadas del estudiante.
 * GET /api/mis-materias/:estudiante_id?periodo_id=#
 */
r.get('/mis-materias/:estudiante_id', ctl.getMateriasPagadas);

export default r;

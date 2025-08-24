import { Router } from 'express';
import * as ctl from '../controllers/pagos.controller.js';

const r = Router();

// GET /api/pagos/cotizacion/5   (o ?matricula_id=5)
r.get('/pagos/cotizacion/:matricula_id', ctl.cotizar);

// POST /api/pagos   body { matricula_id }
r.post('/pagos', ctl.crear);

// POST /api/pagos/123/confirmar
r.post('/pagos/:pago_id/confirmar', ctl.confirmar);

// GET /api/pagos/matricula/5
r.get('/pagos/matricula/:matricula_id', ctl.getByMatricula);

// GET /api/pagos/estudiante/1
r.get('/pagos/estudiante/:estudiante_id', ctl.listByEstudiante);

export default r;

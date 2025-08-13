import { Router } from 'express';
import * as ctl from '../controllers/matricula.controller.js';

const r = Router();

r.post('/matricula/crear', ctl.crear);                // body {estudiante_id, periodo_id, tipo_matricula_id}
r.post('/matricula/agregar-detalle', ctl.agregar);    // body {matricula_id, materia_impartida_id}
r.get('/matricula/:matricula_id/detalle', ctl.detalle);

export default r;

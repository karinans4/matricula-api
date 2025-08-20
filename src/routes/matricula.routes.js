import { Router } from 'express';
import * as ctl from '../controllers/matricula.controller.js';

const r = Router();

r.post('/matricula/crear', ctl.crear);
r.post('/matricula/agregar-detalle', ctl.agregar);
r.get('/matricula/:matricula_id/detalle', ctl.detalle);
r.delete('/matricula/detalle/:detalle_id', ctl.quitar);

export default r;

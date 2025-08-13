import { Router } from 'express';
import * as ctl from '../controllers/estudiantes.controller.js';

const r = Router();
r.get('/estudiantes', ctl.getAll);
r.get('/estudiantes/opciones', ctl.getOpciones);
r.post('/estudiantes', ctl.post);
r.put('/estudiantes/:id', ctl.put);
r.delete('/estudiantes/:id', ctl.del);
r.get('/estudiantes/by-usuario/:usuario_id', ctl.getByUsuario);

export default r;

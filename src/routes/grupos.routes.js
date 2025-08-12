import { Router } from 'express';
import * as ctl from '../controllers/grupos.controller.js';

const r = Router();
r.get('/grupos', ctl.getAll);
r.get('/grupos/opciones', ctl.getOpciones);
r.post('/grupos', ctl.post);
r.put('/grupos/:id', ctl.put);
r.delete('/grupos/:id', ctl.del);

export default r;

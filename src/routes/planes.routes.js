import { Router } from 'express';
import * as ctl from '../controllers/planes.controller.js';
const r = Router();
r.get('/planes', ctl.getAll);
r.get('/planes/opciones', ctl.getOpciones);
r.post('/planes', ctl.post);
r.put('/planes/:id', ctl.put);
r.delete('/planes/:id', ctl.del);
export default r;

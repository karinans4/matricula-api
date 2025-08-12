import { Router } from 'express';
import * as ctl from '../controllers/periodos.controller.js';
const r = Router();
r.get('/periodos', ctl.getAll);
r.post('/periodos', ctl.post);
r.put('/periodos/:id', ctl.put);
r.delete('/periodos/:id', ctl.del);
export default r;

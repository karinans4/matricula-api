import { Router } from 'express';
import * as ctl from '../controllers/carreras.controller.js';
const r = Router();
r.get('/carreras', ctl.getAll);
r.post('/carreras', ctl.post);
r.put('/carreras/:id', ctl.put);
r.delete('/carreras/:id', ctl.del);
export default r;

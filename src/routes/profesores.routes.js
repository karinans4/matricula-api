import { Router } from 'express';
import * as ctl from '../controllers/profesores.controller.js';

const r = Router();
r.get('/profesores', ctl.getAll);
r.post('/profesores', ctl.post);
r.put('/profesores/:id', ctl.put);
r.delete('/profesores/:id', ctl.del);

export default r;

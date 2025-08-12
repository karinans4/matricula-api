import { Router } from 'express';
import * as ctl from '../controllers/tipos.controller.js';

const r = Router();
r.get('/tipos-matricula/all', ctl.getAll);     // listado completo (admin)
r.post('/tipos-matricula', ctl.post);          // crear
r.put('/tipos-matricula/:id', ctl.put);        // actualizar
r.delete('/tipos-matricula/:id', ctl.del);     // eliminar
export default r;

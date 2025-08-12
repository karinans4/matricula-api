import { Router } from 'express';
import * as ctl from '../controllers/materias.controller.js';

const r = Router();

// CRUD
r.get('/materias', ctl.getAll);
r.get('/materias/opciones', ctl.getOpciones);             // ?plan_id=#
r.post('/materias', ctl.post);
r.put('/materias/:id', ctl.put);
r.delete('/materias/:id', ctl.del);

// Requisitos
r.get('/materias/:id/requisitos', ctl.getRequisitos);
r.post('/materias/:id/requisitos', ctl.addRequisito);     // body { requisito_id }
r.delete('/materias/:id/requisitos/:req_id', ctl.removeRequisito);

// Correquisitos
r.get('/materias/:id/correquisitos', ctl.getCorrequisitos);
r.post('/materias/:id/correquisitos', ctl.addCorrequisito); // body { correquisito_id }
r.delete('/materias/:id/correquisitos/:co_id', ctl.removeCorrequisito);

export default r;

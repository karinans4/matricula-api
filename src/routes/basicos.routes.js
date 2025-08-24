import { Router } from 'express';
import * as ctl from '../controllers/basicos.controller.js';

const r = Router();

// Estudiante por usuario (para obtener plan_id)
r.get('/estudiantes/by-usuario/:usuario_id', ctl.estudianteByUsuario);

// Periodos activos
r.get('/periodos/activos', ctl.periodosActivos);

// Tipos de matrícula (descripcion, costo)
r.get('/tipos-matricula', ctl.tiposMatricula);

// Oferta de materias impartidas por plan y periodo
// GET /api/materias-impartidas?periodo_id=1&plan_id=1
r.get('/materias-impartidas', ctl.materiasImpartidas);

export default r;

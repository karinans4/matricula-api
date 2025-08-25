// src/routes/prof.routes.js
import { Router } from 'express';
import * as ctl from '../controllers/prof.controller.js';

const r = Router();

// Grupos del profesor (opcional filtro por periodo_id)
r.get('/profesor/grupos', ctl.getGrupos);

// Estudiantes de un grupo
r.get('/profesor/grupos/:grupo_id/estudiantes', ctl.getEstudiantes);

// Guardar/actualizar nota de un estudiante en el grupo
r.post('/profesor/grupos/:grupo_id/nota', ctl.setNota);

export default r;

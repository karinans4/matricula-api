// src/services/basicos.service.js
import * as repo from '../repositories/basicos.repo.js';

export const estudianteByUsuario = (usuario_id) => repo.estudianteByUsuario(usuario_id);
export const periodosActivos     = () => repo.periodosActivos();
export const tiposMatricula      = () => repo.tiposMatricula();
export const materiasImpartidas  = ({ periodo_id, plan_id }) =>
  repo.materiasImpartidas({ periodo_id, plan_id });

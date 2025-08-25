// src/services/mis.service.js
import * as repo from '../repositories/mis.repo.js';

export const materiasPagadas = (estudiante_id, filtros={}) =>
  repo.materiasPagadasByEstudiante(estudiante_id, filtros);

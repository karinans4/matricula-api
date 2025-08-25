// src/services/prof.service.js
import * as repo from '../repositories/prof.repo.js';

export const gruposDelProfesor = (profesor_id, periodo_id) =>
  repo.listGruposDelProfesor({ profesor_id, periodo_id });

export const estudiantesDeGrupo = (grupo_id) =>
  repo.listEstudiantesDeGrupo(grupo_id);

export const guardarNota = ({ profesor_id, grupo_id, estudiante_id, nota }) =>
  repo.upsertNota({ profesor_id, grupo_id, estudiante_id, nota });

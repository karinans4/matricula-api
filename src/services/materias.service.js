import * as repo from '../repositories/materias.repo.js';

export const listar = () => repo.list();

export const crear = async (d) => {
  const req = ['nombre','creditos','codigo','plan_id'];
  for (const k of req) if (d[k] == null || d[k] === '') throw new Error(`Campo obligatorio: ${k}`);
  if (await repo.existsCodigoInPlan(d.codigo, d.plan_id)) throw new Error('Ese código ya existe en el plan');
  return repo.create(d);
};

export const actualizar = async (id, d) => {
  const req = ['nombre','creditos','codigo','plan_id'];
  for (const k of req) if (d[k] == null || d[k] === '') throw new Error(`Campo obligatorio: ${k}`);
  if (await repo.existsCodigoInPlan(d.codigo, d.plan_id, id)) throw new Error('Ese código ya existe en el plan');
  return repo.update(id, d);
};

export const eliminar = (id) => repo.remove(id);

export const opciones = async (plan_id = null) => {
  const planes = await repo.optionsPlanes();
  const materias = plan_id ? await repo.optionsMateriasByPlan(plan_id) : [];
  return { planes, materias };
};

/* ===== Requisitos / Correquisitos ===== */

export const listarRequisitos = (materia_id) => repo.listRequisitos(materia_id);
export const listarCorrequisitos = (materia_id) => repo.listCorrequisitos(materia_id);

export const agregarRequisito = async ({ materia_id, requisito_id }) => {
  if (materia_id === requisito_id) throw new Error('Una materia no puede ser requisito de sí misma');
  if (await repo.existsReq(materia_id, requisito_id)) throw new Error('El requisito ya existe');
  return repo.addRequisito({ materia_id, requisito_id });
};

export const eliminarRequisito = (id) => repo.removeRequisito(id);

export const agregarCorrequisito = async ({ materia_id, correquisito_id }) => {
  if (materia_id === correquisito_id) throw new Error('Una materia no puede ser correquisito de sí misma');
  if (await repo.existsCo(materia_id, correquisito_id)) throw new Error('El correquisito ya existe');
  return repo.addCorrequisito({ materia_id, correquisito_id });
};

export const eliminarCorrequisito = (id) => repo.removeCorrequisito(id);

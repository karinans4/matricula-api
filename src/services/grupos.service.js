import * as repo from '../repositories/grupos.repo.js';

export const listar   = () => repo.list();
export const opciones = async () => ({
  materias: await repo.optionsMaterias(),
  profesores: await repo.optionsProfesores(),
  periodos: await repo.optionsPeriodos()
});

export const crear = async (d) => {
  const req = ['materia_id','profesor_id','periodo_id','cupo_maximo','horario'];
  for (const k of req) if (d[k] == null || d[k] === '') throw new Error(`Campo obligatorio: ${k}`);
  if (Number(d.cupo_maximo) < 0) throw new Error('cupo_maximo inválido');
  return repo.create(d);
};

export const actualizar = async (id, d) => {
  const req = ['materia_id','profesor_id','periodo_id','cupo_maximo','horario'];
  for (const k of req) if (d[k] == null || d[k] === '') throw new Error(`Campo obligatorio: ${k}`);
  if (Number(d.cupo_maximo) < 0) throw new Error('cupo_maximo inválido');
  if (await repo.hasCupoActualMayorQueMax(id, d.cupo_maximo)) {
    throw new Error('No puede establecerse un cupo máximo menor que el cupo actual');
  }
  return repo.update(id, d);
};

export const eliminar = (id) => repo.remove(id);

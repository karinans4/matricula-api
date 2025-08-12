import * as repo from '../repositories/planes.repo.js';

export const listar = () => repo.list();
export const crear = async d => {
  if (!d.carrera_id || !d.version) throw new Error('carrera_id y version son requeridos');
  return repo.create(d);
};
export const actualizar = async (id,d) => {
  if (!d.carrera_id || !d.version) throw new Error('carrera_id y version son requeridos');
  return repo.update(id,d);
};
export const eliminar = id => repo.remove(id);
export const opciones = async () => ({ carreras: await repo.optionsCarreras() });

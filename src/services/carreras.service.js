import * as repo from '../repositories/carreras.repo.js';

export const listar = () => repo.list();
export const crear = async d => {
  if (!d.nombre) throw new Error('nombre es requerido');
  return repo.create(d);
};
export const actualizar = async (id,d) => {
  if (!d.nombre) throw new Error('nombre es requerido');
  return repo.update(id,d);
};
export const eliminar = id => repo.remove(id);

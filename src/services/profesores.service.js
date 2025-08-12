import * as repo from '../repositories/profesores.repo.js';

export const listar = () => repo.list();
export const crear  = (d) => repo.create(d);
export const actualizar = (id,d) => repo.update(id,d);
export const eliminar   = (id) => repo.remove(id);

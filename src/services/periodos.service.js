import * as repo from '../repositories/periodos.repo.js';
export const listar = () => repo.getAllPeriodos();
export const crear = (d) => repo.createPeriodo(d);
export const actualizar = (id,d) => repo.updatePeriodo(id,d);
export const eliminar = (id) => repo.deletePeriodo(id);

import * as repo from '../repositories/tipos.repo.js';

export const listar = () => repo.getAllTipos();
export const crear = (d) => repo.createTipo(d);
export const actualizar = (id, d) => repo.updateTipo(id, d);
export const eliminar = (id) => repo.deleteTipo(id);

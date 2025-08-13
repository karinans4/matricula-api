import * as repo from '../repositories/matricula.repo.js';

export const crear = (d) => repo.crearMatricula(d);
export const agregar = (d) => repo.agregarDetalle(d);
export const detalle = (id) => repo.listarDetalle(id);

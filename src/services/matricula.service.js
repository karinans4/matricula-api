// src/services/matricula.service.js
import * as repo from '../repositories/matricula.repo.js';

export const crear   = (d) => repo.crearMatricula(d);
export const agregar = (d) => repo.agregarDetalle(d);
export const detalle = (id) => repo.listarDetalle(id);
export const quitar  = (detalle_id) => repo.eliminarDetalle(detalle_id);

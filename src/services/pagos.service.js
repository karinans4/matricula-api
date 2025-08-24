import * as repo from '../repositories/pagos.repo.js';

export const cotizar   = (matricula_id) => repo.cotizarMatricula(matricula_id);
export const crear     = (matricula_id) => repo.crearPagoDeMatricula(matricula_id);
export const confirmar = (pago_id)      => repo.confirmarPago(pago_id);
export const getByMat  = (matricula_id) => repo.obtenerPagoPorMatricula(matricula_id);
export const listByEst = (estudiante_id)=> repo.listarPagosPorEstudiante(estudiante_id);

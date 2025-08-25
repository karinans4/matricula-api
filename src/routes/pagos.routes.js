import { Router } from 'express';
import * as ctl from '../controllers/pagos.controller.js';

const r = Router();

// Cotización
r.get('/pagos/cotizacion/:matricula_id', ctl.cotizar);

// Consultas
r.get('/pagos/matricula/:matricula_id', ctl.getByMatricula);
r.get('/pagos/estudiante/:estudiante_id', ctl.listByEstudiante);

// Crear/actualizar pago pendiente
r.post('/pagos', ctl.crear);

// Confirmar pago manual (si hicieras un flujo en dos pasos)
r.post('/pagos/:pago_id/confirmar', ctl.confirmar);

// MODO DEMO (sin pasarela): crea y confirma en un paso
r.post('/pagos/mock/confirm', ctl.mockConfirm);

export default r;

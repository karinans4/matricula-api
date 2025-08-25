import { Router } from 'express';
import * as ctl from '../controllers/pagos.controller.js';

const r = Router();

// Cotización
r.get('/pagos/cotizacion/:matricula_id', ctl.cotizar);

// Crear/actualizar pago pendiente
r.post('/pagos', ctl.crear);

// Confirmar pago manual (post-confirmación del cliente)
r.post('/pagos/:pago_id/confirmar', ctl.confirmar);

// Consultas
r.get('/pagos/matricula/:matricula_id', ctl.getByMatricula);
r.get('/pagos/estudiante/:estudiante_id', ctl.listByEstudiante);

// *** NUEVO: crear PaymentIntent de Stripe ***
r.post('/pagos/stripe/create-intent', ctl.crearIntent);

export default r;


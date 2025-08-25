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

// Confirmar pago manual (post-confirmación del cliente)
r.post('/pagos/:pago_id/confirmar', ctl.confirmar);

// Stripe (opcional): crear PaymentIntent
r.post('/pagos/stripe/create-intent', ctl.crearIntent);

// MODO DEMO (sin Stripe): crea y confirma en un paso
r.post('/pagos/mock/confirm', ctl.mockConfirm);

export default r;

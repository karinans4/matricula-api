// src/controllers/pagos.controller.js
import Stripe from 'stripe';
import * as svc from '../services/pagos.service.js';

const stripeSecret = process.env.STRIPE_SECRET_KEY || '';
const stripe = stripeSecret ? new Stripe(stripeSecret) : null;

const toInt = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};

export const cotizar = async (req, res) => {
  try {
    const id = toInt(req.params?.matricula_id || req.query?.matricula_id);
    const out = await svc.cotizar(id);
    return res.json(out);
  } catch (e) {
    return res.status(400).json({ ok: 0, mensaje: e.message });
  }
};

export const crear = async (req, res) => {
  try {
    const id = toInt(req.body?.matricula_id);
    const out = await svc.crear(id);
    if (out?.ok === 1) return res.json(out);
    return res.status(400).json(out || { ok: 0, mensaje: 'No fue posible crear el pago' });
  } catch (e) {
    return res.status(400).json({ ok: 0, mensaje: e.message });
  }
};

/**
 * Crea PaymentIntent con el total cotizado y devuelve clientSecret.
 * Body: { matricula_id }
 * Respuesta: { ok, clientSecret, pago_id, amount, currency }
 */
export const crearIntent = async (req, res) => {
  try {
    if (!stripe) {
      return res.status(500).json({ ok: 0, mensaje: 'Stripe no está configurado (falta STRIPE_SECRET_KEY)' });
    }

    const matricula_id = Number(req.body?.matricula_id);
    if (!Number.isFinite(matricula_id)) {
      return res.status(400).json({ ok: 0, mensaje: 'matricula_id inválido' });
    }

    // 1) cotización
    const c = await svc.cotizar(matricula_id);
    if (!c?.monto_total) {
      return res.status(400).json({ ok: 0, mensaje: 'No hay monto para cobrar' });
    }

    // 2) asegurar/crear pago pendiente
    const pend = await svc.crear(matricula_id);
    if (pend?.ok !== 1) {
      return res.status(400).json(pend || { ok: 0, mensaje: 'No fue posible crear el pago' });
    }

    const amount = Math.round(Number(c.monto_total) * 100); // centavos
    const currency = (process.env.STRIPE_CURRENCY || 'usd').toLowerCase();

    // 3) crear PaymentIntent
    const intent = await stripe.paymentIntents.create({
      amount,
      currency,
      description: `Matrícula #${matricula_id}`,
      payment_method_types: ['card'],
      metadata: {
        pago_id: String(pend.pago_id),
        matricula_id: String(matricula_id),
        estudiante_id: String(c.estudiante_id || '')
      }
    });

    return res.json({
      ok: 1,
      clientSecret: intent.client_secret,
      pago_id: pend.pago_id,
      amount: intent.amount,
      currency: intent.currency
    });
  } catch (e) {
    return res.status(400).json({ ok: 0, mensaje: e.message });
  }
};

export const confirmar = async (req, res) => {
  try {
    const pago_id = toInt(req.params?.pago_id);
    const out = await svc.confirmar(pago_id);
    if (out?.ok === 1) return res.json(out);
    return res.status(400).json(out || { ok: 0, mensaje: 'No fue posible confirmar el pago' });
  } catch (e) {
    return res.status(400).json({ ok: 0, mensaje: e.message });
  }
};

export const getByMatricula = async (req, res) => {
  try {
    const id = toInt(req.params?.matricula_id);
    const out = await svc.getByMat(id);
    return res.json(out || {});
  } catch (e) {
    return res.status(400).json({ ok: 0, mensaje: e.message });
  }
};

export const listByEstudiante = async (req, res) => {
  try {
    const id = toInt(req.params?.estudiante_id);
    const out = await svc.listByEst(id);
    return res.json(out || []);
  } catch (e) {
    return res.status(400).json({ ok: 0, mensaje: e.message });
  }
};

import { Router } from 'express';

const r = Router();
r.get('/config/stripe-pk', (_req, res) => {
  res.json({ pk: process.env.STRIPE_PUBLISHABLE_KEY || '' });
});
export default r;
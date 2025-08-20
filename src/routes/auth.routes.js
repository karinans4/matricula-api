// src/routes/auth.routes.js (ejemplo)
import { Router } from 'express';
import { postLogin } from '../controllers/auth.controller.js';
const r = Router();
r.post('/login', postLogin);
export default r;

// app.js
import authRoutes from './src/routes/auth.routes.js';
app.use(express.json());
app.use('/api', authRoutes);

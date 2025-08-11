import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes.js';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
app.use(cors());
app.use(express.json());

// 👉 servir carpeta public/
app.use(express.static('public'));

// (opcional) si quieres mantener /health:
app.get('/health', (_req, res) => res.send('OK'));

// Rutas API
app.use('/api', authRoutes);

export default app;

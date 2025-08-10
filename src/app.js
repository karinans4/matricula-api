import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes.js';

const app = express();
app.use(cors());
app.use(express.json());

// Home y health
app.get('/', (_req, res) => {
  res.send('API Matrícula online ✅');
});
app.get('/health', (_req, res) => res.send('OK'));

// Rutas
app.use('/api', authRoutes);

export default app;

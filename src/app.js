// app.js
import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './routes/auth.routes.js';
import periodosRoutes from './routes/periodos.routes.js';
import catalogosRoutes from './routes/catalogos.routes.js';
import tiposRoutes from './routes/tipos.routes.js';
import profesoresRoutes from './routes/profesores.routes.js';
import estudiantesRoutes from './routes/estudiantes.routes.js';
import carrerasRoutes from './routes/carreras.routes.js';
import planesRoutes from './routes/planes.routes.js';
import materiasRoutes from './routes/materias.routes.js';
import gruposRoutes from './routes/grupos.routes.js';
import matriculaRoutes from './routes/matricula.routes.js';
import ofertaRoutes from './routes/oferta.routes.js';
import basicosRoutes from './routes/basicos.routes.js';
import pagosRoutes from './routes/pagos.routes.js';
import configRoutes from './routes/config.routes.js';
import misRoutes from './routes/mis.routes.js';
import profRoutes from './routes/prof.routes.js';

const app = express();

// __dirname en ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir estáticos: intenta ./public (misma carpeta) y, si no existe, ../public (raíz del repo)
const publicHere = path.join(__dirname, 'public');
const publicUp   = path.join(__dirname, '../public');
const staticDir  = fs.existsSync(publicHere) ? publicHere : publicUp;
app.use(express.static(staticDir));

// Redirigir la raíz al dashboard (ajusta si quieres otra página)
app.get('/', (_req, res) => res.redirect('/dashboard.html'));

// Healthcheck
app.get('/health', (_req, res) => res.send('OK'));

// Rutas API
app.use('/api', authRoutes);
app.use('/api', periodosRoutes);
app.use('/api', catalogosRoutes);
app.use('/api', tiposRoutes);
app.use('/api', profesoresRoutes);
app.use('/api', estudiantesRoutes);
app.use('/api', carrerasRoutes);
app.use('/api', planesRoutes);
app.use('/api', materiasRoutes);
app.use('/api', gruposRoutes);
app.use('/api', matriculaRoutes);
app.use('/api', ofertaRoutes);
app.use('/api', basicosRoutes);
app.use('/api', pagosRoutes);
app.use('/api', configRoutes);
app.use('/api', misRoutes);
app.use('/api', profRoutes);


// 404 API
app.use('/api/*', (_req, res) => res.status(404).json({ error: 'Not found' }));

export default app;

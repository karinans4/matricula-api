// app.js (en la raíz del proyecto)
import express from 'express';
import cors from 'cors';

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

import path from 'path';
import { fileURLToPath } from 'url';

const app = express();

// ESM: obtener __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos desde /public (mismo nivel que app.js)
app.use(express.static(path.join(__dirname, 'public')));

// Healthcheck
app.get('/health', (_req, res) => res.send('OK'));

// API
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

export default app;

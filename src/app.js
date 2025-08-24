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

import path from 'path';
import { fileURLToPath } from 'url';
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());
app.use(express.json());

app.use(express.static('public'));

app.get('/health', (req, res) => res.send('OK'));

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

export default app;



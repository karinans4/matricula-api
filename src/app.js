import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes.js';
import periodosRoutes from './routes/periodos.routes.js'; 
import catalogosRoutes from './routes/catalogos.routes.js';
import tiposRoutes from './routes/tipos.routes.js';
import profesoresRoutes from './routes/profesores.routes.js';
import estudiantesRoutes from './routes/estudiantes.routes.js';


import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
app.use(cors());
app.use(express.json());

app.use(express.static('public'));

// Rutas API
app.use('/api', authRoutes);
app.use('/api', periodosRoutes); 
app.use('/api', catalogosRoutes);
app.use('/api', tiposRoutes);
app.use('/api', profesoresRoutes);
app.use('/api', estudiantesRoutes);




export default app;



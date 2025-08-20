// src/routes/auth.routes.js
import { Router } from 'express';
import { postLogin } from '../controllers/auth.controller.js'; // <- ¡relativo!

const r = Router();
r.post('/login', postLogin);

export default r;

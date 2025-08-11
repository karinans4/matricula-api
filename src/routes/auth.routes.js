import { Router } from 'express';
import { postLogin } from '../controllers/auth.controller.js';

const router = Router();
router.post('/login', postLogin);   // ← /api/login

export default router;

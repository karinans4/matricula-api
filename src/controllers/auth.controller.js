import { loginBasico } from '../services/auth.service.js';

export async function postLogin(req, res) {
  try {
    const { correo, contrasena } = req.body;
    if (!correo || !contrasena) {
      return res.status(400).json({ error: 'Correo y contraseña son requeridos' });
    }
    const result = await loginBasico({ correo, contrasena });
    if (!result.ok) return res.status(400).json({ error: result.error });
    return res.json(result.data);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}

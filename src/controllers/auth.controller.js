import { loginBasico } from '../services/auth.service.js';
import { ok, badRequest, serverError } from '../utils/http.js';

export async function postLogin(req, res) {
  try {
    const { correo, contrasena } = req.body;
    const result = await loginBasico({ correo, contrasena });
    if (!result.ok) return badRequest(res, result.error);
    return ok(res, result.data);
  } catch (e) {
    return serverError(res, e);
  }
}

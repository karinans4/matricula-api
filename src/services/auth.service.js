import { spLoginUsuario } from '../repositories/user.repo.js';

export async function loginBasico({ correo, contrasena }) {
  const usuario = await spLoginUsuario(correo, contrasena);
  if (!usuario) return { ok: false, error: 'Credenciales inválidas' };
  return { ok: true, data: usuario };
}

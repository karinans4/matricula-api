import { spLoginUsuario } from '../repositories/user.repo.js';

export async function loginBasico({ correo, contrasena }) {
  if (!correo || !contrasena) {
    return { ok: false, error: 'Correo y contraseña son requeridos' };
  }
  const usuario = await spLoginUsuario(correo, contrasena);
  if (!usuario) {
    return { ok: false, error: 'Credenciales inválidas' };
  }
  // Sin JWT ni sesiones: devolvemos el usuario tal cual
  return { ok: true, data: usuario };
}

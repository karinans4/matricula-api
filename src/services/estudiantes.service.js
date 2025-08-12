import * as repo from '../repositories/estudiantes.repo.js';

export const listar = () => repo.list();

export const crear = async (d) => {
  const req = ['nombre','carnet','correo','usuario_id','plan_id'];
  for (const k of req) if (d[k] == null || d[k] === '') throw new Error(`Campo obligatorio: ${k}`);

  if (await repo.existsCarnet(d.carnet)) throw new Error('El carnet ya existe');
  if (await repo.existsUsuarioVinculado(d.usuario_id)) throw new Error('Ese usuario ya está vinculado a un estudiante');

  return repo.create(d);
};

export const actualizar = async (id, d) => {
  const req = ['nombre','carnet','correo','usuario_id','plan_id'];
  for (const k of req) if (d[k] == null || d[k] === '') throw new Error(`Campo obligatorio: ${k}`);

  if (await repo.existsCarnet(d.carnet, id)) throw new Error('El carnet ya existe');
  if (await repo.existsUsuarioVinculado(d.usuario_id, id)) throw new Error('Ese usuario ya está vinculado a un estudiante');

  return repo.update(id, d);
};

export const eliminar = (id) => repo.remove(id);

// Opciones para selects
export const opciones = async () => ({
  usuarios: await repo.optionsUsuarios(),
  planes: await repo.optionsPlanes()
});

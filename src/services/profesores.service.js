import * as repo from '../repositories/profesores.repo.js';

export const listar = () => repo.list();

export const crear = async (d) => {
  const req = ['nombre', 'correo'];
  for (const k of req) {
    if (d[k] == null || String(d[k]).trim() === '') {
      throw new Error(`Campo obligatorio: ${k}`);
    }
  }
  if (d.cedula && await repo.existsCedula(d.cedula)) {
    throw new Error('La cédula ya existe');
  }

  const r = await repo.create({
    nombre: d.nombre,
    apellido: d.apellido || '',
    correo: d.correo || '',
    direccion: d.direccion || '',
    cedula: d.cedula || ''
  });
  return { insertId: r.insertId };
};

export const actualizar = async (id, d) => {
  const req = ['nombre', 'correo'];
  for (const k of req) {
    if (d[k] == null || String(d[k]).trim() === '') {
      throw new Error(`Campo obligatorio: ${k}`);
    }
  }

  if (d.cedula && await repo.existsCedula(d.cedula, id)) {
    throw new Error('La cédula ya existe');
  }

  const r = await repo.update(id, {
    nombre: d.nombre,
    apellido: d.apellido || '',
    correo: d.correo || '',
    direccion: d.direccion || '',
    cedula: d.cedula || ''
  });
  return { affectedRows: r.affectedRows };
};

export const eliminar = (id) => repo.remove(id);

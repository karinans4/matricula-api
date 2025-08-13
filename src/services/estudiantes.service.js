import { pool } from '../config/db.js';
import * as repo from '../repositories/estudiantes.repo.js';
export const byUsuario = (usuario_id) => repo.getByUsuarioId(usuario_id);


export const listar = () => repo.list();

export const crear = async (d) => {
  const req = ['nombre','carnet','correo','plan_id'];
  for (const k of req) if (d[k] == null || d[k] === '') throw new Error(`Campo obligatorio: ${k}`);

  // Validar carnet único
  if (await repo.existsCarnet(d.carnet)) throw new Error('El carnet ya existe');

  // Si viene usuario existente, validar que no esté vinculado a otro estudiante
  if (!d.crear_usuario && d.usuario_id) {
    if (await repo.existsUsuarioVinculado(d.usuario_id)) throw new Error('Ese usuario ya está vinculado a un estudiante');
  }

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    let usuarioId = d.usuario_id;

    if (d.crear_usuario) {
      if (!d.usuario_correo || !d.usuario_contrasena) {
        throw new Error('usuario_correo y usuario_contrasena son obligatorios al crear usuario');
      }
      // validar correo único
      const existe = await repo.usuarioByCorreo(d.usuario_correo);
      if (existe) throw new Error('El correo de usuario ya existe');

      // crear usuario (rol estudiante)
      usuarioId = await repo.createUsuario(conn, {
        nombre: d.nombre,
        apellido: d.apellido || '',
        correo: d.usuario_correo,
        contrasena: d.usuario_contrasena, // (simple, sin hash, según tu alcance)
        rol_id: 3
      });
    }

    // crear estudiante
    const [r] = await conn.query(`
      INSERT INTO Estudiantes(nombre, apellido, carnet, correo, usuario_id, plan_id)
      VALUES(?,?,?,?,?,?)
    `, [d.nombre, d.apellido || '', d.carnet, d.correo, usuarioId, d.plan_id]);

    await conn.commit();
    return { insertId: r.insertId };
  } catch (e) {
    await conn.rollback();
    throw e;
  } finally {
    conn.release();
  }
};

export const actualizar = async (id, d) => {
  const req = ['nombre','carnet','correo','usuario_id','plan_id'];
  for (const k of req) if (d[k] == null || d[k] === '') throw new Error(`Campo obligatorio: ${k}`);

  if (await repo.existsCarnet(d.carnet, id)) throw new Error('El carnet ya existe');
  if (await repo.existsUsuarioVinculado(d.usuario_id, id)) throw new Error('Ese usuario ya está vinculado a un estudiante');

  return repo.update(id, d);
};

export const eliminar  = (id) => repo.remove(id);

export const opciones = async () => ({
  usuarios: await repo.optionsUsuarios(),
  planes: await repo.optionsPlanes()
});

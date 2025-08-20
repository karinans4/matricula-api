import * as svc from '../services/profesores.service.js';

export const getAll = async (_req, res) => {
  try {
    res.json(await svc.listar());
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

export const post = async (req, res) => {
  try {
    const { nombre, apellido, correo, direccion, cedula } = req.body || {};
    if (!nombre || !correo) {
      return res.status(400).json({ error: 'nombre y correo son obligatorios' });
    }
    const r = await svc.crear({
      nombre: nombre.trim(),
      apellido: (apellido || '').trim(),
      correo: (correo || '').trim(),
      direccion: (direccion || '').trim(),
      cedula: (cedula || '').trim()
    });
    res.status(201).json({ id: r.insertId });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

export const put = async (req, res) => {
  try {
    const { nombre, apellido, correo, direccion, cedula } = req.body || {};
    if (!nombre || !correo) {
      return res.status(400).json({ error: 'nombre y correo son obligatorios' });
    }
    const r = await svc.actualizar(Number(req.params.id), {
      nombre: nombre.trim(),
      apellido: (apellido || '').trim(),
      correo: (correo || '').trim(),
      direccion: (direccion || '').trim(),
      cedula: (cedula || '').trim()
    });
    res.json({ updated: r.affectedRows });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

export const del = async (req, res) => {
  try {
    const r = await svc.eliminar(Number(req.params.id));
    res.json({ deleted: r.affectedRows });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

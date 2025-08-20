import { Router } from 'express';
import { pool } from '../config/db.js';

const r = Router();

/**
 * Oferta de grupos por periodo y plan
 * Usa el SP: sp_listar_materias_impartidas(periodo_id, plan_id)
 */
r.get('/materias-impartidas', async (req, res) => {
  try {
    const { periodo_id, plan_id } = req.query;
    if (!periodo_id || !plan_id) {
      return res.status(400).json({ error: 'periodo_id y plan_id son requeridos' });
    }

    const [resultsets] = await pool.query(
      'CALL sp_listar_materias_impartidas(?, ?)',
      [Number(periodo_id), Number(plan_id)]
    );

    const rows = Array.isArray(resultsets?.[0]) ? resultsets[0] : [];

    // Normalizar nombres de campos para el frontend
    const norm = rows.map((g) => {
      const grupo_id = (g.grupo_id ?? g.id) ?? null;

      // Mezcla segura de ?? y || con paréntesis
      const profesor = (
        g.profesor ??
        [g.profesor_nombre, g.profesor_apellido].filter(Boolean).join(' ').trim()
      ) || null;

      return {
        grupo_id,
        codigo: g.codigo ?? null,
        materia: (g.materia ?? g.nombre) ?? null,
        profesor,
        horario: g.horario ?? null,
        cupo_maximo: (g.cupo_maximo ?? g.max_cupo ?? g.cupoMax) ?? 0,
        cupo_actual: (g.cupo_actual ?? g.inscritos) ?? 0,
      };
    });

    res.json(norm);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default r;

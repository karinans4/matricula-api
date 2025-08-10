import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { pool } from './db.js';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => res.send('OK'));

/* ---------- ENDPOINTS BASE ---------- */

// Login -> sp_login_usuario
app.post('/api/login', async (req, res) => {
  try {
    const { correo, contrasena } = req.body;
    const [rows] = await pool.query('CALL sp_login_usuario(?,?)', [correo, contrasena]);
    // CALL retorna un array de recordsets; el primero está en rows[0]
    res.json(rows[0][0] || null);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Periodos activos -> sp_listar_periodos_activos
app.get('/api/periodos/activos', async (_req, res) => {
  try {
    const [rows] = await pool.query('CALL sp_listar_periodos_activos()');
    res.json(rows[0]);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Tipos matrícula -> sp_listar_tipos_matricula
app.get('/api/tipos-matricula', async (_req, res) => {
  try {
    const [rows] = await pool.query('CALL sp_listar_tipos_matricula()');
    res.json(rows[0]);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Listar materias impartidas por periodo y plan -> sp_listar_materias_impartidas
app.get('/api/materias-impartidas', async (req, res) => {
  try {
    const { periodo_id, plan_id } = req.query;
    const [rows] = await pool.query('CALL sp_listar_materias_impartidas(?,?)', [periodo_id, plan_id]);
    res.json(rows[0]);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Registrar matrícula -> sp_registrar_matricula (usa OUT vars)
app.post('/api/matricula/crear', async (req, res) => {
  try {
    const { estudiante_id, periodo_id, tipo_matricula_id } = req.body;
    const sql = `
      SET @matricula_id := 0; SET @ok := 0; SET @msg := '';
      CALL sp_registrar_matricula(?,?,?, @matricula_id, @ok, @msg);
      SELECT @matricula_id AS matricula_id, @ok AS ok, @msg AS mensaje;
    `;
    const [_, __, [out]] = await pool.query(sql, [estudiante_id, periodo_id, tipo_matricula_id]);
    res.json(out[0]);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Agregar detalle -> sp_agregar_detalle_matricula
app.post('/api/matricula/agregar-detalle', async (req, res) => {
  try {
    const { matricula_id, materia_impartida_id } = req.body;
    const sql = `
      SET @ok := 0; SET @msg := '';
      CALL sp_agregar_detalle_matricula(?, ?, @ok, @msg);
      SELECT @ok AS ok, @msg AS mensaje;
    `;
    const [_, __, [out]] = await pool.query(sql, [matricula_id, materia_impartida_id]);
    res.json(out[0]);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Generar pago -> sp_generar_pago_matricula
app.post('/api/pago/generar', async (req, res) => {
  try {
    const { matricula_id } = req.body;
    const sql = `
      SET @pid := 0; SET @ok := 0; SET @msg := '';
      CALL sp_generar_pago_matricula(?, @pid, @ok, @msg);
      SELECT @pid AS pago_id, @ok AS ok, @msg AS mensaje;
    `;
    const [_, __, [out]] = await pool.query(sql, [matricula_id]);
    res.json(out[0]);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Realizar pago -> sp_realizar_pago
app.post('/api/pago/realizar', async (req, res) => {
  try {
    const { pago_id } = req.body;
    const sql = `
      SET @ok := 0; SET @msg := '';
      CALL sp_realizar_pago(?, @ok, @msg);
      SELECT @ok AS ok, @msg AS mensaje;
    `;
    const [_, __, [out]] = await pool.query(sql, [pago_id]);
    res.json(out[0]);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Obtener recibo (2 resultsets)
app.get('/api/pago/recibo/:pago_id', async (req, res) => {
  try {
    const { pago_id } = req.params;
    const [resultsets] = await pool.query('CALL sp_obtener_recibo(?)', [pago_id]);
    // resultsets[0] = encabezado, resultsets[1] = detalle
    res.json({ encabezado: resultsets[0], detalle: resultsets[1] });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API escuchando en puerto ${PORT}`));

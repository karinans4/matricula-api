import { pool } from '../config/db.js';

// Usa el SP existente sp_registrar_matricula
export const crearMatricula = async ({ estudiante_id, periodo_id, tipo_matricula_id }) => {
  const sql = `
    SET @matricula_id := 0; SET @ok := 0; SET @msg := '';
    CALL sp_registrar_matricula(?,?,?, @matricula_id, @ok, @msg);
    SELECT @matricula_id AS matricula_id, @ok AS ok, @msg AS mensaje;
  `;
  const [ , , [out] ] = await pool.query(sql, [estudiante_id, periodo_id, tipo_matricula_id]);
  return out[0]; // {matricula_id, ok, mensaje}
};

// Usa el SP existente sp_agregar_detalle_matricula (valida cupo/requisitos/correquisitos)
export const agregarDetalle = async ({ matricula_id, materia_impartida_id }) => {
  const sql = `
    SET @ok := 0; SET @msg := '';
    CALL sp_agregar_detalle_matricula(?, ?, @ok, @msg);
    SELECT @ok AS ok, @msg AS mensaje;
  `;
  const [ , , [out] ] = await pool.query(sql, [matricula_id, materia_impartida_id]);
  return out[0]; // {ok, mensaje}
};

// Listar materias inscritas en una matrícula (encabezado simple)
export const listarDetalle = async (matricula_id) => {
  const [rows] = await pool.query(`
    SELECT dm.id AS detalle_id,
           mi.id  AS grupo_id,
           m.codigo, m.nombre, m.creditos,
           p.nombre AS profesor_nombre, COALESCE(p.apellido,'') AS profesor_apellido,
           mi.horario
    FROM Detalle_Matricula dm
    JOIN Materias_Impartidas mi ON mi.id = dm.materia_impartida_id
    JOIN Materias m ON m.id = mi.materia_id
    JOIN Profesores p ON p.id = mi.profesor_id
    WHERE dm.matricula_id = ?
    ORDER BY m.codigo
  `, [matricula_id]);
  return rows;
};

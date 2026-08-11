-- Insertar tipos de trámite de prueba
INSERT INTO tipos_tramite (id, nombre, descripcion, costo, activo) 
VALUES (1, 'Certificado de Estudios', 'Certificado oficial de notas por semestre', 50.00, true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO tipos_tramite (id, nombre, descripcion, costo, activo) 
VALUES (2, 'Constancia de Matrícula', 'Constancia que acredita la matrícula actual', 20.00, true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO tipos_tramite (id, nombre, descripcion, costo, activo) 
VALUES (3, 'Bachillerato Automático', 'Trámite para obtención de grado de bachiller', 500.00, true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO tipos_tramite (id, nombre, descripcion, costo, activo) 
VALUES (4, 'Constancia de Egresado', 'Documento que acredita haber culminado el plan de estudios', 100.00, true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO tipos_tramite (id, nombre, descripcion, costo, activo) 
VALUES (5, 'Certificado de Idioma Extranjero', 'Certificación que acredita el nivel de dominio de un idioma', 80.00, true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO tipos_tramite (id, nombre, descripcion, costo, activo) 
VALUES (6, 'Duplicado de Carné Universitario', 'Emisión de un nuevo carné por pérdida o deterioro', 35.00, true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO tipos_tramite (id, nombre, descripcion, costo, activo) 
VALUES (7, 'Sílabos Visados', 'Copia de los sílabos de los cursos aprobados, visados por la facultad', 10.00, true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO tipos_tramite (id, nombre, descripcion, costo, activo) 
VALUES (8, 'Constancia de Conducta', 'Documento que certifica que el estudiante no tiene sanciones disciplinarias', 15.00, true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO tipos_tramite (id, nombre, descripcion, costo, activo) 
VALUES (9, 'Certificado de Prácticas Pre-Profesionales', 'Validación de prácticas pre-profesionales realizadas', 45.00, true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO tipos_tramite (id, nombre, descripcion, costo, activo) 
VALUES (10, 'Constancia de Tercio Superior', 'Documento que certifica que el estudiante pertenece al tercio superior de su promoción', 30.00, true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO tipos_tramite (id, nombre, descripcion, costo, activo) 
VALUES (11, 'Constancia de Quinto Superior', 'Documento que certifica que el estudiante pertenece al quinto superior de su promoción', 30.00, true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO tipos_tramite (id, nombre, descripcion, costo, activo) 
VALUES (12, 'Constancia de No Adeudo', 'Certificación de no tener deudas pendientes con la universidad (biblioteca, pensiones, etc.)', 25.00, true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO tipos_tramite (id, nombre, descripcion, costo, activo) 
VALUES (13, 'Reserva de Matrícula', 'Solicitud para suspender temporalmente los estudios conservando el derecho a matrícula', 60.00, true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO tipos_tramite (id, nombre, descripcion, costo, activo) 
VALUES (14, 'Reincorporación de Estudios', 'Trámite para retomar los estudios después de una reserva de matrícula', 70.00, true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO tipos_tramite (id, nombre, descripcion, costo, activo) 
VALUES (15, 'Trámite de Titulación', 'Proceso y revisión de documentos para la obtención del Título Profesional', 800.00, true)
ON CONFLICT (id) DO NOTHING;

-- Insertar usuario administrador por defecto
-- email: admin@edugestor.com, password: admin
INSERT INTO usuarios (id, dni, nombres, apellidos, email, password, rol) 
VALUES (1, '00000000', 'Admin', 'Sistema', 'admin@edugestor.com', '$2b$10$rv3hrIKCIHVarw71uDxkxO8WMkQVtPOk0E97N4vfwVXSSFeYX4uK.', 'ROLE_ADMIN')
ON CONFLICT (id) DO UPDATE SET password = EXCLUDED.password;

-- Actualizar las secuencias de PostgreSQL para evitar el error "duplicate key value violates unique constraint"
SELECT setval(pg_get_serial_sequence('tipos_tramite', 'id'), coalesce(max(id), 1), max(id) IS NOT null) FROM tipos_tramite;
SELECT setval(pg_get_serial_sequence('usuarios', 'id'), coalesce(max(id), 1), max(id) IS NOT null) FROM usuarios;


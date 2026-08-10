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

-- Insertar usuario administrador por defecto
-- email: admin@edugestor.com, password: admin
INSERT INTO usuarios (id, dni, nombres, apellidos, email, password, rol) 
VALUES (1, '00000000', 'Admin', 'Sistema', 'admin@edugestor.com', '$2b$10$rv3hrIKCIHVarw71uDxkxO8WMkQVtPOk0E97N4vfwVXSSFeYX4uK.', 'ROLE_ADMIN')
ON CONFLICT (id) DO UPDATE SET password = EXCLUDED.password;

-- Actualizar las secuencias de PostgreSQL para evitar el error "duplicate key value violates unique constraint"
SELECT setval(pg_get_serial_sequence('tipos_tramite', 'id'), coalesce(max(id), 1), max(id) IS NOT null) FROM tipos_tramite;
SELECT setval(pg_get_serial_sequence('usuarios', 'id'), coalesce(max(id), 1), max(id) IS NOT null) FROM usuarios;


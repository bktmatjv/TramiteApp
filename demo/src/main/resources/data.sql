-- Insertar tutores de prueba
INSERT IGNORE INTO tutores (id, nombre, especialidad) VALUES (1, 'Juan Perez', 'Matemáticas');
INSERT IGNORE INTO tutores (id, nombre, especialidad) VALUES (2, 'Maria Lopez', 'Física');
INSERT IGNORE INTO tutores (id, nombre, especialidad) VALUES (3, 'Carlos Sanchez', 'Programación');

-- Insertar usuario administrador
-- username: admin, password: admin
INSERT IGNORE INTO usuarios (id, username, password, rol) VALUES (1, 'admin', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVKIUi', 'ADMIN');

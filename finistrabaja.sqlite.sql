DROP TABLE IF EXISTS postulantes;
DROP TABLE IF EXISTS ofertas;

CREATE TABLE ofertas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    titulo TEXT NOT NULL,
    carrera TEXT NOT NULL,
    empresa TEXT NOT NULL,
    descripcion TEXT NOT NULL,
    sueldo INTEGER DEFAULT 0,
    jornada TEXT NOT NULL,
    modalidad TEXT NOT NULL,
    ubicacion TEXT DEFAULT 'Sin especificar',
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE postulantes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    oferta_id INTEGER NOT NULL,
    nombre TEXT NOT NULL,
    carrera TEXT NOT NULL,
    carta TEXT DEFAULT '',
    fecha_postulacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (oferta_id) REFERENCES ofertas(id) ON DELETE CASCADE
);

INSERT INTO ofertas (id, titulo, carrera, empresa, descripcion, sueldo, jornada, modalidad, ubicacion) VALUES
(1, 'Desarrollador Full Stack', 'Ingenieria Informatica', 'TechChile SpA', 'Buscamos desarrollador con experiencia en React y Node.js para unirse a nuestro equipo agil en proyecto de e-commerce.', 1400000, 'Tiempo completo', 'Hibrida', 'Providencia, Santiago'),
(2, 'Disenadora UX/UI Junior', 'Diseno Digital', 'Agencia Creativa Norte', 'Unete a nuestro equipo de diseno para crear experiencias digitales memorables para clientes nacionales e internacionales.', 900000, 'Tiempo completo', 'Presencial', 'Las Condes, Santiago'),
(3, 'Analista de Datos', 'Ingenieria Informatica', 'DataMinds', 'Posicion ideal para estudiantes avanzados que dominen Python, SQL y tengan interes en machine learning aplicado.', 1100000, 'Part-time', 'Remota', 'Remota (Chile)'),
(4, 'Asistente de Marketing Digital', 'Publicidad', 'Grupo Publicitario Sur', 'Apoya en la gestion de campanas en redes sociales, creacion de contenido y analisis de metricas de performance.', 700000, 'Part-time', 'Hibrida', 'Vitacura, Santiago'),
(5, 'Contador Junior', 'Contabilidad', 'Auditores Asociados', 'Apoya en revision de estados financieros, conciliaciones bancarias y declaraciones tributarias mensuales.', 850000, 'Tiempo completo', 'Presencial', 'Santiago Centro'),
(6, 'Asistente Legal', 'Derecho', 'Estudio Juridico Ramirez', 'Apoyo en redaccion de contratos, investigacion juridica y atencion de clientes en materias civiles y comerciales.', 750000, 'Tiempo completo', 'Presencial', 'Nunoa, Santiago'),
(7, 'Practicante de Arquitectura', 'Arquitectura', 'Estudio Forma y Espacio', 'Colabora en proyectos residenciales y comerciales, elaboracion de planos, renders y presentaciones a clientes.', 500000, 'Part-time', 'Presencial', 'Providencia, Santiago'),
(8, 'Asistente de Psicologia Clinica', 'Psicologia', 'Centro de Salud Mental Bienestar', 'Apoyo en atencion de pacientes, aplicacion de pruebas psicologicas y elaboracion de informes bajo supervision.', 650000, 'Part-time', 'Presencial', 'Maipu, Santiago'),
(9, 'Desarrollador Mobile iOS', 'Ingenieria Informatica', 'AppMakers Ltda', 'Desarrollo de aplicacion movil en Swift para plataforma de delivery local. Proyecto de 6 meses con posibilidad de continuidad.', 1250000, 'Por proyecto', 'Remota', 'Remota (Chile)');

INSERT INTO postulantes (oferta_id, nombre, carrera, carta) VALUES
(1, 'Rodrigo Paredes', 'Ing. Informatica', 'Me interesa el puesto...'),
(4, 'Victor Cabrera', 'Ing. Civil', '70 años de experiencia...'),
(4, 'Mauricio Hidalgo', 'Data Scientist', 'Tengo experiencia previa en Pandas...');

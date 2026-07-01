// BASE DE DATOS DE PRUEBA

let baseDeDatosLocal = {
  ofertas: [
    {
      id: 1,
      titulo: "Desarrollador Full Stack",
      carrera: "Ingeniería Informática",
      empresa: "TechChile SpA",
      descripcion: "Buscamos desarrollador con experiencia en React y Node.js para unirse a nuestro equipo ágil en proyecto de e-commerce.",
      sueldo: 1400000,
      jornada: "Tiempo completo",
      modalidad: "Híbrida",
      ubicacion: "Providencia, Santiago",
      postulantes: [
        { nombre: "María González", carrera: "Ing. Informática", carta: "Me interesa el puesto..." }
      ]
    },
    {
      id: 2,
      titulo: "Diseñadora UX/UI Junior",
      carrera: "Diseño Digital",
      empresa: "Agencia Creativa Norte",
      descripcion: "Únete a nuestro equipo de diseño para crear experiencias digitales memorables para clientes nacionales e internacionales.",
      sueldo: 900000,
      jornada: "Tiempo completo",
      modalidad: "Presencial",
      ubicacion: "Las Condes, Santiago",
      postulantes: []
    },
    {
      id: 3,
      titulo: "Analista de Datos",
      carrera: "Ingeniería Informática",
      empresa: "DataMinds",
      descripcion: "Posición ideal para estudiantes avanzados que dominen Python, SQL y tengan interés en machine learning aplicado.",
      sueldo: 1100000,
      jornada: "Part-time",
      modalidad: "Remota",
      ubicacion: "Remota (Chile)",
      postulantes: []
    },
    {
      id: 4,
      titulo: "Asistente de Marketing Digital",
      carrera: "Publicidad",
      empresa: "Grupo Publicitario Sur",
      descripcion: "Apoya en la gestión de campañas en redes sociales, creación de contenido y análisis de métricas de performance.",
      sueldo: 700000,
      jornada: "Part-time",
      modalidad: "Híbrida",
      ubicacion: "Vitacura, Santiago",
      postulantes: [
        { nombre: "Juan Pérez",  carrera: "Publicidad", carta: "" },
        { nombre: "Ana Muñoz",   carrera: "Publicidad", carta: "Tengo experiencia previa en redes..." }
      ]
    },
    {
      id: 5,
      titulo: "Contador Junior",
      carrera: "Contabilidad",
      empresa: "Auditores Asociados",
      descripcion: "Apoya en revisión de estados financieros, conciliaciones bancarias y declaraciones tributarias mensuales.",
      sueldo: 850000,
      jornada: "Tiempo completo",
      modalidad: "Presencial",
      ubicacion: "Santiago Centro",
      postulantes: []
    },
    {
      id: 6,
      titulo: "Asistente Legal",
      carrera: "Derecho",
      empresa: "Estudio Jurídico Ramírez",
      descripcion: "Apoyo en redacción de contratos, investigación jurídica y atención de clientes en materias civiles y comerciales.",
      sueldo: 750000,
      jornada: "Tiempo completo",
      modalidad: "Presencial",
      ubicacion: "Ñuñoa, Santiago",
      postulantes: []
    },
    {
      id: 7,
      titulo: "Practicante de Arquitectura",
      carrera: "Arquitectura",
      empresa: "Estudio Forma y Espacio",
      descripcion: "Colabora en proyectos residenciales y comerciales, elaboración de planos, renders y presentaciones a clientes.",
      sueldo: 500000,
      jornada: "Part-time",
      modalidad: "Presencial",
      ubicacion: "Providencia, Santiago",
      postulantes: []
    },
    {
      id: 8,
      titulo: "Asistente de Psicología Clínica",
      carrera: "Psicología",
      empresa: "Centro de Salud Mental Bienestar",
      descripcion: "Apoyo en atención de pacientes, aplicación de pruebas psicológicas y elaboración de informes bajo supervisión.",
      sueldo: 650000,
      jornada: "Part-time",
      modalidad: "Presencial",
      ubicacion: "Maipú, Santiago",
      postulantes: []
    },
    {
      id: 9,
      titulo: "Desarrollador Mobile iOS",
      carrera: "Ingeniería Informática",
      empresa: "AppMakers Ltda",
      descripcion: "Desarrollo de aplicación móvil en Swift para plataforma de delivery local. Proyecto de 6 meses con posibilidad de continuidad.",
      sueldo: 1250000,
      jornada: "Por proyecto",
      modalidad: "Remota",
      ubicacion: "Remota (Chile)",
      postulantes: []
    }
  ],
  idsPostuladas: new Set(),
  siguienteId: 10
};

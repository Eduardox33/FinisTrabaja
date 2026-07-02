
const MODO_LOCAL = false;
const ELEMENTOS_POR_PAGINA = 30; 

const API = {
  obtenerOfertas: async () => {
    const filasOfertas = await ejecutarSQL('SELECT * FROM ofertas ORDER BY id DESC');
    const ofertas = [];

    for (const fila of filasOfertas) {
      const postulantes = await ejecutarSQL(
        'SELECT nombre, carrera, carta FROM postulantes WHERE oferta_id = ?',
        [fila.id]
      );
      ofertas.push({
        id: fila.id,
        titulo: fila.titulo,
        carrera: fila.carrera,
        empresa: fila.empresa,
        descripcion: fila.descripcion,
        sueldo: fila.sueldo,
        jornada: fila.jornada,
        modalidad: fila.modalidad,
        ubicacion: fila.ubicacion,
        postulantes: postulantes
      });
    }
    return ofertas;
  },

  crearOferta: async (datosOferta) => {
    await ejecutarSQL(
      `INSERT INTO ofertas (titulo, carrera, empresa, descripcion, sueldo, jornada, modalidad, ubicacion)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [datosOferta.titulo, datosOferta.carrera, datosOferta.empresa,
       datosOferta.descripcion, datosOferta.sueldo, datosOferta.jornada,
       datosOferta.modalidad, datosOferta.ubicacion]
    );
  },

  postularOferta: async (idOferta, datosEstudiante, carta) => {
    await ejecutarSQL(
      'INSERT INTO postulantes (oferta_id, nombre, carrera, carta) VALUES (?, ?, ?, ?)',
      [idOferta, datosEstudiante.nombre, datosEstudiante.carrera, carta]
    );
  },

  obtenerPostulantes: async (idOferta) => {
    const filaOferta = await ejecutarSQL('SELECT titulo FROM ofertas WHERE id = ?', [idOferta]);
    const titulo = filaOferta.length > 0 ? filaOferta[0].titulo : '';
    const postulantes = await ejecutarSQL(
      'SELECT nombre, carrera, carta FROM postulantes WHERE oferta_id = ?',
      [idOferta]
    );
    return { titulo, postulantes };
  }
};


let modoActual     = 'empresa';
let paginaActual   = 1;
let ofertaActualId = null;


window.addEventListener('DOMContentLoaded', () => {
  establecerModo('empresa');

  document.querySelectorAll('.modal-overlay').forEach(modal => {
    modal.addEventListener('click', (evento) => {
      if (evento.target === modal) modal.classList.remove('open');
    });
  });
});


function establecerModo(nuevoModo) {
  modoActual = nuevoModo;
  paginaActual = 1;

  const esModoEmpresa = nuevoModo === 'empresa';

  document.getElementById('btnEmpresa').classList.toggle('active', esModoEmpresa);
  document.getElementById('btnAlumno').classList.toggle('active', !esModoEmpresa);

  const etiquetaModo = document.getElementById('modeBadge');
  etiquetaModo.textContent = esModoEmpresa ? 'Vista Empresa' : 'Vista Alumno';
  etiquetaModo.className   = 'mode-badge ' + (esModoEmpresa ? 'empresa' : 'alumno');

  document.getElementById('pageTitle').textContent = esModoEmpresa
    ? 'Mis Ofertas Publicadas'
    : 'Ofertas Disponibles';
  document.getElementById('pageSubtitle').textContent = esModoEmpresa
    ? 'Gestiona las vacantes activas de tu organización'
    : 'Explora y postula a las oportunidades que te interesan';

  const accionesToolbar = document.getElementById('toolbarActions');
  accionesToolbar.innerHTML = esModoEmpresa
    ? `<button class="btn btn-primary" onclick="abrirModal('modalPublicar')">
         <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
           <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
         </svg>
         Nueva oferta
       </button>`
    : '';

  const barraInformativa = document.getElementById('infoBanner');
  if (!esModoEmpresa && baseDeDatosLocal.idsPostuladas.size > 0) {
    barraInformativa.style.display = 'flex';
    document.getElementById('infoBannerText').textContent =
      `Has postulado a ${baseDeDatosLocal.idsPostuladas.size} oferta(s).`;
  } else {
    barraInformativa.style.display = 'none';
  }

  renderizarCuadricula();
}


async function renderizarCuadricula() {
  let ofertasDisponibles;

  if (MODO_LOCAL) {
    ofertasDisponibles = baseDeDatosLocal.ofertas;
  } else {
    try {
      ofertasDisponibles = await API.obtenerOfertas();
    } catch (error) {
      mostrarNotificacion('Error al cargar ofertas desde el servidor', 'error');
      return;
    }
  }


  const ofertasVisibles = (modoActual === 'alumno')
    ? ofertasDisponibles.filter(oferta => !baseDeDatosLocal.idsPostuladas.has(oferta.id))
    : ofertasDisponibles;

  const totalPaginas = Math.max(1, Math.ceil(ofertasVisibles.length / ELEMENTOS_POR_PAGINA));
  if (paginaActual > totalPaginas) paginaActual = totalPaginas;

  const indiceInicio = (paginaActual - 1) * ELEMENTOS_POR_PAGINA;
  const ofertasPagina = ofertasVisibles.slice(indiceInicio, indiceInicio + ELEMENTOS_POR_PAGINA);

  const cuadriculaOfertas = document.getElementById('offersGrid');

  if (ofertasPagina.length === 0) {
    cuadriculaOfertas.innerHTML = `
      <div class="empty-state" style="grid-column:1/-1">
        <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.3">
          <path stroke-linecap="round" stroke-linejoin="round"
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
        </svg>
        <h3>${modoActual === 'empresa' ? 'Aún no has publicado ofertas' : 'No hay ofertas disponibles'}</h3>
        <p>${modoActual === 'empresa' ? 'Haz clic en "Nueva oferta" para comenzar.' : 'Vuelve más tarde, pronto habrá nuevas vacantes.'}</p>
      </div>`;
    document.getElementById('pagination').innerHTML = '';
    return;
  }

  cuadriculaOfertas.innerHTML = ofertasPagina.map(oferta => renderizarTarjeta(oferta)).join('');
  renderizarPaginacion(totalPaginas);
}

function formatearSueldo(cantidad) {
  return '$' + Number(cantidad).toLocaleString('es-CL');
}

function renderizarTarjeta(oferta) {
  const tienePostulantes = oferta.postulantes && oferta.postulantes.length > 0;
  const esModoEmpresa = modoActual === 'empresa';

  const insigniaModalidad = oferta.modalidad !== 'Presencial'
    ? `<span class="badge badge-remote">${oferta.modalidad}</span>`
    : '';

  const pieTarjeta = esModoEmpresa
    ? `<div class="card-footer">
        ${tienePostulantes
          ? `<div class="applicant-count">
               <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.3">
                 <path stroke-linecap="round" stroke-linejoin="round"
                   d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857
                      M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857
                      m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
               </svg>
               ${oferta.postulantes.length} postulante${oferta.postulantes.length > 1 ? 's' : ''}
             </div>
             <button class="btn btn-ghost" style="padding:6px 12px;font-size:12px"
               onclick="verPostulantes(${oferta.id})">Ver CV</button>`
          : `<span style="font-size:12px;color:var(--gray-400)">Sin postulantes</span><span></span>`
        }
       </div>`
    : `<button class="btn btn-primary"
         style="width:100%;margin-top:4px;justify-content:center"
         onclick="abrirPostular(${oferta.id})">
         Postular →
       </button>`;

  return `<div class="offer-card ${esModoEmpresa && tienePostulantes ? 'has-applicants' : ''}">
    <div class="card-header">
      <div>
        <div class="card-title">${oferta.titulo}</div>
        <div class="card-company">${oferta.empresa}</div>
      </div>
    </div>
    <div class="card-badges">
      <span class="badge badge-career">${oferta.carrera}</span>
      <span class="badge badge-jornada">${oferta.jornada}</span>
      ${insigniaModalidad}
    </div>
    <div class="card-desc">${oferta.descripcion}</div>
    <div class="card-salary">${formatearSueldo(oferta.sueldo)} <span>/ mes · ${oferta.ubicacion}</span></div>
    ${pieTarjeta}
  </div>`;
}


function renderizarPaginacion(totalPaginas) {
  const contenedorPaginacion = document.getElementById('pagination');
  if (totalPaginas <= 1) { contenedorPaginacion.innerHTML = ''; return; }

  let htmlPaginacion = `<button class="page-btn" onclick="irAPagina(${paginaActual - 1})"
    ${paginaActual === 1 ? 'disabled' : ''}>‹</button>`;

  for (let indice = 1; indice <= totalPaginas; indice++) {
    htmlPaginacion += `<button class="page-btn ${indice === paginaActual ? 'active' : ''}"
      onclick="irAPagina(${indice})">${indice}</button>`;
  }

  htmlPaginacion += `<button class="page-btn" onclick="irAPagina(${paginaActual + 1})"
    ${paginaActual === totalPaginas ? 'disabled' : ''}>›</button>`;

  contenedorPaginacion.innerHTML = htmlPaginacion;
}

function irAPagina(numeroPagina) {
  paginaActual = numeroPagina;
  renderizarCuadricula();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function publicarOferta() {
  const titulo    = document.getElementById('fTitulo').value.trim();
  const carrera   = document.getElementById('fCarrera').value.trim();
  const descripcion = document.getElementById('fDesc').value.trim();
  const sueldo    = parseInt(document.getElementById('fSueldo').value) || 0;
  const jornada   = document.getElementById('fJornada').value;
  const modalidad = document.getElementById('fModalidad').value;
  const ubicacion = document.getElementById('fUbicacion').value.trim() || 'Sin especificar';

  if (!titulo || !carrera || !descripcion) {
    mostrarNotificacion('Completa los campos obligatorios (*)', 'error');
    return;
  }

  const nuevaOferta = {
    titulo, carrera,
    empresa: 'Mi Empresa',
    descripcion,
    sueldo, jornada, modalidad, ubicacion,
    postulantes: []
  };

  if (MODO_LOCAL) {
    nuevaOferta.id = baseDeDatosLocal.siguienteId++;
    baseDeDatosLocal.ofertas.unshift(nuevaOferta);
    cerrarModal('modalPublicar');
    restablecerFormulario('modalPublicar');
    mostrarNotificacion('Oferta publicada exitosamente', 'success');
    renderizarCuadricula();
  } else {
    API.crearOferta(nuevaOferta)
      .then(() => {
        cerrarModal('modalPublicar');
        restablecerFormulario('modalPublicar');
        mostrarNotificacion('Oferta publicada exitosamente', 'success');
        renderizarCuadricula();
      })
      .catch(() => mostrarNotificacion('Error al publicar la oferta', 'error'));
  }
}


async function abrirPostular(idOferta) {
  ofertaActualId = idOferta;

  if (MODO_LOCAL) {
    const oferta = baseDeDatosLocal.ofertas.find(elemento => elemento.id === idOferta);
    if (!oferta) return;
    document.getElementById('postularInfo').innerHTML = `
      <h3>${oferta.titulo}</h3>
      <p>${oferta.empresa} · ${oferta.jornada} · ${oferta.modalidad} · ${formatearSueldo(oferta.sueldo)}/mes</p>`;
  } else {
    try {
      const filas = await ejecutarSQL(
        'SELECT titulo, empresa, jornada, modalidad, sueldo FROM ofertas WHERE id = ?',
        [idOferta]
      );
      if (filas.length === 0) return;
      const o = filas[0];
      document.getElementById('postularInfo').innerHTML = `
        <h3>${o.titulo}</h3>
        <p>${o.empresa} · ${o.jornada} · ${o.modalidad} · ${formatearSueldo(o.sueldo)}/mes</p>`;
    } catch (error) {
      mostrarNotificacion('Error al cargar la oferta', 'error');
      return;
    }
  }

  document.getElementById('fCarta').value = '';
  abrirModal('modalPostular');
}

function confirmarPostulacion() {
  const cartaPresentacion = document.getElementById('fCarta').value.trim();

  const enviarPostulacion = (carrera) => {
    const datosEstudiante = { nombre: 'Estudiante Finis', carrera };

    if (MODO_LOCAL) {
      const oferta = baseDeDatosLocal.ofertas.find(elemento => elemento.id === ofertaActualId);
      if (!oferta) return;
      oferta.postulantes.push({ ...datosEstudiante, carta: cartaPresentacion });
      baseDeDatosLocal.idsPostuladas.add(ofertaActualId);
      cerrarModal('modalPostular');
      mostrarNotificacion('Postulacion enviada con exito', 'success');
      establecerModo(modoActual);
    } else {
      API.postularOferta(ofertaActualId, datosEstudiante, cartaPresentacion)
        .then(() => {
          baseDeDatosLocal.idsPostuladas.add(ofertaActualId);
          cerrarModal('modalPostular');
          mostrarNotificacion('Postulacion enviada con exito', 'success');
          establecerModo(modoActual);
        })
        .catch(() => mostrarNotificacion('Error al enviar la postulacion', 'error'));
    }
  };

  if (MODO_LOCAL) {
    const oferta = baseDeDatosLocal.ofertas.find(elemento => elemento.id === ofertaActualId);
    if (!oferta) return;
    enviarPostulacion(oferta.carrera);
  } else {
    ejecutarSQL('SELECT carrera FROM ofertas WHERE id = ?', [ofertaActualId])
      .then(filas => {
        if (filas.length === 0) return;
        enviarPostulacion(filas[0].carrera);
      })
      .catch(() => mostrarNotificacion('Error al obtener la oferta', 'error'));
  }
}


async function verPostulantes(idOferta) {
  let tituloOferta;
  let postulantes;

  if (MODO_LOCAL) {
    const oferta = baseDeDatosLocal.ofertas.find(elemento => elemento.id === idOferta);
    if (!oferta) return;
    tituloOferta = oferta.titulo;
    postulantes = oferta.postulantes;
  } else {
    try {
      const datos = await API.obtenerPostulantes(idOferta);
      tituloOferta = datos.titulo;
      postulantes = datos.postulantes;
    } catch (error) {
      mostrarNotificacion('Error al cargar postulantes', 'error');
      return;
    }
  }

  document.getElementById('postulantesTitle').textContent =
    `Postulantes — ${tituloOferta}`;

  const cuerpoLista = document.getElementById('postulantesBody');
  if (!postulantes.length) {
    cuerpoLista.innerHTML = '<p style="color:var(--gray-400);font-size:13.5px">Sin postulantes aun.</p>';
  } else {
    cuerpoLista.innerHTML = `<div class="applicants-list">` +
      postulantes.map(postulante => `
        <div class="applicant-row">
          <div class="applicant-avatar">${postulante.nombre.charAt(0)}</div>
          <div class="applicant-row-info">
            <strong>${postulante.nombre}</strong>
            <small>${postulante.carrera}${postulante.carta ? ' - Con carta de presentacion' : ''}</small>
          </div>
        </div>`).join('') +
      '</div>';
  }

  abrirModal('modalPostulantes');
}


function abrirModal(idModal)  { document.getElementById(idModal).classList.add('open'); }
function cerrarModal(idModal) { document.getElementById(idModal).classList.remove('open'); }

function restablecerFormulario(idModal) {
  document.querySelectorAll(`#${idModal} input, #${idModal} textarea`)
    .forEach(elemento => elemento.value = '');
  document.querySelectorAll(`#${idModal} select`)
    .forEach(elemento => elemento.selectedIndex = 0);
}


function mostrarNotificacion(mensaje, tipo = '') {
  const contenedorNotificaciones = document.getElementById('toastContainer');
  const elementoNotificacion = document.createElement('div');
  elementoNotificacion.className   = `toast ${tipo}`;
  elementoNotificacion.textContent = mensaje;
  contenedorNotificaciones.appendChild(elementoNotificacion);
  setTimeout(() => elementoNotificacion.remove(), 3500);
}

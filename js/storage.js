// Almacenamiento local versionado para configuracion y ultimo calculo.
const STORAGE_CONFIG_KEY = "precio3d_config_v1";
const STORAGE_ULTIMO_CALCULO_KEY = "precio3d_ultimo_calculo_v1";
const STORAGE_TRABAJOS_KEY = "precio3d_trabajos_v1";
const STORAGE_DATOS_NEGOCIO_KEY = "precio3d_datos_negocio_v1";
const STORAGE_CONFIG_COTIZACION_KEY = "precio3d_cotizacion_config_v1";
const STORAGE_COTIZACION_CONTADOR_KEY = "precio3d_cotizacion_contador_v1";
const STORAGE_COTIZACION_ACTUAL_KEY = "precio3d_cotizacion_actual_v1";
const STORAGE_VERSION = 1;
const ESTADOS_TRABAJO = ["Pendiente", "Aceptado", "Rechazado", "Terminado", "Pagado"];

function puedeUsarLocalStorage() {
  try {
    const clavePrueba = "__precio3d_storage_test__";
    localStorage.setItem(clavePrueba, "ok");
    localStorage.removeItem(clavePrueba);
    return true;
  } catch (error) {
    console.warn("No se pudo usar almacenamiento local.", error);
    return false;
  }
}

function leerJSONSeguro(clave) {
  if (!puedeUsarLocalStorage()) {
    return null;
  }

  try {
    const valor = localStorage.getItem(clave);
    return valor ? JSON.parse(valor) : null;
  } catch (error) {
    console.warn("No se pudo leer LocalStorage.", error);
    return null;
  }
}

function escribirJSONSeguro(clave, valor) {
  if (!puedeUsarLocalStorage()) {
    return false;
  }

  try {
    localStorage.setItem(clave, JSON.stringify(valor));
    return true;
  } catch (error) {
    console.warn("No se pudo escribir en LocalStorage.", error);
    return false;
  }
}

function borrarClaveSeguro(clave) {
  if (!puedeUsarLocalStorage()) {
    return false;
  }

  try {
    localStorage.removeItem(clave);
    return true;
  } catch (error) {
    console.warn("No se pudo borrar LocalStorage.", error);
    return false;
  }
}

function envolverConfiguracion(configuracion) {
  return {
    version: STORAGE_VERSION,
    guardadoEn: new Date().toISOString(),
    configuracion: configuracion || {}
  };
}

function normalizarConfiguracion(datos) {
  if (!datos || typeof datos !== "object" || Array.isArray(datos)) {
    return null;
  }

  if (datos.version === STORAGE_VERSION && datos.configuracion && typeof datos.configuracion === "object") {
    return datos.configuracion;
  }

  if (datos.modoActual || datos.basico || datos.avanzado || datos.comparador) {
    return datos;
  }

  return null;
}

function guardarConfiguracion(configuracion) {
  return escribirJSONSeguro(STORAGE_CONFIG_KEY, envolverConfiguracion(configuracion));
}

function cargarConfiguracion() {
  return normalizarConfiguracion(leerJSONSeguro(STORAGE_CONFIG_KEY));
}

function borrarConfiguracion() {
  return borrarClaveSeguro(STORAGE_CONFIG_KEY);
}

function guardarUltimoCalculo(calculo) {
  const payload = {
    version: STORAGE_VERSION,
    guardadoEn: new Date().toISOString(),
    calculo: calculo || {}
  };

  return escribirJSONSeguro(STORAGE_ULTIMO_CALCULO_KEY, payload);
}

function cargarUltimoCalculo() {
  const datos = leerJSONSeguro(STORAGE_ULTIMO_CALCULO_KEY);

  if (!datos || typeof datos !== "object" || Array.isArray(datos)) {
    return null;
  }

  if (datos.version === STORAGE_VERSION && datos.calculo && typeof datos.calculo === "object") {
    return {
      ...datos.calculo,
      guardadoEn: datos.guardadoEn
    };
  }

  return null;
}

function borrarUltimoCalculo() {
  return borrarClaveSeguro(STORAGE_ULTIMO_CALCULO_KEY);
}

function crearIdTrabajo() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return `trabajo-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function normalizarEstadoTrabajo(estado) {
  return ESTADOS_TRABAJO.includes(estado) ? estado : "Pendiente";
}

function normalizarTrabajo(trabajo) {
  if (!trabajo || typeof trabajo !== "object" || Array.isArray(trabajo)) {
    return null;
  }

  const ahora = new Date().toISOString();

  return {
    id: String(trabajo.id || crearIdTrabajo()),
    nombreTrabajo: String(trabajo.nombreTrabajo || "Trabajo sin nombre"),
    cliente: String(trabajo.cliente || ""),
    descripcion: String(trabajo.descripcion || ""),
    fechaCreacion: trabajo.fechaCreacion || ahora,
    fechaActualizacion: trabajo.fechaActualizacion || ahora,
    estado: normalizarEstadoTrabajo(trabajo.estado),
    modoUsado: trabajo.modoUsado === "avanzado" ? "avanzado" : "basico",
    precioFinal: Number(trabajo.precioFinal) || 0,
    costoTotal: Number(trabajo.costoTotal) || 0,
    utilidadObjetivo: Number(trabajo.utilidadObjetivo) || 0,
    margenReal: Number.isFinite(Number(trabajo.margenReal)) ? Number(trabajo.margenReal) : null,
    numeroCotizacion: String(trabajo.numeroCotizacion || ""),
    datos: trabajo.datos && typeof trabajo.datos === "object" ? trabajo.datos : {},
    resultado: trabajo.resultado && typeof trabajo.resultado === "object" ? trabajo.resultado : {}
  };
}

function normalizarListaTrabajos(datos) {
  const lista = Array.isArray(datos)
    ? datos
    : Array.isArray(datos?.trabajos)
      ? datos.trabajos
      : [];

  return lista.map(normalizarTrabajo).filter(Boolean);
}

function envolverTrabajos(trabajos) {
  return {
    version: STORAGE_VERSION,
    guardadoEn: new Date().toISOString(),
    trabajos: normalizarListaTrabajos(trabajos)
  };
}

function cargarTrabajos() {
  return normalizarListaTrabajos(leerJSONSeguro(STORAGE_TRABAJOS_KEY));
}

function guardarListaTrabajos(trabajos) {
  return escribirJSONSeguro(STORAGE_TRABAJOS_KEY, envolverTrabajos(trabajos));
}

function guardarTrabajo(trabajo) {
  const trabajoNormalizado = normalizarTrabajo(trabajo);

  if (!trabajoNormalizado) {
    return null;
  }

  const trabajos = cargarTrabajos();
  const indice = trabajos.findIndex((item) => item.id === trabajoNormalizado.id);

  if (indice >= 0) {
    trabajos[indice] = {
      ...trabajos[indice],
      ...trabajoNormalizado,
      fechaActualizacion: new Date().toISOString()
    };
  } else {
    trabajos.unshift(trabajoNormalizado);
  }

  return guardarListaTrabajos(trabajos) ? trabajoNormalizado : null;
}

function actualizarTrabajo(id, cambios) {
  const trabajos = cargarTrabajos();
  const indice = trabajos.findIndex((trabajo) => trabajo.id === id);

  if (indice < 0) {
    return null;
  }

  const actualizado = normalizarTrabajo({
    ...trabajos[indice],
    ...(cambios || {}),
    id,
    fechaCreacion: trabajos[indice].fechaCreacion,
    fechaActualizacion: new Date().toISOString()
  });

  trabajos[indice] = actualizado;
  return guardarListaTrabajos(trabajos) ? actualizado : null;
}

function eliminarTrabajo(id) {
  const trabajos = cargarTrabajos();
  const filtrados = trabajos.filter((trabajo) => trabajo.id !== id);

  if (filtrados.length === trabajos.length) {
    return false;
  }

  return guardarListaTrabajos(filtrados);
}

function duplicarTrabajo(id) {
  const trabajo = cargarTrabajos().find((item) => item.id === id);

  if (!trabajo) {
    return null;
  }

  return guardarTrabajo({
    ...trabajo,
    id: crearIdTrabajo(),
    nombreTrabajo: `${trabajo.nombreTrabajo} (copia)`,
    fechaCreacion: new Date().toISOString(),
    fechaActualizacion: new Date().toISOString(),
    estado: "Pendiente"
  });
}

function exportarTrabajosJSON(trabajos = cargarTrabajos()) {
  return JSON.stringify(envolverTrabajos(trabajos), null, 2);
}

function importarTrabajosJSON(contenido, modo = "combinar") {
  try {
    const datos = typeof contenido === "string" ? JSON.parse(contenido) : contenido;
    const tieneFormatoValido = Array.isArray(datos) || Array.isArray(datos?.trabajos);

    if (!tieneFormatoValido) {
      return null;
    }

    const importados = normalizarListaTrabajos(datos);

    if (!Array.isArray(importados)) {
      return null;
    }

    if (modo === "reemplazar") {
      return guardarListaTrabajos(importados) ? importados : null;
    }

    const actuales = cargarTrabajos();
    const idsActuales = new Set(actuales.map((trabajo) => trabajo.id));
    const combinados = [...actuales];

    importados.forEach((trabajo) => {
      const trabajoSeguro = idsActuales.has(trabajo.id)
        ? { ...trabajo, id: crearIdTrabajo(), fechaActualizacion: new Date().toISOString() }
        : trabajo;

      idsActuales.add(trabajoSeguro.id);
      combinados.push(trabajoSeguro);
    });

    return guardarListaTrabajos(combinados) ? combinados : null;
  } catch (error) {
    console.warn("Archivo de trabajos invalido.", error);
    return null;
  }
}

function borrarTrabajos() {
  return borrarClaveSeguro(STORAGE_TRABAJOS_KEY);
}

function envolverDatosNegocio(datosNegocio) {
  return {
    version: STORAGE_VERSION,
    guardadoEn: new Date().toISOString(),
    datosNegocio: datosNegocio || {}
  };
}

function normalizarDatosNegocio(datos) {
  if (!datos || typeof datos !== "object" || Array.isArray(datos)) {
    return {};
  }

  const origen = datos.datosNegocio && typeof datos.datosNegocio === "object" ? datos.datosNegocio : datos;

  return {
    nombreNegocio: String(origen.nombreNegocio || ""),
    rutNegocio: String(origen.rutNegocio || ""),
    telefonoNegocio: String(origen.telefonoNegocio || ""),
    correoNegocio: String(origen.correoNegocio || ""),
    direccionNegocio: String(origen.direccionNegocio || ""),
    sitioWebNegocio: String(origen.sitioWebNegocio || ""),
    instagramNegocio: String(origen.instagramNegocio || "")
  };
}

function guardarDatosNegocio(datosNegocio) {
  return escribirJSONSeguro(STORAGE_DATOS_NEGOCIO_KEY, envolverDatosNegocio(datosNegocio));
}

function cargarDatosNegocio() {
  return normalizarDatosNegocio(leerJSONSeguro(STORAGE_DATOS_NEGOCIO_KEY));
}

function borrarDatosNegocio() {
  return borrarClaveSeguro(STORAGE_DATOS_NEGOCIO_KEY);
}

function envolverConfigCotizacion(configCotizacion) {
  return {
    version: STORAGE_VERSION,
    guardadoEn: new Date().toISOString(),
    configCotizacion: configCotizacion || {}
  };
}

function normalizarConfigCotizacion(datos) {
  const valoresPorDefecto = {
    validezCotizacionDias: 7,
    tiempoEntrega: "A coordinar",
    condicionesPago: "50% de abono para iniciar y 50% contra entrega.",
    observacionesCotizacion: ""
  };

  if (!datos || typeof datos !== "object" || Array.isArray(datos)) {
    return valoresPorDefecto;
  }

  const origen =
    datos.configCotizacion && typeof datos.configCotizacion === "object" ? datos.configCotizacion : datos;

  return {
    validezCotizacionDias: Number(origen.validezCotizacionDias) || valoresPorDefecto.validezCotizacionDias,
    tiempoEntrega: String(origen.tiempoEntrega || valoresPorDefecto.tiempoEntrega),
    condicionesPago: String(origen.condicionesPago || valoresPorDefecto.condicionesPago),
    observacionesCotizacion: String(origen.observacionesCotizacion || "")
  };
}

function guardarConfigCotizacion(configCotizacion) {
  return escribirJSONSeguro(STORAGE_CONFIG_COTIZACION_KEY, envolverConfigCotizacion(configCotizacion));
}

function cargarConfigCotizacion() {
  return normalizarConfigCotizacion(leerJSONSeguro(STORAGE_CONFIG_COTIZACION_KEY));
}

function borrarConfigCotizacion() {
  return borrarClaveSeguro(STORAGE_CONFIG_COTIZACION_KEY);
}

function obtenerFechaLocalCompacta(fecha = new Date()) {
  const ano = fecha.getFullYear();
  const mes = String(fecha.getMonth() + 1).padStart(2, "0");
  const dia = String(fecha.getDate()).padStart(2, "0");
  return `${ano}${mes}${dia}`;
}

function cargarCotizacionActual() {
  const actual = leerJSONSeguro(STORAGE_COTIZACION_ACTUAL_KEY);
  return actual && typeof actual === "object" && !Array.isArray(actual) ? actual : null;
}

function obtenerOCrearNumeroCotizacion(referencia, forzarNueva = false) {
  const referenciaSegura = String(referencia || "cotizacion-actual");
  const actual = cargarCotizacionActual();

  if (!forzarNueva && actual?.referencia === referenciaSegura && actual?.numeroCotizacion) {
    return actual.numeroCotizacion;
  }

  const fecha = obtenerFechaLocalCompacta();
  const contadorGuardado = leerJSONSeguro(STORAGE_COTIZACION_CONTADOR_KEY);
  const contadorAnterior = contadorGuardado?.fecha === fecha ? Number(contadorGuardado.valor) || 0 : 0;
  const contador = contadorAnterior + 1;
  const numeroCotizacion = `COT-${fecha}-${String(contador).padStart(3, "0")}`;

  if (!escribirJSONSeguro(STORAGE_COTIZACION_CONTADOR_KEY, { fecha, valor: contador })) {
    return null;
  }

  if (
    !escribirJSONSeguro(STORAGE_COTIZACION_ACTUAL_KEY, {
      referencia: referenciaSegura,
      numeroCotizacion,
      creadoEn: new Date().toISOString()
    })
  ) {
    return null;
  }

  return numeroCotizacion;
}

function borrarCotizacionActual() {
  return borrarClaveSeguro(STORAGE_COTIZACION_ACTUAL_KEY);
}

function exportarConfiguracionJSON(configuracion) {
  return JSON.stringify(envolverConfiguracion(configuracion), null, 2);
}

function importarConfiguracionJSON(contenido) {
  try {
    const datos = typeof contenido === "string" ? JSON.parse(contenido) : contenido;
    return normalizarConfiguracion(datos);
  } catch (error) {
    console.warn("Archivo de configuracion invalido.", error);
    return null;
  }
}

window.StoragePrecio3D = {
  guardarConfiguracion,
  cargarConfiguracion,
  borrarConfiguracion,
  guardarUltimoCalculo,
  cargarUltimoCalculo,
  borrarUltimoCalculo,
  guardarTrabajo,
  cargarTrabajos,
  actualizarTrabajo,
  eliminarTrabajo,
  duplicarTrabajo,
  exportarTrabajosJSON,
  importarTrabajosJSON,
  borrarTrabajos,
  guardarDatosNegocio,
  cargarDatosNegocio,
  borrarDatosNegocio,
  guardarConfigCotizacion,
  cargarConfigCotizacion,
  borrarConfigCotizacion,
  cargarCotizacionActual,
  obtenerOCrearNumeroCotizacion,
  borrarCotizacionActual,
  exportarConfiguracionJSON,
  importarConfiguracionJSON
};

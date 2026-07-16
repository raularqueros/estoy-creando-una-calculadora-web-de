// Almacenamiento local versionado para configuracion y ultimo calculo.
const STORAGE_CONFIG_KEY = "precio3d_config_v1";
const STORAGE_ULTIMO_CALCULO_KEY = "precio3d_ultimo_calculo_v1";
const STORAGE_TRABAJOS_KEY = "precio3d_trabajos_v1";
const STORAGE_DATOS_NEGOCIO_KEY = "precio3d_datos_negocio_v1";
const STORAGE_CONFIG_COTIZACION_KEY = "precio3d_cotizacion_config_v1";
const STORAGE_COTIZACION_CONTADOR_KEY = "precio3d_cotizacion_contador_v1";
const STORAGE_COTIZACION_ACTUAL_KEY = "precio3d_cotizacion_actual_v1";
const STORAGE_FLUJO_TRABAJOS_KEY = "precio3d_flujo_trabajos_v1";
const STORAGE_VERSION = 1;
const TRABAJO_VERSION = 2;
const ESTADOS_TRABAJO = [
  "Pendiente",
  "Aceptado",
  "Esperando abono",
  "En producción",
  "Terminado",
  "Entregado",
  "Pagado",
  "Rechazado",
  "Cancelado"
];
const ESTADOS_EQUIVALENTES = {
  pendiente: "Pendiente",
  aceptado: "Aceptado",
  esperando_abono: "Esperando abono",
  "esperando abono": "Esperando abono",
  en_produccion: "En producción",
  "en produccion": "En producción",
  "en producción": "En producción",
  terminado: "Terminado",
  entregado: "Entregado",
  pagado: "Pagado",
  rechazado: "Rechazado",
  cancelado: "Cancelado"
};

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
  const texto = String(estado || "Pendiente").trim();

  if (ESTADOS_TRABAJO.includes(texto)) {
    return texto;
  }

  return ESTADOS_EQUIVALENTES[texto.toLowerCase()] || "Pendiente";
}

function numeroSeguro(valor, fallback = 0) {
  const numero = Number(valor);
  return Number.isFinite(numero) && numero >= 0 ? numero : fallback;
}

function normalizarPagos(pagos) {
  if (!Array.isArray(pagos)) {
    return [];
  }

  return pagos
    .filter((pago) => pago && typeof pago === "object")
    .map((pago) => ({
      id: String(pago.id || crearIdTrabajo()),
      monto: numeroSeguro(pago.monto),
      fecha: pago.fecha || new Date().toISOString().slice(0, 10),
      metodo: String(pago.metodo || "Transferencia"),
      nota: String(pago.nota || ""),
      createdAt: pago.createdAt || new Date().toISOString()
    }));
}

function normalizarHistorialEstados(historial, estado, fecha) {
  const entradas = Array.isArray(historial)
    ? historial
        .filter((entrada) => entrada && typeof entrada === "object")
        .map((entrada) => ({
          estado: normalizarEstadoTrabajo(entrada.estado),
          fecha: entrada.fecha || fecha,
          nota: String(entrada.nota || "")
        }))
    : [];

  return entradas.length
    ? entradas
    : [{ estado: normalizarEstadoTrabajo(estado), fecha, nota: "Estado inicial" }];
}

function normalizarTrabajo(trabajo) {
  if (!trabajo || typeof trabajo !== "object" || Array.isArray(trabajo)) {
    return null;
  }

  const ahora = new Date().toISOString();
  const fechaCreacion = trabajo.fechaCreacion || trabajo.createdAt || ahora;
  const fechaActualizacion = trabajo.fechaActualizacion || trabajo.updatedAt || fechaCreacion;
  const estado = normalizarEstadoTrabajo(trabajo.estado);
  const pagos = normalizarPagos(trabajo.pagos);
  const precioFinal = numeroSeguro(trabajo.precioFinal);
  const costoTotal = numeroSeguro(trabajo.costoTotal);
  const precioVendidoReal = numeroSeguro(trabajo.precioVendidoReal);
  const costosAdicionalesReales = numeroSeguro(trabajo.costosAdicionalesReales);
  const totalPagos = pagos.reduce((total, pago) => total + pago.monto, 0);
  const montoAbonado = Math.max(numeroSeguro(trabajo.montoAbonado), totalPagos);
  const precioCobro = precioVendidoReal > 0 ? precioVendidoReal : precioFinal;
  const utilidadReal = precioVendidoReal > 0
    ? precioVendidoReal - costoTotal - costosAdicionalesReales
    : null;
  const margenRealCalculado = precioVendidoReal > 0 ? utilidadReal / precioVendidoReal : null;
  const clienteSnapshot = trabajo.clienteSnapshot && typeof trabajo.clienteSnapshot === "object"
    ? {
        nombre: String(trabajo.clienteSnapshot.nombre || trabajo.cliente || ""),
        empresa: String(trabajo.clienteSnapshot.empresa || ""),
        rutIdFiscal: String(trabajo.clienteSnapshot.rutIdFiscal || ""),
        telefono: String(trabajo.clienteSnapshot.telefono || ""),
        correo: String(trabajo.clienteSnapshot.correo || ""),
        direccion: String(trabajo.clienteSnapshot.direccion || "")
      }
    : null;
  const impresoraSnapshot = trabajo.impresoraSnapshot && typeof trabajo.impresoraSnapshot === "object"
    ? { ...trabajo.impresoraSnapshot }
    : trabajo.datos?.impresoraSnapshot && typeof trabajo.datos.impresoraSnapshot === "object"
      ? { ...trabajo.datos.impresoraSnapshot }
      : null;
  const filamentoSnapshot = trabajo.filamentoSnapshot && typeof trabajo.filamentoSnapshot === "object"
    ? { ...trabajo.filamentoSnapshot }
    : trabajo.datos?.filamentoSnapshot && typeof trabajo.datos.filamentoSnapshot === "object"
      ? { ...trabajo.datos.filamentoSnapshot }
      : null;
  const consumoEntrada = trabajo.consumoInventario && typeof trabajo.consumoInventario === "object"
    ? trabajo.consumoInventario
    : {};
  const consumoInventario = {
    registrado: Boolean(consumoEntrada.registrado),
    estado: String(consumoEntrada.estado || (consumoEntrada.registrado ? "Registrado" : "No registrado")),
    totalRegistradoGramos: numeroSeguro(consumoEntrada.totalRegistradoGramos),
    movimientosIds: Array.isArray(consumoEntrada.movimientosIds)
      ? [...new Set(consumoEntrada.movimientosIds.map(String).filter(Boolean))]
      : [],
    fechaUltimoRegistro: consumoEntrada.fechaUltimoRegistro || null
  };

  return {
    id: String(trabajo.id || crearIdTrabajo()),
    version: TRABAJO_VERSION,
    nombreTrabajo: String(trabajo.nombreTrabajo || "Trabajo sin nombre"),
    cliente: String(trabajo.cliente || ""),
    clienteId: String(trabajo.clienteId || ""),
    clienteSnapshot,
    impresoraId: String(trabajo.impresoraId || trabajo.datos?.impresoraId || ""),
    impresoraSnapshot,
    filamentoId: String(trabajo.filamentoId || trabajo.datos?.filamentoId || ""),
    filamentoSnapshot,
    consumoInventario,
    descripcion: String(trabajo.descripcion || ""),
    fechaCreacion,
    fechaActualizacion,
    estado,
    modoUsado: trabajo.modoUsado === "avanzado" ? "avanzado" : "basico",
    precioFinal,
    precioVendidoReal,
    costoTotal,
    costosAdicionalesReales,
    utilidadObjetivo: numeroSeguro(trabajo.utilidadObjetivo),
    utilidadReal,
    margenReal: margenRealCalculado !== null
      ? margenRealCalculado
      : Number.isFinite(Number(trabajo.margenReal))
        ? Number(trabajo.margenReal)
        : null,
    montoAbonado,
    saldoPendiente: Math.max(0, precioCobro - montoAbonado),
    pagos,
    historialEstados: normalizarHistorialEstados(
      trabajo.historialEstados,
      estado,
      fechaActualizacion
    ),
    fechaVenta: trabajo.fechaVenta || "",
    fechaPago: trabajo.fechaPago || "",
    fechaAceptacion: trabajo.fechaAceptacion || "",
    notasVenta: String(trabajo.notasVenta || ""),
    moneda: String(trabajo.moneda || trabajo.datos?.moneda || "CLP").toUpperCase(),
    numeroCotizacion: String(trabajo.numeroCotizacion || ""),
    cotizacionId: String(trabajo.cotizacionId || ""),
    itemsCotizacion: Array.isArray(trabajo.itemsCotizacion)
      ? trabajo.itemsCotizacion.map((item) => ({ ...item }))
      : [],
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
    version: TRABAJO_VERSION,
    guardadoEn: new Date().toISOString(),
    trabajos: normalizarListaTrabajos(trabajos)
  };
}

function cargarTrabajos() {
  return normalizarListaTrabajos(leerJSONSeguro(STORAGE_TRABAJOS_KEY));
}

function guardarListaTrabajos(trabajos) {
  const guardado = escribirJSONSeguro(STORAGE_TRABAJOS_KEY, envolverTrabajos(trabajos));
  if (guardado && typeof window !== "undefined" && typeof CustomEvent !== "undefined") {
    window.dispatchEvent(new CustomEvent("precio3d:trabajos-actualizados"));
  }
  return guardado;
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

  const guardado = indice >= 0 ? trabajos[indice] : trabajoNormalizado;
  return guardarListaTrabajos(trabajos) ? guardado : null;
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
    estado: "Pendiente",
    precioVendidoReal: 0,
    costosAdicionalesReales: 0,
    utilidadReal: null,
    montoAbonado: 0,
    saldoPendiente: Number(trabajo.precioFinal) || 0,
    pagos: [],
    historialEstados: [],
    fechaVenta: "",
    fechaPago: "",
    fechaAceptacion: "",
    notasVenta: "",
    consumoInventario: {
      registrado: false,
      estado: "No registrado",
      totalRegistradoGramos: 0,
      movimientosIds: [],
      fechaUltimoRegistro: null
    }
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
  const borrado = borrarClaveSeguro(STORAGE_TRABAJOS_KEY);
  if (borrado && typeof window !== "undefined" && typeof CustomEvent !== "undefined") {
    window.dispatchEvent(new CustomEvent("precio3d:trabajos-actualizados"));
  }
  return borrado;
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

function cambiarEstadoTrabajo(id, estado, nota = "") {
  const trabajo = cargarTrabajos().find((item) => item.id === id);

  if (!trabajo) {
    return null;
  }

  const estadoNormalizado = normalizarEstadoTrabajo(estado);
  const fecha = new Date().toISOString();
  const historial = normalizarHistorialEstados(
    trabajo.historialEstados,
    trabajo.estado,
    trabajo.fechaActualizacion || trabajo.fechaCreacion
  );

  if (historial.at(-1)?.estado !== estadoNormalizado) {
    historial.push({ estado: estadoNormalizado, fecha, nota: String(nota || "") });
  }

  const fechas = {};
  if (estadoNormalizado === "Aceptado" && !trabajo.fechaAceptacion) {
    fechas.fechaAceptacion = fecha;
  }
  if (estadoNormalizado === "Pagado" && !trabajo.fechaPago) {
    fechas.fechaPago = fecha.slice(0, 10);
  }

  return actualizarTrabajo(id, {
    estado: estadoNormalizado,
    historialEstados: historial,
    ...fechas
  });
}

function registrarVenta(id, datosVenta) {
  const trabajo = cargarTrabajos().find((item) => item.id === id);

  if (!trabajo) {
    return null;
  }

  const precioVendidoReal = numeroSeguro(datosVenta?.precioVendidoReal);
  const costosAdicionalesReales = numeroSeguro(datosVenta?.costosAdicionalesReales);
  const montoAbonado = numeroSeguro(datosVenta?.montoAbonado);
  const totalPagosActual = trabajo.pagos.reduce((total, pago) => total + pago.monto, 0);
  const pagos = [...trabajo.pagos];

  if (montoAbonado > totalPagosActual) {
    pagos.push({
      id: crearIdTrabajo(),
      monto: montoAbonado - totalPagosActual,
      fecha: datosVenta?.fechaVenta || new Date().toISOString().slice(0, 10),
      metodo: "Abono inicial",
      nota: "Abono registrado con la venta",
      createdAt: new Date().toISOString()
    });
  }

  const totalAbonado = pagos.reduce((total, pago) => total + pago.monto, 0);
  const utilidadReal = precioVendidoReal > 0
    ? precioVendidoReal - trabajo.costoTotal - costosAdicionalesReales
    : null;
  const margenReal = precioVendidoReal > 0 ? utilidadReal / precioVendidoReal : null;

  return actualizarTrabajo(id, {
    precioVendidoReal,
    costosAdicionalesReales,
    montoAbonado: totalAbonado,
    saldoPendiente: Math.max(0, precioVendidoReal - totalAbonado),
    pagos,
    utilidadReal,
    margenReal,
    fechaVenta: datosVenta?.fechaVenta || new Date().toISOString().slice(0, 10),
    fechaPago: datosVenta?.fechaPago || trabajo.fechaPago || "",
    notasVenta: String(datosVenta?.notasVenta || "")
  });
}

function registrarPago(id, datosPago) {
  const trabajo = cargarTrabajos().find((item) => item.id === id);

  if (!trabajo) {
    return null;
  }

  const pago = {
    id: crearIdTrabajo(),
    monto: numeroSeguro(datosPago?.monto),
    fecha: datosPago?.fecha || new Date().toISOString().slice(0, 10),
    metodo: String(datosPago?.metodo || "Transferencia"),
    nota: String(datosPago?.nota || ""),
    createdAt: new Date().toISOString()
  };

  const pagos = [...trabajo.pagos];
  if (!pagos.length && trabajo.montoAbonado > 0) {
    pagos.push({
      id: crearIdTrabajo(),
      monto: trabajo.montoAbonado,
      fecha: trabajo.fechaVenta || trabajo.fechaCreacion.slice(0, 10),
      metodo: "Abono anterior",
      nota: "Abono migrado desde el registro anterior",
      createdAt: trabajo.fechaActualizacion
    });
  }
  pagos.push(pago);
  const totalPagado = pagos.reduce((total, item) => total + item.monto, 0);
  const precioCobro = trabajo.precioVendidoReal > 0 ? trabajo.precioVendidoReal : trabajo.precioFinal;

  return actualizarTrabajo(id, {
    pagos,
    montoAbonado: totalPagado,
    saldoPendiente: Math.max(0, precioCobro - totalPagado),
    fechaPago: totalPagado >= precioCobro && precioCobro > 0 ? pago.fecha : trabajo.fechaPago
  });
}

function guardarFlujoTrabajos(flujo) {
  return escribirJSONSeguro(STORAGE_FLUJO_TRABAJOS_KEY, flujo === "completo" ? "completo" : "simple");
}

function cargarFlujoTrabajos() {
  return leerJSONSeguro(STORAGE_FLUJO_TRABAJOS_KEY) === "completo" ? "completo" : "simple";
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

function guardarDatosCotizacionActual(datos) {
  const actual = cargarCotizacionActual() || {};
  return escribirJSONSeguro(STORAGE_COTIZACION_ACTUAL_KEY, {
    ...actual,
    ...(datos && typeof datos === "object" ? datos : {}),
    actualizadoEn: new Date().toISOString()
  });
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
  cambiarEstadoTrabajo,
  registrarVenta,
  registrarPago,
  eliminarTrabajo,
  duplicarTrabajo,
  exportarTrabajosJSON,
  importarTrabajosJSON,
  borrarTrabajos,
  guardarFlujoTrabajos,
  cargarFlujoTrabajos,
  guardarDatosNegocio,
  cargarDatosNegocio,
  borrarDatosNegocio,
  guardarConfigCotizacion,
  cargarConfigCotizacion,
  borrarConfigCotizacion,
  cargarCotizacionActual,
  guardarDatosCotizacionActual,
  obtenerOCrearNumeroCotizacion,
  borrarCotizacionActual,
  exportarConfiguracionJSON,
  importarConfiguracionJSON
};

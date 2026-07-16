// Cotizaciones comerciales con multiples productos y servicios.
(function () {
  "use strict";

  const STORAGE_KEY = "precio3d_cotizaciones_v2";
  const ACTIVE_KEY = "precio3d_cotizacion_activa_v2";
  const LEGACY_KEY = "precio3d_cotizacion_actual_v1";
  const VERSION = 2;
  const TIPOS = [
    "Impresión 3D",
    "Diseño",
    "Postprocesado",
    "Embalaje",
    "Envío",
    "Material adicional",
    "Servicio",
    "Descuento de línea",
    "Otro"
  ];
  const ESTADOS = ["Borrador", "Enviada", "Aceptada", "Rechazada", "Vencida", "Convertida en trabajo"];

  function numeroSeguro(valor, minimo = 0) {
    const numero = Number(valor);
    return Number.isFinite(numero) ? Math.max(minimo, numero) : minimo;
  }

  function texto(valor, respaldo = "") {
    return String(valor ?? respaldo).trim();
  }

  function crearId(prefijo = "cot") {
    if (globalThis.crypto?.randomUUID) return `${prefijo}-${crypto.randomUUID()}`;
    return `${prefijo}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }

  function ahora() {
    return new Date().toISOString();
  }

  function leer(clave, respaldo) {
    try {
      const contenido = localStorage.getItem(clave);
      return contenido ? JSON.parse(contenido) : respaldo;
    } catch (error) {
      console.warn(`No se pudo leer ${clave}.`, error);
      return respaldo;
    }
  }

  function escribir(clave, valor) {
    try {
      localStorage.setItem(clave, JSON.stringify(valor));
      return true;
    } catch (error) {
      console.warn(`No se pudo guardar ${clave}.`, error);
      return false;
    }
  }

  function emitirActualizacion(cotizacion = null) {
    window.dispatchEvent(new CustomEvent("precio3d:cotizaciones-actualizadas", {
      detail: { cotizacion }
    }));
  }

  function normalizarItem(item = {}, indice = 0) {
    const tipo = TIPOS.includes(item.tipo) ? item.tipo : "Otro";
    const cantidad = numeroSeguro(item.cantidad, tipo === "Descuento de línea" ? 0 : 0);
    const precioUnitario = numeroSeguro(item.precioUnitario);
    const totalCalculado = cantidad * precioUnitario;

    return {
      id: texto(item.id) || crearId("item"),
      tipo,
      origen: ["calculo", "trabajo", "manual"].includes(item.origen) ? item.origen : "manual",
      trabajoId: texto(item.trabajoId),
      calculoId: texto(item.calculoId),
      descripcion: texto(item.descripcion, tipo),
      detalle: texto(item.detalle),
      cantidad,
      precioUnitario,
      totalLinea: numeroSeguro(totalCalculado || item.totalLinea),
      orden: Number.isFinite(Number(item.orden)) ? Number(item.orden) : indice,
      precioIncluyeImpuesto: item.precioIncluyeImpuesto !== false
    };
  }

  function calcularTotales(cotizacion = {}) {
    const items = Array.isArray(cotizacion.items) ? cotizacion.items.map(normalizarItem) : [];
    const subtotal = items
      .filter((item) => item.tipo !== "Descuento de línea")
      .reduce((total, item) => total + numeroSeguro(item.totalLinea), 0);
    const descuentoLineas = items
      .filter((item) => item.tipo === "Descuento de línea")
      .reduce((total, item) => total + numeroSeguro(item.totalLinea), 0);
    const descuento = cotizacion.descuento && typeof cotizacion.descuento === "object"
      ? cotizacion.descuento
      : { tipo: "sin", valor: 0 };
    const tipoDescuento = ["sin", "porcentaje", "monto"].includes(descuento.tipo)
      ? descuento.tipo
      : "sin";
    const valorDescuento = numeroSeguro(descuento.valor);
    const descuentoGlobal = tipoDescuento === "porcentaje"
      ? subtotal * Math.min(valorDescuento, 100) / 100
      : tipoDescuento === "monto"
        ? valorDescuento
        : 0;
    const descuentoTotal = descuentoLineas + descuentoGlobal;
    const envio = numeroSeguro(cotizacion.envio);
    const totalSinLimite = subtotal - descuentoTotal + envio;
    const totalFinal = Math.max(0, totalSinLimite);
    const tipoAbono = ["sin", "porcentaje", "monto"].includes(cotizacion.tipoAbono)
      ? cotizacion.tipoAbono
      : "sin";
    const porcentajeAbono = tipoAbono === "porcentaje"
      ? Math.min(numeroSeguro(cotizacion.porcentajeAbono), 100)
      : 0;
    const abonoCalculado = tipoAbono === "porcentaje"
      ? totalFinal * porcentajeAbono / 100
      : tipoAbono === "monto"
        ? numeroSeguro(cotizacion.montoAbono)
        : 0;
    const montoAbono = Math.min(totalFinal, abonoCalculado);

    return {
      subtotal,
      descuentoLineas,
      descuentoGlobal,
      descuentoTotal,
      envio,
      totalFinal,
      porcentajeAbono,
      montoAbono,
      saldo: Math.max(0, totalFinal - montoAbono),
      descuentoExcedeSubtotal: descuentoTotal > subtotal
    };
  }

  function normalizarHistorial(historial, estado, fecha) {
    const entradas = Array.isArray(historial)
      ? historial.filter(Boolean).map((item) => ({
          estado: ESTADOS.includes(item.estado) ? item.estado : estado,
          fecha: item.fecha || fecha,
          nota: texto(item.nota)
        }))
      : [];
    return entradas.length ? entradas : [{ estado, fecha, nota: "Cotización creada" }];
  }

  function normalizarCotizacion(cotizacion = {}) {
    const fechaCreacion = cotizacion.fechaCreacion || ahora();
    const estado = ESTADOS.includes(cotizacion.estado) ? cotizacion.estado : "Borrador";
    const items = (Array.isArray(cotizacion.items) ? cotizacion.items : [])
      .map(normalizarItem)
      .sort((a, b) => a.orden - b.orden)
      .map((item, indice) => ({ ...item, orden: indice }));
    const base = {
      id: texto(cotizacion.id) || crearId(),
      version: VERSION,
      numeroCotizacion: texto(cotizacion.numeroCotizacion),
      clienteId: texto(cotizacion.clienteId),
      snapshotCliente: cotizacion.snapshotCliente && typeof cotizacion.snapshotCliente === "object"
        ? { ...cotizacion.snapshotCliente }
        : null,
      datosNegocio: cotizacion.datosNegocio && typeof cotizacion.datosNegocio === "object"
        ? { ...cotizacion.datosNegocio }
        : {},
      items,
      descuento: {
        tipo: ["sin", "porcentaje", "monto"].includes(cotizacion.descuento?.tipo)
          ? cotizacion.descuento.tipo
          : "sin",
        valor: numeroSeguro(cotizacion.descuento?.valor)
      },
      envio: numeroSeguro(cotizacion.envio),
      tipoAbono: ["sin", "porcentaje", "monto"].includes(cotizacion.tipoAbono)
        ? cotizacion.tipoAbono
        : "sin",
      porcentajeAbono: numeroSeguro(cotizacion.porcentajeAbono),
      montoAbono: numeroSeguro(cotizacion.montoAbono),
      validezDias: Math.round(numeroSeguro(cotizacion.validezDias ?? 7)),
      tiempoEntrega: texto(cotizacion.tiempoEntrega, "A coordinar"),
      condicionesPago: texto(cotizacion.condicionesPago, "50% de abono para iniciar y 50% contra entrega."),
      observaciones: texto(cotizacion.observaciones),
      estado,
      historialEstados: normalizarHistorial(cotizacion.historialEstados, estado, fechaCreacion),
      fechaCreacion,
      fechaActualizacion: cotizacion.fechaActualizacion || fechaCreacion,
      moneda: texto(cotizacion.moneda, "CLP").toUpperCase(),
      trabajoId: texto(cotizacion.trabajoId)
    };

    return { ...base, ...calcularTotales(base) };
  }

  function crearNumero(id, forzar = true) {
    return window.StoragePrecio3D?.obtenerOCrearNumeroCotizacion?.(`cotizacion-v2:${id}`, forzar)
      || `COT-${Date.now()}`;
  }

  function crearCotizacion(datos = {}) {
    const id = crearId();
    return normalizarCotizacion({
      ...datos,
      id,
      numeroCotizacion: datos.numeroCotizacion || crearNumero(id, true),
      fechaCreacion: datos.fechaCreacion || ahora(),
      fechaActualizacion: datos.fechaActualizacion || ahora()
    });
  }

  function cargarCotizaciones() {
    const contenido = leer(STORAGE_KEY, []);
    const lista = Array.isArray(contenido) ? contenido : contenido?.cotizaciones;
    return (Array.isArray(lista) ? lista : []).map(normalizarCotizacion);
  }

  function guardarLista(lista) {
    const cotizaciones = lista.map(normalizarCotizacion);
    const guardado = escribir(STORAGE_KEY, { version: VERSION, cotizaciones });
    if (guardado) emitirActualizacion();
    return guardado;
  }

  function guardarCotizacion(cotizacion) {
    const normalizada = normalizarCotizacion({ ...cotizacion, fechaActualizacion: ahora() });
    if (!normalizada.numeroCotizacion) normalizada.numeroCotizacion = crearNumero(normalizada.id, true);
    const lista = cargarCotizaciones();
    const indice = lista.findIndex((item) => item.id === normalizada.id);
    if (indice >= 0) lista[indice] = normalizada;
    else lista.unshift(normalizada);
    if (!guardarLista(lista)) return null;
    establecerActiva(normalizada.id);
    return normalizada;
  }

  function obtenerCotizacion(id) {
    return cargarCotizaciones().find((item) => item.id === id) || null;
  }

  function eliminarCotizacion(id) {
    const lista = cargarCotizaciones();
    const nueva = lista.filter((item) => item.id !== id);
    if (lista.length === nueva.length) return false;
    const guardado = guardarLista(nueva);
    if (guardado && obtenerActivaId() === id) establecerActiva("");
    return guardado;
  }

  function duplicarCotizacion(id) {
    const original = obtenerCotizacion(id);
    if (!original) return null;
    return guardarCotizacion(crearCotizacion({
      ...original,
      numeroCotizacion: "",
      estado: "Borrador",
      trabajoId: "",
      historialEstados: [],
      fechaCreacion: "",
      fechaActualizacion: "",
      items: original.items.map((item) => ({ ...item, id: crearId("item") }))
    }));
  }

  function establecerActiva(id) {
    try {
      if (id) localStorage.setItem(ACTIVE_KEY, id);
      else localStorage.removeItem(ACTIVE_KEY);
      return true;
    } catch (error) {
      console.warn("No se pudo guardar la cotización activa.", error);
      return false;
    }
  }

  function obtenerActivaId() {
    try {
      return localStorage.getItem(ACTIVE_KEY) || "";
    } catch (error) {
      return "";
    }
  }

  function obtenerActiva() {
    return obtenerCotizacion(obtenerActivaId());
  }

  function agregarItem(cotizacion, item) {
    const base = normalizarCotizacion(cotizacion);
    base.items.push(normalizarItem({ ...item, orden: base.items.length }, base.items.length));
    return normalizarCotizacion(base);
  }

  function actualizarItem(cotizacion, itemId, cambios = {}) {
    const base = normalizarCotizacion(cotizacion);
    base.items = base.items.map((item, indice) => item.id === itemId
      ? normalizarItem({ ...item, ...cambios, id: item.id, orden: indice }, indice)
      : item);
    return normalizarCotizacion(base);
  }

  function eliminarItem(cotizacion, itemId) {
    const base = normalizarCotizacion(cotizacion);
    base.items = base.items.filter((item) => item.id !== itemId);
    return normalizarCotizacion(base);
  }

  function moverItem(cotizacion, itemId, direccion) {
    const base = normalizarCotizacion(cotizacion);
    const indice = base.items.findIndex((item) => item.id === itemId);
    const destino = indice + (direccion === "arriba" ? -1 : 1);
    if (indice < 0 || destino < 0 || destino >= base.items.length) return base;
    [base.items[indice], base.items[destino]] = [base.items[destino], base.items[indice]];
    return normalizarCotizacion(base);
  }

  function cambiarEstado(cotizacion, estado, nota = "") {
    const base = normalizarCotizacion(cotizacion);
    if (!ESTADOS.includes(estado) || estado === base.estado) return base;
    base.estado = estado;
    base.historialEstados.push({ estado, fecha: ahora(), nota: texto(nota) });
    return normalizarCotizacion(base);
  }

  function estaVencida(cotizacion) {
    const base = normalizarCotizacion(cotizacion);
    if (["Aceptada", "Rechazada", "Convertida en trabajo"].includes(base.estado)) return false;
    const limite = new Date(base.fechaCreacion);
    limite.setDate(limite.getDate() + base.validezDias);
    return Date.now() > limite.getTime();
  }

  function crearItemDesdeCalculo(datos, resultado) {
    const cantidad = Math.max(1, numeroSeguro(datos?.cantidadProductos || datos?.cantidad || 1));
    const precioFinal = numeroSeguro(resultado?.precioFinal);
    // No volver a aplicar impuesto a líneas cuyo precio ya proviene de precioFinal.
    return normalizarItem({
      tipo: "Impresión 3D",
      origen: "calculo",
      calculoId: texto(datos?.id || datos?.calculoId),
      descripcion: texto(datos?.nombreTrabajo, "Trabajo sin nombre"),
      detalle: texto(datos?.descripcion),
      cantidad,
      precioUnitario: cantidad > 0 ? precioFinal / cantidad : precioFinal,
      precioIncluyeImpuesto: true
    });
  }

  function crearItemDesdeTrabajo(trabajo, usarPrecioVendido = false) {
    const cantidad = Math.max(1, numeroSeguro(trabajo?.datos?.cantidadProductos || trabajo?.cantidad || 1));
    const precio = usarPrecioVendido && numeroSeguro(trabajo?.precioVendidoReal) > 0
      ? numeroSeguro(trabajo.precioVendidoReal)
      : numeroSeguro(trabajo?.precioFinal);
    return normalizarItem({
      tipo: "Impresión 3D",
      origen: "trabajo",
      trabajoId: texto(trabajo?.id),
      descripcion: texto(trabajo?.nombreTrabajo, "Trabajo sin nombre"),
      detalle: texto(trabajo?.descripcion),
      cantidad,
      precioUnitario: cantidad > 0 ? precio / cantidad : precio,
      precioIncluyeImpuesto: true
    });
  }

  function migrarCotizacionAntigua() {
    if (cargarCotizaciones().length) return null;
    const antigua = leer(LEGACY_KEY, null);
    if (!antigua || typeof antigua !== "object") return null;
    const precioFinal = numeroSeguro(antigua.precioFinal);
    if (!precioFinal && !antigua.nombreTrabajo && !antigua.numeroCotizacion) return null;
    const cantidad = Math.max(1, numeroSeguro(antigua.cantidad || 1));
    const condiciones = antigua.condiciones || {};
    const migrada = crearCotizacion({
      numeroCotizacion: texto(antigua.numeroCotizacion) || undefined,
      clienteId: texto(antigua.clienteId),
      snapshotCliente: antigua.snapshotCliente || antigua.datosCliente || null,
      datosNegocio: antigua.datosNegocio || {},
      moneda: antigua.moneda || "CLP",
      validezDias: condiciones.validezCotizacionDias ?? 7,
      tiempoEntrega: condiciones.tiempoEntrega || "A coordinar",
      condicionesPago: condiciones.condicionesPago || "",
      observaciones: condiciones.observacionesCotizacion || antigua.descripcionTrabajo || "",
      fechaCreacion: antigua.creadoEn || antigua.fechaCreacion || ahora(),
      items: [{
        tipo: "Impresión 3D",
        origen: "calculo",
        descripcion: antigua.nombreTrabajo || "Trabajo sin nombre",
        detalle: antigua.descripcionTrabajo || "",
        cantidad,
        precioUnitario: cantidad > 0 ? precioFinal / cantidad : precioFinal,
        totalLinea: precioFinal,
        precioIncluyeImpuesto: true
      }]
    });
    const guardada = guardarCotizacion(migrada);
    if (guardada) escribir(`${LEGACY_KEY}_migrada_v2`, { id: guardada.id, fecha: ahora() });
    return guardada;
  }

  function exportarJSON() {
    return JSON.stringify({ version: VERSION, exportadoEn: ahora(), cotizaciones: cargarCotizaciones() }, null, 2);
  }

  function importarJSON(contenido, combinar = true) {
    try {
      const datos = typeof contenido === "string" ? JSON.parse(contenido) : contenido;
      const entrada = Array.isArray(datos) ? datos : datos?.cotizaciones;
      if (!Array.isArray(entrada)) return null;
      const importadas = entrada.map(normalizarCotizacion);
      const base = combinar ? cargarCotizaciones() : [];
      const mapa = new Map(base.map((item) => [item.id, item]));
      importadas.forEach((item) => mapa.set(item.id, item));
      const lista = Array.from(mapa.values());
      return guardarLista(lista) ? lista : null;
    } catch (error) {
      console.warn("Respaldo de cotizaciones inválido.", error);
      return null;
    }
  }

  window.CotizacionesPrecio3D = {
    STORAGE_KEY,
    VERSION,
    TIPOS,
    ESTADOS,
    normalizarItem,
    normalizarCotizacion,
    calcularTotales,
    crearCotizacion,
    cargarCotizaciones,
    guardarCotizacion,
    obtenerCotizacion,
    eliminarCotizacion,
    duplicarCotizacion,
    establecerActiva,
    obtenerActiva,
    agregarItem,
    actualizarItem,
    eliminarItem,
    moverItem,
    cambiarEstado,
    estaVencida,
    crearItemDesdeCalculo,
    crearItemDesdeTrabajo,
    migrarCotizacionAntigua,
    exportarJSON,
    importarJSON
  };
})();

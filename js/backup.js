(function () {
  "use strict";

  const APP_ID = "precio3d";
  const BACKUP_VERSION = 2;
  const APP_VERSION = "4D";
  const ULTIMO_RESPALDO_KEY = "precio3d_ultimo_respaldo_v1";
  const CLAVES = {
    configuracion: "precio3d_config_v1",
    datosNegocio: "precio3d_datos_negocio_v1",
    configuracionCotizacion: "precio3d_cotizacion_config_v1",
    clientes: "precio3d_clientes_v1",
    cotizaciones: "precio3d_cotizaciones_v2",
    trabajos: "precio3d_trabajos_v1",
    impresoras: "precio3d_impresoras_v1",
    filamentos: "precio3d_filamentos_v1",
    seccionActiva: "precio3d_seccion_activa_v1",
    sidebarExpandida: "precio3d_sidebar_expandida_v1",
    flujoTrabajos: "precio3d_flujo_trabajos_v1",
    contadorCotizaciones: "precio3d_cotizacion_contador_v1",
    cotizacionActual: "precio3d_cotizacion_actual_v1",
    cotizacionActivaId: "precio3d_cotizacion_activa_v2"
  };
  const COLECCIONES = ["clientes", "cotizaciones", "trabajos", "impresoras", "filamentos"];
  const CAMPOS_NUMERICOS = new Set([
    "cantidad", "precioFinal", "costoTotal", "utilidadObjetivo", "margenReal", "totalFinal", "subtotal",
    "descuentoValor", "impuestoValor", "abonoPorcentaje", "monto", "saldoPendiente", "montoAbonado",
    "precioVendidoReal", "costoCompra", "costoHerramientas", "potenciaPromedioWatts", "porcentajeMantenimiento",
    "anosVidaUtil", "diasOperativosAno", "horasProductivasDia", "pesoNetoInicialGramos", "pesoRestanteGramos",
    "precioPorKilo", "precioCompraTotal", "cantidadGramos", "stockAnterior", "stockNuevo", "precioUnitario"
  ]);
  const ESTADOS_TRABAJO = new Set(["Pendiente", "Aceptado", "Esperando abono", "En producción", "Terminado", "Entregado", "Pagado", "Rechazado", "Cancelado"]);
  const CAMPOS_FECHA = /fecha|createdAt|updatedAt|guardadoEn|createdAt|updatedAt/i;
  const CLAVES_PELIGROSAS = new Set(["__proto__", "prototype", "constructor"]);
  let respaldoPrevio = null;
  const t = (clave, reemplazos = {}) =>
    window.obtenerTextoI18n?.(clave, reemplazos) || clave;

  function texto(valor, respaldo = "") {
    return String(valor ?? respaldo).trim();
  }

  function numero(valor, respaldo = 0) {
    const convertido = Number(valor);
    return Number.isFinite(convertido) ? convertido : respaldo;
  }

  function crearId(prefijo = "registro") {
    if (globalThis.crypto?.randomUUID) return `${prefijo}-${crypto.randomUUID()}`;
    return `${prefijo}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }

  function leerJSON(clave, respaldo = null) {
    try {
      const valor = localStorage.getItem(clave);
      return valor == null ? respaldo : JSON.parse(valor);
    } catch (error) {
      console.warn(`No fue posible leer ${clave}.`, error);
      return respaldo;
    }
  }

  function extraerLista(clave, propiedad) {
    const valor = leerJSON(clave, []);
    if (Array.isArray(valor)) return valor;
    return Array.isArray(valor?.[propiedad]) ? valor[propiedad] : [];
  }

  function copiar(valor) {
    return valor == null ? valor : JSON.parse(JSON.stringify(valor));
  }

  function obtenerPreferencias() {
    return {
      seccionActiva: localStorage.getItem(CLAVES.seccionActiva) || "cotizar",
      sidebarExpandida: localStorage.getItem(CLAVES.sidebarExpandida),
      flujoTrabajos: leerJSON(CLAVES.flujoTrabajos, "simple"),
      contadorCotizaciones: leerJSON(CLAVES.contadorCotizaciones, null),
      cotizacionActual: leerJSON(CLAVES.cotizacionActual, null),
      cotizacionActivaId: localStorage.getItem(CLAVES.cotizacionActivaId) || ""
    };
  }

  function obtenerDatosAplicacion() {
    return {
      configuracion: window.StoragePrecio3D?.cargarConfiguracion?.() || {},
      datosNegocio: window.StoragePrecio3D?.cargarDatosNegocio?.() || {},
      configuracionCotizacion: window.StoragePrecio3D?.cargarConfigCotizacion?.() || {},
      clientes: copiar(extraerLista(CLAVES.clientes, "clientes")),
      cotizaciones: copiar(extraerLista(CLAVES.cotizaciones, "cotizaciones")),
      trabajos: copiar(extraerLista(CLAVES.trabajos, "trabajos")),
      impresoras: copiar(extraerLista(CLAVES.impresoras, "impresoras")),
      filamentos: copiar(extraerLista(CLAVES.filamentos, "bobinas")),
      preferencias: obtenerPreferencias()
    };
  }

  function contarMovimientos(filamentos) {
    return (filamentos || []).reduce((total, bobina) => total + (Array.isArray(bobina?.movimientos) ? bobina.movimientos.length : 0), 0);
  }

  function crearMetadata(data) {
    return {
      totalClientes: data.clientes.length,
      totalCotizaciones: data.cotizaciones.length,
      totalTrabajos: data.trabajos.length,
      totalImpresoras: data.impresoras.length,
      totalBobinas: data.filamentos.length,
      totalMovimientos: contarMovimientos(data.filamentos)
    };
  }

  function crearRespaldoCompleto(datos = obtenerDatosAplicacion()) {
    const data = copiar(datos);
    COLECCIONES.forEach((coleccion) => {
      if (!Array.isArray(data[coleccion])) data[coleccion] = [];
    });
    data.configuracion = data.configuracion && typeof data.configuracion === "object" ? data.configuracion : {};
    data.datosNegocio = data.datosNegocio && typeof data.datosNegocio === "object" ? data.datosNegocio : {};
    data.configuracionCotizacion = data.configuracionCotizacion && typeof data.configuracionCotizacion === "object" ? data.configuracionCotizacion : {};
    data.preferencias = data.preferencias && typeof data.preferencias === "object" ? data.preferencias : {};
    return {
      app: APP_ID,
      backupVersion: BACKUP_VERSION,
      appVersion: APP_VERSION,
      createdAt: new Date().toISOString(),
      source: "local",
      metadata: crearMetadata(data),
      data
    };
  }

  function fechaArchivo(fecha = new Date()) {
    const pad = (valor) => String(valor).padStart(2, "0");
    return `${fecha.getFullYear()}-${pad(fecha.getMonth() + 1)}-${pad(fecha.getDate())}-${pad(fecha.getHours())}${pad(fecha.getMinutes())}`;
  }

  function descargarJSON(nombre, contenido) {
    const enlace = document.createElement("a");
    enlace.href = URL.createObjectURL(new Blob([JSON.stringify(contenido, null, 2)], { type: "application/json;charset=utf-8" }));
    enlace.download = nombre;
    document.body.appendChild(enlace);
    enlace.click();
    enlace.remove();
    setTimeout(() => URL.revokeObjectURL(enlace.href), 0);
  }

  function guardarMetadataUltimoRespaldo(respaldo) {
    const metadata = {
      createdAt: respaldo.createdAt,
      backupVersion: respaldo.backupVersion,
      totals: respaldo.metadata
    };
    try {
      localStorage.setItem(ULTIMO_RESPALDO_KEY, JSON.stringify(metadata));
      return true;
    } catch (error) {
      console.warn("No se pudo registrar la fecha del último respaldo.", error);
      return false;
    }
  }

  function descargarRespaldoCompleto() {
    const respaldo = crearRespaldoCompleto();
    descargarJSON(`respaldo-precio3d-${fechaArchivo(new Date())}.json`, respaldo);
    guardarMetadataUltimoRespaldo(respaldo);
    return respaldo;
  }

  function crearRespaldoPrevio() {
    respaldoPrevio = crearRespaldoCompleto();
    return copiar(respaldoPrevio);
  }

  function descargarRespaldoPrevio() {
    if (!respaldoPrevio) return false;
    descargarJSON(`respaldo-previo-precio3d-${fechaArchivo(new Date(respaldoPrevio.createdAt))}.json`, respaldoPrevio);
    return true;
  }

  function obtenerFechaUltimoRespaldo() {
    const metadata = leerJSON(ULTIMO_RESPALDO_KEY, null);
    return metadata && typeof metadata === "object" ? metadata : null;
  }

  function bytesTexto(valor) {
    try {
      return new TextEncoder().encode(valor || "").length;
    } catch (_error) {
      return String(valor || "").length * 2;
    }
  }

  function obtenerResumenDatos() {
    const data = obtenerDatosAplicacion();
    const grupos = {
      configuracion: [CLAVES.configuracion, CLAVES.datosNegocio, CLAVES.configuracionCotizacion, CLAVES.seccionActiva, CLAVES.sidebarExpandida, CLAVES.flujoTrabajos, CLAVES.contadorCotizaciones, CLAVES.cotizacionActual, CLAVES.cotizacionActivaId],
      clientes: [CLAVES.clientes],
      cotizaciones: [CLAVES.cotizaciones],
      trabajos: [CLAVES.trabajos],
      impresoras: [CLAVES.impresoras],
      inventario: [CLAVES.filamentos]
    };
    const tamanos = Object.fromEntries(Object.entries(grupos).map(([grupo, claves]) => [
      grupo,
      claves.reduce((total, clave) => total + bytesTexto(localStorage.getItem(clave)), 0)
    ]));
    tamanos.total = Object.values(tamanos).reduce((total, valor) => total + valor, 0);
    return { ...crearMetadata(data), tamanos };
  }

  function sanitizar(valor, ruta = "respaldo") {
    if (valor === null || ["string", "number", "boolean"].includes(typeof valor)) return valor;
    if (Array.isArray(valor)) return valor.map((item, indice) => sanitizar(item, `${ruta}[${indice}]`));
    if (!valor || typeof valor !== "object") throw new Error(`Estructura no permitida en ${ruta}.`);
    const limpio = {};
    Object.keys(valor).forEach((clave) => {
      if (CLAVES_PELIGROSAS.has(clave)) throw new Error(`Clave no permitida en ${ruta}.`);
      limpio[clave] = sanitizar(valor[clave], `${ruta}.${clave}`);
    });
    return limpio;
  }

  function parsearRespaldo(contenido) {
    if (typeof contenido === "string") return JSON.parse(contenido.replace(/^\uFEFF/, ""));
    return contenido;
  }

  function nombreRegistro(registro, indice) {
    return texto(registro?.nombre || registro?.nombreTrabajo || registro?.numeroCotizacion || registro?.materialNombre, `Registro ${indice + 1}`);
  }

  function validarFechas(registro, ruta, advertencias) {
    Object.entries(registro || {}).forEach(([clave, valor]) => {
      if (!valor || !CAMPOS_FECHA.test(clave) || typeof valor !== "string") return;
      const fecha = new Date(valor);
      if (Number.isNaN(fecha.getTime()) || fecha.getFullYear() < 2000 || fecha.getFullYear() > 2100) {
        advertencias.push(`${ruta}: la fecha “${clave}” no parece válida.`);
      }
    });
  }

  function buscarNumeroInvalido(valor, ruta = "registro") {
    if (Array.isArray(valor)) {
      for (let indice = 0; indice < valor.length; indice += 1) {
        const hallazgo = buscarNumeroInvalido(valor[indice], `${ruta}[${indice}]`);
        if (hallazgo) return hallazgo;
      }
      return "";
    }
    if (!valor || typeof valor !== "object") return "";
    for (const [clave, contenido] of Object.entries(valor)) {
      if (CAMPOS_NUMERICOS.has(clave) && contenido !== "" && contenido !== null && contenido !== undefined && !Number.isFinite(Number(contenido))) {
        return `${ruta}.${clave}`;
      }
      const hallazgo = buscarNumeroInvalido(contenido, `${ruta}.${clave}`);
      if (hallazgo) return hallazgo;
    }
    return "";
  }

  function validarRespaldo(contenido) {
    const errores = [];
    const advertencias = [];
    let rechazados = 0;
    let origen;
    try {
      origen = sanitizar(parsearRespaldo(contenido));
    } catch (error) {
      return { valido: false, errores: [`JSON inválido o inseguro: ${error.message}`], advertencias, rechazados, validos: 0, respaldo: null };
    }
    if (!origen || typeof origen !== "object" || Array.isArray(origen)) {
      return { valido: false, errores: ["El respaldo debe ser un objeto JSON."], advertencias, rechazados, validos: 0, respaldo: null };
    }
    const esAntiguo = !origen.app && (!origen.backupVersion || origen.backupVersion === 1) && (origen.data || COLECCIONES.some((clave) => clave in origen));
    if (origen.app !== APP_ID && !esAntiguo) errores.push('El campo app debe ser "precio3d".');
    if (esAntiguo) advertencias.push("Respaldo antiguo detectado; los campos ausentes se completarán en memoria.");
    const version = Number(origen.backupVersion || 1);
    if (!Number.isInteger(version) || version < 1) errores.push("La versión del respaldo no es válida.");
    if (version > BACKUP_VERSION) errores.push("Este respaldo fue creado con una versión más reciente de la aplicación.");
    const origenData = origen.data && typeof origen.data === "object" ? origen.data : origen;
    if (!origenData || typeof origenData !== "object" || Array.isArray(origenData)) errores.push("El respaldo no contiene un bloque data válido.");

    const data = {
      configuracion: copiar(origenData?.configuracion || {}),
      datosNegocio: copiar(origenData?.datosNegocio || {}),
      configuracionCotizacion: copiar(origenData?.configuracionCotizacion || {}),
      preferencias: copiar(origenData?.preferencias || {})
    };
    let validos = 0;
    COLECCIONES.forEach((coleccion) => {
      const alias = coleccion === "filamentos" ? origenData?.bobinas : null;
      const entrada = origenData?.[coleccion] ?? alias ?? [];
      if (origenData?.[coleccion] === undefined && alias == null) advertencias.push(`La colección ${coleccion} no existe; se usará una lista vacía.`);
      if (!Array.isArray(entrada)) {
        errores.push(`La colección ${coleccion} debe ser una lista.`);
        data[coleccion] = [];
        return;
      }
      data[coleccion] = entrada.reduce((lista, registro, indice) => {
        if (!registro || typeof registro !== "object" || Array.isArray(registro)) {
          rechazados += 1;
          return lista;
        }
        const copiaRegistro = copiar(registro);
        const numeroInvalido = buscarNumeroInvalido(copiaRegistro, `${coleccion}[${indice}]`);
        if (numeroInvalido) {
          rechazados += 1;
          advertencias.push(`${coleccion} · ${nombreRegistro(copiaRegistro, indice)}: se rechazó por un valor numérico inválido en ${numeroInvalido}.`);
          return lista;
        }
        if (!texto(copiaRegistro.id)) {
          copiaRegistro.id = crearId(`recuperado-${coleccion}`);
          advertencias.push(`${coleccion} · ${nombreRegistro(copiaRegistro, indice)}: se recuperará un ID ausente.`);
        }
        validarFechas(copiaRegistro, `${coleccion} · ${nombreRegistro(copiaRegistro, indice)}`, advertencias);
        lista.push(copiaRegistro);
        validos += 1;
        return lista;
      }, []);
      duplicados(data[coleccion], "id").forEach((id) => errores.push(`La colección ${coleccion} contiene el ID duplicado ${id}.`));
    });
    const movimientosImportados = data.filamentos.flatMap((bobina) => Array.isArray(bobina.movimientos) ? bobina.movimientos : []);
    duplicados(movimientosImportados, "id").forEach((id) => errores.push(`El respaldo contiene el movimiento de inventario duplicado ${id}.`));
    const respaldo = {
      app: APP_ID,
      backupVersion: version,
      appVersion: texto(origen.appVersion, "anterior"),
      createdAt: texto(origen.createdAt) || new Date().toISOString(),
      source: texto(origen.source, "local"),
      metadata: crearMetadata(data),
      data
    };
    if (Number.isNaN(new Date(respaldo.createdAt).getTime())) advertencias.push("La fecha de creación del respaldo no es válida.");
    return { valido: errores.length === 0, errores, advertencias, rechazados, validos, respaldo };
  }

  function ordenarObjeto(valor) {
    if (Array.isArray(valor)) return valor.map(ordenarObjeto);
    if (!valor || typeof valor !== "object") return valor;
    return Object.fromEntries(Object.keys(valor).sort().map((clave) => [clave, ordenarObjeto(valor[clave])]));
  }

  function iguales(a, b) {
    return JSON.stringify(ordenarObjeto(a)) === JSON.stringify(ordenarObjeto(b));
  }

  function previsualizarImportacion(contenido) {
    const validacion = validarRespaldo(contenido);
    if (!validacion.valido) return { ...validacion, conflictos: [], resumen: null };
    const actuales = obtenerDatosAplicacion();
    const conflictos = [];
    const repetidos = [];
    COLECCIONES.forEach((coleccion) => {
      const mapa = new Map(actuales[coleccion].map((registro) => [texto(registro.id), registro]));
      validacion.respaldo.data[coleccion].forEach((registro, indice) => {
        const actual = mapa.get(texto(registro.id));
        if (!actual) return;
        const detalle = { coleccion, id: registro.id, nombre: nombreRegistro(registro, indice), actual, importado: registro };
        if (iguales(actual, registro)) repetidos.push(detalle);
        else conflictos.push(detalle);
      });
    });
    const movimientosActuales = new Map(actuales.filamentos.flatMap((bobina) => Array.isArray(bobina.movimientos) ? bobina.movimientos : []).map((movimiento) => [texto(movimiento.id), movimiento]));
    validacion.respaldo.data.filamentos.forEach((bobina) => {
      (Array.isArray(bobina.movimientos) ? bobina.movimientos : []).forEach((movimiento, indice) => {
        const actual = movimientosActuales.get(texto(movimiento.id));
        if (!actual) return;
        const detalle = { coleccion: "movimientos", id: movimiento.id, nombre: texto(movimiento.referenciaNombre, `Movimiento ${indice + 1}`), actual, importado: movimiento };
        if (iguales(actual, movimiento)) repetidos.push(detalle);
        else conflictos.push(detalle);
      });
    });
    return {
      ...validacion,
      conflictos,
      repetidos,
      resumen: {
        fecha: validacion.respaldo.createdAt,
        version: validacion.respaldo.backupVersion,
        ...validacion.respaldo.metadata,
        validos: validacion.validos,
        advertencias: validacion.advertencias.length,
        rechazados: validacion.rechazados,
        conflictos: conflictos.length,
        repetidos: repetidos.length
      }
    };
  }

  function referenciasA(data, coleccion, id) {
    if (coleccion === "clientes") return data.trabajos.some((item) => item.clienteId === id) || data.cotizaciones.some((item) => item.clienteId === id);
    if (coleccion === "impresoras") return data.trabajos.some((item) => item.impresoraId === id || item.datos?.impresoraId === id);
    if (coleccion === "filamentos") return data.trabajos.some((item) => item.filamentoId === id || item.datos?.filamentoId === id);
    return true;
  }

  function combinarColecciones(actuales, importados, coleccion, politica, datosCompletos, avisos) {
    const resultado = actuales.map(copiar);
    const indices = new Map(resultado.map((registro, indice) => [texto(registro.id), indice]));
    importados.forEach((registro) => {
      const id = texto(registro.id);
      if (!indices.has(id)) {
        indices.set(id, resultado.length);
        resultado.push(copiar(registro));
        return;
      }
      const indice = indices.get(id);
      if (iguales(resultado[indice], registro) || politica === "actual") return;
      if (politica === "importado") {
        resultado[indice] = copiar(registro);
        return;
      }
      if (politica === "ambos" && !referenciasA(datosCompletos, coleccion, id)) {
        const duplicado = { ...copiar(registro), id: crearId(`${coleccion}-importado`) };
        resultado.push(duplicado);
        avisos.push(`${coleccion}: se conservó una copia segura de ${nombreRegistro(registro, 0)}.`);
        return;
      }
      avisos.push(`${coleccion}: se mantuvo el registro actual con ID ${id} porque conservar ambos no era seguro.`);
    });
    return resultado;
  }

  function deduplicarMovimientos(filamentos, avisos) {
    const ids = new Set();
    return filamentos.map((bobina) => {
      if (!Array.isArray(bobina.movimientos)) return bobina;
      const movimientos = bobina.movimientos.filter((movimiento) => {
        const id = texto(movimiento?.id);
        if (!id || !ids.has(id)) {
          if (id) ids.add(id);
          return true;
        }
        avisos.push(`Inventario: se omitió el movimiento repetido ${id} durante la combinación.`);
        return false;
      });
      return { ...bobina, movimientos };
    });
  }

  function capturarEstadoClaves() {
    return Object.fromEntries(Object.values(CLAVES).map((clave) => [clave, localStorage.getItem(clave)]));
  }

  function restaurarEstadoClaves(estado) {
    Object.entries(estado).forEach(([clave, valor]) => {
      if (valor === null) localStorage.removeItem(clave);
      else localStorage.setItem(clave, valor);
    });
  }

  function escribirDatos(data) {
    const ahora = new Date().toISOString();
    localStorage.setItem(CLAVES.configuracion, JSON.stringify({ version: 1, guardadoEn: ahora, configuracion: data.configuracion || {} }));
    localStorage.setItem(CLAVES.datosNegocio, JSON.stringify({ version: 1, guardadoEn: ahora, datosNegocio: data.datosNegocio || {} }));
    localStorage.setItem(CLAVES.configuracionCotizacion, JSON.stringify({ version: 1, guardadoEn: ahora, configCotizacion: data.configuracionCotizacion || {} }));
    localStorage.setItem(CLAVES.clientes, JSON.stringify({ version: 1, guardadoEn: ahora, clientes: data.clientes || [] }));
    localStorage.setItem(CLAVES.cotizaciones, JSON.stringify({ version: 2, cotizaciones: data.cotizaciones || [] }));
    localStorage.setItem(CLAVES.trabajos, JSON.stringify({ version: 2, guardadoEn: ahora, trabajos: data.trabajos || [] }));
    localStorage.setItem(CLAVES.impresoras, JSON.stringify(data.impresoras || []));
    localStorage.setItem(CLAVES.filamentos, JSON.stringify({ version: 1, updatedAt: ahora, bobinas: data.filamentos || [] }));
    const preferencias = data.preferencias || {};
    const asignar = (clave, valor, json = false) => {
      if (valor === undefined || valor === null || valor === "") localStorage.removeItem(clave);
      else localStorage.setItem(clave, json ? JSON.stringify(valor) : String(valor));
    };
    asignar(CLAVES.seccionActiva, preferencias.seccionActiva);
    asignar(CLAVES.sidebarExpandida, preferencias.sidebarExpandida);
    asignar(CLAVES.flujoTrabajos, preferencias.flujoTrabajos, true);
    asignar(CLAVES.contadorCotizaciones, preferencias.contadorCotizaciones, true);
    asignar(CLAVES.cotizacionActual, preferencias.cotizacionActual, true);
    asignar(CLAVES.cotizacionActivaId, preferencias.cotizacionActivaId);
  }

  function emitirActualizaciones() {
    ["clientes", "cotizaciones", "trabajos", "impresoras", "filamentos"].forEach((modulo) => {
      window.dispatchEvent(new CustomEvent(`precio3d:${modulo}-actualizados`));
    });
    window.dispatchEvent(new CustomEvent("precio3d:respaldo-importado"));
  }

  function importarRespaldo(contenido, opciones = {}) {
    const vista = previsualizarImportacion(contenido);
    if (!vista.valido) return { ok: false, errores: vista.errores, advertencias: vista.advertencias };
    const modo = opciones.modo === "reemplazar" ? "reemplazar" : "combinar";
    const politica = ["actual", "importado", "ambos"].includes(opciones.conflictos) ? opciones.conflictos : "actual";
    const estadoAnterior = capturarEstadoClaves();
    const previo = opciones.respaldoPrevio || crearRespaldoPrevio();
    const avisos = [...vista.advertencias];
    try {
      let destino = copiar(vista.respaldo.data);
      if (modo === "combinar") {
        const actuales = obtenerDatosAplicacion();
        COLECCIONES.forEach((coleccion) => {
          destino[coleccion] = combinarColecciones(actuales[coleccion], destino[coleccion], coleccion, politica, destino, avisos);
        });
        destino.filamentos = deduplicarMovimientos(destino.filamentos, avisos);
        const usarImportado = politica === "importado";
        destino.configuracion = usarImportado ? { ...actuales.configuracion, ...destino.configuracion } : { ...destino.configuracion, ...actuales.configuracion };
        destino.datosNegocio = usarImportado ? { ...actuales.datosNegocio, ...destino.datosNegocio } : { ...destino.datosNegocio, ...actuales.datosNegocio };
        destino.configuracionCotizacion = usarImportado ? { ...actuales.configuracionCotizacion, ...destino.configuracionCotizacion } : { ...destino.configuracionCotizacion, ...actuales.configuracionCotizacion };
        destino.preferencias = usarImportado ? { ...actuales.preferencias, ...destino.preferencias } : { ...destino.preferencias, ...actuales.preferencias };
      }
      escribirDatos(destino);
      emitirActualizaciones();
      return { ok: true, modo, conflictos: vista.conflictos.length, advertencias: avisos, respaldoPrevio: previo, resumen: crearMetadata(destino) };
    } catch (error) {
      try {
        restaurarEstadoClaves(estadoAnterior);
        emitirActualizaciones();
      } catch (restauracionError) {
        console.error("No fue posible restaurar el estado anterior.", restauracionError);
      }
      const capacidad = error?.name === "QuotaExceededError" || /quota|storage/i.test(error?.message || "");
      return {
        ok: false,
        errores: [capacidad ? "No fue posible guardar los datos. El almacenamiento del navegador podría estar lleno." : `La importación falló y se restauró el estado anterior: ${error.message}`],
        advertencias: avisos
      };
    }
  }

  function duplicados(lista, campo) {
    const vistos = new Set();
    return new Set(lista.map((item) => texto(item?.[campo])).filter((valor) => valor && (vistos.has(valor) || !vistos.add(valor))));
  }

  function verificarIntegridadDatos(datos = obtenerDatosAplicacion()) {
    const hallazgos = [];
    let secuencia = 0;
    const agregar = (nivel, modulo, registro, descripcion, accion, reparacion = null) => {
      hallazgos.push({ id: `integridad-${++secuencia}`, nivel, modulo, registro: registro || "Registro sin nombre", descripcion, accion, reparacion });
    };
    const clientes = Array.isArray(datos.clientes) ? datos.clientes : [];
    const cotizaciones = Array.isArray(datos.cotizaciones) ? datos.cotizaciones : [];
    const trabajos = Array.isArray(datos.trabajos) ? datos.trabajos : [];
    const impresoras = Array.isArray(datos.impresoras) ? datos.impresoras : [];
    const filamentos = Array.isArray(datos.filamentos) ? datos.filamentos : [];
    const idsClientes = new Set(clientes.map((item) => texto(item.id)).filter(Boolean));
    const idsCotizaciones = new Set(cotizaciones.map((item) => texto(item.id)).filter(Boolean));
    const idsTrabajos = new Set(trabajos.map((item) => texto(item.id)).filter(Boolean));
    const idsImpresoras = new Set(impresoras.map((item) => texto(item.id)).filter(Boolean));
    const idsFilamentos = new Set(filamentos.map((item) => texto(item.id)).filter(Boolean));

    const revisarIds = (lista, modulo) => {
      duplicados(lista, "id").forEach((id) => agregar("Error", modulo, id, "Hay más de un registro con el mismo ID.", "Revisar y conservar manualmente el registro correcto."));
      lista.forEach((item, indice) => {
        if (!texto(item?.id)) agregar("Error", modulo, nombreRegistro(item, indice), "El registro no tiene ID.", "Asignar un ID mediante una importación validada.");
      });
    };
    revisarIds(clientes, "Clientes");
    revisarIds(cotizaciones, "Cotizaciones");
    revisarIds(trabajos, "Trabajos");
    revisarIds(impresoras, "Impresoras");
    revisarIds(filamentos, "Inventario");

    clientes.forEach((cliente, indice) => {
      const nombre = nombreRegistro(cliente, indice);
      if (!texto(cliente.nombre)) agregar("Error", "Clientes", nombre, "El cliente no tiene nombre.", "Completar su identidad manualmente.");
      if (cliente.correo && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cliente.correo)) agregar("Advertencia", "Clientes", nombre, "El correo no parece válido.", "Revisar el correo en la ficha del cliente.");
      const digitos = texto(cliente.telefono).replace(/\D/g, "");
      if (cliente.telefono && (digitos.length < 6 || digitos.length > 15)) agregar("Advertencia", "Clientes", nombre, "El teléfono no parece válido.", "Revisar el teléfono en la ficha del cliente.");
    });

    duplicados(cotizaciones, "numeroCotizacion").forEach((numeroCotizacion) => agregar("Error", "Cotizaciones", numeroCotizacion, "El número de cotización está duplicado.", "No renumerar documentos históricos; revisar el contador futuro."));
    cotizaciones.forEach((cotizacion, indice) => {
      const nombre = texto(cotizacion.numeroCotizacion, nombreRegistro(cotizacion, indice));
      if (!texto(cotizacion.numeroCotizacion)) agregar("Advertencia", "Cotizaciones", nombre, "La cotización no tiene número.", "Asignar un número antes de enviarla.");
      if (cotizacion.clienteId && !idsClientes.has(cotizacion.clienteId)) agregar("Error", "Referencias", nombre, "La cotización referencia un cliente inexistente.", "Quitar la referencia conservando el snapshot.", { tipo: "quitarClienteCotizacion", id: cotizacion.id });
      if (cotizacion.clienteId && !cotizacion.snapshotCliente) agregar("Advertencia", "Cotizaciones", nombre, "La cotización tiene clienteId pero no snapshot histórico.", "Revisar los datos visibles del cliente.");
      const items = Array.isArray(cotizacion.items) ? cotizacion.items : [];
      items.forEach((item, itemIndice) => {
        if (!texto(item?.id)) agregar("Error", "Cotizaciones", nombre, `El ítem ${itemIndice + 1} no tiene ID.`, "Editar y guardar nuevamente el ítem.");
        if (numero(item?.cantidad, 0) < 0) agregar("Error", "Cotizaciones", nombre, `El ítem ${itemIndice + 1} tiene cantidad negativa.`, "Corregir la cantidad manualmente.");
      });
      const calculados = window.CotizacionesPrecio3D?.calcularTotales?.(cotizacion);
      if (calculados && Number.isFinite(Number(cotizacion.totalFinal)) && Math.abs(numero(cotizacion.totalFinal) - calculados.totalFinal) > 0.01) {
        agregar("Error", "Cotizaciones", nombre, "El total guardado no coincide con sus ítems y ajustes.", "Recalcular el total derivado después de revisar los ítems.", { tipo: "recalcularCotizacion", id: cotizacion.id });
      }
      if (cotizacion.estado === "Convertida en trabajo" && !trabajos.some((trabajo) => trabajo.cotizacionId === cotizacion.id || trabajo.id === cotizacion.trabajoId)) {
        agregar("Advertencia", "Cotizaciones", nombre, "Figura convertida, pero no existe un trabajo relacionado.", "Revisar la relación con Mis trabajos.");
      }
    });

    trabajos.forEach((trabajo, indice) => {
      const nombre = nombreRegistro(trabajo, indice);
      if (!ESTADOS_TRABAJO.has(trabajo.estado)) agregar("Error", "Trabajos", nombre, `El estado “${texto(trabajo.estado)}” no es reconocido.`, "Seleccionar un estado válido.");
      ["precioFinal", "costoTotal", "utilidadObjetivo"].forEach((campo) => {
        if (!Number.isFinite(Number(trabajo[campo])) || Number(trabajo[campo]) < 0) agregar("Error", "Trabajos", nombre, `El valor ${campo} no es válido.`, "Revisar el cálculo histórico; no se corregirá automáticamente.");
      });
      if (trabajo.clienteId && !idsClientes.has(trabajo.clienteId)) agregar("Error", "Referencias", nombre, "El trabajo referencia un cliente inexistente.", "Quitar la referencia conservando el snapshot.", { tipo: "quitarClienteTrabajo", id: trabajo.id });
      if (trabajo.cotizacionId && !idsCotizaciones.has(trabajo.cotizacionId)) agregar("Advertencia", "Referencias", nombre, "La cotización relacionada ya no existe.", "Conservar el snapshot y quitar la referencia si corresponde.");
      const impresoraId = trabajo.impresoraId || trabajo.datos?.impresoraId;
      if (impresoraId && !idsImpresoras.has(impresoraId)) agregar("Advertencia", "Referencias", nombre, "La impresora relacionada ya no existe.", "Mantener el snapshot histórico o quitar la referencia.");
      const filamentoId = trabajo.filamentoId || trabajo.datos?.filamentoId;
      if (filamentoId && !idsFilamentos.has(filamentoId)) agregar("Advertencia", "Referencias", nombre, "La bobina relacionada ya no existe.", "Mantener el snapshot histórico y elegir otra bobina para consumos futuros.");
      const pagos = Array.isArray(trabajo.pagos) ? trabajo.pagos : [];
      duplicados(pagos, "id").forEach((id) => agregar("Error", "Pagos", nombre, `Hay pagos duplicados con ID ${id}.`, "Revisar los pagos manualmente; no se eliminarán automáticamente."));
      pagos.forEach((pago) => {
        if (pago.fecha && Number.isNaN(new Date(pago.fecha).getTime())) agregar("Advertencia", "Pagos", nombre, "Existe un pago con fecha inválida.", "Revisar la fecha del pago.");
      });
      const totalPagado = pagos.length ? pagos.reduce((total, pago) => total + numero(pago.monto), 0) : numero(trabajo.montoAbonado);
      const precioCobro = numero(trabajo.precioVendidoReal) > 0 ? numero(trabajo.precioVendidoReal) : numero(trabajo.precioFinal);
      const saldo = Math.max(0, precioCobro - totalPagado);
      if (totalPagado > precioCobro + 0.01) agregar("Error", "Pagos", nombre, "Los pagos superan el precio cobrado.", "Revisar pagos y precio vendido; no se modificará automáticamente.");
      if (Number.isFinite(Number(trabajo.saldoPendiente)) && Math.abs(numero(trabajo.saldoPendiente) - saldo) > 0.01) agregar("Advertencia", "Pagos", nombre, "El saldo guardado no coincide con los pagos.", "Revisar los pagos antes de recalcular el saldo.");
      if (trabajo.estado === "Pagado" && saldo > 0.01) agregar("Error", "Pagos", nombre, "Está marcado como Pagado, pero conserva saldo pendiente.", "Revisar estado y pagos manualmente.");
      if (trabajo.estado !== "Pagado" && saldo <= 0.01 && precioCobro > 0) agregar("Información", "Pagos", nombre, "El saldo es cero, pero el estado no es Pagado.", "Considerar marcarlo como Pagado.");
      const consumo = trabajo.consumoInventario || {};
      const movimientosIds = Array.isArray(consumo.movimientosIds) ? consumo.movimientosIds : [];
      if (consumo.registrado && !movimientosIds.length) agregar("Error", "Inventario", nombre, "Indica consumo registrado, pero no contiene movimientos relacionados.", "Revisar el historial de la bobina; no se modificará el stock.");
    });

    const predeterminadas = impresoras.filter((impresora) => impresora.esPredeterminada);
    if (predeterminadas.length > 1) agregar("Error", "Impresoras", "Perfiles predeterminados", "Hay más de una impresora predeterminada.", "Conservar una única impresora predeterminada.", { tipo: "predeterminadaUnica", id: predeterminadas[0].id });
    impresoras.forEach((impresora, indice) => {
      const nombre = nombreRegistro(impresora, indice);
      ["costoCompra", "costoHerramientas", "potenciaPromedioWatts", "porcentajeMantenimiento"].forEach((campo) => {
        if (!Number.isFinite(Number(impresora[campo])) || Number(impresora[campo]) < 0) agregar("Error", "Impresoras", nombre, `${campo} contiene un valor negativo o inválido.`, "Corregir el perfil manualmente.");
      });
      ["anosVidaUtil", "diasOperativosAno", "horasProductivasDia"].forEach((campo) => {
        if (!Number.isFinite(Number(impresora[campo])) || Number(impresora[campo]) <= 0) agregar("Error", "Impresoras", nombre, `${campo} debe ser mayor que cero.`, "Corregir el divisor antes de calcular amortización.");
      });
      if (impresora.estado === "Retirada" && impresora.esPredeterminada) agregar("Error", "Impresoras", nombre, "Una impresora retirada está seleccionada como predeterminada.", "Elegir otra impresora predeterminada.");
    });

    const todosMovimientos = [];
    filamentos.forEach((bobina, indice) => {
      const nombre = nombreRegistro(bobina, indice);
      const inicial = numero(bobina.pesoNetoInicialGramos);
      const restante = Number(bobina.pesoRestanteGramos);
      if (!Number.isFinite(restante) || restante < 0) agregar("Error", "Inventario", nombre, "El stock restante es negativo o inválido.", "Ajustar el stock solamente después de revisar el historial.");
      if (Number.isFinite(restante) && restante > inicial) agregar("Advertencia", "Inventario", nombre, "El stock restante supera el peso inicial.", "Comprobar si corresponde a una recarga o a un error.");
      const costo = bobina.modoCosto === "precio_kilo" ? numero(bobina.precioPorKilo) / 1000 : inicial > 0 ? numero(bobina.precioCompraTotal) / inicial : 0;
      if (!Number.isFinite(costo) || costo <= 0) agregar("Error", "Inventario", nombre, "El costo por gramo no es válido.", "Revisar peso y precio de compra.");
      if (bobina.estado === "Agotada" && restante > 0) agregar("Advertencia", "Inventario", nombre, "Está marcada como Agotada, pero tiene stock mayor que cero.", "Revisar estado o stock con confirmación.");
      const movimientos = Array.isArray(bobina.movimientos) ? [...bobina.movimientos] : [];
      if (bobina.estado === "Sellada" && movimientos.some((item) => item.tipo === "consumo_trabajo" || item.tipo === "consumo_manual")) agregar("Advertencia", "Inventario", nombre, "Una bobina sellada contiene movimientos de consumo.", "Revisar su estado y fecha de apertura.");
      duplicados(movimientos.filter((item) => item.tipo === "reversion_consumo_trabajo"), "movimientoOriginalId").forEach((id) => agregar("Error", "Inventario", nombre, `El movimiento ${id} fue revertido más de una vez.`, "Revisar el historial; no se cambiará el stock automáticamente."));
      movimientos.forEach((movimiento) => {
        todosMovimientos.push({ bobina, movimiento });
        if (Number(movimiento.cantidadGramos) < 0) agregar("Error", "Inventario", nombre, "Hay un movimiento con cantidad negativa.", "Revisar el movimiento manualmente.");
        if (movimiento.referenciaTipo === "trabajo" && movimiento.referenciaId && !idsTrabajos.has(movimiento.referenciaId)) agregar("Advertencia", "Referencias", nombre, `Un movimiento referencia el trabajo inexistente “${movimiento.referenciaNombre || movimiento.referenciaId}”.`, "Conservar la referencia histórica o revisar el respaldo del trabajo.");
      });
      const ordenados = movimientos.sort((a, b) => new Date(a.createdAt || a.fecha) - new Date(b.createdAt || b.fecha));
      for (let i = 1; i < ordenados.length; i += 1) {
        if (Math.abs(numero(ordenados[i - 1].stockNuevo) - numero(ordenados[i].stockAnterior)) > 0.001) {
          agregar("Error", "Inventario", nombre, "La continuidad entre movimientos de stock está interrumpida.", "Ver historial de movimientos.");
          break;
        }
      }
      const ultimo = ordenados.at(-1);
      if (ultimo && Number.isFinite(restante) && Math.abs(numero(ultimo.stockNuevo) - restante) > 0.001) agregar("Error", "Inventario", nombre, "El stock final no coincide con el último movimiento.", "Ver historial de movimientos antes de ajustar stock.");
      const reversiones = new Set(movimientos.filter((item) => item.tipo === "reversion_consumo_trabajo").map((item) => item.movimientoOriginalId));
      const consumosActivos = movimientos.filter((item) => item.tipo === "consumo_trabajo" && !item.esAdicional && !reversiones.has(item.id));
      duplicados(consumosActivos, "referenciaId").forEach((id) => agregar("Error", "Inventario", nombre, `Hay consumos principales duplicados para el trabajo ${id}.`, "Revisar y revertir el movimiento incorrecto."));
    });

    duplicados(todosMovimientos.map(({ movimiento }) => movimiento), "id").forEach((id) => {
      agregar("Error", "Inventario", id, "Hay más de un movimiento de inventario con el mismo ID.", "Revisar el historial y conservar manualmente el movimiento correcto.");
    });

    trabajos.forEach((trabajo, indice) => {
      const ids = new Set(todosMovimientos.filter(({ movimiento }) => movimiento.referenciaTipo === "trabajo" && movimiento.referenciaId === trabajo.id).map(({ movimiento }) => movimiento.id));
      const relacionados = trabajo.consumoInventario?.movimientosIds || [];
      if (trabajo.consumoInventario?.registrado && !relacionados.some((id) => ids.has(id))) agregar("Error", "Referencias", nombreRegistro(trabajo, indice), "El consumo registrado no coincide con movimientos de inventario existentes.", "Ver historial de movimientos.");
    });

    const monedasValidas = new Set((window.MonedasPrecio3D || []).map((moneda) => moneda.codigo));
    const revisarMoneda = (codigo, modulo, registro) => {
      if (codigo && monedasValidas.size && !monedasValidas.has(String(codigo).toUpperCase())) agregar("Advertencia", modulo, registro, `El código de moneda ${codigo} no existe en el catálogo local.`, "Seleccionar una moneda disponible.");
    };
    revisarMoneda(datos.configuracion?.moneda, "Configuración", "Moneda principal");
    cotizaciones.forEach((item, indice) => revisarMoneda(item.moneda, "Cotizaciones", item.numeroCotizacion || nombreRegistro(item, indice)));
    trabajos.forEach((item, indice) => {
      revisarMoneda(item.moneda || item.datos?.moneda, "Trabajos", nombreRegistro(item, indice));
      const monedaTrabajo = item.moneda || item.datos?.moneda;
      const monedaFilamento = item.filamentoSnapshot?.monedaCompra || item.datos?.filamentoSnapshot?.monedaCompra;
      if (monedaTrabajo && monedaFilamento && monedaTrabajo !== monedaFilamento) agregar("Advertencia", "Referencias", nombreRegistro(item, indice), "La moneda del trabajo y la del snapshot de filamento son diferentes.", "Confirmar que el costo histórico fue ingresado manualmente o con moneda compatible.");
    });

    const contador = datos.preferencias?.contadorCotizaciones;
    const numerosValidos = cotizaciones.map((item) => texto(item.numeroCotizacion).match(/^COT-(\d{8})-(\d{3,})$/)).filter(Boolean);
    cotizaciones.forEach((item, indice) => {
      if (item.numeroCotizacion && !/^COT-\d{8}-\d{3,}$/.test(item.numeroCotizacion)) agregar("Advertencia", "Cotizaciones", item.numeroCotizacion || nombreRegistro(item, indice), "El formato del número de cotización no es el esperado.", "No cambiar números históricos; revisar el contador futuro.");
    });
    if (contador?.fecha) {
      const maximo = numerosValidos.filter((match) => match[1] === contador.fecha).reduce((max, match) => Math.max(max, Number(match[2])), 0);
      if (maximo > numero(contador.valor)) agregar("Advertencia", "Cotizaciones", "Contador futuro", "El contador está por debajo del último número utilizado.", "Actualizar solamente el contador futuro.", { tipo: "actualizarContador", fecha: contador.fecha, valor: maximo });
    }

    const niveles = { Error: 0, Advertencia: 0, Información: 0 };
    hallazgos.forEach((hallazgo) => { niveles[hallazgo.nivel] += 1; });
    return {
      ok: niveles.Error === 0,
      resumen: {
        errores: niveles.Error,
        advertencias: niveles.Advertencia,
        informacion: niveles.Información,
        registrosRevisados: clientes.length + cotizaciones.length + trabajos.length + impresoras.length + filamentos.length + todosMovimientos.length
      },
      hallazgos
    };
  }

  function aplicarReparacionSegura(hallazgo, confirmado = false) {
    if (!confirmado || !hallazgo?.reparacion) return { ok: false, error: "La reparación requiere confirmación." };
    crearRespaldoPrevio();
    const reparacion = hallazgo.reparacion;
    try {
      if (reparacion.tipo === "quitarClienteTrabajo") {
        const trabajo = window.StoragePrecio3D?.cargarTrabajos?.().find((item) => item.id === reparacion.id);
        return { ok: Boolean(window.StoragePrecio3D?.actualizarTrabajo?.(reparacion.id, { clienteId: "", clienteSnapshot: trabajo?.clienteSnapshot || null })) };
      }
      if (reparacion.tipo === "quitarClienteCotizacion") {
        const cotizacion = window.CotizacionesPrecio3D?.obtenerCotizacion?.(reparacion.id);
        return { ok: Boolean(cotizacion && window.CotizacionesPrecio3D.guardarCotizacion({ ...cotizacion, clienteId: "" })) };
      }
      if (reparacion.tipo === "predeterminadaUnica") return { ok: Boolean(window.ImpresorasPrecio3D?.establecerPredeterminada?.(reparacion.id)) };
      if (reparacion.tipo === "recalcularCotizacion") {
        const cotizacion = window.CotizacionesPrecio3D?.obtenerCotizacion?.(reparacion.id);
        return { ok: Boolean(cotizacion && window.CotizacionesPrecio3D.guardarCotizacion(cotizacion)) };
      }
      if (reparacion.tipo === "actualizarContador") {
        localStorage.setItem(CLAVES.contadorCotizaciones, JSON.stringify({ fecha: reparacion.fecha, valor: reparacion.valor }));
        return { ok: true };
      }
      return { ok: false, error: "La reparación no está permitida." };
    } catch (error) {
      return { ok: false, error: error.message };
    }
  }

  function formatearBytes(bytes) {
    const valor = Math.max(0, numero(bytes));
    if (valor < 1024) return `${valor} B`;
    if (valor < 1024 * 1024) return `${(valor / 1024).toFixed(1)} KB`;
    return `${(valor / (1024 * 1024)).toFixed(2)} MB`;
  }

  function crearElemento(etiqueta, clase, contenido) {
    const elemento = document.createElement(etiqueta);
    if (clase) elemento.className = clase;
    if (contenido !== undefined) elemento.textContent = contenido;
    return elemento;
  }

  function inicializarInterfaz() {
    const panel = document.querySelector("#respaldoIntegridadPanel");
    if (!panel || panel.dataset.backupReady === "true") return;
    panel.dataset.backupReady = "true";

    const elementos = {
      descargar: document.querySelector("#descargarRespaldoCompletoButton"),
      importar: document.querySelector("#importarRespaldoCompletoButton"),
      archivo: document.querySelector("#importarRespaldoCompletoInput"),
      integridad: document.querySelector("#revisarIntegridadButton"),
      previo: document.querySelector("#descargarRespaldoPrevioButton"),
      mensaje: document.querySelector("#backupMessage"),
      informe: document.querySelector("#integrityReport"),
      ultimaFecha: document.querySelector("#backupLastDate"),
      tamano: document.querySelector("#backupStorageSize"),
      modal: document.querySelector("#backupImportModal"),
      vista: document.querySelector("#backupImportPreview"),
      politica: document.querySelector("#backupConflictPolicy"),
      advertenciaReemplazo: document.querySelector("#backupReplaceWarning"),
      confirmar: document.querySelector("#confirmarImportacionButton"),
      previoModal: document.querySelector("#descargarRespaldoPrevioModalButton")
    };
    let contenidoSeleccionado = null;
    let previsualizacion = null;
    let reemplazoPreparado = false;
    let focoAnterior = null;

    function mostrarMensaje(mensaje, tipo = "") {
      elementos.mensaje.textContent = mensaje;
      elementos.mensaje.className = `help-text backup-message${tipo ? ` backup-message--${tipo}` : ""}`;
    }

    function actualizarResumen() {
      try {
        const resumen = obtenerResumenDatos();
        const valores = {
          backupTotalClientes: resumen.totalClientes,
          backupTotalCotizaciones: resumen.totalCotizaciones,
          backupTotalTrabajos: resumen.totalTrabajos,
          backupTotalImpresoras: resumen.totalImpresoras,
          backupTotalBobinas: resumen.totalBobinas,
          backupTotalMovimientos: resumen.totalMovimientos
        };
        Object.entries(valores).forEach(([id, valor]) => {
          const destino = document.getElementById(id);
          if (destino) destino.textContent = String(valor);
        });
        elementos.tamano.textContent = `${formatearBytes(resumen.tamanos.total)} (${t("backupEstimacion")})`;
        const tamanos = {
          backupSizeConfiguracion: resumen.tamanos.configuracion,
          backupSizeClientes: resumen.tamanos.clientes,
          backupSizeCotizaciones: resumen.tamanos.cotizaciones,
          backupSizeTrabajos: resumen.tamanos.trabajos,
          backupSizeImpresoras: resumen.tamanos.impresoras,
          backupSizeInventario: resumen.tamanos.inventario
        };
        Object.entries(tamanos).forEach(([id, valor]) => {
          const destino = document.getElementById(id);
          if (destino) destino.textContent = formatearBytes(valor);
        });
        const ultimo = obtenerFechaUltimoRespaldo();
        elementos.ultimaFecha.textContent = ultimo?.createdAt
          ? new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(new Date(ultimo.createdAt))
          : t("backupAunNoRegistrado");
      } catch (error) {
        mostrarMensaje(`No fue posible leer el almacenamiento local: ${error.message}`, "error");
      }
    }

    function cerrarModal() {
      elementos.modal.hidden = true;
      document.body.classList.remove("modal-open");
      reemplazoPreparado = false;
      elementos.confirmar.textContent = "Importar datos";
      elementos.previoModal.hidden = true;
      focoAnterior?.focus?.();
    }

    function abrirModal() {
      focoAnterior = document.activeElement;
      elementos.modal.hidden = false;
      document.body.classList.add("modal-open");
      elementos.modal.querySelector("input[name='backupImportMode']")?.focus();
    }

    function agregarDatoVista(lista, etiqueta, valor) {
      const grupo = crearElemento("div");
      grupo.append(crearElemento("dt", "", etiqueta), crearElemento("dd", "", String(valor)));
      lista.appendChild(grupo);
    }

    function mostrarPrevisualizacion(vista) {
      elementos.vista.replaceChildren();
      if (!vista.valido) {
        elementos.vista.appendChild(crearElemento("p", "backup-error-title", "No se puede importar este archivo."));
        const lista = crearElemento("ul", "backup-error-list");
        vista.errores.forEach((error) => lista.appendChild(crearElemento("li", "", error)));
        elementos.vista.appendChild(lista);
        elementos.confirmar.disabled = true;
        return;
      }
      const resumen = vista.resumen;
      const datos = crearElemento("dl", "backup-preview-grid");
      agregarDatoVista(datos, "Fecha", new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(new Date(resumen.fecha)));
      agregarDatoVista(datos, "Versión", resumen.version);
      agregarDatoVista(datos, "Clientes", resumen.totalClientes);
      agregarDatoVista(datos, "Cotizaciones", resumen.totalCotizaciones);
      agregarDatoVista(datos, "Trabajos", resumen.totalTrabajos);
      agregarDatoVista(datos, "Impresoras", resumen.totalImpresoras);
      agregarDatoVista(datos, "Bobinas", resumen.totalBobinas);
      agregarDatoVista(datos, "Movimientos", resumen.totalMovimientos);
      agregarDatoVista(datos, "Registros válidos", resumen.validos);
      agregarDatoVista(datos, "Advertencias", resumen.advertencias);
      agregarDatoVista(datos, "Rechazados", resumen.rechazados);
      agregarDatoVista(datos, "Conflictos", resumen.conflictos);
      elementos.vista.appendChild(datos);
      if (vista.advertencias.length) {
        const detalles = document.createElement("details");
        const summary = document.createElement("summary");
        summary.textContent = `Ver ${vista.advertencias.length} advertencia(s)`;
        const lista = crearElemento("ul", "backup-warning-list");
        vista.advertencias.forEach((advertencia) => lista.appendChild(crearElemento("li", "", advertencia)));
        detalles.append(summary, lista);
        elementos.vista.appendChild(detalles);
      }
      elementos.confirmar.disabled = false;
    }

    function modoSeleccionado() {
      return elementos.modal.querySelector("input[name='backupImportMode']:checked")?.value || "combinar";
    }

    function actualizarModoImportacion() {
      const reemplazar = modoSeleccionado() === "reemplazar";
      elementos.advertenciaReemplazo.hidden = !reemplazar;
      elementos.politica.closest("label").hidden = reemplazar;
      reemplazoPreparado = false;
      elementos.previoModal.hidden = true;
      elementos.confirmar.textContent = reemplazar ? "Preparar reemplazo seguro" : "Importar datos";
    }

    function renderizarIntegridad(informe) {
      elementos.informe.replaceChildren();
      const encabezado = crearElemento("div", "integrity-summary");
      const estado = crearElemento("strong", informe.ok ? "integrity-ok" : "integrity-attention", informe.ok ? "Sin problemas críticos" : "Se encontraron problemas que requieren revisión");
      encabezado.append(
        estado,
        crearElemento("span", "", `${informe.resumen.errores} errores`),
        crearElemento("span", "", `${informe.resumen.advertencias} advertencias`),
        crearElemento("span", "", `${informe.resumen.registrosRevisados} registros revisados`)
      );
      elementos.informe.appendChild(encabezado);
      if (!informe.hallazgos.length) return;
      const grupos = informe.hallazgos.reduce((mapa, hallazgo) => {
        if (!mapa.has(hallazgo.modulo)) mapa.set(hallazgo.modulo, []);
        mapa.get(hallazgo.modulo).push(hallazgo);
        return mapa;
      }, new Map());
      grupos.forEach((hallazgos, modulo) => {
        const seccion = crearElemento("section", "integrity-group");
        seccion.appendChild(crearElemento("h3", "", modulo));
        hallazgos.forEach((hallazgo) => {
          const item = crearElemento("article", `integrity-item integrity-item--${hallazgo.nivel.toLowerCase().replace("ó", "o")}`);
          const titulo = crearElemento("h4");
          titulo.append(crearElemento("span", "integrity-level", hallazgo.nivel), document.createTextNode(` · ${hallazgo.registro}`));
          item.append(titulo, crearElemento("p", "", hallazgo.descripcion), crearElemento("small", "", `Acción sugerida: ${hallazgo.accion}`));
          if (hallazgo.reparacion) {
            const boton = crearElemento("button", "secondary integrity-repair", "Aplicar reparación segura");
            boton.type = "button";
            boton.dataset.hallazgoId = hallazgo.id;
            item.appendChild(boton);
          }
          seccion.appendChild(item);
        });
        elementos.informe.appendChild(seccion);
      });
      elementos.informe.dataset.integrityResult = JSON.stringify(informe.hallazgos.filter((item) => item.reparacion));
    }

    elementos.descargar.addEventListener("click", () => {
      try {
        descargarRespaldoCompleto();
        actualizarResumen();
        mostrarMensaje("Respaldo completo descargado. Guárdalo en un lugar seguro.", "success");
      } catch (error) {
        mostrarMensaje(`No fue posible crear el respaldo: ${error.message}`, "error");
      }
    });

    elementos.importar.addEventListener("click", () => {
      elementos.archivo.value = "";
      elementos.archivo.click();
    });

    elementos.archivo.addEventListener("change", async () => {
      const archivo = elementos.archivo.files?.[0];
      if (!archivo) return;
      try {
        contenidoSeleccionado = await archivo.text();
        previsualizacion = previsualizarImportacion(contenidoSeleccionado);
        mostrarPrevisualizacion(previsualizacion);
        actualizarModoImportacion();
        abrirModal();
      } catch (error) {
        mostrarMensaje(`No fue posible leer el archivo: ${error.message}`, "error");
      }
    });

    elementos.modal.querySelectorAll("[data-backup-close]").forEach((boton) => boton.addEventListener("click", cerrarModal));
    elementos.modal.querySelectorAll("input[name='backupImportMode']").forEach((control) => control.addEventListener("change", actualizarModoImportacion));
    elementos.modal.addEventListener("keydown", (evento) => {
      if (evento.key === "Escape") cerrarModal();
      if (evento.key !== "Tab") return;
      const focos = [...elementos.modal.querySelectorAll("button:not([disabled]), input:not([disabled]), select:not([disabled])")].filter((item) => item.offsetParent !== null);
      if (!focos.length) return;
      const primero = focos[0];
      const ultimo = focos.at(-1);
      if (evento.shiftKey && document.activeElement === primero) { evento.preventDefault(); ultimo.focus(); }
      else if (!evento.shiftKey && document.activeElement === ultimo) { evento.preventDefault(); primero.focus(); }
    });

    elementos.confirmar.addEventListener("click", () => {
      if (!previsualizacion?.valido || !contenidoSeleccionado) return;
      const modo = modoSeleccionado();
      if (modo === "reemplazar" && !reemplazoPreparado) {
        crearRespaldoPrevio();
        reemplazoPreparado = true;
        elementos.previo.disabled = false;
        elementos.previoModal.hidden = false;
        elementos.confirmar.textContent = "Confirmar reemplazo";
        mostrarMensaje("Antes de reemplazar tus datos se creó un respaldo de seguridad del estado actual. Puedes descargarlo antes de confirmar.", "warning");
        return;
      }
      const resultado = importarRespaldo(contenidoSeleccionado, { modo, conflictos: elementos.politica.value, respaldoPrevio });
      if (!resultado.ok) {
        mostrarMensaje(resultado.errores.join(" "), "error");
        return;
      }
      cerrarModal();
      elementos.previo.disabled = false;
      actualizarResumen();
      mostrarMensaje(`Importación completada en modo ${resultado.modo}. Recarga la página para aplicar todos los datos en los formularios.`, "success");
    });

    elementos.previo.addEventListener("click", () => {
      if (!descargarRespaldoPrevio()) mostrarMensaje("Todavía no existe un respaldo previo temporal.", "warning");
    });

    elementos.previoModal.addEventListener("click", () => {
      if (!descargarRespaldoPrevio()) mostrarMensaje("Todavía no existe un respaldo previo temporal.", "warning");
    });

    elementos.integridad.addEventListener("click", () => {
      try {
        renderizarIntegridad(verificarIntegridadDatos());
        mostrarMensaje("Revisión terminada. Ningún dato fue modificado.", "success");
      } catch (error) {
        mostrarMensaje(`No fue posible revisar la integridad: ${error.message}`, "error");
      }
    });

    elementos.informe.addEventListener("click", (evento) => {
      const boton = evento.target.closest("[data-hallazgo-id]");
      if (!boton) return;
      const reparaciones = JSON.parse(elementos.informe.dataset.integrityResult || "[]");
      const hallazgo = reparaciones.find((item) => item.id === boton.dataset.hallazgoId);
      if (!hallazgo) return;
      const confirmado = window.confirm(`Se creará un respaldo previo y luego se aplicará este cambio:\n\n${hallazgo.accion}\n\n¿Deseas continuar?`);
      if (!confirmado) return;
      const resultado = aplicarReparacionSegura(hallazgo, true);
      elementos.previo.disabled = false;
      if (!resultado.ok) {
        mostrarMensaje(resultado.error || "No se pudo aplicar la reparación.", "error");
        return;
      }
      renderizarIntegridad(verificarIntegridadDatos());
      actualizarResumen();
      mostrarMensaje("Reparación aplicada después de crear un respaldo previo.", "success");
    });

    window.addEventListener("precio3d:respaldo-importado", actualizarResumen);
    document.addEventListener("precio3d:idioma-actualizado", actualizarResumen);
    ["clientes", "cotizaciones", "trabajos", "impresoras", "filamentos"].forEach((modulo) => {
      window.addEventListener(`precio3d:${modulo}-actualizados`, actualizarResumen);
    });
    actualizarResumen();
  }

  window.RespaldoPrecio3D = {
    crearRespaldoCompleto,
    descargarRespaldoCompleto,
    validarRespaldo,
    previsualizarImportacion,
    importarRespaldo,
    crearRespaldoPrevio,
    descargarRespaldoPrevio,
    obtenerFechaUltimoRespaldo,
    obtenerResumenDatos,
    verificarIntegridadDatos,
    aplicarReparacionSegura,
    obtenerDatosAplicacion,
    claveUltimoRespaldo: ULTIMO_RESPALDO_KEY,
    backupVersion: BACKUP_VERSION
  };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", inicializarInterfaz, { once: true });
  else inicializarInterfaz();
})();

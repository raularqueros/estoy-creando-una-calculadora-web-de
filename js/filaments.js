(function () {
  "use strict";

  const STORAGE_KEY = "precio3d_filamentos_v1";
  const VERSION = 1;
  const APP_ID = "precio3d-calculadora";
  const ESTADOS = ["Sellada", "En uso", "Agotada", "Archivada"];
  const MODOS_COSTO = ["precio_total", "precio_kilo"];

  function crearId(prefijo = "bobina") {
    if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
    return `${prefijo}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }

  function texto(valor, fallback = "") {
    return String(valor ?? fallback).trim();
  }

  function numero(valor, fallback = 0) {
    const convertido = Number(valor);
    return Number.isFinite(convertido) && convertido >= 0 ? convertido : fallback;
  }

  function fechaISO(valor, fallback = "") {
    if (!valor) return fallback;
    const fecha = new Date(valor);
    return Number.isNaN(fecha.getTime()) ? fallback : fecha.toISOString();
  }

  function slug(valor) {
    return texto(valor).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  }

  function calcularCostoPorGramo(bobina) {
    if (!bobina || typeof bobina !== "object") return 0;
    if (bobina.modoCosto === "precio_kilo") {
      return numero(bobina.precioPorKilo) / 1000;
    }
    const peso = numero(bobina.pesoNetoInicialGramos);
    return peso > 0 ? numero(bobina.precioCompraTotal) / peso : 0;
  }

  function calcularPorcentajeRestante(bobina) {
    const inicial = numero(bobina?.pesoNetoInicialGramos);
    if (inicial <= 0) return 0;
    return Math.min(100, Math.max(0, (numero(bobina?.pesoRestanteGramos) / inicial) * 100));
  }

  function calcularValorRestante(bobina) {
    return numero(bobina?.pesoRestanteGramos) * calcularCostoPorGramo(bobina);
  }

  function tieneStockBajo(bobina) {
    const restante = numero(bobina?.pesoRestanteGramos);
    return restante > 0 && restante <= numero(bobina?.stockMinimoGramos);
  }

  function normalizarMovimiento(movimiento) {
    if (!movimiento || typeof movimiento !== "object") return null;
    const creado = fechaISO(movimiento.createdAt, new Date().toISOString());
    return {
      id: texto(movimiento.id) || crearId("movimiento"),
      tipo: texto(movimiento.tipo, "correccion"),
      cantidadGramos: numero(movimiento.cantidadGramos),
      stockAnterior: numero(movimiento.stockAnterior),
      stockNuevo: numero(movimiento.stockNuevo),
      fecha: texto(movimiento.fecha) || creado.slice(0, 10),
      nota: texto(movimiento.nota),
      referenciaTipo: texto(movimiento.referenciaTipo),
      referenciaId: texto(movimiento.referenciaId),
      referenciaNombre: texto(movimiento.referenciaNombre),
      esAdicional: Boolean(movimiento.esAdicional),
      movimientoOriginalId: texto(movimiento.movimientoOriginalId),
      createdAt: creado
    };
  }

  function crearMovimientoInicial(stock, nota = "Registro inicial de la bobina") {
    const ahora = new Date().toISOString();
    return {
      id: crearId("movimiento"),
      tipo: "alta_inicial",
      cantidadGramos: stock,
      stockAnterior: 0,
      stockNuevo: stock,
      fecha: ahora.slice(0, 10),
      nota,
      createdAt: ahora
    };
  }

  function normalizarBobina(entrada, opciones = {}) {
    if (!entrada || typeof entrada !== "object" || Array.isArray(entrada)) return null;
    const ahora = new Date().toISOString();
    const pesoInicial = numero(entrada.pesoNetoInicialGramos);
    const tieneRestante = entrada.pesoRestanteGramos !== "" && entrada.pesoRestanteGramos != null;
    const restante = tieneRestante ? numero(entrada.pesoRestanteGramos) : pesoInicial;
    const modoCosto = MODOS_COSTO.includes(entrada.modoCosto) ? entrada.modoCosto : "precio_total";
    const estado = ESTADOS.includes(entrada.estado) ? entrada.estado : "Sellada";
    const materialNombre = texto(entrada.materialNombre || entrada.materialId, "Otro personalizado");
    const movimientos = Array.isArray(entrada.movimientos)
      ? entrada.movimientos.map(normalizarMovimiento).filter(Boolean)
      : [];
    const bobina = {
      id: texto(entrada.id) || crearId(),
      version: VERSION,
      nombre: texto(entrada.nombre),
      marca: texto(entrada.marca),
      materialId: texto(entrada.materialId) || slug(materialNombre) || "otro-personalizado",
      materialNombre,
      varianteMaterial: texto(entrada.varianteMaterial),
      colorNombre: texto(entrada.colorNombre),
      colorHex: /^#[0-9a-f]{6}$/i.test(texto(entrada.colorHex)) ? texto(entrada.colorHex) : "",
      diametroMm: texto(entrada.diametroMm, "1.75"),
      pesoNetoInicialGramos: pesoInicial,
      pesoRestanteGramos: restante,
      pesoTaraGramos: numero(entrada.pesoTaraGramos),
      stockMinimoGramos: numero(entrada.stockMinimoGramos, 200),
      modoCosto,
      precioCompraTotal: numero(entrada.precioCompraTotal),
      precioPorKilo: numero(entrada.precioPorKilo),
      monedaCompra: texto(entrada.monedaCompra, "CLP").toUpperCase(),
      costoPorGramo: 0,
      proveedor: texto(entrada.proveedor),
      loteSku: texto(entrada.loteSku),
      ubicacion: texto(entrada.ubicacion),
      fechaCompra: texto(entrada.fechaCompra),
      fechaApertura: texto(entrada.fechaApertura),
      estado,
      notas: texto(entrada.notas),
      movimientos,
      fechaCreacion: fechaISO(entrada.fechaCreacion, ahora),
      fechaActualizacion: fechaISO(entrada.fechaActualizacion, ahora)
    };
    bobina.costoPorGramo = calcularCostoPorGramo(bobina);
    if (opciones.crearMovimiento && !bobina.movimientos.length) {
      bobina.movimientos.push(crearMovimientoInicial(restante));
    }
    return bobina;
  }

  function validarBobina(entrada) {
    const errores = {};
    if (!texto(entrada?.materialNombre || entrada?.materialId)) errores.materialNombre = "Selecciona un material.";
    if (numero(entrada?.pesoNetoInicialGramos) <= 0) errores.pesoNetoInicialGramos = "El peso inicial debe ser mayor que cero.";
    if (!MODOS_COSTO.includes(entrada?.modoCosto)) errores.modoCosto = "Selecciona cómo ingresar el costo.";
    if (entrada?.modoCosto === "precio_kilo" && numero(entrada?.precioPorKilo) <= 0) errores.precioPorKilo = "Ingresa un precio por kilo mayor que cero.";
    if (entrada?.modoCosto !== "precio_kilo" && numero(entrada?.precioCompraTotal) <= 0) errores.precioCompraTotal = "Ingresa el precio total de la bobina.";
    if (!texto(entrada?.monedaCompra)) errores.monedaCompra = "Selecciona una moneda.";
    return errores;
  }

  function leerColeccion() {
    try {
      const contenido = localStorage.getItem(STORAGE_KEY);
      if (!contenido) return [];
      const datos = JSON.parse(contenido);
      const lista = Array.isArray(datos) ? datos : datos?.bobinas;
      return Array.isArray(lista) ? lista.map(normalizarBobina).filter(Boolean) : [];
    } catch (error) {
      console.warn("No fue posible leer el inventario de filamentos.", error);
      return [];
    }
  }

  function escribirColeccion(bobinas) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        version: VERSION,
        updatedAt: new Date().toISOString(),
        bobinas
      }));
      window.dispatchEvent(new CustomEvent("precio3d:filamentos-actualizados"));
      return true;
    } catch (error) {
      console.warn("No fue posible guardar el inventario de filamentos.", error);
      return false;
    }
  }

  function crearBobina(datos) {
    if (Object.keys(validarBobina(datos)).length) return null;
    const lista = leerColeccion();
    const bobina = normalizarBobina(datos, { crearMovimiento: true });
    return escribirColeccion([...lista, bobina]) ? bobina : null;
  }

  function obtenerBobinas() {
    return leerColeccion().map((bobina) => ({ ...bobina, movimientos: bobina.movimientos.map((item) => ({ ...item })) }));
  }

  function obtenerBobinaPorId(id) {
    return obtenerBobinas().find((bobina) => bobina.id === id) || null;
  }

  function actualizarBobina(id, cambios) {
    const lista = leerColeccion();
    const indice = lista.findIndex((bobina) => bobina.id === id);
    if (indice < 0) return null;
    const anterior = lista[indice];
    const combinada = { ...anterior, ...cambios, id, fechaCreacion: anterior.fechaCreacion };
    if (Object.keys(validarBobina(combinada)).length) return null;
    const actualizada = normalizarBobina({ ...combinada, fechaActualizacion: new Date().toISOString() });
    if (actualizada.pesoRestanteGramos !== anterior.pesoRestanteGramos) {
      actualizada.movimientos.push(normalizarMovimiento({
        tipo: "correccion",
        cantidadGramos: Math.abs(actualizada.pesoRestanteGramos - anterior.pesoRestanteGramos),
        stockAnterior: anterior.pesoRestanteGramos,
        stockNuevo: actualizada.pesoRestanteGramos,
        nota: "Stock actualizado al editar la bobina"
      }));
    }
    lista[indice] = actualizada;
    return escribirColeccion(lista) ? actualizada : null;
  }

  function duplicarBobina(id) {
    const original = leerColeccion().find((bobina) => bobina.id === id);
    if (!original) return null;
    const ahora = new Date().toISOString();
    const copia = normalizarBobina({
      ...original,
      id: crearId(),
      nombre: original.nombre ? `${original.nombre} (copia)` : "",
      pesoRestanteGramos: original.pesoNetoInicialGramos,
      estado: "Sellada",
      fechaApertura: "",
      notas: "",
      movimientos: [],
      fechaCreacion: ahora,
      fechaActualizacion: ahora
    }, { crearMovimiento: true });
    const lista = leerColeccion();
    return escribirColeccion([...lista, copia]) ? copia : null;
  }

  function archivarBobina(id) {
    return actualizarBobina(id, { estado: "Archivada" });
  }

  function eliminarBobina(id) {
    const lista = leerColeccion();
    const nueva = lista.filter((bobina) => bobina.id !== id);
    return nueva.length !== lista.length && escribirColeccion(nueva);
  }

  function ajustarStock(id, ajuste, opciones = {}) {
    const lista = leerColeccion();
    const indice = lista.findIndex((bobina) => bobina.id === id);
    if (indice < 0) return { ok: false, error: "Bobina no encontrada." };
    const bobina = lista[indice];
    const anterior = bobina.pesoRestanteGramos;
    const tipo = texto(ajuste?.tipo, "correccion");
    const cantidad = numero(ajuste?.cantidadGramos);
    let nuevo;
    if (["consumo_manual", "ajuste_salida", "consumo_trabajo"].includes(tipo)) nuevo = anterior - cantidad;
    else if (["ajuste_entrada", "reversion_consumo_trabajo"].includes(tipo)) nuevo = anterior + cantidad;
    else if (tipo === "agotada") nuevo = 0;
    else nuevo = numero(ajuste?.stockNuevo, cantidad);
    if (!Number.isFinite(nuevo) || nuevo < 0) return { ok: false, error: "El stock no puede quedar en negativo." };
    if (nuevo > bobina.pesoNetoInicialGramos && !opciones.permitirSobreInicial) {
      return { ok: false, requiereConfirmacion: true, stockNuevo: nuevo, error: "El nuevo stock supera el peso inicial." };
    }
    const ahora = new Date().toISOString();
    const movimiento = normalizarMovimiento({
      tipo,
      cantidadGramos: Math.abs(nuevo - anterior),
      stockAnterior: anterior,
      stockNuevo: nuevo,
      fecha: texto(ajuste?.fecha) || ahora.slice(0, 10),
      nota: texto(ajuste?.nota),
      referenciaTipo: texto(ajuste?.referenciaTipo),
      referenciaId: texto(ajuste?.referenciaId),
      referenciaNombre: texto(ajuste?.referenciaNombre),
      esAdicional: Boolean(ajuste?.esAdicional),
      movimientoOriginalId: texto(ajuste?.movimientoOriginalId),
      createdAt: ahora
    });
    const actualizada = normalizarBobina({
      ...bobina,
      pesoRestanteGramos: nuevo,
      movimientos: [...bobina.movimientos, movimiento],
      fechaActualizacion: ahora
    });
    lista[indice] = actualizada;
    const ok = escribirColeccion(lista);
    return {
      ok,
      bobina: ok ? actualizada : null,
      movimiento: ok ? movimiento : null,
      sugerirEstado: nuevo === 0 && actualizada.estado !== "Agotada" ? "Agotada" : ""
    };
  }

  function registrarMovimiento(id, movimiento, opciones = {}) {
    return ajustarStock(id, movimiento, opciones);
  }

  function obtenerMovimientos(id) {
    return obtenerBobinaPorId(id)?.movimientos || [];
  }

  function obtenerMovimientosTrabajo(id, trabajoId) {
    const referenciaId = texto(trabajoId);
    return obtenerMovimientos(id).filter((movimiento) => movimiento.referenciaTipo === "trabajo" && movimiento.referenciaId === referenciaId);
  }

  function registrarConsumoTrabajo(id, trabajo, opciones = {}) {
    const bobina = obtenerBobinaPorId(id);
    const trabajoId = texto(trabajo?.id || trabajo?.trabajoId);
    const cantidadGramos = numero(opciones.cantidadGramos ?? trabajo?.cantidadGramos);
    const esAdicional = Boolean(opciones.esAdicional);
    if (!bobina) return { ok: false, error: "Bobina no encontrada." };
    if (["Archivada", "Agotada"].includes(bobina.estado)) return { ok: false, error: "La bobina no admite nuevos consumos." };
    if (!trabajoId) return { ok: false, error: "El trabajo no tiene un identificador válido." };
    if (cantidadGramos <= 0) return { ok: false, error: "El consumo debe ser mayor que cero." };

    const consumoPrincipalActivo = leerColeccion().some((item) => {
      const movimientos = item.movimientos.filter((movimiento) => movimiento.referenciaTipo === "trabajo" && movimiento.referenciaId === trabajoId);
      const idsRevertidos = new Set(
        movimientos.filter((movimiento) => movimiento.tipo === "reversion_consumo_trabajo").map((movimiento) => movimiento.movimientoOriginalId)
      );
      return movimientos.some((movimiento) =>
        movimiento.tipo === "consumo_trabajo" && !movimiento.esAdicional && !idsRevertidos.has(movimiento.id)
      );
    });
    if (!esAdicional && consumoPrincipalActivo) {
      return { ok: false, duplicado: true, error: "Este trabajo ya tiene un consumo principal registrado." };
    }

    return ajustarStock(id, {
      tipo: "consumo_trabajo",
      cantidadGramos,
      fecha: opciones.fecha,
      nota: opciones.nota,
      referenciaTipo: "trabajo",
      referenciaId: trabajoId,
      referenciaNombre: texto(trabajo?.nombreTrabajo, "Trabajo sin nombre"),
      esAdicional
    });
  }

  function revertirConsumoTrabajo(id, movimientoId, opciones = {}) {
    const bobina = obtenerBobinaPorId(id);
    if (!bobina) return { ok: false, error: "Bobina no encontrada." };
    const original = bobina.movimientos.find((movimiento) => movimiento.id === movimientoId && movimiento.tipo === "consumo_trabajo");
    if (!original) return { ok: false, error: "No se encontró el consumo original." };
    const yaRevertido = bobina.movimientos.some((movimiento) =>
      movimiento.tipo === "reversion_consumo_trabajo" && movimiento.movimientoOriginalId === original.id
    );
    if (yaRevertido) return { ok: false, duplicado: true, error: "Este consumo ya fue revertido." };

    return ajustarStock(id, {
      tipo: "reversion_consumo_trabajo",
      cantidadGramos: original.cantidadGramos,
      fecha: opciones.fecha,
      nota: texto(opciones.nota, "Reversión de consumo de trabajo"),
      referenciaTipo: "trabajo",
      referenciaId: original.referenciaId,
      referenciaNombre: original.referenciaNombre,
      esAdicional: original.esAdicional,
      movimientoOriginalId: original.id
    }, { permitirSobreInicial: true });
  }

  function buscarBobinas(consulta = "", bobinas = obtenerBobinas()) {
    const termino = texto(consulta).toLocaleLowerCase("es");
    if (!termino) return bobinas;
    return bobinas.filter((bobina) => [
      bobina.nombre, bobina.marca, bobina.materialNombre, bobina.varianteMaterial,
      bobina.colorNombre, bobina.proveedor, bobina.loteSku, bobina.ubicacion
    ].some((valor) => texto(valor).toLocaleLowerCase("es").includes(termino)));
  }

  function filtrarBobinas(bobinas = obtenerBobinas(), filtros = {}) {
    const estado = texto(filtros.estado, "activas");
    let lista = [...bobinas];
    if (estado === "activas") lista = lista.filter((bobina) => bobina.estado !== "Archivada");
    else if (estado === "stock_bajo") lista = lista.filter(tieneStockBajo);
    else if (estado !== "todas") lista = lista.filter((bobina) => bobina.estado === estado);
    if (filtros.material) lista = lista.filter((bobina) => bobina.materialId === filtros.material);
    if (filtros.marca) lista = lista.filter((bobina) => bobina.marca === filtros.marca);
    const orden = filtros.orden || "recientes";
    return lista.sort((a, b) => {
      if (orden === "nombre") return (a.nombre || a.materialNombre).localeCompare(b.nombre || b.materialNombre, "es");
      if (orden === "menor_stock") return a.pesoRestanteGramos - b.pesoRestanteGramos;
      if (orden === "mayor_stock") return b.pesoRestanteGramos - a.pesoRestanteGramos;
      if (orden === "mayor_costo") return calcularCostoPorGramo(b) - calcularCostoPorGramo(a);
      if (orden === "material") return a.materialNombre.localeCompare(b.materialNombre, "es");
      if (orden === "marca") return a.marca.localeCompare(b.marca, "es");
      return new Date(b.fechaActualizacion) - new Date(a.fechaActualizacion);
    });
  }

  function obtenerResumenInventario() {
    const activas = leerColeccion().filter((bobina) => bobina.estado !== "Archivada");
    const valoresPorMoneda = activas.reduce((totales, bobina) => {
      const moneda = bobina.monedaCompra || "CLP";
      totales[moneda] = (totales[moneda] || 0) + calcularValorRestante(bobina);
      return totales;
    }, {});
    return {
      totalActivas: activas.length,
      selladas: activas.filter((bobina) => bobina.estado === "Sellada").length,
      enUso: activas.filter((bobina) => bobina.estado === "En uso").length,
      stockBajo: activas.filter(tieneStockBajo).length,
      pesoTotalGramos: activas.reduce((total, bobina) => total + bobina.pesoRestanteGramos, 0),
      valoresPorMoneda
    };
  }

  function exportarBobinasJSON() {
    return JSON.stringify({
      aplicacion: APP_ID,
      tipo: "inventario-filamentos",
      version: VERSION,
      fechaExportacion: new Date().toISOString(),
      bobinas: leerColeccion()
    }, null, 2);
  }

  function importarBobinasJSON(contenido, modo = "combinar") {
    try {
      const datos = typeof contenido === "string" ? JSON.parse(contenido.replace(/^\uFEFF/, "")) : contenido;
      const entrada = Array.isArray(datos) ? datos : datos?.bobinas;
      if (!Array.isArray(entrada)) return { ok: false, importadas: 0, omitidas: 0, rechazadas: 0 };
      const actuales = modo === "reemplazar" ? [] : leerColeccion();
      const ids = new Set(actuales.map((bobina) => bobina.id));
      const aceptadas = [];
      let omitidas = 0;
      let rechazadas = 0;
      entrada.forEach((item) => {
        if (!item || typeof item !== "object" || Object.keys(validarBobina(item)).length) {
          rechazadas += 1;
          return;
        }
        const bobina = normalizarBobina(item, { crearMovimiento: true });
        if (ids.has(bobina.id)) {
          omitidas += 1;
          return;
        }
        ids.add(bobina.id);
        aceptadas.push(bobina);
      });
      const ok = escribirColeccion([...actuales, ...aceptadas]);
      return { ok, importadas: ok ? aceptadas.length : 0, omitidas, rechazadas };
    } catch (error) {
      console.warn("El archivo de inventario no es válido.", error);
      return { ok: false, importadas: 0, omitidas: 0, rechazadas: 0 };
    }
  }

  function escaparCSV(valor) {
    return `"${String(valor ?? "").replaceAll('"', '""')}"`;
  }

  function exportarBobinasCSV() {
    const encabezados = [
      "Nombre", "Marca", "Material", "Variante", "Color", "Diámetro", "Peso inicial",
      "Peso restante", "Porcentaje restante", "Stock mínimo", "Estado", "Precio total",
      "Precio por kilo", "Moneda", "Costo por gramo", "Valor restante", "Proveedor",
      "Lote o SKU", "Ubicación", "Fecha de compra", "Fecha de apertura", "Fecha de creación",
      "Fecha de actualización"
    ];
    const filas = leerColeccion().map((bobina) => [
      bobina.nombre, bobina.marca, bobina.materialNombre, bobina.varianteMaterial, bobina.colorNombre,
      bobina.diametroMm, bobina.pesoNetoInicialGramos, bobina.pesoRestanteGramos,
      calcularPorcentajeRestante(bobina), bobina.stockMinimoGramos, bobina.estado,
      bobina.precioCompraTotal, bobina.precioPorKilo, bobina.monedaCompra,
      calcularCostoPorGramo(bobina), calcularValorRestante(bobina), bobina.proveedor,
      bobina.loteSku, bobina.ubicacion, bobina.fechaCompra, bobina.fechaApertura,
      bobina.fechaCreacion, bobina.fechaActualizacion
    ]);
    return `\uFEFF${[encabezados, ...filas].map((fila) => fila.map(escaparCSV).join(";")).join("\r\n")}`;
  }

  window.FilamentosPrecio3D = {
    crearBobina,
    obtenerBobinas,
    obtenerBobinaPorId,
    actualizarBobina,
    duplicarBobina,
    archivarBobina,
    eliminarBobina,
    calcularCostoPorGramo,
    calcularPorcentajeRestante,
    calcularValorRestante,
    tieneStockBajo,
    registrarMovimiento,
    ajustarStock,
    obtenerMovimientos,
    obtenerMovimientosTrabajo,
    registrarConsumoTrabajo,
    revertirConsumoTrabajo,
    buscarBobinas,
    filtrarBobinas,
    obtenerResumenInventario,
    exportarBobinasJSON,
    importarBobinasJSON,
    exportarBobinasCSV,
    validarBobina,
    claveStorage: STORAGE_KEY,
    version: VERSION
  };
})();

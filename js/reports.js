// Reportes financieros de solo lectura basados en registros historicos.
(function () {
  "use strict";

  const CONFIG_KEY = "precio3d_reportes_config_v1";
  const VERSION = 1;
  const ESTADOS_VENTA = new Set([
    "Aceptado",
    "Esperando abono",
    "En produccion",
    "En producción",
    "Terminado",
    "Entregado",
    "Pagado"
  ]);
  const ESTADOS_EXCLUIDOS = new Set(["Borrador", "Cotizado", "Pendiente", "Rechazado", "Cancelado"]);
  const ESTADOS_CONOCIDOS = new Set([
    "Borrador",
    "Cotizado",
    "Pendiente",
    "Aceptado",
    "Esperando abono",
    "En produccion",
    "En producción",
    "Terminado",
    "Entregado",
    "Pagado",
    "Rechazado",
    "Cancelado"
  ]);

  function numero(valor) {
    const convertido = Number(valor);
    return Number.isFinite(convertido) ? convertido : 0;
  }

  function numeroDisponible(valor) {
    const convertido = Number(valor);
    return Number.isFinite(convertido) && convertido > 0 ? convertido : null;
  }

  function texto(valor, respaldo = "") {
    return String(valor ?? respaldo).trim();
  }

  function clonar(valor) {
    return valor && typeof valor === "object" ? JSON.parse(JSON.stringify(valor)) : valor;
  }

  function fechaLocal(valor) {
    if (!valor) return null;
    const cadena = String(valor);
    const partes = cadena.match(/^(\d{4})-(\d{2})-(\d{2})/);
    const fecha = partes
      ? new Date(Number(partes[1]), Number(partes[2]) - 1, Number(partes[3]))
      : new Date(valor);
    if (Number.isNaN(fecha.getTime())) return null;
    fecha.setHours(0, 0, 0, 0);
    return fecha;
  }

  function finDia(fecha) {
    const salida = new Date(fecha);
    salida.setHours(23, 59, 59, 999);
    return salida;
  }

  function isoLocal(fecha) {
    return `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, "0")}-${String(fecha.getDate()).padStart(2, "0")}`;
  }

  function inicioMes(fecha) {
    return new Date(fecha.getFullYear(), fecha.getMonth(), 1);
  }

  function finMes(fecha) {
    return finDia(new Date(fecha.getFullYear(), fecha.getMonth() + 1, 0));
  }

  function diasInclusivos(inicio, fin) {
    const desde = fechaLocal(inicio);
    const hasta = fechaLocal(fin);
    if (!desde || !hasta || hasta < desde) return 0;
    const inicioUtc = Date.UTC(desde.getFullYear(), desde.getMonth(), desde.getDate());
    const finUtc = Date.UTC(hasta.getFullYear(), hasta.getMonth(), hasta.getDate());
    return Math.floor((finUtc - inicioUtc) / 86400000) + 1;
  }

  function resolverPeriodo(filtros = {}) {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const tipo = filtros.periodo || cargarConfig().periodoPredeterminado || "este_mes";
    let inicio = new Date(hoy);
    let fin = finDia(hoy);
    let etiqueta = "Este mes";
    let comparable = true;

    if (tipo === "hoy") {
      etiqueta = "Hoy";
    } else if (tipo === "ultimos_7") {
      inicio.setDate(hoy.getDate() - 6);
      etiqueta = "Últimos 7 días";
    } else if (tipo === "mes_anterior") {
      inicio = new Date(hoy.getFullYear(), hoy.getMonth() - 1, 1);
      fin = finMes(inicio);
      etiqueta = "Mes anterior";
    } else if (tipo === "ultimos_90") {
      inicio.setDate(hoy.getDate() - 89);
      etiqueta = "Últimos 90 días";
    } else if (tipo === "este_ano") {
      inicio = new Date(hoy.getFullYear(), 0, 1);
      etiqueta = "Este año";
    } else if (tipo === "ano_anterior") {
      inicio = new Date(hoy.getFullYear() - 1, 0, 1);
      fin = finDia(new Date(hoy.getFullYear() - 1, 11, 31));
      etiqueta = "Año anterior";
    } else if (tipo === "todo") {
      inicio = null;
      fin = null;
      comparable = false;
      etiqueta = "Todo el período";
    } else if (tipo === "personalizado") {
      inicio = fechaLocal(filtros.fechaInicio);
      const finBase = fechaLocal(filtros.fechaFin);
      fin = finBase ? finDia(finBase) : null;
      etiqueta = inicio && fin ? `${isoLocal(inicio)} al ${isoLocal(fin)}` : "Rango personalizado";
      comparable = Boolean(inicio && fin && fin >= inicio);
    } else {
      inicio = inicioMes(hoy);
      fin = finMes(hoy);
      etiqueta = "Este mes";
    }

    if (tipo === "este_mes") {
      inicio = inicioMes(hoy);
      fin = finMes(hoy);
      etiqueta = "Este mes";
    }

    const valido = !inicio || !fin || fin >= inicio;
    return {
      tipo,
      inicio,
      fin,
      inicioISO: inicio ? isoLocal(inicio) : "",
      finISO: fin ? isoLocal(fin) : "",
      etiqueta,
      comparable: comparable && valido,
      valido
    };
  }

  function periodoAnterior(periodo) {
    if (!periodo.comparable || !periodo.inicio || !periodo.fin) return null;
    const duracion = diasInclusivos(periodo.inicio, periodo.fin);
    const fin = new Date(periodo.inicio);
    fin.setDate(fin.getDate() - 1);
    fin.setHours(23, 59, 59, 999);
    const inicio = new Date(fin);
    inicio.setDate(inicio.getDate() - duracion + 1);
    inicio.setHours(0, 0, 0, 0);
    return {
      tipo: "anterior",
      inicio,
      fin,
      inicioISO: isoLocal(inicio),
      finISO: isoLocal(fin),
      etiqueta: `${isoLocal(inicio)} al ${isoLocal(fin)}`,
      comparable: false,
      valido: true
    };
  }

  function enPeriodo(valorFecha, periodo) {
    if (!periodo.valido) return false;
    const fecha = fechaLocal(valorFecha);
    if (!fecha) return false;
    if (periodo.inicio && fecha < periodo.inicio) return false;
    if (periodo.fin && fecha > periodo.fin) return false;
    return true;
  }

  function monedaTrabajo(trabajo) {
    return texto(trabajo.moneda || trabajo.datos?.moneda || "").toUpperCase();
  }

  function estadoTrabajo(trabajo) {
    return texto(trabajo.estado || "Pendiente");
  }

  function esVenta(trabajo) {
    const estado = estadoTrabajo(trabajo);
    if (ESTADOS_EXCLUIDOS.has(estado)) return false;
    return ESTADOS_VENTA.has(estado);
  }

  function fechaVentaTrabajo(trabajo) {
    return trabajo.fechaVenta || trabajo.fechaAceptacion || trabajo.fechaActualizacion || trabajo.fechaCreacion;
  }

  function precioTrabajo(trabajo) {
    return numeroDisponible(trabajo.precioVendidoReal) ?? numeroDisponible(trabajo.precioFinal);
  }

  function costoHistorico(trabajo) {
    return numeroDisponible(trabajo.costoTotal) ?? numeroDisponible(trabajo.resultado?.costoTotal);
  }

  function costoMantenimientoHistorico(trabajo) {
    return numeroDisponible(trabajo.costoMantenimiento)
      ?? numeroDisponible(trabajo.resultado?.costoMantenimiento);
  }

  function costoHerramientasHistorico(trabajo) {
    return numeroDisponible(trabajo.costoHerramientas)
      ?? numeroDisponible(trabajo.resultado?.costoHerramientas);
  }

  function pagosTrabajo(trabajo) {
    return Array.isArray(trabajo.pagos)
      ? trabajo.pagos.map((pago) => ({ ...pago, trabajoId: trabajo.id, moneda: monedaTrabajo(trabajo) }))
      : [];
  }

  function totalPagado(trabajo) {
    const pagos = pagosTrabajo(trabajo).filter((pago) => fechaLocal(pago.fecha) && numero(pago.monto) > 0);
    if (pagos.length) return pagos.reduce((total, pago) => total + numero(pago.monto), 0);
    return numero(trabajo.montoAbonado);
  }

  function clienteNombre(trabajo) {
    return texto(trabajo.clienteSnapshot?.nombre || trabajo.cliente || "Cliente no registrado");
  }

  function impresoraNombre(trabajo) {
    const snapshot = trabajo.impresoraSnapshot || trabajo.datos?.impresoraSnapshot || {};
    return texto(snapshot.nombre || [snapshot.marca, snapshot.modelo].filter(Boolean).join(" ") || "Impresora no registrada");
  }

  function materialNombre(trabajo) {
    const snapshot = trabajo.filamentoSnapshot || trabajo.datos?.filamentoSnapshot || {};
    return texto(
      snapshot.materialNombre || snapshot.material || trabajo.datos?.materialNombre || trabajo.datos?.material || "Material no registrado"
    );
  }

  function materialVariante(trabajo) {
    const snapshot = trabajo.filamentoSnapshot || trabajo.datos?.filamentoSnapshot || {};
    return texto(snapshot.varianteMaterial || snapshot.colorNombre || "");
  }

  function canalTrabajo(trabajo) {
    return texto(trabajo.datos?.canalVentaNombre || trabajo.datos?.canalVenta || trabajo.resultado?.canalVenta || "Sin canal");
  }

  function metodoPagoPrincipal(trabajo) {
    const pagos = pagosTrabajo(trabajo);
    return texto(pagos[0]?.metodo || "Sin método");
  }

  function modoTrabajo(trabajo) {
    return texto(trabajo.modoUsado || trabajo.datos?.modoUsado || "");
  }

  function cumpleFiltrosBase(trabajo, filtros = {}, moneda) {
    if (monedaTrabajo(trabajo) !== moneda) return false;
    if (filtros.estado && estadoTrabajo(trabajo) !== filtros.estado) return false;
    if (filtros.cliente && String(trabajo.clienteId || clienteNombre(trabajo)) !== filtros.cliente) return false;
    if (filtros.impresora && String(trabajo.impresoraId || impresoraNombre(trabajo)) !== filtros.impresora) return false;
    if (filtros.material && materialNombre(trabajo) !== filtros.material) return false;
    if (filtros.canal && canalTrabajo(trabajo) !== filtros.canal) return false;
    if (filtros.metodoPago && !pagosTrabajo(trabajo).some((pago) => texto(pago.metodo) === filtros.metodoPago)) return false;
    if (filtros.modo && modoTrabajo(trabajo) !== filtros.modo) return false;
    return true;
  }

  function obtenerDatos() {
    const trabajos = (window.StoragePrecio3D?.cargarTrabajos?.() || []).map(clonar);
    const clientes = (window.ClientesPrecio3D?.obtenerClientes?.() || []).map(clonar);
    const impresoras = (window.ImpresorasPrecio3D?.obtenerImpresoras?.() || []).map(clonar);
    const bobinas = (window.FilamentosPrecio3D?.obtenerBobinas?.() || []).map(clonar);
    return { trabajos, clientes, impresoras, bobinas };
  }

  function obtenerMonedas(trabajos) {
    return [...new Set(trabajos.map(monedaTrabajo).filter(Boolean))].sort();
  }

  function elegirMoneda(monedas, solicitada) {
    const normalizada = texto(solicitada || cargarConfig().monedaSeleccionada || "").toUpperCase();
    if (normalizada && monedas.includes(normalizada)) return normalizada;
    if (monedas.includes("CLP")) return "CLP";
    return monedas[0] || "CLP";
  }

  function filtrosDisponibles(trabajos, moneda) {
    const base = trabajos.filter((trabajo) => monedaTrabajo(trabajo) === moneda);
    const unico = (selector) => [...new Set(base.map(selector).filter(Boolean))].sort((a, b) => String(a).localeCompare(String(b), "es"));
    return {
      monedas: obtenerMonedas(trabajos),
      estados: unico(estadoTrabajo),
      clientes: unico((trabajo) => String(trabajo.clienteId || clienteNombre(trabajo))),
      clientesEtiquetas: Object.fromEntries(base.map((trabajo) => [String(trabajo.clienteId || clienteNombre(trabajo)), clienteNombre(trabajo)])),
      impresoras: unico((trabajo) => String(trabajo.impresoraId || impresoraNombre(trabajo))),
      impresorasEtiquetas: Object.fromEntries(base.map((trabajo) => [String(trabajo.impresoraId || impresoraNombre(trabajo)), impresoraNombre(trabajo)])),
      materiales: unico(materialNombre),
      canales: unico(canalTrabajo),
      metodosPago: unico((trabajo) => metodoPagoPrincipal(trabajo)).filter((item) => item !== "Sin método"),
      modos: unico(modoTrabajo)
    };
  }

  function agregarGrupo(mapa, clave, trabajo, pagoPeriodo = 0) {
    const actual = mapa.get(clave) || {
      nombre: clave,
      trabajos: 0,
      ventas: 0,
      pagos: 0,
      saldo: 0,
      costos: 0,
      utilidad: 0,
      ultimaVenta: "",
      horas: 0,
      gramos: 0,
      costoMaterial: 0
    };
    const precio = precioTrabajo(trabajo);
    const costo = costoHistorico(trabajo);
    actual.trabajos += 1;
    if (precio !== null) actual.ventas += precio;
    actual.pagos += pagoPeriodo;
    actual.saldo += Math.max((precio || 0) - totalPagado(trabajo), 0);
    if (costo !== null && precio !== null) {
      actual.costos += costo;
      actual.utilidad += precio - costo - numero(trabajo.costosAdicionalesReales);
    }
    actual.ultimaVenta = [actual.ultimaVenta, fechaVentaTrabajo(trabajo)].filter(Boolean).sort().at(-1) || "";
    actual.horas += numero(trabajo.datos?.horasImpresion);
    actual.gramos += numero(trabajo.datos?.pesoPieza) + numero(trabajo.datos?.pesoSoportesPurga);
    actual.costoMaterial += numero(trabajo.resultado?.costoMaterial);
    mapa.set(clave, actual);
  }

  function finalizarGrupos(mapa, orden = "utilidad") {
    return [...mapa.values()]
      .map((item) => ({
        ...item,
        margen: item.ventas > 0 && item.costos > 0 ? item.utilidad / item.ventas : null,
        ticketPromedio: item.trabajos > 0 ? item.ventas / item.trabajos : null
      }))
      .sort((a, b) => numero(b[orden]) - numero(a[orden]));
  }

  function sumarComponentesCostos(trabajos) {
    const totales = {
      material: 0,
      energia: 0,
      manoObra: 0,
      mantenimiento: 0,
      amortizacion: 0,
      herramientas: 0,
      comisionesVenta: 0,
      comisionesPago: 0,
      impuestos: 0,
      otros: 0
    };
    let completo = 0;
    let parcial = 0;
    let sinDesglose = 0;

    trabajos.forEach((trabajo) => {
      const resultado = trabajo.resultado || {};
      const datos = trabajo.datos || {};
      const mantenimiento = costoMantenimientoHistorico(trabajo);
      const herramientas = costoHerramientasHistorico(trabajo);
      const amortizacion = numeroDisponible(resultado.costoAmortizacion);
      const presentes = [
        "costoMaterial",
        "costoElectricidad",
        "costoManoObra",
        "costoAmortizacion",
        "costoLogistico",
        "impuesto"
      ].filter((campo) => Number.isFinite(Number(resultado[campo])))
        .concat(mantenimiento !== null ? ["costoMantenimiento"] : [])
        .concat(herramientas !== null ? ["costoHerramientas"] : []);

      if (!presentes.length) {
        sinDesglose += 1;
      } else if (presentes.length >= 5) {
        completo += 1;
      } else {
        parcial += 1;
      }

      totales.material += numero(resultado.costoMaterial);
      totales.energia += numero(resultado.costoElectricidad);
      totales.manoObra += numero(resultado.costoManoObra);
      totales.mantenimiento += numero(mantenimiento);
      totales.herramientas += numero(herramientas);
      totales.amortizacion += Math.max(0, numero(amortizacion) - numero(mantenimiento) - numero(herramientas));
      totales.comisionesVenta += numero(resultado.feeFijoTotal);
      totales.comisionesPago += Math.max(0, numero(resultado.precioNeto) * numero(datos.feePorcentualTotal || resultado.feePorcentualTotal));
      totales.impuestos += numero(resultado.impuesto);
      totales.otros += numero(datos.marketing) + numero(datos.otrosCostos) + numero(trabajo.costosAdicionalesReales);
    });

    return { totales, calidad: { completo, parcial, sinDesglose } };
  }

  function agruparEvolucion(ventas, pagos, periodo) {
    const dias = periodo.inicio && periodo.fin
      ? Math.max(1, diasInclusivos(periodo.inicio, periodo.fin))
      : 366;
    const tipo = dias <= 31 ? "dia" : dias <= 120 ? "semana" : "mes";
    const mapa = new Map();

    function clave(fechaValor) {
      const fecha = fechaLocal(fechaValor);
      if (!fecha) return "Sin fecha";
      if (tipo === "mes") return `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, "0")}`;
      if (tipo === "semana") {
        const inicio = new Date(fecha);
        inicio.setDate(fecha.getDate() - fecha.getDay());
        return `Semana ${isoLocal(inicio)}`;
      }
      return isoLocal(fecha);
    }

    function item(claveSerie) {
      if (!mapa.has(claveSerie)) {
        mapa.set(claveSerie, { periodo: claveSerie, ventas: 0, pagos: 0, costos: 0, utilidad: 0 });
      }
      return mapa.get(claveSerie);
    }

    ventas.forEach((trabajo) => {
      const fila = item(clave(fechaVentaTrabajo(trabajo)));
      const precio = precioTrabajo(trabajo);
      const costo = costoHistorico(trabajo);
      if (precio !== null) fila.ventas += precio;
      if (precio !== null && costo !== null) {
        fila.costos += costo;
        fila.utilidad += precio - costo - numero(trabajo.costosAdicionalesReales);
      }
    });

    pagos.forEach((pago) => {
      item(clave(pago.fecha)).pagos += numero(pago.monto);
    });

    return [...mapa.values()].sort((a, b) => String(a.periodo).localeCompare(String(b.periodo), "es"));
  }

  function calcularMetricas(trabajosBase, filtros, periodo, moneda) {
    const trabajosFiltrados = trabajosBase.filter((trabajo) => cumpleFiltrosBase(trabajo, filtros, moneda));
    const ventas = trabajosFiltrados.filter((trabajo) => esVenta(trabajo) && enPeriodo(fechaVentaTrabajo(trabajo), periodo));
    const pagos = trabajosFiltrados.filter(esVenta).flatMap(pagosTrabajo)
      .filter((pago) => monedaTrabajo(trabajosFiltrados.find((trabajo) => trabajo.id === pago.trabajoId) || {}) === moneda)
      .filter((pago) => numero(pago.monto) > 0 && enPeriodo(pago.fecha, periodo));
    const ventasConPrecio = ventas.filter((trabajo) => precioTrabajo(trabajo) !== null);
    const ventasConCosto = ventasConPrecio.filter((trabajo) => costoHistorico(trabajo) !== null);
    const ventasRegistradas = ventasConPrecio.reduce((total, trabajo) => total + precioTrabajo(trabajo), 0);
    const pagosCobrados = pagos.reduce((total, pago) => total + numero(pago.monto), 0);
    const costosProduccion = ventasConCosto.reduce((total, trabajo) => total + costoHistorico(trabajo), 0);
    const ventasParaUtilidad = ventasConCosto.reduce((total, trabajo) => total + precioTrabajo(trabajo), 0);
    const utilidadBruta = ventasConCosto.reduce(
      (total, trabajo) => total + precioTrabajo(trabajo) - costoHistorico(trabajo) - numero(trabajo.costosAdicionalesReales),
      0
    );
    const cuentasPorCobrar = ventasConPrecio.reduce((total, trabajo) => {
      const saldo = Math.max(precioTrabajo(trabajo) - totalPagado(trabajo), 0);
      return total + saldo;
    }, 0);
    const ticketPromedio = ventasConPrecio.length ? ventasRegistradas / ventasConPrecio.length : null;
    const margenBruto = ventasParaUtilidad > 0 ? utilidadBruta / ventasParaUtilidad : null;

    return {
      trabajosFiltrados,
      ventas,
      pagos,
      ventasConPrecio,
      ventasConCosto,
      resumen: {
        ventasRegistradas,
        pagosCobrados,
        cuentasPorCobrar,
        costosProduccion,
        utilidadBruta,
        margenBruto,
        ticketPromedio,
        trabajosVendidos: ventasConPrecio.length,
        ventasSinCosto: ventasConPrecio.length - ventasConCosto.length
      }
    };
  }

  function comparar(actual, anterior) {
    const salida = {};
    Object.keys(actual.resumen).forEach((clave) => {
      const valor = actual.resumen[clave];
      const base = anterior?.resumen?.[clave];
      if (!Number.isFinite(Number(valor)) || !Number.isFinite(Number(base)) || Number(base) === 0) {
        salida[clave] = { texto: "Sin base comparable", porcentaje: null };
      } else {
        const cambio = (Number(valor) - Number(base)) / Number(base);
        salida[clave] = {
          texto: cambio === 0 ? "Sin cambio" : `${cambio > 0 ? "+" : ""}${(cambio * 100).toFixed(1)}% vs período anterior`,
          porcentaje: cambio
        };
      }
    });
    return salida;
  }

  function obtenerCalidadDatos(trabajosBase = [], filtros = {}, moneda = "") {
    const trabajos = moneda ? trabajosBase.filter((trabajo) => monedaTrabajo(trabajo) === moneda) : trabajosBase;
    const issues = {
      trabajosSinCostoHistorico: [],
      trabajosSinPrecioVenta: [],
      trabajosSinMoneda: [],
      trabajosSinCliente: [],
      trabajosSinImpresora: [],
      trabajosSinMaterial: [],
      pagosSinFecha: [],
      pagosSinMetodo: [],
      estadosDesconocidos: [],
      snapshotsIncompletos: [],
      costosNoDesglosados: [],
      monedasIncompatibles: []
    };

    trabajos.forEach((trabajo) => {
      if (!cumpleFiltrosBase(trabajo, filtros, moneda || monedaTrabajo(trabajo))) return;
      if (esVenta(trabajo) && costoHistorico(trabajo) === null) issues.trabajosSinCostoHistorico.push(trabajo);
      if (esVenta(trabajo) && precioTrabajo(trabajo) === null) issues.trabajosSinPrecioVenta.push(trabajo);
      if (!monedaTrabajo(trabajo)) issues.trabajosSinMoneda.push(trabajo);
      if (!trabajo.clienteId && !trabajo.cliente && !trabajo.clienteSnapshot?.nombre) issues.trabajosSinCliente.push(trabajo);
      if (!trabajo.impresoraId && !trabajo.impresoraSnapshot && !trabajo.datos?.impresoraSnapshot) issues.trabajosSinImpresora.push(trabajo);
      if (!trabajo.filamentoId && !trabajo.filamentoSnapshot && !trabajo.datos?.filamentoSnapshot && !trabajo.datos?.materialNombre) issues.trabajosSinMaterial.push(trabajo);
      if (!ESTADOS_CONOCIDOS.has(estadoTrabajo(trabajo))) issues.estadosDesconocidos.push(trabajo);
      if ((trabajo.impresoraId && !trabajo.impresoraSnapshot) || (trabajo.filamentoId && !trabajo.filamentoSnapshot)) issues.snapshotsIncompletos.push(trabajo);
      if (esVenta(trabajo) && !Number.isFinite(Number(trabajo.resultado?.costoMaterial))) issues.costosNoDesglosados.push(trabajo);
      pagosTrabajo(trabajo).forEach((pago) => {
        if (!fechaLocal(pago.fecha)) issues.pagosSinFecha.push({ ...pago, trabajo });
        if (!texto(pago.metodo)) issues.pagosSinMetodo.push({ ...pago, trabajo });
      });
    });

    return {
      totalTrabajos: trabajos.length,
      completos: trabajos.filter((trabajo) =>
        precioTrabajo(trabajo) !== null &&
        costoHistorico(trabajo) !== null &&
        monedaTrabajo(trabajo) &&
        clienteNombre(trabajo) !== "Cliente no registrado" &&
        impresoraNombre(trabajo) !== "Impresora no registrada" &&
        materialNombre(trabajo) !== "Material no registrado"
      ).length,
      parciales: 0,
      excluidosRentabilidad: issues.trabajosSinCostoHistorico.length + issues.trabajosSinPrecioVenta.length,
      issues
    };
  }

  function generarReporte(filtros = {}) {
    const datos = obtenerDatos();
    const periodo = resolverPeriodo(filtros);
    const monedasDisponibles = obtenerMonedas(datos.trabajos);
    const moneda = elegirMoneda(monedasDisponibles, filtros.moneda);
    const disponibles = filtrosDisponibles(datos.trabajos, moneda);
    const metricas = calcularMetricas(datos.trabajos, filtros, periodo, moneda);
    const anteriorPeriodo = periodoAnterior(periodo);
    const metricasAnteriores = anteriorPeriodo ? calcularMetricas(datos.trabajos, filtros, anteriorPeriodo, moneda) : null;
    const comparacion = metricasAnteriores ? comparar(metricas, metricasAnteriores) : {};
    const pagosPorTrabajo = new Map();
    metricas.pagos.forEach((pago) => pagosPorTrabajo.set(pago.trabajoId, (pagosPorTrabajo.get(pago.trabajoId) || 0) + numero(pago.monto)));

    const porProducto = new Map();
    const porCliente = new Map();
    const porImpresora = new Map();
    const porMaterial = new Map();
    const porCanal = new Map();
    const porMetodo = new Map();

    metricas.ventas.forEach((trabajo) => {
      const pagoPeriodo = pagosPorTrabajo.get(trabajo.id) || 0;
      agregarGrupo(porProducto, texto(trabajo.nombreTrabajo || "Trabajo sin nombre"), trabajo, pagoPeriodo);
      agregarGrupo(porCliente, clienteNombre(trabajo), trabajo, pagoPeriodo);
      agregarGrupo(porImpresora, impresoraNombre(trabajo), trabajo, pagoPeriodo);
      agregarGrupo(porMaterial, [materialNombre(trabajo), materialVariante(trabajo)].filter(Boolean).join(" · "), trabajo, pagoPeriodo);
      agregarGrupo(porCanal, canalTrabajo(trabajo), trabajo, pagoPeriodo);
    });

    metricas.pagos.forEach((pago) => {
      const clave = texto(pago.metodo || "Sin método");
      const actual = porMetodo.get(clave) || { nombre: clave, pagos: 0, monto: 0, comisiones: 0, porcentaje: 0 };
      actual.pagos += 1;
      actual.monto += numero(pago.monto);
      porMetodo.set(clave, actual);
    });
    porMetodo.forEach((item) => {
      item.porcentaje = metricas.resumen.pagosCobrados > 0 ? item.monto / metricas.resumen.pagosCobrados : null;
    });

    const trabajosPeriodo = metricas.trabajosFiltrados
      .filter((trabajo) => enPeriodo(fechaVentaTrabajo(trabajo), periodo));
    const distribucion = new Map();
    trabajosPeriodo.forEach((trabajo) => {
      const estado = ESTADOS_CONOCIDOS.has(estadoTrabajo(trabajo)) ? estadoTrabajo(trabajo) : "Otro";
      const actual = distribucion.get(estado) || { estado, cantidad: 0, monto: 0 };
      actual.cantidad += 1;
      actual.monto += precioTrabajo(trabajo) || 0;
      distribucion.set(estado, actual);
    });

    const pendientes = metricas.ventasConPrecio
      .map((trabajo) => ({
        id: trabajo.id,
        nombre: trabajo.nombreTrabajo,
        cliente: clienteNombre(trabajo),
        fecha: fechaVentaTrabajo(trabajo),
        precio: precioTrabajo(trabajo),
        pagado: totalPagado(trabajo),
        saldo: Math.max(precioTrabajo(trabajo) - totalPagado(trabajo), 0),
        estado: estadoTrabajo(trabajo)
      }))
      .filter((item) => item.saldo > 0)
      .sort((a, b) => b.saldo - a.saldo || String(a.fecha).localeCompare(String(b.fecha)));

    const ranking = metricas.ventasConCosto
      .map((trabajo) => {
        const precio = precioTrabajo(trabajo);
        const costo = costoHistorico(trabajo);
        const utilidad = precio - costo - numero(trabajo.costosAdicionalesReales);
        return {
          id: trabajo.id,
          nombre: trabajo.nombreTrabajo,
          cliente: clienteNombre(trabajo),
          fecha: fechaVentaTrabajo(trabajo),
          estado: estadoTrabajo(trabajo),
          precio,
          costo,
          utilidad,
          margen: precio > 0 ? utilidad / precio : null
        };
      })
      .filter((item) => !["Borrador", "Cancelado", "Rechazado"].includes(item.estado));

    const desgloseCostos = sumarComponentesCostos(metricas.ventas);
    const calidadDatos = obtenerCalidadDatos(trabajosPeriodo);
    calidadDatos.parciales = Math.max(0, calidadDatos.totalTrabajos - calidadDatos.completos);

    return {
      version: VERSION,
      generadoEn: new Date().toISOString(),
      filtros: { ...filtros, moneda },
      periodo,
      periodoAnterior: anteriorPeriodo,
      moneda,
      monedasDisponibles,
      filtrosDisponibles: disponibles,
      resumen: metricas.resumen,
      comparacion,
      evolucion: agruparEvolucion(metricas.ventas, metricas.pagos, periodo),
      desgloseCostos,
      rentabilidadProducto: finalizarGrupos(porProducto, "ventas"),
      rentabilidadCliente: finalizarGrupos(porCliente, "ventas"),
      rentabilidadImpresora: finalizarGrupos(porImpresora, "utilidad"),
      rentabilidadMaterial: finalizarGrupos(porMaterial, "utilidad"),
      canalesVenta: finalizarGrupos(porCanal, "ventas"),
      metodosPago: [...porMetodo.values()].sort((a, b) => b.monto - a.monto),
      distribucionEstado: [...distribucion.values()].sort((a, b) => b.cantidad - a.cantidad),
      cuentasPorCobrar: pendientes,
      trabajosMayorUtilidad: [...ranking].sort((a, b) => b.utilidad - a.utilidad).slice(0, 25),
      trabajosMenorUtilidad: [...ranking].sort((a, b) => a.utilidad - b.utilidad).slice(0, 25),
      detalleTrabajos: metricas.ventas.map((trabajo) => {
        const precio = precioTrabajo(trabajo);
        const costo = costoHistorico(trabajo);
        const pagado = totalPagado(trabajo);
        return {
          id: trabajo.id,
          nombre: trabajo.nombreTrabajo,
          cliente: clienteNombre(trabajo),
          fecha: fechaVentaTrabajo(trabajo),
          estado: estadoTrabajo(trabajo),
          moneda,
          precio,
          pagado,
          saldo: precio !== null ? Math.max(precio - pagado, 0) : null,
          costoTotal: costo,
          costoMaterial: Number.isFinite(Number(trabajo.resultado?.costoMaterial)) ? Number(trabajo.resultado.costoMaterial) : null,
          costoEnergia: Number.isFinite(Number(trabajo.resultado?.costoElectricidad)) ? Number(trabajo.resultado.costoElectricidad) : null,
          manoObra: Number.isFinite(Number(trabajo.resultado?.costoManoObra)) ? Number(trabajo.resultado.costoManoObra) : null,
          mantenimiento: costoMantenimientoHistorico(trabajo),
          amortizacion: Number.isFinite(Number(trabajo.resultado?.costoAmortizacion)) ? Number(trabajo.resultado.costoAmortizacion) : null,
          comisiones: Number.isFinite(Number(trabajo.resultado?.feeFijoTotal)) ? Number(trabajo.resultado.feeFijoTotal) : null,
          otrosCostos: numero(trabajo.costosAdicionalesReales) || null,
          utilidad: precio !== null && costo !== null ? precio - costo - numero(trabajo.costosAdicionalesReales) : null,
          margen: precio !== null && costo !== null && precio > 0 ? (precio - costo - numero(trabajo.costosAdicionalesReales)) / precio : null,
          impresora: impresoraNombre(trabajo),
          material: materialNombre(trabajo),
          gramos: numero(trabajo.datos?.pesoPieza) + numero(trabajo.datos?.pesoSoportesPurga) || null,
          canal: canalTrabajo(trabajo),
          metodoPago: metodoPagoPrincipal(trabajo)
        };
      }),
      calidadDatos,
      fuentes: {
        trabajos: "window.StoragePrecio3D.cargarTrabajos()",
        clientes: "window.ClientesPrecio3D.obtenerClientes()",
        impresoras: "window.ImpresorasPrecio3D.obtenerImpresoras()",
        filamentos: "window.FilamentosPrecio3D.obtenerBobinas()"
      }
    };
  }

  function obtenerResumenFinanciero(filtros) {
    return generarReporte(filtros).resumen;
  }

  function obtenerVentasPorPeriodo(filtros) {
    return generarReporte(filtros).evolucion.map((item) => ({ periodo: item.periodo, ventas: item.ventas }));
  }

  function obtenerPagosPorPeriodo(filtros) {
    return generarReporte(filtros).evolucion.map((item) => ({ periodo: item.periodo, pagos: item.pagos }));
  }

  function obtenerCostosPorPeriodo(filtros) {
    return generarReporte(filtros).evolucion.map((item) => ({ periodo: item.periodo, costos: item.costos, utilidad: item.utilidad }));
  }

  function obtenerRentabilidadPorProducto(filtros) {
    return generarReporte(filtros).rentabilidadProducto;
  }

  function obtenerRentabilidadPorCliente(filtros) {
    return generarReporte(filtros).rentabilidadCliente;
  }

  function obtenerRentabilidadPorImpresora(filtros) {
    return generarReporte(filtros).rentabilidadImpresora;
  }

  function obtenerRentabilidadPorMaterial(filtros) {
    return generarReporte(filtros).rentabilidadMaterial;
  }

  function obtenerDistribucionPorEstado(filtros) {
    return generarReporte(filtros).distribucionEstado;
  }

  function obtenerCuentasPorCobrar(filtros) {
    return generarReporte(filtros).cuentasPorCobrar;
  }

  function csvValor(valor) {
    if (valor === null || valor === undefined) return "";
    return `"${String(valor).replaceAll('"', '""')}"`;
  }

  function crearCSV(encabezados, filas) {
    return `\uFEFF${[encabezados, ...filas].map((fila) => fila.map(csvValor).join(";")).join("\r\n")}`;
  }

  function exportarResumenCSV(filtros) {
    const reporte = generarReporte(filtros);
    const r = reporte.resumen;
    return crearCSV(
      ["Periodo", "Moneda", "Ventas", "Pagos cobrados", "Cuentas por cobrar", "Costos", "Utilidad", "Margen", "Ticket promedio", "Trabajos vendidos", "Fecha generacion"],
      [[
        reporte.periodo.etiqueta,
        reporte.moneda,
        r.ventasRegistradas,
        r.pagosCobrados,
        r.cuentasPorCobrar,
        r.costosProduccion,
        r.utilidadBruta,
        r.margenBruto,
        r.ticketPromedio,
        r.trabajosVendidos,
        reporte.generadoEn
      ]]
    );
  }

  function exportarDetalleCSV(filtros) {
    const reporte = generarReporte(filtros);
    return crearCSV(
      ["ID del trabajo", "Nombre", "Cliente", "Fecha", "Estado", "Moneda", "Precio vendido", "Total pagado", "Saldo", "Costo total", "Costo de material", "Costo de energia", "Mano de obra", "Mantenimiento", "Amortizacion", "Comisiones", "Otros costos", "Utilidad", "Margen", "Impresora", "Material", "Gramos utilizados", "Canal", "Metodo de pago"],
      reporte.detalleTrabajos.map((item) => [
        item.id,
        item.nombre,
        item.cliente,
        item.fecha,
        item.estado,
        item.moneda,
        item.precio,
        item.pagado,
        item.saldo,
        item.costoTotal,
        item.costoMaterial,
        item.costoEnergia,
        item.manoObra,
        item.mantenimiento,
        item.amortizacion,
        item.comisiones,
        item.otrosCostos,
        item.utilidad,
        item.margen,
        item.impresora,
        item.material,
        item.gramos,
        item.canal,
        item.metodoPago
      ])
    );
  }

  function cargarConfig() {
    try {
      const datos = JSON.parse(localStorage.getItem(CONFIG_KEY) || "null");
      return datos && datos.version === VERSION ? datos : { version: VERSION, periodoPredeterminado: "este_mes" };
    } catch (error) {
      return { version: VERSION, periodoPredeterminado: "este_mes" };
    }
  }

  function guardarConfig(config) {
    try {
      localStorage.setItem(CONFIG_KEY, JSON.stringify({
        version: VERSION,
        periodoPredeterminado: config?.periodoPredeterminado || "este_mes",
        monedaSeleccionada: texto(config?.monedaSeleccionada || ""),
        seccionesVisibles: Array.isArray(config?.seccionesVisibles) ? config.seccionesVisibles : [],
        ultimaActualizacion: new Date().toISOString()
      }));
      return true;
    } catch (error) {
      console.warn("No fue posible guardar la configuracion del panel financiero.", error);
      return false;
    }
  }

  window.ReportesPrecio3D = {
    generarReporte,
    obtenerResumenFinanciero,
    obtenerVentasPorPeriodo,
    obtenerPagosPorPeriodo,
    obtenerCostosPorPeriodo,
    obtenerRentabilidadPorProducto,
    obtenerRentabilidadPorCliente,
    obtenerRentabilidadPorImpresora,
    obtenerRentabilidadPorMaterial,
    obtenerDistribucionPorEstado,
    obtenerCuentasPorCobrar,
    obtenerCalidadDatos: (filtros = {}) => generarReporte(filtros).calidadDatos,
    exportarResumenCSV,
    exportarDetalleCSV,
    cargarConfig,
    guardarConfig,
    claveConfig: CONFIG_KEY
  };
})();

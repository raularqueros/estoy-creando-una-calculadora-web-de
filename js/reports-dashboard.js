// Interfaz del panel financiero. Solo lee datos y renderiza reportes.
(function () {
  "use strict";

  const LIMIT_TABLE = 25;
  let reporteActual = null;

  const $ = (selector) => document.querySelector(selector);
  const numero = (valor) => (Number.isFinite(Number(valor)) ? Number(valor) : 0);
  const t = (clave, reemplazos = {}) =>
    window.obtenerTextoI18n?.(clave, reemplazos) || clave;
  const escapar = (valor) =>
    String(valor ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");

  function formatearMoneda(valor, moneda = "CLP") {
    if (valor === null || valor === undefined || !Number.isFinite(Number(valor))) return t("noDisponible");
    if (typeof window.formatearMonedaPrecio3D === "function") {
      return window.formatearMonedaPrecio3D(Number(valor), moneda);
    }
    return new Intl.NumberFormat(document.documentElement.lang || "es", { style: "currency", currency: moneda }).format(Number(valor));
  }

  function formatearPorcentaje(valor) {
    if (valor === null || valor === undefined || !Number.isFinite(Number(valor))) return t("noDisponible");
    return `${(Number(valor) * 100).toLocaleString(document.documentElement.lang || "es", { maximumFractionDigits: 1 })}%`;
  }

  function estadoVisible(estado) {
    return t({
      Borrador: "borrador",
      Cotizado: "cotizado",
      Pendiente: "pendiente",
      Aceptado: "aceptado",
      "Esperando abono": "esperandoAbono",
      "En produccion": "enProduccion",
      "En producción": "enProduccion",
      Terminado: "terminado",
      Entregado: "entregado",
      Pagado: "pagado",
      Rechazado: "rechazado",
      Cancelado: "cancelado",
      Otro: "otro"
    }[estado] || "sinDefinir");
  }

  function periodoVisible(periodo) {
    const clave = {
      hoy: "hoy",
      ultimos_7: "ultimosSieteDias",
      este_mes: "esteMes",
      mes_anterior: "mesAnterior",
      ultimos_90: "ultimosTresMeses",
      este_ano: "esteAno",
      ano_anterior: "anoAnterior",
      todo: "todoPeriodo"
    }[periodo?.tipo];
    return clave ? t(clave) : periodo?.etiqueta || t("rangoPersonalizado");
  }

  function descargar(nombre, contenido, tipo = "text/csv;charset=utf-8") {
    const blob = new Blob([contenido], { type: tipo });
    const url = URL.createObjectURL(blob);
    const enlace = document.createElement("a");
    enlace.href = url;
    enlace.download = nombre;
    document.body.appendChild(enlace);
    enlace.click();
    enlace.remove();
    URL.revokeObjectURL(url);
  }

  function leerFiltros() {
    return {
      periodo: $("#reportePeriodo")?.value || "este_mes",
      fechaInicio: $("#reporteFechaInicio")?.value || "",
      fechaFin: $("#reporteFechaFin")?.value || "",
      moneda: $("#reporteMoneda")?.value || "",
      estado: $("#reporteEstado")?.value || "",
      cliente: $("#reporteCliente")?.value || "",
      impresora: $("#reporteImpresora")?.value || "",
      material: $("#reporteMaterial")?.value || "",
      canal: $("#reporteCanal")?.value || "",
      metodoPago: $("#reporteMetodoPago")?.value || "",
      modo: $("#reporteModo")?.value || ""
    };
  }

  function poblarSelect(select, valores, etiquetas = {}, vacio = "Todos") {
    if (!select) return;
    const actual = select.value;
    select.innerHTML = `<option value="">${escapar(vacio)}</option>${valores.map((valor) =>
      `<option value="${escapar(valor)}">${escapar(etiquetas[valor] || valor)}</option>`
    ).join("")}`;
    if ([...select.options].some((option) => option.value === actual)) {
      select.value = actual;
    }
  }

  function poblarFiltros(reporte) {
    const filtros = reporte.filtrosDisponibles || {};
    const moneda = $("#reporteMoneda");
    if (moneda) {
      const actual = moneda.value || reporte.moneda;
      const monedas = (filtros.monedas || []).length ? filtros.monedas : [reporte.moneda];
      moneda.innerHTML = monedas.map((item) => `<option value="${escapar(item)}">${escapar(item)}</option>`).join("");
      moneda.value = monedas.includes(actual) ? actual : reporte.moneda;
    }
    const estadosEtiquetas = Object.fromEntries((filtros.estados || []).map((estado) => [estado, estadoVisible(estado)]));
    poblarSelect($("#reporteEstado"), filtros.estados || [], estadosEtiquetas, t("todos"));
    poblarSelect($("#reporteCliente"), filtros.clientes || [], filtros.clientesEtiquetas || {}, t("todos"));
    poblarSelect($("#reporteImpresora"), filtros.impresoras || [], filtros.impresorasEtiquetas || {}, t("todas"));
    poblarSelect($("#reporteMaterial"), filtros.materiales || [], {}, t("todos"));
    poblarSelect($("#reporteCanal"), filtros.canales || [], {}, t("todos"));
    poblarSelect($("#reporteMetodoPago"), filtros.metodosPago || [], {}, t("todos"));
    poblarSelect($("#reporteModo"), filtros.modos || [], {}, t("todos"));
  }

  function renderTarjetas(reporte) {
    const contenedor = $("#reporteKpis");
    if (!contenedor) return;
    const moneda = reporte.moneda;
    const r = reporte.resumen;
    const tieneVentas = r.trabajosVendidos > 0;
    const trabajosConCosto = Math.max(0, r.trabajosVendidos - r.ventasSinCosto);
    const valorVentas = tieneVentas ? formatearMoneda(r.ventasRegistradas, moneda) : t("sinDatos");
    const valorCostos = trabajosConCosto ? formatearMoneda(r.costosProduccion, moneda) : t("sinDatos");
    const valorUtilidad = trabajosConCosto ? formatearMoneda(r.utilidadBruta, moneda) : t("sinDatos");
    const items = [
      [t("ventasConsideradas"), valorVentas, t("ventasConsideradasAyuda", { cantidad: r.trabajosVendidos, moneda })],
      [t("costosTotales"), valorCostos, t("costosTotalesAyuda", { cantidad: trabajosConCosto, moneda })],
      [t("utilidadEstimada"), valorUtilidad, t("utilidadEstimadaAyuda", { cantidad: trabajosConCosto, moneda })],
      [t("margenPromedio"), trabajosConCosto ? formatearPorcentaje(r.margenBruto) : t("sinDatos"), t("margenPromedioAyuda", { cantidad: trabajosConCosto })]
    ];
    contenedor.innerHTML = items.map(([titulo, valor, ayuda]) => `
      <article class="report-kpi-card">
        <span>${escapar(titulo)}</span>
        <strong>${escapar(valor)}</strong>
        <small>${escapar(ayuda)}</small>
      </article>
    `).join("");
  }

  function renderGrafico(reporte) {
    const contenedor = $("#reporteGrafico");
    if (!contenedor) return;
    const datos = reporte.evolucion || [];
    if (!datos.length) {
      contenedor.innerHTML = `<p class="empty-state">${escapar(t("sinDatosGrafico"))}</p>`;
      return;
    }
    const ancho = 720;
    const alto = 220;
    const margen = 34;
    const valores = datos.flatMap((item) => [item.ventas, item.pagos, item.costos, item.utilidad].map(numero));
    const maximo = Math.max(0, ...valores);
    const minimo = Math.min(0, ...valores);
    const rango = Math.max(1, maximo - minimo);
    const x = (indice) => datos.length === 1
      ? ancho / 2
      : margen + (indice * (ancho - margen * 2)) / (datos.length - 1);
    const y = (valor) => margen + ((maximo - numero(valor)) / rango) * (alto - margen * 2);
    const linea = (campo) => datos.map((item, indice) => `${x(indice)},${y(item[campo])}`).join(" ");
    const baseCero = y(0);
    contenedor.innerHTML = `
      <figure class="report-chart">
        <figcaption>${escapar(t("evolucionResultadosPeriodo"))}</figcaption>
        <svg viewBox="0 0 ${ancho} ${alto}" role="img" aria-labelledby="reporteGraficoTitulo reporteGraficoDesc">
          <title id="reporteGraficoTitulo">${escapar(t("graficoResultadosTitulo"))}</title>
          <desc id="reporteGraficoDesc">${escapar(t("graficoResultadosDescripcion"))}</desc>
          <line class="report-chart-zero" x1="${margen}" y1="${baseCero}" x2="${ancho - margen}" y2="${baseCero}" />
          <line x1="${margen}" y1="${margen}" x2="${margen}" y2="${alto - margen}" />
          <polyline class="serie ventas" points="${linea("ventas")}" />
          <polyline class="serie pagos" points="${linea("pagos")}" />
          <polyline class="serie costos" points="${linea("costos")}" />
          <polyline class="serie utilidad" points="${linea("utilidad")}" />
        </svg>
        <div class="report-chart-legend">
          <span>${escapar(t("ventas"))}</span><span>${escapar(t("pagos"))}</span><span>${escapar(t("costos"))}</span><span>${escapar(t("utilidad"))}</span>
        </div>
      </figure>
      ${tablaSimple([t("periodo"), t("ventas"), t("pagos"), t("costos"), t("utilidad")], datos.slice(0, 12).map((item) => [
        item.periodo,
        formatearMoneda(item.ventas, reporte.moneda),
        formatearMoneda(item.pagos, reporte.moneda),
        formatearMoneda(item.costos, reporte.moneda),
        formatearMoneda(item.utilidad, reporte.moneda)
      ]))}
    `;
  }

  function tablaSimple(encabezados, filas, clase = "") {
    if (!filas.length) return `<p class="empty-state">${escapar(t("sinDatosMostrar"))}</p>`;
    return `
      <div class="report-table-scroll ${clase}">
        <table class="report-table">
          <thead><tr>${encabezados.map((item) => `<th>${escapar(item)}</th>`).join("")}</tr></thead>
          <tbody>${filas.map((fila) => `<tr>${fila.map((item, indice) => `<td data-label="${escapar(encabezados[indice])}">${escapar(item)}</td>`).join("")}</tr>`).join("")}</tbody>
        </table>
      </div>
    `;
  }

  function renderRentabilidad(reporte) {
    const moneda = reporte.moneda;
    const grupos = [
      ["reporteProductos", t("producto"), reporte.rentabilidadProducto],
      ["reporteClientes", t("cliente"), reporte.rentabilidadCliente],
      ["reporteImpresoras", t("impresora"), reporte.rentabilidadImpresora],
      ["reporteMateriales", t("material"), reporte.rentabilidadMaterial]
    ];
    grupos.forEach(([id, titulo, datos]) => {
      const contenedor = $(`#${id}`);
      if (!contenedor) return;
      contenedor.innerHTML = tablaSimple(
        [titulo, t("trabajos"), t("ventas"), t("costos"), t("utilidad"), t("margen"), t("ticketPromedio")],
        datos.slice(0, LIMIT_TABLE).map((item) => [
          item.nombre,
          item.trabajos,
          formatearMoneda(item.ventas, moneda),
          formatearMoneda(item.costos, moneda),
          formatearMoneda(item.utilidad, moneda),
          formatearPorcentaje(item.margen),
          formatearMoneda(item.ticketPromedio, moneda)
        ])
      );
    });
  }

  function renderTablas(reporte) {
    const moneda = reporte.moneda;
    const pendientes = $("#reporteCuentasPorCobrar");
    if (pendientes) {
      pendientes.innerHTML = tablaSimple(
        [t("trabajo"), t("cliente"), t("fecha"), t("precio"), t("pagado"), t("saldo"), t("estado")],
        reporte.cuentasPorCobrar.slice(0, LIMIT_TABLE).map((item) => [
          item.nombre,
          item.cliente,
          item.fecha,
          formatearMoneda(item.precio, moneda),
          formatearMoneda(item.pagado, moneda),
          formatearMoneda(item.saldo, moneda),
          estadoVisible(item.estado)
        ])
      );
    }

    const canales = $("#reporteCanalesPago");
    if (canales) {
      canales.innerHTML = `
        <h3>${escapar(t("canalesVenta"))}</h3>
        ${tablaSimple([t("canal"), t("trabajos"), t("ventas"), t("utilidad")], reporte.canalesVenta.slice(0, LIMIT_TABLE).map((item) => [
          item.nombre, item.trabajos, formatearMoneda(item.ventas, moneda), formatearMoneda(item.utilidad, moneda)
        ]))}
        <h3>${escapar(t("metodosPago"))}</h3>
        ${tablaSimple([t("metodo"), t("pagos"), t("montoCobrado"), t("porcentajeCobro")], reporte.metodosPago.slice(0, LIMIT_TABLE).map((item) => [
          item.nombre, item.pagos, formatearMoneda(item.monto, moneda), formatearPorcentaje(item.porcentaje)
        ]))}
      `;
    }

    const ranking = $("#reporteRankingTrabajos");
    if (ranking) {
      ranking.innerHTML = `
        <h3>${escapar(t("trabajosMayorUtilidad"))}</h3>
        ${tablaSimple([t("trabajo"), t("cliente"), t("fecha"), t("precio"), t("costo"), t("utilidad"), t("margen"), t("estado")], reporte.trabajosMayorUtilidad.map((item) => [
          item.nombre, item.cliente, item.fecha, formatearMoneda(item.precio, moneda), formatearMoneda(item.costo, moneda), formatearMoneda(item.utilidad, moneda), formatearPorcentaje(item.margen), estadoVisible(item.estado)
        ]))}
        <h3>${escapar(t("trabajosMenorUtilidad"))}</h3>
        ${tablaSimple([t("trabajo"), t("cliente"), t("fecha"), t("precio"), t("costo"), t("utilidad"), t("margen"), t("estado")], reporte.trabajosMenorUtilidad.map((item) => [
          item.nombre, item.cliente, item.fecha, formatearMoneda(item.precio, moneda), formatearMoneda(item.costo, moneda), formatearMoneda(item.utilidad, moneda), formatearPorcentaje(item.margen), estadoVisible(item.estado)
        ]))}
      `;
    }

    const estados = $("#reporteEstadosCostos");
    if (estados) {
      const costos = reporte.desgloseCostos;
      estados.innerHTML = `
        <h3>${escapar(t("distribucionEstado"))}</h3>
        ${tablaSimple([t("estado"), t("cantidad"), t("monto")], reporte.distribucionEstado.map((item) => [
          estadoVisible(item.estado), item.cantidad, formatearMoneda(item.monto, moneda)
        ]))}
        <h3>${escapar(t("desgloseCostosDisponible"))}</h3>
        ${tablaSimple([t("componente"), t("monto")], Object.entries(costos.totales).map(([clave, valor]) => [t(`costoComponente_${clave}`), formatearMoneda(valor, moneda)]))}
        <p class="help-text">${escapar(t("calidadDesgloseCostos", {
          completos: costos.calidad.completo,
          parciales: costos.calidad.parcial,
          sinDesglose: costos.calidad.sinDesglose
        }))}</p>
      `;
    }
  }

  function renderCalidad(reporte) {
    const contenedor = $("#reporteCalidadDatos");
    if (!contenedor) return;
    const calidad = reporte.calidadDatos;
    const issues = calidad.issues || {};
    const filas = [
      [t("trabajosAnalizados"), calidad.totalTrabajos],
      [t("informacionCompleta"), calidad.completos],
      [t("informacionParcial"), calidad.parciales],
      [t("excluidosRentabilidad"), calidad.excluidosRentabilidad],
      [t("sinCostoHistorico"), issues.trabajosSinCostoHistorico?.length || 0],
      [t("sinPrecioVenta"), issues.trabajosSinPrecioVenta?.length || 0],
      [t("sinCliente"), issues.trabajosSinCliente?.length || 0],
      [t("sinImpresora"), issues.trabajosSinImpresora?.length || 0],
      [t("sinMaterial"), issues.trabajosSinMaterial?.length || 0],
      [t("pagosSinFecha"), issues.pagosSinFecha?.length || 0],
      [t("estadosDesconocidos"), issues.estadosDesconocidos?.length || 0]
    ];
    contenedor.innerHTML = tablaSimple([t("revision"), t("cantidad")], filas);
  }

  function renderEstado(reporte) {
    const estado = $("#reporteEstadoPanel");
    if (!estado) return;
    if (!reporte.periodo.valido) {
      estado.textContent = t("fechaFinalInvalida");
      estado.className = "report-status report-status--warning";
      return;
    }
    if (!reporte.monedasDisponibles.length) {
      estado.textContent = t("sinTrabajosReporte");
      estado.className = "report-status report-status--empty";
      return;
    }
    if (!reporte.detalleTrabajos.length && !reporte.resumen.pagosCobrados) {
      estado.innerHTML = `
        <span>${escapar(t("sinResultadosReporte"))}</span>
        <button type="button" class="secondary" data-report-clear>${escapar(t("limpiarFiltros"))}</button>
      `;
      estado.className = "report-status report-status--empty";
      return;
    }
    estado.textContent = t("periodoAplicado", { periodo: periodoVisible(reporte.periodo), detalle: "" });
    estado.className = "report-status";
  }

  function renderAdvertencias(reporte) {
    const contenedor = $("#reporteAdvertencias");
    if (!contenedor) return;
    const avisos = [];
    if (reporte.monedasDisponibles.length > 1) {
      avisos.push(t("advertenciaVariasMonedas", {
        cantidad: reporte.monedasDisponibles.length,
        moneda: reporte.moneda
      }));
    }
    const calidad = reporte.calidadDatos || {};
    if (calidad.excluidosRentabilidad > 0) {
      avisos.push(t("advertenciaDatosIncompletos", { cantidad: calidad.excluidosRentabilidad }));
    }
    contenedor.innerHTML = avisos.map((aviso) =>
      `<p class="report-alert">${escapar(aviso)}</p>`
    ).join("");
    contenedor.hidden = !avisos.length;
  }

  function renderizar() {
    if (!window.ReportesPrecio3D) return;
    reporteActual = window.ReportesPrecio3D.generarReporte(leerFiltros());
    poblarFiltros(reporteActual);
    renderEstado(reporteActual);
    renderAdvertencias(reporteActual);
    renderTarjetas(reporteActual);
    renderGrafico(reporteActual);
    renderRentabilidad(reporteActual);
    renderTablas(reporteActual);
    renderCalidad(reporteActual);
  }

  function limpiarFiltros() {
    ["#reporteEstado", "#reporteCliente", "#reporteImpresora", "#reporteMaterial", "#reporteCanal", "#reporteMetodoPago", "#reporteModo", "#reporteFechaInicio", "#reporteFechaFin"]
      .forEach((selector) => {
        const campo = $(selector);
        if (campo) campo.value = "";
      });
    const periodo = $("#reportePeriodo");
    if (periodo) periodo.value = "este_mes";
    renderizar();
  }

  function imprimirReporte() {
    document.body.classList.add("printing-report");
    window.print();
    window.setTimeout(() => document.body.classList.remove("printing-report"), 1000);
  }

  function inicializar() {
    if (!$("#panelFinancieroPanel") || !window.ReportesPrecio3D) return;
    const config = window.ReportesPrecio3D.cargarConfig?.() || {};
    if ($("#reportePeriodo")) $("#reportePeriodo").value = config.periodoPredeterminado || "este_mes";
    if ($("#reporteMoneda") && config.monedaSeleccionada) $("#reporteMoneda").value = config.monedaSeleccionada;
    renderizar();

    document.querySelectorAll("[data-report-filter]").forEach((campo) => {
      campo.addEventListener("change", renderizar);
      campo.addEventListener("input", () => {
        if (campo.type === "search") renderizar();
      });
    });

    $("#reporteAplicarRango")?.addEventListener("click", renderizar);
    $("#reporteLimpiarFiltros")?.addEventListener("click", limpiarFiltros);
    $("#reporteEstadoPanel")?.addEventListener("click", (evento) => {
      if (evento.target.closest("[data-report-clear]")) limpiarFiltros();
    });
    $("#reporteExportarResumen")?.addEventListener("click", () => {
      descargar("resumen-financiero-impresion-3d.csv", window.ReportesPrecio3D.exportarResumenCSV(leerFiltros()));
    });
    $("#reporteExportarDetalle")?.addEventListener("click", () => {
      descargar("detalle-financiero-impresion-3d.csv", window.ReportesPrecio3D.exportarDetalleCSV(leerFiltros()));
    });
    $("#reporteImprimir")?.addEventListener("click", imprimirReporte);

    document.addEventListener("precio3d:idioma-actualizado", renderizar);
    window.addEventListener("precio3d:trabajos-actualizados", renderizar);
    window.addEventListener("precio3d:clientes-actualizados", renderizar);
    window.addEventListener("precio3d:impresoras-actualizadas", renderizar);
    window.addEventListener("precio3d:filamentos-actualizados", renderizar);
  }

  window.PanelReportesPrecio3D = {
    renderizar,
    obtenerReporteActual: () => reporteActual
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", inicializar);
  } else {
    inicializar();
  }
})();

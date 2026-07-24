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
    return new Intl.NumberFormat("es-CL", { style: "currency", currency: moneda }).format(Number(valor));
  }

  function formatearPorcentaje(valor) {
    if (valor === null || valor === undefined || !Number.isFinite(Number(valor))) return t("noDisponible");
    return `${(Number(valor) * 100).toFixed(1)}%`;
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
    poblarSelect($("#reporteEstado"), filtros.estados || [], {}, t("todos"));
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
    const items = [
      ["Ventas registradas", formatearMoneda(r.ventasRegistradas, moneda), "Suma de trabajos vendidos en el periodo.", reporte.comparacion.ventasRegistradas?.texto],
      ["Pagos cobrados", formatearMoneda(r.pagosCobrados, moneda), "Pagos registrados por fecha de pago.", reporte.comparacion.pagosCobrados?.texto],
      ["Cuentas por cobrar", formatearMoneda(r.cuentasPorCobrar, moneda), "Saldo pendiente de trabajos filtrados.", reporte.comparacion.cuentasPorCobrar?.texto],
      ["Costos de producción", formatearMoneda(r.costosProduccion, moneda), "Costos históricos guardados.", reporte.comparacion.costosProduccion?.texto],
      ["Utilidad bruta estimada", formatearMoneda(r.utilidadBruta, moneda), "Ventas con costo histórico menos costos.", reporte.comparacion.utilidadBruta?.texto],
      ["Margen bruto estimado", formatearPorcentaje(r.margenBruto), "Calculado solo con trabajos con costo histórico.", reporte.comparacion.margenBruto?.texto],
      ["Ticket promedio", formatearMoneda(r.ticketPromedio, moneda), "Ventas divididas por trabajos vendidos.", reporte.comparacion.ticketPromedio?.texto],
      ["Trabajos vendidos", r.trabajosVendidos, `${r.ventasSinCosto} sin costo histórico.`, reporte.comparacion.trabajosVendidos?.texto]
    ];
    contenedor.innerHTML = items.map(([titulo, valor, ayuda, comparacion]) => `
      <article class="report-kpi-card">
        <span>${escapar(titulo)}</span>
        <strong>${escapar(valor)}</strong>
        <small>${escapar(ayuda)}</small>
        ${comparacion ? `<em>${escapar(comparacion)}</em>` : ""}
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
    const maximo = Math.max(1, ...datos.flatMap((item) => [item.ventas, item.pagos, item.costos, item.utilidad].map(numero)));
    const x = (indice) => margen + (datos.length === 1 ? 0 : (indice * (ancho - margen * 2)) / (datos.length - 1));
    const y = (valor) => alto - margen - (numero(valor) / maximo) * (alto - margen * 2);
    const linea = (campo) => datos.map((item, indice) => `${x(indice)},${y(item[campo])}`).join(" ");
    contenedor.innerHTML = `
      <figure class="report-chart">
        <figcaption>Evolución de resultados por periodo</figcaption>
        <svg viewBox="0 0 ${ancho} ${alto}" role="img" aria-labelledby="reporteGraficoTitulo reporteGraficoDesc">
          <title id="reporteGraficoTitulo">Evolución de ventas, pagos, costos y utilidad</title>
          <desc id="reporteGraficoDesc">Gráfico temporal con tabla alternativa debajo.</desc>
          <line x1="${margen}" y1="${alto - margen}" x2="${ancho - margen}" y2="${alto - margen}" />
          <line x1="${margen}" y1="${margen}" x2="${margen}" y2="${alto - margen}" />
          <polyline class="serie ventas" points="${linea("ventas")}" />
          <polyline class="serie pagos" points="${linea("pagos")}" />
          <polyline class="serie costos" points="${linea("costos")}" />
          <polyline class="serie utilidad" points="${linea("utilidad")}" />
        </svg>
        <div class="report-chart-legend">
          <span>Ventas</span><span>Pagos</span><span>Costos</span><span>Utilidad</span>
        </div>
      </figure>
      ${tablaSimple(["Periodo", "Ventas", "Pagos", "Costos", "Utilidad"], datos.slice(0, 12).map((item) => [
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
      ["reporteProductos", "Producto", reporte.rentabilidadProducto],
      ["reporteClientes", "Cliente", reporte.rentabilidadCliente],
      ["reporteImpresoras", "Impresora", reporte.rentabilidadImpresora],
      ["reporteMateriales", "Material", reporte.rentabilidadMaterial]
    ];
    grupos.forEach(([id, titulo, datos]) => {
      const contenedor = $(`#${id}`);
      if (!contenedor) return;
      contenedor.innerHTML = tablaSimple(
        [titulo, "Trabajos", "Ventas", "Costos", "Utilidad", "Margen", "Ticket"],
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
        ["Trabajo", "Cliente", "Fecha", "Precio", "Pagado", "Saldo", "Estado"],
        reporte.cuentasPorCobrar.slice(0, LIMIT_TABLE).map((item) => [
          item.nombre,
          item.cliente,
          item.fecha,
          formatearMoneda(item.precio, moneda),
          formatearMoneda(item.pagado, moneda),
          formatearMoneda(item.saldo, moneda),
          item.estado
        ])
      );
    }

    const canales = $("#reporteCanalesPago");
    if (canales) {
      canales.innerHTML = `
        <h3>Canales de venta</h3>
        ${tablaSimple(["Canal", "Trabajos", "Ventas", "Utilidad"], reporte.canalesVenta.slice(0, LIMIT_TABLE).map((item) => [
          item.nombre, item.trabajos, formatearMoneda(item.ventas, moneda), formatearMoneda(item.utilidad, moneda)
        ]))}
        <h3>Métodos de pago</h3>
        ${tablaSimple(["Método", "Pagos", "Monto cobrado", "% del cobro"], reporte.metodosPago.slice(0, LIMIT_TABLE).map((item) => [
          item.nombre, item.pagos, formatearMoneda(item.monto, moneda), formatearPorcentaje(item.porcentaje)
        ]))}
      `;
    }

    const ranking = $("#reporteRankingTrabajos");
    if (ranking) {
      ranking.innerHTML = `
        <h3>Trabajos con mayor utilidad</h3>
        ${tablaSimple(["Trabajo", "Cliente", "Fecha", "Precio", "Costo", "Utilidad", "Margen", "Estado"], reporte.trabajosMayorUtilidad.map((item) => [
          item.nombre, item.cliente, item.fecha, formatearMoneda(item.precio, moneda), formatearMoneda(item.costo, moneda), formatearMoneda(item.utilidad, moneda), formatearPorcentaje(item.margen), item.estado
        ]))}
        <h3>Trabajos con menor utilidad</h3>
        ${tablaSimple(["Trabajo", "Cliente", "Fecha", "Precio", "Costo", "Utilidad", "Margen", "Estado"], reporte.trabajosMenorUtilidad.map((item) => [
          item.nombre, item.cliente, item.fecha, formatearMoneda(item.precio, moneda), formatearMoneda(item.costo, moneda), formatearMoneda(item.utilidad, moneda), formatearPorcentaje(item.margen), item.estado
        ]))}
      `;
    }

    const estados = $("#reporteEstadosCostos");
    if (estados) {
      const costos = reporte.desgloseCostos;
      estados.innerHTML = `
        <h3>Distribución por estado</h3>
        ${tablaSimple(["Estado", "Cantidad", "Monto"], reporte.distribucionEstado.map((item) => [
          item.estado, item.cantidad, formatearMoneda(item.monto, moneda)
        ]))}
        <h3>Desglose de costos disponible</h3>
        ${tablaSimple(["Componente", "Monto"], Object.entries(costos.totales).map(([clave, valor]) => [clave, formatearMoneda(valor, moneda)]))}
        <p class="help-text">${costos.calidad.completo} completos, ${costos.calidad.parcial} parciales y ${costos.calidad.sinDesglose} sin desglose detallado.</p>
      `;
    }
  }

  function renderCalidad(reporte) {
    const contenedor = $("#reporteCalidadDatos");
    if (!contenedor) return;
    const calidad = reporte.calidadDatos;
    const issues = calidad.issues || {};
    const filas = [
      ["Trabajos analizados", calidad.totalTrabajos],
      ["Con información completa", calidad.completos],
      ["Con información parcial", calidad.parciales],
      ["Excluidos de rentabilidad", calidad.excluidosRentabilidad],
      ["Sin costo histórico", issues.trabajosSinCostoHistorico?.length || 0],
      ["Sin precio de venta", issues.trabajosSinPrecioVenta?.length || 0],
      ["Sin cliente", issues.trabajosSinCliente?.length || 0],
      ["Sin impresora", issues.trabajosSinImpresora?.length || 0],
      ["Sin material", issues.trabajosSinMaterial?.length || 0],
      ["Pagos sin fecha", issues.pagosSinFecha?.length || 0],
      ["Estados desconocidos", issues.estadosDesconocidos?.length || 0]
    ];
    contenedor.innerHTML = tablaSimple(["Revisión", "Cantidad"], filas);
  }

  function renderEstado(reporte) {
    const estado = $("#reporteEstadoPanel");
    if (!estado) return;
    if (!reporte.periodo.valido) {
      estado.textContent = t("fechaFinalInvalida");
      estado.className = "report-status report-status--warning";
      return;
    }
    if (!reporte.detalleTrabajos.length && !reporte.resumen.pagosCobrados) {
      estado.textContent = t("sinResultadosReporte");
      estado.className = "report-status report-status--empty";
      return;
    }
    const mezcla = reporte.monedasDisponibles.length > 1
      ? ` Hay ${reporte.monedasDisponibles.length} monedas registradas; se analiza solo ${reporte.moneda}.`
      : "";
    estado.textContent = t("periodoAplicado", { periodo: reporte.periodo.etiqueta, detalle: mezcla });
    estado.className = "report-status";
  }

  function renderizar() {
    if (!window.ReportesPrecio3D) return;
    reporteActual = window.ReportesPrecio3D.generarReporte(leerFiltros());
    poblarFiltros(reporteActual);
    renderEstado(reporteActual);
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

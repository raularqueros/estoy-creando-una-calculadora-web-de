// Panel comercial local para organizar cotizaciones, ventas y pagos.
(function () {
  "use strict";

  const ESTADOS_SIMPLES = ["Pendiente", "Aceptado", "Terminado", "Pagado", "Rechazado"];
  const ESTADOS_COMPLETOS = [
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
  const ESTADOS_ACEPTADOS = new Set([
    "Aceptado",
    "Esperando abono",
    "En producción",
    "Terminado",
    "Entregado",
    "Pagado"
  ]);

  let configuracion = {};
  let trabajoDetalleId = null;
  let elementoFocoAnterior = null;
  let inicializado = false;

  const $ = (selector) => document.querySelector(selector);
  const numero = (valor) => (Number.isFinite(Number(valor)) ? Number(valor) : 0);
  const escapar = (valor) =>
    String(valor ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");

  function monedaTrabajo(trabajo) {
    return trabajo.moneda || trabajo.datos?.moneda || "CLP";
  }

  function formatearMoneda(valor, moneda = "CLP") {
    if (typeof configuracion.formatearMoneda === "function") {
      return configuracion.formatearMoneda(numero(valor), moneda, true);
    }

    return new Intl.NumberFormat("es-CL", { style: "currency", currency: moneda }).format(numero(valor));
  }

  function formatearPorcentaje(valor) {
    return `${(numero(valor) * 100).toFixed(1)}%`;
  }

  function formatearFecha(valor) {
    if (!valor) {
      return "Sin fecha";
    }

    const texto = String(valor);
    const partesFechaLocal = texto.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    const fecha = partesFechaLocal
      ? new Date(Number(partesFechaLocal[1]), Number(partesFechaLocal[2]) - 1, Number(partesFechaLocal[3]))
      : new Date(valor);
    return Number.isNaN(fecha.getTime()) ? "Sin fecha" : fecha.toLocaleDateString("es-CL");
  }

  function totalPagado(trabajo) {
    if (Array.isArray(trabajo.pagos) && trabajo.pagos.length) {
      return trabajo.pagos.reduce((total, pago) => total + numero(pago.monto), 0);
    }

    return numero(trabajo.montoAbonado);
  }

  function precioCobro(trabajo) {
    return numero(trabajo.precioVendidoReal) > 0
      ? numero(trabajo.precioVendidoReal)
      : numero(trabajo.precioFinal);
  }

  function utilidadReal(trabajo) {
    if (numero(trabajo.precioVendidoReal) <= 0) {
      return null;
    }

    return numero(trabajo.precioVendidoReal) - numero(trabajo.costoTotal) - numero(trabajo.costosAdicionalesReales);
  }

  function margenReal(trabajo) {
    const utilidad = utilidadReal(trabajo);
    return utilidad === null || numero(trabajo.precioVendidoReal) <= 0
      ? null
      : utilidad / numero(trabajo.precioVendidoReal);
  }

  function sumarPorMoneda(trabajos, selector) {
    return trabajos.reduce((totales, trabajo) => {
      const moneda = monedaTrabajo(trabajo);
      totales[moneda] = (totales[moneda] || 0) + numero(selector(trabajo));
      return totales;
    }, {});
  }

  function formatearTotales(totales) {
    const textos = Object.entries(totales).map(([moneda, valor]) => formatearMoneda(valor, moneda));
    return textos.length ? textos.join(" · ") : formatearMoneda(0, "CLP");
  }

  function rangoPeriodo(periodo, referencia = new Date()) {
    const inicioDia = (fecha) => new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate());
    const finDia = (fecha) => new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate(), 23, 59, 59, 999);
    const ano = referencia.getFullYear();
    const mes = referencia.getMonth();

    if (periodo === "mes_anterior") {
      return { inicio: new Date(ano, mes - 1, 1), fin: new Date(ano, mes, 0, 23, 59, 59, 999) };
    }
    if (periodo === "tres_meses") {
      return { inicio: new Date(ano, mes - 2, 1), fin: finDia(referencia) };
    }
    if (periodo === "este_ano") {
      return { inicio: new Date(ano, 0, 1), fin: finDia(referencia) };
    }
    if (periodo === "todo") {
      return { inicio: null, fin: null };
    }

    return { inicio: new Date(ano, mes, 1), fin: finDia(referencia) };
  }

  function pertenecePeriodo(trabajo, periodo) {
    const fecha = new Date(trabajo.fechaCreacion);
    if (Number.isNaN(fecha.getTime())) {
      return periodo === "todo";
    }

    const rango = rangoPeriodo(periodo);
    return (!rango.inicio || fecha >= rango.inicio) && (!rango.fin || fecha <= rango.fin);
  }

  function obtenerFiltros() {
    return {
      busqueda: String($("#trabajosBusqueda")?.value || "").trim().toLowerCase(),
      estado: $("#trabajosFiltroEstado")?.value || "todos",
      periodo: $("#trabajosFiltroPeriodo")?.value || "este_mes",
      modo: $("#trabajosFiltroModo")?.value || "todos",
      orden: $("#trabajosOrden")?.value || "recientes"
    };
  }

  function filtrarTrabajos(trabajos, filtros = obtenerFiltros()) {
    const filtrados = trabajos.filter((trabajo) => {
      const texto = [trabajo.nombreTrabajo, trabajo.cliente, trabajo.descripcion, trabajo.numeroCotizacion]
        .join(" ")
        .toLowerCase();
      return (
        (!filtros.busqueda || texto.includes(filtros.busqueda)) &&
        (filtros.estado === "todos" || trabajo.estado === filtros.estado) &&
        (filtros.modo === "todos" || trabajo.modoUsado === filtros.modo) &&
        pertenecePeriodo(trabajo, filtros.periodo)
      );
    });

    const ordenadores = {
      antiguos: (a, b) => new Date(a.fechaCreacion) - new Date(b.fechaCreacion),
      mayor_precio: (a, b) => precioCobro(b) - precioCobro(a),
      menor_precio: (a, b) => precioCobro(a) - precioCobro(b),
      mayor_utilidad: (a, b) => numero(utilidadReal(b) ?? b.utilidadObjetivo) - numero(utilidadReal(a) ?? a.utilidadObjetivo),
      nombre: (a, b) => String(a.nombreTrabajo).localeCompare(String(b.nombreTrabajo), "es"),
      recientes: (a, b) => new Date(b.fechaCreacion) - new Date(a.fechaCreacion)
    };

    return filtrados.sort(ordenadores[filtros.orden] || ordenadores.recientes);
  }

  function calcularIndicadores(trabajos) {
    const aceptados = trabajos.filter((trabajo) => ESTADOS_ACEPTADOS.has(trabajo.estado));
    const pagados = trabajos.filter((trabajo) => trabajo.estado === "Pagado");
    const conVentaReal = trabajos.filter((trabajo) => numero(trabajo.precioVendidoReal) > 0);
    const cotizadosValidos = trabajos.filter((trabajo) => trabajo.estado !== "Cancelado");
    const tasaAceptacion = cotizadosValidos.length ? aceptados.length / cotizadosValidos.length : 0;

    return {
      cotizado: sumarPorMoneda(trabajos, (trabajo) => trabajo.precioFinal),
      aceptado: sumarPorMoneda(aceptados, (trabajo) => trabajo.precioFinal),
      pagado: sumarPorMoneda(pagados, (trabajo) => precioCobro(trabajo)),
      utilidadEstimada: sumarPorMoneda(aceptados, (trabajo) => trabajo.utilidadObjetivo),
      utilidadReal: sumarPorMoneda(conVentaReal, (trabajo) => utilidadReal(trabajo)),
      pendientes: trabajos.filter((trabajo) => trabajo.estado === "Pendiente").length,
      tasaAceptacion
    };
  }

  function iconoIndicador(tipo) {
    const iconos = {
      cotizado: '<path d="M4 6h16v12H4zM7 10h10M7 14h6"/>',
      aceptado: '<path d="M5 12l4 4L19 6"/>',
      pagado: '<circle cx="12" cy="12" r="8"/><path d="M9 10h5a2 2 0 010 4H9M12 7v10"/>',
      utilidad: '<path d="M4 18l5-5 4 3 7-9M16 7h4v4"/>',
      pendiente: '<circle cx="12" cy="12" r="8"/><path d="M12 8v5l3 2"/>',
      tasa: '<path d="M5 19L19 5M7 7h.01M17 17h.01"/>'
    };
    return `<svg viewBox="0 0 24 24" aria-hidden="true">${iconos[tipo] || iconos.cotizado}</svg>`;
  }

  function tarjetaIndicador(etiqueta, valor, tipo, comparacion = "") {
    return `
      <article class="job-kpi">
        <div class="job-kpi__icon">${iconoIndicador(tipo)}</div>
        <div><span>${escapar(etiqueta)}</span><strong>${escapar(valor)}</strong>${comparacion ? `<small>${escapar(comparacion)}</small>` : ""}</div>
      </article>
    `;
  }

  function renderizarIndicadores(trabajos, filtros) {
    const contenedor = $("#trabajosResumen");
    if (!contenedor) return;
    const indicadores = calcularIndicadores(trabajos);
    let comparacion = "";

    if (filtros.periodo === "este_mes") {
      const todos = window.StoragePrecio3D?.cargarTrabajos?.() || [];
      const anterior = todos.filter((trabajo) => pertenecePeriodo(trabajo, "mes_anterior"));
      const monedaActual = Object.keys(indicadores.cotizado);
      const cotizadoAnterior = sumarPorMoneda(anterior, (trabajo) => trabajo.precioFinal);
      if (monedaActual.length === 1 && numero(cotizadoAnterior[monedaActual[0]]) > 0) {
        const actual = numero(indicadores.cotizado[monedaActual[0]]);
        const cambio = ((actual - cotizadoAnterior[monedaActual[0]]) / cotizadoAnterior[monedaActual[0]]) * 100;
        comparacion = `${Math.abs(cambio).toFixed(0)}% ${cambio >= 0 ? "más" : "menos"} que el mes anterior`;
      }
    }

    contenedor.innerHTML = [
      tarjetaIndicador("Cotizado en el período", formatearTotales(indicadores.cotizado), "cotizado", comparacion),
      tarjetaIndicador("Vendido o aceptado", formatearTotales(indicadores.aceptado), "aceptado"),
      tarjetaIndicador("Pagado", formatearTotales(indicadores.pagado), "pagado"),
      tarjetaIndicador("Utilidad estimada", formatearTotales(indicadores.utilidadEstimada), "utilidad"),
      tarjetaIndicador("Utilidad real", formatearTotales(indicadores.utilidadReal), "utilidad"),
      tarjetaIndicador("Trabajos pendientes", String(indicadores.pendientes), "pendiente"),
      tarjetaIndicador("Tasa de aceptación", formatearPorcentaje(indicadores.tasaAceptacion), "tasa")
    ].join("");
  }

  function claseEstado(estado) {
    return `status-${String(estado || "pendiente").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-")}`;
  }

  function badgeEstado(estado) {
    return `<span class="job-status-badge ${claseEstado(estado)}">${escapar(estado)}</span>`;
  }

  function opcionesEstado(actual) {
    const flujo = window.StoragePrecio3D?.cargarFlujoTrabajos?.() || "simple";
    const estados = flujo === "completo" ? [...ESTADOS_COMPLETOS] : [...ESTADOS_SIMPLES];
    if (!estados.includes(actual)) estados.push(actual);
    return estados.map((estado) => `<option value="${escapar(estado)}" ${estado === actual ? "selected" : ""}>${escapar(estado)}</option>`).join("");
  }

  function movimientosInventarioTrabajo(trabajoId) {
    return (window.FilamentosPrecio3D?.obtenerBobinas?.() || []).flatMap((bobina) =>
      (bobina.movimientos || [])
        .filter((movimiento) => movimiento.referenciaTipo === "trabajo" && movimiento.referenciaId === trabajoId)
        .map((movimiento) => ({ bobina, movimiento }))
    );
  }

  function resumenConsumoInventario(trabajo) {
    const registros = movimientosInventarioTrabajo(trabajo.id);
    const revertidos = new Set(
      registros
        .filter(({ movimiento }) => movimiento.tipo === "reversion_consumo_trabajo")
        .map(({ movimiento }) => movimiento.movimientoOriginalId)
    );
    const consumosActivos = registros.filter(({ movimiento }) =>
      movimiento.tipo === "consumo_trabajo" && !revertidos.has(movimiento.id)
    );
    const total = consumosActivos.reduce((acumulado, { movimiento }) => acumulado + numero(movimiento.cantidadGramos), 0);
    const estimado = consumoEstimado({ id: trabajo.id, ...trabajo });
    const huboReversion = registros.some(({ movimiento }) => movimiento.tipo === "reversion_consumo_trabajo");
    const estado = consumosActivos.length
      ? huboReversion ? "Corregido" : estimado > 0 && total + 0.001 < estimado ? "Parcial" : "Registrado"
      : registros.length ? "Revertido" : "No registrado";
    return {
      registros,
      consumosActivos,
      total,
      registrado: consumosActivos.length > 0,
      estado
    };
  }

  function sincronizarConsumoTrabajo(trabajoId, filamentoId = "") {
    const trabajo = buscarTrabajo(trabajoId);
    if (!trabajo) return null;
    const resumen = resumenConsumoInventario(trabajo);
    const ids = resumen.registros.map(({ movimiento }) => movimiento.id);
    return window.StoragePrecio3D?.actualizarTrabajo?.(trabajoId, {
      filamentoId: filamentoId || trabajo.filamentoId,
      consumoInventario: {
        registrado: resumen.registrado,
        estado: resumen.estado,
        totalRegistradoGramos: resumen.total,
        movimientosIds: ids,
        fechaUltimoRegistro: resumen.registros.at(-1)?.movimiento.createdAt || ""
      }
    });
  }

  function tieneMaterialAsociado(trabajo) {
    return Boolean(trabajo.filamentoId || trabajo.filamentoSnapshot || trabajo.datos?.filamentoSnapshot);
  }

  function filaTrabajo(trabajo) {
    const moneda = monedaTrabajo(trabajo);
    const utilidad = utilidadReal(trabajo) ?? numero(trabajo.utilidadObjetivo);
    return `
      <tr data-job-id="${escapar(trabajo.id)}">
        <td data-label="Trabajo"><strong>${escapar(trabajo.nombreTrabajo)}</strong>${trabajo.numeroCotizacion ? `<small>${escapar(trabajo.numeroCotizacion)}</small>` : ""}</td>
        <td data-label="Cliente">${escapar(trabajo.cliente || "Sin cliente")}</td>
        <td data-label="Fecha">${escapar(formatearFecha(trabajo.fechaCreacion))}</td>
        <td data-label="Precio"><strong>${escapar(formatearMoneda(precioCobro(trabajo), moneda))}</strong></td>
        <td data-label="Utilidad">${escapar(formatearMoneda(utilidad, moneda))}</td>
        <td data-label="Estado">
          ${badgeEstado(trabajo.estado)}
          <select class="job-inline-status" data-commercial-action="estado" data-job-id="${escapar(trabajo.id)}" aria-label="Cambiar estado de ${escapar(trabajo.nombreTrabajo)}">${opcionesEstado(trabajo.estado)}</select>
        </td>
        <td data-label="Acciones">
          <details class="job-row-actions">
            <summary>Acciones</summary>
            <div>
              <button type="button" data-commercial-action="detalle" data-job-id="${escapar(trabajo.id)}">Ver detalle</button>
              <button type="button" data-commercial-action="cargar" data-job-id="${escapar(trabajo.id)}">Cargar y editar</button>
              <button type="button" data-commercial-action="cotizacion" data-job-id="${escapar(trabajo.id)}">Generar cotización</button>
              <button type="button" data-commercial-action="agregar-cotizacion" data-job-id="${escapar(trabajo.id)}">Agregar a cotización</button>
              <button type="button" data-commercial-action="venta" data-job-id="${escapar(trabajo.id)}">Registrar venta</button>
              <button type="button" data-commercial-action="pago" data-job-id="${escapar(trabajo.id)}">Registrar pago</button>
              ${tieneMaterialAsociado(trabajo) ? `<button type="button" data-commercial-action="consumo-material" data-job-id="${escapar(trabajo.id)}">Registrar consumo de material</button>` : ""}
              <button type="button" data-commercial-action="duplicar" data-job-id="${escapar(trabajo.id)}">Duplicar</button>
              <button type="button" class="danger-button" data-commercial-action="eliminar" data-job-id="${escapar(trabajo.id)}">Eliminar</button>
            </div>
          </details>
        </td>
      </tr>
    `;
  }

  function renderizarListado(trabajos, totalOriginal) {
    const contenedor = $("#trabajosListado");
    if (!contenedor) return;

    if (!totalOriginal) {
      contenedor.innerHTML = '<p class="empty-state">Aún no has guardado trabajos. Realiza una cotización y guárdala para comenzar.</p>';
      return;
    }
    if (!trabajos.length) {
      contenedor.innerHTML = '<p class="empty-state">No hay trabajos que coincidan con estos filtros.</p>';
      return;
    }

    contenedor.innerHTML = `
      <div class="jobs-table-wrap">
        <table class="jobs-table">
          <thead><tr><th>Trabajo</th><th>Cliente</th><th>Fecha</th><th>Precio</th><th>Utilidad</th><th>Estado</th><th>Acciones</th></tr></thead>
          <tbody>${trabajos.map(filaTrabajo).join("")}</tbody>
        </table>
      </div>
    `;
  }

  function detalleItem(etiqueta, valor) {
    return `<div class="job-detail-item"><span>${escapar(etiqueta)}</span><strong>${escapar(valor || "No registrado")}</strong></div>`;
  }

  function renderizarMaterialInventario(trabajo) {
    const snapshot = trabajo.filamentoSnapshot || trabajo.datos?.filamentoSnapshot || null;
    const bobina = trabajo.filamentoId ? window.FilamentosPrecio3D?.obtenerBobinaPorId?.(trabajo.filamentoId) : null;
    const resumen = resumenConsumoInventario(trabajo);
    const idsActivos = new Set(resumen.consumosActivos.map(({ movimiento }) => movimiento.id));
    const historial = resumen.registros.length
      ? `<div class="job-material-history">${resumen.registros.map(({ bobina: bobinaMovimiento, movimiento }) => {
          const esConsumo = movimiento.tipo === "consumo_trabajo";
          const tipo = movimiento.tipo === "reversion_consumo_trabajo"
            ? "Reversión"
            : movimiento.esAdicional ? "Consumo adicional" : "Consumo";
          return `<article>
            <div><strong>${escapar(tipo)} · ${numero(movimiento.cantidadGramos).toLocaleString("es-CL")} g</strong><small>${escapar(bobinaMovimiento.nombre || bobinaMovimiento.materialNombre || "Bobina")} · ${escapar(formatearFecha(movimiento.fecha))}</small>${movimiento.nota ? `<p>${escapar(movimiento.nota)}</p>` : ""}</div>
            ${esConsumo && idsActivos.has(movimiento.id) ? `<div class="compact-actions">
              <button type="button" class="secondary compact-button" data-commercial-action="corregir-consumo" data-job-id="${escapar(trabajo.id)}" data-bobina-id="${escapar(bobinaMovimiento.id)}" data-movimiento-id="${escapar(movimiento.id)}">Corregir</button>
              <button type="button" class="secondary compact-button" data-commercial-action="revertir-consumo" data-job-id="${escapar(trabajo.id)}" data-bobina-id="${escapar(bobinaMovimiento.id)}" data-movimiento-id="${escapar(movimiento.id)}">Revertir</button>
            </div>` : ""}
          </article>`;
        }).join("")}</div>`
      : '<p class="empty-state compact-empty">Aún no se ha descontado material para este trabajo.</p>';
    const costoHistorico = numero(snapshot?.costoPorGramoUsado ?? snapshot?.costoPorGramo);

    return `<details><summary>Material e inventario</summary>
      <div class="job-detail-grid">
        ${detalleItem("Bobina asociada", bobina?.nombre || snapshot?.nombre || snapshot?.materialNombre || "Sin bobina")}
        ${detalleItem("Material", snapshot?.materialNombre || trabajo.datos?.material)}
        ${detalleItem("Marca", snapshot?.marca || bobina?.marca)}
        ${detalleItem("Color", snapshot?.colorNombre || bobina?.colorNombre)}
        ${detalleItem("Costo histórico", costoHistorico ? `${costoHistorico.toLocaleString("es-CL", { maximumFractionDigits: 4 })} ${snapshot?.monedaCompra || monedaTrabajo(trabajo)}/g` : "No registrado")}
        ${detalleItem("Consumo estimado", snapshot?.consumoEstimadoGramos ? `${numero(snapshot.consumoEstimadoGramos).toLocaleString("es-CL")} g` : "No registrado")}
        ${detalleItem("Consumo registrado", `${resumen.total.toLocaleString("es-CL")} g`)}
        ${detalleItem("Estado", resumen.estado)}
        ${detalleItem("Stock actual", bobina ? `${numero(bobina.pesoRestanteGramos).toLocaleString("es-CL")} g` : "Bobina no disponible")}
      </div>
      <div class="actions job-material-actions">
        ${tieneMaterialAsociado(trabajo) ? `<button type="button" data-commercial-action="consumo-material" data-job-id="${escapar(trabajo.id)}">Registrar consumo de material</button>` : ""}
        ${resumen.registrado ? `<button type="button" class="secondary" data-commercial-action="consumo-adicional" data-job-id="${escapar(trabajo.id)}">Agregar consumo adicional</button>` : ""}
      </div>
      ${historial}
    </details>`;
  }

  function renderizarDetalle(trabajo) {
    const panel = $("#trabajoDetallePanel");
    if (!panel || !trabajo) return;
    const moneda = monedaTrabajo(trabajo);
    const datos = trabajo.datos || {};
    const total = totalPagado(trabajo);
    const saldo = Math.max(0, precioCobro(trabajo) - total);
    const utilidad = utilidadReal(trabajo);
    const historial = Array.isArray(trabajo.historialEstados) ? trabajo.historialEstados : [];
    const clienteSnapshot = trabajo.clienteSnapshot || {};
    const clientes = window.ClientesPrecio3D?.obtenerClientes?.() || [];
    const opcionesClientes = clientes
      .sort((a, b) => a.nombre.localeCompare(b.nombre, "es", { sensitivity: "base" }))
      .map((cliente) => `<option value="${escapar(cliente.id)}" ${cliente.id === trabajo.clienteId ? "selected" : ""}>${escapar(cliente.nombre)}${cliente.empresa ? ` · ${escapar(cliente.empresa)}` : ""}</option>`)
      .join("");

    panel.hidden = false;
    panel.innerHTML = `
      <div class="job-detail__header">
        <div><p class="eyebrow">Detalle del trabajo</p><h3>${escapar(trabajo.nombreTrabajo)}</h3>${badgeEstado(trabajo.estado)}</div>
        <button type="button" class="secondary compact-button" data-commercial-action="cerrar-detalle">Cerrar</button>
      </div>
      <div class="job-detail-sections">
        <details open><summary>Resumen comercial</summary><div class="job-detail-grid">
          ${detalleItem("Número de cotización", trabajo.numeroCotizacion)}
          ${detalleItem("Precio cotizado", formatearMoneda(trabajo.precioFinal, moneda))}
          ${detalleItem("Precio vendido real", numero(trabajo.precioVendidoReal) > 0 ? formatearMoneda(trabajo.precioVendidoReal, moneda) : "No registrado")}
          ${detalleItem("Costo estimado", formatearMoneda(trabajo.costoTotal, moneda))}
          ${detalleItem("Costos adicionales", formatearMoneda(trabajo.costosAdicionalesReales, moneda))}
          ${detalleItem("Utilidad estimada", formatearMoneda(trabajo.utilidadObjetivo, moneda))}
          ${detalleItem("Utilidad real", utilidad === null ? "No registrada" : formatearMoneda(utilidad, moneda))}
          ${detalleItem("Margen real", margenReal(trabajo) === null ? "No registrado" : formatearPorcentaje(margenReal(trabajo)))}
          ${detalleItem("Total pagado", formatearMoneda(total, moneda))}
          ${detalleItem("Saldo pendiente", formatearMoneda(saldo, moneda))}
        </div></details>
        <details><summary>Cliente</summary><div class="job-detail-grid">
          ${detalleItem("Nombre", trabajo.cliente || clienteSnapshot.nombre)}${detalleItem("Contacto", clienteSnapshot.telefono || datos.contactoCliente)}
          ${detalleItem("Correo", clienteSnapshot.correo || datos.correoCliente)}${detalleItem("Empresa", clienteSnapshot.empresa || datos.empresaCliente)}
          ${detalleItem("RUT / ID", clienteSnapshot.rutIdFiscal || datos.rutCliente)}${detalleItem("Dirección", clienteSnapshot.direccion || datos.direccionCliente)}
        </div><div class="job-client-link">
          <label>Vincular con una ficha guardada<select id="clienteTrabajoVinculo"><option value="">Sin ficha vinculada</option>${opcionesClientes}</select></label>
          <button type="button" class="secondary" data-commercial-action="vincular-cliente" data-job-id="${escapar(trabajo.id)}">Guardar vínculo</button>
        </div></details>
        <details><summary>Producción</summary><div class="job-detail-grid">
          ${detalleItem("Material", datos.material)}${detalleItem("Peso", `${numero(datos.pesoPieza) + numero(datos.pesoSoportesPurga)} g`)}
          ${detalleItem("Cantidad", datos.cantidadProductos)}${detalleItem("Tiempo", `${numero(datos.horasImpresion).toFixed(2)} h`)}
          ${detalleItem("Impresora", datos.impresora)}${detalleItem("Modo", trabajo.modoUsado)}
        </div></details>
        ${renderizarMaterialInventario(trabajo)}
        <details><summary>Seguimiento</summary><div class="job-detail-grid">
          ${detalleItem("Fecha de creación", formatearFecha(trabajo.fechaCreacion))}
          ${detalleItem("Actualización", formatearFecha(trabajo.fechaActualizacion))}
          ${detalleItem("Aceptación", formatearFecha(trabajo.fechaAceptacion))}
          ${detalleItem("Fecha de pago", formatearFecha(trabajo.fechaPago))}
          ${detalleItem("Notas", trabajo.notasVenta || trabajo.descripcion)}
        </div><div class="job-timeline">${historial.map((entrada) => `<div><span></span><strong>${escapar(entrada.estado)}</strong><small>${escapar(formatearFecha(entrada.fecha))}${entrada.nota ? ` · ${escapar(entrada.nota)}` : ""}</small></div>`).join("")}</div></details>
      </div>
      <div class="actions job-detail-actions">
        <button type="button" data-commercial-action="cargar" data-job-id="${escapar(trabajo.id)}">Cargar y editar</button>
        <button type="button" class="secondary" data-commercial-action="cotizacion" data-job-id="${escapar(trabajo.id)}">Generar cotización</button>
        <button type="button" class="secondary" data-commercial-action="agregar-cotizacion" data-job-id="${escapar(trabajo.id)}">Agregar a cotización</button>
        <button type="button" class="secondary" data-commercial-action="venta" data-job-id="${escapar(trabajo.id)}">Registrar venta</button>
        <button type="button" class="secondary" data-commercial-action="pago" data-job-id="${escapar(trabajo.id)}">Registrar pago</button>
        ${tieneMaterialAsociado(trabajo) ? `<button type="button" class="secondary" data-commercial-action="consumo-material" data-job-id="${escapar(trabajo.id)}">Registrar consumo de material</button>` : ""}
        <button type="button" class="secondary" data-commercial-action="duplicar" data-job-id="${escapar(trabajo.id)}">Duplicar</button>
      </div>
    `;
  }

  function asegurarModal() {
    if ($("#jobCommercialModal")) return;
    const modal = document.createElement("div");
    modal.id = "jobCommercialModal";
    modal.className = "job-modal";
    modal.hidden = true;
    modal.innerHTML = `
      <div class="job-modal__backdrop" data-commercial-action="cerrar-modal"></div>
      <section class="job-modal__content" role="dialog" aria-modal="true" aria-labelledby="jobModalTitle">
        <button type="button" class="job-modal__close secondary" data-commercial-action="cerrar-modal">Cerrar</button>
        <h2 id="jobModalTitle"></h2>
        <div id="jobModalBody"></div>
      </section>
    `;
    document.body.appendChild(modal);
  }

  function abrirModal(titulo, contenido) {
    asegurarModal();
    const modal = $("#jobCommercialModal");
    elementoFocoAnterior = document.activeElement;
    $("#jobModalTitle").textContent = titulo;
    $("#jobModalBody").innerHTML = contenido;
    modal.hidden = false;
    document.body.classList.add("modal-open");
    modal.querySelector("#jobModalBody input, #jobModalBody select, #jobModalBody textarea")?.focus();
  }

  function cerrarModal() {
    const modal = $("#jobCommercialModal");
    if (!modal || modal.hidden) return;
    modal.hidden = true;
    document.body.classList.remove("modal-open");
    elementoFocoAnterior?.focus?.();
  }

  function opcionesBobinasConsumo(trabajo, soloBobinaId = "") {
    return (window.FilamentosPrecio3D?.obtenerBobinas?.() || [])
      .filter((bobina) => ["Sellada", "En uso"].includes(bobina.estado) && numero(bobina.pesoRestanteGramos) > 0 && (!soloBobinaId || bobina.id === soloBobinaId))
      .map((bobina) => `<option value="${escapar(bobina.id)}" ${bobina.id === trabajo.filamentoId ? "selected" : ""}>${escapar([bobina.materialNombre, bobina.marca, bobina.colorNombre].filter(Boolean).join(" · ") || bobina.nombre || "Bobina")} — ${escapar(numero(bobina.pesoRestanteGramos).toLocaleString("es-CL"))} g</option>`)
      .join("");
  }

  function consumoEstimado(trabajo) {
    const snapshot = trabajo.filamentoSnapshot || trabajo.datos?.filamentoSnapshot;
    if (numero(snapshot?.consumoEstimadoGramos) > 0) return numero(snapshot.consumoEstimadoGramos);
    const datos = trabajo.datos || {};
    return (numero(datos.pesoPieza) + numero(datos.pesoSoportesPurga)) * (1 + numero(datos.merma));
  }

  function abrirConsumoMaterial(trabajo, esAdicional = false) {
    const resumen = resumenConsumoInventario(trabajo);
    const opciones = opcionesBobinasConsumo(trabajo, resumen.registros.length ? trabajo.filamentoId : "");
    if (!opciones) {
      mostrarMensaje(resumen.registros.length
        ? "La bobina asociada no está disponible. Revierte los consumos existentes antes de cambiarla."
        : "No hay bobinas activas con stock disponible.", true);
      return;
    }
    if (!esAdicional && resumen.consumosActivos.some(({ movimiento }) => !movimiento.esAdicional)) {
      mostrarMensaje("Este trabajo ya tiene un consumo principal. Usa consumo adicional, corregir o revertir.", true);
      trabajoDetalleId = trabajo.id;
      renderizarDetalle(trabajo);
      return;
    }
    const estimado = consumoEstimado(trabajo);
    const hoy = new Date().toISOString().slice(0, 10);
    abrirModal(esAdicional ? "Agregar consumo adicional" : "Registrar consumo de material", `
      <form id="consumoTrabajoForm" data-job-id="${escapar(trabajo.id)}" data-adicional="${String(esAdicional)}">
        <p>El inventario solo se descontará cuando confirmes esta operación.</p>
        <div class="field-grid">
          <label class="field-wide">Bobina utilizada<select id="consumoBobinaId" required>${opciones}</select></label>
          <label>Consumo estimado<input type="number" value="${estimado}" disabled></label>
          <label>Consumo real en gramos<input id="consumoCantidad" type="number" min="0.01" step="0.01" required value="${estimado || ""}"></label>
          <label>Fecha<input id="consumoFecha" type="date" value="${hoy}"></label>
          <label class="field-wide">Nota${esAdicional ? " (obligatoria)" : ""}<textarea id="consumoNota" rows="3" ${esAdicional ? "required" : ""} placeholder="Ej: pieza fallida, repetición o ajuste de producción"></textarea></label>
        </div>
        <div id="consumoStockResumen" class="job-modal-summary" aria-live="polite"></div>
        <p class="help-text">Puedes reasignar la bobina antes del primer registro. El costo histórico de la cotización no cambiará.</p>
        <div class="actions"><button type="submit">Confirmar descuento</button><button type="button" class="secondary" data-commercial-action="cerrar-modal">Cancelar</button></div>
      </form>
    `);
    ["#consumoBobinaId", "#consumoCantidad"].forEach((selector) => $(selector)?.addEventListener("input", actualizarResumenModalConsumo));
    $("#consumoBobinaId")?.addEventListener("change", actualizarResumenModalConsumo);
    actualizarResumenModalConsumo();
  }

  function actualizarResumenModalConsumo() {
    const bobina = window.FilamentosPrecio3D?.obtenerBobinaPorId?.($("#consumoBobinaId")?.value || "");
    const cantidad = numero($("#consumoCantidad")?.value);
    const stock = numero(bobina?.pesoRestanteGramos);
    const resultante = stock - cantidad;
    const destino = $("#consumoStockResumen");
    if (!destino) return;
    destino.classList.toggle("warning-text", resultante < 0);
    destino.innerHTML = `${detalleItem("Stock actual", `${stock.toLocaleString("es-CL")} g`)}${detalleItem("Consumo real", `${cantidad.toLocaleString("es-CL")} g`)}${detalleItem("Stock resultante", resultante < 0 ? "No hay suficiente material" : `${resultante.toLocaleString("es-CL")} g`)}`;
  }

  function abrirReversionConsumo(trabajo, bobinaId, movimientoId) {
    const bobina = window.FilamentosPrecio3D?.obtenerBobinaPorId?.(bobinaId);
    const movimiento = bobina?.movimientos?.find((item) => item.id === movimientoId);
    if (!movimiento) return mostrarMensaje("No se encontró el consumo seleccionado.", true);
    abrirModal("Revertir consumo", `
      <form id="reversionConsumoForm" data-job-id="${escapar(trabajo.id)}" data-bobina-id="${escapar(bobinaId)}" data-movimiento-id="${escapar(movimientoId)}">
        <p>Se devolverán <strong>${numero(movimiento.cantidadGramos).toLocaleString("es-CL")} g</strong> a la bobina. El movimiento original se conservará.</p>
        <label>Motivo de la reversión<textarea id="reversionNota" rows="3" required></textarea></label>
        <div class="actions"><button type="submit">Confirmar reversión</button><button type="button" class="secondary" data-commercial-action="cerrar-modal">Cancelar</button></div>
      </form>
    `);
  }

  function abrirCorreccionConsumo(trabajo, bobinaId, movimientoId) {
    const bobina = window.FilamentosPrecio3D?.obtenerBobinaPorId?.(bobinaId);
    const movimiento = bobina?.movimientos?.find((item) => item.id === movimientoId);
    if (!movimiento) return mostrarMensaje("No se encontró el consumo seleccionado.", true);
    abrirModal("Corregir consumo", `
      <form id="correccionConsumoForm" data-job-id="${escapar(trabajo.id)}" data-bobina-id="${escapar(bobinaId)}" data-movimiento-id="${escapar(movimientoId)}" data-adicional="${String(Boolean(movimiento.esAdicional))}">
        <p>El registro de ${numero(movimiento.cantidadGramos).toLocaleString("es-CL")} g se revertirá y se creará uno nuevo, manteniendo la trazabilidad.</p>
        <label>Consumo corregido en gramos<input id="correccionCantidad" type="number" min="0.01" step="0.01" required value="${numero(movimiento.cantidadGramos)}"></label>
        <label>Motivo de la corrección<textarea id="correccionNota" rows="3" required></textarea></label>
        <div class="actions"><button type="submit">Guardar corrección</button><button type="button" class="secondary" data-commercial-action="cerrar-modal">Cancelar</button></div>
      </form>
    `);
  }

  function resumenVenta(trabajo) {
    const precio = numero($("#ventaPrecioReal")?.value);
    const adicionales = numero($("#ventaCostosAdicionales")?.value);
    const abono = numero($("#ventaMontoAbonado")?.value);
    const utilidad = precio - numero(trabajo.costoTotal) - adicionales;
    const margen = precio > 0 ? utilidad / precio : 0;
    const moneda = monedaTrabajo(trabajo);
    const destino = $("#ventaResumen");
    if (destino) destino.innerHTML = `${detalleItem("Saldo pendiente", formatearMoneda(Math.max(0, precio - abono), moneda))}${detalleItem("Utilidad real", formatearMoneda(utilidad, moneda))}${detalleItem("Margen real", formatearPorcentaje(margen))}`;
  }

  function abrirVenta(trabajo) {
    const hoy = new Date().toISOString().slice(0, 10);
    abrirModal("Registrar venta", `
      <form id="ventaTrabajoForm" data-job-id="${escapar(trabajo.id)}">
        <div class="field-grid">
          <label>Precio vendido real<input id="ventaPrecioReal" type="number" min="0" step="any" required value="${numero(trabajo.precioVendidoReal) || numero(trabajo.precioFinal)}"></label>
          <label>Costos adicionales reales<input id="ventaCostosAdicionales" type="number" min="0" step="any" value="${numero(trabajo.costosAdicionalesReales)}"></label>
          <label>Monto abonado<input id="ventaMontoAbonado" type="number" min="0" step="any" value="${numero(trabajo.montoAbonado)}"></label>
          <label>Fecha de venta<input id="ventaFecha" type="date" value="${escapar(trabajo.fechaVenta || hoy)}"></label>
          <label>Fecha de pago<input id="ventaFechaPago" type="date" value="${escapar(trabajo.fechaPago || "")}"></label>
          <label class="field-wide">Notas de venta<textarea id="ventaNotas" rows="3">${escapar(trabajo.notasVenta)}</textarea></label>
        </div>
        <div id="ventaResumen" class="job-modal-summary"></div>
        <div class="actions"><button type="submit">Confirmar venta</button><button type="button" class="secondary" data-commercial-action="cerrar-modal">Cancelar</button></div>
      </form>
    `);
    ["#ventaPrecioReal", "#ventaCostosAdicionales", "#ventaMontoAbonado"].forEach((selector) => $(selector)?.addEventListener("input", () => resumenVenta(trabajo)));
    resumenVenta(trabajo);
  }

  function abrirPago(trabajo) {
    const hoy = new Date().toISOString().slice(0, 10);
    const moneda = monedaTrabajo(trabajo);
    const pagado = totalPagado(trabajo);
    const saldo = Math.max(0, precioCobro(trabajo) - pagado);
    abrirModal("Registrar pago", `
      <form id="pagoTrabajoForm" data-job-id="${escapar(trabajo.id)}">
        <div class="job-modal-summary">${detalleItem("Total pagado", formatearMoneda(pagado, moneda))}${detalleItem("Saldo pendiente", formatearMoneda(saldo, moneda))}</div>
        <div class="field-grid">
          <label>Monto del pago<input id="pagoMonto" type="number" min="0" step="any" required value="${saldo || ""}"></label>
          <label>Fecha del pago<input id="pagoFecha" type="date" value="${hoy}"></label>
          <label>Método<select id="pagoMetodo"><option>Efectivo</option><option selected>Transferencia</option><option>Tarjeta</option><option>PayPal</option><option>Mercado Pago</option><option>Otro</option></select></label>
          <label class="field-wide">Nota<textarea id="pagoNota" rows="3"></textarea></label>
        </div>
        <div class="actions"><button type="submit">Guardar pago</button><button type="button" class="secondary" data-commercial-action="cerrar-modal">Cancelar</button></div>
      </form>
    `);
  }

  function abrirConfirmacionPagado(trabajo) {
    abrirModal("Pago completado", `
      <p>El saldo pendiente quedó en cero. Puedes marcar este trabajo como Pagado o conservar su estado actual.</p>
      <div class="actions">
        <button type="button" data-commercial-action="confirmar-pagado" data-job-id="${escapar(trabajo.id)}">Marcar como Pagado</button>
        <button type="button" class="secondary" data-commercial-action="cerrar-modal">Mantener estado</button>
      </div>
    `);
  }

  function mostrarMensaje(texto, error = false) {
    configuracion.mostrarMensaje?.(texto, error);
  }

  function buscarTrabajo(id) {
    return (window.StoragePrecio3D?.cargarTrabajos?.() || []).find((trabajo) => trabajo.id === id);
  }

  function renderizar() {
    const todos = window.StoragePrecio3D?.cargarTrabajos?.() || [];
    const filtros = obtenerFiltros();
    const filtrados = filtrarTrabajos(todos, filtros);
    renderizarIndicadores(filtrados, filtros);
    renderizarListado(filtrados, todos.length);
    if (trabajoDetalleId) {
      const detalle = todos.find((trabajo) => trabajo.id === trabajoDetalleId);
      if (detalle) renderizarDetalle(detalle);
      else $("#trabajoDetallePanel")?.setAttribute("hidden", "");
    }
  }

  function manejarClick(event) {
    const objetivo = event.target.closest("[data-commercial-action]");
    if (!objetivo) {
      const fila = event.target.closest("tr[data-job-id]");
      if (fila && !event.target.closest("button, select, summary, a, input")) {
        const trabajo = buscarTrabajo(fila.dataset.jobId);
        if (trabajo) {
          trabajoDetalleId = trabajo.id;
          renderizarDetalle(trabajo);
        }
      }
      return;
    }
    const accion = objetivo.dataset.commercialAction;
    const id = objetivo.dataset.jobId;
    const trabajo = id ? buscarTrabajo(id) : null;

    if (accion === "cerrar-modal") return cerrarModal();
    if (accion === "cerrar-detalle") {
      trabajoDetalleId = null;
      $("#trabajoDetallePanel").hidden = true;
      return;
    }
    if (!trabajo) return;

    if (accion === "confirmar-pagado") {
      const pagado = window.StoragePrecio3D?.cambiarEstadoTrabajo?.(id, "Pagado", "Saldo pagado");
      mostrarMensaje(pagado ? "Pago y estado actualizados." : "No se pudo actualizar el estado.", !pagado);
      cerrarModal();
      renderizar();
      return;
    }

    if (accion === "detalle") {
      trabajoDetalleId = id;
      renderizarDetalle(trabajo);
      $("#trabajoDetallePanel")?.scrollIntoView({ behavior: "smooth", block: "start" });
    } else if (accion === "cargar") {
      configuracion.cargarTrabajo?.(trabajo);
    } else if (accion === "cotizacion") {
      configuracion.generarCotizacion?.(trabajo);
    } else if (accion === "agregar-cotizacion") {
      configuracion.agregarACotizacion?.(trabajo);
    } else if (accion === "venta") {
      abrirVenta(trabajo);
    } else if (accion === "pago") {
      abrirPago(trabajo);
    } else if (accion === "consumo-material") {
      abrirConsumoMaterial(trabajo, false);
    } else if (accion === "consumo-adicional") {
      abrirConsumoMaterial(trabajo, true);
    } else if (accion === "revertir-consumo") {
      abrirReversionConsumo(trabajo, objetivo.dataset.bobinaId, objetivo.dataset.movimientoId);
    } else if (accion === "corregir-consumo") {
      abrirCorreccionConsumo(trabajo, objetivo.dataset.bobinaId, objetivo.dataset.movimientoId);
    } else if (accion === "ver-consumos") {
      cerrarModal();
      trabajoDetalleId = id;
      renderizarDetalle(trabajo);
      $("#trabajoDetallePanel")?.scrollIntoView({ behavior: "smooth", block: "start" });
    } else if (accion === "eliminar-manteniendo-consumos") {
      const eliminado = window.StoragePrecio3D?.eliminarTrabajo?.(id);
      mostrarMensaje(eliminado ? "Trabajo eliminado. Los movimientos de inventario se conservaron." : "No se pudo eliminar el trabajo.", !eliminado);
      cerrarModal();
      renderizar();
    } else if (accion === "vincular-cliente") {
      const clienteId = $("#clienteTrabajoVinculo")?.value || "";
      const cliente = window.ClientesPrecio3D?.obtenerClientePorId?.(clienteId);
      const actualizado = window.StoragePrecio3D?.actualizarTrabajo?.(id, {
        clienteId: cliente?.id || "",
        cliente: cliente?.nombre || trabajo.cliente,
        clienteSnapshot: cliente ? window.ClientesPrecio3D?.crearSnapshot?.(cliente) : trabajo.clienteSnapshot
      });
      mostrarMensaje(actualizado ? "Cliente vinculado al trabajo." : "No se pudo actualizar el vínculo.", !actualizado);
      renderizar();
    } else if (accion === "duplicar") {
      const duplicado = window.StoragePrecio3D?.duplicarTrabajo?.(id);
      mostrarMensaje(duplicado ? "Trabajo duplicado." : "No se pudo duplicar el trabajo.", !duplicado);
      renderizar();
    } else if (accion === "eliminar") {
      const tieneConsumos = movimientosInventarioTrabajo(id).length > 0;
      if (tieneConsumos) {
        abrirModal("Trabajo con consumo de inventario", `
          <p>Este trabajo tiene movimientos de inventario registrados. Eliminarlo no devolverá automáticamente el material.</p>
          <div class="actions">
            <button type="button" data-commercial-action="ver-consumos" data-job-id="${escapar(id)}">Ver y revertir consumos</button>
            <button type="button" class="danger-button" data-commercial-action="eliminar-manteniendo-consumos" data-job-id="${escapar(id)}">Eliminar manteniendo movimientos</button>
            <button type="button" class="secondary" data-commercial-action="cerrar-modal">Cancelar</button>
          </div>
        `);
      } else if (confirm("¿Seguro que quieres eliminar este trabajo?")) {
        const eliminado = window.StoragePrecio3D?.eliminarTrabajo?.(id);
        mostrarMensaje(eliminado ? "Trabajo eliminado." : "No se pudo eliminar el trabajo.", !eliminado);
        renderizar();
      }
    }
  }

  function manejarCambio(event) {
    if (event.target.matches("[data-commercial-action='estado']")) {
      const actualizado = window.StoragePrecio3D?.cambiarEstadoTrabajo?.(event.target.dataset.jobId, event.target.value);
      mostrarMensaje(actualizado ? "Estado e historial actualizados." : "No se pudo actualizar el estado.", !actualizado);
      if (actualizado && ["En producción", "Terminado"].includes(event.target.value) && !resumenConsumoInventario(actualizado).registrado && tieneMaterialAsociado(actualizado)) {
        mostrarMensaje("Recuerda registrar el consumo de material cuando conozcas el uso real.");
      }
      renderizar();
    }
  }

  function manejarSubmit(event) {
    if (event.target.id === "ventaTrabajoForm") {
      event.preventDefault();
      const actualizado = window.StoragePrecio3D?.registrarVenta?.(event.target.dataset.jobId, {
        precioVendidoReal: $("#ventaPrecioReal").value,
        costosAdicionalesReales: $("#ventaCostosAdicionales").value,
        montoAbonado: $("#ventaMontoAbonado").value,
        fechaVenta: $("#ventaFecha").value,
        fechaPago: $("#ventaFechaPago").value,
        notasVenta: $("#ventaNotas").value
      });
      mostrarMensaje(actualizado ? "Venta registrada." : "No se pudo registrar la venta.", !actualizado);
      if (actualizado) cerrarModal();
      renderizar();
    }

    if (event.target.id === "pagoTrabajoForm") {
      event.preventDefault();
      const actualizado = window.StoragePrecio3D?.registrarPago?.(event.target.dataset.jobId, {
        monto: $("#pagoMonto").value,
        fecha: $("#pagoFecha").value,
        metodo: $("#pagoMetodo").value,
        nota: $("#pagoNota").value
      });
      mostrarMensaje(actualizado ? "Pago registrado." : "No se pudo registrar el pago.", !actualizado);
      if (actualizado) {
        cerrarModal();
        if (actualizado.saldoPendiente <= 0 && actualizado.estado !== "Pagado") {
          abrirConfirmacionPagado(actualizado);
        }
      }
      renderizar();
    }

    if (event.target.id === "consumoTrabajoForm") {
      event.preventDefault();
      const trabajo = buscarTrabajo(event.target.dataset.jobId);
      const bobinaId = $("#consumoBobinaId")?.value || "";
      const cantidad = numero($("#consumoCantidad")?.value);
      const esAdicional = event.target.dataset.adicional === "true";
      if (!trabajo || !bobinaId || cantidad <= 0) return mostrarMensaje("Revisa la bobina y el consumo ingresado.", true);
      if (!esAdicional && resumenConsumoInventario(trabajo).consumosActivos.some(({ movimiento }) => !movimiento.esAdicional)) {
        return mostrarMensaje("El consumo principal ya está registrado.", true);
      }
      if (!confirm(`Se descontarán ${cantidad.toLocaleString("es-CL")} g del inventario. ¿Confirmas?`)) return;
      const boton = event.submitter;
      if (boton) boton.disabled = true;
      const fueReasignada = Boolean(trabajo.filamentoId && trabajo.filamentoId !== bobinaId);
      const notaUsuario = $("#consumoNota")?.value || "";
      const notaMovimiento = fueReasignada
        ? `Bobina reasignada desde ${trabajo.filamentoId}. ${notaUsuario}`.trim()
        : notaUsuario;
      const resultado = window.FilamentosPrecio3D?.registrarConsumoTrabajo?.(bobinaId, trabajo, {
        cantidadGramos: cantidad,
        fecha: $("#consumoFecha")?.value,
        nota: notaMovimiento,
        esAdicional
      });
      if (!resultado?.ok) {
        if (boton) boton.disabled = false;
        return mostrarMensaje(resultado?.error || "No se pudo registrar el consumo.", true);
      }
      const actualizado = sincronizarConsumoTrabajo(trabajo.id, bobinaId);
      mostrarMensaje(actualizado ? "Consumo de material registrado." : "El stock cambió, pero no se pudo actualizar el resumen del trabajo.", !actualizado);
      cerrarModal();
      renderizar();
    }

    if (event.target.id === "reversionConsumoForm") {
      event.preventDefault();
      const { jobId, bobinaId, movimientoId } = event.target.dataset;
      if (!confirm("El material volverá al stock y se conservará la trazabilidad. ¿Confirmas?")) return;
      const resultado = window.FilamentosPrecio3D?.revertirConsumoTrabajo?.(bobinaId, movimientoId, {
        nota: $("#reversionNota")?.value
      });
      if (!resultado?.ok) return mostrarMensaje(resultado?.error || "No se pudo revertir el consumo.", true);
      sincronizarConsumoTrabajo(jobId, bobinaId);
      mostrarMensaje("Consumo revertido y stock restaurado.");
      cerrarModal();
      renderizar();
    }

    if (event.target.id === "correccionConsumoForm") {
      event.preventDefault();
      const { jobId, bobinaId, movimientoId } = event.target.dataset;
      const trabajo = buscarTrabajo(jobId);
      const cantidad = numero($("#correccionCantidad")?.value);
      const nota = $("#correccionNota")?.value || "";
      if (!trabajo || cantidad <= 0) return mostrarMensaje("Ingresa un consumo corregido válido.", true);
      if (!confirm("Se revertirá el registro anterior y se guardará el consumo corregido. ¿Confirmas?")) return;
      const reversion = window.FilamentosPrecio3D?.revertirConsumoTrabajo?.(bobinaId, movimientoId, { nota: `Corrección: ${nota}` });
      if (!reversion?.ok) return mostrarMensaje(reversion?.error || "No se pudo revertir el consumo anterior.", true);
      const nuevo = window.FilamentosPrecio3D?.registrarConsumoTrabajo?.(bobinaId, trabajo, {
        cantidadGramos: cantidad,
        nota: `Consumo corregido: ${nota}`,
        esAdicional: event.target.dataset.adicional === "true"
      });
      sincronizarConsumoTrabajo(jobId, bobinaId);
      if (!nuevo?.ok) {
        mostrarMensaje(`El consumo anterior fue revertido, pero el nuevo no pudo registrarse: ${nuevo?.error || "error desconocido"}`, true);
      } else {
        mostrarMensaje("Consumo corregido con trazabilidad completa.");
      }
      cerrarModal();
      renderizar();
    }
  }

  function aplicarFlujo(flujo) {
    window.StoragePrecio3D?.guardarFlujoTrabajos?.(flujo);
    document.querySelectorAll("[data-jobs-flow]").forEach((boton) => {
      const activo = boton.dataset.jobsFlow === flujo;
      boton.classList.toggle("active", activo);
      boton.setAttribute("aria-pressed", String(activo));
    });
    const selector = $("#trabajoEstado");
    if (selector) {
      const actual = selector.value;
      const estados = flujo === "completo" ? ESTADOS_COMPLETOS : ESTADOS_SIMPLES;
      selector.innerHTML = estados.map((estado) => `<option value="${estado}">${estado}</option>`).join("");
      selector.value = estados.includes(actual) ? actual : "Pendiente";
    }
    renderizar();
  }

  function inicializar(opciones = {}) {
    configuracion = { ...configuracion, ...opciones };
    if (inicializado) {
      renderizar();
      return;
    }
    inicializado = true;
    asegurarModal();
    $("#trabajosListado")?.addEventListener("click", manejarClick);
    $("#trabajosListado")?.addEventListener("change", manejarCambio);
    $("#trabajoDetallePanel")?.addEventListener("click", manejarClick);
    $("#jobCommercialModal")?.addEventListener("click", manejarClick);
    $("#jobCommercialModal")?.addEventListener("submit", manejarSubmit);
    $("#trabajosFiltros")?.addEventListener("input", renderizar);
    $("#trabajosFiltros")?.addEventListener("change", renderizar);
    $("#trabajosFlowControl")?.addEventListener("click", (event) => {
      const boton = event.target.closest("[data-jobs-flow]");
      if (boton) aplicarFlujo(boton.dataset.jobsFlow);
    });
    document.addEventListener("keydown", (event) => {
      const modal = $("#jobCommercialModal");
      if (event.key === "Escape" && !modal?.hidden) {
        cerrarModal();
        return;
      }

      if (event.key === "Tab" && !modal?.hidden) {
        const enfocables = Array.from(
          modal.querySelectorAll('button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [href]')
        ).filter((elemento) => elemento.offsetParent !== null);
        const primero = enfocables[0];
        const ultimo = enfocables.at(-1);
        if (event.shiftKey && document.activeElement === primero) {
          event.preventDefault();
          ultimo?.focus();
        } else if (!event.shiftKey && document.activeElement === ultimo) {
          event.preventDefault();
          primero?.focus();
        }
      }
    });
    aplicarFlujo(window.StoragePrecio3D?.cargarFlujoTrabajos?.() || "simple");
  }

  window.PanelTrabajosPrecio3D = {
    inicializar,
    renderizar,
    filtrarTrabajos,
    calcularIndicadores,
    totalPagado,
    utilidadReal,
    margenReal
  };
})();

// Editor y listado de cotizaciones comerciales.
(function () {
  "use strict";

  let opciones = {};
  let cotizacionActual = null;
  let inicializado = false;
  let temporizadorBusquedaHistorial = 0;
  const filtrosHistorial = {
    busqueda: "",
    estado: "todos",
    periodo: "todas",
    orden: "recientes"
  };

  const $ = (selector, raiz = document) => raiz.querySelector(selector);
  const numero = (valor) => Number.isFinite(Number(valor)) ? Number(valor) : 0;
  const t = (clave, reemplazos = {}) =>
    window.obtenerTextoI18n?.(clave, reemplazos) || clave;
  const idioma = () => document.documentElement.lang || "es";
  const claveEstado = (estado) => ({
    Borrador: "borrador", Enviada: "enviada", Aceptada: "aceptada",
    Rechazada: "rechazada", Vencida: "vencida", "Convertida en trabajo": "convertidaTrabajo"
  }[estado]);
  const estadoVisible = (estado) => t(claveEstado(estado) || "estado");
  const claveTipo = (tipo) => ({
    "Impresión 3D": "tipoImpresion3d", Diseño: "tipoDiseno", Postprocesado: "tipoPostprocesado",
    Embalaje: "embalaje", Envío: "envio", "Material adicional": "tipoMaterialAdicional",
    Servicio: "tipoServicio", "Descuento de línea": "tipoDescuentoLinea", Otro: "otro"
  }[tipo]);
  const tipoVisible = (tipo) => t(claveTipo(tipo) || "otro");
  const origenVisible = (origen) => t({
    calculo: "origenCalculo",
    trabajo: "origenTrabajo",
    manual: "origenManual"
  }[origen] || "origenManual");
  const escapar = (valor) => String(valor ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

  function moneda(valor, codigo) {
    if (opciones.formatearMoneda) return opciones.formatearMoneda(numero(valor), codigo || cotizacionActual?.moneda || "CLP", true);
    return new Intl.NumberFormat("es-CL", { style: "currency", currency: codigo || "CLP" }).format(numero(valor));
  }

  function fecha(valor) {
    if (!valor) return t("sinFecha");
    return new Intl.DateTimeFormat(idioma(), { dateStyle: "medium" }).format(new Date(valor));
  }

  function descargar(nombre, contenido, tipo = "application/json;charset=utf-8") {
    const blob = new Blob([contenido], { type: tipo });
    const enlace = document.createElement("a");
    enlace.href = URL.createObjectURL(blob);
    enlace.download = nombre;
    enlace.click();
    setTimeout(() => URL.revokeObjectURL(enlace.href), 1000);
  }

  function mensaje(texto, error = false) {
    const elemento = $("#cotizacionMessage");
    if (!elemento) return;
    elemento.textContent = texto;
    elemento.classList.toggle("error-message", error);
    elemento.classList.toggle("success-message", !error && Boolean(texto));
  }

  function clientes() {
    return window.ClientesPrecio3D?.obtenerClientes?.() || [];
  }

  function cotizacionActualEstaGuardada() {
    if (!cotizacionActual?.id) return false;
    return window.CotizacionesPrecio3D?.cargarCotizaciones?.()
      .some((cotizacion) => cotizacion.id === cotizacionActual.id) || false;
  }

  function snapshotCliente(cliente) {
    return cliente ? window.ClientesPrecio3D?.crearSnapshot?.(cliente) || { ...cliente } : null;
  }

  function snapshotDesdeFormulario() {
    const datos = opciones.obtenerDatosCliente?.() || {};
    if (!datos.clienteCotizacion && !datos.empresaCliente && !datos.correoCliente) return null;
    return {
      nombre: datos.clienteCotizacion || "",
      empresa: datos.empresaCliente || "",
      rutIdFiscal: datos.rutCliente || "",
      telefono: datos.contactoCliente || "",
      correo: datos.correoCliente || "",
      direccion: datos.direccionCliente || ""
    };
  }

  function asegurarActual(datos = {}) {
    if (cotizacionActual?.estado === "Convertida en trabajo") {
      cotizacionActual = null;
    }
    if (cotizacionActual) return cotizacionActual;
    const configuracion = opciones.obtenerCondiciones?.() || {};
    const clienteFormulario = opciones.obtenerDatosCliente?.() || {};
    cotizacionActual = window.CotizacionesPrecio3D.crearCotizacion({
      datosNegocio: opciones.obtenerDatosNegocio?.() || {},
      clienteId: datos.clienteId || clienteFormulario.clienteId || "",
      snapshotCliente: datos.snapshotCliente || clienteFormulario.snapshotCliente || snapshotDesdeFormulario(),
      moneda: datos.moneda || "CLP",
      validezDias: configuracion.validezCotizacionDias ?? 7,
      tiempoEntrega: configuracion.tiempoEntrega || t("tiempoEntregaCoordinar"),
      condicionesPago: configuracion.condicionesPago || "",
      observaciones: configuracion.observacionesCotizacion || ""
    });
    window.CotizacionesPrecio3D.establecerActiva(cotizacionActual.id);
    return cotizacionActual;
  }

  function opcionesClientes(seleccionado = "") {
    return [
      `<option value="">${escapar(t("clienteSinFicha"))}</option>`,
      ...clientes()
        .sort((a, b) => a.nombre.localeCompare(b.nombre, "es"))
        .map((cliente) => `<option value="${escapar(cliente.id)}" ${cliente.id === seleccionado ? "selected" : ""}>${escapar(cliente.nombre)}${cliente.empresa ? ` · ${escapar(cliente.empresa)}` : ""}</option>`)
    ].join("");
  }

  function opcionesTipos(seleccionado = "Otro") {
    return window.CotizacionesPrecio3D.TIPOS
      .map((tipo) => `<option value="${escapar(tipo)}" ${tipo === seleccionado ? "selected" : ""}>${escapar(tipoVisible(tipo))}</option>`)
      .join("");
  }

  function opcionesEstados(seleccionado) {
    return window.CotizacionesPrecio3D.ESTADOS
      .map((estado) => `<option value="${escapar(estado)}" ${estado === seleccionado ? "selected" : ""}>${escapar(estadoVisible(estado))}</option>`)
      .join("");
  }

  function filaItem(item, indice, total) {
    return `
      <tr data-quote-item-id="${escapar(item.id)}">
        <td><strong>${escapar(item.descripcion)}</strong><small>${escapar(tipoVisible(item.tipo))} · ${escapar(origenVisible(item.origen))}${item.detalle ? `<br>${escapar(item.detalle)}` : ""}</small></td>
        <td>${item.cantidad}</td>
        <td>${moneda(item.precioUnitario)}</td>
        <td><strong>${item.tipo === "Descuento de línea" ? "−" : ""}${moneda(item.totalLinea)}</strong></td>
        <td>
          <div class="quote-item-actions">
            <button type="button" class="secondary compact-button" data-quote-action="editar-item" title="${escapar(t("editar"))}">${escapar(t("editar"))}</button>
            <button type="button" class="secondary compact-button" data-quote-action="duplicar-item" title="${escapar(t("duplicar"))}">${escapar(t("duplicar"))}</button>
            <button type="button" class="secondary compact-button" data-quote-action="subir-item" ${indice === 0 ? "disabled" : ""} aria-label="${escapar(t("subir"))}: ${escapar(item.descripcion)}">↑</button>
            <button type="button" class="secondary compact-button" data-quote-action="bajar-item" ${indice === total - 1 ? "disabled" : ""} aria-label="${escapar(t("bajar"))}: ${escapar(item.descripcion)}">↓</button>
            <button type="button" class="secondary danger-button compact-button" data-quote-action="eliminar-item">${escapar(t("eliminar"))}</button>
          </div>
        </td>
      </tr>`;
  }

  function tarjetaItem(item, indice, total) {
    return `
      <article class="quote-item-card" data-quote-item-id="${escapar(item.id)}">
        <div><span>${escapar(tipoVisible(item.tipo))}</span><strong>${escapar(item.descripcion)}</strong><small>${escapar(item.detalle || origenVisible(item.origen))}</small></div>
        <dl><div><dt>${escapar(t("cantidad"))}</dt><dd>${item.cantidad}</dd></div><div><dt>${escapar(t("precioUnitario"))}</dt><dd>${moneda(item.precioUnitario)}</dd></div><div><dt>${escapar(t("total"))}</dt><dd>${item.tipo === "Descuento de línea" ? "−" : ""}${moneda(item.totalLinea)}</dd></div></dl>
        <div class="quote-item-actions">
          <button type="button" class="secondary compact-button" data-quote-action="editar-item">${escapar(t("editar"))}</button>
          <button type="button" class="secondary compact-button" data-quote-action="duplicar-item">${escapar(t("duplicar"))}</button>
          <button type="button" class="secondary compact-button" data-quote-action="subir-item" ${indice === 0 ? "disabled" : ""} aria-label="${escapar(t("subir"))}">↑</button>
          <button type="button" class="secondary compact-button" data-quote-action="bajar-item" ${indice === total - 1 ? "disabled" : ""} aria-label="${escapar(t("bajar"))}">↓</button>
          <button type="button" class="secondary danger-button compact-button" data-quote-action="eliminar-item">${escapar(t("eliminar"))}</button>
        </div>
      </article>`;
  }

  function renderizarItems() {
    const contenedor = $("#quoteItemsEditor");
    if (!contenedor || !cotizacionActual) return;
    const items = cotizacionActual.items;
    if (!items.length) {
      contenedor.innerHTML = `
        <div class="quote-items-empty">
          <strong>${escapar(t("sinItemsCotizacion"))}</strong>
          <p>${escapar(t("sinItemsCotizacionAyuda"))}</p>
          <div class="actions">
            <button type="button" data-quote-action="agregar-calculo">${escapar(t("agregarCalculoActual"))}</button>
            <button type="button" class="secondary" data-quote-action="mostrar-item-form">${escapar(t("agregarProductoServicio"))}</button>
          </div>
        </div>`;
      actualizarBotonesVista();
      return;
    }
    contenedor.innerHTML = `
      <div class="quote-items-table-wrap">
        <table class="quote-items-table"><thead><tr><th>${escapar(t("descripcion"))}</th><th>${escapar(t("cantidad"))}</th><th>${escapar(t("precioUnitario"))}</th><th>${escapar(t("total"))}</th><th>${escapar(t("acciones"))}</th></tr></thead><tbody>${items.map((item, indice) => filaItem(item, indice, items.length)).join("")}</tbody></table>
      </div>
      <div class="quote-items-cards">${items.map((item, indice) => tarjetaItem(item, indice, items.length)).join("")}</div>`;
    actualizarBotonesVista();
  }

  function renderizarTotales() {
    const contenedor = $("#quoteTotalsSummary");
    if (!contenedor || !cotizacionActual) return;
    const total = window.CotizacionesPrecio3D.calcularTotales(cotizacionActual);
    cotizacionActual = window.CotizacionesPrecio3D.normalizarCotizacion({ ...cotizacionActual, ...total });
    contenedor.innerHTML = `
      <dl class="quote-totals-list">
        <div><dt>${escapar(t("subtotal"))}</dt><dd>${moneda(total.subtotal)}</dd></div>
        ${total.descuentoTotal > 0 ? `<div><dt>${escapar(t("descuento"))}</dt><dd>−${moneda(total.descuentoTotal)}</dd></div>` : ""}
        ${total.envio > 0 ? `<div><dt>${escapar(t("envio"))}</dt><dd>${moneda(total.envio)}</dd></div>` : ""}
        <div class="quote-total-final"><dt>${escapar(t("totalFinal"))}</dt><dd>${moneda(total.totalFinal)}</dd></div>
        ${total.montoAbono > 0 ? `<div><dt>${escapar(t("abonoRequerido"))}</dt><dd>${moneda(total.montoAbono)}</dd></div><div><dt>${escapar(t("saldo"))}</dt><dd>${moneda(total.saldo)}</dd></div>` : ""}
      </dl>
      ${total.descuentoExcedeSubtotal ? `<p class="warning-message">${escapar(t("descuentoSuperaSubtotal"))}</p>` : ""}
      <p class="help-text">${escapar(cotizacionActual.items.every((item) => item.precioIncluyeImpuesto) ? t("impuestosIncluidosComerciales") : t("revisarLineasSinImpuesto"))}</p>`;
  }

  function renderizarEditor() {
    const panel = $("#cotizacionClientePanel");
    if (!panel || !cotizacionActual) return;
    let editor = $("#quoteCommercialEditor");
    if (!editor) {
      editor = document.createElement("div");
      editor.id = "quoteCommercialEditor";
      editor.className = "quote-commercial-editor";
      panel.querySelector(".quote-finalize-card")?.before(editor);
    }

    editor.innerHTML = `
      <section class="quote-editor-block quote-editor-header" aria-labelledby="quoteMainInfoTitle">
        <div class="quote-editor-title">
          <div>
            <p class="eyebrow">${escapar(t("borradorComercial"))}</p>
            <h3 id="quoteMainInfoTitle">${escapar(t("informacionPrincipal"))}</h3>
          </div>
          <div class="quote-editor-identity">
            <span class="quote-number">${escapar(cotizacionActual.numeroCotizacion)}</span>
            <span class="quote-status-badge">${escapar(estadoVisible(cotizacionActual.estado))}</span>
          </div>
        </div>
        <div class="field-grid quote-main-fields">
          <label>${escapar(t("clienteGuardado"))}<select id="quoteClienteId">${opcionesClientes(cotizacionActual.clienteId)}</select></label>
          <label>${escapar(t("fecha"))}<input type="text" value="${escapar(fecha(cotizacionActual.fechaCreacion))}" readonly></label>
          <label>${escapar(t("validezCotizacionDias"))}<input type="number" id="quoteValidez" min="0" value="${cotizacionActual.validezDias}"></label>
          <label>${escapar(t("estado"))}<select id="quoteEstado">${opcionesEstados(cotizacionActual.estado)}</select></label>
        </div>
        <div class="actions quote-save-actions">
          <button type="button" data-quote-action="guardar">${escapar(t("guardarBorrador"))}</button>
        </div>
      </section>

      <div class="quote-editor-commerce-grid">
        <section class="quote-editor-block quote-products-editor" aria-labelledby="quoteProductsTitle">
          <div class="quote-editor-section-heading"><div><h3 id="quoteProductsTitle">${escapar(t("productosServicios"))}</h3><p>${escapar(t("productosServiciosAyuda"))}</p></div><div class="actions"><button type="button" data-quote-action="agregar-calculo">${escapar(t("agregarCalculoActual"))}</button><button type="button" class="secondary" data-quote-action="mostrar-item-form">${escapar(t("agregarProductoServicio"))}</button></div></div>
          <div id="quoteItemsEditor"></div>
          <form id="quoteItemForm" class="quote-item-form" hidden>
            <input type="hidden" id="quoteItemId">
            <div class="field-grid">
              <label>${escapar(t("tipo"))}<select id="quoteItemTipo">${opcionesTipos()}</select></label>
              <label>${escapar(t("descripcion"))}<input type="text" id="quoteItemDescripcion" required></label>
              <label class="field-wide">${escapar(t("detalleOpcional"))}<textarea id="quoteItemDetalle" rows="2"></textarea></label>
              <label>${escapar(t("cantidad"))}<input type="number" id="quoteItemCantidad" min="0" step="any" value="1" required></label>
              <label>${escapar(t("precioUnitario"))}<input type="number" id="quoteItemPrecio" min="0" step="any" value="0" required></label>
            </div>
            <div class="actions"><button type="submit">${escapar(t("guardarLinea"))}</button><button type="button" class="secondary" data-quote-action="cancelar-item">${escapar(t("cancelar"))}</button></div>
          </form>
        </section>

        <aside class="quote-editor-block quote-commercial-totals" aria-labelledby="quoteTotalsTitle">
          <div>
            <h3 id="quoteTotalsTitle">${escapar(t("resumenComercial"))}</h3>
            <p class="help-text">${escapar(t("resumenComercialAyuda"))}</p>
          </div>
          <div class="field-grid quote-total-controls">
            <label>${escapar(t("descuento"))}<select id="quoteDescuentoTipo"><option value="sin" ${cotizacionActual.descuento.tipo === "sin" ? "selected" : ""}>${escapar(t("sinDescuento"))}</option><option value="porcentaje" ${cotizacionActual.descuento.tipo === "porcentaje" ? "selected" : ""}>${escapar(t("porcentaje"))}</option><option value="monto" ${cotizacionActual.descuento.tipo === "monto" ? "selected" : ""}>${escapar(t("montoFijo"))}</option></select></label>
            <label>${escapar(t("valorDescuento"))}<input type="number" id="quoteDescuentoValor" min="0" step="any" value="${cotizacionActual.descuento.valor}"></label>
            <label>${escapar(t("envioAdicional"))}<input type="number" id="quoteEnvio" min="0" step="any" value="${cotizacionActual.envio}"></label>
            <label>${escapar(t("abono"))}<select id="quoteAbonoTipo"><option value="sin" ${cotizacionActual.tipoAbono === "sin" ? "selected" : ""}>${escapar(t("sinAbono"))}</option><option value="porcentaje" ${cotizacionActual.tipoAbono === "porcentaje" ? "selected" : ""}>${escapar(t("porcentaje"))}</option><option value="monto" ${cotizacionActual.tipoAbono === "monto" ? "selected" : ""}>${escapar(t("montoFijo"))}</option></select></label>
            <label>${escapar(t("porcentajeAbono"))}<input type="number" id="quoteAbonoPorcentaje" min="0" max="100" step="any" value="${cotizacionActual.porcentajeAbono}"></label>
            <label>${escapar(t("montoAbono"))}<input type="number" id="quoteAbonoMonto" min="0" step="any" value="${cotizacionActual.montoAbono}"></label>
          </div>
          <div id="quoteTotalsSummary" class="quote-totals-summary"></div>
        </aside>
      </div>

      <details class="quote-editor-block quote-conditions-editor">
        <summary>${escapar(t("condicionesObservaciones"))}</summary>
        <div class="field-grid">
          <label>${escapar(t("tiempoEntrega"))}<input type="text" id="quoteTiempoEntrega" value="${escapar(cotizacionActual.tiempoEntrega)}"></label>
          <label class="field-wide">${escapar(t("condicionesPago"))}<textarea id="quoteCondicionesPago" rows="3">${escapar(cotizacionActual.condicionesPago)}</textarea></label>
          <label class="field-wide">${escapar(t("observaciones"))}<textarea id="quoteObservaciones" rows="3">${escapar(cotizacionActual.observaciones)}</textarea></label>
        </div>
      </details>`;

    renderizarItems();
    renderizarTotales();
    actualizarBotonesVista();
  }

  function leerEditor() {
    if (!cotizacionActual) return null;
    const clienteId = $("#quoteClienteId")?.value || cotizacionActual.clienteId;
    const cliente = window.ClientesPrecio3D?.obtenerClientePorId?.(clienteId);
    let actualizada = {
      ...cotizacionActual,
      clienteId,
      snapshotCliente: cliente ? snapshotCliente(cliente) : cotizacionActual.snapshotCliente,
      validezDias: numero($("#quoteValidez")?.value),
      descuento: {
        tipo: $("#quoteDescuentoTipo")?.value || "sin",
        valor: numero($("#quoteDescuentoValor")?.value)
      },
      envio: numero($("#quoteEnvio")?.value),
      tipoAbono: $("#quoteAbonoTipo")?.value || "sin",
      porcentajeAbono: numero($("#quoteAbonoPorcentaje")?.value),
      montoAbono: numero($("#quoteAbonoMonto")?.value),
      tiempoEntrega: $("#quoteTiempoEntrega")?.value || cotizacionActual.tiempoEntrega,
      condicionesPago: $("#quoteCondicionesPago")?.value || "",
      observaciones: $("#quoteObservaciones")?.value || "",
      datosNegocio: { ...(cotizacionActual.datosNegocio || {}) }
    };
    const estado = $("#quoteEstado")?.value;
    if (estado && estado !== cotizacionActual.estado) {
      actualizada = window.CotizacionesPrecio3D.cambiarEstado(actualizada, estado, "Estado actualizado desde el editor");
    }
    cotizacionActual = window.CotizacionesPrecio3D.normalizarCotizacion(actualizada);
    return cotizacionActual;
  }

  function guardarActual(mostrar = true) {
    leerEditor();
    if (!cotizacionActual?.items.length) {
      if (mostrar) mensaje(t("agregaLineaAntesGuardar"), true);
      return null;
    }
    const guardada = window.CotizacionesPrecio3D.guardarCotizacion(cotizacionActual);
    if (guardada) {
      cotizacionActual = guardada;
      renderizarEditor();
      renderizarListado();
      if (mostrar) mensaje(t("cotizacionGuardadaCorrectamente"));
    }
    return guardada;
  }

  function nuevaCotizacion() {
    cotizacionActual = null;
    asegurarActual();
    renderizarEditor();
    const vista = $("#cotizacionClienteVista");
    if (vista) { vista.hidden = true; vista.innerHTML = ""; }
    mensaje(t("nuevaCotizacionEditorPreparada"));
    return cotizacionActual;
  }

  function agregarCalculoActual() {
    const calculo = opciones.obtenerCalculoActual?.();
    if (!calculo?.datos || !calculo?.resultado || calculo.resultado.precioNeto === null) {
      mensaje(t("primeroCalculoValidoCotizacion"), true);
      return null;
    }
    asegurarActual({ moneda: calculo.datos.moneda });
    cotizacionActual.moneda = calculo.datos.moneda || cotizacionActual.moneda;
    cotizacionActual = window.CotizacionesPrecio3D.agregarItem(
      cotizacionActual,
      window.CotizacionesPrecio3D.crearItemDesdeCalculo(calculo.datos, calculo.resultado)
    );
    const guardada = window.CotizacionesPrecio3D.guardarCotizacion(cotizacionActual);
    if (guardada) cotizacionActual = guardada;
    renderizarEditor();
    renderizarListado();
    mensaje(t("calculoAgregadoLineaComercial"));
    return cotizacionActual;
  }

  function agregarTrabajo(trabajo) {
    if (!trabajo) return null;
    const usarVendido = numero(trabajo.precioVendidoReal) > 0
      && confirm(t("confirmarUsarPrecioVendido"));
    asegurarActual({
      moneda: trabajo.moneda,
      clienteId: trabajo.clienteId,
      snapshotCliente: trabajo.clienteSnapshot
    });
    if (!cotizacionActual.clienteId && trabajo.clienteId) {
      cotizacionActual.clienteId = trabajo.clienteId;
      cotizacionActual.snapshotCliente = trabajo.clienteSnapshot;
    }
    cotizacionActual.moneda = trabajo.moneda || cotizacionActual.moneda;
    cotizacionActual = window.CotizacionesPrecio3D.agregarItem(
      cotizacionActual,
      window.CotizacionesPrecio3D.crearItemDesdeTrabajo(trabajo, usarVendido)
    );
    cotizacionActual = window.CotizacionesPrecio3D.guardarCotizacion(cotizacionActual) || cotizacionActual;
    renderizarEditor();
    renderizarListado();
    mensaje(t("trabajoAgregadoCotizacion"));
    window.NavegacionPrecio3D?.mostrarSeccion?.("cotizacion-cliente", { enfocar: true });
    return cotizacionActual;
  }

  function clienteCotizacion(cotizacion) {
    const snapshot = cotizacion.snapshotCliente || {};
    return {
      nombre: snapshot.nombre || snapshot.clienteCotizacion || t("clienteNoEspecificado"),
      empresa: snapshot.empresa || snapshot.empresaCliente || "",
      rut: snapshot.rutIdFiscal || snapshot.rutCliente || "",
      telefono: snapshot.telefono || snapshot.contactoCliente || "",
      correo: snapshot.correo || snapshot.correoCliente || "",
      direccion: snapshot.direccion || snapshot.direccionCliente || ""
    };
  }

  function lineaDato(etiqueta, valor) {
    return valor ? `<p><strong>${escapar(etiqueta)}:</strong> ${escapar(valor)}</p>` : "";
  }

  function logoCotizacion(datosNegocio = {}) {
    const logo = typeof datosNegocio.logoNegocio === "string" ? datosNegocio.logoNegocio : "";
    return /^data:image\/webp;base64,/i.test(logo)
      ? `<img class="print-quote__logo" src="${logo}" alt="">`
      : "";
  }

  function cotizacionParaVistaPrevia() {
    if (!cotizacionActual) return null;
    const clienteId = $("#quoteClienteId")?.value || cotizacionActual.clienteId;
    const cliente = window.ClientesPrecio3D?.obtenerClientePorId?.(clienteId);
    return window.CotizacionesPrecio3D.normalizarCotizacion({
      ...cotizacionActual,
      clienteId,
      snapshotCliente: cliente ? snapshotCliente(cliente) : cotizacionActual.snapshotCliente,
      validezDias: numero($("#quoteValidez")?.value ?? cotizacionActual.validezDias),
      descuento: {
        tipo: $("#quoteDescuentoTipo")?.value || cotizacionActual.descuento.tipo,
        valor: numero($("#quoteDescuentoValor")?.value ?? cotizacionActual.descuento.valor)
      },
      envio: numero($("#quoteEnvio")?.value ?? cotizacionActual.envio),
      tipoAbono: $("#quoteAbonoTipo")?.value || cotizacionActual.tipoAbono,
      porcentajeAbono: numero($("#quoteAbonoPorcentaje")?.value ?? cotizacionActual.porcentajeAbono),
      montoAbono: numero($("#quoteAbonoMonto")?.value ?? cotizacionActual.montoAbono),
      tiempoEntrega: $("#quoteTiempoEntrega")?.value ?? cotizacionActual.tiempoEntrega,
      condicionesPago: $("#quoteCondicionesPago")?.value ?? cotizacionActual.condicionesPago,
      observaciones: $("#quoteObservaciones")?.value ?? cotizacionActual.observaciones,
      datosNegocio: { ...(cotizacionActual.datosNegocio || {}) }
    });
  }

  function renderizarVistaPrevia() {
    const cotizacionVista = cotizacionParaVistaPrevia();
    if (!cotizacionVista?.items.length) {
      mensaje(t("agregaLineaAntesGenerar"), true);
      return false;
    }
    const vista = $("#cotizacionClienteVista");
    if (!vista) return false;
    const negocio = cotizacionVista.datosNegocio || {};
    const cliente = clienteCotizacion(cotizacionVista);
    const totales = window.CotizacionesPrecio3D.calcularTotales(cotizacionVista);
    const fechaValidez = new Date(cotizacionVista.fechaCreacion);
    fechaValidez.setDate(fechaValidez.getDate() + cotizacionVista.validezDias);
    const condiciones = [
      lineaDato(t("entrega"), cotizacionVista.tiempoEntrega),
      lineaDato(t("pago"), cotizacionVista.condicionesPago),
      lineaDato(t("observaciones"), cotizacionVista.observaciones)
    ].filter(Boolean).join("");
    const notaImpuestos = cotizacionVista.items.every((item) => item.precioIncluyeImpuesto)
      ? t("impuestosIncluidos")
      : t("revisarLineasSinImpuesto");

    vista.hidden = false;
    vista.innerHTML = `
      <article class="print-quote">
        <header class="print-quote__header">
          <div class="print-quote__brand">
            ${logoCotizacion(negocio)}
            <div>
              <p>${escapar(t("emitidaPor"))}</p>
              <h2>${escapar(negocio.nombreNegocio || t("negocioNoConfigurado"))}</h2>
            </div>
          </div>
          <div class="print-quote__document">
            <h1>${escapar(t("cotizacion"))}</h1>
            <div class="print-quote__meta">
              ${lineaDato(t("numero"), cotizacionVista.numeroCotizacion)}
              ${lineaDato(t("fecha"), fecha(cotizacionVista.fechaCreacion))}
              ${lineaDato(t("validaHasta"), fecha(fechaValidez))}
              ${lineaDato(t("moneda"), cotizacionVista.moneda)}
            </div>
          </div>
        </header>
        <section class="print-quote__commercial">
          <div class="print-quote__party">
            <h3>${escapar(t("datosQuienCotiza"))}</h3>
            ${lineaDato(t("nombre"), negocio.nombreNegocio)}
            ${lineaDato(t("rutNegocio"), negocio.rutNegocio)}
            ${lineaDato(t("contacto"), negocio.telefonoNegocio)}
            ${lineaDato(t("correoNegocio"), negocio.correoNegocio)}
            ${lineaDato(t("direccionNegocio"), negocio.direccionNegocio)}
            ${lineaDato(t("sitioWebNegocio"), negocio.sitioWebNegocio)}
            ${lineaDato(t("instagramNegocio"), negocio.instagramNegocio)}
          </div>
          <div class="print-quote__party">
            <h3>${escapar(t("datosCliente"))}</h3>
            ${lineaDato(t("cliente"), cliente.nombre)}
            ${lineaDato(t("empresa"), cliente.empresa)}
            ${lineaDato(t("rutCliente"), cliente.rut)}
            ${lineaDato(t("contacto"), cliente.telefono)}
            ${lineaDato(t("correoCliente"), cliente.correo)}
            ${lineaDato(t("direccionCliente"), cliente.direccion)}
          </div>
        </section>
        <section class="print-quote__section print-quote__detail">
          <h3>${escapar(t("detalle"))}</h3>
          <div class="print-quote__table-wrap">
            <table class="print-quote__table">
              <thead><tr><th>${escapar(t("descripcion"))}</th><th>${escapar(t("cantidad"))}</th><th>${escapar(t("precioUnitario"))}</th><th>${escapar(t("total"))}</th></tr></thead>
              <tbody>${cotizacionVista.items.map((item) => `<tr><td><strong>${escapar(item.descripcion)}</strong>${item.detalle ? `<small>${escapar(item.detalle)}</small>` : ""}</td><td>${item.cantidad}</td><td>${moneda(item.precioUnitario, cotizacionVista.moneda)}</td><td>${item.tipo === "Descuento de línea" ? "−" : ""}${moneda(item.totalLinea, cotizacionVista.moneda)}</td></tr>`).join("")}</tbody>
            </table>
          </div>
        </section>
        <section class="print-quote__summary" aria-label="${escapar(t("resumenComercial"))}">
          <dl class="print-quote__totals">
            <div><dt>${escapar(t("subtotal"))}</dt><dd>${moneda(totales.subtotal, cotizacionVista.moneda)}</dd></div>
            ${totales.descuentoTotal ? `<div><dt>${escapar(t("descuento"))}</dt><dd>−${moneda(totales.descuentoTotal, cotizacionVista.moneda)}</dd></div>` : ""}
            ${totales.envio ? `<div><dt>${escapar(t("envio"))}</dt><dd>${moneda(totales.envio, cotizacionVista.moneda)}</dd></div>` : ""}
            <div class="print-quote__grand-total"><dt>${escapar(t("totalFinal"))}</dt><dd>${moneda(totales.totalFinal, cotizacionVista.moneda)}</dd></div>
            ${totales.montoAbono ? `<div><dt>${escapar(t("abonoRequerido"))}</dt><dd>${moneda(totales.montoAbono, cotizacionVista.moneda)}</dd></div><div><dt>${escapar(t("saldo"))}</dt><dd>${moneda(totales.saldo, cotizacionVista.moneda)}</dd></div>` : ""}
          </dl>
          <p class="print-quote__tax-note">${escapar(notaImpuestos)}</p>
        </section>
        ${condiciones ? `<section class="print-quote__section print-quote__conditions"><h3>${escapar(t("condiciones"))}</h3>${condiciones}</section>` : ""}
      </article>`;
    mensaje(t("vistaPreviaGenerada"));
    return true;
  }

  function nombreSeguroDocumento(valor) {
    return String(valor || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[<>:"/\\|?*\u0000-\u001F]/g, "-")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 80);
  }

  function imprimir() {
    if (!renderizarVistaPrevia()) return false;
    const tituloOriginal = document.title;
    const cotizacionVista = cotizacionParaVistaPrevia() || cotizacionActual;
    const cliente = clienteCotizacion(cotizacionVista).nombre;
    const numeroSeguro = nombreSeguroDocumento(cotizacionVista.numeroCotizacion) || "Sin-numero";
    const clienteSeguro = nombreSeguroDocumento(cliente) || "Sin-cliente";
    let restaurado = false;
    const restaurarTitulo = () => {
      if (restaurado) return;
      restaurado = true;
      document.title = tituloOriginal;
    };

    document.title = `Cotizacion-${numeroSeguro}-${clienteSeguro}`;
    window.addEventListener("afterprint", restaurarTitulo, { once: true });
    window.addEventListener("focus", restaurarTitulo, { once: true });
    try {
      window.print();
    } catch (error) {
      restaurarTitulo();
      throw error;
    }
    window.setTimeout(restaurarTitulo, 60000);
    return true;
  }

  function convertirEnTrabajo(cotizacion = cotizacionActual) {
    if (!cotizacion) return null;
    if (cotizacion.trabajoId) {
      mensaje(t("cotizacionYaConvertida", { trabajo: cotizacion.trabajoId }), true);
      return null;
    }
    if (!confirm(t("confirmarConvertirCotizacion", { numero: cotizacion.numeroCotizacion }))) return null;
    const cliente = clienteCotizacion(cotizacion);
    const trabajo = window.StoragePrecio3D?.guardarTrabajo?.({
      nombreTrabajo: cotizacion.items[0]?.descripcion || cotizacion.numeroCotizacion,
      cliente: cliente.nombre === "Cliente no especificado" ? "" : cliente.nombre,
      clienteId: cotizacion.clienteId,
      clienteSnapshot: cotizacion.snapshotCliente,
      descripcion: cotizacion.items.map((item) => item.descripcion).join(", "),
      estado: "Aceptado",
      modoUsado: "basico",
      precioFinal: cotizacion.totalFinal,
      costoTotal: 0,
      utilidadObjetivo: 0,
      moneda: cotizacion.moneda,
      numeroCotizacion: cotizacion.numeroCotizacion,
      cotizacionId: cotizacion.id,
      itemsCotizacion: cotizacion.items,
      montoAbonado: cotizacion.montoAbono,
      datos: { cantidadProductos: cotizacion.items.reduce((total, item) => total + numero(item.cantidad), 0) },
      resultado: { precioFinal: cotizacion.totalFinal }
    });
    if (!trabajo) {
      mensaje(t("trabajoDesdeCotizacionNoCreado"), true);
      return null;
    }
    let actualizada = window.CotizacionesPrecio3D.cambiarEstado(cotizacion, "Convertida en trabajo", `Trabajo ${trabajo.id}`);
    actualizada.trabajoId = trabajo.id;
    cotizacionActual = window.CotizacionesPrecio3D.guardarCotizacion(actualizada);
    window.PanelTrabajosPrecio3D?.renderizar?.();
    renderizarEditor();
    renderizarListado();
    mensaje(t("cotizacionConvertidaTrabajo"));
    return trabajo;
  }

  function badgeEstado(cotizacion) {
    const vencida = window.CotizacionesPrecio3D.estaVencida(cotizacion);
    return `
      <span class="quote-status-badge">${escapar(estadoVisible(cotizacion.estado))}</span>
      ${vencida ? `<span class="quote-status-badge is-expired">${escapar(t("vencidaVisual"))}</span>` : ""}`;
  }

  function accionesCotizacion(cotizacion) {
    return `
      <div class="quote-record-actions">
        <button type="button" data-quote-list-action="abrir">${escapar(t("abrirEditar"))}</button>
        <details class="quote-secondary-actions">
          <summary>${escapar(t("masAcciones"))}</summary>
          <div>
            <button type="button" class="secondary" data-quote-list-action="duplicar">${escapar(t("duplicar"))}</button>
            <button type="button" class="secondary" data-quote-list-action="imprimir">${escapar(t("imprimir"))}</button>
            ${cotizacion.trabajoId
              ? `<button type="button" class="secondary" data-quote-list-action="ver-trabajo">${escapar(t("verTrabajoRelacionado"))}</button>`
              : `<button type="button" class="secondary" data-quote-list-action="convertir">${escapar(t("convertirTrabajo"))}</button>`}
            <button type="button" class="secondary danger-button" data-quote-list-action="eliminar">${escapar(t("eliminar"))}</button>
          </div>
        </details>
      </div>`;
  }

  function filaCotizacion(cotizacion) {
    const cliente = clienteCotizacion(cotizacion);
    return `
      <tr data-quote-id="${escapar(cotizacion.id)}">
        <td><strong>${escapar(cotizacion.numeroCotizacion)}</strong></td>
        <td>${escapar(cliente.nombre)}</td>
        <td>${escapar(fecha(cotizacion.fechaCreacion))}</td>
        <td><strong>${moneda(cotizacion.totalFinal, cotizacion.moneda)}</strong><small>${escapar(cotizacion.moneda)}</small></td>
        <td><div class="quote-statuses">${badgeEstado(cotizacion)}</div></td>
        <td>${cotizacion.validezDias} ${escapar(t("dias"))}</td>
        <td>${accionesCotizacion(cotizacion)}</td>
      </tr>`;
  }

  function tarjetaCotizacionHistorial(cotizacion) {
    const cliente = clienteCotizacion(cotizacion);
    return `
      <article class="quote-history-card" data-quote-id="${escapar(cotizacion.id)}">
        <header>
          <div>
            <span>${escapar(t("numero"))}</span>
            <strong>${escapar(cotizacion.numeroCotizacion)}</strong>
          </div>
          <div class="quote-statuses">${badgeEstado(cotizacion)}</div>
        </header>
        <dl>
          <div><dt>${escapar(t("cliente"))}</dt><dd>${escapar(cliente.nombre)}</dd></div>
          <div><dt>${escapar(t("fecha"))}</dt><dd>${escapar(fecha(cotizacion.fechaCreacion))}</dd></div>
          <div><dt>${escapar(t("total"))}</dt><dd>${moneda(cotizacion.totalFinal, cotizacion.moneda)} <small>${escapar(cotizacion.moneda)}</small></dd></div>
          <div><dt>${escapar(t("validez"))}</dt><dd>${cotizacion.validezDias} ${escapar(t("dias"))}</dd></div>
        </dl>
        ${accionesCotizacion(cotizacion)}
      </article>`;
  }

  function cotizacionesFiltradas(lista) {
    const busqueda = filtrosHistorial.busqueda.trim().toLocaleLowerCase(idioma());
    const ahora = new Date();
    const limite30 = new Date(ahora);
    const limite90 = new Date(ahora);
    limite30.setDate(limite30.getDate() - 30);
    limite90.setDate(limite90.getDate() - 90);

    const filtradas = lista.filter((cotizacion) => {
      const cliente = clienteCotizacion(cotizacion).nombre;
      const coincideBusqueda = !busqueda
        || `${cotizacion.numeroCotizacion} ${cliente}`.toLocaleLowerCase(idioma()).includes(busqueda);
      const coincideEstado = filtrosHistorial.estado === "todos"
        || (filtrosHistorial.estado === "vencidas-visuales"
          ? window.CotizacionesPrecio3D.estaVencida(cotizacion)
          : cotizacion.estado === filtrosHistorial.estado);
      const fechaCotizacion = new Date(cotizacion.fechaCreacion);
      const coincidePeriodo = filtrosHistorial.periodo === "todas"
        || (filtrosHistorial.periodo === "30-dias" && fechaCotizacion >= limite30)
        || (filtrosHistorial.periodo === "90-dias" && fechaCotizacion >= limite90)
        || (filtrosHistorial.periodo === "ano-actual" && fechaCotizacion.getFullYear() === ahora.getFullYear());
      return coincideBusqueda && coincideEstado && coincidePeriodo;
    });

    return filtradas.sort((a, b) => {
      if (filtrosHistorial.orden === "antiguas") return new Date(a.fechaCreacion) - new Date(b.fechaCreacion);
      if (filtrosHistorial.orden === "mayor-total") return numero(b.totalFinal) - numero(a.totalFinal);
      if (filtrosHistorial.orden === "menor-total") return numero(a.totalFinal) - numero(b.totalFinal);
      return new Date(b.fechaCreacion) - new Date(a.fechaCreacion);
    });
  }

  function renderizarListado() {
    const contenedor = $("#cotizacionesDashboard");
    if (!contenedor) return;
    const lista = window.CotizacionesPrecio3D.cargarCotizaciones();
    const listaFiltrada = cotizacionesFiltradas(lista);
    const estados = window.CotizacionesPrecio3D.ESTADOS || [];
    const metricas = [
      [t("totalCotizaciones"), lista.length],
      [t("borradores"), lista.filter((cotizacion) => cotizacion.estado === "Borrador").length],
      [t("vencidasVisualmente"), lista.filter((cotizacion) => window.CotizacionesPrecio3D.estaVencida(cotizacion)).length],
      [t("convertidasTrabajo"), lista.filter((cotizacion) => cotizacion.estado === "Convertida en trabajo").length]
    ];
    const botonNuevaCabecera = $("#misCotizacionesPanel [data-quotes-primary-new]");
    if (botonNuevaCabecera) botonNuevaCabecera.hidden = !lista.length;

    contenedor.innerHTML = `
      ${lista.length ? `
        <div class="quotes-kpi-grid" aria-live="polite">
          ${metricas.map(([etiqueta, valor]) => `<article><span>${escapar(etiqueta)}</span><strong>${valor}</strong></article>`).join("")}
        </div>
        <section class="quotes-filters-card" aria-labelledby="quotesFiltersTitle">
          <div class="quotes-filters-heading">
            <h3 id="quotesFiltersTitle">${escapar(t("filtros"))}</h3>
            <button type="button" class="secondary" data-quote-list-action="limpiar-filtros">${escapar(t("limpiarFiltros"))}</button>
          </div>
          <div class="quotes-filters">
            <label class="quotes-search-field">${escapar(t("buscar"))}<input type="search" id="quotesSearch" value="${escapar(filtrosHistorial.busqueda)}" placeholder="${escapar(t("buscarCotizacionesPlaceholder"))}"></label>
            <label>${escapar(t("estado"))}<select id="quotesState"><option value="todos">${escapar(t("todos"))}</option>${estados.map((estado) => `<option value="${escapar(estado)}" ${filtrosHistorial.estado === estado ? "selected" : ""}>${escapar(estadoVisible(estado))}</option>`).join("")}<option value="vencidas-visuales" ${filtrosHistorial.estado === "vencidas-visuales" ? "selected" : ""}>${escapar(t("vencidasVisualmente"))}</option></select></label>
            <label>${escapar(t("periodo"))}<select id="quotesPeriod"><option value="todas">${escapar(t("todas"))}</option><option value="30-dias" ${filtrosHistorial.periodo === "30-dias" ? "selected" : ""}>${escapar(t("ultimos30Dias"))}</option><option value="90-dias" ${filtrosHistorial.periodo === "90-dias" ? "selected" : ""}>${escapar(t("ultimos90Dias"))}</option><option value="ano-actual" ${filtrosHistorial.periodo === "ano-actual" ? "selected" : ""}>${escapar(t("anoActual"))}</option></select></label>
            <label>${escapar(t("ordenar"))}<select id="quotesSort"><option value="recientes">${escapar(t("masRecientes"))}</option><option value="antiguas" ${filtrosHistorial.orden === "antiguas" ? "selected" : ""}>${escapar(t("masAntiguas"))}</option><option value="mayor-total" ${filtrosHistorial.orden === "mayor-total" ? "selected" : ""}>${escapar(t("mayorTotal"))}</option><option value="menor-total" ${filtrosHistorial.orden === "menor-total" ? "selected" : ""}>${escapar(t("menorTotal"))}</option></select></label>
          </div>
        </section>
        ${listaFiltrada.length ? `
          <div class="quotes-table-wrap"><table class="quotes-table"><thead><tr><th>${escapar(t("numero"))}</th><th>${escapar(t("cliente"))}</th><th>${escapar(t("fecha"))}</th><th>${escapar(t("total"))}</th><th>${escapar(t("estado"))}</th><th>${escapar(t("validez"))}</th><th>${escapar(t("acciones"))}</th></tr></thead><tbody>${listaFiltrada.map(filaCotizacion).join("")}</tbody></table></div>
          <div class="quotes-history-cards">${listaFiltrada.map(tarjetaCotizacionHistorial).join("")}</div>
        ` : `<div class="quotes-empty-state"><strong>${escapar(t("sinCotizacionesFiltros"))}</strong><p>${escapar(t("sinCotizacionesFiltrosAyuda"))}</p><button type="button" class="secondary" data-quote-list-action="limpiar-filtros">${escapar(t("limpiarFiltros"))}</button></div>`}
      ` : `<div class="quotes-empty-state"><strong>${escapar(t("historialCotizacionesVacio"))}</strong><p>${escapar(t("historialCotizacionesVacioAyuda"))}</p><button type="button" data-quote-list-action="nueva">${escapar(t("crearPrimeraCotizacion"))}</button></div>`}
      <details class="quotes-tools-panel">
        <summary>${escapar(t("herramientasRespaldo"))}</summary>
        <div class="quotes-tools-actions">
          <button type="button" class="secondary" data-quote-list-action="exportar-json">${escapar(t("exportarJson"))}</button>
          <button type="button" class="secondary" data-quote-list-action="exportar-csv">${escapar(t("exportarCsv"))}</button>
          <button type="button" class="secondary" data-quote-list-action="importar-json">${escapar(t("importarJson"))}</button>
        </div>
        <input type="file" id="quoteImportInput" accept="application/json,.json" hidden>
      </details>`;
  }

  function cotizacionesCSV() {
    const cabecera = ["Número", "Cliente", "Fecha", "Validez", "Estado", "Cantidad de ítems", "Subtotal", "Descuento", "Envío", "Total", "Abono", "Saldo"];
    const escaparCSV = (valor) => `"${String(valor ?? "").replaceAll('"', '""')}"`;
    const filas = window.CotizacionesPrecio3D.cargarCotizaciones().map((cotizacion) => [
      cotizacion.numeroCotizacion,
      clienteCotizacion(cotizacion).nombre,
      fecha(cotizacion.fechaCreacion),
      cotizacion.validezDias,
      cotizacion.estado,
      cotizacion.items.length,
      cotizacion.subtotal,
      cotizacion.descuentoTotal,
      cotizacion.envio,
      cotizacion.totalFinal,
      cotizacion.montoAbono,
      cotizacion.saldo
    ]);
    return "\uFEFF" + [cabecera, ...filas].map((fila) => fila.map(escaparCSV).join(";")).join("\r\n");
  }

  function abrirCotizacion(id) {
    const encontrada = window.CotizacionesPrecio3D.obtenerCotizacion(id);
    if (!encontrada) return;
    cotizacionActual = encontrada;
    window.CotizacionesPrecio3D.establecerActiva(id);
    renderizarEditor();
    window.NavegacionPrecio3D?.mostrarSeccion?.("cotizacion-cliente", { enfocar: true });
  }

  function manejarEditorClick(event) {
    const boton = event.target.closest("[data-quote-action]");
    if (!boton) return;
    const accion = boton.dataset.quoteAction;
    const itemId = boton.closest("[data-quote-item-id]")?.dataset.quoteItemId;
    if (accion === "guardar") guardarActual();
    if (accion === "agregar-calculo") agregarCalculoActual();
    if (accion === "mostrar-item-form") $("#quoteItemForm").hidden = false;
    if (accion === "cancelar-item") { $("#quoteItemForm").reset(); $("#quoteItemId").value = ""; $("#quoteItemForm").hidden = true; }
    if (accion === "eliminar-item" && confirm(t("confirmarEliminarLineaCotizacion"))) cotizacionActual = window.CotizacionesPrecio3D.eliminarItem(cotizacionActual, itemId);
    if (accion === "duplicar-item") {
      const item = cotizacionActual.items.find((actual) => actual.id === itemId);
      if (item) cotizacionActual = window.CotizacionesPrecio3D.agregarItem(cotizacionActual, { ...item, id: "", descripcion: `${item.descripcion} (copia)` });
    }
    if (accion === "subir-item") cotizacionActual = window.CotizacionesPrecio3D.moverItem(cotizacionActual, itemId, "arriba");
    if (accion === "bajar-item") cotizacionActual = window.CotizacionesPrecio3D.moverItem(cotizacionActual, itemId, "abajo");
    if (accion === "editar-item") {
      const item = cotizacionActual.items.find((actual) => actual.id === itemId);
      if (item) {
        $("#quoteItemId").value = item.id;
        $("#quoteItemTipo").value = item.tipo;
        $("#quoteItemDescripcion").value = item.descripcion;
        $("#quoteItemDetalle").value = item.detalle;
        $("#quoteItemCantidad").value = item.cantidad;
        $("#quoteItemPrecio").value = item.precioUnitario;
        $("#quoteItemForm").hidden = false;
        $("#quoteItemDescripcion").focus();
      }
    }
    if (["eliminar-item", "duplicar-item", "subir-item", "bajar-item"].includes(accion)) {
      renderizarItems();
      renderizarTotales();
    }
  }

  function manejarItemSubmit(event) {
    if (event.target.id !== "quoteItemForm") return;
    event.preventDefault();
    const item = {
      tipo: $("#quoteItemTipo").value,
      origen: "manual",
      descripcion: $("#quoteItemDescripcion").value.trim(),
      detalle: $("#quoteItemDetalle").value.trim(),
      cantidad: numero($("#quoteItemCantidad").value),
      precioUnitario: numero($("#quoteItemPrecio").value),
      precioIncluyeImpuesto: true
    };
    if (!item.descripcion || item.cantidad <= 0 || item.precioUnitario < 0) {
      mensaje(t("completaLineaValida"), true);
      return;
    }
    const id = $("#quoteItemId").value;
    cotizacionActual = id
      ? window.CotizacionesPrecio3D.actualizarItem(cotizacionActual, id, item)
      : window.CotizacionesPrecio3D.agregarItem(cotizacionActual, item);
    event.target.reset();
    $("#quoteItemId").value = "";
    event.target.hidden = true;
    renderizarItems();
    renderizarTotales();
    mensaje(t("lineaComercialActualizada"));
  }

  function manejarEditorInput(event) {
    if (!event.target.closest("#quoteCommercialEditor") || event.target.closest("#quoteItemForm")) return;
    leerEditor();
    renderizarTotales();
  }

  async function manejarListadoClick(event) {
    const boton = event.target.closest("[data-quote-list-action]");
    if (!boton) return;
    const accion = boton.dataset.quoteListAction;
    const id = boton.closest("[data-quote-id]")?.dataset.quoteId;
    if (accion === "nueva") { nuevaCotizacion(); window.NavegacionPrecio3D?.mostrarSeccion?.("cotizacion-cliente", { enfocar: true }); }
    if (accion === "limpiar-filtros") {
      Object.assign(filtrosHistorial, { busqueda: "", estado: "todos", periodo: "todas", orden: "recientes" });
      renderizarListado();
    }
    if (accion === "abrir") abrirCotizacion(id);
    if (accion === "duplicar") { const nueva = window.CotizacionesPrecio3D.duplicarCotizacion(id); if (nueva) abrirCotizacion(nueva.id); }
    if (accion === "imprimir") { abrirCotizacion(id); imprimir(); }
    if (accion === "convertir") convertirEnTrabajo(window.CotizacionesPrecio3D.obtenerCotizacion(id));
    if (accion === "ver-trabajo") window.NavegacionPrecio3D?.mostrarSeccion?.("trabajos", { enfocar: true });
    if (accion === "eliminar" && confirm(t("confirmarEliminarCotizacion"))) { window.CotizacionesPrecio3D.eliminarCotizacion(id); renderizarListado(); }
    if (accion === "exportar-json") descargar("cotizaciones-impresion-3d.json", "\uFEFF" + window.CotizacionesPrecio3D.exportarJSON());
    if (accion === "exportar-csv") descargar("cotizaciones-impresion-3d.csv", cotizacionesCSV(), "text/csv;charset=utf-8");
    if (accion === "importar-json") $("#quoteImportInput")?.click();
  }

  function manejarFiltrosListado(event) {
    const campos = {
      quotesSearch: "busqueda",
      quotesState: "estado",
      quotesPeriod: "periodo",
      quotesSort: "orden"
    };
    const propiedad = campos[event.target.id];
    if (!propiedad) return;
    filtrosHistorial[propiedad] = event.target.value;

    if (event.target.id !== "quotesSearch" || event.type === "change") {
      clearTimeout(temporizadorBusquedaHistorial);
      renderizarListado();
      return;
    }

    clearTimeout(temporizadorBusquedaHistorial);
    temporizadorBusquedaHistorial = window.setTimeout(() => {
      renderizarListado();
      const buscador = $("#quotesSearch");
      buscador?.focus();
      buscador?.setSelectionRange(buscador.value.length, buscador.value.length);
    }, 180);
  }

  async function manejarImportacion(event) {
    if (event.target.id !== "quoteImportInput" || !event.target.files[0]) return;
    const contenido = await event.target.files[0].text();
    const combinar = confirm(t("confirmarImportarCotizaciones"));
    const importadas = window.CotizacionesPrecio3D.importarJSON(contenido.replace(/^\uFEFF/, ""), combinar);
    alert(importadas
      ? t("cotizacionesImportadas", { cantidad: importadas.length })
      : t("archivoCotizacionesInvalido"));
    renderizarListado();
    event.target.value = "";
  }

  function actualizarBotonesVista() {
    const tieneItems = Boolean(cotizacionActual?.items.length);
    ["#generarCotizacionButton", "#vistaPreviaCotizacionButton", "#imprimirCotizacionButton"].forEach((selector) => {
      const boton = $(selector);
      if (boton) boton.disabled = !tieneItems;
    });
  }

  function inicializar(configuracion = {}) {
    opciones = { ...opciones, ...configuracion };
    if (!window.CotizacionesPrecio3D) {
      console.error("No se pudo iniciar el editor de cotizaciones.");
      return;
    }
    window.CotizacionesPrecio3D.migrarCotizacionAntigua();
    cotizacionActual = window.CotizacionesPrecio3D.obtenerActiva()
      || window.CotizacionesPrecio3D.cargarCotizaciones()[0]
      || null;
    asegurarActual();
    renderizarEditor();
    renderizarListado();
    if (inicializado) return;
    inicializado = true;
    $("#cotizacionClientePanel")?.addEventListener("click", manejarEditorClick);
    $("#cotizacionClientePanel")?.addEventListener("submit", manejarItemSubmit);
    $("#cotizacionClientePanel")?.addEventListener("input", manejarEditorInput);
    $("#cotizacionClientePanel")?.addEventListener("change", manejarEditorInput);
    $("#misCotizacionesPanel")?.addEventListener("click", manejarListadoClick);
    $("#misCotizacionesPanel")?.addEventListener("input", manejarFiltrosListado);
    $("#misCotizacionesPanel")?.addEventListener("change", manejarFiltrosListado);
    $("#misCotizacionesPanel")?.addEventListener("change", manejarImportacion);
    document.addEventListener("precio3d:agregar-calculo-cotizacion", agregarCalculoActual);
    document.addEventListener("precio3d:datos-cotizacion-guardados", (event) => {
      if (!cotizacionActual) return;
      if (event.detail?.limpiar) {
        cotizacionActual.clienteId = "";
        cotizacionActual.snapshotCliente = null;
      } else {
        const clienteFormulario = opciones.obtenerDatosCliente?.() || {};
        cotizacionActual.clienteId = clienteFormulario.clienteId || cotizacionActual.clienteId;
        cotizacionActual.snapshotCliente = snapshotDesdeFormulario() || cotizacionActual.snapshotCliente;
      }
      const condiciones = opciones.obtenerCondiciones?.() || {};
      cotizacionActual.validezDias = condiciones.validezCotizacionDias ?? cotizacionActual.validezDias;
      cotizacionActual.tiempoEntrega = condiciones.tiempoEntrega ?? cotizacionActual.tiempoEntrega;
      cotizacionActual.condicionesPago = condiciones.condicionesPago ?? cotizacionActual.condicionesPago;
      cotizacionActual.observaciones = condiciones.observacionesCotizacion ?? cotizacionActual.observaciones;
      renderizarEditor();
    });
    document.addEventListener("precio3d:perfil-negocio-guardado", (event) => {
      if (!cotizacionActual || cotizacionActualEstaGuardada()) return;
      cotizacionActual = window.CotizacionesPrecio3D.normalizarCotizacion({
        ...cotizacionActual,
        datosNegocio: { ...(event.detail?.datosNegocio || {}) }
      });
      renderizarEditor();
    });
    document.addEventListener("precio3d:usar-cliente-cotizacion", (event) => {
      const cliente = event.detail?.cliente;
      if (!cliente || !cotizacionActual) return;
      cotizacionActual.clienteId = cliente.id || "";
      cotizacionActual.snapshotCliente = snapshotCliente(cliente);
      renderizarEditor();
    });
    window.addEventListener("precio3d:clientes-actualizados", () => renderizarEditor());
    document.addEventListener("precio3d:idioma-actualizado", () => {
      renderizarEditor();
      renderizarListado();
    });
    window.addEventListener("precio3d:cotizaciones-actualizadas", () => renderizarListado());
  }

  window.PanelCotizacionesPrecio3D = {
    inicializar,
    nuevaCotizacion,
    guardarActual,
    agregarCalculoActual,
    agregarTrabajo,
    abrirCotizacion,
    obtenerActual: () => cotizacionActual,
    renderizarEditor,
    renderizarListado,
    renderizarVistaPrevia,
    imprimir,
    convertirEnTrabajo
  };
})();

// Editor y listado de cotizaciones comerciales.
(function () {
  "use strict";

  let opciones = {};
  let cotizacionActual = null;
  let inicializado = false;

  const $ = (selector, raiz = document) => raiz.querySelector(selector);
  const numero = (valor) => Number.isFinite(Number(valor)) ? Number(valor) : 0;
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
    if (!valor) return "Sin fecha";
    return new Intl.DateTimeFormat("es-CL", { dateStyle: "medium" }).format(new Date(valor));
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
      tiempoEntrega: configuracion.tiempoEntrega || "A coordinar",
      condicionesPago: configuracion.condicionesPago || "",
      observaciones: configuracion.observacionesCotizacion || ""
    });
    window.CotizacionesPrecio3D.establecerActiva(cotizacionActual.id);
    return cotizacionActual;
  }

  function opcionesClientes(seleccionado = "") {
    return [
      '<option value="">Cliente sin ficha vinculada</option>',
      ...clientes()
        .sort((a, b) => a.nombre.localeCompare(b.nombre, "es"))
        .map((cliente) => `<option value="${escapar(cliente.id)}" ${cliente.id === seleccionado ? "selected" : ""}>${escapar(cliente.nombre)}${cliente.empresa ? ` · ${escapar(cliente.empresa)}` : ""}</option>`)
    ].join("");
  }

  function opcionesTipos(seleccionado = "Otro") {
    return window.CotizacionesPrecio3D.TIPOS
      .map((tipo) => `<option value="${escapar(tipo)}" ${tipo === seleccionado ? "selected" : ""}>${escapar(tipo)}</option>`)
      .join("");
  }

  function opcionesEstados(seleccionado) {
    return window.CotizacionesPrecio3D.ESTADOS
      .map((estado) => `<option value="${escapar(estado)}" ${estado === seleccionado ? "selected" : ""}>${escapar(estado)}</option>`)
      .join("");
  }

  function filaItem(item, indice, total) {
    return `
      <tr data-quote-item-id="${escapar(item.id)}">
        <td><strong>${escapar(item.descripcion)}</strong><small>${escapar(item.tipo)} · ${escapar(item.origen)}${item.detalle ? `<br>${escapar(item.detalle)}` : ""}</small></td>
        <td>${item.cantidad}</td>
        <td>${moneda(item.precioUnitario)}</td>
        <td><strong>${item.tipo === "Descuento de línea" ? "−" : ""}${moneda(item.totalLinea)}</strong></td>
        <td>
          <div class="quote-item-actions">
            <button type="button" class="secondary compact-button" data-quote-action="editar-item" title="Editar">Editar</button>
            <button type="button" class="secondary compact-button" data-quote-action="duplicar-item" title="Duplicar">Duplicar</button>
            <button type="button" class="secondary compact-button" data-quote-action="subir-item" ${indice === 0 ? "disabled" : ""} aria-label="Subir ${escapar(item.descripcion)}">↑</button>
            <button type="button" class="secondary compact-button" data-quote-action="bajar-item" ${indice === total - 1 ? "disabled" : ""} aria-label="Bajar ${escapar(item.descripcion)}">↓</button>
            <button type="button" class="secondary danger-button compact-button" data-quote-action="eliminar-item">Eliminar</button>
          </div>
        </td>
      </tr>`;
  }

  function tarjetaItem(item, indice, total) {
    return `
      <article class="quote-item-card" data-quote-item-id="${escapar(item.id)}">
        <div><span>${escapar(item.tipo)}</span><strong>${escapar(item.descripcion)}</strong><small>${escapar(item.detalle || item.origen)}</small></div>
        <dl><div><dt>Cantidad</dt><dd>${item.cantidad}</dd></div><div><dt>Unitario</dt><dd>${moneda(item.precioUnitario)}</dd></div><div><dt>Total</dt><dd>${item.tipo === "Descuento de línea" ? "−" : ""}${moneda(item.totalLinea)}</dd></div></dl>
        <div class="quote-item-actions">
          <button type="button" class="secondary compact-button" data-quote-action="editar-item">Editar</button>
          <button type="button" class="secondary compact-button" data-quote-action="duplicar-item">Duplicar</button>
          <button type="button" class="secondary compact-button" data-quote-action="subir-item" ${indice === 0 ? "disabled" : ""} aria-label="Subir">↑</button>
          <button type="button" class="secondary compact-button" data-quote-action="bajar-item" ${indice === total - 1 ? "disabled" : ""} aria-label="Bajar">↓</button>
          <button type="button" class="secondary danger-button compact-button" data-quote-action="eliminar-item">Eliminar</button>
        </div>
      </article>`;
  }

  function renderizarItems() {
    const contenedor = $("#quoteItemsEditor");
    if (!contenedor || !cotizacionActual) return;
    const items = cotizacionActual.items;
    if (!items.length) {
      contenedor.innerHTML = '<p class="empty-state">Aún no hay productos o servicios. Agrega el cálculo actual, un trabajo guardado o una línea manual.</p>';
      actualizarBotonesVista();
      return;
    }
    contenedor.innerHTML = `
      <div class="quote-items-table-wrap">
        <table class="quote-items-table"><thead><tr><th>Descripción</th><th>Cantidad</th><th>Precio unitario</th><th>Total</th><th>Acciones</th></tr></thead><tbody>${items.map((item, indice) => filaItem(item, indice, items.length)).join("")}</tbody></table>
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
        <div><dt>Subtotal</dt><dd>${moneda(total.subtotal)}</dd></div>
        ${total.descuentoTotal > 0 ? `<div><dt>Descuento</dt><dd>−${moneda(total.descuentoTotal)}</dd></div>` : ""}
        ${total.envio > 0 ? `<div><dt>Envío</dt><dd>${moneda(total.envio)}</dd></div>` : ""}
        <div class="quote-total-final"><dt>Total final</dt><dd>${moneda(total.totalFinal)}</dd></div>
        ${total.montoAbono > 0 ? `<div><dt>Abono requerido</dt><dd>${moneda(total.montoAbono)}</dd></div><div><dt>Saldo</dt><dd>${moneda(total.saldo)}</dd></div>` : ""}
      </dl>
      ${total.descuentoExcedeSubtotal ? '<p class="warning-message">El descuento supera el subtotal. El total se mantiene en cero antes de sumar el envío.</p>' : ""}
      <p class="help-text">${cotizacionActual.items.every((item) => item.precioIncluyeImpuesto) ? "Impuestos incluidos en los precios comerciales." : "Revisa las líneas marcadas sin impuesto incluido."}</p>`;
  }

  function renderizarEditor() {
    const panel = $("#cotizacionClientePanel");
    if (!panel || !cotizacionActual) return;
    let editor = $("#quoteCommercialEditor");
    if (!editor) {
      editor = document.createElement("div");
      editor.id = "quoteCommercialEditor";
      editor.className = "quote-commercial-editor";
      panel.querySelector(".quote-actions")?.before(editor);
    }

    editor.innerHTML = `
      <section class="quote-editor-block quote-editor-header">
        <div class="quote-editor-title"><div><p class="eyebrow">Borrador comercial</p><h3>${escapar(cotizacionActual.numeroCotizacion)}</h3></div><span class="quote-status-badge">${escapar(cotizacionActual.estado)}</span></div>
        <div class="field-grid">
          <label>Cliente guardado<select id="quoteClienteId">${opcionesClientes(cotizacionActual.clienteId)}</select></label>
          <label>Fecha<input type="text" value="${escapar(fecha(cotizacionActual.fechaCreacion))}" readonly></label>
          <label>Validez (días)<input type="number" id="quoteValidez" min="0" value="${cotizacionActual.validezDias}"></label>
          <label>Estado<select id="quoteEstado">${opcionesEstados(cotizacionActual.estado)}</select></label>
        </div>
        <div class="actions">
          <button type="button" data-quote-action="guardar">Guardar borrador</button>
          <button type="button" class="secondary" data-quote-action="nueva">Nueva cotización</button>
        </div>
      </section>

      <section class="quote-editor-block">
        <div class="quote-editor-section-heading"><div><h3>Productos y servicios</h3><p>Agrega precios comerciales sin modificar los cálculos internos.</p></div><div class="actions"><button type="button" data-quote-action="agregar-calculo">Agregar cálculo actual</button><button type="button" class="secondary" data-quote-action="mostrar-item-form">+ Agregar producto o servicio</button></div></div>
        <div id="quoteItemsEditor"></div>
        <form id="quoteItemForm" class="quote-item-form" hidden>
          <input type="hidden" id="quoteItemId">
          <div class="field-grid">
            <label>Tipo<select id="quoteItemTipo">${opcionesTipos()}</select></label>
            <label>Descripción<input type="text" id="quoteItemDescripcion" required></label>
            <label class="field-wide">Detalle opcional<textarea id="quoteItemDetalle" rows="2"></textarea></label>
            <label>Cantidad<input type="number" id="quoteItemCantidad" min="0" step="any" value="1" required></label>
            <label>Precio unitario<input type="number" id="quoteItemPrecio" min="0" step="any" value="0" required></label>
          </div>
          <div class="actions"><button type="submit">Guardar línea</button><button type="button" class="secondary" data-quote-action="cancelar-item">Cancelar</button></div>
        </form>
      </section>

      <section class="quote-editor-block quote-commercial-totals">
        <div>
          <h3>Totales comerciales</h3>
          <div class="field-grid">
            <label>Descuento<select id="quoteDescuentoTipo"><option value="sin" ${cotizacionActual.descuento.tipo === "sin" ? "selected" : ""}>Sin descuento</option><option value="porcentaje" ${cotizacionActual.descuento.tipo === "porcentaje" ? "selected" : ""}>Porcentaje</option><option value="monto" ${cotizacionActual.descuento.tipo === "monto" ? "selected" : ""}>Monto fijo</option></select></label>
            <label>Valor del descuento<input type="number" id="quoteDescuentoValor" min="0" step="any" value="${cotizacionActual.descuento.valor}"></label>
            <label>Envío adicional<input type="number" id="quoteEnvio" min="0" step="any" value="${cotizacionActual.envio}"></label>
            <label>Abono<select id="quoteAbonoTipo"><option value="sin" ${cotizacionActual.tipoAbono === "sin" ? "selected" : ""}>Sin abono</option><option value="porcentaje" ${cotizacionActual.tipoAbono === "porcentaje" ? "selected" : ""}>Porcentaje</option><option value="monto" ${cotizacionActual.tipoAbono === "monto" ? "selected" : ""}>Monto fijo</option></select></label>
            <label>Porcentaje de abono<input type="number" id="quoteAbonoPorcentaje" min="0" max="100" step="any" value="${cotizacionActual.porcentajeAbono}"></label>
            <label>Monto de abono<input type="number" id="quoteAbonoMonto" min="0" step="any" value="${cotizacionActual.montoAbono}"></label>
          </div>
        </div>
        <div id="quoteTotalsSummary" class="quote-totals-summary"></div>
      </section>

      <details class="quote-editor-block quote-conditions-editor">
        <summary>Condiciones y observaciones</summary>
        <div class="field-grid">
          <label>Tiempo de entrega<input type="text" id="quoteTiempoEntrega" value="${escapar(cotizacionActual.tiempoEntrega)}"></label>
          <label class="field-wide">Condiciones de pago<textarea id="quoteCondicionesPago" rows="3">${escapar(cotizacionActual.condicionesPago)}</textarea></label>
          <label class="field-wide">Observaciones<textarea id="quoteObservaciones" rows="3">${escapar(cotizacionActual.observaciones)}</textarea></label>
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
      datosNegocio: opciones.obtenerDatosNegocio?.() || cotizacionActual.datosNegocio
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
      if (mostrar) mensaje("Agrega al menos un producto o servicio antes de guardar.", true);
      return null;
    }
    const guardada = window.CotizacionesPrecio3D.guardarCotizacion(cotizacionActual);
    if (guardada) {
      cotizacionActual = guardada;
      renderizarEditor();
      renderizarListado();
      if (mostrar) mensaje("Cotización guardada correctamente.");
    }
    return guardada;
  }

  function nuevaCotizacion() {
    cotizacionActual = null;
    asegurarActual();
    renderizarEditor();
    const vista = $("#cotizacionClienteVista");
    if (vista) { vista.hidden = true; vista.innerHTML = ""; }
    mensaje("Nueva cotización preparada. Agrega productos o servicios para comenzar.");
    return cotizacionActual;
  }

  function agregarCalculoActual() {
    const calculo = opciones.obtenerCalculoActual?.();
    if (!calculo?.datos || !calculo?.resultado || calculo.resultado.precioNeto === null) {
      mensaje("Primero realiza un cálculo válido para agregarlo a la cotización.", true);
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
    mensaje("Cálculo agregado como línea comercial. El cálculo original no fue modificado.");
    return cotizacionActual;
  }

  function agregarTrabajo(trabajo) {
    if (!trabajo) return null;
    const usarVendido = numero(trabajo.precioVendidoReal) > 0
      && confirm("Este trabajo tiene un precio vendido real. ¿Quieres usarlo en lugar del precio cotizado?");
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
    mensaje("Trabajo agregado a la cotización sin cambiar su estado.");
    window.NavegacionPrecio3D?.mostrarSeccion?.("cotizacion-cliente", { enfocar: true });
    return cotizacionActual;
  }

  function clienteCotizacion(cotizacion) {
    const snapshot = cotizacion.snapshotCliente || {};
    return {
      nombre: snapshot.nombre || snapshot.clienteCotizacion || "Cliente no especificado",
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

  function renderizarVistaPrevia() {
    leerEditor();
    if (!cotizacionActual?.items.length) {
      mensaje("Agrega al menos un producto o servicio para generar la cotización.", true);
      return false;
    }
    const vista = $("#cotizacionClienteVista");
    if (!vista) return false;
    const negocio = opciones.obtenerDatosNegocio?.() || cotizacionActual.datosNegocio || {};
    const cliente = clienteCotizacion(cotizacionActual);
    const t = window.CotizacionesPrecio3D.calcularTotales(cotizacionActual);
    const fechaValidez = new Date(cotizacionActual.fechaCreacion);
    fechaValidez.setDate(fechaValidez.getDate() + cotizacionActual.validezDias);
    vista.hidden = false;
    vista.innerHTML = `
      <article class="print-quote">
        <header class="print-quote__header"><div class="print-quote__title"><h2>Cotización</h2><h3>${escapar(negocio.nombreNegocio || "Nombre del negocio")}</h3></div><div class="print-quote__meta">${lineaDato("N°", cotizacionActual.numeroCotizacion)}${lineaDato("Fecha", fecha(cotizacionActual.fechaCreacion))}${lineaDato("Válida hasta", fecha(fechaValidez))}${lineaDato("Moneda", cotizacionActual.moneda)}</div></header>
        <section class="print-quote__commercial">
          <div class="print-quote__party"><h3>Datos de quien cotiza</h3>${lineaDato("Nombre", negocio.nombreNegocio)}${lineaDato("RUT / ID", negocio.rutNegocio)}${lineaDato("Contacto", negocio.telefonoNegocio)}${lineaDato("Correo", negocio.correoNegocio)}${lineaDato("Dirección", negocio.direccionNegocio)}${lineaDato("Sitio web", negocio.sitioWebNegocio)}${lineaDato("Instagram", negocio.instagramNegocio)}</div>
          <div class="print-quote__party"><h3>Datos del cliente</h3>${lineaDato("Cliente", cliente.nombre)}${lineaDato("Empresa", cliente.empresa)}${lineaDato("RUT / ID", cliente.rut)}${lineaDato("Contacto", cliente.telefono)}${lineaDato("Correo", cliente.correo)}${lineaDato("Dirección", cliente.direccion)}</div>
        </section>
        <section class="print-quote__section"><h3>Detalle</h3><table class="print-quote__table"><thead><tr><th>Descripción</th><th>Cantidad</th><th>Precio unitario</th><th>Total</th></tr></thead><tbody>${cotizacionActual.items.map((item) => `<tr><td><strong>${escapar(item.descripcion)}</strong>${item.detalle ? `<br><small>${escapar(item.detalle)}</small>` : ""}</td><td>${item.cantidad}</td><td>${moneda(item.precioUnitario)}</td><td>${item.tipo === "Descuento de línea" ? "−" : ""}${moneda(item.totalLinea)}</td></tr>`).join("")}</tbody></table>
          <dl class="print-quote__totals"><div><dt>Subtotal</dt><dd>${moneda(t.subtotal)}</dd></div>${t.descuentoTotal ? `<div><dt>Descuento</dt><dd>−${moneda(t.descuentoTotal)}</dd></div>` : ""}${t.envio ? `<div><dt>Envío</dt><dd>${moneda(t.envio)}</dd></div>` : ""}<div class="print-quote__grand-total"><dt>Total final</dt><dd>${moneda(t.totalFinal)}</dd></div>${t.montoAbono ? `<div><dt>Abono requerido</dt><dd>${moneda(t.montoAbono)}</dd></div><div><dt>Saldo</dt><dd>${moneda(t.saldo)}</dd></div>` : ""}</dl>
          ${cotizacionActual.items.every((item) => item.precioIncluyeImpuesto) ? '<p class="print-quote__tax-note">Impuestos incluidos.</p>' : ""}
        </section>
        <section class="print-quote__section print-quote__conditions"><h3>Condiciones</h3>${lineaDato("Entrega", cotizacionActual.tiempoEntrega)}${lineaDato("Pago", cotizacionActual.condicionesPago)}${lineaDato("Observaciones", cotizacionActual.observaciones)}</section>
      </article>`;
    mensaje("Vista previa de cotización generada.");
    return true;
  }

  function imprimir() {
    if (!renderizarVistaPrevia()) return false;
    const titulo = document.title;
    document.title = cotizacionActual.numeroCotizacion || "Cotización";
    window.addEventListener("afterprint", () => { document.title = titulo; }, { once: true });
    window.print();
    setTimeout(() => { document.title = titulo; }, 1500);
    return true;
  }

  function convertirEnTrabajo(cotizacion = cotizacionActual) {
    if (!cotizacion) return null;
    if (cotizacion.trabajoId) {
      mensaje(`Esta cotización ya fue convertida en el trabajo ${cotizacion.trabajoId}.`, true);
      return null;
    }
    if (!confirm(`¿Convertir ${cotizacion.numeroCotizacion} en un trabajo?`)) return null;
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
      mensaje("No se pudo crear el trabajo.", true);
      return null;
    }
    let actualizada = window.CotizacionesPrecio3D.cambiarEstado(cotizacion, "Convertida en trabajo", `Trabajo ${trabajo.id}`);
    actualizada.trabajoId = trabajo.id;
    cotizacionActual = window.CotizacionesPrecio3D.guardarCotizacion(actualizada);
    window.PanelTrabajosPrecio3D?.renderizar?.();
    renderizarEditor();
    renderizarListado();
    mensaje("Cotización convertida en trabajo. No se crearán duplicados automáticamente.");
    return trabajo;
  }

  function badgeEstado(cotizacion) {
    const vencida = window.CotizacionesPrecio3D.estaVencida(cotizacion);
    return `<span class="quote-status-badge ${vencida ? "is-expired" : ""}">${vencida ? "Vencida (visual)" : escapar(cotizacion.estado)}</span>`;
  }

  function filaCotizacion(cotizacion) {
    const cliente = clienteCotizacion(cotizacion);
    return `<tr data-quote-id="${escapar(cotizacion.id)}"><td><strong>${escapar(cotizacion.numeroCotizacion)}</strong></td><td>${escapar(cliente.nombre)}</td><td>${escapar(fecha(cotizacion.fechaCreacion))}</td><td>${moneda(cotizacion.totalFinal, cotizacion.moneda)}</td><td>${badgeEstado(cotizacion)}</td><td>${cotizacion.validezDias} días</td><td><details class="job-row-actions"><summary>Acciones</summary><div><button type="button" data-quote-list-action="abrir">Abrir / editar</button><button type="button" data-quote-list-action="duplicar">Duplicar</button><button type="button" data-quote-list-action="imprimir">Imprimir</button>${cotizacion.trabajoId ? '<button type="button" data-quote-list-action="ver-trabajo">Ver trabajo relacionado</button>' : '<button type="button" data-quote-list-action="convertir">Convertir en trabajo</button>'}<button type="button" class="danger-button" data-quote-list-action="eliminar">Eliminar</button></div></details></td></tr>`;
  }

  function renderizarListado() {
    const contenedor = $("#cotizacionesDashboard");
    if (!contenedor) return;
    const lista = window.CotizacionesPrecio3D.cargarCotizaciones();
    contenedor.innerHTML = `
      <div class="quotes-list-toolbar actions"><button type="button" data-quote-list-action="nueva">Nueva cotización</button><button type="button" class="secondary" data-quote-list-action="exportar-json">Exportar JSON</button><button type="button" class="secondary" data-quote-list-action="exportar-csv">Exportar CSV</button><button type="button" class="secondary" data-quote-list-action="importar-json">Importar JSON</button><input type="file" id="quoteImportInput" accept="application/json,.json" hidden></div>
      ${lista.length ? `<div class="quotes-table-wrap"><table class="quotes-table"><thead><tr><th>Número</th><th>Cliente</th><th>Fecha</th><th>Total</th><th>Estado</th><th>Validez</th><th>Acciones</th></tr></thead><tbody>${lista.map(filaCotizacion).join("")}</tbody></table></div>` : '<p class="empty-state">Aún no has guardado cotizaciones comerciales.</p>'}`;
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
    if (accion === "nueva") nuevaCotizacion();
    if (accion === "agregar-calculo") agregarCalculoActual();
    if (accion === "mostrar-item-form") $("#quoteItemForm").hidden = false;
    if (accion === "cancelar-item") { $("#quoteItemForm").reset(); $("#quoteItemId").value = ""; $("#quoteItemForm").hidden = true; }
    if (accion === "eliminar-item" && confirm("¿Eliminar esta línea de la cotización?")) cotizacionActual = window.CotizacionesPrecio3D.eliminarItem(cotizacionActual, itemId);
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
      mensaje("Completa descripción, cantidad y precio con valores válidos.", true);
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
    mensaje("Línea comercial actualizada.");
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
    if (accion === "abrir") abrirCotizacion(id);
    if (accion === "duplicar") { const nueva = window.CotizacionesPrecio3D.duplicarCotizacion(id); if (nueva) abrirCotizacion(nueva.id); }
    if (accion === "imprimir") { abrirCotizacion(id); imprimir(); }
    if (accion === "convertir") convertirEnTrabajo(window.CotizacionesPrecio3D.obtenerCotizacion(id));
    if (accion === "ver-trabajo") window.NavegacionPrecio3D?.mostrarSeccion?.("trabajos", { enfocar: true });
    if (accion === "eliminar" && confirm("¿Eliminar esta cotización?")) { window.CotizacionesPrecio3D.eliminarCotizacion(id); renderizarListado(); }
    if (accion === "exportar-json") descargar("cotizaciones-impresion-3d.json", "\uFEFF" + window.CotizacionesPrecio3D.exportarJSON());
    if (accion === "exportar-csv") descargar("cotizaciones-impresion-3d.csv", cotizacionesCSV(), "text/csv;charset=utf-8");
    if (accion === "importar-json") $("#quoteImportInput")?.click();
  }

  async function manejarImportacion(event) {
    if (event.target.id !== "quoteImportInput" || !event.target.files[0]) return;
    const contenido = await event.target.files[0].text();
    const combinar = confirm("Aceptar: combinar con las cotizaciones actuales.\nCancelar: reemplazar la lista actual.");
    const importadas = window.CotizacionesPrecio3D.importarJSON(contenido.replace(/^\uFEFF/, ""), combinar);
    alert(importadas ? `${importadas.length} cotizaciones disponibles.` : "El archivo no tiene un formato válido.");
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
    $("#misCotizacionesPanel")?.addEventListener("change", manejarImportacion);
    document.addEventListener("precio3d:agregar-calculo-cotizacion", agregarCalculoActual);
    document.addEventListener("precio3d:datos-cotizacion-guardados", () => {
      if (!cotizacionActual) return;
      cotizacionActual.datosNegocio = opciones.obtenerDatosNegocio?.() || cotizacionActual.datosNegocio;
      cotizacionActual.snapshotCliente = snapshotDesdeFormulario() || cotizacionActual.snapshotCliente;
      const condiciones = opciones.obtenerCondiciones?.() || {};
      cotizacionActual.validezDias = condiciones.validezCotizacionDias ?? cotizacionActual.validezDias;
      cotizacionActual.tiempoEntrega = condiciones.tiempoEntrega || cotizacionActual.tiempoEntrega;
      cotizacionActual.condicionesPago = condiciones.condicionesPago || cotizacionActual.condicionesPago;
      cotizacionActual.observaciones = condiciones.observacionesCotizacion || cotizacionActual.observaciones;
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

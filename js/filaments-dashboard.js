(function () {
  "use strict";

  const $ = (selector, base = document) => base.querySelector(selector);
  const api = () => window.FilamentosPrecio3D;
  let detalleId = "";
  let retornoFoco = null;
  let modalActivo = null;
  let inicializado = false;
  const t = (clave, reemplazos = {}) =>
    window.obtenerTextoI18n?.(clave, reemplazos) || clave;

  function escapar(valor) {
    return String(valor ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
  }

  function numero(id) {
    const valor = Number($(id)?.value);
    return Number.isFinite(valor) && valor >= 0 ? valor : 0;
  }

  function fecha(valor) {
    if (!valor) return t("sinRegistrar");
    const fechaValor = new Date(valor);
    return Number.isNaN(fechaValor.getTime())
      ? escapar(valor)
      : new Intl.DateTimeFormat(document.documentElement.lang || "es", { dateStyle: "medium" }).format(fechaValor);
  }

  function formatoMoneda(valor, moneda = "CLP") {
    try {
      return window.formatearMonedaPrecio3D?.(valor, moneda)
        || new Intl.NumberFormat("es-CL", { style: "currency", currency: moneda }).format(valor);
    } catch (_error) {
      return `${moneda} ${Number(valor || 0).toLocaleString("es-CL")}`;
    }
  }

  function formatoGramos(valor) {
    return `${Number(valor || 0).toLocaleString(document.documentElement.lang || "es", { maximumFractionDigits: 2 })} g`;
  }

  function nombreBobina(bobina) {
    return bobina?.nombre || [bobina?.materialNombre, bobina?.colorNombre].filter(Boolean).join(" ") || t("bobinaSinNombre");
  }

  function estadoVisible(estado) {
    return t({
      Sellada: "sellada",
      "En uso": "enUso",
      Agotada: "agotada",
      Archivada: "archivada"
    }[estado] || "estado");
  }

  function estaAgotada(bobina) {
    return Number(bobina?.pesoRestanteGramos || 0) <= 0 || bobina?.estado === "Agotada";
  }

  function materialesDisponibles() {
    const sugeridos = [
      "PLA", "PLA+", "PLA Silk", "PLA Matte", "PLA-CF", "PETG", "PETG-CF", "ABS",
      "ASA", "TPU", "Nylon", "PC", "PVA", "HIPS", "Otro personalizado"
    ];
    const presets = (window.PresetsPrecio3D?.materiales || []).map((item) => item.nombre);
    return [...new Set([...presets, ...sugeridos])].sort((a, b) => a.localeCompare(b, "es"));
  }

  function idMaterial(nombre) {
    const preset = (window.PresetsPrecio3D?.materiales || []).find((item) => item.nombre === nombre);
    return preset?.id || nombre.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  }

  function poblarMateriales(seleccion = "PLA") {
    const select = $("#filamentoMaterial");
    if (!select) return;
    select.innerHTML = materialesDisponibles().map((nombre) => {
      const id = idMaterial(nombre);
      const preset = (window.PresetsPrecio3D?.materiales || []).find((item) => item.id === id);
      const visible = preset ? window.PresetsPrecio3D.obtenerNombrePreset?.("materiales", preset) || nombre : nombre;
      return `<option value="${escapar(id)}" data-nombre-base="${escapar(nombre)}" ${nombre === seleccion || id === seleccion ? "selected" : ""}>${escapar(visible)}</option>`;
    }).join("");
  }

  function poblarMonedas(seleccion = "CLP") {
    const select = $("#filamentoMoneda");
    if (!select) return;
    select.innerHTML = (window.MonedasPrecio3D || []).map((moneda) => `
      <option value="${escapar(moneda.codigo)}" ${moneda.codigo === seleccion ? "selected" : ""}>
        ${escapar(moneda.codigo)} · ${escapar(moneda.nombre)}
      </option>
    `).join("");
  }

  function mostrarMensaje(texto, error = false) {
    const elemento = $("#filamentosMessage");
    if (!elemento) return;
    elemento.textContent = texto;
    elemento.classList.toggle("storage-error", error);
    elemento.classList.toggle("storage-success", !error && Boolean(texto));
  }

  function renderizarResumen() {
    const bobinas = (api()?.obtenerBobinas() || []).filter((bobina) => bobina.estado !== "Archivada");
    const contenedor = $("#filamentosResumen");
    if (!contenedor) return;
    const items = [
      [t("totalBobinas"), bobinas.length],
      [t("enUso"), bobinas.filter((bobina) => bobina.estado === "En uso").length],
      [t("stockBajo"), bobinas.filter((bobina) => !estaAgotada(bobina) && api().tieneStockBajo(bobina)).length],
      [t("agotadas"), bobinas.filter(estaAgotada).length]
    ];
    contenedor.innerHTML = items.map(([etiqueta, valor]) => `
      <article class="jobs-kpi-card"><span>${escapar(etiqueta)}</span><strong>${escapar(valor)}</strong></article>
    `).join("");
  }

  function renderizarFiltros() {
    const bobinas = api()?.obtenerBobinas() || [];
    const materialActual = $("#filamentosMaterialFiltro")?.value || "";
    const marcaActual = $("#filamentosMarcaFiltro")?.value || "";
    const materiales = [...new Map(bobinas.map((item) => [item.materialId, item.materialNombre])).entries()]
      .sort((a, b) => a[1].localeCompare(b[1], "es"));
    const marcas = [...new Set(bobinas.map((item) => item.marca).filter(Boolean))].sort((a, b) => a.localeCompare(b, "es"));
    $("#filamentosMaterialFiltro").innerHTML = `<option value="">${escapar(t("todos"))}</option>` + materiales
      .map(([id, nombre]) => `<option value="${escapar(id)}">${escapar(nombre)}</option>`).join("");
    $("#filamentosMarcaFiltro").innerHTML = `<option value="">${escapar(t("todas"))}</option>` + marcas
      .map((marca) => `<option value="${escapar(marca)}">${escapar(marca)}</option>`).join("");
    $("#filamentosMaterialFiltro").value = materiales.some(([id]) => id === materialActual) ? materialActual : "";
    $("#filamentosMarcaFiltro").value = marcas.includes(marcaActual) ? marcaActual : "";
  }

  function barraStock(bobina) {
    const porcentaje = api().calcularPorcentajeRestante(bobina);
    return `
      <div class="filament-progress" role="progressbar" aria-label="${escapar(t("porcentajeFilamentoRestante"))}"
        aria-valuemin="0" aria-valuemax="100" aria-valuenow="${porcentaje.toFixed(1)}">
        <span style="width:${porcentaje}%"></span>
      </div>
      <small>${porcentaje.toLocaleString(document.documentElement.lang || "es", { maximumFractionDigits: 1 })}%</small>
    `;
  }

  function etiquetaStock(bobina) {
    if (estaAgotada(bobina)) {
      return `<span class="filament-stock-alert filament-stock-alert--empty">${escapar(t("sinStockDisponible"))}</span>`;
    }
    return api().tieneStockBajo(bobina)
      ? `<span class="filament-stock-alert filament-stock-alert--low">${escapar(t("stockBajo"))}</span>`
      : "";
  }

  function accionesFila(bobina) {
    return `
      <div class="filament-row-actions">
        <button type="button" data-filament-action="stock">${escapar(t("ajustarStock"))}</button>
        <button type="button" class="secondary" data-filament-action="detalle">${escapar(t("verDetalle"))}</button>
        <details class="filament-secondary-actions">
          <summary>${escapar(t("masAcciones"))}</summary>
          <div>
            <button type="button" class="secondary" data-filament-action="editar">${escapar(t("editar"))}</button>
            <button type="button" class="secondary" data-filament-action="duplicar">${escapar(t("duplicar"))}</button>
            ${bobina.estado !== "Archivada" ? `<button type="button" class="secondary" data-filament-action="archivar">${escapar(t("archivar"))}</button>` : ""}
            <button type="button" class="secondary danger-button" data-filament-action="eliminar">${escapar(t("eliminar"))}</button>
          </div>
        </details>
      </div>
    `;
  }

  function obtenerListaFiltrada() {
    const buscadas = api().buscarBobinas($("#filamentosBusqueda")?.value || "");
    const lista = api().filtrarBobinas(buscadas, {
      estado: $("#filamentosEstadoFiltro")?.value || "activas",
      material: $("#filamentosMaterialFiltro")?.value || "",
      marca: $("#filamentosMarcaFiltro")?.value || "",
      orden: $("#filamentosOrden")?.value || "recientes"
    });
    const stock = $("#filamentosStockFiltro")?.value || "todas";
    if (stock === "disponibles") return lista.filter((bobina) => !estaAgotada(bobina));
    if (stock === "stock_bajo") return lista.filter((bobina) => !estaAgotada(bobina) && api().tieneStockBajo(bobina));
    if (stock === "agotadas") return lista.filter(estaAgotada);
    return lista;
  }

  function renderizarListado() {
    const contenedor = $("#filamentosListado");
    if (!contenedor) return;
    const lista = obtenerListaFiltrada();
    if (!lista.length) {
      const tieneRegistros = Boolean(api()?.obtenerBobinas().length);
      contenedor.innerHTML = `
        <div class="printer-empty-state">
          <strong>${escapar(t(tieneRegistros ? "sinBobinasFiltros" : "sinBobinas"))}</strong>
          <p>${escapar(t(tieneRegistros ? "pruebaOtroFiltro" : "agregaBobinaAyuda"))}</p>
          <button type="button" data-filament-action="${tieneRegistros ? "limpiar-filtros" : "nueva"}">
            ${escapar(t(tieneRegistros ? "limpiarFiltros" : "agregarPrimeraBobina"))}
          </button>
        </div>
      `;
      return;
    }
    contenedor.innerHTML = `
      <div class="filaments-table-scroll">
        <table class="filaments-table">
          <thead><tr><th>${escapar(t("bobinaYColor"))}</th><th>${escapar(t("marcaMaterialVariante"))}</th><th>${escapar(t("stockRestante"))}</th><th>${escapar(t("progreso"))}</th>
            <th>${escapar(t("estado"))}</th><th>${escapar(t("costoPorGramo"))}</th><th>${escapar(t("ubicacion"))}</th><th>${escapar(t("acciones"))}</th></tr></thead>
          <tbody>${lista.map((bobina) => `
            <tr data-filament-id="${escapar(bobina.id)}">
              <td data-label="${escapar(t("bobinaYColor"))}">
                <span class="filament-color-line">${bobina.colorHex ? `<i style="background:${escapar(bobina.colorHex)}"></i>` : ""}
                  <span><strong>${escapar(nombreBobina(bobina))}</strong><small>${escapar(bobina.colorNombre || t("colorSinRegistrar"))}</small></span>
                </span>
              </td>
              <td data-label="${escapar(t("marcaMaterialVariante"))}"><strong>${escapar(bobina.materialNombre)}</strong><small>${escapar([bobina.marca, bobina.varianteMaterial].filter(Boolean).join(" · ") || t("sinRegistrar"))}</small></td>
              <td data-label="${escapar(t("stockRestante"))}"><strong>${formatoGramos(bobina.pesoRestanteGramos)}</strong> ${escapar(t("dePesoInicial", { peso: formatoGramos(bobina.pesoNetoInicialGramos) }))}${etiquetaStock(bobina)}</td>
              <td data-label="${escapar(t("progreso"))}">${barraStock(bobina)}</td>
              <td data-label="${escapar(t("estado"))}"><span class="printer-status">${escapar(estadoVisible(bobina.estado))}</span></td>
              <td data-label="${escapar(t("costoPorGramo"))}"><strong>${escapar(formatoMoneda(api().calcularCostoPorGramo(bobina), bobina.monedaCompra))}</strong><small>${escapar(bobina.monedaCompra)}</small></td>
              <td data-label="${escapar(t("ubicacion"))}">${escapar(bobina.ubicacion || t("sinRegistrar"))}</td>
              <td data-label="${escapar(t("acciones"))}">${accionesFila(bobina)}</td>
            </tr>
          `).join("")}</tbody>
        </table>
      </div>
    `;
  }

  function renderizarDetalle(id = detalleId) {
    const panel = $("#filamentoDetallePanel");
    const bobina = api()?.obtenerBobinaPorId(id);
    detalleId = bobina?.id || "";
    if (!panel || !bobina) {
      if (panel) panel.hidden = true;
      return;
    }
    const movimientos = [...bobina.movimientos].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    const tipoMovimiento = (tipo) => t({
      inicial: "movimientoInicial",
      consumo_manual: "registrarConsumo",
      consumo_trabajo: "consumoTrabajo",
      reversion_consumo_trabajo: "reversionConsumoTrabajo",
      correccion: "correccionStock",
      ajuste_entrada: "registrarEntrada",
      ajuste_salida: "registrarSalida",
      edicion_manual: "edicionManual"
    }[tipo] || "movimientoStock");
    panel.dataset.filamentId = bobina.id;
    panel.hidden = false;
    panel.innerHTML = `
      <div class="client-detail-heading">
        <div><p class="eyebrow">${escapar(t("detalleBobina"))}</p><h3>${escapar(nombreBobina(bobina))}</h3>${etiquetaStock(bobina)}</div>
        <div class="filament-detail-actions">
          <button type="button" data-filament-action="stock">${escapar(t("ajustarStock"))}</button>
          <button type="button" class="secondary" data-filament-action="editar">${escapar(t("editar"))}</button>
          <button type="button" class="secondary" data-filament-action="duplicar">${escapar(t("duplicar"))}</button>
          ${bobina.estado !== "Archivada" ? `<button type="button" class="secondary" data-filament-action="archivar">${escapar(t("archivar"))}</button>` : ""}
          <button type="button" class="danger-button" data-filament-action="eliminar">${escapar(t("eliminar"))}</button>
        </div>
      </div>
      <div class="filament-detail-grid">
        <section><h4>${escapar(t("identificacion"))}</h4><p><strong>${escapar(t("marca"))}:</strong> ${escapar(bobina.marca || t("sinRegistrar"))}</p><p><strong>${escapar(t("material"))}:</strong> ${escapar(bobina.materialNombre)}</p><p><strong>${escapar(t("variante"))}:</strong> ${escapar(bobina.varianteMaterial || t("sinRegistrar"))}</p><p><strong>${escapar(t("color"))}:</strong> ${escapar(bobina.colorNombre || t("sinRegistrar"))}</p><p><strong>${escapar(t("diametro"))}:</strong> ${escapar(bobina.diametroMm)} mm</p></section>
        <section><h4>${escapar(t("stock"))}</h4><p><strong>${escapar(t("inicial"))}:</strong> ${formatoGramos(bobina.pesoNetoInicialGramos)}</p><p><strong>${escapar(t("restante"))}:</strong> ${formatoGramos(bobina.pesoRestanteGramos)}</p>${barraStock(bobina)}<p><strong>${escapar(t("tara"))}:</strong> ${formatoGramos(bobina.pesoTaraGramos)}</p><p><strong>${escapar(t("minimo"))}:</strong> ${formatoGramos(bobina.stockMinimoGramos)}</p></section>
        <section><h4>${escapar(t("costo"))}</h4><p><strong>${escapar(t("modo"))}:</strong> ${escapar(t(bobina.modoCosto === "precio_kilo" ? "precioPorKilo" : "precioTotalBobina"))}</p><p><strong>${escapar(t("precio"))}:</strong> ${escapar(formatoMoneda(bobina.modoCosto === "precio_kilo" ? bobina.precioPorKilo : bobina.precioCompraTotal, bobina.monedaCompra))}</p><p><strong>${escapar(t("costoPorGramo"))}:</strong> ${escapar(formatoMoneda(api().calcularCostoPorGramo(bobina), bobina.monedaCompra))}</p><p><strong>${escapar(t("valorRestante"))}:</strong> ${escapar(formatoMoneda(api().calcularValorRestante(bobina), bobina.monedaCompra))}</p></section>
        <section><h4>${escapar(t("compra"))}</h4><p><strong>${escapar(t("proveedor"))}:</strong> ${escapar(bobina.proveedor || t("sinRegistrar"))}</p><p><strong>${escapar(t("lote"))}:</strong> ${escapar(bobina.loteSku || t("sinRegistrar"))}</p><p><strong>${escapar(t("ubicacion"))}:</strong> ${escapar(bobina.ubicacion || t("sinRegistrar"))}</p><p><strong>${escapar(t("compra"))}:</strong> ${fecha(bobina.fechaCompra)}</p><p><strong>${escapar(t("apertura"))}:</strong> ${fecha(bobina.fechaApertura)}</p></section>
      </div>
      <section class="filament-movements"><h4>${escapar(t("movimientosStock"))}</h4>
        ${movimientos.length ? `<div class="filament-movements-scroll"><table><thead><tr><th>${escapar(t("fecha"))}</th><th>${escapar(t("tipo"))}</th><th>${escapar(t("cantidad"))}</th><th>${escapar(t("anterior"))}</th><th>${escapar(t("nuevo"))}</th><th>${escapar(t("referencia"))}</th><th>${escapar(t("nota"))}</th></tr></thead><tbody>${movimientos.map((item) => `<tr><td>${fecha(item.fecha)}</td><td>${escapar(tipoMovimiento(item.tipo))}</td><td>${formatoGramos(item.cantidadGramos)}</td><td>${formatoGramos(item.stockAnterior)}</td><td>${formatoGramos(item.stockNuevo)}</td><td>${escapar(item.referenciaNombre || item.referenciaId || "—")}</td><td>${escapar(item.nota || "—")}</td></tr>`).join("")}</tbody></table></div>` : `<p>${escapar(t("sinMovimientos"))}</p>`}
      </section>
    `;
  }

  function actualizarVista() {
    renderizarResumen();
    renderizarFiltros();
    renderizarListado();
    renderizarDetalle();
  }

  function datosFormulario() {
    const materialSelect = $("#filamentoMaterial");
    return {
      nombre: $("#filamentoNombre").value.trim(),
      marca: $("#filamentoMarca").value.trim(),
      materialId: materialSelect.value,
      materialNombre: materialSelect.options[materialSelect.selectedIndex]?.dataset.nombreBase
        || materialSelect.options[materialSelect.selectedIndex]?.textContent || "",
      varianteMaterial: $("#filamentoVariante").value.trim(),
      colorNombre: $("#filamentoColorNombre").value.trim(),
      colorHex: $("#filamentoColorHex").dataset.touched === "true" ? $("#filamentoColorHex").value : "",
      diametroMm: $("#filamentoDiametro").value,
      pesoNetoInicialGramos: numero("#filamentoPesoInicial"),
      pesoRestanteGramos: numero("#filamentoPesoRestante"),
      pesoTaraGramos: numero("#filamentoTara"),
      stockMinimoGramos: numero("#filamentoStockMinimo"),
      modoCosto: $("#filamentoModoCosto").value,
      precioCompraTotal: numero("#filamentoPrecioTotal"),
      precioPorKilo: numero("#filamentoPrecioKilo"),
      monedaCompra: $("#filamentoMoneda").value,
      proveedor: $("#filamentoProveedor").value.trim(),
      loteSku: $("#filamentoLote").value.trim(),
      ubicacion: $("#filamentoUbicacion").value.trim(),
      fechaCompra: $("#filamentoFechaCompra").value,
      fechaApertura: $("#filamentoFechaApertura").value,
      estado: $("#filamentoEstado").value,
      notas: $("#filamentoNotas").value.trim()
    };
  }

  function limpiarErrores() {
    document.querySelectorAll("[data-filament-error]").forEach((elemento) => { elemento.textContent = ""; });
    $("#filamentoFormMessage").textContent = "";
  }

  function mostrarErrores(errores) {
    limpiarErrores();
    const claves = {
      materialNombre: "errorMaterialFilamento",
      pesoNetoInicialGramos: "errorPesoInicialFilamento",
      modoCosto: "errorModoCostoFilamento",
      precioCompraTotal: "errorPrecioTotalFilamento",
      precioPorKilo: "errorPrecioKiloFilamento",
      monedaCompra: "errorMonedaFilamento"
    };
    Object.entries(errores).forEach(([campo, mensaje]) => {
      const elemento = document.querySelector(`[data-filament-error="${campo}"]`);
      if (elemento) elemento.textContent = claves[campo] ? t(claves[campo]) : mensaje;
    });
    $("#filamentoFormMessage").textContent = t("revisaCamposMarcados");
  }

  function actualizarModoCosto() {
    const porKilo = $("#filamentoModoCosto").value === "precio_kilo";
    $("#filamentoPrecioTotalGrupo").hidden = porKilo;
    $("#filamentoPrecioKiloGrupo").hidden = !porKilo;
    actualizarCostoPreview();
  }

  function actualizarCostoPreview() {
    const datos = datosFormulario();
    const costo = api()?.calcularCostoPorGramo(datos) || 0;
    $("#filamentoCostoGramoPreview").textContent = costo > 0
      ? t("costoPorGramoValor", { costo: formatoMoneda(costo, datos.monedaCompra) })
      : t("completaPesoPrecio");
  }

  function actualizarPesoEstimado() {
    const medido = numero("#filamentoPesoMedido");
    const tara = numero("#filamentoTara");
    const estimado = Math.max(0, medido - tara);
    $("#filamentoPesoEstimado").textContent = medido > 0 ? formatoGramos(estimado) : "—";
    $("#aplicarPesoEstimadoButton").disabled = medido <= 0;
  }

  function abrirModal(modal, focoSelector) {
    retornoFoco = document.activeElement;
    modalActivo = modal;
    modal.hidden = false;
    document.body.classList.add("modal-open");
    window.requestAnimationFrame(() => $(focoSelector, modal)?.focus());
  }

  function cerrarModal(modal) {
    if (!modal || modal.hidden) return;
    modal.hidden = true;
    if (modalActivo === modal) modalActivo = null;
    document.body.classList.remove("modal-open");
    retornoFoco?.focus?.();
    retornoFoco = null;
  }

  function abrirFormulario(bobina = null, duplicada = false) {
    const form = $("#filamentoForm");
    form.reset();
    limpiarErrores();
    const nombreMaterial = bobina?.materialNombre || "PLA";
    poblarMateriales(nombreMaterial);
    poblarMonedas(bobina?.monedaCompra || "CLP");
    $("#filamentoFormId").value = duplicada ? "" : bobina?.id || "";
    $("#filamentoModalTitle").textContent = bobina ? t(duplicada ? "duplicarBobina" : "editarBobina") : t("agregarBobina");
    $("#filamentoNombre").value = duplicada && bobina?.nombre ? t("nombreCopia", { nombre: bobina.nombre }) : bobina?.nombre || "";
    $("#filamentoMarca").value = bobina?.marca || "";
    $("#filamentoVariante").value = bobina?.varianteMaterial || "";
    $("#filamentoColorNombre").value = bobina?.colorNombre || "";
    $("#filamentoColorHex").value = bobina?.colorHex || "#111827";
    $("#filamentoColorHex").dataset.touched = bobina?.colorHex ? "true" : "false";
    $("#filamentoDiametro").value = bobina?.diametroMm || "1.75";
    $("#filamentoPesoInicial").value = bobina?.pesoNetoInicialGramos ?? 1000;
    $("#filamentoPesoRestante").value = duplicada ? bobina?.pesoNetoInicialGramos : bobina?.pesoRestanteGramos ?? 1000;
    $("#filamentoTara").value = bobina?.pesoTaraGramos || "";
    $("#filamentoStockMinimo").value = bobina?.stockMinimoGramos ?? 200;
    $("#filamentoModoCosto").value = bobina?.modoCosto || "precio_total";
    $("#filamentoPrecioTotal").value = bobina?.precioCompraTotal || "";
    $("#filamentoPrecioKilo").value = bobina?.precioPorKilo || "";
    $("#filamentoProveedor").value = bobina?.proveedor || "";
    $("#filamentoLote").value = bobina?.loteSku || "";
    $("#filamentoUbicacion").value = bobina?.ubicacion || "";
    $("#filamentoFechaCompra").value = bobina?.fechaCompra || "";
    $("#filamentoFechaApertura").value = duplicada ? "" : bobina?.fechaApertura || "";
    $("#filamentoEstado").value = duplicada ? "Sellada" : bobina?.estado || "Sellada";
    $("#filamentoNotas").value = duplicada ? "" : bobina?.notas || "";
    $("#filamentoPesoMedido").value = "";
    actualizarModoCosto();
    actualizarPesoEstimado();
    abrirModal($("#filamentoModal"), "#filamentoNombre");
  }

  function guardarFormulario(event) {
    event.preventDefault();
    const datos = datosFormulario();
    const errores = api().validarBobina(datos);
    if (Object.keys(errores).length) {
      mostrarErrores(errores);
      return;
    }
    if (datos.pesoRestanteGramos > datos.pesoNetoInicialGramos && !confirm(t("confirmarStockSuperiorInicial"))) return;
    const id = $("#filamentoFormId").value;
    const guardada = id ? api().actualizarBobina(id, datos) : api().crearBobina(datos);
    if (!guardada) {
      $("#filamentoFormMessage").textContent = t("bobinaNoGuardada");
      return;
    }
    detalleId = guardada.id;
    cerrarModal($("#filamentoModal"));
    actualizarVista();
    renderizarDetalle(guardada.id);
    mostrarMensaje(t(id ? "bobinaActualizada" : "bobinaGuardada"));
  }

  function abrirAjuste(bobina) {
    $("#filamentoStockForm").reset();
    $("#filamentoStockId").value = bobina.id;
    $("#filamentoStockModalTitle").textContent = t("ajustarStock");
    $("#filamentoStockNombre").textContent = nombreBobina(bobina);
    $("#filamentoStockActual").textContent = t("stockActualValor", { stock: formatoGramos(bobina.pesoRestanteGramos) });
    $("#filamentoStockMessage").textContent = "";
    actualizarEtiquetaAjuste();
    abrirModal($("#filamentoStockModal"), "#filamentoStockTipo");
  }

  function actualizarEtiquetaAjuste() {
    const tipo = $("#filamentoStockTipo").value;
    const establece = tipo === "correccion";
    $("#filamentoStockCantidadLabel").textContent = t(establece ? "nuevoPesoRestante" : "cantidadGramos");
    $("#filamentoStockTipoAyuda").textContent = t({
      consumo_manual: "consumoManualAyuda",
      correccion: "correccionStockAyuda",
      ajuste_entrada: "entradaStockAyuda",
      ajuste_salida: "salidaStockAyuda"
    }[tipo] || "movimientoStock");
  }

  function guardarAjuste(event) {
    event.preventDefault();
    const id = $("#filamentoStockId").value;
    const tipo = $("#filamentoStockTipo").value;
    const cantidad = numero("#filamentoStockCantidad");
    const ajuste = {
      tipo,
      cantidadGramos: cantidad,
      stockNuevo: tipo === "correccion" ? cantidad : undefined,
      nota: $("#filamentoStockNota").value.trim()
    };
    let resultado = api().ajustarStock(id, ajuste);
    if (resultado.requiereConfirmacion && confirm(t("confirmarAjusteSobreInicial"))) {
      resultado = api().ajustarStock(id, ajuste, { permitirSobreInicial: true });
    }
    if (!resultado.ok) {
      const claveError = resultado.error?.includes("no encontrada")
        ? "bobinaNoEncontrada"
        : resultado.error?.includes("negativo")
          ? "stockNegativo"
          : resultado.requiereConfirmacion
            ? "stockSuperiorInicial"
            : "stockNoAjustado";
      $("#filamentoStockMessage").textContent = t(claveError);
      return;
    }
    if (resultado.sugerirEstado && confirm(t("confirmarMarcarAgotada"))) {
      api().actualizarBobina(id, { estado: "Agotada" });
    }
    detalleId = id;
    cerrarModal($("#filamentoStockModal"));
    actualizarVista();
    mostrarMensaje(t("movimientoStockRegistrado"));
  }

  function idDesdeAccion(boton) {
    return boton.closest("[data-filament-id]")?.dataset.filamentId
      || boton.closest("#filamentoDetallePanel")?.dataset.filamentId || "";
  }

  function limpiarFiltros() {
    $("#filamentosBusqueda").value = "";
    $("#filamentosMaterialFiltro").value = "";
    $("#filamentosEstadoFiltro").value = "activas";
    $("#filamentosStockFiltro").value = "todas";
    $("#filamentosMarcaFiltro").value = "";
    $("#filamentosOrden").value = "nombre";
    renderizarListado();
  }

  function manejarAccion(event) {
    const boton = event.target.closest("[data-filament-action]");
    if (!boton) return;
    const accion = boton.dataset.filamentAction;
    const id = idDesdeAccion(boton);
    const bobina = id ? api().obtenerBobinaPorId(id) : null;
    if (accion === "nueva") abrirFormulario();
    if (accion === "limpiar-filtros") limpiarFiltros();
    if (accion === "detalle" && bobina) {
      renderizarDetalle(id);
      $("#filamentoDetallePanel")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    if (accion === "editar" && bobina) abrirFormulario(bobina);
    if (accion === "stock" && bobina) abrirAjuste(bobina);
    if (accion === "duplicar" && bobina) abrirFormulario(bobina, true);
    if (accion === "archivar" && bobina && confirm(t("confirmarArchivarBobina"))) {
      api().archivarBobina(id);
      actualizarVista();
      mostrarMensaje(t("bobinaArchivada"));
    }
    if (accion === "eliminar" && bobina && confirm(t("confirmarEliminarBobina"))) {
      api().eliminarBobina(id);
      detalleId = "";
      actualizarVista();
      mostrarMensaje(t("bobinaEliminada"));
    }
  }

  function descargar(nombre, contenido, tipo) {
    const enlace = document.createElement("a");
    enlace.href = URL.createObjectURL(new Blob([contenido], { type: tipo }));
    enlace.download = nombre;
    document.body.appendChild(enlace);
    enlace.click();
    enlace.remove();
    setTimeout(() => URL.revokeObjectURL(enlace.href), 500);
  }

  async function importarArchivo(event) {
    const archivo = event.target.files?.[0];
    if (!archivo) return;
    const modo = confirm(t("confirmarImportarFilamentos"))
      ? "combinar" : "reemplazar";
    const resultado = api().importarBobinasJSON(await archivo.text(), modo);
    mostrarMensaje(
      resultado.ok
        ? t("filamentosImportados", resultado)
        : t("inventarioFilamentosInvalido"),
      !resultado.ok
    );
    event.target.value = "";
    detalleId = "";
    actualizarVista();
  }

  function manejarTeclado(event) {
    if (event.key === "Escape" && modalActivo) {
      cerrarModal(modalActivo);
      return;
    }
    if (event.key !== "Tab" || !modalActivo) return;
    const focables = [...modalActivo.querySelectorAll('button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled])')]
      .filter((elemento) => !elemento.closest("[hidden]"));
    const primero = focables[0];
    const ultimo = focables.at(-1);
    if (event.shiftKey && document.activeElement === primero) {
      event.preventDefault();
      ultimo?.focus();
    } else if (!event.shiftKey && document.activeElement === ultimo) {
      event.preventDefault();
      primero?.focus();
    }
  }

  function inicializar() {
    if (inicializado || !api() || !$("#inventarioFilamentosPanel")) return;
    inicializado = true;
    $("#nuevaBobinaButton").addEventListener("click", () => abrirFormulario());
    $("#filamentosListado").addEventListener("click", manejarAccion);
    $("#filamentoDetallePanel").addEventListener("click", manejarAccion);
    ["#filamentosBusqueda", "#filamentosEstadoFiltro", "#filamentosMaterialFiltro", "#filamentosStockFiltro", "#filamentosMarcaFiltro", "#filamentosOrden"]
      .forEach((selector) => $(selector).addEventListener(selector === "#filamentosBusqueda" ? "input" : "change", renderizarListado));
    $("#limpiarFiltrosFilamentosButton").addEventListener("click", limpiarFiltros);
    $("#filamentoForm").addEventListener("submit", guardarFormulario);
    $("#filamentoForm").addEventListener("input", actualizarCostoPreview);
    $("#filamentoModoCosto").addEventListener("change", actualizarModoCosto);
    $("#filamentoColorHex").addEventListener("input", (event) => { event.target.dataset.touched = "true"; });
    $("#filamentoPesoInicial").addEventListener("input", (event) => {
      if (!$("#filamentoFormId").value) $("#filamentoPesoRestante").value = event.target.value;
      actualizarCostoPreview();
    });
    $("#filamentoPesoMedido").addEventListener("input", actualizarPesoEstimado);
    $("#filamentoTara").addEventListener("input", actualizarPesoEstimado);
    $("#aplicarPesoEstimadoButton").addEventListener("click", () => {
      const estimado = Math.max(0, numero("#filamentoPesoMedido") - numero("#filamentoTara"));
      if (confirm(t("confirmarAplicarPeso", { peso: formatoGramos(estimado) }))) {
        $("#filamentoPesoRestante").value = estimado;
      }
    });
    $("#filamentoModal").addEventListener("click", (event) => {
      if (event.target.matches("[data-filament-close]")) cerrarModal($("#filamentoModal"));
    });
    $("#filamentoStockForm").addEventListener("submit", guardarAjuste);
    $("#filamentoStockTipo").addEventListener("change", actualizarEtiquetaAjuste);
    $("#filamentoStockModal").addEventListener("click", (event) => {
      if (event.target.matches("[data-stock-close]")) cerrarModal($("#filamentoStockModal"));
    });
    $("#exportarFilamentosJsonButton").addEventListener("click", () => descargar("inventario-filamentos.json", api().exportarBobinasJSON(), "application/json;charset=utf-8"));
    $("#exportarFilamentosCsvButton").addEventListener("click", () => descargar("inventario-filamentos.csv", api().exportarBobinasCSV(), "text/csv;charset=utf-8"));
    $("#importarFilamentosButton").addEventListener("click", () => $("#importarFilamentosInput").click());
    $("#importarFilamentosInput").addEventListener("change", importarArchivo);
    document.addEventListener("keydown", manejarTeclado);
    document.addEventListener("precio3d:idioma-actualizado", () => {
      poblarMateriales($("#filamentoMaterial")?.value || "PLA");
      actualizarEtiquetaAjuste();
      actualizarCostoPreview();
      actualizarVista();
    });
    window.addEventListener("precio3d:filamentos-actualizados", actualizarVista);
    actualizarVista();
  }

  window.PanelFilamentosPrecio3D = { inicializar, renderizar: actualizarVista, abrirFormulario, renderizarDetalle };
  inicializar();
})();

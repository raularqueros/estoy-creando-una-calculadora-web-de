(function () {
  "use strict";

  const $ = (selector, base = document) => base.querySelector(selector);
  const api = () => window.FilamentosPrecio3D;
  let detalleId = "";
  let retornoFoco = null;
  let modalActivo = null;
  let inicializado = false;

  function escapar(valor) {
    return String(valor ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
  }

  function numero(id) {
    const valor = Number($(id)?.value);
    return Number.isFinite(valor) && valor >= 0 ? valor : 0;
  }

  function fecha(valor) {
    if (!valor) return "Sin registrar";
    const fechaValor = new Date(valor);
    return Number.isNaN(fechaValor.getTime())
      ? escapar(valor)
      : new Intl.DateTimeFormat("es-CL", { dateStyle: "medium" }).format(fechaValor);
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
    return `${Number(valor || 0).toLocaleString("es-CL", { maximumFractionDigits: 2 })} g`;
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
    select.innerHTML = materialesDisponibles().map((nombre) =>
      `<option value="${escapar(idMaterial(nombre))}" ${nombre === seleccion ? "selected" : ""}>${escapar(nombre)}</option>`
    ).join("");
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
    const resumen = api()?.obtenerResumenInventario();
    const contenedor = $("#filamentosResumen");
    if (!resumen || !contenedor) return;
    const valores = Object.entries(resumen.valoresPorMoneda);
    const valorTexto = valores.length
      ? valores.map(([moneda, valor]) => formatoMoneda(valor, moneda)).join(" · ")
      : "Sin stock";
    const items = [
      ["Bobinas activas", resumen.totalActivas],
      ["Selladas", resumen.selladas],
      ["En uso", resumen.enUso],
      ["Stock bajo", resumen.stockBajo],
      ["Peso disponible", formatoGramos(resumen.pesoTotalGramos)],
      ["Valor estimado", valorTexto]
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
    $("#filamentosMaterialFiltro").innerHTML = '<option value="">Todos</option>' + materiales
      .map(([id, nombre]) => `<option value="${escapar(id)}">${escapar(nombre)}</option>`).join("");
    $("#filamentosMarcaFiltro").innerHTML = '<option value="">Todas</option>' + marcas
      .map((marca) => `<option value="${escapar(marca)}">${escapar(marca)}</option>`).join("");
    $("#filamentosMaterialFiltro").value = materiales.some(([id]) => id === materialActual) ? materialActual : "";
    $("#filamentosMarcaFiltro").value = marcas.includes(marcaActual) ? marcaActual : "";
  }

  function barraStock(bobina) {
    const porcentaje = api().calcularPorcentajeRestante(bobina);
    return `
      <div class="filament-progress" role="progressbar" aria-label="Porcentaje de filamento restante"
        aria-valuemin="0" aria-valuemax="100" aria-valuenow="${porcentaje.toFixed(1)}">
        <span style="width:${porcentaje}%"></span>
      </div>
      <small>${porcentaje.toLocaleString("es-CL", { maximumFractionDigits: 1 })}%</small>
    `;
  }

  function etiquetaStock(bobina) {
    return api().tieneStockBajo(bobina)
      ? `<span class="filament-low-stock">Stock bajo</span>`
      : "";
  }

  function accionesFila() {
    return `
      <div class="filament-row-actions">
        <button type="button" class="secondary" data-filament-action="detalle">Ver detalle</button>
        <button type="button" data-filament-action="stock">Ajustar stock</button>
        <button type="button" class="secondary" data-filament-action="editar">Editar</button>
        <button type="button" class="secondary" data-filament-action="duplicar">Duplicar</button>
      </div>
    `;
  }

  function obtenerListaFiltrada() {
    const buscadas = api().buscarBobinas($("#filamentosBusqueda")?.value || "");
    return api().filtrarBobinas(buscadas, {
      estado: $("#filamentosEstadoFiltro")?.value || "activas",
      material: $("#filamentosMaterialFiltro")?.value || "",
      marca: $("#filamentosMarcaFiltro")?.value || "",
      orden: $("#filamentosOrden")?.value || "recientes"
    });
  }

  function renderizarListado() {
    const contenedor = $("#filamentosListado");
    if (!contenedor) return;
    const lista = obtenerListaFiltrada();
    if (!lista.length) {
      const tieneRegistros = Boolean(api()?.obtenerBobinas().length);
      contenedor.innerHTML = `
        <div class="printer-empty-state">
          <strong>${tieneRegistros ? "No se encontraron bobinas que coincidan con los filtros." : "Aún no has registrado bobinas de filamento."}</strong>
          <p>${tieneRegistros ? "Prueba con otra búsqueda o filtro." : "Agrega una bobina para conocer su stock disponible y su costo real por gramo."}</p>
          ${tieneRegistros ? "" : '<button type="button" data-filament-action="nueva">+ Agregar bobina</button>'}
        </div>
      `;
      return;
    }
    contenedor.innerHTML = `
      <div class="filaments-table-scroll">
        <table class="filaments-table">
          <thead><tr><th>Material</th><th>Marca y color</th><th>Stock restante</th><th>Progreso</th>
            <th>Costo por gramo</th><th>Valor restante</th><th>Estado</th><th>Acciones</th></tr></thead>
          <tbody>${lista.map((bobina) => `
            <tr data-filament-id="${escapar(bobina.id)}">
              <td data-label="Material"><strong>${escapar(bobina.materialNombre)}</strong>${bobina.varianteMaterial ? `<small>${escapar(bobina.varianteMaterial)}</small>` : ""}</td>
              <td data-label="Marca y color"><span class="filament-color-line">${bobina.colorHex ? `<i style="background:${escapar(bobina.colorHex)}"></i>` : ""}${escapar([bobina.marca, bobina.colorNombre].filter(Boolean).join(" · ") || "Sin registrar")}</span></td>
              <td data-label="Stock restante"><strong>${formatoGramos(bobina.pesoRestanteGramos)}</strong> de ${formatoGramos(bobina.pesoNetoInicialGramos)} ${etiquetaStock(bobina)}</td>
              <td data-label="Progreso">${barraStock(bobina)}</td>
              <td data-label="Costo por gramo">${formatoMoneda(api().calcularCostoPorGramo(bobina), bobina.monedaCompra)}</td>
              <td data-label="Valor restante">${formatoMoneda(api().calcularValorRestante(bobina), bobina.monedaCompra)}</td>
              <td data-label="Estado"><span class="printer-status">${escapar(bobina.estado)}</span></td>
              <td data-label="Acciones">${accionesFila()}</td>
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
    panel.dataset.filamentId = bobina.id;
    panel.hidden = false;
    panel.innerHTML = `
      <div class="client-detail-heading">
        <div><p class="eyebrow">Detalle de bobina</p><h3>${escapar(bobina.nombre || `${bobina.materialNombre} ${bobina.colorNombre}`.trim())}</h3>${etiquetaStock(bobina)}</div>
        <div class="filament-detail-actions">
          <button type="button" data-filament-action="stock">Ajustar stock</button>
          <button type="button" class="secondary" data-filament-action="editar">Editar</button>
          <button type="button" class="secondary" data-filament-action="duplicar">Duplicar</button>
          ${bobina.estado !== "Archivada" ? '<button type="button" class="secondary" data-filament-action="archivar">Archivar</button>' : ""}
          <button type="button" class="danger-button" data-filament-action="eliminar">Eliminar</button>
        </div>
      </div>
      <div class="filament-detail-grid">
        <section><h4>Identificación</h4><p><strong>Marca:</strong> ${escapar(bobina.marca || "Sin registrar")}</p><p><strong>Material:</strong> ${escapar(bobina.materialNombre)}</p><p><strong>Variante:</strong> ${escapar(bobina.varianteMaterial || "Sin registrar")}</p><p><strong>Color:</strong> ${escapar(bobina.colorNombre || "Sin registrar")}</p><p><strong>Diámetro:</strong> ${escapar(bobina.diametroMm)} mm</p></section>
        <section><h4>Stock</h4><p><strong>Inicial:</strong> ${formatoGramos(bobina.pesoNetoInicialGramos)}</p><p><strong>Restante:</strong> ${formatoGramos(bobina.pesoRestanteGramos)}</p>${barraStock(bobina)}<p><strong>Tara:</strong> ${formatoGramos(bobina.pesoTaraGramos)}</p><p><strong>Mínimo:</strong> ${formatoGramos(bobina.stockMinimoGramos)}</p></section>
        <section><h4>Costo</h4><p><strong>Modo:</strong> ${bobina.modoCosto === "precio_kilo" ? "Precio por kilo" : "Precio total"}</p><p><strong>Precio:</strong> ${formatoMoneda(bobina.modoCosto === "precio_kilo" ? bobina.precioPorKilo : bobina.precioCompraTotal, bobina.monedaCompra)}</p><p><strong>Costo por gramo:</strong> ${formatoMoneda(api().calcularCostoPorGramo(bobina), bobina.monedaCompra)}</p><p><strong>Valor restante:</strong> ${formatoMoneda(api().calcularValorRestante(bobina), bobina.monedaCompra)}</p></section>
        <section><h4>Compra</h4><p><strong>Proveedor:</strong> ${escapar(bobina.proveedor || "Sin registrar")}</p><p><strong>Lote:</strong> ${escapar(bobina.loteSku || "Sin registrar")}</p><p><strong>Ubicación:</strong> ${escapar(bobina.ubicacion || "Sin registrar")}</p><p><strong>Compra:</strong> ${fecha(bobina.fechaCompra)}</p><p><strong>Apertura:</strong> ${fecha(bobina.fechaApertura)}</p></section>
      </div>
      <section class="filament-movements"><h4>Movimientos de stock</h4>
        ${movimientos.length ? `<div class="filament-movements-scroll"><table><thead><tr><th>Fecha</th><th>Tipo</th><th>Cantidad</th><th>Anterior</th><th>Nuevo</th><th>Referencia</th><th>Nota</th></tr></thead><tbody>${movimientos.map((item) => `<tr><td>${fecha(item.fecha)}</td><td>${escapar(item.tipo.replaceAll("_", " "))}</td><td>${formatoGramos(item.cantidadGramos)}</td><td>${formatoGramos(item.stockAnterior)}</td><td>${formatoGramos(item.stockNuevo)}</td><td>${escapar(item.referenciaNombre || item.referenciaId || "—")}</td><td>${escapar(item.nota || "—")}</td></tr>`).join("")}</tbody></table></div>` : "<p>Sin movimientos registrados.</p>"}
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
      materialNombre: materialSelect.options[materialSelect.selectedIndex]?.textContent || "",
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
    Object.entries(errores).forEach(([campo, mensaje]) => {
      const elemento = document.querySelector(`[data-filament-error="${campo}"]`);
      if (elemento) elemento.textContent = mensaje;
    });
    $("#filamentoFormMessage").textContent = "Revisa los campos marcados.";
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
      ? `${formatoMoneda(costo, datos.monedaCompra)} por gramo`
      : "Completa el peso y el precio";
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
    $("#filamentoModalTitle").textContent = bobina ? (duplicada ? "Duplicar bobina" : "Editar bobina") : "Agregar bobina";
    $("#filamentoNombre").value = duplicada && bobina?.nombre ? `${bobina.nombre} (copia)` : bobina?.nombre || "";
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
    if (datos.pesoRestanteGramos > datos.pesoNetoInicialGramos && !confirm("El stock restante supera el peso inicial. ¿Deseas guardarlo de todas formas?")) return;
    const id = $("#filamentoFormId").value;
    const guardada = id ? api().actualizarBobina(id, datos) : api().crearBobina(datos);
    if (!guardada) {
      $("#filamentoFormMessage").textContent = "No fue posible guardar la bobina.";
      return;
    }
    detalleId = guardada.id;
    cerrarModal($("#filamentoModal"));
    actualizarVista();
    renderizarDetalle(guardada.id);
    mostrarMensaje(id ? "Bobina actualizada." : "Bobina guardada.");
  }

  function abrirAjuste(bobina) {
    $("#filamentoStockForm").reset();
    $("#filamentoStockId").value = bobina.id;
    $("#filamentoStockModalTitle").textContent = `Ajustar stock · ${bobina.nombre || bobina.materialNombre}`;
    $("#filamentoStockMessage").textContent = `Stock actual: ${formatoGramos(bobina.pesoRestanteGramos)}.`;
    actualizarEtiquetaAjuste();
    abrirModal($("#filamentoStockModal"), "#filamentoStockTipo");
  }

  function actualizarEtiquetaAjuste() {
    const establece = $("#filamentoStockTipo").value === "correccion";
    $("#filamentoStockCantidadLabel").textContent = establece ? "Nuevo peso restante (g)" : "Cantidad (g)";
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
    if (resultado.requiereConfirmacion && confirm("El nuevo stock supera el peso inicial. Esto puede corresponder a una recarga. ¿Deseas continuar?")) {
      resultado = api().ajustarStock(id, ajuste, { permitirSobreInicial: true });
    }
    if (!resultado.ok) {
      $("#filamentoStockMessage").textContent = resultado.error || "No fue posible ajustar el stock.";
      return;
    }
    if (resultado.sugerirEstado && confirm("El stock llegó a cero. ¿Quieres marcar la bobina como Agotada?")) {
      api().actualizarBobina(id, { estado: "Agotada" });
    }
    detalleId = id;
    cerrarModal($("#filamentoStockModal"));
    actualizarVista();
    mostrarMensaje("Movimiento de stock registrado.");
  }

  function idDesdeAccion(boton) {
    return boton.closest("[data-filament-id]")?.dataset.filamentId
      || boton.closest("#filamentoDetallePanel")?.dataset.filamentId || "";
  }

  function manejarAccion(event) {
    const boton = event.target.closest("[data-filament-action]");
    if (!boton) return;
    const accion = boton.dataset.filamentAction;
    const id = idDesdeAccion(boton);
    const bobina = id ? api().obtenerBobinaPorId(id) : null;
    if (accion === "nueva") abrirFormulario();
    if (accion === "detalle" && bobina) {
      renderizarDetalle(id);
      $("#filamentoDetallePanel")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    if (accion === "editar" && bobina) abrirFormulario(bobina);
    if (accion === "stock" && bobina) abrirAjuste(bobina);
    if (accion === "duplicar" && bobina) abrirFormulario(bobina, true);
    if (accion === "archivar" && bobina && confirm("La bobina quedará archivada y conservará todo su historial. ¿Continuar?")) {
      api().archivarBobina(id);
      actualizarVista();
      mostrarMensaje("Bobina archivada.");
    }
    if (accion === "eliminar" && bobina && confirm("Se eliminarán esta bobina y todo su historial. Esta acción no modifica trabajos ni cotizaciones. ¿Eliminar?")) {
      api().eliminarBobina(id);
      detalleId = "";
      actualizarVista();
      mostrarMensaje("Bobina eliminada.");
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
    const modo = confirm("Aceptar: combinar sin repetir IDs.\nCancelar: reemplazar únicamente el inventario de filamentos.")
      ? "combinar" : "reemplazar";
    const resultado = api().importarBobinasJSON(await archivo.text(), modo);
    mostrarMensaje(
      resultado.ok
        ? `${resultado.importadas} bobinas importadas, ${resultado.omitidas} omitidas y ${resultado.rechazadas} rechazadas.`
        : "El archivo no contiene un inventario válido.",
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
    ["#filamentosBusqueda", "#filamentosEstadoFiltro", "#filamentosMaterialFiltro", "#filamentosMarcaFiltro", "#filamentosOrden"]
      .forEach((selector) => $(selector).addEventListener(selector === "#filamentosBusqueda" ? "input" : "change", renderizarListado));
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
      if (confirm(`Se aplicarán ${formatoGramos(estimado)} como peso restante. ¿Continuar?`)) {
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
    window.addEventListener("precio3d:filamentos-actualizados", actualizarVista);
    actualizarVista();
  }

  window.PanelFilamentosPrecio3D = { inicializar, renderizar: actualizarVista, abrirFormulario, renderizarDetalle };
  inicializar();
})();

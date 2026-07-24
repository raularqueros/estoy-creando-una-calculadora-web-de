(function () {
  "use strict";

  const $ = (selector, base = document) => base.querySelector(selector);
  const api = () => window.ImpresorasPrecio3D;
  const catalogo = () => window.CatalogoImpresoras3D;
  let impresoraDetalleId = "";
  let retornoFoco = null;
  let inicializado = false;
  const t = (clave, reemplazos = {}) =>
    window.obtenerTextoI18n?.(clave, reemplazos) || clave;

  function escapar(valor) {
    return String(valor ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function fecha(valor) {
    if (!valor) return t("sinRegistrar");
    const fechaValor = new Date(valor);
    if (Number.isNaN(fechaValor.getTime())) return escapar(valor);
    return new Intl.DateTimeFormat(document.documentElement.lang || "es", { dateStyle: "medium" }).format(fechaValor);
  }

  function formatoMoneda(valor, moneda = "CLP") {
    try {
      return window.formatearMonedaPrecio3D?.(valor, moneda)
        || new Intl.NumberFormat("es-CL", { style: "currency", currency: moneda }).format(valor);
    } catch (_error) {
      return `${moneda} ${Number(valor || 0).toLocaleString("es-CL")}`;
    }
  }

  function costoHora(impresora) {
    const costo = api()?.calcularCostoHoraEstimado(impresora);
    return costo === null ? t("noCalculable") : formatoMoneda(costo, impresora.monedaCompra);
  }

  function estadoVisible(estado) {
    return t({
      Activa: "activa",
      "En mantenimiento": "enMantenimiento",
      "Fuera de servicio": "fueraServicio",
      Retirada: "retirada"
    }[estado] || "estado");
  }

  function mostrarMensaje(texto, error = false) {
    const elemento = $("#impresorasMessage");
    if (!elemento) return;
    elemento.textContent = texto;
    elemento.classList.toggle("storage-error", error);
    elemento.classList.toggle("storage-success", !error && Boolean(texto));
  }

  function opcionesMoneda(seleccionada = "CLP") {
    return (window.MonedasPrecio3D || []).map((moneda) => `
      <option value="${escapar(moneda.codigo)}" ${moneda.codigo === seleccionada ? "selected" : ""}>
        ${escapar(moneda.codigo)} · ${escapar(moneda.nombre)}
      </option>
    `).join("");
  }

  function renderizarResumen() {
    const lista = api()?.obtenerImpresoras() || [];
    const predeterminada = lista.find((item) => item.esPredeterminada);
    const items = [
      [t("totalImpresoras"), lista.length],
      [t("activas"), lista.filter((item) => item.estado === "Activa").length],
      [t("enMantenimiento"), lista.filter((item) => item.estado === "En mantenimiento").length],
      [t("impresoraPredeterminada"), predeterminada?.nombre || t("sinPredeterminada")]
    ];
    $("#impresorasResumen").innerHTML = items.map(([etiqueta, valor]) => `
      <article class="jobs-kpi-card">
        <span>${escapar(etiqueta)}</span>
        <strong>${escapar(valor)}</strong>
      </article>
    `).join("");
  }

  function acciones(impresora) {
    return `
      <div class="printer-row-actions">
        <button type="button" class="secondary" data-printer-action="detalle">${escapar(t("verDetalle"))}</button>
        <details class="printer-secondary-actions">
          <summary>${escapar(t("masAcciones"))}</summary>
          <div>
            <button type="button" class="secondary" data-printer-action="editar">${escapar(t("editar"))}</button>
            ${impresora.esPredeterminada || impresora.estado === "Retirada" ? "" : `<button type="button" class="secondary" data-printer-action="predeterminada">${escapar(t("marcarPredeterminada"))}</button>`}
            <button type="button" class="secondary" data-printer-action="duplicar">${escapar(t("duplicar"))}</button>
            ${impresora.estado === "Retirada" ? "" : `<button type="button" class="secondary" data-printer-action="archivar">${escapar(t("archivar"))}</button>`}
            <button type="button" class="secondary danger-button" data-printer-action="eliminar">${escapar(t("eliminar"))}</button>
          </div>
        </details>
      </div>
    `;
  }

  function renderizarListado() {
    const consulta = $("#impresorasBusqueda")?.value || "";
    const filtro = $("#impresorasFiltro")?.value || "todas";
    const tecnologia = $("#impresorasTecnologiaFiltro")?.value || "todas";
    const orden = $("#impresorasOrden")?.value || "nombre";
    const lista = (api()?.buscarImpresoras(consulta, { filtro, orden }) || [])
      .filter((item) => tecnologia === "todas" || item.tecnologia === tecnologia);
    const contenedor = $("#impresorasListado");
    if (!contenedor) return;

    if (!lista.length) {
      const tieneRegistros = Boolean(api()?.obtenerImpresoras().length);
      contenedor.innerHTML = `
        <div class="printer-empty-state">
          <strong>${escapar(t(tieneRegistros ? "sinImpresorasFiltros" : "sinImpresoras"))}</strong>
          <p>${escapar(t(tieneRegistros ? "pruebaOtroFiltro" : "agregaImpresoraAyuda"))}</p>
          ${tieneRegistros
            ? `<button type="button" class="secondary" data-printer-action="limpiar-filtros">${escapar(t("limpiarFiltros"))}</button>`
            : `<button type="button" data-printer-action="nueva">${escapar(t("agregarPrimeraImpresora"))}</button>`}
        </div>
      `;
      return;
    }

    contenedor.innerHTML = `
      <div class="printers-table-scroll">
        <table class="printers-table">
          <thead><tr>
            <th>${escapar(t("impresora"))}</th><th>${escapar(t("estado"))}</th><th>${escapar(t("costoHora"))}</th><th>${escapar(t("marcaModeloVariante"))}</th>
            <th>${escapar(t("tecnologia"))}</th><th>${escapar(t("potencia"))}</th><th>${escapar(t("predeterminada"))}</th><th>${escapar(t("acciones"))}</th>
          </tr></thead>
          <tbody>${lista.map((item) => `
            <tr data-printer-id="${escapar(item.id)}">
              <td data-label="${escapar(t("impresora"))}"><strong>${escapar(item.nombre)}</strong></td>
              <td data-label="${escapar(t("estado"))}"><span class="printer-status">${escapar(estadoVisible(item.estado))}</span></td>
              <td data-label="${escapar(t("costoHora"))}"><strong>${escapar(costoHora(item))}</strong><small>${escapar(item.monedaCompra)}</small></td>
              <td data-label="${escapar(t("marcaModeloVariante"))}">${escapar([item.marca, item.modelo, item.variante].filter(Boolean).join(" · ") || t("sinRegistrar"))}</td>
              <td data-label="${escapar(t("tecnologia"))}">${escapar(item.tecnologia)}</td>
              <td data-label="${escapar(t("potencia"))}">${escapar(item.potenciaPromedioWatts)} W</td>
              <td data-label="${escapar(t("predeterminada"))}">${item.esPredeterminada ? `<span class="printer-default-badge">${escapar(t("predeterminada"))}</span>` : escapar(t("no"))}</td>
              <td data-label="${escapar(t("acciones"))}">${acciones(item)}</td>
            </tr>
          `).join("")}</tbody>
        </table>
      </div>
    `;
  }

  function renderizarDetalle(id = impresoraDetalleId) {
    const panel = $("#impresoraDetallePanel");
    const impresora = api()?.obtenerImpresoraPorId(id);
    if (!panel) return;
    if (!impresora) {
      panel.hidden = true;
      impresoraDetalleId = "";
      return;
    }
    impresoraDetalleId = id;
    panel.hidden = false;
    panel.dataset.printerId = id;
    panel.innerHTML = `
      <div class="client-detail-header">
        <div>
          <p class="eyebrow">${escapar(t("detalleImpresora"))}</p>
          <h3>${escapar(impresora.nombre)}</h3>
          <p>${escapar([impresora.marca, impresora.modelo, impresora.tecnologia].filter(Boolean).join(" · "))}</p>
        </div>
        ${impresora.esPredeterminada ? `<span class="printer-default-badge">${escapar(t("predeterminada"))}</span>` : ""}
      </div>
      <div class="client-detail-grid printer-detail-grid">
        <section><h4>${escapar(t("identificacion"))}</h4>
          <p><strong>${escapar(t("marca"))}:</strong> ${escapar(impresora.marca || t("sinRegistrar"))}</p>
          <p><strong>${escapar(t("modelo"))}:</strong> ${escapar(impresora.modelo || t("sinRegistrar"))}</p>
          <p><strong>${escapar(t("variante"))}:</strong> ${escapar(impresora.variante || t("sinVariante"))}</p>
          <p><strong>${escapar(t("tecnologia"))}:</strong> ${escapar(impresora.tecnologia)}</p>
          <p><strong>${escapar(t("estado"))}:</strong> ${escapar(estadoVisible(impresora.estado))}</p>
        </section>
        <section><h4>${escapar(t("costos"))}</h4>
          <p><strong>${escapar(t("compra"))}:</strong> ${escapar(formatoMoneda(impresora.costoCompra, impresora.monedaCompra))}</p>
          <p><strong>${escapar(t("herramientas"))}:</strong> ${escapar(formatoMoneda(impresora.costoHerramientas, impresora.monedaCompra))}</p>
          <p><strong>${escapar(t("mantenimientoEstimado"))}:</strong> ${escapar((impresora.porcentajeMantenimiento * 100).toLocaleString(document.documentElement.lang || "es"))}%</p>
          <p><strong>${escapar(t("mantenimientoAnualAdicional"))}:</strong> ${escapar(formatoMoneda(impresora.costoMantenimientoAnual, impresora.monedaCompra))}</p>
          <p><strong>${escapar(t("costoHoraEstimado"))}:</strong> ${escapar(costoHora(impresora))}</p>
        </section>
        <section><h4>${escapar(t("operacion"))}</h4>
          <p><strong>${escapar(t("potencia"))}:</strong> ${escapar(impresora.potenciaPromedioWatts)} W</p>
          <p><strong>${escapar(t("vidaUtil"))}:</strong> ${escapar(impresora.anosVidaUtil)} ${escapar(t("anos"))}</p>
          <p><strong>${escapar(t("diasOperativos"))}:</strong> ${escapar(impresora.diasOperativosAno)} ${escapar(t("alAno"))}</p>
          <p><strong>${escapar(t("horasProductivas"))}:</strong> ${escapar(impresora.horasProductivasDia)} ${escapar(t("alDia"))}</p>
        </section>
        <section><h4>${escapar(t("otros"))}</h4>
          <p><strong>${escapar(t("compra"))}:</strong> ${fecha(impresora.fechaCompra)}</p>
          <p><strong>${escapar(t("creacion"))}:</strong> ${fecha(impresora.fechaCreacion)}</p>
          <p><strong>${escapar(t("actualizacion"))}:</strong> ${fecha(impresora.fechaActualizacion)}</p>
          <p><strong>${escapar(t("notas"))}:</strong> ${escapar(impresora.notas || t("sinNotas"))}</p>
        </section>
      </div>
      <div class="actions printer-detail-actions">
        <button type="button" data-printer-action="editar">${escapar(t("editar"))}</button>
        <button type="button" class="secondary" data-printer-action="duplicar">${escapar(t("duplicar"))}</button>
        ${impresora.esPredeterminada || impresora.estado === "Retirada" ? "" : `<button type="button" class="secondary" data-printer-action="predeterminada">${escapar(t("marcarPredeterminada"))}</button>`}
        ${impresora.estado === "Retirada" ? "" : `<button type="button" class="secondary" data-printer-action="archivar">${escapar(t("archivar"))}</button>`}
        <button type="button" class="secondary danger-button" data-printer-action="eliminar">${escapar(t("eliminar"))}</button>
      </div>
    `;
  }

  function actualizarVista() {
    renderizarResumen();
    renderizarListado();
    if (impresoraDetalleId) renderizarDetalle();
  }

  function limpiarErrores() {
    document.querySelectorAll("[data-printer-error]").forEach((elemento) => { elemento.textContent = ""; });
    document.querySelectorAll("#impresoraForm [aria-invalid]").forEach((campo) => campo.removeAttribute("aria-invalid"));
    $("#impresoraFormMessage").textContent = "";
  }

  function mostrarErrores(errores) {
    limpiarErrores();
    const clavesError = {
      nombre: "errorNombreImpresora",
      tecnologia: "errorTecnologiaImpresora",
      costoCompra: "errorCostoCompraImpresora",
      costoHerramientas: "errorCostoHerramientasImpresora",
      potenciaPromedioWatts: "errorPotenciaImpresora",
      anosVidaUtil: "errorVidaUtilImpresora",
      diasOperativosAno: "errorDiasOperativosImpresora",
      horasProductivasDia: "errorHorasProductivasImpresora",
      porcentajeMantenimiento: "errorMantenimientoImpresora",
      costoMantenimientoAnual: "errorMantenimientoAnualImpresora"
    };
    Object.entries(errores).forEach(([campo, mensaje]) => {
      const error = document.querySelector(`[data-printer-error="${campo}"]`);
      const input = document.querySelector(`[name="${campo}"]`);
      if (error) error.textContent = clavesError[campo] ? t(clavesError[campo]) : mensaje;
      input?.setAttribute("aria-invalid", "true");
    });
    const primero = Object.keys(errores)[0];
    document.querySelector(`[name="${primero}"]`)?.focus();
    $("#impresoraFormMessage").textContent = t("revisaCamposIndicados");
  }

  function datosFormulario() {
    const form = $("#impresoraForm");
    const datos = Object.fromEntries(new FormData(form).entries());
    datos.esPredeterminada = $("#impresoraPredeterminada").checked;
    const catalogoModeloId = $("#impresoraCatalogoModeloId")?.value || "";
    datos.catalogoModeloId = catalogoModeloId || null;
    if (catalogoModeloId) {
      const identificacion = catalogo()?.crearDatosInicialesPerfil(
        catalogoModeloId,
        $("#impresoraVarianteCatalogo")?.value || ""
      );
      datos.catalogoSnapshot = identificacion ? {
        ...identificacion,
        fechaCatalogo: window.CatalogoImpresorasData?.fechaActualizacion || ""
      } : null;
    } else {
      datos.catalogoSnapshot = null;
    }
    return datos;
  }

  function poblarMarcas(seleccionada = "") {
    const selector = $("#impresoraMarcaCatalogo");
    if (!selector || !catalogo()) return;
    selector.innerHTML = `<option value="">${escapar(t("seleccionaMarca"))}</option>`
      + catalogo().obtenerMarcas().map((marca) => `<option value="${escapar(marca.id)}">${escapar(marca.nombre)}</option>`).join("");
    selector.value = seleccionada;
  }

  function poblarModelos(marcaId, seleccionada = "") {
    const selector = $("#impresoraModeloCatalogo");
    if (!selector) return;
    const modelos = catalogo()?.obtenerModelosPorMarca(marcaId) || [];
    selector.innerHTML = `<option value="">${escapar(t("seleccionaModelo"))}</option>`
      + modelos.map((modelo) => `<option value="${escapar(modelo.id)}">${escapar(modelo.modelo)}</option>`).join("");
    selector.disabled = !modelos.length;
    selector.value = seleccionada;
  }

  function poblarVariantes(modeloId, seleccionada = "") {
    const selector = $("#impresoraVarianteCatalogo");
    if (!selector) return;
    const variantes = catalogo()?.obtenerVariantes(modeloId) || [];
    selector.innerHTML = `<option value="">${escapar(t("sinVariante"))}</option>`
      + variantes.map((variante) => `<option value="${escapar(variante)}">${escapar(variante)}</option>`).join("");
    selector.disabled = !variantes.length;
    selector.value = variantes.includes(seleccionada) ? seleccionada : "";
  }

  function activarModoManual(activo = true) {
    const panel = $("#impresoraIdentificacionManual");
    if (panel) panel.hidden = !activo;
    if (activo) {
      $("#impresoraCatalogoModeloId").value = "";
      $("#impresoraCatalogoMeta").textContent = t("identificacionPersonalizadaAyuda");
      $("#impresoraMarca")?.focus();
    }
  }

  function aplicarModeloCatalogo(modeloId, variante = "") {
    const modelo = catalogo()?.obtenerModeloPorId(modeloId);
    if (!modelo) return;
    poblarMarcas(modelo.marcaId);
    poblarModelos(modelo.marcaId, modelo.id);
    poblarVariantes(modelo.id, variante);
    $("#impresoraCatalogoModeloId").value = modelo.id;
    $("#impresoraMarca").value = modelo.marca;
    $("#impresoraModelo").value = modelo.modelo;
    $("#impresoraVariante").value = variante || modelo.variante || "";
    $("#impresoraTecnologia").value = modelo.tecnologia;
    $("#impresoraIdentificacionManual").hidden = true;
    const detalles = [
      modelo.volumenImpresion,
      modelo.cerrada ? t("cerrada") : t("abierta"),
      modelo.multicolorCompatible ? t("compatibleMulticolor") : t("sinDatoMulticolor")
    ];
    $("#impresoraCatalogoMeta").textContent = t("datosCatalogoAyuda", {
      detalles: detalles.filter(Boolean).join(" · ")
    });
  }

  function renderizarBusquedaCatalogo() {
    const contenedor = $("#impresoraCatalogoResultados");
    const resultados = catalogo()?.buscarModelos($("#impresoraCatalogoBusqueda")?.value || "") || [];
    if (!contenedor) return;
    contenedor.hidden = !resultados.length;
    contenedor.innerHTML = resultados.map((modelo) => `
      <button type="button" data-catalog-model="${escapar(modelo.id)}">
        <strong>${escapar(modelo.modelo)}</strong><span>${escapar(modelo.marca)} · ${escapar(modelo.tecnologia)}</span>
      </button>
    `).join("");
  }

  function actualizarVistaPrevia() {
    const datos = datosFormulario();
    const costo = api()?.calcularCostoHoraEstimado(datos);
    $("#impresoraCostoHoraPreview").textContent = costo === null
      ? t("costoHoraNoCalculableAyuda")
      : formatoMoneda(costo, datos.monedaCompra || "CLP");
  }

  function abrirFormulario(impresora = null) {
    const modal = $("#impresoraModal");
    const form = $("#impresoraForm");
    if (!modal || !form) return;
    retornoFoco = document.activeElement;
    form.reset();
    limpiarErrores();
    poblarMarcas();
    poblarModelos("");
    poblarVariantes("");
    $("#impresoraCatalogoBusqueda").value = "";
    $("#impresoraCatalogoResultados").hidden = true;
    $("#impresoraFormId").value = impresora?.id || "";
    $("#impresoraModalTitle").textContent = t(impresora ? "editarImpresora" : "agregarImpresora");
    $("#impresoraNombre").value = impresora?.nombre || "";
    $("#impresoraMarca").value = impresora?.marca || "";
    $("#impresoraModelo").value = impresora?.modelo || "";
    $("#impresoraVariante").value = impresora?.variante || "";
    $("#impresoraTecnologia").value = impresora?.tecnologia || "FDM / FFF";
    $("#impresoraEstado").value = impresora?.estado || "Activa";
    $("#impresoraCostoCompra").value = impresora?.costoCompra ?? "";
    $("#impresoraMonedaCompra").innerHTML = opcionesMoneda(impresora?.monedaCompra || "CLP");
    $("#impresoraCostoHerramientas").value = impresora?.costoHerramientas ?? 0;
    $("#impresoraFechaCompra").value = impresora?.fechaCompra || "";
    $("#impresoraPotencia").value = impresora?.potenciaPromedioWatts ?? "";
    $("#impresoraAnosVida").value = impresora?.anosVidaUtil ?? 2;
    $("#impresoraDiasOperativos").value = impresora?.diasOperativosAno ?? 300;
    $("#impresoraHorasProductivas").value = impresora?.horasProductivasDia ?? 8;
    $("#impresoraMantenimiento").value = impresora ? impresora.porcentajeMantenimiento * 100 : 5;
    $("#impresoraMantenimientoAnual").value = impresora?.costoMantenimientoAnual ?? 0;
    $("#impresoraNotas").value = impresora?.notas || "";
    $("#impresoraPredeterminada").checked = Boolean(impresora?.esPredeterminada);
    const modeloCatalogo = impresora?.catalogoModeloId
      ? catalogo()?.obtenerModeloPorId(impresora.catalogoModeloId)
      : null;
    if (modeloCatalogo) {
      aplicarModeloCatalogo(modeloCatalogo.id, impresora.variante);
    } else {
      activarModoManual(Boolean(impresora));
      if (!impresora) $("#impresoraCatalogoMeta").textContent = t("catalogoSoloIdentificacion");
    }
    modal.hidden = false;
    document.body.classList.add("modal-open");
    actualizarVistaPrevia();
    window.requestAnimationFrame(() => $("#impresoraCatalogoBusqueda").focus());
  }

  function cerrarFormulario() {
    const modal = $("#impresoraModal");
    if (!modal || modal.hidden) return;
    modal.hidden = true;
    document.body.classList.remove("modal-open");
    retornoFoco?.focus?.();
    retornoFoco = null;
  }

  function guardarFormulario(event) {
    event.preventDefault();
    const datos = datosFormulario();
    const errores = api()?.validarImpresora(datos) || {};
    if (Object.keys(errores).length) {
      mostrarErrores(errores);
      return;
    }
    const id = $("#impresoraFormId").value;
    const guardada = id ? api().actualizarImpresora(id, datos) : api().crearImpresora(datos);
    if (!guardada) {
      $("#impresoraFormMessage").textContent = t("impresoraNoGuardada");
      return;
    }
    impresoraDetalleId = guardada.id;
    cerrarFormulario();
    actualizarVista();
    renderizarDetalle(guardada.id);
    mostrarMensaje(t(id ? "impresoraActualizada" : "impresoraGuardada"));
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

  function idDesdeAccion(boton) {
    return boton.closest("[data-printer-id]")?.dataset.printerId
      || boton.closest("#impresoraDetallePanel")?.dataset.printerId
      || "";
  }

  function limpiarFiltros() {
    $("#impresorasBusqueda").value = "";
    $("#impresorasFiltro").value = "todas";
    $("#impresorasTecnologiaFiltro").value = "todas";
    $("#impresorasOrden").value = "nombre";
    renderizarListado();
  }

  function manejarAccion(event) {
    const boton = event.target.closest("[data-printer-action]");
    if (!boton) return;
    const accion = boton.dataset.printerAction;
    const id = idDesdeAccion(boton);
    const impresora = id ? api()?.obtenerImpresoraPorId(id) : null;
    if (accion === "nueva") abrirFormulario();
    if (accion === "limpiar-filtros") limpiarFiltros();
    if (accion === "detalle" && impresora) {
      renderizarDetalle(id);
      $("#impresoraDetallePanel")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    if (accion === "editar" && impresora) abrirFormulario(impresora);
    if (accion === "duplicar" && impresora) {
      const copia = api().duplicarImpresora(id);
      if (copia) {
        impresoraDetalleId = copia.id;
        actualizarVista();
        renderizarDetalle(copia.id);
        mostrarMensaje(t("impresoraDuplicada"));
      }
    }
    if (accion === "predeterminada" && impresora) {
      if (confirm(t("confirmarPredeterminada", { nombre: impresora.nombre }))) {
        api().establecerPredeterminada(id);
        actualizarVista();
        mostrarMensaje(t("predeterminadaActualizada"));
      }
    }
    if (accion === "archivar" && impresora) {
      const aviso = impresora.esPredeterminada
        ? t("archivarPredeterminadaAviso")
        : t("archivarImpresoraAviso");
      if (confirm(`${aviso}\n\n${t("confirmarContinuar")}`)) {
        api().archivarImpresora(id);
        actualizarVista();
        mostrarMensaje(t("impresoraArchivada"));
      }
    }
    if (accion === "eliminar" && impresora) {
      const aviso = impresora.esPredeterminada ? ` ${t("eliminarPredeterminadaAviso")}` : "";
      if (confirm(`${t("eliminarImpresoraAviso")}${aviso}\n\n${t("confirmarEliminarImpresora", { nombre: impresora.nombre })}`)) {
        api().eliminarImpresora(id);
        impresoraDetalleId = "";
        actualizarVista();
        renderizarDetalle("");
        mostrarMensaje(t("impresoraEliminada"));
      }
    }
  }

  async function importarArchivo(event) {
    const archivo = event.target.files?.[0];
    if (!archivo) return;
    const modo = confirm(t("confirmarImportarImpresoras"))
      ? "combinar" : "reemplazar";
    const resultado = api().importarImpresorasJSON(await archivo.text(), modo);
    mostrarMensaje(
      resultado.ok
        ? t("impresorasImportadas", resultado)
        : t("impresorasNoImportadas", resultado),
      !resultado.ok
    );
    event.target.value = "";
    impresoraDetalleId = "";
    actualizarVista();
  }

  function manejarTeclado(event) {
    const modal = $("#impresoraModal");
    if (modal?.hidden) return;
    if (event.key === "Escape") {
      cerrarFormulario();
      return;
    }
    if (event.key !== "Tab") return;
    const focables = [...modal.querySelectorAll('button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled])')];
    const primero = focables[0];
    const ultimo = focables.at(-1);
    if (event.shiftKey && document.activeElement === primero) {
      event.preventDefault();
      ultimo.focus();
    } else if (!event.shiftKey && document.activeElement === ultimo) {
      event.preventDefault();
      primero.focus();
    }
  }

  function inicializar() {
    if (inicializado || !api() || !$("#misImpresorasPanel")) return;
    inicializado = true;
    $("#impresorasListado").addEventListener("click", manejarAccion);
    $("#impresoraDetallePanel").addEventListener("click", manejarAccion);
    $("#nuevaImpresoraButton").addEventListener("click", () => abrirFormulario());
    $("#impresorasBusqueda").addEventListener("input", renderizarListado);
    $("#impresorasFiltro").addEventListener("change", renderizarListado);
    $("#impresorasTecnologiaFiltro").addEventListener("change", renderizarListado);
    $("#impresorasOrden").addEventListener("change", renderizarListado);
    $("#limpiarFiltrosImpresorasButton").addEventListener("click", limpiarFiltros);
    $("#impresoraForm").addEventListener("submit", guardarFormulario);
    $("#impresoraForm").addEventListener("input", actualizarVistaPrevia);
    $("#impresoraForm").addEventListener("change", actualizarVistaPrevia);
    $("#impresoraCatalogoBusqueda")?.addEventListener("input", renderizarBusquedaCatalogo);
    $("#impresoraCatalogoResultados")?.addEventListener("click", (event) => {
      const boton = event.target.closest("[data-catalog-model]");
      if (!boton) return;
      aplicarModeloCatalogo(boton.dataset.catalogModel);
      $("#impresoraCatalogoBusqueda").value = `${$("#impresoraMarca").value} ${$("#impresoraModelo").value}`;
      $("#impresoraCatalogoResultados").hidden = true;
    });
    $("#impresoraMarcaCatalogo")?.addEventListener("change", (event) => {
      if (event.target.value === "generica-personalizada") {
        poblarModelos("");
        activarModoManual(true);
        return;
      }
      poblarModelos(event.target.value);
      poblarVariantes("");
      $("#impresoraCatalogoModeloId").value = "";
    });
    $("#impresoraModeloCatalogo")?.addEventListener("change", (event) => {
      if (event.target.value) aplicarModeloCatalogo(event.target.value);
    });
    $("#impresoraVarianteCatalogo")?.addEventListener("change", (event) => {
      $("#impresoraVariante").value = event.target.value;
    });
    $("#impresoraModoPersonalizado")?.addEventListener("click", () => activarModoManual(true));
    $("#impresoraModal").addEventListener("click", (event) => {
      if (event.target.matches("[data-printer-close]")) cerrarFormulario();
    });
    $("#exportarImpresorasJsonButton").addEventListener("click", () => {
      descargar("impresoras-3d.json", api().exportarImpresorasJSON(), "application/json;charset=utf-8");
    });
    $("#exportarImpresorasCsvButton").addEventListener("click", () => {
      descargar("impresoras-3d.csv", api().exportarImpresorasCSV(), "text/csv;charset=utf-8");
    });
    $("#importarImpresorasButton").addEventListener("click", () => $("#importarImpresorasInput").click());
    $("#importarImpresorasInput").addEventListener("change", importarArchivo);
    document.addEventListener("keydown", manejarTeclado);
    document.addEventListener("precio3d:idioma-actualizado", actualizarVista);
    window.addEventListener("precio3d:impresoras-actualizadas", actualizarVista);
    actualizarVista();
  }

  window.PanelImpresorasPrecio3D = {
    inicializar,
    renderizar: actualizarVista,
    abrirFormulario,
    renderizarDetalle
  };

  inicializar();
})();

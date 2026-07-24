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
    return costo === null ? "No calculable" : formatoMoneda(costo, impresora.monedaCompra);
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
    const costos = lista.map((item) => ({ item, costo: api().calcularCostoHoraEstimado(item) }))
      .filter(({ costo }) => costo !== null);
    const monedas = new Set(costos.map(({ item }) => item.monedaCompra));
    const promedio = costos.length && monedas.size === 1
      ? formatoMoneda(costos.reduce((total, item) => total + item.costo, 0) / costos.length, costos[0].item.monedaCompra)
      : costos.length ? t("variasMonedas") : t("sinDatos");
    const predeterminada = lista.find((item) => item.esPredeterminada);
    const items = [
      [t("total"), lista.length],
      [t("activas"), lista.filter((item) => item.estado === "Activa").length],
      [t("enMantenimiento"), lista.filter((item) => item.estado === "En mantenimiento").length],
      [t("costoHorarioPromedio"), promedio],
      [t("predeterminada"), predeterminada?.nombre || t("sinDefinir")]
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
        <button type="button" class="secondary" data-printer-action="editar">${escapar(t("editar"))}</button>
        <button type="button" class="secondary" data-printer-action="duplicar">${escapar(t("duplicar"))}</button>
      </div>
    `;
  }

  function renderizarListado() {
    const consulta = $("#impresorasBusqueda")?.value || "";
    const filtro = $("#impresorasFiltro")?.value || "todas";
    const orden = $("#impresorasOrden")?.value || "nombre";
    const lista = api()?.buscarImpresoras(consulta, { filtro, orden }) || [];
    const contenedor = $("#impresorasListado");
    if (!contenedor) return;

    if (!lista.length) {
      const tieneRegistros = Boolean(api()?.obtenerImpresoras().length);
      contenedor.innerHTML = `
        <div class="printer-empty-state">
          <strong>${escapar(t(tieneRegistros ? "sinImpresorasFiltros" : "sinImpresoras"))}</strong>
          <p>${escapar(t(tieneRegistros ? "pruebaOtroFiltro" : "agregaImpresoraAyuda"))}</p>
          ${tieneRegistros ? "" : `<button type="button" data-printer-action="nueva">${escapar(t("nuevaImpresora"))}</button>`}
        </div>
      `;
      return;
    }

    contenedor.innerHTML = `
      <div class="printers-table-scroll">
        <table class="printers-table">
          <thead><tr>
            <th>${escapar(t("impresora"))}</th><th>${escapar(t("marcaModelo"))}</th><th>${escapar(t("tecnologia"))}</th><th>${escapar(t("potencia"))}</th>
            <th>${escapar(t("costoHora"))}</th><th>${escapar(t("estado"))}</th><th>${escapar(t("predeterminada"))}</th><th>${escapar(t("acciones"))}</th>
          </tr></thead>
          <tbody>${lista.map((item) => `
            <tr data-printer-id="${escapar(item.id)}">
              <td data-label="Impresora"><strong>${escapar(item.nombre)}</strong></td>
              <td data-label="Marca y modelo">${escapar([item.marca, item.modelo].filter(Boolean).join(" · ") || "Sin registrar")}</td>
              <td data-label="Tecnología">${escapar(item.tecnologia)}</td>
              <td data-label="Potencia">${escapar(item.potenciaPromedioWatts)} W</td>
              <td data-label="Costo por hora"><strong>${escapar(costoHora(item))}</strong></td>
              <td data-label="${escapar(t("estado"))}"><span class="printer-status">${escapar(t({ Activa: "activa", "En mantenimiento": "enMantenimiento", "Fuera de servicio": "fueraServicio", Retirada: "retirada" }[item.estado] || "estado"))}</span></td>
              <td data-label="${escapar(t("predeterminada"))}">${item.esPredeterminada ? `<span class="printer-default-badge">${escapar(t("predeterminada"))}</span>` : t("no")}</td>
              <td data-label="Acciones">${acciones(item)}</td>
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
          <p class="eyebrow">Detalle de impresora</p>
          <h3>${escapar(impresora.nombre)}</h3>
          <p>${escapar([impresora.marca, impresora.modelo, impresora.tecnologia].filter(Boolean).join(" · "))}</p>
        </div>
        ${impresora.esPredeterminada ? '<span class="printer-default-badge">Predeterminada</span>' : ""}
      </div>
      <div class="client-detail-grid printer-detail-grid">
        <section><h4>Identificación</h4>
          <p><strong>Marca:</strong> ${escapar(impresora.marca || "Sin registrar")}</p>
          <p><strong>Modelo:</strong> ${escapar(impresora.modelo || "Sin registrar")}</p>
          <p><strong>Variante:</strong> ${escapar(impresora.variante || "Sin variante")}</p>
          <p><strong>Tecnología:</strong> ${escapar(impresora.tecnologia)}</p>
          <p><strong>Estado:</strong> ${escapar(impresora.estado)}</p>
        </section>
        <section><h4>Costos</h4>
          <p><strong>Compra:</strong> ${escapar(formatoMoneda(impresora.costoCompra, impresora.monedaCompra))}</p>
          <p><strong>Herramientas:</strong> ${escapar(formatoMoneda(impresora.costoHerramientas, impresora.monedaCompra))}</p>
          <p><strong>Mantenimiento estimado:</strong> ${escapar((impresora.porcentajeMantenimiento * 100).toLocaleString("es-CL"))}%</p>
          <p><strong>Mantenimiento anual adicional:</strong> ${escapar(formatoMoneda(impresora.costoMantenimientoAnual, impresora.monedaCompra))}</p>
          <p><strong>Costo estimado por hora:</strong> ${escapar(costoHora(impresora))}</p>
        </section>
        <section><h4>Operación</h4>
          <p><strong>Potencia:</strong> ${escapar(impresora.potenciaPromedioWatts)} W</p>
          <p><strong>Vida útil:</strong> ${escapar(impresora.anosVidaUtil)} años</p>
          <p><strong>Días operativos:</strong> ${escapar(impresora.diasOperativosAno)} al año</p>
          <p><strong>Horas productivas:</strong> ${escapar(impresora.horasProductivasDia)} al día</p>
        </section>
        <section><h4>Otros</h4>
          <p><strong>Compra:</strong> ${fecha(impresora.fechaCompra)}</p>
          <p><strong>Creación:</strong> ${fecha(impresora.fechaCreacion)}</p>
          <p><strong>Actualización:</strong> ${fecha(impresora.fechaActualizacion)}</p>
          <p><strong>Notas:</strong> ${escapar(impresora.notas || "Sin notas")}</p>
        </section>
      </div>
      <div class="actions printer-detail-actions">
        <button type="button" data-printer-action="editar">Editar</button>
        <button type="button" class="secondary" data-printer-action="duplicar">Duplicar</button>
        ${impresora.esPredeterminada || impresora.estado === "Retirada" ? "" : '<button type="button" class="secondary" data-printer-action="predeterminada">Marcar predeterminada</button>'}
        ${impresora.estado === "Retirada" ? "" : '<button type="button" class="secondary" data-printer-action="archivar">Archivar</button>'}
        <button type="button" class="secondary danger-button" data-printer-action="eliminar">Eliminar</button>
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
    Object.entries(errores).forEach(([campo, mensaje]) => {
      const error = document.querySelector(`[data-printer-error="${campo}"]`);
      const input = document.querySelector(`[name="${campo}"]`);
      if (error) error.textContent = mensaje;
      input?.setAttribute("aria-invalid", "true");
    });
    const primero = Object.keys(errores)[0];
    document.querySelector(`[name="${primero}"]`)?.focus();
    $("#impresoraFormMessage").textContent = "Revisa los campos indicados.";
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
    selector.innerHTML = '<option value="">Selecciona una marca</option>'
      + catalogo().obtenerMarcas().map((marca) => `<option value="${escapar(marca.id)}">${escapar(marca.nombre)}</option>`).join("");
    selector.value = seleccionada;
  }

  function poblarModelos(marcaId, seleccionada = "") {
    const selector = $("#impresoraModeloCatalogo");
    if (!selector) return;
    const modelos = catalogo()?.obtenerModelosPorMarca(marcaId) || [];
    selector.innerHTML = '<option value="">Selecciona un modelo</option>'
      + modelos.map((modelo) => `<option value="${escapar(modelo.id)}">${escapar(modelo.modelo)}</option>`).join("");
    selector.disabled = !modelos.length;
    selector.value = seleccionada;
  }

  function poblarVariantes(modeloId, seleccionada = "") {
    const selector = $("#impresoraVarianteCatalogo");
    if (!selector) return;
    const variantes = catalogo()?.obtenerVariantes(modeloId) || [];
    selector.innerHTML = '<option value="">Sin variante</option>'
      + variantes.map((variante) => `<option value="${escapar(variante)}">${escapar(variante)}</option>`).join("");
    selector.disabled = !variantes.length;
    selector.value = variantes.includes(seleccionada) ? seleccionada : "";
  }

  function activarModoManual(activo = true) {
    const panel = $("#impresoraIdentificacionManual");
    if (panel) panel.hidden = !activo;
    if (activo) {
      $("#impresoraCatalogoModeloId").value = "";
      $("#impresoraCatalogoMeta").textContent = "Identificación personalizada. Completa marca, modelo y tecnología manualmente.";
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
    const detalles = [modelo.volumenImpresion, modelo.cerrada ? "cerrada" : "abierta", modelo.multicolorCompatible ? "compatible con multicolor" : "sin dato multicolor"];
    $("#impresoraCatalogoMeta").textContent = `Datos del catálogo: ${detalles.filter(Boolean).join(" · ")}. Los costos y valores operativos no se completan automáticamente.`;
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
      ? "No calculable: revisa vida útil y horas productivas."
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
    $("#impresoraModalTitle").textContent = impresora ? "Editar impresora" : "Agregar impresora";
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
      if (!impresora) $("#impresoraCatalogoMeta").textContent = "El catálogo solo completa la identificación. Debes ingresar el costo real y los datos operativos.";
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
      $("#impresoraFormMessage").textContent = "No fue posible guardar la impresora.";
      return;
    }
    impresoraDetalleId = guardada.id;
    cerrarFormulario();
    actualizarVista();
    renderizarDetalle(guardada.id);
    mostrarMensaje(id ? "Impresora actualizada." : "Impresora guardada.");
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

  function manejarAccion(event) {
    const boton = event.target.closest("[data-printer-action]");
    if (!boton) return;
    const accion = boton.dataset.printerAction;
    const id = idDesdeAccion(boton);
    const impresora = id ? api()?.obtenerImpresoraPorId(id) : null;
    if (accion === "nueva") abrirFormulario();
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
        mostrarMensaje("Impresora duplicada. La copia no quedó como predeterminada.");
      }
    }
    if (accion === "predeterminada" && impresora) {
      if (confirm(`¿Usar “${impresora.nombre}” como impresora predeterminada?`)) {
        api().establecerPredeterminada(id);
        actualizarVista();
        mostrarMensaje("Impresora predeterminada actualizada.");
      }
    }
    if (accion === "archivar" && impresora) {
      const aviso = impresora.esPredeterminada
        ? "Esta es la impresora predeterminada. Al archivarla dejarás de tener una predeterminada."
        : "La impresora quedará retirada y seguirá guardada.";
      if (confirm(`${aviso}\n\n¿Continuar?`)) {
        api().archivarImpresora(id);
        actualizarVista();
        mostrarMensaje("Impresora archivada.");
      }
    }
    if (accion === "eliminar" && impresora) {
      const aviso = impresora.esPredeterminada ? " También dejarás de tener una impresora predeterminada." : "";
      if (confirm(`Eliminar borra este perfil de forma permanente.${aviso}\n\n¿Eliminar “${impresora.nombre}”?`)) {
        api().eliminarImpresora(id);
        impresoraDetalleId = "";
        actualizarVista();
        renderizarDetalle("");
        mostrarMensaje("Impresora eliminada.");
      }
    }
  }

  async function importarArchivo(event) {
    const archivo = event.target.files?.[0];
    if (!archivo) return;
    const modo = confirm("Aceptar: combinar sin duplicar IDs.\nCancelar: reemplazar las impresoras actuales.")
      ? "combinar" : "reemplazar";
    const resultado = api().importarImpresorasJSON(await archivo.text(), modo);
    mostrarMensaje(
      resultado.ok
        ? `${resultado.importadas} impresoras importadas; ${resultado.rechazadas} rechazadas.`
        : `No se importaron impresoras. Registros rechazados: ${resultado.rechazadas}.`,
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
    $("#impresorasOrden").addEventListener("change", renderizarListado);
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

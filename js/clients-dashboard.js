(function () {
  "use strict";

  const $ = (selector, base = document) => base.querySelector(selector);
  const api = () => window.ClientesPrecio3D;
  let clienteActivoId = "";
  let retornoFoco = null;
  let clientePendiente = null;
  let inicializado = false;

  function escapar(valor) {
    return String(valor ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function numero(valor) {
    const resultado = Number(valor);
    return Number.isFinite(resultado) ? resultado : 0;
  }

  function fecha(valor) {
    if (!valor) return "Sin actividad";
    return new Intl.DateTimeFormat("es-CL", { dateStyle: "medium" }).format(new Date(valor));
  }

  function trabajos() {
    return window.StoragePrecio3D?.cargarTrabajos?.() || [];
  }

  function relacionados(clienteId) {
    return trabajos().filter((trabajo) => trabajo.clienteId === clienteId);
  }

  function totalPagado(trabajo) {
    if (Array.isArray(trabajo.pagos) && trabajo.pagos.length) {
      return trabajo.pagos.reduce((total, pago) => total + numero(pago.monto), 0);
    }
    return numero(trabajo.montoAbonado);
  }

  function ventaTrabajo(trabajo) {
    return numero(trabajo.precioVendidoReal);
  }

  function utilidadRealTrabajo(trabajo) {
    return trabajo.precioVendidoReal > 0
      ? numero(trabajo.precioVendidoReal) - numero(trabajo.costoTotal) - numero(trabajo.costosAdicionalesReales)
      : 0;
  }

  function agruparMoneda(lista, selector) {
    return lista.reduce((totales, trabajo) => {
      const moneda = trabajo.moneda || trabajo.datos?.moneda || "CLP";
      totales[moneda] = (totales[moneda] || 0) + numero(selector(trabajo));
      return totales;
    }, {});
  }

  function formatoMoneda(valor, moneda = "CLP") {
    try {
      return new Intl.NumberFormat("es-CL", { style: "currency", currency: moneda, maximumFractionDigits: moneda === "CLP" ? 0 : 2 }).format(numero(valor));
    } catch (_error) {
      return `${moneda} ${numero(valor).toLocaleString("es-CL")}`;
    }
  }

  function formatearTotales(totales) {
    const entradas = Object.entries(totales);
    return entradas.length ? entradas.map(([moneda, total]) => formatoMoneda(total, moneda)).join(" · ") : formatoMoneda(0);
  }

  function metricas(cliente) {
    const lista = relacionados(cliente.id);
    const ventas = lista.filter((trabajo) => ventaTrabajo(trabajo) > 0);
    const actividad = [cliente.fechaActualizacion, ...lista.map((trabajo) => trabajo.fechaActualizacion || trabajo.fechaCreacion)]
      .filter(Boolean)
      .sort()
      .at(-1) || cliente.fechaActualizacion;
    return {
      trabajos: lista,
      cantidad: lista.length,
      ventas,
      vendido: agruparMoneda(ventas, ventaTrabajo),
      cotizado: agruparMoneda(lista, (trabajo) => trabajo.precioFinal),
      pagado: agruparMoneda(lista, totalPagado),
      utilidadEstimada: agruparMoneda(lista, (trabajo) => trabajo.utilidadObjetivo),
      utilidadReal: agruparMoneda(ventas, utilidadRealTrabajo),
      ultimaActividad: actividad
    };
  }

  function renderizarIndicadores(clientes) {
    const contenedor = $("#clientesResumen");
    if (!contenedor) return;
    const ahora = new Date();
    const nuevos = clientes.filter((cliente) => {
      const creada = new Date(cliente.fechaCreacion);
      return creada.getMonth() === ahora.getMonth() && creada.getFullYear() === ahora.getFullYear();
    });
    const conVentas = clientes.filter((cliente) => metricas(cliente).ventas.length);
    const ventas = agruparMoneda(trabajos().filter((trabajo) => trabajo.clienteId && ventaTrabajo(trabajo) > 0), ventaTrabajo);
    const mayor = clientes
      .map((cliente) => ({ cliente, total: Object.values(metricas(cliente).vendido).reduce((suma, valor) => suma + valor, 0) }))
      .sort((a, b) => b.total - a.total)[0];
    const tarjetas = [
      ["Total de clientes", clientes.length],
      ["Clientes con ventas", conVentas.length],
      ["Nuevos este mes", nuevos.length],
      ["Total vendido", formatearTotales(ventas)],
      ["Cliente con mayor venta", mayor?.total > 0 ? mayor.cliente.nombre : "Sin ventas registradas"]
    ];
    contenedor.innerHTML = tarjetas.map(([etiqueta, valor]) => `
      <article class="job-kpi clients-kpi-card">
        <div class="job-kpi__icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 12a4 4 0 100-8 4 4 0 000 8zM5 21v-2a6 6 0 016-6h2a6 6 0 016 6v2"/></svg></div>
        <div><span>${escapar(etiqueta)}</span><strong>${escapar(valor)}</strong></div>
      </article>
    `).join("");
  }

  function obtenerVista() {
    const consulta = String($("#clientesBusqueda")?.value || "").trim().toLowerCase();
    const filtro = $("#clientesFiltro")?.value || "todos";
    const orden = $("#clientesOrden")?.value || "nombre";
    const haceTreintaDias = Date.now() - 30 * 24 * 60 * 60 * 1000;
    let lista = api()?.buscarClientes?.(consulta) || [];

    lista = lista.filter((cliente) => {
      const datos = metricas(cliente);
      if (filtro === "con_trabajos") return datos.cantidad > 0;
      if (filtro === "sin_trabajos") return datos.cantidad === 0;
      if (filtro === "recientes") return new Date(cliente.fechaCreacion).getTime() >= haceTreintaDias;
      return true;
    });

    return lista.sort((a, b) => {
      const ma = metricas(a);
      const mb = metricas(b);
      if (orden === "recientes") return new Date(b.fechaActualizacion) - new Date(a.fechaActualizacion);
      if (orden === "mayor_venta") return Object.values(mb.vendido).reduce((s, v) => s + v, 0) - Object.values(ma.vendido).reduce((s, v) => s + v, 0);
      if (orden === "mayor_trabajos") return mb.cantidad - ma.cantidad;
      return a.nombre.localeCompare(b.nombre, "es", { sensitivity: "base" });
    });
  }

  function acciones(cliente) {
    return `
      <details class="job-action-menu">
        <summary aria-label="Acciones para ${escapar(cliente.nombre)}">Acciones</summary>
        <div>
          <button type="button" data-client-action="detalle" data-client-id="${escapar(cliente.id)}">Ver detalle</button>
          <button type="button" data-client-action="editar" data-client-id="${escapar(cliente.id)}">Editar</button>
          <button type="button" data-client-action="cotizacion" data-client-id="${escapar(cliente.id)}">Crear cotización</button>
          <button type="button" data-client-action="trabajo" data-client-id="${escapar(cliente.id)}">Crear trabajo</button>
          <button type="button" data-client-action="eliminar" data-client-id="${escapar(cliente.id)}" class="danger-button">Eliminar</button>
        </div>
      </details>`;
  }

  function renderizarListado(lista, total) {
    const contenedor = $("#clientesListado");
    if (!contenedor) return;
    if (!total) {
      contenedor.innerHTML = '<p class="empty-state">Aún no has guardado clientes.</p>';
      return;
    }
    if (!lista.length) {
      contenedor.innerHTML = '<p class="empty-state">No hay clientes que coincidan con la búsqueda.</p>';
      return;
    }

    contenedor.innerHTML = `
      <div class="jobs-table-scroll clients-table-scroll">
        <table class="jobs-table clients-table">
          <thead><tr><th>Cliente</th><th>Empresa</th><th>Contacto</th><th>Trabajos</th><th>Total vendido</th><th>Última actividad</th><th>Acciones</th></tr></thead>
          <tbody>${lista.map((cliente) => {
            const datos = metricas(cliente);
            return `<tr data-client-row="${escapar(cliente.id)}">
              <td data-label="Cliente"><button type="button" class="client-name-button" data-client-action="detalle" data-client-id="${escapar(cliente.id)}">${escapar(cliente.nombre)}</button></td>
              <td data-label="Empresa">${escapar(cliente.empresa || "-")}</td>
              <td data-label="Contacto"><span>${escapar(cliente.telefono || cliente.correo || "Sin contacto")}</span></td>
              <td data-label="Trabajos">${datos.cantidad}</td>
              <td data-label="Total vendido">${escapar(formatearTotales(datos.vendido))}</td>
              <td data-label="Última actividad">${escapar(fecha(datos.ultimaActividad))}</td>
              <td data-label="Acciones">${acciones(cliente)}</td>
            </tr>`;
          }).join("")}</tbody>
        </table>
      </div>`;
  }

  function linea(etiqueta, valor) {
    return valor !== undefined && valor !== null && valor !== ""
      ? `<p><strong>${escapar(etiqueta)}:</strong> ${escapar(valor)}</p>`
      : "";
  }

  function renderizarDetalle(id) {
    const panel = $("#clienteDetallePanel");
    const cliente = api()?.obtenerClientePorId?.(id);
    if (!panel || !cliente) return;
    clienteActivoId = id;
    const datos = metricas(cliente);
    panel.hidden = false;
    panel.innerHTML = `
      <header class="client-detail-header">
        <div><p class="eyebrow">Ficha del cliente</p><h3>${escapar(cliente.nombre)}</h3><p>${escapar(cliente.empresa || "Cliente particular")}</p></div>
        <button type="button" class="secondary" data-client-action="cerrar-detalle">Cerrar detalle</button>
      </header>
      <div class="client-detail-grid">
        <section><h4>Datos de contacto</h4>${linea("Identificación", cliente.rutIdFiscal)}${linea("Teléfono", cliente.telefono)}${linea("Correo", cliente.correo)}${linea("Dirección", [cliente.direccion, cliente.ciudad, cliente.pais].filter(Boolean).join(", "))}${linea("Etiquetas", cliente.etiquetas.join(", "))}${linea("Notas", cliente.notas)}</section>
        <section><h4>Resumen</h4>${linea("Cantidad de trabajos", datos.cantidad)}${linea("Total cotizado", formatearTotales(datos.cotizado))}${linea("Total vendido", formatearTotales(datos.vendido))}${linea("Total pagado", formatearTotales(datos.pagado))}${linea("Utilidad estimada", formatearTotales(datos.utilidadEstimada))}${linea("Utilidad real", formatearTotales(datos.utilidadReal))}${linea("Última actividad", fecha(datos.ultimaActividad))}</section>
      </div>
      <section class="client-history"><h4>Historial relacionado</h4>${datos.trabajos.length ? datos.trabajos.map((trabajo) => `<article><strong>${escapar(trabajo.nombreTrabajo)}</strong><span>${escapar(trabajo.estado)} · ${escapar(formatoMoneda(ventaTrabajo(trabajo) || trabajo.precioFinal, trabajo.moneda))}${trabajo.numeroCotizacion ? ` · ${escapar(trabajo.numeroCotizacion)}` : ""}</span></article>`).join("") : '<p class="empty-state">Este cliente todavía no tiene trabajos vinculados.</p>'}</section>
      <div class="actions">
        <button type="button" data-client-action="editar" data-client-id="${escapar(id)}">Editar cliente</button>
        <button type="button" class="secondary" data-client-action="cotizacion" data-client-id="${escapar(id)}">Crear cotización</button>
        <button type="button" class="secondary" data-client-action="trabajo" data-client-id="${escapar(id)}">Crear trabajo</button>
        <button type="button" class="secondary" data-client-action="ver-trabajos" data-client-id="${escapar(id)}">Ver trabajos</button>
        <button type="button" class="secondary" data-client-action="exportar" data-client-id="${escapar(id)}">Exportar datos</button>
        <button type="button" class="secondary danger-button" data-client-action="eliminar" data-client-id="${escapar(id)}">Eliminar</button>
      </div>`;
  }

  function renderizar() {
    const clientes = api()?.obtenerClientes?.() || [];
    renderizarIndicadores(clientes);
    renderizarListado(obtenerVista(), clientes.length);
    if (clienteActivoId && api()?.obtenerClientePorId?.(clienteActivoId)) renderizarDetalle(clienteActivoId);
  }

  function datosFormulario() {
    return {
      nombre: $("#clienteNombre")?.value,
      empresa: $("#clienteEmpresa")?.value,
      rutIdFiscal: $("#clienteRutIdFiscal")?.value,
      telefono: $("#clienteTelefono")?.value,
      correo: $("#clienteCorreo")?.value,
      direccion: $("#clienteDireccion")?.value,
      ciudad: $("#clienteCiudad")?.value,
      pais: $("#clientePais")?.value,
      notas: $("#clienteNotas")?.value,
      etiquetas: $("#clienteEtiquetas")?.value
    };
  }

  function asignarFormulario(cliente = {}) {
    const campos = {
      clienteFormId: cliente.id,
      clienteNombre: cliente.nombre,
      clienteEmpresa: cliente.empresa,
      clienteRutIdFiscal: cliente.rutIdFiscal,
      clienteTelefono: cliente.telefono,
      clienteCorreo: cliente.correo,
      clienteDireccion: cliente.direccion,
      clienteCiudad: cliente.ciudad,
      clientePais: cliente.pais,
      clienteNotas: cliente.notas,
      clienteEtiquetas: cliente.etiquetas?.join(", ")
    };
    Object.entries(campos).forEach(([id, valor]) => { if ($(`#${id}`)) $(`#${id}`).value = valor || ""; });
  }

  function abrirModal(cliente = null, disparador = document.activeElement) {
    retornoFoco = disparador;
    clientePendiente = null;
    asignarFormulario(cliente || {});
    $("#clienteModalTitle").textContent = cliente ? "Editar cliente" : "Nuevo cliente";
    $("#clienteDuplicadoAviso").hidden = true;
    $("#clienteFormMessage").textContent = "";
    $("#clienteModal").hidden = false;
    document.body.classList.add("modal-open");
    window.requestAnimationFrame(() => $("#clienteNombre")?.focus());
  }

  function cerrarModal() {
    $("#clienteModal").hidden = true;
    document.body.classList.remove("modal-open");
    retornoFoco?.focus?.();
  }

  function guardarFormulario(permitirDuplicado = false) {
    const id = $("#clienteFormId")?.value || "";
    const datos = datosFormulario();
    const correo = String(datos.correo || "").trim();
    if (!String(datos.nombre || "").trim()) {
      $("#clienteFormMessage").textContent = "Escribe el nombre del cliente.";
      $("#clienteNombre")?.focus();
      return;
    }
    if (correo && !$("#clienteCorreo")?.checkValidity()) {
      $("#clienteFormMessage").textContent = "Revisa el formato del correo.";
      $("#clienteCorreo")?.focus();
      return;
    }

    const resultado = id
      ? api()?.actualizarCliente?.(id, datos, { permitirDuplicado })
      : api()?.crearCliente?.(datos, { permitirDuplicado });
    if (!resultado?.ok && resultado?.duplicados?.length) {
      clientePendiente = { id, datos };
      $("#clienteDuplicadoTexto").textContent = resultado.duplicados.map((cliente) => cliente.nombre).join(", ");
      $("#abrirClienteDuplicadoButton").dataset.clientId = resultado.duplicados[0].id;
      $("#clienteDuplicadoAviso").hidden = false;
      $("#clienteFormMessage").textContent = resultado.error;
      return;
    }
    if (!resultado?.ok) {
      $("#clienteFormMessage").textContent = resultado?.error || "No se pudo guardar el cliente.";
      return;
    }
    cerrarModal();
    clienteActivoId = resultado.cliente.id;
    renderizar();
    renderizarDetalle(clienteActivoId);
    mostrarMensaje("Cliente guardado.");
  }

  function mostrarMensaje(mensaje, error = false) {
    const elemento = $("#clientesMessage");
    if (!elemento) return;
    elemento.textContent = mensaje;
    elemento.classList.toggle("storage-error", error);
    elemento.classList.toggle("storage-success", !error && Boolean(mensaje));
  }

  function descargar(nombre, contenido, tipo) {
    const url = URL.createObjectURL(new Blob([contenido], { type: tipo }));
    const enlace = document.createElement("a");
    enlace.href = url;
    enlace.download = nombre;
    enlace.click();
    URL.revokeObjectURL(url);
  }

  function csvCelda(valor) {
    return `"${String(valor ?? "").replaceAll('"', '""')}"`;
  }

  function exportarCSV() {
    const filas = [["Nombre", "Empresa", "RUT / ID fiscal", "Teléfono", "Correo", "Dirección", "Ciudad", "País", "Etiquetas", "Cantidad de trabajos", "Total vendido", "Fecha creación", "Fecha actualización"]];
    (api()?.obtenerClientes?.() || []).forEach((cliente) => {
      const datos = metricas(cliente);
      filas.push([cliente.nombre, cliente.empresa, cliente.rutIdFiscal, cliente.telefono, cliente.correo, cliente.direccion, cliente.ciudad, cliente.pais, cliente.etiquetas.join(", "), datos.cantidad, formatearTotales(datos.vendido), cliente.fechaCreacion, cliente.fechaActualizacion]);
    });
    descargar("clientes-impresion-3d.csv", `\uFEFF${filas.map((fila) => fila.map(csvCelda).join(",")).join("\r\n")}`, "text/csv;charset=utf-8");
  }

  function exportarJSON(cliente = null) {
    const contenido = api()?.exportarClientesJSON?.(cliente ? [cliente] : undefined);
    if (contenido) descargar(cliente ? `cliente-${cliente.nombre}.json` : "clientes-impresion-3d.json", contenido, "application/json;charset=utf-8");
  }

  function usarCliente(cliente, destino) {
    document.dispatchEvent(new CustomEvent(destino === "trabajo" ? "precio3d:usar-cliente-trabajo" : "precio3d:usar-cliente-cotizacion", { detail: { cliente } }));
    window.NavegacionPrecio3D?.mostrarSeccion?.(destino === "trabajo" ? "cotizar" : "datos-cotizacion", { enfocar: true });
  }

  function manejarAccion(event) {
    const boton = event.target.closest("[data-client-action]");
    if (!boton) return;
    const accion = boton.dataset.clientAction;
    const cliente = api()?.obtenerClientePorId?.(boton.dataset.clientId);
    if (accion === "cerrar-detalle") { $("#clienteDetallePanel").hidden = true; clienteActivoId = ""; return; }
    if (!cliente) return;
    if (accion === "detalle") renderizarDetalle(cliente.id);
    if (accion === "editar") abrirModal(cliente, boton);
    if (accion === "cotizacion") usarCliente(cliente, "cotizacion");
    if (accion === "trabajo") usarCliente(cliente, "trabajo");
    if (accion === "ver-trabajos") {
      window.NavegacionPrecio3D?.mostrarSeccion?.("trabajos", { enfocar: true });
      const buscador = $("#trabajosBusqueda");
      if (buscador) { buscador.value = cliente.nombre; buscador.dispatchEvent(new Event("input", { bubbles: true })); }
    }
    if (accion === "exportar") exportarJSON(cliente);
    if (accion === "eliminar" && confirm(`¿Eliminar a ${cliente.nombre}? Los trabajos vinculados se conservarán.`)) {
      if (api()?.eliminarCliente?.(cliente.id)) {
        clienteActivoId = "";
        $("#clienteDetallePanel").hidden = true;
        renderizar();
        document.dispatchEvent(new CustomEvent("precio3d:cliente-eliminado", { detail: { clienteId: cliente.id } }));
        mostrarMensaje("Cliente eliminado. Sus trabajos se conservaron con una copia de los datos.");
      }
    }
  }

  function manejarTecladoModal(event) {
    const modal = $("#clienteModal");
    if (modal?.hidden) return;
    if (event.key === "Escape") { cerrarModal(); return; }
    if (event.key !== "Tab") return;
    const focos = [...modal.querySelectorAll('button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])')];
    if (!focos.length) return;
    const primero = focos[0];
    const ultimo = focos.at(-1);
    if (event.shiftKey && document.activeElement === primero) { event.preventDefault(); ultimo.focus(); }
    if (!event.shiftKey && document.activeElement === ultimo) { event.preventDefault(); primero.focus(); }
  }

  async function importarArchivo(event) {
    const archivo = event.target.files?.[0];
    event.target.value = "";
    if (!archivo) return;
    const reemplazar = confirm("¿Quieres reemplazar los clientes actuales? Aceptar reemplaza; Cancelar combina.");
    const resultado = api()?.importarClientesJSON?.(await archivo.text(), reemplazar ? "reemplazar" : "combinar");
    if (!resultado?.ok) { mostrarMensaje(resultado?.error || "No se pudo importar el archivo.", true); return; }
    renderizar();
    mostrarMensaje(`${resultado.importados} clientes importados.${resultado.omitidos.length ? ` ${resultado.omitidos.length} posibles duplicados fueron omitidos.` : ""}`);
  }

  function inicializar() {
    if (inicializado || !$("#misClientesPanel")) return;
    inicializado = true;
    $("#nuevoClienteButton")?.addEventListener("click", (event) => abrirModal(null, event.currentTarget));
    $("#clientesFiltros")?.addEventListener("input", renderizar);
    $("#clientesFiltros")?.addEventListener("change", renderizar);
    $("#clientesListado")?.addEventListener("click", manejarAccion);
    $("#clienteDetallePanel")?.addEventListener("click", manejarAccion);
    $("#clienteForm")?.addEventListener("submit", (event) => { event.preventDefault(); guardarFormulario(false); });
    $("#clienteModalClose")?.addEventListener("click", cerrarModal);
    $("#cancelarClienteButton")?.addEventListener("click", cerrarModal);
    $("#clienteModal")?.addEventListener("click", (event) => { if (event.target.matches("[data-client-close]")) cerrarModal(); });
    document.addEventListener("keydown", manejarTecladoModal);
    $("#guardarClienteDuplicadoButton")?.addEventListener("click", () => guardarFormulario(true));
    $("#abrirClienteDuplicadoButton")?.addEventListener("click", (event) => {
      const id = event.currentTarget.dataset.clientId;
      cerrarModal();
      window.NavegacionPrecio3D?.mostrarSeccion?.("clientes", { enfocar: true });
      renderizarDetalle(id);
    });
    $("#exportarClientesCsvButton")?.addEventListener("click", exportarCSV);
    $("#exportarClientesJsonButton")?.addEventListener("click", () => exportarJSON());
    $("#importarClientesButton")?.addEventListener("click", () => $("#importarClientesInput")?.click());
    $("#importarClientesInput")?.addEventListener("change", importarArchivo);
    window.addEventListener("precio3d:clientes-actualizados", renderizar);
    window.addEventListener("precio3d:trabajos-actualizados", renderizar);
    document.addEventListener("precio3d:abrir-nuevo-cliente", (event) => abrirModal(event.detail?.cliente || null, event.detail?.disparador));
    renderizar();
  }

  window.PanelClientesPrecio3D = { inicializar, renderizar, abrirModal, metricas, exportarCSV };
  inicializar();
})();

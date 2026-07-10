// Elementos principales de la interfaz
const calculateButton = document.querySelector("#calculateButton");
const calculateBasicButton = document.querySelector("#calculateBasicButton");
const clearButton = document.querySelector("#clearButton");
const exportExcelButton = document.querySelector("#btnExportarExcel");
const resultBox = document.querySelector("#result");
const resultBasico = document.querySelector("#resultBasico");
const basicBreakdown = document.querySelector("#basicBreakdown");
const basicWarnings = document.querySelector("#basicWarnings");
const preciosNivelContenido = document.querySelector("#preciosNivelContenido");
const comparadorCanalesContenido = document.querySelector("#comparadorCanalesContenido");
const metodoPagoComparador = document.querySelector("#metodoPagoComparador");
const guardarConfiguracionButton = document.querySelector("#guardarConfiguracionButton");
const restablecerConfiguracionButton = document.querySelector("#restablecerConfiguracionButton");
const exportarConfiguracionButton = document.querySelector("#exportarConfiguracionButton");
const importarConfiguracionButton = document.querySelector("#importarConfiguracionButton");
const importarConfiguracionInput = document.querySelector("#importarConfiguracionInput");
const trabajoCliente = document.querySelector("#trabajoCliente");
const trabajoDescripcion = document.querySelector("#trabajoDescripcion");
const trabajoEstado = document.querySelector("#trabajoEstado");
const guardarTrabajoActualButton = document.querySelector("#guardarTrabajoActualButton");
const guardarDesdeResultadoButton = document.querySelector("#guardarDesdeResultadoButton");
const generarCotizacionDesdeResultadoButton = document.querySelector("#generarCotizacionDesdeResultadoButton");
const exportarTrabajosButton = document.querySelector("#exportarTrabajosButton");
const exportarTrabajosJsonButton = document.querySelector("#exportarTrabajosJsonButton");
const importarTrabajosButton = document.querySelector("#importarTrabajosButton");
const importarTrabajosInput = document.querySelector("#importarTrabajosInput");
const borrarTrabajosButton = document.querySelector("#borrarTrabajosButton");
const trabajosMessage = document.querySelector("#trabajosMessage");
const trabajosResumen = document.querySelector("#trabajosResumen");
const trabajosListado = document.querySelector("#trabajosListado");
const guardarDatosCotizacionButton = document.querySelector("#guardarDatosCotizacionButton");
const borrarDatosCotizacionButton = document.querySelector("#borrarDatosCotizacionButton");
const datosCotizacionMessage = document.querySelector("#datosCotizacionMessage");
const generarCotizacionButton = document.querySelector("#generarCotizacionButton");
const vistaPreviaCotizacionButton = document.querySelector("#vistaPreviaCotizacionButton");
const imprimirCotizacionButton = document.querySelector("#imprimirCotizacionButton");
const nuevaCotizacionButton = document.querySelector("#nuevaCotizacionButton");
const cotizacionMessage = document.querySelector("#cotizacionMessage");
const cotizacionClienteVista = document.querySelector("#cotizacionClienteVista");
const storageMessage = document.querySelector("#storageMessage");
const ultimoCalculoPanel = document.querySelector("#ultimoCalculoPanel");
const ultimoCalculoResumen = document.querySelector("#ultimoCalculoResumen");
const cargarUltimoCalculoButton = document.querySelector("#cargarUltimoCalculoButton");
const borrarUltimoCalculoButton = document.querySelector("#borrarUltimoCalculoButton");
const supuestosModoBasico = document.querySelector("#supuestosModoBasico");
const toggleSupuestosEditables = document.querySelector("#toggleSupuestosEditables");
const panelSupuestosEditables = document.querySelector("#panelSupuestosEditables");
const btnModoBasico = document.querySelector("#btnModoBasico");
const btnModoAvanzado = document.querySelector("#btnModoAvanzado");
const verCalculoAvanzado = document.querySelector("#verCalculoAvanzado");
const volverModoBasico = document.querySelector("#volverModoBasico");
const seccionModoBasico = document.querySelector("#seccionModoBasico");
const seccionModoAvanzado = document.querySelector("#seccionModoAvanzado");
const currencySelect = document.querySelector("#currencySelect");
const currencySelectBasico = document.querySelector("#currencySelectBasico");
const languageSelect = document.querySelector("#languageSelect");
const languageSelectBasico = document.querySelector("#languageSelectBasico");
const currencyFormatPreview = document.querySelector("#currencyFormatPreview");
const currencyFormatPreviewBasico = document.querySelector("#currencyFormatPreviewBasico");
const materialBasico = document.querySelector("#materialBasico");
const impresoraBasico = document.querySelector("#impresoraBasico");
const canalVentaBasico = document.querySelector("#canalVentaBasico");
const nivelTrabajoBasico = document.querySelector("#nivelTrabajoBasico");
const manoObraSimpleBasico = document.querySelector("#manoObraSimpleBasico");
const modoCostoGramoBasico = document.querySelector("#modoCostoGramoBasico");
const modoCostoKiloBasico = document.querySelector("#modoCostoKiloBasico");
const costoUnidadHelpBasico = document.querySelector("#costoUnidadHelpBasico");
const materialAvanzado = document.querySelector("#materialAvanzado");
const impresoraAvanzado = document.querySelector("#impresoraAvanzado");
const canalVentaAvanzado = document.querySelector("#canalVentaAvanzado");
const modoCostoGramoAvanzado = document.querySelector("#modoCostoGramoAvanzado");
const modoCostoKiloAvanzado = document.querySelector("#modoCostoKiloAvanzado");
const costoUnidadHelpAvanzado = document.querySelector("#costoUnidadHelpAvanzado");

const valoresNivelTrabajo = {
  basico: 1500,
  normal: 4000,
  detallado: 8000
};

const nivelesPrecioSugeridos = [
  {
    nombre: "Competitivo",
    margen: 0.2,
    nota: "Para pedidos simples o clientes sensibles al precio."
  },
  {
    nombre: "Estándar",
    margen: 0.35,
    nota: "Buen equilibrio entre precio, costo y ganancia."
  },
  {
    nombre: "Premium",
    margen: 0.55,
    nota: "Para trabajos urgentes, detallados o de mayor valor."
  }
];

const estadosTrabajo = ["Pendiente", "Aceptado", "Rechazado", "Terminado", "Pagado"];

let modoActual = "avanzado";
let ultimoResultadoBasico = null;
let ultimosSupuestosBasicos = {};
let ultimoFeeEstimadoBasico = 0;
let ultimoDatosCalculo = null;
let ultimoResultadoCalculo = null;
let ultimoModoCalculo = null;
let trabajoCotizacionTemporal = null;
let numeroCotizacionActual = null;
let referenciaCotizacionActual = null;
let guardadoPausado = true;
let temporizadorGuardado = null;
let avisoStorageMostrado = false;

// Boton reservado para una futura exportacion a Excel
exportExcelButton.disabled = true;

function actualizarBotonesGuardarTrabajo(habilitado) {
  [guardarTrabajoActualButton, guardarDesdeResultadoButton].forEach((boton) => {
    if (boton) {
      boton.disabled = !habilitado;
    }
  });
}

actualizarBotonesGuardarTrabajo(false);

function actualizarBotonesCotizacion(habilitado) {
  [
    generarCotizacionButton,
    vistaPreviaCotizacionButton,
    imprimirCotizacionButton,
    generarCotizacionDesdeResultadoButton
  ].forEach((boton) => {
    if (boton) {
      boton.disabled = !habilitado;
    }
  });

  if (cotizacionMessage) {
    cotizacionMessage.classList.toggle("empty-state", !habilitado);
    cotizacionMessage.textContent = habilitado
      ? "El cálculo está listo para generar una cotización."
      : "Primero realiza un cálculo para generar una cotización.";
  }
}

actualizarBotonesCotizacion(false);

function obtenerPresets() {
  if (!window.PresetsPrecio3D?.supuestosBasicos) {
    const mensaje = "No se pudo cargar js/presets.js. Revisa que el archivo exista y se cargue antes de app.js.";
    console.error(mensaje);

    if (resultBasico) {
      resultBasico.textContent = mensaje;
    }

    if (resultBox) {
      resultBox.textContent = mensaje;
    }

    return null;
  }

  return window.PresetsPrecio3D;
}

// Convierte entradas vacias o invalidas en cero.
function leerNumero(id) {
  const elemento = document.querySelector(`#${id}`);
  const numero = Number(elemento?.value);

  if (!Number.isFinite(numero) || numero < 0) {
    return 0;
  }

  return numero;
}

function bloquearNumeroNegativo(event) {
  if (Number(event.target.value) < 0) {
    event.target.value = 0;
  }
}

function tieneValor(id) {
  const elemento = document.querySelector(`#${id}`);
  return elemento && elemento.value !== "";
}

// Convierte porcentajes escritos como 10 o 0.10 a 0.10.
function normalizarPorcentaje(valor) {
  const numero = Number(valor);

  if (!Number.isFinite(numero) || numero < 0) {
    return 0;
  }

  return numero > 1 ? numero / 100 : numero;
}

function leerPorcentaje(id) {
  const elemento = document.querySelector(`#${id}`);
  return normalizarPorcentaje(elemento?.value);
}

function leerPorcentajeConFallback(id, fallback) {
  if (!tieneValor(id)) {
    return normalizarPorcentaje(fallback);
  }

  return leerPorcentaje(id);
}

// Lee textos como "5 h 30 min", "20 min" o "1.5".
function leerHoras(id) {
  const elemento = document.querySelector(`#${id}`);
  const texto = String(elemento?.value || "").trim().toLowerCase().replace(",", ".");

  if (!texto) {
    return 0;
  }

  const numeroDirecto = Number(texto);

  if (Number.isFinite(numeroDirecto) && numeroDirecto >= 0) {
    return numeroDirecto;
  }

  const horas = texto.match(/([\d.]+)\s*h/);
  const minutos = texto.match(/([\d.]+)\s*m/);
  const valorHoras = horas ? Number(horas[1]) : 0;
  const valorMinutos = minutos ? Number(minutos[1]) : 0;
  const total = valorHoras + valorMinutos / 60;

  return Number.isFinite(total) && total >= 0 ? total : 0;
}

// Convierte campos separados de horas y minutos a horas decimales.
function leerHorasYMinutos(horasId, minutosId) {
  return leerNumero(horasId) + leerNumero(minutosId) / 60;
}

function obtenerPorId(lista, id) {
  return Array.isArray(lista) ? lista.find((item) => item.id === id) : null;
}

function mostrarMensajeAlmacenamiento(mensaje, esError = false) {
  if (!storageMessage) {
    return;
  }

  storageMessage.textContent = mensaje;
  storageMessage.classList.toggle("storage-error", esError);
  storageMessage.classList.toggle("storage-success", !esError && Boolean(mensaje));
}

function mostrarMensajeTrabajos(mensaje, esError = false) {
  if (!trabajosMessage) {
    return;
  }

  trabajosMessage.textContent = mensaje;
  trabajosMessage.classList.toggle("storage-error", esError);
  trabajosMessage.classList.toggle("storage-success", !esError && Boolean(mensaje));
}

function mostrarMensajeDatosCotizacion(mensaje, esError = false) {
  if (!datosCotizacionMessage) {
    return;
  }

  datosCotizacionMessage.textContent = mensaje;
  datosCotizacionMessage.classList.toggle("storage-error", esError);
  datosCotizacionMessage.classList.toggle("storage-success", !esError && Boolean(mensaje));
}

function mostrarMensajeCotizacion(mensaje, esError = false) {
  if (!cotizacionMessage) {
    return;
  }

  cotizacionMessage.textContent = mensaje;
  cotizacionMessage.classList.remove("empty-state");
  cotizacionMessage.classList.toggle("storage-error", esError);
  cotizacionMessage.classList.toggle("storage-success", !esError && Boolean(mensaje));
}

function mostrarAdvertenciaStorageUnaVez() {
  if (avisoStorageMostrado) {
    return;
  }

  avisoStorageMostrado = true;
  mostrarMensajeAlmacenamiento("No se pudo usar almacenamiento local en este navegador.", true);
}

function almacenamientoLocalDisponible() {
  try {
    const clavePrueba = "__precio3d_app_storage_test__";
    localStorage.setItem(clavePrueba, "ok");
    localStorage.removeItem(clavePrueba);
    return true;
  } catch (error) {
    console.warn("LocalStorage no disponible.", error);
    return false;
  }
}

function valorCampo(id) {
  const elemento = document.querySelector(`#${id}`);
  return elemento ? elemento.value : "";
}

function textoSeleccionado(id) {
  const elemento = document.querySelector(`#${id}`);
  return elemento?.selectedOptions?.[0]?.textContent?.trim() || "";
}

function obtenerNombreTrabajo(id) {
  const nombre = valorCampo(id).trim();
  return nombre || "Trabajo sin nombre";
}

function escaparHtml(valor) {
  return String(valor ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function asignarValorCampo(id, valor) {
  const elemento = document.querySelector(`#${id}`);

  if (!elemento || valor === undefined || valor === null) {
    return;
  }

  if (elemento.tagName === "SELECT") {
    const existeOpcion = Array.from(elemento.options).some((option) => option.value === String(valor));

    if (!existeOpcion) {
      return;
    }
  }

  elemento.value = valor;
}

function asignarSelectPorTexto(id, texto) {
  const selector = document.querySelector(`#${id}`);

  if (!selector || !texto) {
    return;
  }

  const opcion = Array.from(selector.options).find(
    (item) => item.textContent.trim() === String(texto).trim()
  );

  if (opcion) {
    selector.value = opcion.value;
  }
}

function asignarTiempoDesdeHoras(horasId, minutosId, horasTotales) {
  const totalMinutos = Math.max(0, Math.round((Number(horasTotales) || 0) * 60));
  asignarValorCampo(horasId, Math.floor(totalMinutos / 60));
  asignarValorCampo(minutosId, totalMinutos % 60);
}

function notificarCalculoValido() {
  document.dispatchEvent(new CustomEvent("precio3d:calculo-valido"));
}

function obtenerTipoPrecioFilamento(tipo) {
  return estaUsandoCostoPorKilo(tipo) ? "kilo" : "gramo";
}

function obtenerPresetsPersonalizados(lista) {
  return Array.isArray(lista)
    ? lista.filter((item) => item.id?.includes("personalizado") || item.personalizado)
    : [];
}

function obtenerConfiguracionActual() {
  const presets = obtenerPresets();

  return {
    modoActual,
    idioma: languageSelectBasico?.value || languageSelect?.value || "es",
    moneda: currencySelectBasico?.value || currencySelect?.value || "CLP",
    basico: {
      nombreTrabajo: valorCampo("nombreTrabajoBasico"),
      cantidadProductos: valorCampo("cantidadBasico"),
      material: valorCampo("materialBasico"),
      impresora: valorCampo("impresoraBasico"),
      canalVenta: valorCampo("canalVentaBasico"),
      tipoPrecioFilamento: obtenerTipoPrecioFilamento("basico"),
      precioFilamento: valorCampo("costoUnidadBasico"),
      impuesto: valorCampo("impuestoBasico"),
      margen: valorCampo("margenBasico"),
      tarifaKwh: valorCampo("tarifaKwhBasico"),
      manoObraSimple: valorCampo("manoObraSimpleBasico"),
      nivelTrabajo: valorCampo("nivelTrabajoBasico"),
      embalaje: valorCampo("embalajeBasico"),
      envio: valorCampo("envioBasico"),
      feeFijo: valorCampo("feeFijoBasico"),
      feePorcentual: valorCampo("feePorcentualBasico"),
      supuestosEditados: {
        merma: valorCampo("mermaBasico"),
        wattsPromedio: valorCampo("wattsPromedioBasico"),
        tarifaKwh: valorCampo("tarifaKwhBasico"),
        costoImpresora: valorCampo("costoImpresoraBasico"),
        costoHerramientas: valorCampo("costoHerramientasBasico"),
        anosVida: valorCampo("anosVidaBasico"),
        diasOperativosAno: valorCampo("diasOperativosAnoBasico"),
        horasProductivasDia: valorCampo("horasProductivasDiaBasico"),
        mantenimiento: valorCampo("mantenimientoBasico")
      }
    },
    avanzado: {
      nombreTrabajo: valorCampo("nombreTrabajoAvanzado"),
      cliente: valorCampo("clienteAvanzado"),
      cantidadProductos: valorCampo("cantidadAvanzado"),
      material: valorCampo("materialAvanzado"),
      impresora: valorCampo("impresoraAvanzado"),
      canalVenta: valorCampo("canalVentaAvanzado"),
      tipoPrecioFilamento: obtenerTipoPrecioFilamento("avanzado"),
      precioFilamento: valorCampo("costoUnidadAvanzado"),
      impuesto: valorCampo("impuestoAvanzado"),
      margen: valorCampo("margenAvanzado"),
      tarifaKwh: valorCampo("tarifaKwhAvanzado"),
      costoHerramientas: valorCampo("costoHerramientasAvanzado"),
      anosVida: valorCampo("anosVidaAvanzado"),
      diasOperativosAno: valorCampo("diasOperativosAnoAvanzado"),
      horasProductivasDia: valorCampo("horasProductivasDiaAvanzado"),
      embalaje: valorCampo("embalajeAvanzado"),
      envio: valorCampo("envioAvanzado"),
      feePorcentual: valorCampo("feeMarketplaceAvanzado"),
      feePago: valorCampo("feePagoAvanzado")
    },
    comparador: {
      metodoPago: valorCampo("metodoPagoComparador")
    },
    personalizados: {
      materiales: obtenerPresetsPersonalizados(presets?.materiales),
      impresoras: obtenerPresetsPersonalizados(presets?.impresoras),
      canalesVenta: obtenerPresetsPersonalizados(presets?.canalesVenta)
    }
  };
}

function guardarConfiguracionActual(mostrarMensaje = false) {
  if (!window.StoragePrecio3D?.guardarConfiguracion) {
    return false;
  }

  const guardado = window.StoragePrecio3D.guardarConfiguracion(obtenerConfiguracionActual());

  if (!guardado) {
    mostrarAdvertenciaStorageUnaVez();
    return false;
  }

  if (mostrarMensaje) {
    mostrarMensajeAlmacenamiento("Configuración guardada.");
  }

  return true;
}

function programarGuardadoConfiguracion() {
  if (guardadoPausado) {
    return;
  }

  clearTimeout(temporizadorGuardado);
  temporizadorGuardado = setTimeout(() => guardarConfiguracionActual(false), 300);
}

function registrarAutoguardado() {
  document.querySelectorAll("input, select").forEach((elemento) => {
    if (elemento.type === "file") {
      return;
    }

    elemento.addEventListener("input", programarGuardadoConfiguracion);
    elemento.addEventListener("change", programarGuardadoConfiguracion);
  });
}

function aplicarConfiguracion(configuracion, mostrarMensaje = false) {
  if (!configuracion || typeof configuracion !== "object") {
    return false;
  }

  guardadoPausado = true;

  asignarValorCampo("currencySelectBasico", configuracion.moneda);
  asignarValorCampo("currencySelect", configuracion.moneda);
  asignarValorCampo("languageSelectBasico", configuracion.idioma);
  asignarValorCampo("languageSelect", configuracion.idioma);

  const basico = configuracion.basico || {};
  const avanzado = configuracion.avanzado || {};
  const supuestos = basico.supuestosEditados || {};

  asignarValorCampo("materialBasico", basico.material);
  asignarValorCampo("nombreTrabajoBasico", basico.nombreTrabajo);
  asignarValorCampo("cantidadBasico", basico.cantidadProductos);
  asignarValorCampo("impresoraBasico", basico.impresora);
  asignarValorCampo("canalVentaBasico", basico.canalVenta);
  cambiarModoCostoMaterial("basico", basico.tipoPrecioFilamento === "kilo");
  asignarValorCampo("costoUnidadBasico", basico.precioFilamento);
  asignarValorCampo("impuestoBasico", basico.impuesto);
  asignarValorCampo("margenBasico", basico.margen);
  asignarValorCampo("manoObraSimpleBasico", basico.manoObraSimple);
  asignarValorCampo("nivelTrabajoBasico", basico.nivelTrabajo);
  asignarValorCampo("embalajeBasico", basico.embalaje);
  asignarValorCampo("envioBasico", basico.envio);
  asignarValorCampo("feeFijoBasico", basico.feeFijo);
  asignarValorCampo("feePorcentualBasico", basico.feePorcentual);
  asignarValorCampo("mermaBasico", supuestos.merma);
  asignarValorCampo("wattsPromedioBasico", supuestos.wattsPromedio);
  asignarValorCampo("tarifaKwhBasico", supuestos.tarifaKwh || basico.tarifaKwh);
  asignarValorCampo("costoImpresoraBasico", supuestos.costoImpresora);
  asignarValorCampo("costoHerramientasBasico", supuestos.costoHerramientas);
  asignarValorCampo("anosVidaBasico", supuestos.anosVida);
  asignarValorCampo("diasOperativosAnoBasico", supuestos.diasOperativosAno);
  asignarValorCampo("horasProductivasDiaBasico", supuestos.horasProductivasDia);
  asignarValorCampo("mantenimientoBasico", supuestos.mantenimiento);

  asignarValorCampo("materialAvanzado", avanzado.material);
  asignarValorCampo("nombreTrabajoAvanzado", avanzado.nombreTrabajo);
  asignarValorCampo("clienteAvanzado", avanzado.cliente);
  asignarValorCampo("cantidadAvanzado", avanzado.cantidadProductos);
  asignarValorCampo("impresoraAvanzado", avanzado.impresora);
  asignarValorCampo("canalVentaAvanzado", avanzado.canalVenta);
  cambiarModoCostoMaterial("avanzado", avanzado.tipoPrecioFilamento === "kilo");
  asignarValorCampo("costoUnidadAvanzado", avanzado.precioFilamento);
  asignarValorCampo("impuestoAvanzado", avanzado.impuesto);
  asignarValorCampo("margenAvanzado", avanzado.margen);
  asignarValorCampo("tarifaKwhAvanzado", avanzado.tarifaKwh);
  asignarValorCampo("costoHerramientasAvanzado", avanzado.costoHerramientas);
  asignarValorCampo("anosVidaAvanzado", avanzado.anosVida);
  asignarValorCampo("diasOperativosAnoAvanzado", avanzado.diasOperativosAno);
  asignarValorCampo("horasProductivasDiaAvanzado", avanzado.horasProductivasDia);
  asignarValorCampo("embalajeAvanzado", avanzado.embalaje);
  asignarValorCampo("envioAvanzado", avanzado.envio);
  asignarValorCampo("feeMarketplaceAvanzado", avanzado.feePorcentual);
  asignarValorCampo("feePagoAvanzado", avanzado.feePago);
  asignarValorCampo("metodoPagoComparador", configuracion.comparador?.metodoPago);

  actualizarAyudaCostoMaterial("basico");
  actualizarAyudaCostoMaterial("avanzado");
  actualizarVistaPreviaMoneda();
  ultimosSupuestosBasicos = obtenerSupuestosBasicos();
  renderizarSupuestosBasicos(ultimosSupuestosBasicos);
  cambiarModo(configuracion.modoActual === "avanzado" ? "avanzado" : "basico");
  window.cambiarIdioma(languageSelectBasico.value || "es");

  guardadoPausado = false;

  if (mostrarMensaje) {
    mostrarMensajeAlmacenamiento("Se cargó tu configuración guardada.");
  }

  return true;
}

function cargarConfiguracionInicial() {
  if (!almacenamientoLocalDisponible()) {
    guardadoPausado = false;
    mostrarAdvertenciaStorageUnaVez();
    return;
  }

  const configuracion = window.StoragePrecio3D?.cargarConfiguracion?.();

  if (configuracion) {
    aplicarConfiguracion(configuracion, true);
  } else {
    guardadoPausado = false;
  }
}

function exportarConfiguracion() {
  if (!window.StoragePrecio3D?.exportarConfiguracionJSON) {
    mostrarAdvertenciaStorageUnaVez();
    return;
  }

  const contenido = window.StoragePrecio3D.exportarConfiguracionJSON(obtenerConfiguracionActual());
  const blob = new Blob([contenido], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "configuracion-precio-3d.json";
  link.click();
  URL.revokeObjectURL(url);
}

function importarConfiguracionDesdeArchivo(event) {
  const archivo = event.target.files?.[0];

  if (!archivo) {
    return;
  }

  const reader = new FileReader();

  reader.onload = () => {
    const configuracion = window.StoragePrecio3D?.importarConfiguracionJSON?.(reader.result);

    if (!configuracion) {
      mostrarMensajeAlmacenamiento("Archivo de configuración inválido.", true);
      importarConfiguracionInput.value = "";
      return;
    }

    aplicarConfiguracion(configuracion, false);
    guardarConfiguracionActual(false);
    mostrarMensajeAlmacenamiento("Configuración guardada.");
    importarConfiguracionInput.value = "";
  };

  reader.onerror = () => {
    mostrarMensajeAlmacenamiento("Archivo de configuración inválido.", true);
    importarConfiguracionInput.value = "";
  };

  reader.readAsText(archivo);
}

function escaparCSV(valor) {
  const texto = String(valor ?? "");
  const limpio = texto.replaceAll('"', '""');

  return /[",\n\r]/.test(limpio) ? `"${limpio}"` : limpio;
}

function crearCSV(filas) {
  return filas.map((fila) => fila.map(escaparCSV).join(",")).join("\r\n");
}

function descargarArchivo(nombreArchivo, contenido, tipo = "text/plain;charset=utf-8") {
  const blob = new Blob([contenido], { type: tipo });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = nombreArchivo;
  link.click();
  URL.revokeObjectURL(url);
}

function crearCSVConBOM(filas) {
  return `\uFEFF${crearCSV(filas)}`;
}

function restablecerConfiguracionGuardada() {
  const confirmar = confirm("¿Seguro que quieres restablecer la configuración guardada?");

  if (!confirmar) {
    return;
  }

  guardadoPausado = true;
  const borrado = window.StoragePrecio3D?.borrarConfiguracion?.();

  if (!borrado) {
    mostrarAdvertenciaStorageUnaVez();
    guardadoPausado = false;
    return;
  }

  limpiarFormulario();
  guardadoPausado = false;
  mostrarMensajeAlmacenamiento("Configuración restablecida.");
}

// Carga una lista de monedas en un selector.
function cargarSelectorMonedas(selector) {
  if (!selector) {
    return;
  }

  selector.innerHTML = "";

  window.MonedasPrecio3D.forEach((moneda) => {
    const option = document.createElement("option");
    option.value = moneda.codigo;
    option.textContent = `${moneda.codigo} - ${moneda.nombre}`;
    selector.appendChild(option);
  });

  selector.value = "CLP";
}

// Carga una lista de idiomas en un selector.
function cargarSelectorIdiomas(selector) {
  if (!selector) {
    return;
  }

  selector.innerHTML = "";

  Object.entries(window.IdiomasPrecio3D).forEach(([codigo, idioma]) => {
    const option = document.createElement("option");
    option.value = codigo;
    option.textContent = idioma.nombre;
    selector.appendChild(option);
  });

  selector.value = "es";
}

function cargarSelectorPreset(selector, lista) {
  if (!selector || !Array.isArray(lista)) {
    return;
  }

  selector.innerHTML = "";

  lista.forEach((item) => {
    const option = document.createElement("option");
    option.value = item.id;
    option.textContent = item.nombre;
    selector.appendChild(option);
  });
}

function cargarMonedas() {
  cargarSelectorMonedas(currencySelect);
  cargarSelectorMonedas(currencySelectBasico);
}

function cargarIdiomas() {
  cargarSelectorIdiomas(languageSelect);
  cargarSelectorIdiomas(languageSelectBasico);
}

function cargarPresetsVisuales() {
  const presets = obtenerPresets();

  if (!presets) {
    return;
  }

  cargarSelectorPreset(materialBasico, presets.materiales);
  cargarSelectorPreset(materialAvanzado, presets.materiales);
  cargarSelectorPreset(impresoraBasico, presets.impresoras);
  cargarSelectorPreset(impresoraAvanzado, presets.impresoras);
  cargarSelectorPreset(canalVentaBasico, presets.canalesVenta);
  cargarSelectorPreset(canalVentaAvanzado, presets.canalesVenta);
}

function cargarMetodosPagoComparador() {
  const presets = obtenerPresets();

  if (!metodoPagoComparador || !presets) {
    return;
  }

  if (!Array.isArray(presets.metodosPago)) {
    const mensaje = "No se pudo cargar la lista de métodos de pago desde js/presets.js.";
    console.error(mensaje);
    metodoPagoComparador.innerHTML = "";

    if (comparadorCanalesContenido) {
      comparadorCanalesContenido.className = "comparator-empty";
      comparadorCanalesContenido.textContent = mensaje;
    }

    return;
  }

  metodoPagoComparador.innerHTML = "";

  const opcionAutomatica = document.createElement("option");
  opcionAutomatica.value = "automatico";
  opcionAutomatica.textContent = "Automático según canal";
  opcionAutomatica.dataset.i18n = "automaticoSegunCanal";
  metodoPagoComparador.appendChild(opcionAutomatica);

  presets.metodosPago
    .filter((metodo) => metodo.id !== "pago-integrado-marketplace")
    .forEach((metodo) => {
      const option = document.createElement("option");
      option.value = metodo.id;
      option.textContent = metodo.nombre;
      metodoPagoComparador.appendChild(option);
    });

  metodoPagoComparador.value = "automatico";
}

// Busca la moneda activa para formatear montos.
function obtenerMonedaSeleccionada() {
  const codigo = modoActual === "basico" ? currencySelectBasico.value : currencySelect.value;
  return window.MonedasPrecio3D.find((moneda) => moneda.codigo === codigo);
}

// Formatea un numero con la moneda seleccionada, sin convertir valores.
function formatearMoneda(valor) {
  const moneda = obtenerMonedaSeleccionada();

  if (!moneda) {
    return String(valor);
  }

  return new Intl.NumberFormat(moneda.locale, {
    style: "currency",
    currency: moneda.codigo
  }).format(Number(valor) || 0);
}

function formatearPorcentaje(valor) {
  return `${((Number(valor) || 0) * 100).toFixed(1)}%`;
}

function formatearFeeMixto(fijo, porcentaje) {
  return `${formatearMoneda(fijo)} + ${formatearPorcentaje(porcentaje)}`;
}

function obtenerConfigCostoMaterial(tipo) {
  if (tipo === "basico") {
    return {
      inputId: "costoUnidadBasico",
      botonGramo: modoCostoGramoBasico,
      botonKilo: modoCostoKiloBasico,
      etiqueta: document.querySelector("#costoUnidadLabelBasico"),
      ayuda: costoUnidadHelpBasico
    };
  }

  return {
    inputId: "costoUnidadAvanzado",
    botonGramo: modoCostoGramoAvanzado,
    botonKilo: modoCostoKiloAvanzado,
    etiqueta: document.querySelector("#costoUnidadLabelAvanzado"),
    ayuda: costoUnidadHelpAvanzado
  };
}

function estaUsandoCostoPorKilo(tipo) {
  const config = obtenerConfigCostoMaterial(tipo);
  return config.botonKilo.classList.contains("active");
}

function leerCostoMaterialPorGramo(tipo) {
  const config = obtenerConfigCostoMaterial(tipo);
  const valor = leerNumero(config.inputId);

  return estaUsandoCostoPorKilo(tipo) ? valor / 1000 : valor;
}

function escribirCostoMaterialDesdeGramo(tipo, costoPorGramo) {
  const config = obtenerConfigCostoMaterial(tipo);
  const input = document.querySelector(`#${config.inputId}`);
  const valor = Number(costoPorGramo) || 0;

  input.value = estaUsandoCostoPorKilo(tipo) ? valor * 1000 : valor;
  actualizarAyudaCostoMaterial(tipo);
}

function actualizarAyudaCostoMaterial(tipo) {
  const config = obtenerConfigCostoMaterial(tipo);
  const input = document.querySelector(`#${config.inputId}`);
  const usandoKilo = estaUsandoCostoPorKilo(tipo);

  if (Number(input.value) < 0) {
    input.value = 0;
  }

  const costoPorGramo = leerCostoMaterialPorGramo(tipo);
  const valorVacio = input.value === "";
  const valorCero = leerNumero(config.inputId) === 0;
  const advertenciaKilo =
    usandoKilo && (valorVacio || valorCero) ? " Ingresa un precio por kilo mayor a 0." : "";

  config.etiqueta.textContent = usandoKilo ? "Precio por kilo de filamento" : "Precio por gramo";
  config.ayuda.textContent = usandoKilo
    ? `Si ingresas el precio del kilo, la calculadora lo convertirá automáticamente a costo por gramo. Costo por gramo calculado: ${formatearMoneda(costoPorGramo)}.${advertenciaKilo}`
    : `Precio por gramo calculado: ${formatearMoneda(costoPorGramo)}.`;
  config.ayuda.classList.toggle("warning-text", Boolean(advertenciaKilo));
}

function cambiarModoCostoMaterial(tipo, usarKilo) {
  const config = obtenerConfigCostoMaterial(tipo);
  const costoPorGramo = leerCostoMaterialPorGramo(tipo);

  config.botonGramo.classList.toggle("active", !usarKilo);
  config.botonKilo.classList.toggle("active", usarKilo);
  escribirCostoMaterialDesdeGramo(tipo, costoPorGramo);
  programarGuardadoConfiguracion();
}

// Actualiza las vistas previas del formato monetario.
function actualizarVistaPreviaMoneda() {
  const texto = `Formato de ejemplo: ${formatearMoneda(123456)}`;

  if (currencyFormatPreview) {
    currencyFormatPreview.textContent = texto;
  }

  if (currencyFormatPreviewBasico) {
    currencyFormatPreviewBasico.textContent = texto;
  }

  actualizarAyudaCostoMaterial("basico");
  actualizarAyudaCostoMaterial("avanzado");
}

function sincronizarMonedas(origen) {
  const valor = origen.value;

  if (currencySelect && currencySelect !== origen) {
    currencySelect.value = valor;
  }

  if (currencySelectBasico && currencySelectBasico !== origen) {
    currencySelectBasico.value = valor;
  }

  actualizarVistaPreviaMoneda();
  renderizarSupuestosBasicos(ultimosSupuestosBasicos);

  if (ultimoResultadoBasico) {
    renderizarResultadoBasico(ultimoResultadoBasico, ultimoFeeEstimadoBasico);
  }

  if (ultimoDatosCalculo && ultimoResultadoCalculo) {
    renderizarComparadorCanales(ultimoDatosCalculo, ultimoResultadoCalculo);
    renderizarPreciosPorNivel(ultimoDatosCalculo);
  }
}

function sincronizarIdiomas(origen) {
  const valor = origen.value;

  if (languageSelect && languageSelect !== origen) {
    languageSelect.value = valor;
  }

  if (languageSelectBasico && languageSelectBasico !== origen) {
    languageSelectBasico.value = valor;
  }

  window.cambiarIdioma(valor);
}

function cambiarModo(modo) {
  modoActual = modo;
  const esBasico = modo === "basico";

  seccionModoBasico.hidden = !esBasico;
  seccionModoAvanzado.hidden = esBasico;
  btnModoBasico.classList.toggle("active", esBasico);
  btnModoAvanzado.classList.toggle("active", !esBasico);
  btnModoBasico.setAttribute("aria-pressed", String(esBasico));
  btnModoAvanzado.setAttribute("aria-pressed", String(!esBasico));
  actualizarVistaPreviaMoneda();
  programarGuardadoConfiguracion();
}

function alternarSupuestosEditables() {
  const estaAbierto = toggleSupuestosEditables.getAttribute("aria-expanded") === "true";
  const indicador = toggleSupuestosEditables.querySelector(".collapse-indicator");

  toggleSupuestosEditables.setAttribute("aria-expanded", String(!estaAbierto));
  panelSupuestosEditables.hidden = estaAbierto;
  indicador.textContent = estaAbierto ? "Mostrar" : "Ocultar";
}

function aplicarMaterialBasico() {
  const presets = obtenerPresets();
  const material = obtenerPorId(presets?.materiales, materialBasico.value);

  if (!material) {
    return;
  }

  escribirCostoMaterialDesdeGramo("basico", material.costoUnidad);
  document.querySelector("#mermaBasico").value = (Number(material.mermaSugerida) * 100).toFixed(1);
  ultimosSupuestosBasicos = obtenerSupuestosBasicos();
  renderizarSupuestosBasicos(ultimosSupuestosBasicos);
}

function aplicarImpresoraBasico() {
  const presets = obtenerPresets();
  const base = presets?.supuestosBasicos;
  const impresora = obtenerPorId(presets?.impresoras, impresoraBasico.value);

  if (!base) {
    return;
  }

  document.querySelector("#wattsPromedioBasico").value = impresora?.wattsPromedio || base.wattsPromedio;
  document.querySelector("#tarifaKwhBasico").value = base.tarifaKwh;
  document.querySelector("#costoImpresoraBasico").value =
    impresora?.costoImpresora || base.costoImpresora;
  document.querySelector("#costoHerramientasBasico").value =
    impresora?.costoHerramientas || base.costoHerramientas;
  document.querySelector("#anosVidaBasico").value = impresora?.anosVida || base.anosVida;
  document.querySelector("#diasOperativosAnoBasico").value =
    impresora?.diasOperativosAno || base.diasOperativosAno;
  document.querySelector("#horasProductivasDiaBasico").value =
    impresora?.horasProductivasDia || base.horasProductivasDia;
  document.querySelector("#mantenimientoBasico").value = (
    Number(impresora?.mantenimiento ?? base.mantenimiento) * 100
  ).toFixed(1);
  ultimosSupuestosBasicos = obtenerSupuestosBasicos();
  renderizarSupuestosBasicos(ultimosSupuestosBasicos);
}

function aplicarCanalBasico() {
  const presets = obtenerPresets();
  const canal = obtenerPorId(presets?.canalesVenta, canalVentaBasico.value);

  if (!canal) {
    return;
  }

  document.querySelector("#feeFijoBasico").value = canal.feeFijo;
  document.querySelector("#feePorcentualBasico").value = (Number(canal.feePorcentaje) * 100).toFixed(1);
}

function aplicarMaterialAvanzado() {
  const presets = obtenerPresets();
  const material = obtenerPorId(presets?.materiales, materialAvanzado.value);

  if (material) {
    escribirCostoMaterialDesdeGramo("avanzado", material.costoUnidad);
  }
}

function aplicarImpresoraAvanzado() {
  const presets = obtenerPresets();
  const impresora = obtenerPorId(presets?.impresoras, impresoraAvanzado.value);

  if (!impresora) {
    return;
  }

  document.querySelector("#wattsPromedioAvanzado").value = impresora.wattsPromedio;
  document.querySelector("#costoImpresoraAvanzado").value = impresora.costoImpresora;
  document.querySelector("#costoHerramientasAvanzado").value = impresora.costoHerramientas;
  document.querySelector("#anosVidaAvanzado").value = impresora.anosVida;
  document.querySelector("#diasOperativosAnoAvanzado").value = impresora.diasOperativosAno;
  document.querySelector("#horasProductivasDiaAvanzado").value = impresora.horasProductivasDia;
  document.querySelector("#mantenimientoAvanzado").value = (Number(impresora.mantenimiento) * 100).toFixed(1);
}

function aplicarCanalAvanzado() {
  const presets = obtenerPresets();
  const canal = obtenerPorId(presets?.canalesVenta, canalVentaAvanzado.value);

  if (!canal) {
    return;
  }

  document.querySelector("#feeMarketplaceAvanzado").value = (Number(canal.feePorcentaje) * 100).toFixed(1);
}

// Los supuestos base vienen desde js/presets.js.
function obtenerSupuestosBasicos() {
  const presets = obtenerPresets();

  if (!presets) {
    return null;
  }

  const impresora = obtenerPorId(presets.impresoras, impresoraBasico.value);
  const supuestos = { ...presets.supuestosBasicos };

  if (impresora) {
    supuestos.wattsPromedio = Number(impresora.wattsPromedio) || supuestos.wattsPromedio;
    supuestos.costoImpresora = Number(impresora.costoImpresora) || supuestos.costoImpresora;
    supuestos.costoHerramientas =
      Number(impresora.costoHerramientas) || supuestos.costoHerramientas;
    supuestos.anosVida = Number(impresora.anosVida) || supuestos.anosVida;
    supuestos.diasOperativosAno = Number(impresora.diasOperativosAno) || supuestos.diasOperativosAno;
    supuestos.horasProductivasDia =
      Number(impresora.horasProductivasDia) || supuestos.horasProductivasDia;
    supuestos.mantenimiento = Number(impresora.mantenimiento) || supuestos.mantenimiento;
  }

  if (tieneValor("mermaBasico")) {
    supuestos.merma = leerPorcentaje("mermaBasico");
  }

  if (tieneValor("wattsPromedioBasico")) {
    supuestos.wattsPromedio = leerNumero("wattsPromedioBasico");
  }

  if (tieneValor("tarifaKwhBasico")) {
    supuestos.tarifaKwh = leerNumero("tarifaKwhBasico");
  }

  if (tieneValor("costoImpresoraBasico")) {
    supuestos.costoImpresora = leerNumero("costoImpresoraBasico");
  }

  if (tieneValor("costoHerramientasBasico")) {
    supuestos.costoHerramientas = leerNumero("costoHerramientasBasico");
  }

  if (tieneValor("anosVidaBasico")) {
    supuestos.anosVida = leerNumero("anosVidaBasico");
  }

  if (tieneValor("diasOperativosAnoBasico")) {
    supuestos.diasOperativosAno = leerNumero("diasOperativosAnoBasico");
  }

  if (tieneValor("horasProductivasDiaBasico")) {
    supuestos.horasProductivasDia = leerNumero("horasProductivasDiaBasico");
  }

  if (tieneValor("mantenimientoBasico")) {
    supuestos.mantenimiento = leerPorcentaje("mantenimientoBasico");
  }

  return supuestos;
}

function actualizarSupuestosEditablesBasico() {
  ultimosSupuestosBasicos = obtenerSupuestosBasicos();
  renderizarSupuestosBasicos(ultimosSupuestosBasicos);
}

function actualizarManoObraPorNivel() {
  const valorSugerido = valoresNivelTrabajo[nivelTrabajoBasico.value];

  if (valorSugerido !== undefined) {
    manoObraSimpleBasico.value = valorSugerido;
  }
}

function construirDatosBasicos() {
  const supuestos = obtenerSupuestosBasicos();

  if (!supuestos) {
    return null;
  }

  const cantidad = Math.max(1, leerNumero("cantidadBasico") || 1);
  const manoObraTotal = leerNumero("manoObraSimpleBasico") * cantidad;

  return {
    datos: {
      nombreTrabajo: obtenerNombreTrabajo("nombreTrabajoBasico"),
      cliente: "",
      cantidadProductos: cantidad,
      material: textoSeleccionado("materialBasico"),
      canalVenta: textoSeleccionado("canalVentaBasico"),
      metodoPago: textoSeleccionado("metodoPagoComparador"),
      moneda: currencySelectBasico?.value || "CLP",
      pesoPieza: leerNumero("pesoPiezaBasico") * cantidad,
      pesoSoportesPurga: leerNumero("pesoSoportesPurgaBasico") * cantidad,
      costoUnidad: leerCostoMaterialPorGramo("basico"),
      merma: supuestos.merma,
      horasImpresion:
        leerHorasYMinutos("horasImpresionHorasBasico", "horasImpresionMinutosBasico") * cantidad,
      wattsPromedio: supuestos.wattsPromedio,
      tarifaKwh: supuestos.tarifaKwh,
      costoImpresora: supuestos.costoImpresora,
      costoHerramientas: supuestos.costoHerramientas,
      mantenimiento: supuestos.mantenimiento,
      anosVida: supuestos.anosVida,
      diasOperativosAno: supuestos.diasOperativosAno,
      horasProductivasDia: supuestos.horasProductivasDia,
      horasPreparacion: manoObraTotal > 0 ? 1 : 0,
      horasPostprocesado: supuestos.horasPostprocesado,
      horasQA: supuestos.horasQA,
      tarifaHora: manoObraTotal,
      embalaje: leerNumero("embalajeBasico"),
      envio: leerNumero("envioBasico"),
      seguro: supuestos.seguro,
      aduanas: supuestos.aduanas,
      marketing: supuestos.marketing,
      otrosCostos: supuestos.otrosCostos,
      margen: leerPorcentaje("margenBasico"),
      feeFijoTotal: leerNumero("feeFijoBasico"),
      feePorcentualTotal: leerPorcentaje("feePorcentualBasico"),
      tasaImpuesto: leerPorcentaje("impuestoBasico")
    },
    supuestos
  };
}

function construirDatosAvanzados() {
  const presets = obtenerPresets();

  if (!presets) {
    return null;
  }

  const cantidad = Math.max(1, leerNumero("cantidadAvanzado") || 1);
  const material = obtenerPorId(presets.materiales, materialAvanzado.value);
  const impresora = obtenerPorId(presets.impresoras, impresoraAvanzado.value);
  const supuestos = { ...presets.supuestosBasicos, ...(impresora || {}) };

  return {
    datos: {
      nombreTrabajo: obtenerNombreTrabajo("nombreTrabajoAvanzado"),
      cliente: valorCampo("clienteAvanzado").trim(),
      cantidadProductos: cantidad,
      material: textoSeleccionado("materialAvanzado"),
      canalVenta: textoSeleccionado("canalVentaAvanzado"),
      metodoPago: textoSeleccionado("metodoPagoComparador"),
      moneda: currencySelect?.value || "CLP",
      pesoPieza: leerNumero("pesoPiezaAvanzado") * cantidad,
      pesoSoportesPurga: leerNumero("pesoSoportesPurgaAvanzado") * cantidad,
      costoUnidad: leerCostoMaterialPorGramo("avanzado"),
      merma: Number(material?.mermaSugerida) || supuestos.merma,
      horasImpresion:
        leerHorasYMinutos("horasImpresionHorasAvanzado", "horasImpresionMinutosAvanzado") * cantidad,
      wattsPromedio: leerNumero("wattsPromedioAvanzado") || supuestos.wattsPromedio,
      tarifaKwh: leerNumero("tarifaKwhAvanzado") || supuestos.tarifaKwh,
      costoImpresora: leerNumero("costoImpresoraAvanzado") || supuestos.costoImpresora,
      costoHerramientas: leerNumero("costoHerramientasAvanzado") || supuestos.costoHerramientas,
      mantenimiento: leerPorcentajeConFallback("mantenimientoAvanzado", supuestos.mantenimiento),
      anosVida: leerNumero("anosVidaAvanzado") || supuestos.anosVida,
      diasOperativosAno: leerNumero("diasOperativosAnoAvanzado") || supuestos.diasOperativosAno,
      horasProductivasDia: leerNumero("horasProductivasDiaAvanzado") || supuestos.horasProductivasDia,
      horasPreparacion: leerHoras("horasPreparacionAvanzado"),
      horasPostprocesado: leerHoras("horasPostprocesadoAvanzado") * cantidad,
      horasQA: supuestos.horasQA,
      tarifaHora: leerNumero("tarifaHoraAvanzado"),
      embalaje: leerNumero("embalajeAvanzado"),
      envio: leerNumero("envioAvanzado"),
      seguro: leerNumero("seguroAduanasAvanzado"),
      aduanas: supuestos.aduanas,
      marketing: supuestos.marketing,
      otrosCostos: supuestos.otrosCostos,
      margen: leerPorcentaje("margenAvanzado"),
      feeFijoTotal: 0,
      feePorcentualTotal: leerPorcentaje("feeMarketplaceAvanzado") + leerPorcentaje("feePagoAvanzado"),
      tasaImpuesto: leerPorcentaje("impuestoAvanzado")
    }
  };
}

function crearItemResumen(etiqueta, valor) {
  return `<div class="summary-item"><span>${etiqueta}</span><strong>${valor}</strong></div>`;
}

function crearItemDesglose(etiqueta, valor) {
  return `<div class="breakdown-item"><span>${etiqueta}</span><strong>${valor}</strong></div>`;
}

function calcularFeeEstimado(resumen) {
  if (resumen.precioNeto === null) {
    return 0;
  }

  return resumen.feeFijoTotal + resumen.precioNeto * resumen.feePorcentualTotal;
}

function crearNivelPrecio(nivel, datosBase) {
  const resumenNivel = window.FormulasPrecio3D.calcularResumenCompleto({
    ...datosBase,
    margen: nivel.margen
  });

  if (resumenNivel.precioNeto === null) {
    return `
      <div class="price-level-card">
        <span>${nivel.nombre}</span>
        <strong>No calculable</strong>
        <p>${nivel.nota}</p>
      </div>
    `;
  }

  const feeEstimado = calcularFeeEstimado(resumenNivel);
  const utilidadEstimada = resumenNivel.precioNeto - resumenNivel.costoTotal - feeEstimado;

  return `
    <div class="price-level-card">
      <span>${nivel.nombre} · ${formatearPorcentaje(nivel.margen)}</span>
      <strong>${formatearMoneda(resumenNivel.precioFinal)}</strong>
      <p>${nivel.nota}</p>
      <small>Utilidad estimada: ${formatearMoneda(utilidadEstimada)}</small>
    </div>
  `;
}

function renderizarPreciosPorNivel(datosBase) {
  if (!preciosNivelContenido) {
    return;
  }

  if (!datosBase || !window.FormulasPrecio3D?.calcularResumenCompleto) {
    preciosNivelContenido.className = "price-levels-empty";
    preciosNivelContenido.textContent = "Primero realiza un cálculo para ver precios por nivel.";
    return;
  }

  const niveles = [
    ...nivelesPrecioSugeridos,
    {
      nombre: "Tu margen",
      margen: normalizarPorcentaje(datosBase.margen),
      nota: "Usa el margen que ingresaste en el formulario."
    }
  ];

  preciosNivelContenido.className = "price-level-grid";
  preciosNivelContenido.innerHTML = niveles.map((nivel) => crearNivelPrecio(nivel, datosBase)).join("");
}

function formatoComparadorMoneda(valor) {
  return valor === null || !Number.isFinite(Number(valor)) ? "No calculable" : formatearMoneda(valor);
}

function formatoComparadorPorcentaje(valor) {
  return valueEsNumero(valor) ? formatearPorcentaje(valor) : "No calculable";
}

function valueEsNumero(valor) {
  return valor !== null && Number.isFinite(Number(valor));
}

function obtenerMejorResultado(resultados, selector, comparador) {
  const validos = resultados.filter((resultado) => valueEsNumero(selector(resultado)));

  if (validos.length === 0) {
    return null;
  }

  return validos.reduce((mejor, actual) =>
    comparador(selector(actual), selector(mejor)) ? actual : mejor
  );
}

function crearRecomendacion(etiqueta, resultado, valor) {
  return `
    <div class="recommendation-item">
      <span>${etiqueta}</span>
      <strong>${resultado ? `${resultado.canalNombre} · ${valor}` : "No calculable"}</strong>
    </div>
  `;
}

function renderizarComparadorCanales(datosBase, resultadoBase) {
  const presets = obtenerPresets();

  if (!comparadorCanalesContenido || !presets || !window.ComparadorPrecio3D?.compararCanales) {
    return;
  }

  if (!datosBase || !resultadoBase || resultadoBase.precioNeto === null) {
    comparadorCanalesContenido.className = "comparator-empty";
    comparadorCanalesContenido.textContent = "Realiza un cálculo para comparar precios por canal.";
    return;
  }

  if (!Array.isArray(presets.metodosPago)) {
    const mensaje = "No se pudo cargar la lista de métodos de pago desde js/presets.js.";
    console.error(mensaje);
    comparadorCanalesContenido.className = "comparator-empty";
    comparadorCanalesContenido.textContent = mensaje;
    return;
  }

  const metodoSeleccionado = metodoPagoComparador?.value || "automatico";
  const resultados = window.ComparadorPrecio3D.compararCanales(
    datosBase,
    presets.canalesVenta,
    metodoSeleccionado
  );

  if (resultados.length === 0) {
    comparadorCanalesContenido.className = "comparator-empty";
    comparadorCanalesContenido.textContent = "No hay canales configurados para comparar.";
    return;
  }

  const menorPrecio = obtenerMejorResultado(resultados, (r) => r.precioFinal, (a, b) => a < b);
  const mayorUtilidad = obtenerMejorResultado(resultados, (r) => r.utilidadReal, (a, b) => a > b);
  const menorFee = obtenerMejorResultado(resultados, (r) => r.feesEstimados, (a, b) => a < b);

  comparadorCanalesContenido.className = "";
  comparadorCanalesContenido.innerHTML = `
    <div class="comparison-recommendations">
      ${crearRecomendacion(
        "Menor precio final",
        menorPrecio,
        menorPrecio ? formatearMoneda(menorPrecio.precioFinal) : ""
      )}
      ${crearRecomendacion(
        "Mayor utilidad",
        mayorUtilidad,
        mayorUtilidad ? formatearMoneda(mayorUtilidad.utilidadReal) : ""
      )}
      ${crearRecomendacion(
        "Menor comisión",
        menorFee,
        menorFee ? formatearMoneda(menorFee.feesEstimados) : ""
      )}
    </div>
    <details class="collapsible-section">
      <summary>Ver tabla completa de comparación</summary>
      <div class="table-wrap">
        <table class="comparator-table">
          <thead>
            <tr>
              <th>Canal</th>
              <th>Método de pago</th>
              <th>Fee canal</th>
              <th>Fee pago</th>
              <th>Fee total</th>
              <th>Precio sugerido</th>
              <th>Fees estimados</th>
              <th>Utilidad estimada</th>
              <th>Margen real</th>
              <th>Diferencia vs venta directa</th>
              <th>Nota</th>
            </tr>
          </thead>
          <tbody>
            ${resultados
              .map(
                (resultado) => `
                  <tr>
                    <td>${resultado.canalNombre}</td>
                    <td>${resultado.metodoPagoAplicado}</td>
                    <td>${formatearFeeMixto(resultado.feeFijoCanal, resultado.feePorcentajeCanal)}</td>
                    <td>${formatearFeeMixto(resultado.feeFijoPago, resultado.feePorcentajePago)}</td>
                    <td>${formatearFeeMixto(resultado.feeFijoTotal, resultado.feePorcentualTotal)}</td>
                    <td>${formatoComparadorMoneda(resultado.precioFinal)}</td>
                    <td>${formatoComparadorMoneda(resultado.feesEstimados)}</td>
                    <td>${formatoComparadorMoneda(resultado.utilidadReal)}</td>
                    <td>${formatoComparadorPorcentaje(resultado.margenReal)}</td>
                    <td>${formatoComparadorMoneda(resultado.diferenciaVsVentaDirecta)}</td>
                    <td>${resultado.nota || ""}</td>
                  </tr>
                `
              )
              .join("")}
          </tbody>
        </table>
      </div>
    </details>
  `;
}

function renderizarResultado(resumen, feeEstimado, destino, desglose, opciones = {}) {
  if (resumen.precioNeto === null) {
    destino.innerHTML = "El fee porcentual debe ser menor a 100%.";

    if (desglose) {
      desglose.innerHTML = "";
    }

    return;
  }

  const utilidadEstimada = resumen.precioNeto - resumen.costoTotal - feeEstimado;
  const margenObjetivo = opciones.margenObjetivo || 0;
  const margenReal =
    resumen.precioNeto > 0 && Number.isFinite(utilidadEstimada)
      ? utilidadEstimada / resumen.precioNeto
      : 0;
  const nombreTrabajo = opciones.nombreTrabajo || "Trabajo sin nombre";
  const cantidadProductos = Math.max(1, Number(opciones.cantidadProductos) || 1);
  const resumenHtml = opciones.resumenBasicoSimple
    ? `
      ${crearItemResumen("Precio sugerido", formatearMoneda(resumen.precioFinal))}
      ${crearItemResumen("Costo real estimado", formatearMoneda(resumen.costoTotal))}
      ${crearItemResumen("Utilidad estimada", formatearMoneda(utilidadEstimada))}
      ${crearItemResumen("Margen real", formatearPorcentaje(margenReal))}
    `
    : `
      ${crearItemResumen("Precio sugerido al cliente", formatearMoneda(resumen.precioFinal))}
      ${crearItemResumen("Costo real estimado", formatearMoneda(resumen.costoTotal))}
      ${crearItemResumen("Utilidad estimada", formatearMoneda(utilidadEstimada))}
      ${crearItemResumen("Margen objetivo", formatearPorcentaje(margenObjetivo))}
      ${crearItemResumen("Fee estimado", formatearMoneda(feeEstimado))}
      ${crearItemResumen("Impuesto estimado", formatearMoneda(resumen.impuesto))}
    `;

  const desgloseHtml = `
    ${crearItemDesglose("Material", formatearMoneda(resumen.costoMaterial))}
    ${crearItemDesglose("Electricidad", formatearMoneda(resumen.costoElectricidad))}
    ${crearItemDesglose("Amortización", formatearMoneda(resumen.costoAmortizacion))}
    ${crearItemDesglose("Mano de obra", formatearMoneda(resumen.costoManoObra))}
    ${crearItemDesglose("Logística", formatearMoneda(resumen.costoLogistico))}
    ${crearItemDesglose("Fees", formatearMoneda(feeEstimado))}
    ${crearItemDesglose("Impuesto", formatearMoneda(resumen.impuesto))}
  `;

  destino.innerHTML = `
    <p class="result-job-name">${escaparHtml(nombreTrabajo)}</p>
    <p class="result-job-meta">Cantidad: ${cantidadProductos}</p>
    <p class="result-total">${formatearMoneda(resumen.precioFinal)}</p>
    <div class="result-summary">
      ${resumenHtml}
    </div>
    ${desglose ? "" : `<div class="breakdown-grid">${desgloseHtml}</div>`}
  `;

  if (desglose) {
    desglose.innerHTML = desgloseHtml;
  }
}

function renderizarResultadoBasico(
  resumen,
  feeEstimado,
  nombreTrabajo = obtenerNombreTrabajo("nombreTrabajoBasico"),
  cantidadProductos = Math.max(1, leerNumero("cantidadBasico") || 1)
) {
  renderizarResultado(resumen, feeEstimado, resultBasico, basicBreakdown, {
    margenObjetivo: leerPorcentaje("margenBasico"),
    resumenBasicoSimple: true,
    nombreTrabajo,
    cantidadProductos
  });

  if (resumen.precioNeto === null) {
    basicWarnings.innerHTML = "";
    return;
  }

  renderizarAdvertenciasBasicas(resumen, feeEstimado);
}

function renderizarAdvertenciasBasicas(resumen, feeEstimado) {
  const envio = leerNumero("envioBasico");
  const feePorcentual = leerPorcentaje("feePorcentualBasico");
  const advertencias = [];

  if (resumen.precioFinal > 0 && envio > resumen.precioFinal * 0.3) {
    advertencias.push("El envío supera el 30% del precio final.");
  }

  if (resumen.costoManoObra > resumen.costoMaterial) {
    advertencias.push("La mano de obra supera el costo del material.");
  }

  if (feePorcentual > 0.15) {
    advertencias.push("El fee porcentual es mayor al 15%.");
  }

  if (resumen.precioFinal < resumen.costoTotal + feeEstimado) {
    advertencias.push("El precio final no cubre costo total + fees.");
  }

  basicWarnings.innerHTML = advertencias
    .map((advertencia) => `<div class="warning-item">${advertencia}</div>`)
    .join("");
}

function crearItemSupuesto(etiqueta, valor) {
  return `<div class="assumption-item"><span>${etiqueta}</span><strong>${valor}</strong></div>`;
}

function renderizarSupuestosBasicos(supuestos) {
  if (!supuestos) {
    supuestosModoBasico.innerHTML = "";
    return;
  }

  supuestosModoBasico.innerHTML = `
    ${crearItemSupuesto("Merma usada", formatearPorcentaje(supuestos.merma))}
    ${crearItemSupuesto("Watts promedio", `${supuestos.wattsPromedio} W`)}
    ${crearItemSupuesto("Tarifa eléctrica", formatearMoneda(supuestos.tarifaKwh))}
    ${crearItemSupuesto("Costo de impresora usado", formatearMoneda(supuestos.costoImpresora))}
    ${crearItemSupuesto("Costo de herramientas usado", formatearMoneda(supuestos.costoHerramientas))}
    ${crearItemSupuesto("Vida útil", `${supuestos.anosVida} años`)}
    ${crearItemSupuesto("Días operativos al año", supuestos.diasOperativosAno)}
    ${crearItemSupuesto("Horas productivas al día", supuestos.horasProductivasDia)}
    ${crearItemSupuesto("Mantenimiento", formatearPorcentaje(supuestos.mantenimiento))}
    ${crearItemSupuesto("Horas preparación base", supuestos.horasPreparacion)}
    ${crearItemSupuesto("Horas postprocesado base", supuestos.horasPostprocesado)}
    ${crearItemSupuesto("Horas QA base", supuestos.horasQA)}
    ${crearItemSupuesto("Seguro", formatearMoneda(supuestos.seguro))}
    ${crearItemSupuesto("Aduanas", formatearMoneda(supuestos.aduanas))}
    ${crearItemSupuesto("Marketing", formatearMoneda(supuestos.marketing))}
    ${crearItemSupuesto("Otros costos", formatearMoneda(supuestos.otrosCostos))}
  `;
}

function obtenerUtilidadEstimada(resultado) {
  if (!resultado || resultado.precioNeto === null) {
    return 0;
  }

  return Number(resultado.utilidadObjetivo) || 0;
}

function obtenerMargenRealDesdeResultado(resultado) {
  if (!resultado || resultado.precioNeto === null || !resultado.precioNeto) {
    return null;
  }

  const feeEstimado = calcularFeeEstimado(resultado);
  const utilidadEstimada = resultado.precioNeto - resultado.costoTotal - feeEstimado;
  const margen = utilidadEstimada / resultado.precioNeto;

  return Number.isFinite(margen) ? margen : null;
}

function formatearFechaTrabajo(valor) {
  if (!valor) {
    return "Sin fecha";
  }

  return new Date(valor).toLocaleDateString();
}

function obtenerTrabajosGuardados() {
  return window.StoragePrecio3D?.cargarTrabajos?.() || [];
}

function construirTrabajoActual() {
  if (!ultimoDatosCalculo || !ultimoResultadoCalculo || ultimoResultadoCalculo.precioNeto === null) {
    return null;
  }

  const ahora = new Date().toISOString();

  return {
    nombreTrabajo: ultimoDatosCalculo.nombreTrabajo || "Trabajo sin nombre",
    cliente: valorCampo("trabajoCliente").trim() || ultimoDatosCalculo.cliente || "",
    descripcion: valorCampo("trabajoDescripcion").trim(),
    fechaCreacion: ahora,
    fechaActualizacion: ahora,
    estado: trabajoEstado?.value || "Pendiente",
    modoUsado: ultimoModoCalculo || modoActual,
    precioFinal: ultimoResultadoCalculo.precioFinal,
    costoTotal: ultimoResultadoCalculo.costoTotal,
    utilidadObjetivo: obtenerUtilidadEstimada(ultimoResultadoCalculo),
    margenReal: obtenerMargenRealDesdeResultado(ultimoResultadoCalculo),
    numeroCotizacion: numeroCotizacionActual || "",
    datos: { ...ultimoDatosCalculo },
    resultado: { ...ultimoResultadoCalculo }
  };
}

function renderizarResumenTrabajos(trabajos) {
  if (!trabajosResumen) {
    return;
  }

  const totalCotizado = trabajos.reduce((total, trabajo) => total + (Number(trabajo.precioFinal) || 0), 0);
  const totalAceptado = trabajos
    .filter((trabajo) => trabajo.estado === "Aceptado")
    .reduce((total, trabajo) => total + (Number(trabajo.precioFinal) || 0), 0);
  const totalPagado = trabajos
    .filter((trabajo) => trabajo.estado === "Pagado")
    .reduce((total, trabajo) => total + (Number(trabajo.precioFinal) || 0), 0);
  const utilidadCotizadaTotal = trabajos.reduce(
    (total, trabajo) => total + (Number(trabajo.utilidadObjetivo) || 0),
    0
  );
  const utilidadAceptadaEstimada = trabajos
    .filter((trabajo) => trabajo.estado === "Aceptado")
    .reduce((total, trabajo) => total + (Number(trabajo.utilidadObjetivo) || 0), 0);
  const utilidadPagadaEstimada = trabajos
    .filter((trabajo) => trabajo.estado === "Pagado")
    .reduce((total, trabajo) => total + (Number(trabajo.utilidadObjetivo) || 0), 0);
  const conteoEstados = estadosTrabajo
    .map((estado) => `${estado}: ${trabajos.filter((trabajo) => trabajo.estado === estado).length}`)
    .join(" · ");

  trabajosResumen.innerHTML = `
    ${crearItemResumen("Total cotizado", formatearMoneda(totalCotizado))}
    ${crearItemResumen("Total aceptado", formatearMoneda(totalAceptado))}
    ${crearItemResumen("Total pagado", formatearMoneda(totalPagado))}
    ${crearItemResumen("Utilidad cotizada total", formatearMoneda(utilidadCotizadaTotal))}
    ${crearItemResumen("Utilidad aceptada estimada", formatearMoneda(utilidadAceptadaEstimada))}
    ${crearItemResumen("Utilidad pagada estimada", formatearMoneda(utilidadPagadaEstimada))}
    ${crearItemResumen("Trabajos por estado", conteoEstados || "Sin trabajos")}
  `;
}

function crearOpcionesEstado(estadoActual) {
  return estadosTrabajo
    .map((estado) => `<option value="${estado}" ${estado === estadoActual ? "selected" : ""}>${estado}</option>`)
    .join("");
}

function crearTarjetaTrabajo(trabajo) {
  return `
    <article class="job-card" data-job-id="${escaparHtml(trabajo.id)}">
      <div class="job-card__main">
        <span class="job-date">${escaparHtml(formatearFechaTrabajo(trabajo.fechaCreacion))}</span>
        <h3>${escaparHtml(trabajo.nombreTrabajo || "Trabajo sin nombre")}</h3>
        <p>${escaparHtml(trabajo.cliente || "Sin cliente")}</p>
        ${trabajo.numeroCotizacion ? `<p class="job-quote-number">${escaparHtml(trabajo.numeroCotizacion)}</p>` : ""}
      </div>
      <div class="job-card__numbers">
        ${crearItemResumen("Precio cotizado", formatearMoneda(trabajo.precioFinal))}
        ${crearItemResumen("Costo estimado", formatearMoneda(trabajo.costoTotal))}
        ${crearItemResumen("Utilidad estimada", formatearMoneda(trabajo.utilidadObjetivo))}
      </div>
      <label class="job-status-control">
        Estado
        <select data-job-action="estado" data-job-id="${escaparHtml(trabajo.id)}">
          ${crearOpcionesEstado(trabajo.estado)}
        </select>
      </label>
      <div class="job-actions">
        <button type="button" class="secondary" data-job-action="detalle" data-job-id="${escaparHtml(trabajo.id)}">Ver detalle</button>
        <button type="button" class="secondary" data-job-action="cargar" data-job-id="${escaparHtml(trabajo.id)}">Cargar y editar</button>
        <button type="button" class="secondary" data-job-action="cotizacion" data-job-id="${escaparHtml(trabajo.id)}">Generar cotización</button>
        <button type="button" class="secondary" data-job-action="duplicar" data-job-id="${escaparHtml(trabajo.id)}">Duplicar trabajo</button>
        <button type="button" class="secondary danger-button" data-job-action="eliminar" data-job-id="${escaparHtml(trabajo.id)}">Eliminar trabajo</button>
      </div>
    </article>
  `;
}

function renderizarTrabajos() {
  const trabajos = obtenerTrabajosGuardados();

  renderizarResumenTrabajos(trabajos);

  if (!trabajosListado) {
    return;
  }

  if (!trabajos.length) {
    trabajosListado.innerHTML = `<p class="comparator-empty empty-state">Aún no has guardado trabajos.</p>`;
    return;
  }

  trabajosListado.innerHTML = trabajos.map(crearTarjetaTrabajo).join("");
}

function guardarTrabajoActual() {
  const trabajo = construirTrabajoActual();

  if (!trabajo) {
    mostrarMensajeTrabajos("Primero realiza un cálculo válido para guardar un trabajo.", true);
    return;
  }

  const guardado = window.StoragePrecio3D?.guardarTrabajo?.(trabajo);

  if (!guardado) {
    mostrarMensajeTrabajos("No se pudo guardar el trabajo en este navegador.", true);
    return;
  }

  mostrarMensajeTrabajos("Trabajo guardado.");
  renderizarTrabajos();
}

function cargarTrabajoEnCalculadora(trabajo) {
  if (!trabajo?.datos || !trabajo?.resultado) {
    return;
  }

  ultimoDatosCalculo = { ...trabajo.datos };
  ultimoResultadoCalculo = { ...trabajo.resultado };
  ultimoModoCalculo = trabajo.modoUsado === "avanzado" ? "avanzado" : "basico";
  trabajoCotizacionTemporal = null;
  const datos = trabajo.datos;
  const cantidad = Math.max(1, Number(datos.cantidadProductos) || 1);

  cambiarModo(ultimoModoCalculo);

  if (ultimoModoCalculo === "avanzado") {
    asignarValorCampo("nombreTrabajoAvanzado", trabajo.nombreTrabajo);
    asignarValorCampo("clienteAvanzado", datos.cliente || trabajo.cliente);
    asignarValorCampo("cantidadAvanzado", cantidad);
    asignarSelectPorTexto("materialAvanzado", datos.material);
    asignarSelectPorTexto("canalVentaAvanzado", datos.canalVenta);
    cambiarModoCostoMaterial("avanzado", false);
    asignarValorCampo("costoUnidadAvanzado", datos.costoUnidad);
    asignarValorCampo("pesoPiezaAvanzado", (Number(datos.pesoPieza) || 0) / cantidad);
    asignarValorCampo("pesoSoportesPurgaAvanzado", (Number(datos.pesoSoportesPurga) || 0) / cantidad);
    asignarTiempoDesdeHoras(
      "horasImpresionHorasAvanzado",
      "horasImpresionMinutosAvanzado",
      (Number(datos.horasImpresion) || 0) / cantidad
    );
    asignarValorCampo("wattsPromedioAvanzado", datos.wattsPromedio);
    asignarValorCampo("tarifaKwhAvanzado", datos.tarifaKwh);
    asignarValorCampo("costoImpresoraAvanzado", datos.costoImpresora);
    asignarValorCampo("costoHerramientasAvanzado", datos.costoHerramientas);
    asignarValorCampo("anosVidaAvanzado", datos.anosVida);
    asignarValorCampo("diasOperativosAnoAvanzado", datos.diasOperativosAno);
    asignarValorCampo("horasProductivasDiaAvanzado", datos.horasProductivasDia);
    asignarValorCampo("mantenimientoAvanzado", (Number(datos.mantenimiento) || 0) * 100);
    asignarValorCampo("horasPreparacionAvanzado", datos.horasPreparacion);
    asignarValorCampo("horasPostprocesadoAvanzado", (Number(datos.horasPostprocesado) || 0) / cantidad);
    asignarValorCampo("tarifaHoraAvanzado", datos.tarifaHora);
    asignarValorCampo("embalajeAvanzado", datos.embalaje);
    asignarValorCampo("envioAvanzado", datos.envio);
    asignarValorCampo("seguroAduanasAvanzado", datos.seguro);
    asignarValorCampo("margenAvanzado", (Number(datos.margen) || 0) * 100);
    asignarValorCampo("impuestoAvanzado", (Number(datos.tasaImpuesto) || 0) * 100);
    asignarValorCampo("feeMarketplaceAvanzado", (Number(datos.feePorcentualTotal) || 0) * 100);
    asignarValorCampo("feePagoAvanzado", 0);
  } else {
    asignarValorCampo("nombreTrabajoBasico", trabajo.nombreTrabajo);
    asignarValorCampo("cantidadBasico", cantidad);
    asignarSelectPorTexto("materialBasico", datos.material);
    asignarSelectPorTexto("canalVentaBasico", datos.canalVenta);
    cambiarModoCostoMaterial("basico", false);
    asignarValorCampo("costoUnidadBasico", datos.costoUnidad);
    asignarValorCampo("pesoPiezaBasico", (Number(datos.pesoPieza) || 0) / cantidad);
    asignarValorCampo("pesoSoportesPurgaBasico", (Number(datos.pesoSoportesPurga) || 0) / cantidad);
    asignarTiempoDesdeHoras(
      "horasImpresionHorasBasico",
      "horasImpresionMinutosBasico",
      (Number(datos.horasImpresion) || 0) / cantidad
    );
    asignarValorCampo("manoObraSimpleBasico", (Number(datos.tarifaHora) || 0) / cantidad);
    asignarValorCampo("embalajeBasico", datos.embalaje);
    asignarValorCampo("envioBasico", datos.envio);
    asignarValorCampo("margenBasico", (Number(datos.margen) || 0) * 100);
    asignarValorCampo("impuestoBasico", (Number(datos.tasaImpuesto) || 0) * 100);
    asignarValorCampo("feeFijoBasico", datos.feeFijoTotal);
    asignarValorCampo("feePorcentualBasico", (Number(datos.feePorcentualTotal) || 0) * 100);
    asignarValorCampo("mermaBasico", (Number(datos.merma) || 0) * 100);
    asignarValorCampo("wattsPromedioBasico", datos.wattsPromedio);
    asignarValorCampo("tarifaKwhBasico", datos.tarifaKwh);
    asignarValorCampo("costoImpresoraBasico", datos.costoImpresora);
    asignarValorCampo("costoHerramientasBasico", datos.costoHerramientas);
    asignarValorCampo("anosVidaBasico", datos.anosVida);
    asignarValorCampo("diasOperativosAnoBasico", datos.diasOperativosAno);
    asignarValorCampo("horasProductivasDiaBasico", datos.horasProductivasDia);
    asignarValorCampo("mantenimientoBasico", (Number(datos.mantenimiento) || 0) * 100);
  }

  if (datos.moneda) {
    asignarValorCampo("currencySelect", datos.moneda);
    asignarValorCampo("currencySelectBasico", datos.moneda);
  }

  asignarSelectPorTexto("metodoPagoComparador", datos.metodoPago);
  asignarValorCampo("trabajoCliente", trabajo.cliente || datos.cliente);
  sugerirClienteCotizacion(trabajo.cliente || datos.cliente);
  actualizarAyudaCostoMaterial(ultimoModoCalculo);
  actualizarVistaPreviaMoneda();
  actualizarSupuestosEditablesBasico();

  const feeEstimado = calcularFeeEstimado(ultimoResultadoCalculo);

  if (ultimoModoCalculo === "avanzado") {
    renderizarResultado(ultimoResultadoCalculo, feeEstimado, resultBox, null, {
      margenObjetivo: ultimoDatosCalculo.margen,
      nombreTrabajo: trabajo.nombreTrabajo,
      cantidadProductos: trabajo.datos.cantidadProductos
    });
  } else {
    renderizarResultadoBasico(
      ultimoResultadoCalculo,
      feeEstimado,
      trabajo.nombreTrabajo,
      trabajo.datos.cantidadProductos
    );
    renderizarResultado(ultimoResultadoCalculo, feeEstimado, resultBox, null, {
      margenObjetivo: ultimoDatosCalculo.margen,
      nombreTrabajo: trabajo.nombreTrabajo,
      cantidadProductos: trabajo.datos.cantidadProductos
    });
  }

  renderizarComparadorCanales(ultimoDatosCalculo, ultimoResultadoCalculo);
  renderizarPreciosPorNivel(ultimoDatosCalculo);
  exportExcelButton.disabled = ultimoResultadoCalculo.precioNeto === null;
  actualizarBotonesGuardarTrabajo(ultimoResultadoCalculo.precioNeto !== null);
  actualizarBotonesCotizacion(ultimoResultadoCalculo.precioNeto !== null);
  mostrarMensajeTrabajos("Trabajo cargado en la calculadora.");
  document.dispatchEvent(new CustomEvent("precio3d:trabajo-cargado"));
}

function prepararCotizacionDesdeTrabajo(trabajo) {
  if (!trabajo?.datos || !trabajo?.resultado || trabajo.resultado.precioNeto === null) {
    mostrarMensajeTrabajos("El trabajo no contiene un cálculo válido para cotizar.", true);
    return;
  }

  trabajoCotizacionTemporal = {
    id: trabajo.id,
    datos: { ...trabajo.datos, nombreTrabajo: trabajo.nombreTrabajo },
    resultado: { ...trabajo.resultado },
    cliente: trabajo.cliente || trabajo.datos.cliente || "",
    descripcion: trabajo.descripcion || "",
    numeroCotizacion: trabajo.numeroCotizacion || ""
  };
  numeroCotizacionActual = trabajoCotizacionTemporal.numeroCotizacion || null;
  referenciaCotizacionActual = `trabajo:${trabajo.id}`;

  asignarValorCampo("clienteCotizacion", trabajoCotizacionTemporal.cliente);
  asignarValorCampo("trabajoDescripcion", trabajoCotizacionTemporal.descripcion);
  actualizarBotonesCotizacion(true);

  const advertencias = obtenerAdvertenciasDatosCotizacion();
  mostrarMensajeCotizacion(
    advertencias.length
      ? `Puedes generar la cotización. Revisa: ${advertencias.join(" ")}`
      : "Trabajo cargado temporalmente para generar la cotización."
  );
  document.dispatchEvent(new CustomEvent("precio3d:cotizacion-trabajo"));
}

function verDetalleTrabajo(trabajo) {
  const detalle = [
    `Trabajo: ${trabajo.nombreTrabajo}`,
    `Cliente: ${trabajo.cliente || "Sin cliente"}`,
    `Estado: ${trabajo.estado}`,
    `Precio cotizado: ${formatearMoneda(trabajo.precioFinal)}`,
    `Costo estimado: ${formatearMoneda(trabajo.costoTotal)}`,
    `Utilidad estimada: ${formatearMoneda(trabajo.utilidadObjetivo)}`,
    `Descripción: ${trabajo.descripcion || "Sin descripción"}`
  ].join("\n");

  alert(detalle);
}

function manejarAccionTrabajo(event) {
  const objetivo = event.target;
  const accion = objetivo?.dataset?.jobAction;
  const id = objetivo?.dataset?.jobId;

  if (!accion || !id) {
    return;
  }

  if (accion === "estado" && event.type !== "change") {
    return;
  }

  if (accion !== "estado" && event.type !== "click") {
    return;
  }

  const trabajo = obtenerTrabajosGuardados().find((item) => item.id === id);

  if (accion === "estado") {
    const actualizado = window.StoragePrecio3D?.actualizarTrabajo?.(id, { estado: objetivo.value });
    mostrarMensajeTrabajos(actualizado ? "Estado actualizado." : "No se pudo actualizar el estado.", !actualizado);
    renderizarTrabajos();
    return;
  }

  if (!trabajo) {
    mostrarMensajeTrabajos("No se encontró el trabajo.", true);
    return;
  }

  if (accion === "detalle") {
    verDetalleTrabajo(trabajo);
  }

  if (accion === "cargar") {
    cargarTrabajoEnCalculadora(trabajo);
  }

  if (accion === "cotizacion") {
    prepararCotizacionDesdeTrabajo(trabajo);
  }

  if (accion === "duplicar") {
    const duplicado = window.StoragePrecio3D?.duplicarTrabajo?.(id);
    mostrarMensajeTrabajos(duplicado ? "Trabajo duplicado." : "No se pudo duplicar el trabajo.", !duplicado);
    renderizarTrabajos();
  }

  if (accion === "eliminar") {
    const confirmar = confirm("¿Seguro que quieres eliminar este trabajo?");

    if (!confirmar) {
      return;
    }

    const eliminado = window.StoragePrecio3D?.eliminarTrabajo?.(id);
    mostrarMensajeTrabajos(eliminado ? "Trabajo eliminado." : "No se pudo eliminar el trabajo.", !eliminado);
    renderizarTrabajos();
  }
}

function exportarCalculoActualCSV() {
  if (!ultimoDatosCalculo || !ultimoResultadoCalculo || ultimoResultadoCalculo.precioNeto === null) {
    mostrarMensajeAlmacenamiento("Primero realiza un cálculo válido para exportar.", true);
    return;
  }

  const cliente = ultimoDatosCalculo.cliente || valorCampo("trabajoCliente").trim();
  const filas = [
    ["Campo", "Valor"],
    ["Nombre del trabajo", ultimoDatosCalculo.nombreTrabajo || "Trabajo sin nombre"],
    ["Cliente", cliente],
    ["Modo usado", ultimoModoCalculo || modoActual],
    ["Fecha", new Date().toISOString()],
    ["Precio final", ultimoResultadoCalculo.precioFinal],
    ["Costo total", ultimoResultadoCalculo.costoTotal],
    ["Utilidad estimada", obtenerUtilidadEstimada(ultimoResultadoCalculo)],
    ["Margen", obtenerMargenRealDesdeResultado(ultimoResultadoCalculo)],
    ["Material", ultimoDatosCalculo.material],
    ["Peso pieza", ultimoDatosCalculo.pesoPieza],
    ["Soportes/purga", ultimoDatosCalculo.pesoSoportesPurga],
    ["Tiempo impresión", ultimoDatosCalculo.horasImpresion],
    ["Cantidad", ultimoDatosCalculo.cantidadProductos],
    ["Canal", ultimoDatosCalculo.canalVenta],
    ["Método de pago", ultimoDatosCalculo.metodoPago],
    ["Moneda", ultimoDatosCalculo.moneda || currencySelectBasico?.value || currencySelect?.value || "CLP"]
  ];

  descargarArchivo("calculo-impresion-3d.csv", crearCSVConBOM(filas), "text/csv;charset=utf-8");
  mostrarMensajeAlmacenamiento("Cálculo exportado en CSV compatible con Excel.");
}

function exportarTrabajosCSV() {
  const trabajos = obtenerTrabajosGuardados();

  if (!trabajos.length) {
    mostrarMensajeTrabajos("No hay trabajos guardados para exportar.", true);
    return;
  }

  const filas = [
    [
      "Fecha creación",
      "Fecha actualización",
      "Nombre del trabajo",
      "Cliente",
      "Descripción",
      "Estado",
      "Modo usado",
      "Precio final",
      "Costo total",
      "Utilidad estimada",
      "Margen real"
    ],
    ...trabajos.map((trabajo) => [
      trabajo.fechaCreacion,
      trabajo.fechaActualizacion,
      trabajo.nombreTrabajo,
      trabajo.cliente,
      trabajo.descripcion,
      trabajo.estado,
      trabajo.modoUsado,
      trabajo.precioFinal,
      trabajo.costoTotal,
      trabajo.utilidadObjetivo,
      trabajo.margenReal
    ])
  ];

  descargarArchivo("mis-trabajos-impresion-3d.csv", crearCSVConBOM(filas), "text/csv;charset=utf-8");
  mostrarMensajeTrabajos("Trabajos exportados en CSV compatible con Excel.");
}

function exportarTrabajosJSONDesdeUI() {
  if (!window.StoragePrecio3D?.exportarTrabajosJSON) {
    mostrarMensajeTrabajos("No se pudo acceder al almacenamiento local.", true);
    return;
  }

  const contenido = window.StoragePrecio3D.exportarTrabajosJSON();
  descargarArchivo("trabajos-impresion-3d.json", contenido, "application/json;charset=utf-8");
}

function importarTrabajosDesdeArchivo(event) {
  const archivo = event.target.files?.[0];

  if (!archivo) {
    return;
  }

  const reader = new FileReader();

  reader.onload = () => {
    const reemplazar = confirm(
      "¿Quieres reemplazar tus trabajos actuales? Aceptar reemplaza, Cancelar combina con los existentes."
    );
    const trabajos = window.StoragePrecio3D?.importarTrabajosJSON?.(
      reader.result,
      reemplazar ? "reemplazar" : "combinar"
    );

    if (!trabajos) {
      mostrarMensajeTrabajos("Archivo de trabajos inválido.", true);
      importarTrabajosInput.value = "";
      return;
    }

    mostrarMensajeTrabajos("Trabajos importados.");
    importarTrabajosInput.value = "";
    renderizarTrabajos();
  };

  reader.onerror = () => {
    mostrarMensajeTrabajos("Archivo de trabajos inválido.", true);
    importarTrabajosInput.value = "";
  };

  reader.readAsText(archivo);
}

function borrarTodosLosTrabajos() {
  const confirmar = confirm("¿Seguro que quieres borrar todos los trabajos guardados?");

  if (!confirmar) {
    return;
  }

  const borrado = window.StoragePrecio3D?.borrarTrabajos?.();
  mostrarMensajeTrabajos(borrado ? "Trabajos borrados." : "No se pudieron borrar los trabajos.", !borrado);
  renderizarTrabajos();
}

function obtenerDatosNegocioFormulario() {
  return {
    nombreNegocio: valorCampo("nombreNegocio").trim(),
    rutNegocio: valorCampo("rutNegocio").trim(),
    telefonoNegocio: valorCampo("telefonoNegocio").trim(),
    correoNegocio: valorCampo("correoNegocio").trim(),
    direccionNegocio: valorCampo("direccionNegocio").trim(),
    sitioWebNegocio: valorCampo("sitioWebNegocio").trim(),
    instagramNegocio: valorCampo("instagramNegocio").trim()
  };
}

function obtenerDatosClienteCotizacionFormulario() {
  return {
    clienteCotizacion: valorCampo("clienteCotizacion").trim(),
    contactoCliente: valorCampo("contactoCliente").trim(),
    correoCliente: valorCampo("correoCliente").trim(),
    empresaCliente: valorCampo("empresaCliente").trim(),
    rutCliente: valorCampo("rutCliente").trim(),
    direccionCliente: valorCampo("direccionCliente").trim()
  };
}

function obtenerConfigCotizacionFormulario() {
  return {
    validezCotizacionDias: leerNumero("validezCotizacionDias") || 7,
    tiempoEntrega: valorCampo("tiempoEntrega").trim() || "A coordinar",
    condicionesPago:
      valorCampo("condicionesPago").trim() || "50% de abono para iniciar y 50% contra entrega.",
    observacionesCotizacion: valorCampo("observacionesCotizacion").trim()
  };
}

function obtenerAdvertenciasDatosCotizacion() {
  const advertencias = [];
  const datosNegocio = obtenerDatosNegocioFormulario();
  const datosCliente = obtenerDatosClienteCotizacionFormulario();

  if (!datosNegocio.nombreNegocio) {
    advertencias.push("Falta el nombre del negocio para una cotización formal.");
  }

  if (!datosCliente.clienteCotizacion) {
    advertencias.push("Falta el nombre del cliente para una cotización formal.");
  }

  return advertencias;
}

function aplicarDatosNegocio(datosNegocio = {}) {
  Object.entries(datosNegocio).forEach(([id, valor]) => asignarValorCampo(id, valor));
}

function aplicarConfigCotizacion(configCotizacion = {}) {
  Object.entries(configCotizacion).forEach(([id, valor]) => asignarValorCampo(id, valor));
}

function sugerirClienteCotizacion(cliente) {
  if (!cliente || valorCampo("clienteCotizacion").trim()) {
    return;
  }

  asignarValorCampo("clienteCotizacion", cliente);
}

function cargarDatosCotizacionIniciales() {
  aplicarDatosNegocio(window.StoragePrecio3D?.cargarDatosNegocio?.());
  aplicarConfigCotizacion(window.StoragePrecio3D?.cargarConfigCotizacion?.());
}

function guardarDatosCotizacion() {
  const guardoNegocio = window.StoragePrecio3D?.guardarDatosNegocio?.(obtenerDatosNegocioFormulario());
  const guardoConfig = window.StoragePrecio3D?.guardarConfigCotizacion?.(obtenerConfigCotizacionFormulario());

  if (!guardoNegocio || !guardoConfig) {
    mostrarMensajeDatosCotizacion("No se pudieron guardar los datos de cotización.", true);
    return;
  }

  const advertencias = obtenerAdvertenciasDatosCotizacion();
  mostrarMensajeDatosCotizacion(
    advertencias.length
      ? `Datos de cotización guardados. ${advertencias.join(" ")}`
      : "Datos de cotización guardados."
  );
  actualizarVistaCotizacionSiExiste();
  document.dispatchEvent(new CustomEvent("precio3d:datos-cotizacion-guardados"));
}

function borrarDatosCotizacionGuardados() {
  const confirmar = confirm("¿Seguro que quieres borrar los datos de cotización guardados?");

  if (!confirmar) {
    return;
  }

  const borroNegocio = window.StoragePrecio3D?.borrarDatosNegocio?.();
  const borroConfig = window.StoragePrecio3D?.borrarConfigCotizacion?.();

  if (!borroNegocio || !borroConfig) {
    mostrarMensajeDatosCotizacion("No se pudieron borrar los datos de cotización.", true);
    return;
  }

  [
    "nombreNegocio",
    "rutNegocio",
    "telefonoNegocio",
    "correoNegocio",
    "direccionNegocio",
    "sitioWebNegocio",
    "instagramNegocio",
    "clienteCotizacion",
    "contactoCliente",
    "correoCliente",
    "empresaCliente",
    "rutCliente",
    "direccionCliente",
    "observacionesCotizacion"
  ].forEach((id) => asignarValorCampo(id, ""));

  aplicarConfigCotizacion();
  mostrarMensajeDatosCotizacion("Datos de cotización borrados.");
}

function crearLineaCotizacion(etiqueta, valor) {
  if (valor === undefined || valor === null || valor === "") {
    return "";
  }

  return `<p><strong>${escaparHtml(etiqueta)}:</strong> ${escaparHtml(valor)}</p>`;
}

function crearReferenciaCotizacion(datosCalculo, resultadoCalculo) {
  if (trabajoCotizacionTemporal?.id) {
    return `trabajo:${trabajoCotizacionTemporal.id}`;
  }

  const contenido = JSON.stringify({
    nombreTrabajo: datosCalculo?.nombreTrabajo,
    cantidadProductos: datosCalculo?.cantidadProductos,
    pesoPieza: datosCalculo?.pesoPieza,
    precioFinal: resultadoCalculo?.precioFinal,
    costoTotal: resultadoCalculo?.costoTotal
  });
  let hash = 0;

  for (let indice = 0; indice < contenido.length; indice += 1) {
    hash = (hash * 31 + contenido.charCodeAt(indice)) >>> 0;
  }

  return `calculo:${hash.toString(16)}`;
}

function obtenerNumeroCotizacion(datosCalculo, resultadoCalculo) {
  const referencia = crearReferenciaCotizacion(datosCalculo, resultadoCalculo);

  if (numeroCotizacionActual && referenciaCotizacionActual === referencia) {
    return numeroCotizacionActual;
  }

  if (trabajoCotizacionTemporal?.numeroCotizacion) {
    numeroCotizacionActual = trabajoCotizacionTemporal.numeroCotizacion;
    referenciaCotizacionActual = referencia;
    return numeroCotizacionActual;
  }

  const numero = window.StoragePrecio3D?.obtenerOCrearNumeroCotizacion?.(referencia);

  if (!numero) {
    return null;
  }

  numeroCotizacionActual = numero;
  referenciaCotizacionActual = referencia;

  if (trabajoCotizacionTemporal?.id) {
    trabajoCotizacionTemporal.numeroCotizacion = numero;
    window.StoragePrecio3D?.actualizarTrabajo?.(trabajoCotizacionTemporal.id, {
      numeroCotizacion: numero
    });
    renderizarTrabajos();
  }

  return numero;
}

function formatearFechaCotizacion(fecha = new Date()) {
  const dia = String(fecha.getDate()).padStart(2, "0");
  const mes = String(fecha.getMonth() + 1).padStart(2, "0");
  return `${dia}-${mes}-${fecha.getFullYear()}`;
}

function obtenerDatosCotizacionActuales() {
  const datosCalculo = trabajoCotizacionTemporal?.datos || ultimoDatosCalculo;
  const resultadoCalculo = trabajoCotizacionTemporal?.resultado || ultimoResultadoCalculo;

  if (!datosCalculo || !resultadoCalculo || resultadoCalculo.precioNeto === null) {
    return null;
  }

  const datosNegocio = obtenerDatosNegocioFormulario();
  const datosCliente = obtenerDatosClienteCotizacionFormulario();
  const condiciones = obtenerConfigCotizacionFormulario();
  const cantidad = Math.max(1, Number(datosCalculo.cantidadProductos) || 1);
  const precioFinal = Number(resultadoCalculo.precioFinal) || 0;
  const numeroCotizacion = obtenerNumeroCotizacion(datosCalculo, resultadoCalculo);

  if (!numeroCotizacion) {
    return null;
  }

  return {
    datosNegocio,
    datosCliente,
    condiciones,
    cantidad,
    precioFinal,
    precioUnitario: cantidad > 0 ? precioFinal / cantidad : precioFinal,
    moneda: datosCalculo.moneda || currencySelectBasico?.value || currencySelect?.value || "CLP",
    nombreTrabajo: datosCalculo.nombreTrabajo || "Trabajo sin nombre",
    clienteCalculo: trabajoCotizacionTemporal?.cliente || datosCalculo.cliente || "",
    descripcionTrabajo:
      trabajoCotizacionTemporal?.descripcion ||
      valorCampo("trabajoDescripcion").trim() ||
      condiciones.observacionesCotizacion,
    fechaCotizacion: formatearFechaCotizacion(),
    numeroCotizacion
  };
}

function prepararCotizacionActual() {
  trabajoCotizacionTemporal = null;

  if (!ultimoDatosCalculo || !ultimoResultadoCalculo || ultimoResultadoCalculo.precioNeto === null) {
    mostrarMensajeCotizacion("Primero realiza un cálculo válido para generar una cotización.", true);
    return;
  }

  const advertencias = obtenerAdvertenciasDatosCotizacion();
  mostrarMensajeCotizacion(
    advertencias.length
      ? `Puedes continuar, pero revisa: ${advertencias.join(" ")}`
      : "El cálculo está listo para generar una cotización."
  );
}

function renderizarCotizacionCliente() {
  const datos = obtenerDatosCotizacionActuales();

  if (!datos) {
    mostrarMensajeCotizacion("Primero realiza un cálculo válido para generar una cotización.", true);
    return false;
  }

  const { datosNegocio, datosCliente, condiciones } = datos;
  const nombreNegocio = datosNegocio.nombreNegocio || "Nombre del negocio no configurado";
  const cliente = datosCliente.clienteCotizacion || datos.clienteCalculo || "Cliente no especificado";
  const validez = `${condiciones.validezCotizacionDias} días`;

  cotizacionClienteVista.hidden = false;
  cotizacionClienteVista.innerHTML = `
    <article class="print-quote">
      <header class="print-quote__header">
        <div class="print-quote__title">
          <h2>Cotización</h2>
        </div>
        <div class="print-quote__meta">
          ${crearLineaCotizacion("N°", datos.numeroCotizacion)}
          ${crearLineaCotizacion("Fecha", datos.fechaCotizacion)}
          ${crearLineaCotizacion("Validez", validez)}
          ${crearLineaCotizacion("Moneda", datos.moneda)}
        </div>
      </header>

      <section class="print-quote__commercial">
        <div class="print-quote__party">
          <h3>Datos de quien cotiza</h3>
          <h4>${escaparHtml(nombreNegocio)}</h4>
          ${crearLineaCotizacion("RUT / ID fiscal", datosNegocio.rutNegocio)}
          ${crearLineaCotizacion("Contacto", datosNegocio.telefonoNegocio)}
          ${crearLineaCotizacion("Correo", datosNegocio.correoNegocio)}
          ${crearLineaCotizacion("Dirección", datosNegocio.direccionNegocio)}
          ${crearLineaCotizacion("Sitio web", datosNegocio.sitioWebNegocio)}
          ${crearLineaCotizacion("Instagram", datosNegocio.instagramNegocio)}
        </div>
        <div class="print-quote__party">
          <h3>Datos del cliente</h3>
          ${crearLineaCotizacion("Cliente", cliente)}
          ${crearLineaCotizacion("Empresa", datosCliente.empresaCliente)}
          ${crearLineaCotizacion("RUT / ID fiscal", datosCliente.rutCliente)}
          ${crearLineaCotizacion("Contacto", datosCliente.contactoCliente)}
          ${crearLineaCotizacion("Correo", datosCliente.correoCliente)}
          ${crearLineaCotizacion("Dirección", datosCliente.direccionCliente)}
        </div>
      </section>

      <section class="print-quote__section">
        <h3>Detalle del pedido</h3>
        <table class="print-quote__table">
          <thead>
            <tr>
              <th class="quote-col-work">Trabajo / pedido</th>
              <th class="quote-col-description">Descripción</th>
              <th class="quote-col-quantity">Cantidad</th>
              <th class="quote-col-money">Precio unitario</th>
              <th class="quote-col-money">Total</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>${escaparHtml(datos.nombreTrabajo)}</td>
              <td>${escaparHtml(datos.descripcionTrabajo || "Sin descripción")}</td>
              <td class="quote-col-quantity">${datos.cantidad}</td>
              <td class="quote-col-money">${formatearMoneda(datos.precioUnitario)}</td>
              <td class="quote-col-money">${formatearMoneda(datos.precioFinal)}</td>
            </tr>
          </tbody>
        </table>
        <p class="print-quote__total">Total final: ${formatearMoneda(datos.precioFinal)}</p>
      </section>

      <section class="print-quote__section print-quote__conditions">
        <h3>Condiciones</h3>
        ${crearLineaCotizacion("Entrega", condiciones.tiempoEntrega)}
        ${crearLineaCotizacion("Pago", condiciones.condicionesPago)}
        ${crearLineaCotizacion("Observaciones", condiciones.observacionesCotizacion)}
      </section>
    </article>
  `;

  mostrarMensajeCotizacion("Vista previa de cotización generada.");
  return true;
}

function imprimirCotizacionCliente() {
  const generada = cotizacionClienteVista && !cotizacionClienteVista.hidden
    ? true
    : renderizarCotizacionCliente();

  if (!generada) {
    return;
  }

  const datos = obtenerDatosCotizacionActuales();
  const tituloAnterior = document.title;
  let tituloRestaurado = false;

  const restaurarTitulo = () => {
    if (tituloRestaurado) return;
    tituloRestaurado = true;
    document.title = tituloAnterior;
    window.removeEventListener("afterprint", restaurarTitulo);
  };

  document.title = datos?.numeroCotizacion || "Cotizacion impresion 3D";
  window.addEventListener("afterprint", restaurarTitulo, { once: true });
  window.print();
  window.setTimeout(restaurarTitulo, 1500);
}

function iniciarNuevaCotizacion() {
  numeroCotizacionActual = "";
  referenciaCotizacionActual = "";

  if (trabajoCotizacionTemporal) {
    trabajoCotizacionTemporal = { ...trabajoCotizacionTemporal, numeroCotizacion: "" };
  }

  window.StoragePrecio3D?.borrarCotizacionActual?.();
  cotizacionClienteVista.hidden = true;
  cotizacionClienteVista.innerHTML = "";
  mostrarMensaje(
    cotizacionMessage,
    "Nueva cotización preparada. La próxima vista previa recibirá un nuevo número.",
    "success"
  );
}

function actualizarVistaCotizacionSiExiste() {
  if (cotizacionClienteVista && !cotizacionClienteVista.hidden) {
    renderizarCotizacionCliente();
  }
}

function renderizarUltimoCalculoGuardado() {
  const ultimo = window.StoragePrecio3D?.cargarUltimoCalculo?.();

  if (!ultimo || !ultimoCalculoPanel || !ultimoCalculoResumen) {
    if (ultimoCalculoPanel) {
      ultimoCalculoPanel.hidden = false;
      ultimoCalculoResumen.textContent = "Aún no hay un cálculo guardado.";
      cargarUltimoCalculoButton.disabled = true;
      borrarUltimoCalculoButton.disabled = true;
    }

    return;
  }

  const fecha = ultimo.guardadoEn ? new Date(ultimo.guardadoEn).toLocaleString() : "Sin fecha";
  const precioFinal = ultimo.resultado?.precioFinal;
  const costoTotal = ultimo.resultado?.costoTotal;

  ultimoCalculoPanel.hidden = false;
  cargarUltimoCalculoButton.disabled = false;
  borrarUltimoCalculoButton.disabled = false;
  ultimoCalculoResumen.innerHTML = `
    <div class="result-summary">
      ${crearItemResumen("Fecha", fecha)}
      ${crearItemResumen("Modo", ultimo.modo === "avanzado" ? "Avanzado" : "Básico")}
      ${crearItemResumen("Precio final", formatoComparadorMoneda(precioFinal))}
      ${crearItemResumen("Costo total", formatoComparadorMoneda(costoTotal))}
    </div>
  `;
}

function persistirUltimoCalculo(modo, datos, resultado) {
  if (!window.StoragePrecio3D?.guardarUltimoCalculo || !resultado || resultado.precioNeto === null) {
    return;
  }

  const guardado = window.StoragePrecio3D.guardarUltimoCalculo({
    modo,
    datos,
    resultado,
    moneda: currencySelectBasico?.value || currencySelect?.value || "CLP",
    idioma: languageSelectBasico?.value || languageSelect?.value || "es",
    metodoPagoComparador: metodoPagoComparador?.value || "automatico"
  });

  if (!guardado) {
    mostrarAdvertenciaStorageUnaVez();
    return;
  }

  renderizarUltimoCalculoGuardado();
}

function cargarUltimoCalculoGuardado() {
  const ultimo = window.StoragePrecio3D?.cargarUltimoCalculo?.();

  if (!ultimo || !ultimo.datos || !ultimo.resultado) {
    return;
  }

  if (ultimo.moneda) {
    asignarValorCampo("currencySelectBasico", ultimo.moneda);
    asignarValorCampo("currencySelect", ultimo.moneda);
  }

  if (ultimo.idioma) {
    asignarValorCampo("languageSelectBasico", ultimo.idioma);
    asignarValorCampo("languageSelect", ultimo.idioma);
    window.cambiarIdioma(ultimo.idioma);
  }

  asignarValorCampo("metodoPagoComparador", ultimo.metodoPagoComparador);
  cambiarModo(ultimo.modo === "avanzado" ? "avanzado" : "basico");

  ultimoDatosCalculo = { ...ultimo.datos };
  ultimoResultadoCalculo = ultimo.resultado;
  ultimoModoCalculo = ultimo.modo === "avanzado" ? "avanzado" : "basico";
  const feeEstimado = calcularFeeEstimado(ultimo.resultado);

  if (ultimo.modo === "avanzado") {
    renderizarResultado(ultimo.resultado, feeEstimado, resultBox, null, {
      margenObjetivo: ultimo.datos.margen,
      nombreTrabajo: ultimo.datos.nombreTrabajo,
      cantidadProductos: ultimo.datos.cantidadProductos
    });
  } else {
    ultimoResultadoBasico = ultimo.resultado;
    ultimoFeeEstimadoBasico = feeEstimado;
    renderizarResultadoBasico(
      ultimo.resultado,
      feeEstimado,
      ultimo.datos.nombreTrabajo,
      ultimo.datos.cantidadProductos
    );
  }

  renderizarComparadorCanales(ultimoDatosCalculo, ultimoResultadoCalculo);
  renderizarPreciosPorNivel(ultimoDatosCalculo);
  actualizarBotonesGuardarTrabajo(ultimo.resultado.precioNeto !== null);
  actualizarBotonesCotizacion(ultimo.resultado.precioNeto !== null);

  if (exportExcelButton && ultimo.resultado.precioNeto !== null) {
    exportExcelButton.disabled = false;
  }

  mostrarMensajeAlmacenamiento("Último cálculo cargado.");
}

function borrarUltimoCalculoGuardado() {
  const borrado = window.StoragePrecio3D?.borrarUltimoCalculo?.();

  if (!borrado) {
    mostrarAdvertenciaStorageUnaVez();
    return;
  }

  renderizarUltimoCalculoGuardado();
  mostrarMensajeAlmacenamiento("Último cálculo borrado.");
}

function calcularModoBasico() {
  trabajoCotizacionTemporal = null;
  const construido = construirDatosBasicos();

  if (!construido) {
    return;
  }

  const resumen = window.FormulasPrecio3D.calcularResumenCompleto(construido.datos);
  const feeEstimado = calcularFeeEstimado(resumen);

  ultimoResultadoBasico = resumen;
  ultimosSupuestosBasicos = construido.supuestos;
  ultimoFeeEstimadoBasico = feeEstimado;
  ultimoDatosCalculo = { ...construido.datos };
  ultimoResultadoCalculo = resumen;
  ultimoModoCalculo = "basico";
  renderizarResultadoBasico(
    resumen,
    feeEstimado,
    construido.datos.nombreTrabajo,
    construido.datos.cantidadProductos
  );
  renderizarResultado(resumen, feeEstimado, resultBox, null, {
    margenObjetivo: construido.datos.margen,
    nombreTrabajo: construido.datos.nombreTrabajo,
    cantidadProductos: construido.datos.cantidadProductos
  });
  renderizarSupuestosBasicos(construido.supuestos);
  renderizarComparadorCanales(ultimoDatosCalculo, ultimoResultadoCalculo);
  renderizarPreciosPorNivel(ultimoDatosCalculo);
  actualizarBotonesGuardarTrabajo(resumen.precioNeto !== null);
  exportExcelButton.disabled = resumen.precioNeto === null;
  actualizarBotonesCotizacion(resumen.precioNeto !== null);
  persistirUltimoCalculo("basico", ultimoDatosCalculo, ultimoResultadoCalculo);
  guardarConfiguracionActual(false);

  if (resumen.precioNeto !== null) {
    notificarCalculoValido();
  }
}

function calcularModoAvanzado() {
  trabajoCotizacionTemporal = null;
  const construido = construirDatosAvanzados();

  if (!construido) {
    return;
  }

  const resumen = window.FormulasPrecio3D.calcularResumenCompleto(construido.datos);
  const feeEstimado = calcularFeeEstimado(resumen);
  ultimoDatosCalculo = { ...construido.datos };
  ultimoResultadoCalculo = resumen;
  ultimoModoCalculo = "avanzado";
  if (construido.datos.cliente && !valorCampo("trabajoCliente").trim()) {
    trabajoCliente.value = construido.datos.cliente;
  }
  sugerirClienteCotizacion(construido.datos.cliente);
  renderizarResultado(resumen, feeEstimado, resultBox, null, {
    margenObjetivo: leerPorcentaje("margenAvanzado"),
    nombreTrabajo: construido.datos.nombreTrabajo,
    cantidadProductos: construido.datos.cantidadProductos
  });
  renderizarComparadorCanales(ultimoDatosCalculo, ultimoResultadoCalculo);
  renderizarPreciosPorNivel(ultimoDatosCalculo);
  actualizarBotonesGuardarTrabajo(resumen.precioNeto !== null);
  exportExcelButton.disabled = resumen.precioNeto === null;
  actualizarBotonesCotizacion(resumen.precioNeto !== null);
  persistirUltimoCalculo("avanzado", ultimoDatosCalculo, ultimoResultadoCalculo);
  guardarConfiguracionActual(false);

  if (resumen.precioNeto !== null) {
    notificarCalculoValido();
  }
}

function limpiarFormulario() {
  trabajoCotizacionTemporal = null;
  document.querySelectorAll("input").forEach((input) => {
    input.value = "";
  });

  document.querySelectorAll("select").forEach((select) => {
    select.selectedIndex = 0;
  });

  currencySelect.value = "CLP";
  currencySelectBasico.value = "CLP";
  languageSelect.value = "es";
  languageSelectBasico.value = "es";
  metodoPagoComparador.value = "automatico";
  document.querySelector("#cantidadBasico").value = "1";
  document.querySelector("#cantidadAvanzado").value = "1";
  nivelTrabajoBasico.value = "basico";
  manoObraSimpleBasico.value = valoresNivelTrabajo.basico;
  cambiarModoCostoMaterial("basico", false);
  cambiarModoCostoMaterial("avanzado", false);
  resultBox.textContent = "Aún no hay un cálculo disponible. Completa una cotización para ver el resultado.";
  resultBasico.textContent = "Aún no hay un cálculo disponible. Completa una cotización para ver el resultado.";
  basicBreakdown.innerHTML = "";
  basicWarnings.innerHTML = "";
  exportExcelButton.disabled = true;
  ultimoDatosCalculo = null;
  ultimoResultadoCalculo = null;
  ultimoModoCalculo = null;
  actualizarBotonesGuardarTrabajo(false);
  actualizarBotonesCotizacion(false);
  cotizacionClienteVista.hidden = true;
  cotizacionClienteVista.innerHTML = "";
  renderizarComparadorCanales(null, null);
  renderizarPreciosPorNivel(null);
  aplicarMaterialBasico();
  aplicarImpresoraBasico();
  aplicarCanalBasico();
  aplicarMaterialAvanzado();
  aplicarImpresoraAvanzado();
  aplicarCanalAvanzado();
  ultimoResultadoBasico = null;
  ultimoFeeEstimadoBasico = 0;
  ultimosSupuestosBasicos = obtenerSupuestosBasicos();
  actualizarVistaPreviaMoneda();
  renderizarSupuestosBasicos(ultimosSupuestosBasicos);
  window.cambiarIdioma("es");
}

calculateButton.addEventListener("click", calcularModoAvanzado);
calculateBasicButton.addEventListener("click", calcularModoBasico);
document.addEventListener("precio3d:abrir-cotizacion-actual", prepararCotizacionActual);
document.addEventListener("precio3d:actualizar-vista-cotizacion", actualizarVistaCotizacionSiExiste);
clearButton.addEventListener("click", limpiarFormulario);
exportExcelButton.addEventListener("click", exportarCalculoActualCSV);
document.querySelectorAll('input[type="number"]').forEach((input) => {
  input.addEventListener("input", bloquearNumeroNegativo);
});
toggleSupuestosEditables.addEventListener("click", alternarSupuestosEditables);
btnModoBasico.addEventListener("click", () => cambiarModo("basico"));
btnModoAvanzado.addEventListener("click", () => cambiarModo("avanzado"));
verCalculoAvanzado.addEventListener("click", () => cambiarModo("avanzado"));
volverModoBasico.addEventListener("click", () => cambiarModo("basico"));
nivelTrabajoBasico.addEventListener("change", actualizarManoObraPorNivel);
materialBasico.addEventListener("change", aplicarMaterialBasico);
impresoraBasico.addEventListener("change", aplicarImpresoraBasico);
canalVentaBasico.addEventListener("change", aplicarCanalBasico);
modoCostoGramoBasico.addEventListener("click", () => cambiarModoCostoMaterial("basico", false));
modoCostoKiloBasico.addEventListener("click", () => cambiarModoCostoMaterial("basico", true));
document
  .querySelector("#costoUnidadBasico")
  .addEventListener("input", () => actualizarAyudaCostoMaterial("basico"));
document.querySelectorAll(
  "#mermaBasico, #wattsPromedioBasico, #tarifaKwhBasico, #costoImpresoraBasico, #costoHerramientasBasico, #anosVidaBasico, #diasOperativosAnoBasico, #horasProductivasDiaBasico, #mantenimientoBasico"
).forEach((input) => {
  input.addEventListener("input", actualizarSupuestosEditablesBasico);
});
materialAvanzado.addEventListener("change", aplicarMaterialAvanzado);
impresoraAvanzado.addEventListener("change", aplicarImpresoraAvanzado);
canalVentaAvanzado.addEventListener("change", aplicarCanalAvanzado);
modoCostoGramoAvanzado.addEventListener("click", () => cambiarModoCostoMaterial("avanzado", false));
modoCostoKiloAvanzado.addEventListener("click", () => cambiarModoCostoMaterial("avanzado", true));
document
  .querySelector("#costoUnidadAvanzado")
  .addEventListener("input", () => actualizarAyudaCostoMaterial("avanzado"));
currencySelect.addEventListener("change", () => sincronizarMonedas(currencySelect));
currencySelectBasico.addEventListener("change", () => sincronizarMonedas(currencySelectBasico));
languageSelect.addEventListener("change", () => sincronizarIdiomas(languageSelect));
languageSelectBasico.addEventListener("change", () => sincronizarIdiomas(languageSelectBasico));
metodoPagoComparador.addEventListener("change", () => {
  renderizarComparadorCanales(ultimoDatosCalculo, ultimoResultadoCalculo);
});
guardarConfiguracionButton.addEventListener("click", () => guardarConfiguracionActual(true));
restablecerConfiguracionButton.addEventListener("click", restablecerConfiguracionGuardada);
exportarConfiguracionButton.addEventListener("click", exportarConfiguracion);
importarConfiguracionButton.addEventListener("click", () => importarConfiguracionInput.click());
importarConfiguracionInput.addEventListener("change", importarConfiguracionDesdeArchivo);
guardarTrabajoActualButton.addEventListener("click", guardarTrabajoActual);
exportarTrabajosButton.addEventListener("click", exportarTrabajosCSV);
exportarTrabajosJsonButton.addEventListener("click", exportarTrabajosJSONDesdeUI);
importarTrabajosButton.addEventListener("click", () => importarTrabajosInput.click());
importarTrabajosInput.addEventListener("change", importarTrabajosDesdeArchivo);
borrarTrabajosButton.addEventListener("click", borrarTodosLosTrabajos);
trabajosListado.addEventListener("click", manejarAccionTrabajo);
trabajosListado.addEventListener("change", manejarAccionTrabajo);
guardarDatosCotizacionButton.addEventListener("click", guardarDatosCotizacion);
borrarDatosCotizacionButton.addEventListener("click", borrarDatosCotizacionGuardados);
generarCotizacionButton.addEventListener("click", renderizarCotizacionCliente);
vistaPreviaCotizacionButton.addEventListener("click", renderizarCotizacionCliente);
imprimirCotizacionButton.addEventListener("click", imprimirCotizacionCliente);
nuevaCotizacionButton?.addEventListener("click", iniciarNuevaCotizacion);
cargarUltimoCalculoButton.addEventListener("click", cargarUltimoCalculoGuardado);
borrarUltimoCalculoButton.addEventListener("click", borrarUltimoCalculoGuardado);

cargarMonedas();
cargarIdiomas();
cargarPresetsVisuales();
cargarMetodosPagoComparador();
aplicarMaterialBasico();
aplicarImpresoraBasico();
aplicarCanalBasico();
aplicarMaterialAvanzado();
aplicarImpresoraAvanzado();
aplicarCanalAvanzado();
cambiarModo("avanzado");
ultimosSupuestosBasicos = obtenerSupuestosBasicos();
actualizarVistaPreviaMoneda();
renderizarSupuestosBasicos(ultimosSupuestosBasicos);
cargarConfiguracionInicial();
cargarDatosCotizacionIniciales();
renderizarUltimoCalculoGuardado();
renderizarTrabajos();
registrarAutoguardado();

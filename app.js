// Elementos principales de la interfaz
const calculateButton = document.querySelector("#calculateButton");
const calculateBasicButton = document.querySelector("#calculateBasicButton");
const clearButton = document.querySelector("#clearButton");
const exportExcelButton = document.querySelector("#btnExportarExcel");
const resultBox = document.querySelector("#result");
const resultBasico = document.querySelector("#resultBasico");
const basicBreakdown = document.querySelector("#basicBreakdown");
const basicWarnings = document.querySelector("#basicWarnings");
const comparadorCanalesContenido = document.querySelector("#comparadorCanalesContenido");
const metodoPagoComparador = document.querySelector("#metodoPagoComparador");
const guardarConfiguracionButton = document.querySelector("#guardarConfiguracionButton");
const restablecerConfiguracionButton = document.querySelector("#restablecerConfiguracionButton");
const exportarConfiguracionButton = document.querySelector("#exportarConfiguracionButton");
const importarConfiguracionButton = document.querySelector("#importarConfiguracionButton");
const importarConfiguracionInput = document.querySelector("#importarConfiguracionInput");
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

let modoActual = "basico";
let ultimoResultadoBasico = null;
let ultimosSupuestosBasicos = {};
let ultimoFeeEstimadoBasico = 0;
let ultimoDatosCalculo = null;
let ultimoResultadoCalculo = null;
let guardadoPausado = true;
let temporizadorGuardado = null;
let avisoStorageMostrado = false;

// Boton reservado para una futura exportacion a Excel
exportExcelButton.disabled = true;

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

  config.etiqueta.textContent = usandoKilo ? "Precio por kilo de filamento" : "Costo por gramo";
  config.ayuda.textContent = usandoKilo
    ? `Si ingresas el precio del kilo, la calculadora lo convertirá automáticamente a costo por gramo. Costo por gramo calculado: ${formatearMoneda(costoPorGramo)}.${advertenciaKilo}`
    : `Costo por gramo calculado: ${formatearMoneda(costoPorGramo)}.`;
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
      pesoPieza: leerNumero("pesoPiezaBasico") * cantidad,
      pesoSoportesPurga: leerNumero("pesoSoportesPurgaBasico") * cantidad,
      costoUnidad: leerCostoMaterialPorGramo("basico"),
      merma: supuestos.merma,
      horasImpresion: leerNumero("horasImpresionBasico") * cantidad,
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
      pesoPieza: leerNumero("pesoPiezaAvanzado") * cantidad,
      pesoSoportesPurga: leerNumero("pesoSoportesPurgaAvanzado") * cantidad,
      costoUnidad: leerCostoMaterialPorGramo("avanzado"),
      merma: Number(material?.mermaSugerida) || supuestos.merma,
      horasImpresion: leerHoras("horasImpresionAvanzado") * cantidad,
      wattsPromedio: leerNumero("wattsPromedioAvanzado") || supuestos.wattsPromedio,
      tarifaKwh: leerNumero("tarifaKwhAvanzado") || supuestos.tarifaKwh,
      costoImpresora: leerNumero("costoImpresoraAvanzado") || supuestos.costoImpresora,
      costoHerramientas: supuestos.costoHerramientas,
      mantenimiento: leerPorcentajeConFallback("mantenimientoAvanzado", supuestos.mantenimiento),
      anosVida: supuestos.anosVida,
      diasOperativosAno: supuestos.diasOperativosAno,
      horasProductivasDia: supuestos.horasProductivasDia,
      horasPreparacion: leerHoras("horasPreparacionAvanzado"),
      horasPostprocesado: leerHoras("horasPostprocesadoAvanzado"),
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
    comparadorCanalesContenido.textContent = "Primero realiza un cálculo para comparar canales.";
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
    <div class="comparison-recommendations">
      ${crearRecomendacion(
        "Canal con menor precio final",
        menorPrecio,
        menorPrecio ? formatearMoneda(menorPrecio.precioFinal) : ""
      )}
      ${crearRecomendacion(
        "Canal con mayor utilidad estimada",
        mayorUtilidad,
        mayorUtilidad ? formatearMoneda(mayorUtilidad.utilidadReal) : ""
      )}
      ${crearRecomendacion(
        "Canal con menor fee",
        menorFee,
        menorFee ? formatearMoneda(menorFee.feesEstimados) : ""
      )}
    </div>
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
    <p class="result-total">${formatearMoneda(resumen.precioFinal)}</p>
    <div class="result-summary">
      ${crearItemResumen("Precio sugerido al cliente", formatearMoneda(resumen.precioFinal))}
      ${crearItemResumen("Costo real estimado", formatearMoneda(resumen.costoTotal))}
      ${crearItemResumen("Utilidad estimada", formatearMoneda(utilidadEstimada))}
      ${crearItemResumen("Margen objetivo", formatearPorcentaje(margenObjetivo))}
      ${crearItemResumen("Fee estimado", formatearMoneda(feeEstimado))}
      ${crearItemResumen("Impuesto estimado", formatearMoneda(resumen.impuesto))}
    </div>
    ${desglose ? "" : `<div class="breakdown-grid">${desgloseHtml}</div>`}
  `;

  if (desglose) {
    desglose.innerHTML = desgloseHtml;
  }
}

function renderizarResultadoBasico(resumen, feeEstimado) {
  renderizarResultado(resumen, feeEstimado, resultBasico, basicBreakdown, {
    margenObjetivo: leerPorcentaje("margenBasico")
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

function renderizarUltimoCalculoGuardado() {
  const ultimo = window.StoragePrecio3D?.cargarUltimoCalculo?.();

  if (!ultimo || !ultimoCalculoPanel || !ultimoCalculoResumen) {
    if (ultimoCalculoPanel) {
      ultimoCalculoPanel.hidden = true;
    }

    return;
  }

  const fecha = ultimo.guardadoEn ? new Date(ultimo.guardadoEn).toLocaleString() : "Sin fecha";
  const precioFinal = ultimo.resultado?.precioFinal;
  const costoTotal = ultimo.resultado?.costoTotal;

  ultimoCalculoPanel.hidden = false;
  ultimoCalculoResumen.innerHTML = `
    <div class="result-summary">
      ${crearItemResumen("Fecha", fecha)}
      ${crearItemResumen("Modo", ultimo.modo === "avanzado" ? "Avanzado" : "Básico")}
      ${crearItemResumen("Precio final", formatoComparadorMoneda(precioFinal))}
      ${crearItemResumen("Costo total", formatoComparadorMoneda(costoTotal))}
    </div>
  `;
}

function guardarUltimoCalculo(modo, datos, resultado) {
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
  const feeEstimado = calcularFeeEstimado(ultimo.resultado);

  if (ultimo.modo === "avanzado") {
    renderizarResultado(ultimo.resultado, feeEstimado, resultBox, null, {
      margenObjetivo: ultimo.datos.margen
    });
  } else {
    ultimoResultadoBasico = ultimo.resultado;
    ultimoFeeEstimadoBasico = feeEstimado;
    renderizarResultadoBasico(ultimo.resultado, feeEstimado);
  }

  renderizarComparadorCanales(ultimoDatosCalculo, ultimoResultadoCalculo);

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
  renderizarResultadoBasico(resumen, feeEstimado);
  renderizarSupuestosBasicos(construido.supuestos);
  renderizarComparadorCanales(ultimoDatosCalculo, ultimoResultadoCalculo);
  guardarUltimoCalculo("basico", ultimoDatosCalculo, ultimoResultadoCalculo);
  guardarConfiguracionActual(false);
}

function calcularModoAvanzado() {
  const construido = construirDatosAvanzados();

  if (!construido) {
    return;
  }

  const resumen = window.FormulasPrecio3D.calcularResumenCompleto(construido.datos);
  const feeEstimado = calcularFeeEstimado(resumen);
  ultimoDatosCalculo = { ...construido.datos };
  ultimoResultadoCalculo = resumen;
  renderizarResultado(resumen, feeEstimado, resultBox, null, {
    margenObjetivo: leerPorcentaje("margenAvanzado")
  });
  renderizarComparadorCanales(ultimoDatosCalculo, ultimoResultadoCalculo);
  guardarUltimoCalculo("avanzado", ultimoDatosCalculo, ultimoResultadoCalculo);
  guardarConfiguracionActual(false);

  if (resumen.precioNeto !== null) {
    exportExcelButton.disabled = false;
  }
}

function limpiarFormulario() {
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
  nivelTrabajoBasico.value = "basico";
  manoObraSimpleBasico.value = valoresNivelTrabajo.basico;
  cambiarModoCostoMaterial("basico", false);
  cambiarModoCostoMaterial("avanzado", false);
  resultBox.textContent = "Completa los datos y presiona Calcular.";
  resultBasico.textContent = "Completa los datos principales y presiona Calcular.";
  basicBreakdown.innerHTML = "";
  basicWarnings.innerHTML = "";
  exportExcelButton.disabled = true;
  ultimoDatosCalculo = null;
  ultimoResultadoCalculo = null;
  renderizarComparadorCanales(null, null);
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
clearButton.addEventListener("click", limpiarFormulario);
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
cambiarModo("basico");
ultimosSupuestosBasicos = obtenerSupuestosBasicos();
actualizarVistaPreviaMoneda();
renderizarSupuestosBasicos(ultimosSupuestosBasicos);
cargarConfiguracionInicial();
renderizarUltimoCalculoGuardado();
registrarAutoguardado();

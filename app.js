// Elementos principales de la interfaz
const calculateButton = document.querySelector("#calculateButton");
const calculateBasicButton = document.querySelector("#calculateBasicButton");
const clearButton = document.querySelector("#clearButton");
const exportExcelButton = document.querySelector("#btnExportarExcel");
const resultBox = document.querySelector("#result");
const resultBasico = document.querySelector("#resultBasico");
const a11yLiveRegion = document.querySelector("#a11yLiveRegion");
const resultadoBasicoTitulo = document.querySelector("#resultadoBasicoTitulo");
const resultadoAvanzadoTitulo = document.querySelector("#resultadoAvanzadoTitulo");
const basicBreakdown = document.querySelector("#basicBreakdown");
const basicWarnings = document.querySelector("#basicWarnings");
const preciosNivelContenido = document.querySelector("#preciosNivelContenido");
const comparadorCanalesContenido = document.querySelector("#comparadorCanalesContenido");
const metodoPagoComparador = document.querySelector("#metodoPagoComparador");
const ordenComparadorCanales = document.querySelector("#ordenComparadorCanales");
const guardarConfiguracionButton = document.querySelector("#guardarConfiguracionButton");
const restablecerConfiguracionButton = document.querySelector("#restablecerConfiguracionButton");
const exportarConfiguracionButton = document.querySelector("#exportarConfiguracionButton");
const importarConfiguracionButton = document.querySelector("#importarConfiguracionButton");
const importarConfiguracionInput = document.querySelector("#importarConfiguracionInput");
const trabajoCliente = document.querySelector("#trabajoCliente");
const trabajoDescripcion = document.querySelector("#trabajoDescripcion");
const trabajoEstado = document.querySelector("#trabajoEstado");
const trabajoClienteGuardado = document.querySelector("#trabajoClienteGuardado");
const nuevoClienteDesdeTrabajoButton = document.querySelector("#nuevoClienteDesdeTrabajoButton");
const guardarTrabajoActualButton = document.querySelector("#guardarTrabajoActualButton");
const guardarDesdeResultadoButton = document.querySelector("#guardarDesdeResultadoButton");
const generarCotizacionDesdeResultadoButton = document.querySelector("#generarCotizacionDesdeResultadoButton");
const agregarCalculoCotizacionButton = document.querySelector("#agregarCalculoCotizacionButton");
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
const clienteGuardadoCotizacion = document.querySelector("#clienteGuardadoCotizacion");
const clienteCotizacionVinculo = document.querySelector("#clienteCotizacionVinculo");
const actualizarClienteDesdeCotizacionButton = document.querySelector("#actualizarClienteDesdeCotizacionButton");
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
const costosAdicionalesBasico = document.querySelector("#costosAdicionalesBasico");
const ventaConfiguracionBasico = document.querySelector("#ventaConfiguracionBasico");
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
const currencyDetectionStatus = document.querySelector("#currencyDetectionStatus");
const currencyDetectionStatusBasico = document.querySelector("#currencyDetectionStatusBasico");
const currencyConversionWarning = document.querySelector("#currencyConversionWarning");
const currencyConversionWarningBasico = document.querySelector("#currencyConversionWarningBasico");
const currencyClearNotice = document.querySelector("#currencyClearNotice");
const currencyClearNoticeBasico = document.querySelector("#currencyClearNoticeBasico");
const confirmarRevisionMoneda = document.querySelector("#confirmarRevisionMoneda");
const confirmarRevisionMonedaBasico = document.querySelector("#confirmarRevisionMonedaBasico");
const currencyChangeModal = document.querySelector("#currencyChangeModal");
const currencyKeepValuesButton = document.querySelector("#currencyKeepValuesButton");
const currencyClearValuesButton = document.querySelector("#currencyClearValuesButton");
const currencyCancelButton = document.querySelector("#currencyCancelButton");
const detectarMonedaAvanzado = document.querySelector("#detectarMonedaAvanzado");
const detectarMonedaBasico = document.querySelector("#detectarMonedaBasico");
const materialBasico = document.querySelector("#materialBasico");
const filamentoBasico = document.querySelector("#filamentoBasico");
const filamentoResumenBasico = document.querySelector("#filamentoResumenBasico");
const cambiarMonedaFilamentoBasico = document.querySelector("#cambiarMonedaFilamentoBasico");
const usarCostoActualFilamentoBasico = document.querySelector("#usarCostoActualFilamentoBasico");
const usarCostoManualBasico = document.querySelector("#usarCostoManualBasico");
const impresoraBasico = document.querySelector("#impresoraBasico");
const impresoraPerfilNotaBasico = document.querySelector("#impresoraPerfilNotaBasico");
const usarValoresManualesBasico = document.querySelector("#usarValoresManualesBasico");
const actualizarPerfilBasico = document.querySelector("#actualizarPerfilBasico");
const costoImpresoraAvisoBasico = document.querySelector("#costoImpresoraAvisoBasico");
const canalVentaBasico = document.querySelector("#canalVentaBasico");
const nivelTrabajoBasico = document.querySelector("#nivelTrabajoBasico");
const manoObraSimpleBasico = document.querySelector("#manoObraSimpleBasico");
const modoCostoGramoBasico = document.querySelector("#modoCostoGramoBasico");
const modoCostoKiloBasico = document.querySelector("#modoCostoKiloBasico");
const costoUnidadHelpBasico = document.querySelector("#costoUnidadHelpBasico");
const materialAvanzado = document.querySelector("#materialAvanzado");
const filamentoAvanzado = document.querySelector("#filamentoAvanzado");
const filamentoResumenAvanzado = document.querySelector("#filamentoResumenAvanzado");
const cambiarMonedaFilamentoAvanzado = document.querySelector("#cambiarMonedaFilamentoAvanzado");
const usarCostoActualFilamentoAvanzado = document.querySelector("#usarCostoActualFilamentoAvanzado");
const usarCostoManualAvanzado = document.querySelector("#usarCostoManualAvanzado");
const impresoraAvanzado = document.querySelector("#impresoraAvanzado");
const impresoraPerfilNotaAvanzado = document.querySelector("#impresoraPerfilNotaAvanzado");
const actualizarPerfilAvanzado = document.querySelector("#actualizarPerfilAvanzado");
const costoImpresoraAvisoAvanzado = document.querySelector("#costoImpresoraAvisoAvanzado");
const canalVentaAvanzado = document.querySelector("#canalVentaAvanzado");
const baseComisionCanalAvanzado = document.querySelector("#baseComisionCanalAvanzado");
const baseComisionPagoAvanzado = document.querySelector("#baseComisionPagoAvanzado");
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
    nombre: "Recomendado",
    margen: 0.35,
    nota: "Buen equilibrio entre precio, costo y ganancia."
  },
  {
    nombre: "Premium",
    margen: 0.55,
    nota: "Para trabajos urgentes, detallados o de mayor valor."
  }
];


function anunciarAccesible(mensaje) {
  if (!a11yLiveRegion || !mensaje) return;
  a11yLiveRegion.textContent = "";
  window.setTimeout(() => {
    a11yLiveRegion.textContent = mensaje;
  }, 40);
}

function enfocarResultadoCalculado(modo) {
  const titulo = modo === "basico" ? resultadoBasicoTitulo : resultadoAvanzadoTitulo;
  if (!titulo) return;
  window.setTimeout(() => titulo.focus({ preventScroll: false }), 80);
}

window.AccesibilidadPrecio3D = {
  anunciar: anunciarAccesible
};
const estadosTrabajo = [
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
const clavesEstadoTrabajo = {
  "Pendiente": "pendiente",
  "Aceptado": "aceptado",
  "Esperando abono": "esperandoAbono",
  "En producción": "enProduccion",
  "Terminado": "terminado",
  "Entregado": "entregado",
  "Pagado": "pagado",
  "Rechazado": "rechazado",
  "Cancelado": "cancelado"
};

const MONEDA_BASE_PRESETS = "CLP";
const camposMonetarios = [
  "costoUnidadBasico",
  "costoUnidadAvanzado",
  "tarifaKwhBasico",
  "tarifaKwhAvanzado",
  "costoImpresoraBasico",
  "costoImpresoraAvanzado",
  "costoHerramientasBasico",
  "costoHerramientasAvanzado",
  "manoObraSimpleBasico",
  "tarifaHoraAvanzado",
  "embalajeBasico",
  "embalajeAvanzado",
  "envioBasico",
  "envioAvanzado",
  "seguroAduanasAvanzado",
  "feeFijoBasico",
  "impresoraCostoCompra",
  "impresoraCostoHerramientas",
  "impresoraMantenimientoAnual",
  "filamentoPrecioTotal",
  "filamentoPrecioKilo"
];

let modoActual = "basico";
let ultimoResultadoBasico = null;
let ultimosSupuestosBasicos = {};
let ultimoFeeEstimadoBasico = 0;
const revisarCostoImpresoraPorCambio = {
  basico: false,
  avanzado: false
};
let ultimoDatosCalculo = null;
let ultimoResultadoCalculo = null;
let ultimoModoCalculo = null;
let trabajoCotizacionTemporal = null;
let numeroCotizacionActual = null;
let referenciaCotizacionActual = null;
let impresoraTrabajoCargada = null;
let impresoraTrabajoCargadaId = "";
let filamentoTrabajoCargado = null;
let filamentoTrabajoCargadoId = "";
let guardadoPausado = true;
let temporizadorGuardado = null;
let avisoStorageMostrado = false;
let monedaSeleccionadaManualmente = false;
let hayMonedaGuardada = false;
let monedaActualConfirmada = "CLP";
let advertenciaMonedaSinConversion = false;
let cambioMonedaPendiente = null;
let ultimoFocoCambioMoneda = null;
let ultimaDeteccionMoneda = null;
let clienteCotizacionSeleccionadoId = "";
let snapshotClienteCotizacion = null;
let baseComisionCanalBasicoActual = "precioNeto";
let baseComisionPagoBasicoActual = "precioNeto";

// Boton reservado para una futura exportacion a Excel
exportExcelButton.disabled = true;

function resultadoActualEsUsable() {
  return Boolean(window.ValidacionPrecio3D?.esResultadoCalculable?.());
}

function actualizarBotonesGuardarTrabajo(habilitado) {
  [guardarTrabajoActualButton, guardarDesdeResultadoButton].forEach((boton) => {
    if (boton) {
      boton.disabled = !(habilitado && resultadoActualEsUsable());
    }
  });
}

actualizarBotonesGuardarTrabajo(false);

function actualizarBotonesCotizacion(habilitado) {
  const cotizacionConItems = Boolean(window.PanelCotizacionesPrecio3D?.obtenerActual?.()?.items?.length);
  const resultadoUsable = resultadoActualEsUsable();
  [
    generarCotizacionButton,
    vistaPreviaCotizacionButton,
    imprimirCotizacionButton,
    generarCotizacionDesdeResultadoButton
  ].forEach((boton) => {
    if (boton) {
      boton.disabled = !(habilitado && resultadoUsable);
    }
  });

  if (agregarCalculoCotizacionButton) {
    agregarCalculoCotizacionButton.disabled = !(habilitado && resultadoUsable);
  }

  if (cotizacionMessage) {
    cotizacionMessage.classList.toggle("empty-state", !(habilitado && resultadoUsable));
    cotizacionMessage.textContent = habilitado && resultadoUsable
      ? textoInterfaz("cotizacionLista")
      : textoInterfaz("recalculaAntesCotizacion");
  }
}

actualizarBotonesCotizacion(false);

function obtenerPresets() {
  if (!window.PresetsPrecio3D?.supuestosBasicos) {
    const mensaje = textoInterfaz("presetsNoCargados");
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

function normalizarTipoGanancia(tipoGanancia) {
  return tipoGanancia === "margen" ? "margen" : "recargo";
}

function normalizarBaseComision(baseComision) {
  return window.FormulasPrecio3D?.normalizarBaseComision?.(baseComision) ||
    (baseComision === "precioFinalConImpuesto" ? "precioFinalConImpuesto" : "precioNeto");
}

function leerBaseComision(id) {
  return normalizarBaseComision(valorCampo(id));
}

function leerTipoGanancia(id) {
  return normalizarTipoGanancia(valorCampo(id));
}

function normalizarAlcanceDatosSlicer(alcanceDatosSlicer) {
  return alcanceDatosSlicer === "lote" ? "lote" : "unidad";
}

function leerAlcanceDatosSlicer(id) {
  return normalizarAlcanceDatosSlicer(valorCampo(id));
}

function obtenerFactorCantidadSlicer(alcanceDatosSlicer, cantidad) {
  return normalizarAlcanceDatosSlicer(alcanceDatosSlicer) === "unidad"
    ? Math.max(1, Number(cantidad) || 1)
    : 1;
}

function textoInterfaz(clave, reemplazos = {}) {
  const idioma = languageSelectBasico?.value || languageSelect?.value || "es";
  if (window.obtenerTextoI18n) {
    return window.obtenerTextoI18n(clave, reemplazos, idioma);
  }

  const textos = window.IdiomasPrecio3D?.[idioma]?.textos || window.IdiomasPrecio3D?.es?.textos || {};
  let texto = textos[clave] || window.IdiomasPrecio3D?.es?.textos?.[clave] || "";

  Object.entries(reemplazos).forEach(([llave, valor]) => {
    texto = texto.replaceAll(`{${llave}}`, valor);
  });

  return texto;
}

function obtenerElemento(id) {
  return document.querySelector(`#${id}`);
}

function obtenerCamposMonetarios() {
  return camposMonetarios
    .map((id) => obtenerElemento(id))
    .filter(Boolean);
}

function hayValoresMonetariosIngresados() {
  return obtenerCamposMonetarios().some((campo) => {
    const valor = String(campo.value || "").trim();
    return valor !== "" && Number(valor) > 0;
  });
}

function limpiarValoresMonetarios() {
  obtenerCamposMonetarios().forEach((campo) => {
    campo.value = "";
    campo.dispatchEvent(new Event("input", { bubbles: true }));
  });
}

function asignarMonedaSelectores(moneda) {
  if (currencySelect) currencySelect.value = moneda;
  if (currencySelectBasico) currencySelectBasico.value = moneda;
}

function actualizarAdvertenciaMoneda() {
  [currencyConversionWarning, currencyConversionWarningBasico].forEach((elemento) => {
    if (elemento) elemento.hidden = !advertenciaMonedaSinConversion;
  });
}

function mostrarAvisoLimpiarMoneda(mostrar) {
  [currencyClearNotice, currencyClearNoticeBasico].forEach((elemento) => {
    if (elemento) elemento.hidden = !mostrar;
  });
}

function confirmarRevisionValoresMoneda() {
  advertenciaMonedaSinConversion = false;
  actualizarAdvertenciaMoneda();
  guardarConfiguracionActual(false);
}

function cerrarDialogoCambioMoneda() {
  if (!currencyChangeModal) return;
  currencyChangeModal.hidden = true;
  document.body.classList.remove("modal-open");
  document.removeEventListener("keydown", manejarTecladoDialogoMoneda);

  const foco = ultimoFocoCambioMoneda;
  ultimoFocoCambioMoneda = null;
  cambioMonedaPendiente = null;

  if (foco?.focus) {
    foco.focus();
  }
}

function cancelarCambioMoneda() {
  const anterior = cambioMonedaPendiente?.anterior || monedaActualConfirmada || "CLP";
  asignarMonedaSelectores(anterior);
  cerrarDialogoCambioMoneda();
}

function manejarTecladoDialogoMoneda(event) {
  if (!currencyChangeModal || currencyChangeModal.hidden) return;

  if (event.key === "Escape") {
    event.preventDefault();
    cancelarCambioMoneda();
    return;
  }

  if (event.key !== "Tab") return;

  const focables = Array.from(
    currencyChangeModal.querySelectorAll("button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])")
  ).filter((elemento) => !elemento.disabled && !elemento.hidden);

  if (!focables.length) return;

  const primero = focables[0];
  const ultimo = focables[focables.length - 1];

  if (event.shiftKey && document.activeElement === primero) {
    event.preventDefault();
    ultimo.focus();
  } else if (!event.shiftKey && document.activeElement === ultimo) {
    event.preventDefault();
    primero.focus();
  }
}

function abrirDialogoCambioMoneda(monedaAnterior, monedaNueva, origen) {
  if (!currencyChangeModal) return;
  cambioMonedaPendiente = { anterior: monedaAnterior, nueva: monedaNueva, origen };
  ultimoFocoCambioMoneda = origen || document.activeElement;
  currencyChangeModal.hidden = false;
  document.body.classList.add("modal-open");
  document.addEventListener("keydown", manejarTecladoDialogoMoneda);
  currencyKeepValuesButton?.focus();
}

function aplicarCambioMonedaConfirmado(moneda, opciones = {}) {
  asignarMonedaSelectores(moneda);
  monedaActualConfirmada = moneda || "CLP";

  if (opciones.manual) {
    monedaSeleccionadaManualmente = true;
    hayMonedaGuardada = true;
  }

  if (opciones.limpiarValores) {
    limpiarValoresMonetarios();
    advertenciaMonedaSinConversion = false;
    mostrarAvisoLimpiarMoneda(true);
  } else {
    mostrarAvisoLimpiarMoneda(false);
  }

  if (opciones.conservarValores) {
    advertenciaMonedaSinConversion = true;
  } else if (opciones.limpiarValores || opciones.restauracionCoherente) {
    advertenciaMonedaSinConversion = false;
  }

  actualizarAdvertenciaMoneda();
  actualizarVistaPreviaMoneda();
  renderizarSupuestosBasicos(ultimosSupuestosBasicos);

  if (ultimoResultadoBasico) {
    renderizarResultadoBasico(ultimoResultadoBasico, ultimoFeeEstimadoBasico);
  }

  if (ultimoDatosCalculo && ultimoResultadoCalculo) {
    ultimoDatosCalculo.moneda = monedaActualConfirmada;
    const feeEstimado = calcularFeeEstimado(ultimoResultadoCalculo);
    renderizarResultado(ultimoResultadoCalculo, feeEstimado, resultBox, null, {
      margenObjetivo: ultimoDatosCalculo.margen,
      nombreTrabajo: ultimoDatosCalculo.nombreTrabajo,
      cantidadProductos: ultimoDatosCalculo.cantidadProductos
    });
    renderizarComparadorCanales(ultimoDatosCalculo, ultimoResultadoCalculo);
    renderizarPreciosPorNivel(ultimoDatosCalculo);
    actualizarVistaCotizacionSiExiste();
  }

  if (opciones.manual) {
    actualizarEstadoDeteccionMoneda(textoInterfaz("monedaSeleccionadaManual", { moneda: monedaActualConfirmada }));
    programarGuardadoConfiguracion();
  }
}

function solicitarCambioMoneda(monedaAnterior, monedaNueva, origen) {
  if (monedaAnterior === monedaNueva) {
    return;
  }

  if (!hayValoresMonetariosIngresados()) {
    aplicarCambioMonedaConfirmado(monedaNueva, { manual: true });
    return;
  }

  asignarMonedaSelectores(monedaAnterior);
  abrirDialogoCambioMoneda(monedaAnterior, monedaNueva, origen);
}

function etiquetaTipoGanancia(tipoGanancia) {
  return normalizarTipoGanancia(tipoGanancia) === "margen"
    ? textoInterfaz("margenSobreVenta")
    : textoInterfaz("recargoSobreCosto");
}

function etiquetaPorcentajeNivel(tipoGanancia) {
  return normalizarTipoGanancia(tipoGanancia) === "margen"
    ? textoInterfaz("deMargenSobreVenta")
    : textoInterfaz("deRecargo");
}

function etiquetaAlcanceDatosSlicer(alcanceDatosSlicer) {
  return normalizarAlcanceDatosSlicer(alcanceDatosSlicer) === "lote"
    ? textoInterfaz("datosSlicerLote")
    : textoInterfaz("datosSlicerUnidad");
}

function etiquetaBaseComision(baseComision) {
  return normalizarBaseComision(baseComision) === "precioFinalConImpuesto"
    ? textoInterfaz("precioFinalConImpuestos")
    : textoInterfaz("precioNetoAntesImpuestos");
}

function obtenerSufijoModo(modo) {
  return modo === "basico" ? "Basico" : "Avanzado";
}

function actualizarAdvertenciaCostoImpresora(modo) {
  const sufijo = obtenerSufijoModo(modo);
  const aviso = modo === "basico" ? costoImpresoraAvisoBasico : costoImpresoraAvisoAvanzado;

  if (!aviso) {
    return;
  }

  const costo = leerNumero(`costoImpresora${sufijo}`);

  if (costo <= 0) {
    aviso.textContent = textoInterfaz("ingresaCostoRealImpresora");
    aviso.hidden = false;
    return;
  }

  if (revisarCostoImpresoraPorCambio[modo]) {
    aviso.textContent = textoInterfaz("revisaCostoCambioModelo");
    aviso.hidden = false;
    return;
  }

  aviso.hidden = true;
}

function registrarSeleccionImpresora(modo, selector) {
  const valorActual = selector?.value || "";
  const valorAnterior = selector?.dataset.impresoraSeleccionada || "";
  const cambioModelo =
    valorAnterior &&
    valorAnterior !== valorActual &&
    valorAnterior.startsWith("perfil:") &&
    valorActual.startsWith("perfil:");

  if (cambioModelo) {
    revisarCostoImpresoraPorCambio[modo] = true;
  }

  if (selector) {
    selector.dataset.impresoraSeleccionada = valorActual;
  }
}

function actualizarEtiquetasAlcanceSlicer(modo) {
  const esBasico = modo === "basico";
  const alcance = leerAlcanceDatosSlicer(esBasico ? "alcanceDatosSlicerBasico" : "alcanceDatosSlicerAvanzado");
  const esLote = alcance === "lote";
  const etiquetas = {
    peso: document.querySelector(`#pesoPiezaLabel${esBasico ? "Basico" : "Avanzado"}`),
    extra: document.querySelector(`#pesoSoportesPurgaLabel${esBasico ? "Basico" : "Avanzado"}`),
    tiempo: document.querySelector(`#tiempoImpresionLabel${esBasico ? "Basico" : "Avanzado"}`)
  };

  if (etiquetas.peso) {
    etiquetas.peso.textContent = textoInterfaz(esLote ? "pesoTotalLote" : "pesoUnaUnidad");
  }

  if (etiquetas.extra) {
    etiquetas.extra.textContent = textoInterfaz(esLote ? "materialExtraTotalLote" : "materialExtraPorUnidad");
  }

  if (etiquetas.tiempo) {
    etiquetas.tiempo.textContent = textoInterfaz(esLote ? "tiempoTotalLote" : "tiempoImpresionUnidad");
  }
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
    monedaManual: monedaSeleccionadaManualmente,
    advertenciaMonedaSinConversion,
    basico: {
      nombreTrabajo: valorCampo("nombreTrabajoBasico"),
      cantidadProductos: valorCampo("cantidadBasico"),
      alcanceDatosSlicer: leerAlcanceDatosSlicer("alcanceDatosSlicerBasico"),
      pesoPieza: valorCampo("pesoPiezaBasico"),
      pesoSoportesPurga: valorCampo("pesoSoportesPurgaBasico"),
      horasImpresionHoras: valorCampo("horasImpresionHorasBasico"),
      horasImpresionMinutos: valorCampo("horasImpresionMinutosBasico"),
      material: valorCampo("materialBasico"),
      impresora: valorCampo("impresoraBasico"),
      canalVenta: valorCampo("canalVentaBasico"),
      tipoPrecioFilamento: obtenerTipoPrecioFilamento("basico"),
      precioFilamento: valorCampo("costoUnidadBasico"),
      impuesto: valorCampo("impuestoBasico"),
      tipoGanancia: leerTipoGanancia("tipoGananciaBasico"),
      margen: valorCampo("margenBasico"),
      tarifaKwh: valorCampo("tarifaKwhBasico"),
      manoObraSimple: valorCampo("manoObraSimpleBasico"),
      nivelTrabajo: valorCampo("nivelTrabajoBasico"),
      embalaje: valorCampo("embalajeBasico"),
      envio: valorCampo("envioBasico"),
      feeFijo: valorCampo("feeFijoBasico"),
      feePorcentual: valorCampo("feePorcentualBasico"),
      baseComisionCanal: normalizarBaseComision(baseComisionCanalBasicoActual),
      baseComisionPago: normalizarBaseComision(baseComisionPagoBasicoActual),
      supuestosEditados: {
        merma: valorCampo("mermaBasico"),
        wattsPromedio: valorCampo("wattsPromedioBasico"),
        tarifaKwh: valorCampo("tarifaKwhBasico"),
        costoImpresora: valorCampo("costoImpresoraBasico"),
        costoHerramientas: valorCampo("costoHerramientasBasico"),
        anosVida: valorCampo("anosVidaBasico"),
        diasOperativosAno: valorCampo("diasOperativosAnoBasico"),
        horasProductivasDia: valorCampo("horasProductivasDiaBasico"),
        mantenimiento: valorCampo("mantenimientoBasico"),
        omitirAmortizacionImpresora: Boolean(document.querySelector("#omitirAmortizacionBasico")?.checked)
      }
    },
    avanzado: {
      nombreTrabajo: valorCampo("nombreTrabajoAvanzado"),
      cliente: valorCampo("clienteAvanzado"),
      cantidadProductos: valorCampo("cantidadAvanzado"),
      alcanceDatosSlicer: leerAlcanceDatosSlicer("alcanceDatosSlicerAvanzado"),
      pesoPieza: valorCampo("pesoPiezaAvanzado"),
      pesoSoportesPurga: valorCampo("pesoSoportesPurgaAvanzado"),
      horasImpresionHoras: valorCampo("horasImpresionHorasAvanzado"),
      horasImpresionMinutos: valorCampo("horasImpresionMinutosAvanzado"),
      material: valorCampo("materialAvanzado"),
      impresora: valorCampo("impresoraAvanzado"),
      canalVenta: valorCampo("canalVentaAvanzado"),
      tipoPrecioFilamento: obtenerTipoPrecioFilamento("avanzado"),
      precioFilamento: valorCampo("costoUnidadAvanzado"),
      impuesto: valorCampo("impuestoAvanzado"),
      tipoGanancia: leerTipoGanancia("tipoGananciaAvanzado"),
      margen: valorCampo("margenAvanzado"),
      tarifaKwh: valorCampo("tarifaKwhAvanzado"),
      costoImpresora: valorCampo("costoImpresoraAvanzado"),
      costoHerramientas: valorCampo("costoHerramientasAvanzado"),
      anosVida: valorCampo("anosVidaAvanzado"),
      diasOperativosAno: valorCampo("diasOperativosAnoAvanzado"),
      horasProductivasDia: valorCampo("horasProductivasDiaAvanzado"),
      embalaje: valorCampo("embalajeAvanzado"),
      envio: valorCampo("envioAvanzado"),
      feePorcentual: valorCampo("feeMarketplaceAvanzado"),
      feePago: valorCampo("feePagoAvanzado"),
      baseComisionCanal: leerBaseComision("baseComisionCanalAvanzado"),
      baseComisionPago: leerBaseComision("baseComisionPagoAvanzado"),
      omitirAmortizacionImpresora: Boolean(document.querySelector("#omitirAmortizacionAvanzado")?.checked)
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

function aplicarConfiguracion(configuracion, mostrarMensaje = false, opciones = {}) {
  if (!configuracion || typeof configuracion !== "object") {
    return false;
  }

  guardadoPausado = true;
  const monedaConfiguracion = configuracion.moneda || "CLP";
  hayMonedaGuardada = Boolean(configuracion.moneda);
  monedaSeleccionadaManualmente = Boolean(opciones.preferenciaManual || configuracion.monedaManual);
  monedaActualConfirmada = monedaConfiguracion;
  advertenciaMonedaSinConversion = Boolean(configuracion.advertenciaMonedaSinConversion);

  asignarValorCampo("currencySelectBasico", monedaConfiguracion);
  asignarValorCampo("currencySelect", monedaConfiguracion);
  asignarValorCampo("languageSelectBasico", configuracion.idioma);
  asignarValorCampo("languageSelect", configuracion.idioma);

  const basico = configuracion.basico || {};
  const avanzado = configuracion.avanzado || {};
  const supuestos = basico.supuestosEditados || {};

  asignarValorCampo("materialBasico", basico.material);
  asignarValorCampo("nombreTrabajoBasico", basico.nombreTrabajo);
  asignarValorCampo("cantidadBasico", basico.cantidadProductos);
  asignarValorCampo("alcanceDatosSlicerBasico", normalizarAlcanceDatosSlicer(basico.alcanceDatosSlicer));
  asignarValorCampo("pesoPiezaBasico", basico.pesoPieza);
  asignarValorCampo("pesoSoportesPurgaBasico", basico.pesoSoportesPurga);
  asignarValorCampo("horasImpresionHorasBasico", basico.horasImpresionHoras);
  asignarValorCampo("horasImpresionMinutosBasico", basico.horasImpresionMinutos);
  asignarValorCampo("impresoraBasico", basico.impresora);
  asignarValorCampo("canalVentaBasico", basico.canalVenta);
  cambiarModoCostoMaterial("basico", basico.tipoPrecioFilamento !== "gramo");
  asignarValorCampo("costoUnidadBasico", basico.precioFilamento);
  asignarValorCampo("impuestoBasico", basico.impuesto);
  asignarValorCampo("tipoGananciaBasico", normalizarTipoGanancia(basico.tipoGanancia));
  asignarValorCampo("margenBasico", basico.margen);
  asignarValorCampo("manoObraSimpleBasico", basico.manoObraSimple);
  asignarValorCampo("nivelTrabajoBasico", basico.nivelTrabajo);
  asignarValorCampo("embalajeBasico", basico.embalaje);
  asignarValorCampo("envioBasico", basico.envio);
  asignarValorCampo("feeFijoBasico", basico.feeFijo);
  asignarValorCampo("feePorcentualBasico", basico.feePorcentual);
  baseComisionCanalBasicoActual = normalizarBaseComision(basico.baseComisionCanal);
  baseComisionPagoBasicoActual = normalizarBaseComision(basico.baseComisionPago);
  asignarValorCampo("mermaBasico", supuestos.merma);
  asignarValorCampo("wattsPromedioBasico", supuestos.wattsPromedio);
  asignarValorCampo("tarifaKwhBasico", supuestos.tarifaKwh || basico.tarifaKwh);
  asignarValorCampo("costoImpresoraBasico", supuestos.costoImpresora);
  asignarValorCampo("costoHerramientasBasico", supuestos.costoHerramientas);
  asignarValorCampo("anosVidaBasico", supuestos.anosVida);
  asignarValorCampo("diasOperativosAnoBasico", supuestos.diasOperativosAno);
  asignarValorCampo("horasProductivasDiaBasico", supuestos.horasProductivasDia);
  asignarValorCampo("mantenimientoBasico", supuestos.mantenimiento);
  const omitirBasico = document.querySelector("#omitirAmortizacionBasico");
  if (omitirBasico) omitirBasico.checked = Boolean(supuestos.omitirAmortizacionImpresora || basico.omitirAmortizacionImpresora);

  asignarValorCampo("materialAvanzado", avanzado.material);
  asignarValorCampo("nombreTrabajoAvanzado", avanzado.nombreTrabajo);
  asignarValorCampo("clienteAvanzado", avanzado.cliente);
  asignarValorCampo("cantidadAvanzado", avanzado.cantidadProductos);
  asignarValorCampo("alcanceDatosSlicerAvanzado", normalizarAlcanceDatosSlicer(avanzado.alcanceDatosSlicer));
  asignarValorCampo("pesoPiezaAvanzado", avanzado.pesoPieza);
  asignarValorCampo("pesoSoportesPurgaAvanzado", avanzado.pesoSoportesPurga);
  asignarValorCampo("horasImpresionHorasAvanzado", avanzado.horasImpresionHoras);
  asignarValorCampo("horasImpresionMinutosAvanzado", avanzado.horasImpresionMinutos);
  asignarValorCampo("impresoraAvanzado", avanzado.impresora);
  asignarValorCampo("canalVentaAvanzado", avanzado.canalVenta);
  cambiarModoCostoMaterial("avanzado", avanzado.tipoPrecioFilamento === "kilo");
  asignarValorCampo("costoUnidadAvanzado", avanzado.precioFilamento);
  asignarValorCampo("impuestoAvanzado", avanzado.impuesto);
  asignarValorCampo("tipoGananciaAvanzado", normalizarTipoGanancia(avanzado.tipoGanancia));
  asignarValorCampo("margenAvanzado", avanzado.margen);
  asignarValorCampo("tarifaKwhAvanzado", avanzado.tarifaKwh);
  asignarValorCampo("costoImpresoraAvanzado", avanzado.costoImpresora);
  asignarValorCampo("costoHerramientasAvanzado", avanzado.costoHerramientas);
  asignarValorCampo("anosVidaAvanzado", avanzado.anosVida);
  asignarValorCampo("diasOperativosAnoAvanzado", avanzado.diasOperativosAno);
  asignarValorCampo("horasProductivasDiaAvanzado", avanzado.horasProductivasDia);
  asignarValorCampo("embalajeAvanzado", avanzado.embalaje);
  asignarValorCampo("envioAvanzado", avanzado.envio);
  asignarValorCampo("feeMarketplaceAvanzado", avanzado.feePorcentual);
  asignarValorCampo("feePagoAvanzado", avanzado.feePago);
  asignarValorCampo("baseComisionCanalAvanzado", normalizarBaseComision(avanzado.baseComisionCanal));
  asignarValorCampo("baseComisionPagoAvanzado", normalizarBaseComision(avanzado.baseComisionPago));
  const omitirAvanzado = document.querySelector("#omitirAmortizacionAvanzado");
  if (omitirAvanzado) omitirAvanzado.checked = Boolean(avanzado.omitirAmortizacionImpresora);
  asignarValorCampo("metodoPagoComparador", configuracion.comparador?.metodoPago);
  if (impresoraBasico) impresoraBasico.dataset.impresoraSeleccionada = impresoraBasico.value;
  if (impresoraAvanzado) impresoraAvanzado.dataset.impresoraSeleccionada = impresoraAvanzado.value;

  actualizarAyudaCostoMaterial("basico");
  actualizarAyudaCostoMaterial("avanzado");
  actualizarEtiquetasAlcanceSlicer("basico");
  actualizarEtiquetasAlcanceSlicer("avanzado");
  actualizarAdvertenciaCostoImpresora("basico");
  actualizarAdvertenciaCostoImpresora("avanzado");
  actualizarAdvertenciaMoneda();
  mostrarAvisoLimpiarMoneda(false);
  actualizarVistaPreviaMoneda();
  ultimosSupuestosBasicos = obtenerSupuestosBasicos();
  renderizarSupuestosBasicos(ultimosSupuestosBasicos);
  actualizarResumenFilamento("basico");
  cambiarModo(configuracion.modoActual === "avanzado" ? "avanzado" : "basico");
  window.cambiarIdioma(languageSelectBasico.value || "es");
  sincronizarDesplegablesBasicos();

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
    return false;
  }

  const configuracion = window.StoragePrecio3D?.cargarConfiguracion?.();

  if (configuracion) {
    aplicarConfiguracion(configuracion, true);
    return true;
  } else {
    monedaActualConfirmada = currencySelectBasico?.value || currencySelect?.value || "CLP";
    actualizarAdvertenciaMoneda();
    mostrarAvisoLimpiarMoneda(false);
    guardadoPausado = false;
    return false;
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

    aplicarConfiguracion(configuracion, false, { preferenciaManual: true });
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
  const confirmar = confirm(textoInterfaz("confirmarRestablecerConfiguracion"));

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

  limpiarFormulario({ preservarMoneda: false });
  monedaSeleccionadaManualmente = false;
  hayMonedaGuardada = false;
  guardadoPausado = false;
  mostrarMensajeAlmacenamiento("Configuración restablecida.");
  inicializarDeteccionMoneda();
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
    option.textContent = `${moneda.codigo} — ${obtenerNombreMonedaVisible(moneda)}`;
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

function obtenerPerfilImpresora(selector) {
  const valor = selector?.value || "";
  if (!valor.startsWith("perfil:")) return null;
  return window.ImpresorasPrecio3D?.obtenerImpresoraPorId(valor.slice(7)) || null;
}

function obtenerNombreMonedaVisible(moneda) {
  const idioma = languageSelectBasico?.value || languageSelect?.value || "es";

  try {
    const nombresMoneda = new Intl.DisplayNames([idioma], { type: "currency" });
    return nombresMoneda.of(moneda.codigo) || moneda.nombre;
  } catch (error) {
    return moneda.nombre;
  }
}

function crearSnapshotImpresora(impresora, modo = "") {
  const origen = impresoraTrabajoCargada || impresora;
  if (!origen) return null;
  const snapshot = {
    nombre: origen.nombre,
    marca: origen.marca,
    modelo: origen.modelo,
    variante: origen.variante || "",
    tecnologia: origen.tecnologia,
    costoCompra: Number(origen.costoCompra) || 0,
    monedaCompra: origen.monedaCompra || "CLP",
    costoHerramientas: Number(origen.costoHerramientas) || 0,
    potenciaPromedioWatts: Number(origen.potenciaPromedioWatts) || 0,
    anosVidaUtil: Number(origen.anosVidaUtil) || 0,
    diasOperativosAno: Number(origen.diasOperativosAno) || 0,
    horasProductivasDia: Number(origen.horasProductivasDia) || 0,
    porcentajeMantenimiento: Number(origen.porcentajeMantenimiento) || 0,
    costoHoraEstimado: Number(origen.costoHoraEstimado) || null
  };

  if (modo === "basico" || modo === "avanzado") {
    const sufijo = modo === "basico" ? "Basico" : "Avanzado";
    snapshot.costoCompra = leerNumero(`costoImpresora${sufijo}`);
    snapshot.costoHerramientas = leerNumero(`costoHerramientas${sufijo}`);
    snapshot.potenciaPromedioWatts = leerNumero(`wattsPromedio${sufijo}`);
    snapshot.anosVidaUtil = leerNumero(`anosVida${sufijo}`);
    snapshot.diasOperativosAno = leerNumero(`diasOperativosAno${sufijo}`);
    snapshot.horasProductivasDia = leerNumero(`horasProductivasDia${sufijo}`);
    snapshot.porcentajeMantenimiento = leerPorcentaje(`mantenimiento${sufijo}`);
    snapshot.costoHoraEstimado = window.ImpresorasPrecio3D?.calcularCostoHoraEstimado(snapshot);
  }

  return snapshot;
}

function cargarSelectorPerfilesImpresora(selector) {
  if (!selector) return;
  const anterior = selector.value;
  const perfiles = (window.ImpresorasPrecio3D?.obtenerImpresoras() || []).filter((item) => item.estado === "Activa");
  const predeterminada = perfiles.find((item) => item.esPredeterminada);
  selector.innerHTML = "";
  perfiles.forEach((perfil) => {
    const option = document.createElement("option");
    option.value = `perfil:${perfil.id}`;
    option.textContent = perfil.esPredeterminada ? `${textoInterfaz("predeterminada")} · ${perfil.nombre}` : perfil.nombre;
    selector.appendChild(option);
  });
  [["manual", textoInterfaz("valoresManualesCotizacion")], ["ninguna", textoInterfaz("sinImpresoraValoresVisibles")]].forEach(([value, label]) => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = label;
    selector.appendChild(option);
  });
  const valores = [...selector.options].map((option) => option.value);
  selector.value = valores.includes(anterior)
    ? anterior
    : predeterminada ? `perfil:${predeterminada.id}` : "manual";
}

function cargarSelectoresPerfilesImpresora() {
  cargarSelectorPerfilesImpresora(impresoraBasico);
  cargarSelectorPerfilesImpresora(impresoraAvanzado);
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
  cargarSelectoresPerfilesImpresora();
  cargarSelectorPreset(canalVentaBasico, presets.canalesVenta);
  cargarSelectorPreset(canalVentaAvanzado, presets.canalesVenta);
}

function cargarMetodosPagoComparador() {
  const presets = obtenerPresets();

  if (!metodoPagoComparador || !presets) {
    return;
  }

  if (!Array.isArray(presets.metodosPago)) {
    const mensaje = textoInterfaz("metodosPagoNoCargados");
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
  opcionAutomatica.textContent = textoInterfaz("automaticoSegunCanal");
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
function obtenerCodigoMonedaActivo() {
  return (modoActual === "basico" ? currencySelectBasico?.value : currencySelect?.value) || "CLP";
}

function obtenerMonedaSeleccionada(codigo = obtenerCodigoMonedaActivo()) {
  return window.obtenerMonedaPrecio3D?.(codigo) || null;
}

function obtenerMonedaActivaModo(modo) {
  return (modo === "basico" ? currencySelectBasico?.value : currencySelect?.value) || "CLP";
}

function monedaCoincideConPreset(preset, modo) {
  const monedaPreset = String(preset?.monedaBase || preset?.monedaCompra || MONEDA_BASE_PRESETS).toUpperCase();
  const monedaActiva = String(obtenerMonedaActivaModo(modo)).toUpperCase();
  return monedaPreset === monedaActiva;
}

function aplicarValorMonetarioPreset(id, valor, preset, modo, opciones = {}) {
  const campo = obtenerElemento(id);

  if (!campo || !monedaCoincideConPreset(preset, modo)) {
    return false;
  }

  if (opciones.soloSiVacio && tieneValor(id)) {
    return false;
  }

  campo.value = valor ?? "";
  campo.dispatchEvent(new Event("input", { bubbles: true }));
  return true;
}

function mostrarAvisoPresetMoneda(modo, mensaje) {
  const ayuda = modo === "basico" ? costoUnidadHelpBasico : costoUnidadHelpAvanzado;

  if (!ayuda) {
    return;
  }

  ayuda.textContent = mensaje;
  ayuda.classList.add("warning-text");
}

// Formatea un numero con la moneda seleccionada, sin convertir valores.
function formatearMoneda(valor, codigoMoneda = obtenerCodigoMonedaActivo(), incluirCodigo = false) {
  const moneda = obtenerMonedaSeleccionada(codigoMoneda);

  if (!moneda) {
    return String(valor);
  }

  const texto = window.formatearMonedaPrecio3D(valor, moneda.codigo, moneda.locale);
  return incluirCodigo ? `${moneda.codigo} ${texto}` : texto;
}

function formatearPorcentaje(valor) {
  return `${((Number(valor) || 0) * 100).toFixed(1)}%`;
}

function formatearCantidadFisica(valor, unidad) {
  const numero = Number(valor) || 0;
  const decimales = Number.isInteger(numero) ? 0 : 2;
  return `${numero.toLocaleString("es-CL", {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimales
  })} ${unidad}`;
}

function formatearHorasTotales(horas) {
  const totalMinutos = Math.max(0, Math.round((Number(horas) || 0) * 60));
  const horasEnteras = Math.floor(totalMinutos / 60);
  const minutos = totalMinutos % 60;

  if (horasEnteras && minutos) {
    return `${horasEnteras} h ${minutos} min`;
  }

  if (horasEnteras) {
    return `${horasEnteras} h`;
  }

  return `${minutos} min`;
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
    usandoKilo && (valorVacio || valorCero) ? ` ${textoInterfaz("precioKiloMayorCero")}` : "";

  config.etiqueta.textContent = usandoKilo ? textoInterfaz("precioPorKiloFilamento") : textoInterfaz("costoPorGramo");
  config.ayuda.textContent = usandoKilo
    ? `${textoInterfaz("ayudaPrecioKilo")} ${textoInterfaz("costoPorGramoCalculado")}: ${formatearMoneda(costoPorGramo)}.${advertenciaKilo}`
    : `${textoInterfaz("costoPorGramoCalculado")}: ${formatearMoneda(costoPorGramo)}.`;
  config.ayuda.classList.toggle("warning-text", Boolean(advertenciaKilo));
}

function cambiarModoCostoMaterial(tipo, usarKilo) {
  const config = obtenerConfigCostoMaterial(tipo);
  const costoPorGramo = leerCostoMaterialPorGramo(tipo);

  config.botonGramo.classList.toggle("active", !usarKilo);
  config.botonKilo.classList.toggle("active", usarKilo);
  config.botonGramo.setAttribute("aria-pressed", String(!usarKilo));
  config.botonKilo.setAttribute("aria-pressed", String(usarKilo));
  escribirCostoMaterialDesdeGramo(tipo, costoPorGramo);
  programarGuardadoConfiguracion();
}

// Actualiza las vistas previas del formato monetario.
function actualizarVistaPreviaMoneda() {
  const texto = textoInterfaz("formatoEjemploMoneda", { valor: formatearMoneda(123456) });

  if (currencyFormatPreview) {
    currencyFormatPreview.textContent = texto;
  }

  if (currencyFormatPreviewBasico) {
    currencyFormatPreviewBasico.textContent = texto;
  }

  actualizarAyudaCostoMaterial("basico");
  actualizarAyudaCostoMaterial("avanzado");
}

function sincronizarMonedas(origen, opciones = {}) {
  const valor = origen.value;
  const anterior = monedaActualConfirmada || obtenerCodigoMonedaActivo() || "CLP";

  if (opciones.manual && !opciones.forzar) {
    solicitarCambioMoneda(anterior, valor, origen);
    return;
  }

  aplicarCambioMonedaConfirmado(valor, {
    manual: Boolean(opciones.manual),
    limpiarValores: Boolean(opciones.limpiarValores),
    conservarValores: Boolean(opciones.conservarValores),
    restauracionCoherente: Boolean(opciones.restauracionCoherente)
  });
}

function actualizarEstadoDeteccionMoneda(texto) {
  [currencyDetectionStatus, currencyDetectionStatusBasico].forEach((elemento) => {
    if (elemento) elemento.textContent = texto;
  });
}

function refrescarTextoEstadoMoneda() {
  if (hayMonedaGuardada) {
    actualizarEstadoDeteccionMoneda(
      textoInterfaz("monedaGuardadaCambiable", { moneda: currencySelectBasico.value || currencySelect.value })
    );
    return;
  }

  if (!ultimaDeteccionMoneda?.currency) {
    return;
  }

  const clave = monedaSeleccionadaManualmente
    ? "monedaDetectadaManualPrioridad"
    : "monedaDetectadaCambiable";

  actualizarEstadoDeteccionMoneda(
    textoInterfaz(clave, {
      pais: ultimaDeteccionMoneda.countryName,
      moneda: ultimaDeteccionMoneda.currency
    })
  );
}

function aplicarDeteccionMoneda(deteccion, permitirReemplazoManual = false) {
  if (!deteccion?.currency || !window.obtenerMonedaPrecio3D?.(deteccion.currency)) {
    actualizarEstadoDeteccionMoneda(textoInterfaz("noFuePosibleDetectarMoneda"));
    return false;
  }

  ultimaDeteccionMoneda = deteccion;

  if (monedaSeleccionadaManualmente && !permitirReemplazoManual) {
    actualizarEstadoDeteccionMoneda(
      textoInterfaz("monedaDetectadaManualPrioridad", {
        pais: deteccion.countryName,
        moneda: deteccion.currency
      })
    );
    return false;
  }

  currencySelect.value = deteccion.currency;
  currencySelectBasico.value = deteccion.currency;
  sincronizarMonedas(currencySelect, { manual: false });
  actualizarEstadoDeteccionMoneda(
    textoInterfaz("monedaDetectadaCambiable", {
      pais: deteccion.countryName,
      moneda: deteccion.currency
    })
  );
  return true;
}

async function inicializarDeteccionMoneda() {
  if (!window.GeolocalizacionPrecio3D) return;

  if (hayMonedaGuardada) {
    actualizarEstadoDeteccionMoneda(
      textoInterfaz("monedaGuardadaCambiable", { moneda: currencySelectBasico.value || currencySelect.value })
    );
    return;
  }

  actualizarEstadoDeteccionMoneda(textoInterfaz("detectandoMoneda"));
  const deteccion = await window.GeolocalizacionPrecio3D.detectarMonedaAutomatica();
  aplicarDeteccionMoneda(deteccion);
}

async function detectarMonedaNuevamente() {
  let permitirReemplazoManual = false;

  if (monedaSeleccionadaManualmente) {
    permitirReemplazoManual = confirm(
      textoInterfaz("reemplazarMonedaManual")
    );
    if (!permitirReemplazoManual) return;
  }

  actualizarEstadoDeteccionMoneda(textoInterfaz("detectandoMoneda"));
  window.GeolocalizacionPrecio3D?.borrarDeteccionGuardada?.();
  const deteccion = await window.GeolocalizacionPrecio3D?.detectarMonedaAutomatica?.({ forzar: true });

  if (aplicarDeteccionMoneda(deteccion, permitirReemplazoManual)) {
    monedaSeleccionadaManualmente = false;
    hayMonedaGuardada = false;
    guardarConfiguracionActual(false);
  }
}

function sincronizarIdiomas(origen) {
  const valor = origen.value;
  const monedaActual = obtenerCodigoMonedaActivo();

  if (languageSelect && languageSelect !== origen) {
    languageSelect.value = valor;
  }

  if (languageSelectBasico && languageSelectBasico !== origen) {
    languageSelectBasico.value = valor;
  }

  window.cambiarIdioma(valor);
  cargarMonedas();
  asignarValorCampo("currencySelect", monedaActual);
  asignarValorCampo("currencySelectBasico", monedaActual);
  refrescarTextoEstadoMoneda();
  actualizarEtiquetasAlcanceSlicer("basico");
  actualizarEtiquetasAlcanceSlicer("avanzado");
  cambiarModo(modoActual);
  renderizarSupuestosBasicos(ultimosSupuestosBasicos);

  if (ultimoResultadoBasico) {
    renderizarResultadoBasico(ultimoResultadoBasico, ultimoFeeEstimadoBasico);
  }

  if (ultimoDatosCalculo && ultimoResultadoCalculo) {
    const feeEstimado = calcularFeeEstimado(ultimoResultadoCalculo);
    renderizarResultado(ultimoResultadoCalculo, feeEstimado, resultBox, null, {
      margenObjetivo: ultimoDatosCalculo.margen,
      nombreTrabajo: ultimoDatosCalculo.nombreTrabajo,
      cantidadProductos: ultimoDatosCalculo.cantidadProductos
    });
    renderizarComparadorCanales(ultimoDatosCalculo, ultimoResultadoCalculo);
    renderizarPreciosPorNivel(ultimoDatosCalculo);
  }

  renderizarTrabajos();
  renderizarUltimoCalculoGuardado();
  actualizarVistaCotizacionSiExiste();
}

function cambiarModo(modo) {
  modoActual = modo;
  const esBasico = modo === "basico";

  seccionModoBasico.hidden = !esBasico;
  seccionModoAvanzado.hidden = esBasico;
  btnModoBasico.setAttribute("aria-pressed", String(esBasico));
  btnModoAvanzado.setAttribute("aria-pressed", String(!esBasico));
  const descripcionModo = document.querySelector(".mode-description");
  if (descripcionModo) {
    descripcionModo.textContent = esBasico
      ? textoInterfaz("modoBasicoDescripcion")
      : textoInterfaz("modoAvanzadoDescripcion");
  }
  sincronizarVisibilidadPanelesResultado();
  actualizarVistaPreviaMoneda();
  programarGuardadoConfiguracion();
}

function sincronizarDesplegablesBasicos({ reiniciar = false } = {}) {
  if (reiniciar) {
    if (costosAdicionalesBasico) costosAdicionalesBasico.open = false;
    if (ventaConfiguracionBasico) ventaConfiguracionBasico.open = false;
    return;
  }

  const tieneNumeroPersonalizado = (id) => {
    const valor = document.querySelector(`#${id}`)?.value;
    return valor !== undefined && valor !== "" && Number(valor) !== 0;
  };
  const costosConValor = [
    "pesoSoportesPurgaBasico",
    "embalajeBasico",
    "envioBasico",
    "impuestoBasico"
  ].some(tieneNumeroPersonalizado);
  const materialSeleccionado = obtenerPorId(obtenerPresets()?.materiales, materialBasico?.value);
  const mermaPredeterminada = (Number(materialSeleccionado?.mermaSugerida) || 0) * 100;
  const mermaActual = Number(document.querySelector("#mermaBasico")?.value) || 0;
  const ventaPersonalizada =
    (currencySelectBasico?.value && currencySelectBasico.value !== "CLP") ||
    (languageSelectBasico?.value && languageSelectBasico.value !== "es") ||
    (impresoraBasico?.value && impresoraBasico.value !== "manual") ||
    Math.abs(mermaActual - mermaPredeterminada) > 0.01 ||
    (canalVentaBasico?.selectedIndex ?? 0) > 0 ||
    tieneNumeroPersonalizado("feePorcentualBasico") ||
    tieneNumeroPersonalizado("feeFijoBasico") ||
    document.querySelector("#tipoGananciaBasico")?.value === "margen" ||
    document.querySelector("#alcanceDatosSlicerBasico")?.value === "lote";

  if (costosAdicionalesBasico) costosAdicionalesBasico.open = costosConValor;
  if (ventaConfiguracionBasico) ventaConfiguracionBasico.open = Boolean(ventaPersonalizada);
}

function ubicarCostosInternosEnModoBasico() {
  const destino = document.querySelector(".basic-internal-costs");
  const filaControl = toggleSupuestosEditables?.closest(".collapse-row");
  const panelConfiguracionAnterior = panelSupuestosEditables?.closest(".settings-panel");

  if (!destino || !filaControl || !panelSupuestosEditables) {
    return;
  }

  destino.append(filaControl, panelSupuestosEditables);

  if (
    panelConfiguracionAnterior &&
    !panelConfiguracionAnterior.querySelector("input, select, textarea, button, details")
  ) {
    panelConfiguracionAnterior.remove();
  }
}

function sincronizarVisibilidadPanelesResultado() {
  const resultadoValido = Boolean(
    ultimoResultadoCalculo && ultimoResultadoCalculo.precioNeto !== null
  );
  const esBasico = modoActual === "basico";
  const panelBasico = document.querySelector(".basic-result-panel");
  const panelAvanzado = document.querySelector("#result")?.closest(".panel");
  const panelSupuestos = document.querySelector(".assumptions-panel");

  panelBasico?.toggleAttribute("hidden", !esBasico);
  panelAvanzado?.toggleAttribute("hidden", esBasico);
  panelSupuestos?.toggleAttribute("hidden", !esBasico || !resultadoValido);

  document
    .querySelectorAll(".price-levels-panel, .comparator-panel, .result-workflow-panel")
    .forEach((panel) => panel.toggleAttribute("hidden", !resultadoValido));

  panelBasico
    ?.querySelector(":scope > details")
    ?.toggleAttribute("hidden", !resultadoValido);
  panelAvanzado
    ?.querySelectorAll(":scope > .actions, :scope > .help-text")
    .forEach((elemento) => elemento.toggleAttribute("hidden", !resultadoValido));

  if (!resultadoValido) {
    if (resultBasico) resultBasico.textContent = textoInterfaz("resultadoVacio");
    if (resultBox) resultBox.textContent = textoInterfaz("resultadoVacio");
  }
}

function alternarSupuestosEditables() {
  const estaAbierto = toggleSupuestosEditables.getAttribute("aria-expanded") === "true";
  const indicador = toggleSupuestosEditables.querySelector(".collapse-indicator");

  toggleSupuestosEditables.setAttribute("aria-expanded", String(!estaAbierto));
  panelSupuestosEditables.hidden = estaAbierto;
  indicador.textContent = estaAbierto ? textoInterfaz("mostrar") : textoInterfaz("ocultar");
}

function obtenerControlesFilamento(modo) {
  const esBasico = modo === "basico";
  return {
    selector: esBasico ? filamentoBasico : filamentoAvanzado,
    resumen: esBasico ? filamentoResumenBasico : filamentoResumenAvanzado,
    acciones: (esBasico ? filamentoResumenBasico : filamentoResumenAvanzado)?.nextElementSibling,
    botonMoneda: esBasico ? cambiarMonedaFilamentoBasico : cambiarMonedaFilamentoAvanzado,
    botonCostoActual: esBasico ? usarCostoActualFilamentoBasico : usarCostoActualFilamentoAvanzado,
    botonManual: esBasico ? usarCostoManualBasico : usarCostoManualAvanzado,
    moneda: esBasico ? currencySelectBasico : currencySelect,
    material: esBasico ? materialBasico : materialAvanzado
  };
}

function obtenerBobinasDisponibles() {
  return (window.FilamentosPrecio3D?.obtenerBobinas?.() || []).filter((bobina) =>
    ["Sellada", "En uso"].includes(bobina.estado) && Number(bobina.pesoRestanteGramos) > 0
  );
}

function textoOpcionBobina(bobina) {
  const costo = window.FilamentosPrecio3D?.calcularCostoPorGramo?.(bobina) || Number(bobina.costoPorGramo) || 0;
  const identidad = [bobina.materialNombre, bobina.marca, bobina.colorNombre].filter(Boolean).join(" · ");
  return `${identidad || bobina.nombre || "Bobina"} — ${Number(bobina.pesoRestanteGramos) || 0} g — ${costo.toLocaleString("es-CL", { maximumFractionDigits: 4 })} ${bobina.monedaCompra || "CLP"}/g`;
}

function cargarSelectoresFilamentos() {
  ["basico", "avanzado"].forEach((modo) => {
    const { selector } = obtenerControlesFilamento(modo);
    if (!selector) return;
    const valorActual = selector.value;
    selector.innerHTML = "";
    selector.add(new Option("Sin bobina / costo manual", ""));
    obtenerBobinasDisponibles().forEach((bobina) => selector.add(new Option(textoOpcionBobina(bobina), bobina.id)));
    if (filamentoTrabajoCargadoId && !Array.from(selector.options).some((opcion) => opcion.value === filamentoTrabajoCargadoId)) {
      const nombre = filamentoTrabajoCargado?.nombre || filamentoTrabajoCargado?.materialNombre || "Bobina histórica";
      selector.add(new Option(`${nombre} — referencia histórica no disponible`, filamentoTrabajoCargadoId));
    }
    selector.value = Array.from(selector.options).some((opcion) => opcion.value === valorActual)
      ? valorActual
      : filamentoTrabajoCargadoId || "";
  });
  actualizarResumenFilamento("basico");
  actualizarResumenFilamento("avanzado");
}

function obtenerFuenteFilamento(modo) {
  const { selector } = obtenerControlesFilamento(modo);
  const id = selector?.value || "";
  if (!id) return null;
  if (id === filamentoTrabajoCargadoId && filamentoTrabajoCargado) {
    return { id, bobina: window.FilamentosPrecio3D?.obtenerBobinaPorId?.(id) || null, snapshot: filamentoTrabajoCargado };
  }
  const bobina = window.FilamentosPrecio3D?.obtenerBobinaPorId?.(id) || null;
  return bobina ? { id, bobina, snapshot: null } : null;
}

function estimarConsumoFilamento(modo) {
  const esBasico = modo === "basico";
  const sufijo = esBasico ? "Basico" : "Avanzado";
  const cantidad = Math.max(1, leerNumero(`cantidad${sufijo}`) || 1);
  const alcanceDatosSlicer = leerAlcanceDatosSlicer(`alcanceDatosSlicer${sufijo}`);
  const factorCantidadSlicer = obtenerFactorCantidadSlicer(alcanceDatosSlicer, cantidad);
  const peso =
    (leerNumero(`pesoPieza${sufijo}`) + leerNumero(`pesoSoportesPurga${sufijo}`)) *
    factorCantidadSlicer;
  let merma = 0;
  if (esBasico) {
    merma = leerPorcentaje("mermaBasico");
  } else {
    const material = obtenerPorId(obtenerPresets()?.materiales, materialAvanzado?.value);
    merma = Number(material?.mermaSugerida) || Number(obtenerPresets()?.supuestosBasicos?.merma) || 0;
  }
  return peso * (1 + merma);
}

function actualizarResumenFilamento(modo) {
  const controles = obtenerControlesFilamento(modo);
  const fuente = obtenerFuenteFilamento(modo);
  if (!controles.resumen) return;
  if (!fuente) {
    controles.resumen.classList.remove("warning-text");
    controles.resumen.textContent = textoInterfaz("filamentoSeleccionaBobina");
    if (controles.acciones) controles.acciones.hidden = true;
    return;
  }

  const referencia = fuente.snapshot || fuente.bobina;
  const monedaBobina = String(referencia.monedaCompra || "CLP").toUpperCase();
  const monedaCalculo = String(controles.moneda?.value || "CLP").toUpperCase();
  const costoActual = fuente.snapshot
    ? Number(fuente.snapshot.costoPorGramoUsado ?? fuente.snapshot.costoPorGramo) || 0
    : window.FilamentosPrecio3D?.calcularCostoPorGramo?.(fuente.bobina) || 0;
  const consumo = estimarConsumoFilamento(modo);
  const stock = Number(fuente.bobina?.pesoRestanteGramos ?? referencia.pesoDisponibleAlCalcular ?? referencia.pesoRestanteAlCalcular) || 0;

  if (monedaBobina !== monedaCalculo) {
    controles.resumen.classList.add("warning-text");
    controles.resumen.textContent = textoInterfaz("filamentoMonedaIncompatible", { monedaBobina, monedaCalculo });
    if (controles.botonMoneda) controles.botonMoneda.hidden = false;
    if (controles.botonCostoActual) controles.botonCostoActual.hidden = true;
    if (controles.botonManual) controles.botonManual.hidden = false;
    if (controles.acciones) controles.acciones.hidden = false;
    return;
  }

  const stockInsuficiente = Boolean(fuente.bobina && consumo > stock);
  const stockBajo = Boolean(fuente.bobina && window.FilamentosPrecio3D?.tieneStockBajo?.(fuente.bobina));
  controles.resumen.classList.toggle("warning-text", stockInsuficiente || stockBajo);
  const avisoStock = stockInsuficiente
    ? ` ${textoInterfaz("stockInsuficiente")}`
    : fuente.bobina ? ` ${textoInterfaz("stockSuficiente")}` : ` ${textoInterfaz("bobinaNoDisponible")}`;
  const avisoStockBajo = stockBajo ? ` ${textoInterfaz("stockBajo")}.` : "";
  const costoVigente = fuente.snapshot && fuente.bobina
    ? window.FilamentosPrecio3D?.calcularCostoPorGramo?.(fuente.bobina) || 0
    : costoActual;
  const diferenciaCosto = fuente.snapshot && fuente.bobina && Math.abs(costoVigente - costoActual) > 0.000001
    ? ` ${textoInterfaz("costoVigente")}: ${costoVigente.toLocaleString("es-CL", { maximumFractionDigits: 4 })} ${monedaBobina}/g; ${textoInterfaz("mantenerCostoHistorico").toLowerCase()}.`
    : "";
  const stockMinimo = Number(fuente.bobina?.stockMinimoGramos ?? referencia.stockMinimoGramos) || 0;
  const estado = fuente.bobina?.estado || referencia.estadoAlCalcular || textoInterfaz("noDisponible");
  controles.resumen.textContent = `${referencia.materialNombre || referencia.nombre || textoInterfaz("bobinaInventario")}${referencia.colorNombre ? ` ${referencia.colorNombre}` : ""}${referencia.marca ? ` · ${referencia.marca}` : ""}. ${textoInterfaz("costoDesdeInventario")}: ${costoActual.toLocaleString("es-CL", { maximumFractionDigits: 4 })} ${monedaBobina}/g. ${textoInterfaz("stockDisponible")}: ${stock.toLocaleString("es-CL", { maximumFractionDigits: 2 })} g. ${textoInterfaz("stockMinimo")}: ${stockMinimo.toLocaleString("es-CL")} g. ${textoInterfaz("estado")}: ${estado}. ${textoInterfaz("consumoEstimado")}: ${consumo.toLocaleString("es-CL", { maximumFractionDigits: 2 })} g.${diferenciaCosto}${avisoStock}${avisoStockBajo}`;
  if (controles.botonMoneda) controles.botonMoneda.hidden = true;
  if (controles.botonCostoActual) controles.botonCostoActual.hidden = !diferenciaCosto;
  if (controles.botonManual) controles.botonManual.hidden = !diferenciaCosto;
  if (controles.acciones) controles.acciones.hidden = !diferenciaCosto;
}

function aplicarFilamentoSeleccionado(modo) {
  const controles = obtenerControlesFilamento(modo);
  const fuente = obtenerFuenteFilamento(modo);
  if (!fuente) {
    filamentoTrabajoCargado = null;
    filamentoTrabajoCargadoId = "";
    actualizarResumenFilamento(modo);
    return;
  }
  if (fuente.id !== filamentoTrabajoCargadoId) {
    filamentoTrabajoCargado = null;
    filamentoTrabajoCargadoId = "";
  }
  const referencia = fuente.snapshot || fuente.bobina;
  if (String(referencia.monedaCompra || "CLP").toUpperCase() !== String(controles.moneda?.value || "CLP").toUpperCase()) {
    actualizarResumenFilamento(modo);
    return;
  }
  const costo = fuente.snapshot
    ? Number(fuente.snapshot.costoPorGramoUsado ?? fuente.snapshot.costoPorGramo) || 0
    : window.FilamentosPrecio3D?.calcularCostoPorGramo?.(fuente.bobina) || 0;
  const materialId = referencia.materialId || "";
  if (materialId && Array.from(controles.material?.options || []).some((opcion) => opcion.value === materialId)) {
    controles.material.value = materialId;
  } else if (referencia.materialNombre) {
    asignarSelectPorTexto(controles.material?.id, referencia.materialNombre);
  }
  cambiarModoCostoMaterial(modo, false);
  escribirCostoMaterialDesdeGramo(modo, costo);
  actualizarResumenFilamento(modo);
}

function usarCostoManualFilamento(modo) {
  const { selector } = obtenerControlesFilamento(modo);
  if (selector) selector.value = "";
  filamentoTrabajoCargado = null;
  filamentoTrabajoCargadoId = "";
  actualizarResumenFilamento(modo);
}

function usarMonedaDeFilamento(modo) {
  const controles = obtenerControlesFilamento(modo);
  const fuente = obtenerFuenteFilamento(modo);
  const moneda = String((fuente?.snapshot || fuente?.bobina)?.monedaCompra || "").toUpperCase();
  if (!moneda || !controles.moneda) return;
  controles.moneda.value = moneda;
  sincronizarMonedas(controles.moneda, { manual: true });
  aplicarFilamentoSeleccionado(modo);
}

function usarCostoActualFilamento(modo) {
  const { selector } = obtenerControlesFilamento(modo);
  const id = selector?.value || "";
  const bobina = window.FilamentosPrecio3D?.obtenerBobinaPorId?.(id);
  if (!bobina) return;
  filamentoTrabajoCargado = null;
  filamentoTrabajoCargadoId = "";
  cambiarModoCostoMaterial(modo, false);
  escribirCostoMaterialDesdeGramo(modo, window.FilamentosPrecio3D.calcularCostoPorGramo(bobina));
  actualizarResumenFilamento(modo);
}

function crearSnapshotFilamento(modo, costoPorGramoUsado) {
  const fuente = obtenerFuenteFilamento(modo);
  if (!fuente) return null;
  const referencia = fuente.snapshot || fuente.bobina;
  const monedaCalculo = String(obtenerControlesFilamento(modo).moneda?.value || "CLP").toUpperCase();
  if (String(referencia.monedaCompra || "CLP").toUpperCase() !== monedaCalculo) return null;
  return {
    id: fuente.id,
    nombre: referencia.nombre || "",
    marca: referencia.marca || "",
    materialId: referencia.materialId || "",
    materialNombre: referencia.materialNombre || "",
    varianteMaterial: referencia.varianteMaterial || "",
    colorNombre: referencia.colorNombre || "",
    diametroMm: referencia.diametroMm || "",
    monedaCompra: referencia.monedaCompra || monedaCalculo,
    costoPorGramo: Number(costoPorGramoUsado) || 0,
    costoPorGramoUsado: Number(costoPorGramoUsado) || 0,
    pesoDisponibleAlCalcular: Number(fuente.bobina?.pesoRestanteGramos ?? referencia.pesoDisponibleAlCalcular ?? referencia.pesoRestanteAlCalcular) || 0,
    pesoRestanteAlCalcular: Number(fuente.bobina?.pesoRestanteGramos ?? referencia.pesoRestanteAlCalcular ?? referencia.pesoDisponibleAlCalcular) || 0,
    stockMinimoGramos: Number(fuente.bobina?.stockMinimoGramos ?? referencia.stockMinimoGramos) || 0,
    consumoEstimadoGramos: estimarConsumoFilamento(modo),
    estadoAlCalcular: fuente.bobina?.estado || referencia.estadoAlCalcular || "No disponible",
    fechaSnapshot: new Date().toISOString()
  };
}

function aplicarMaterialBasico() {
  const presets = obtenerPresets();
  const material = obtenerPorId(presets?.materiales, materialBasico.value);

  if (!material) {
    return;
  }

  if (monedaCoincideConPreset(material, "basico")) {
    escribirCostoMaterialDesdeGramo("basico", material.costoUnidad);
  } else {
    actualizarAyudaCostoMaterial("basico");
    mostrarAvisoPresetMoneda(
      "basico",
      textoInterfaz("precioReferencialOtraMoneda", {
        monedaBase: material.monedaBase || MONEDA_BASE_PRESETS,
        monedaActual: obtenerMonedaActivaModo("basico")
      })
    );
  }
  document.querySelector("#mermaBasico").value = (Number(material.mermaSugerida) * 100).toFixed(1);
  ultimosSupuestosBasicos = obtenerSupuestosBasicos();
  renderizarSupuestosBasicos(ultimosSupuestosBasicos);
  actualizarResumenFilamento("basico");
}

function aplicarImpresoraBasico() {
  const presets = obtenerPresets();
  const base = presets?.supuestosBasicos;
  const impresora = obtenerPerfilImpresora(impresoraBasico);
  registrarSeleccionImpresora("basico", impresoraBasico);

  if (!base) {
    return;
  }

  if (!impresora) {
    impresoraTrabajoCargada = null;
    impresoraTrabajoCargadaId = "";
    if (impresoraPerfilNotaBasico) impresoraPerfilNotaBasico.textContent = impresoraBasico.value === "ninguna"
      ? textoInterfaz("sinImpresoraValoresVisibles")
      : textoInterfaz("valoresManualesCotizacion");
    if (actualizarPerfilBasico) actualizarPerfilBasico.hidden = true;
    actualizarAdvertenciaCostoImpresora("basico");
    return;
  }

  impresoraTrabajoCargada = null;
  impresoraTrabajoCargadaId = "";
  document.querySelector("#wattsPromedioBasico").value = impresora.potenciaPromedioWatts;
  aplicarValorMonetarioPreset("tarifaKwhBasico", base.tarifaKwh, base, "basico", { soloSiVacio: true });
  aplicarValorMonetarioPreset("costoHerramientasBasico", impresora.costoHerramientas, impresora, "basico", {
    soloSiVacio: true
  });
  document.querySelector("#anosVidaBasico").value = impresora.anosVidaUtil;
  document.querySelector("#diasOperativosAnoBasico").value = impresora.diasOperativosAno;
  document.querySelector("#horasProductivasDiaBasico").value = impresora.horasProductivasDia;
  document.querySelector("#mantenimientoBasico").value = (Number(impresora.porcentajeMantenimiento) * 100).toFixed(1);
  if (impresoraPerfilNotaBasico) {
    const mensajeBase = textoInterfaz("parametrosTecnicosImpresora", {
      impresora: nombreImpresoraTrabajo
    });
    impresoraPerfilNotaBasico.textContent = monedaCoincideConPreset(impresora, "basico")
      ? mensajeBase
      : `${mensajeBase} ${textoInterfaz("herramientasReferencialesOtraMoneda", {
          monedaBase: impresora.monedaBase || impresora.monedaCompra || MONEDA_BASE_PRESETS,
          monedaActual: obtenerMonedaActivaModo("basico")
        })}`;
  }
  if (actualizarPerfilBasico) actualizarPerfilBasico.hidden = false;
  actualizarAdvertenciaCostoImpresora("basico");
  ultimosSupuestosBasicos = obtenerSupuestosBasicos();
  renderizarSupuestosBasicos(ultimosSupuestosBasicos);
}

function aplicarCanalBasico() {
  const presets = obtenerPresets();
  const canal = obtenerPorId(presets?.canalesVenta, canalVentaBasico.value);

  if (!canal) {
    return;
  }

  aplicarValorMonetarioPreset("feeFijoBasico", canal.feeFijo, canal, "basico", { soloSiVacio: true });
  document.querySelector("#feePorcentualBasico").value = (Number(canal.feePorcentaje) * 100).toFixed(1);
  baseComisionCanalBasicoActual = normalizarBaseComision(canal.baseComision);
  baseComisionPagoBasicoActual = "precioNeto";
}

function aplicarMaterialAvanzado() {
  const presets = obtenerPresets();
  const material = obtenerPorId(presets?.materiales, materialAvanzado.value);

  if (material && monedaCoincideConPreset(material, "avanzado")) {
    escribirCostoMaterialDesdeGramo("avanzado", material.costoUnidad);
  } else if (material) {
    actualizarAyudaCostoMaterial("avanzado");
    mostrarAvisoPresetMoneda(
      "avanzado",
      textoInterfaz("precioReferencialOtraMoneda", {
        monedaBase: material.monedaBase || MONEDA_BASE_PRESETS,
        monedaActual: obtenerMonedaActivaModo("avanzado")
      })
    );
  }
  actualizarResumenFilamento("avanzado");
}

function aplicarImpresoraAvanzado() {
  const impresora = obtenerPerfilImpresora(impresoraAvanzado);
  registrarSeleccionImpresora("avanzado", impresoraAvanzado);

  if (!impresora) {
    impresoraTrabajoCargada = null;
    impresoraTrabajoCargadaId = "";
    if (impresoraPerfilNotaAvanzado) impresoraPerfilNotaAvanzado.textContent = textoInterfaz("valoresManualesCotizacion");
    if (actualizarPerfilAvanzado) actualizarPerfilAvanzado.hidden = true;
    actualizarAdvertenciaCostoImpresora("avanzado");
    return;
  }

  impresoraTrabajoCargada = null;
  impresoraTrabajoCargadaId = "";
  document.querySelector("#wattsPromedioAvanzado").value = impresora.potenciaPromedioWatts;
  aplicarValorMonetarioPreset("costoHerramientasAvanzado", impresora.costoHerramientas, impresora, "avanzado", {
    soloSiVacio: true
  });
  document.querySelector("#anosVidaAvanzado").value = impresora.anosVidaUtil;
  document.querySelector("#diasOperativosAnoAvanzado").value = impresora.diasOperativosAno;
  document.querySelector("#horasProductivasDiaAvanzado").value = impresora.horasProductivasDia;
  document.querySelector("#mantenimientoAvanzado").value = (Number(impresora.porcentajeMantenimiento) * 100).toFixed(1);
  if (impresoraPerfilNotaAvanzado) {
    const mensajeBase = textoInterfaz("parametrosTecnicosImpresora", {
      impresora: nombreImpresoraTrabajo
    });
    impresoraPerfilNotaAvanzado.textContent = monedaCoincideConPreset(impresora, "avanzado")
      ? mensajeBase
      : `${mensajeBase} ${textoInterfaz("herramientasReferencialesOtraMoneda", {
          monedaBase: impresora.monedaBase || impresora.monedaCompra || MONEDA_BASE_PRESETS,
          monedaActual: obtenerMonedaActivaModo("avanzado")
        })}`;
  }
  if (actualizarPerfilAvanzado) actualizarPerfilAvanzado.hidden = false;
  actualizarAdvertenciaCostoImpresora("avanzado");
}

function aplicarCanalAvanzado() {
  const presets = obtenerPresets();
  const canal = obtenerPorId(presets?.canalesVenta, canalVentaAvanzado.value);

  if (!canal) {
    return;
  }

  document.querySelector("#feeMarketplaceAvanzado").value = (Number(canal.feePorcentaje) * 100).toFixed(1);
  asignarValorCampo("baseComisionCanalAvanzado", normalizarBaseComision(canal.baseComision));
}

function aplicarMetodoPagoAvanzado() {
  const presets = obtenerPresets();
  const metodo = obtenerPorId(presets?.metodosPago, metodoPagoComparador?.value);

  if (!metodo || metodoPagoComparador?.value === "automatico") {
    asignarValorCampo("baseComisionPagoAvanzado", "precioNeto");
    return;
  }

  asignarValorCampo("baseComisionPagoAvanzado", normalizarBaseComision(metodo.baseComision));
}

// Los supuestos base vienen desde js/presets.js.
function obtenerSupuestosBasicos() {
  const presets = obtenerPresets();

  if (!presets) {
    return null;
  }

  const impresora = obtenerPorId(presets.impresoras, impresoraBasico.value);
  const supuestos = { ...presets.supuestosBasicos };
  const monedaCoincideSupuestos = monedaCoincideConPreset(supuestos, "basico");

  if (!monedaCoincideSupuestos) {
    supuestos.tarifaKwh = 0;
    supuestos.costoHerramientas = 0;
    supuestos.seguro = 0;
    supuestos.aduanas = 0;
    supuestos.marketing = 0;
    supuestos.otrosCostos = 0;
  }

  if (impresora) {
    supuestos.wattsPromedio = Number(impresora.wattsPromedio) || supuestos.wattsPromedio;
    if (monedaCoincideConPreset(impresora, "basico")) {
      supuestos.costoHerramientas =
        Number(impresora.costoHerramientas) || supuestos.costoHerramientas;
    }
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
  actualizarAdvertenciaCostoImpresora("basico");
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
  const alcanceDatosSlicer = leerAlcanceDatosSlicer("alcanceDatosSlicerBasico");
  const factorCantidadSlicer = obtenerFactorCantidadSlicer(alcanceDatosSlicer, cantidad);
  const manoObraTotal = leerNumero("manoObraSimpleBasico") * cantidad;
  const omitirAmortizacionImpresora = Boolean(document.querySelector("#omitirAmortizacionBasico")?.checked);
  const perfilImpresora = obtenerPerfilImpresora(impresoraBasico);
  const canal = obtenerPorId(obtenerPresets()?.canalesVenta, canalVentaBasico.value);
  const costoUnidad = leerCostoMaterialPorGramo("basico");
  const filamentoSnapshot = crearSnapshotFilamento("basico", costoUnidad);
  const supuestosUsados = omitirAmortizacionImpresora
    ? { ...supuestos, costoImpresora: 0, costoHerramientas: 0, mantenimiento: 0, omitirAmortizacionImpresora: true }
    : { ...supuestos, omitirAmortizacionImpresora: false };

  return {
    datos: {
      nombreTrabajo: obtenerNombreTrabajo("nombreTrabajoBasico"),
      impresoraId: perfilImpresora?.id || impresoraTrabajoCargadaId || null,
      impresoraSnapshot: crearSnapshotImpresora(perfilImpresora, "basico"),
      filamentoId: filamentoSnapshot?.id || "",
      filamentoSnapshot,
      cliente: "",
      cantidadProductos: cantidad,
      material: textoSeleccionado("materialBasico"),
      canalVenta: textoSeleccionado("canalVentaBasico"),
      metodoPago: textoSeleccionado("metodoPagoComparador"),
      moneda: currencySelectBasico?.value || "CLP",
      alcanceDatosSlicer,
      pesoPieza: leerNumero("pesoPiezaBasico") * factorCantidadSlicer,
      pesoSoportesPurga: leerNumero("pesoSoportesPurgaBasico") * factorCantidadSlicer,
      costoUnidad,
      merma: supuestos.merma,
      horasImpresion:
        leerHorasYMinutos("horasImpresionHorasBasico", "horasImpresionMinutosBasico") *
        factorCantidadSlicer,
      wattsPromedio: supuestos.wattsPromedio,
      tarifaKwh: supuestos.tarifaKwh,
      costoImpresora: omitirAmortizacionImpresora ? 0 : supuestos.costoImpresora,
      costoHerramientas: omitirAmortizacionImpresora ? 0 : supuestos.costoHerramientas,
      mantenimiento: omitirAmortizacionImpresora ? 0 : supuestos.mantenimiento,
      omitirAmortizacionImpresora,
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
      tipoGanancia: leerTipoGanancia("tipoGananciaBasico"),
      margen: leerPorcentaje("margenBasico"),
      feeFijoTotal: leerNumero("feeFijoBasico"),
      feePorcentualTotal: leerPorcentaje("feePorcentualBasico"),
      feeCanalFija: leerNumero("feeFijoBasico"),
      feeCanalPorcentaje: leerPorcentaje("feePorcentualBasico"),
      baseComisionCanal: normalizarBaseComision(baseComisionCanalBasicoActual || canal?.baseComision),
      feePagoFijo: 0,
      feePagoPorcentual: 0,
      baseComisionPago: normalizarBaseComision(baseComisionPagoBasicoActual),
      tasaImpuesto: leerPorcentaje("impuestoBasico")
    },
    supuestos: supuestosUsados
  };
}

function construirDatosAvanzados() {
  const presets = obtenerPresets();

  if (!presets) {
    return null;
  }

  const cantidad = Math.max(1, leerNumero("cantidadAvanzado") || 1);
  const alcanceDatosSlicer = leerAlcanceDatosSlicer("alcanceDatosSlicerAvanzado");
  const factorCantidadSlicer = obtenerFactorCantidadSlicer(alcanceDatosSlicer, cantidad);
  const perfilImpresora = obtenerPerfilImpresora(impresoraAvanzado);
  const material = obtenerPorId(presets.materiales, materialAvanzado.value);
  const impresora = obtenerPorId(presets.impresoras, impresoraAvanzado.value);
  const supuestos = { ...presets.supuestosBasicos, ...(impresora || {}) };
  supuestos.costoImpresora = Number(presets.supuestosBasicos?.costoImpresora) || 0;
  const monedaCoincideSupuestos = monedaCoincideConPreset(supuestos, "avanzado");

  if (!monedaCoincideSupuestos) {
    supuestos.tarifaKwh = 0;
    supuestos.costoHerramientas = 0;
    supuestos.seguro = 0;
    supuestos.aduanas = 0;
    supuestos.marketing = 0;
    supuestos.otrosCostos = 0;
  }
  const omitirAmortizacionImpresora = Boolean(document.querySelector("#omitirAmortizacionAvanzado")?.checked);
  const costoUnidad = leerCostoMaterialPorGramo("avanzado");
  const filamentoSnapshot = crearSnapshotFilamento("avanzado", costoUnidad);

  return {
    datos: {
      nombreTrabajo: obtenerNombreTrabajo("nombreTrabajoAvanzado"),
      impresoraId: perfilImpresora?.id || impresoraTrabajoCargadaId || null,
      impresoraSnapshot: crearSnapshotImpresora(perfilImpresora, "avanzado"),
      filamentoId: filamentoSnapshot?.id || "",
      filamentoSnapshot,
      cliente: valorCampo("clienteAvanzado").trim(),
      cantidadProductos: cantidad,
      material: textoSeleccionado("materialAvanzado"),
      canalVenta: textoSeleccionado("canalVentaAvanzado"),
      metodoPago: textoSeleccionado("metodoPagoComparador"),
      moneda: currencySelect?.value || "CLP",
      alcanceDatosSlicer,
      pesoPieza: leerNumero("pesoPiezaAvanzado") * factorCantidadSlicer,
      pesoSoportesPurga: leerNumero("pesoSoportesPurgaAvanzado") * factorCantidadSlicer,
      costoUnidad,
      merma: Number(material?.mermaSugerida) || supuestos.merma,
      horasImpresion:
        leerHorasYMinutos("horasImpresionHorasAvanzado", "horasImpresionMinutosAvanzado") *
        factorCantidadSlicer,
      wattsPromedio: tieneValor("wattsPromedioAvanzado")
        ? leerNumero("wattsPromedioAvanzado")
        : supuestos.wattsPromedio,
      tarifaKwh: tieneValor("tarifaKwhAvanzado")
        ? leerNumero("tarifaKwhAvanzado")
        : supuestos.tarifaKwh,
      costoImpresora: omitirAmortizacionImpresora ? 0 : (tieneValor("costoImpresoraAvanzado")
        ? leerNumero("costoImpresoraAvanzado")
        : supuestos.costoImpresora),
      costoHerramientas: omitirAmortizacionImpresora ? 0 : (tieneValor("costoHerramientasAvanzado")
        ? leerNumero("costoHerramientasAvanzado")
        : supuestos.costoHerramientas),
      mantenimiento: omitirAmortizacionImpresora ? 0 : leerPorcentajeConFallback("mantenimientoAvanzado", supuestos.mantenimiento),
      omitirAmortizacionImpresora,
      anosVida: tieneValor("anosVidaAvanzado") ? leerNumero("anosVidaAvanzado") : supuestos.anosVida,
      diasOperativosAno: tieneValor("diasOperativosAnoAvanzado")
        ? leerNumero("diasOperativosAnoAvanzado")
        : supuestos.diasOperativosAno,
      horasProductivasDia: tieneValor("horasProductivasDiaAvanzado")
        ? leerNumero("horasProductivasDiaAvanzado")
        : supuestos.horasProductivasDia,
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
      tipoGanancia: leerTipoGanancia("tipoGananciaAvanzado"),
      margen: leerPorcentaje("margenAvanzado"),
      feeFijoTotal: 0,
      feePorcentualTotal: leerPorcentaje("feeMarketplaceAvanzado") + leerPorcentaje("feePagoAvanzado"),
      feeCanalFija: 0,
      feeCanalPorcentaje: leerPorcentaje("feeMarketplaceAvanzado"),
      baseComisionCanal: leerBaseComision("baseComisionCanalAvanzado"),
      feePagoFijo: 0,
      feePagoPorcentual: leerPorcentaje("feePagoAvanzado"),
      baseComisionPago: leerBaseComision("baseComisionPagoAvanzado"),
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

  return Number(resumen.feesTotales ?? (
    resumen.feeFijoTotal + resumen.precioNeto * resumen.feePorcentualTotal
  )) || 0;
}

function crearNivelPrecio(nivel, datosBase) {
  const tipoGanancia = normalizarTipoGanancia(datosBase.tipoGanancia);
  const resumenNivel = window.FormulasPrecio3D.calcularResumenCompleto({
    ...datosBase,
    tipoGanancia,
    margen: nivel.margen
  });

  if (resumenNivel.precioNeto === null) {
    return `
      <div class="price-level-card${nivel.personalizado ? " price-level-card--selected" : ""}">
        <span>${nivel.nombre}</span>
        <strong>${textoInterfaz("noCalculable")}</strong>
        <p>${nivel.nota}</p>
      </div>
    `;
  }

  const feeEstimado = calcularFeeEstimado(resumenNivel);
  const utilidadEstimada = resumenNivel.precioNeto - resumenNivel.costoTotal - feeEstimado;
  const estadoSeleccionado = nivel.personalizado
    ? `<span class="price-level-selected"><span aria-hidden="true">✓</span> ${textoInterfaz("seleccionado")}</span>`
    : "";
  const impuestoIncluido = resumenNivel.impuesto > 0
    ? `<small>${textoInterfaz("impuestoIncluido")}: ${formatearMoneda(resumenNivel.impuesto)}</small>`
    : "";

  return `
    <div class="price-level-card${nivel.personalizado ? " price-level-card--selected" : ""}">
      ${estadoSeleccionado}
      <span>${nivel.nombre} · ${formatearPorcentaje(nivel.margen)} ${etiquetaPorcentajeNivel(tipoGanancia)}</span>
      <strong>${formatearMoneda(resumenNivel.precioFinal)}</strong>
      <p>${nivel.nota}</p>
      <small>${textoInterfaz("utilidadEstimadaEtiqueta")}: ${formatearMoneda(utilidadEstimada)}</small>
      ${impuestoIncluido}
    </div>
  `;
}

function renderizarPreciosPorNivel(datosBase) {
  if (!preciosNivelContenido) {
    return;
  }

  if (!datosBase || !window.FormulasPrecio3D?.calcularResumenCompleto) {
    preciosNivelContenido.className = "price-levels-empty";
    preciosNivelContenido.textContent = textoInterfaz("primeroCalculoPreciosNivel");
    return;
  }

  const niveles = [
    ...nivelesPrecioSugeridos,
    {
      nombre: textoInterfaz("personalizado"),
      margen: normalizarPorcentaje(datosBase.margen),
      nota: textoInterfaz("notaPersonalizado"),
      personalizado: true
    }
  ];

  preciosNivelContenido.className = "price-level-grid";
  preciosNivelContenido.innerHTML = niveles.map((nivel) => crearNivelPrecio(nivel, datosBase)).join("");
}

function formatoComparadorMoneda(valor) {
  return valor === null || !Number.isFinite(Number(valor)) ? textoInterfaz("noCalculable") : formatearMoneda(valor);
}

function formatoComparadorPorcentaje(valor) {
  return valueEsNumero(valor) ? formatearPorcentaje(valor) : textoInterfaz("noCalculable");
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
      <span>${escaparHtml(etiqueta)}</span>
      <strong>${resultado ? `${escaparHtml(resultado.canalNombre)} · ${escaparHtml(valor)}` : textoInterfaz("noCalculable")}</strong>
    </div>
  `;
}

function prepararResultadosComparador(resultados) {
  const validos = resultados.filter((resultado) => valueEsNumero(resultado.precioFinal));
  const menorPrecio = validos.length ? Math.min(...validos.map((resultado) => resultado.precioFinal)) : null;
  const tolerancia = 0.01;

  return resultados.map((resultado) => {
    const precioValido = valueEsNumero(resultado.precioFinal);
    const diferenciaPrecio = precioValido && menorPrecio !== null
      ? Math.max(0, resultado.precioFinal - menorPrecio)
      : null;

    return {
      ...resultado,
      diferenciaPrecio,
      esMejorOpcion: precioValido && menorPrecio !== null && Math.abs(resultado.precioFinal - menorPrecio) <= tolerancia
    };
  });
}

function ordenarResultadosComparador(resultados) {
  const criterio = ordenComparadorCanales?.value || "precio";
  const copia = [...resultados];

  if (criterio === "nombre") {
    return copia.sort((a, b) => String(a.canalNombre || "").localeCompare(String(b.canalNombre || ""), undefined, { sensitivity: "base" }));
  }

  return copia.sort((a, b) => {
    const precioA = valueEsNumero(a.precioFinal) ? a.precioFinal : Number.POSITIVE_INFINITY;
    const precioB = valueEsNumero(b.precioFinal) ? b.precioFinal : Number.POSITIVE_INFINITY;
    return precioA - precioB || String(a.canalNombre || "").localeCompare(String(b.canalNombre || ""), undefined, { sensitivity: "base" });
  });
}

function textoDiferenciaComparador(resultado) {
  if (!valueEsNumero(resultado.diferenciaPrecio)) return textoInterfaz("noCalculable");
  return resultado.diferenciaPrecio <= 0.01
    ? formatearMoneda(0)
    : textoInterfaz("diferenciaRespectoMenor", { valor: formatearMoneda(resultado.diferenciaPrecio) });
}

function textoPagoIntegradoComparador(resultado) {
  return resultado.pagoExternoAplicado ? "" : textoInterfaz("pagoIntegradoSinFee");
}

function crearFilaComparador(resultado) {
  const invalida = !valueEsNumero(resultado.precioFinal);
  const clase = invalida ? ' class="is-invalid-row"' : "";

  return `
    <tr${clase}>
      <td>${escaparHtml(resultado.canalNombre)} ${resultado.esMejorOpcion ? `<span class="best-option-badge">${textoInterfaz("mejorOpcion")}</span>` : ""}</td>
      <td>${escaparHtml(resultado.metodoPagoAplicado)}</td>
      <td>${formatearFeeMixto(resultado.feeFijoCanal, resultado.feePorcentajeCanal)}</td>
      <td>${etiquetaBaseComision(resultado.baseComisionCanal)}</td>
      <td>${formatearFeeMixto(resultado.feeFijoPago, resultado.feePorcentajePago)}</td>
      <td>${etiquetaBaseComision(resultado.baseComisionPago)}</td>
      <td>${formatoComparadorMoneda(resultado.feesEstimados)}</td>
      <td>${invalida ? textoInterfaz("noSePuedeCalcular") : formatoComparadorMoneda(resultado.precioFinal)}</td>
      <td>${formatoComparadorMoneda(resultado.utilidadReal)}</td>
      <td>${formatoComparadorPorcentaje(resultado.margenReal)}</td>
      <td>${textoDiferenciaComparador(resultado)}</td>
      <td>${escaparHtml(resultado.nota || textoPagoIntegradoComparador(resultado))}</td>
    </tr>
  `;
}

function crearDetalleComparador(etiqueta, valor) {
  return `
    <div>
      <dt>${escaparHtml(etiqueta)}</dt>
      <dd>${valor}</dd>
    </div>
  `;
}

function idSeguroComparador(resultado) {
  return `comparador-${String(resultado.canalId || resultado.canalNombre || "canal").toLowerCase().replace(/[^a-z0-9_-]+/g, "-")}`;
}

function crearTarjetaComparador(resultado) {
  const invalida = !valueEsNumero(resultado.precioFinal);
  const notaPagoIntegrado = textoPagoIntegradoComparador(resultado);
  const clases = ["comparator-card", resultado.esMejorOpcion ? "is-best" : "", invalida ? "is-invalid" : ""].filter(Boolean).join(" ");
  const idTitulo = idSeguroComparador(resultado);

  return `
    <article class="${clases}" aria-labelledby="${idTitulo}">
      <header class="comparator-card__header">
        <div>
          <h3 id="${idTitulo}">${escaparHtml(resultado.canalNombre)}</h3>
          <p>${escaparHtml(resultado.metodoPagoAplicado)}</p>
        </div>
        ${resultado.esMejorOpcion ? `<span class="best-option-badge">${textoInterfaz("mejorOpcion")}</span>` : ""}
      </header>
      <div class="comparator-card__price">
        <span>${textoInterfaz("precioRequerido")}</span>
        <strong>${invalida ? textoInterfaz("noSePuedeCalcular") : formatoComparadorMoneda(resultado.precioFinal)}</strong>
      </div>
      <dl class="comparator-card__summary">
        ${crearDetalleComparador(textoInterfaz("diferencia"), textoDiferenciaComparador(resultado))}
        ${crearDetalleComparador(textoInterfaz("feeTotal"), formatoComparadorMoneda(resultado.feesEstimados))}
        ${crearDetalleComparador(textoInterfaz("utilidadEstimada"), formatoComparadorMoneda(resultado.utilidadReal))}
      </dl>
      ${invalida ? `<p class="comparator-card__warning">${textoInterfaz("noSePuedeCalcularPorcentajes")}</p>` : ""}
      ${notaPagoIntegrado ? `<p class="comparator-card__note">${escaparHtml(notaPagoIntegrado)}</p>` : ""}
      ${resultado.nota ? `<p class="comparator-card__note">${escaparHtml(resultado.nota)}</p>` : ""}
      <details class="comparator-card__details">
        <summary>${textoInterfaz("verDesglose")}</summary>
        <dl>
          ${crearDetalleComparador(textoInterfaz("feeCanal"), formatearFeeMixto(resultado.feeFijoCanal, resultado.feePorcentajeCanal))}
          ${crearDetalleComparador(textoInterfaz("baseCanal"), etiquetaBaseComision(resultado.baseComisionCanal))}
          ${crearDetalleComparador(textoInterfaz("feePago"), formatearFeeMixto(resultado.feeFijoPago, resultado.feePorcentajePago))}
          ${crearDetalleComparador(textoInterfaz("basePago"), etiquetaBaseComision(resultado.baseComisionPago))}
          ${crearDetalleComparador(textoInterfaz("feeTotal"), formatoComparadorMoneda(resultado.feesEstimados))}
          ${crearDetalleComparador(textoInterfaz("feesEfectivos"), formatoComparadorPorcentaje(resultado.coeficienteFees))}
          ${crearDetalleComparador(textoInterfaz("margenReal"), formatoComparadorPorcentaje(resultado.margenReal))}
        </dl>
      </details>
    </article>
  `;
}

function renderizarComparadorCanales(datosBase, resultadoBase) {
  const presets = obtenerPresets();

  if (!comparadorCanalesContenido || !presets || !window.ComparadorPrecio3D?.compararCanales) {
    return;
  }

  if (!datosBase || !resultadoBase || resultadoBase.precioNeto === null) {
    comparadorCanalesContenido.className = "comparator-empty";
    comparadorCanalesContenido.textContent = textoInterfaz("primeroCalculaValido");
    return;
  }

  if (!Array.isArray(presets.metodosPago)) {
    const mensaje = textoInterfaz("metodosPagoNoCargados");
    console.error(mensaje);
    comparadorCanalesContenido.className = "comparator-empty";
    comparadorCanalesContenido.textContent = mensaje;
    return;
  }

  const metodoSeleccionado = metodoPagoComparador?.value || "automatico";
  const resultadosBase = window.ComparadorPrecio3D.compararCanales(
    datosBase,
    presets.canalesVenta,
    metodoSeleccionado
  );

  if (resultadosBase.length === 0) {
    comparadorCanalesContenido.className = "comparator-empty";
    comparadorCanalesContenido.textContent = textoInterfaz("noCanalesDisponibles");
    return;
  }

  const resultados = ordenarResultadosComparador(prepararResultadosComparador(resultadosBase));
  const menorPrecio = obtenerMejorResultado(resultados, (r) => r.precioFinal, (a, b) => a < b);
  const mayorUtilidad = obtenerMejorResultado(resultados, (r) => r.utilidadReal, (a, b) => a > b);
  const menorFee = obtenerMejorResultado(resultados, (r) => r.feesEstimados, (a, b) => a < b);
  const hayValidos = resultados.some((resultado) => valueEsNumero(resultado.precioFinal));

  comparadorCanalesContenido.className = "";
  comparadorCanalesContenido.innerHTML = `
    <div class="comparison-recommendations">
      ${crearRecomendacion(
        textoInterfaz("menorPrecioFinal"),
        menorPrecio,
        menorPrecio ? formatearMoneda(menorPrecio.precioFinal) : ""
      )}
      ${crearRecomendacion(
        textoInterfaz("mayorUtilidadSimple"),
        mayorUtilidad,
        mayorUtilidad ? formatearMoneda(mayorUtilidad.utilidadReal) : ""
      )}
      ${crearRecomendacion(
        textoInterfaz("menorComision"),
        menorFee,
        menorFee ? formatearMoneda(menorFee.feesEstimados) : ""
      )}
    </div>
    ${hayValidos ? "" : `<p class="comparator-empty comparison-invalid-notice">${textoInterfaz("comparadorTodasInvalidas")}</p>`}
    <div class="comparator-card-list" aria-label="${escaparHtml(textoInterfaz("comparadorCanales"))}">
      ${resultados.map(crearTarjetaComparador).join("")}
    </div>
    <details class="collapsible-section comparator-table-section" open>
      <summary>${textoInterfaz("verTablaComparacion")}</summary>
      <div class="table-wrap">
        <table class="comparator-table">
          <caption class="sr-only">${textoInterfaz("tablaComparadorCaption")}</caption>
          <thead>
            <tr>
              <th scope="col">${textoInterfaz("canal")}</th>
              <th scope="col">${textoInterfaz("metodoPagoAplicado")}</th>
              <th scope="col">${textoInterfaz("feeCanal")}</th>
              <th scope="col">${textoInterfaz("baseCanal")}</th>
              <th scope="col">${textoInterfaz("feePago")}</th>
              <th scope="col">${textoInterfaz("basePago")}</th>
              <th scope="col">${textoInterfaz("feeTotal")}</th>
              <th scope="col">${textoInterfaz("precioRequerido")}</th>
              <th scope="col">${textoInterfaz("utilidadEstimada")}</th>
              <th scope="col">${textoInterfaz("margenReal")}</th>
              <th scope="col">${textoInterfaz("diferencia")}</th>
              <th scope="col">${textoInterfaz("nota")}</th>
            </tr>
          </thead>
          <tbody>${resultados.map(crearFilaComparador).join("")}</tbody>
        </table>
      </div>
    </details>
  `;
}
function renderizarResultado(resumen, feeEstimado, destino, desglose, opciones = {}) {
  if (resumen.precioNeto === null) {
    destino.textContent =
      resumen.errorCalculo === "precioImposibleComisiones"
        ? textoInterfaz("precioImposibleComisiones")
        : resumen.errorCalculo === "margenFeesInvalidos"
        ? textoInterfaz("margenFeesMenor100")
        : textoInterfaz("feePorcentualMenor100");

    if (desglose) {
      desglose.innerHTML = "";
    }

    return;
  }

  const utilidadEstimada = Number(resumen.utilidadReal ?? (resumen.precioNeto - resumen.costoTotal - feeEstimado));
  const tipoGanancia = normalizarTipoGanancia(resumen.tipoGanancia || opciones.tipoGanancia);
  const porcentajeGanancia = Number(resumen.porcentajeGanancia ?? opciones.margenObjetivo) || 0;
  const margenReal =
    Number(resumen.margenReal) ||
    (resumen.precioNeto > 0 && Number.isFinite(utilidadEstimada)
      ? utilidadEstimada / resumen.precioNeto
      : 0);
  const etiquetaPorcentaje =
    tipoGanancia === "margen"
      ? textoInterfaz("margenSolicitado")
      : textoInterfaz("recargoAplicado");
  const nombreTrabajo = opciones.nombreTrabajo || "Trabajo sin nombre";
  const cantidadProductos = Math.max(1, Number(opciones.cantidadProductos) || 1);
  const datosReferencia = opciones.datosCalculo || ultimoDatosCalculo || {};
  const alcanceDatosSlicer = normalizarAlcanceDatosSlicer(
    opciones.alcanceDatosSlicer || datosReferencia.alcanceDatosSlicer
  );
  const pesoTotalUsado = Number(opciones.pesoTotalUsado ?? datosReferencia.pesoPieza) || 0;
  const materialExtraTotalUsado =
    Number(opciones.materialExtraTotalUsado ?? datosReferencia.pesoSoportesPurga) || 0;
  const tiempoTotalUsado = Number(opciones.tiempoTotalUsado ?? datosReferencia.horasImpresion) || 0;
  const advertenciaCostoImpresoraHtml =
    (Number(datosReferencia.costoImpresora) || 0) <= 0
      ? `<div class="warning-item">${textoInterfaz("advertenciaCostoRealImpresora")}</div>`
      : "";
  const precioUnitarioHtml =
    cantidadProductos > 1
      ? crearItemResumen(
          textoInterfaz("precioUnitarioEstimado"),
          formatearMoneda((Number(resumen.precioFinal) || 0) / cantidadProductos)
        )
      : "";
  const datosSlicerHtml = `
      ${crearItemResumen(textoInterfaz("alcanceDatosSlicerResultado"), etiquetaAlcanceDatosSlicer(alcanceDatosSlicer))}
      ${crearItemResumen(textoInterfaz("pesoTotalCalculado"), formatearCantidadFisica(pesoTotalUsado, "g"))}
      ${crearItemResumen(textoInterfaz("materialExtraTotalCalculado"), formatearCantidadFisica(materialExtraTotalUsado, "g"))}
      ${crearItemResumen(textoInterfaz("tiempoTotalCalculado"), formatearHorasTotales(tiempoTotalUsado))}
      ${precioUnitarioHtml}
    `;
  const resumenHtml = opciones.resumenBasicoSimple
    ? `
      ${crearItemResumen(textoInterfaz("precioSugerido"), formatearMoneda(resumen.precioFinal))}
      ${crearItemResumen(textoInterfaz("costoRealEstimado"), formatearMoneda(resumen.costoTotal))}
      ${datosSlicerHtml}
      ${crearItemResumen(textoInterfaz("tipoGananciaUsado"), etiquetaTipoGanancia(tipoGanancia))}
      ${crearItemResumen(etiquetaPorcentaje, formatearPorcentaje(porcentajeGanancia))}
      ${crearItemResumen(textoInterfaz("utilidadEstimada"), formatearMoneda(utilidadEstimada))}
      ${crearItemResumen(textoInterfaz("margenReal"), formatearPorcentaje(margenReal))}
    `
    : `
      ${crearItemResumen(textoInterfaz("precioSugeridoCliente"), formatearMoneda(resumen.precioFinal))}
      ${crearItemResumen(textoInterfaz("costoRealEstimado"), formatearMoneda(resumen.costoTotal))}
      ${datosSlicerHtml}
      ${crearItemResumen(textoInterfaz("tipoGananciaUsado"), etiquetaTipoGanancia(tipoGanancia))}
      ${crearItemResumen(etiquetaPorcentaje, formatearPorcentaje(porcentajeGanancia))}
      ${crearItemResumen(textoInterfaz("utilidadEstimada"), formatearMoneda(utilidadEstimada))}
      ${crearItemResumen(textoInterfaz("margenReal"), formatearPorcentaje(margenReal))}
      ${crearItemResumen(textoInterfaz("feeEstimado"), formatearMoneda(feeEstimado))}
      ${crearItemResumen(textoInterfaz("impuestoEstimado"), formatearMoneda(resumen.impuesto))}
    `;

  const desgloseHtml = `
    ${crearItemDesglose(textoInterfaz("material"), formatearMoneda(resumen.costoMaterial))}
    ${crearItemDesglose(textoInterfaz("electricidad"), formatearMoneda(resumen.costoElectricidad))}
    ${crearItemDesglose(textoInterfaz("maquina"), formatearMoneda(resumen.costoAmortizacion))}
    ${crearItemDesglose(textoInterfaz("manoObra"), formatearMoneda(resumen.costoManoObra))}
    ${crearItemDesglose(textoInterfaz("logistica"), formatearMoneda(resumen.costoLogistico))}
    ${crearItemDesglose(textoInterfaz("comisionCanalDetalle"), `${formatearFeeMixto(resumen.feeFijoCanal, resumen.feePorcentajeCanal)} · ${etiquetaBaseComision(resumen.baseComisionCanal)} = ${formatearMoneda(resumen.feeCanalTotal)}`)}
    ${crearItemDesglose(textoInterfaz("comisionPagoDetalle"), `${formatearFeeMixto(resumen.feeFijoPago, resumen.feePorcentajePago)} · ${etiquetaBaseComision(resumen.baseComisionPago)} = ${formatearMoneda(resumen.feePagoTotal)}`)}
    ${crearItemDesglose(textoInterfaz("feesNominales"), formatearPorcentaje(resumen.feePorcentualTotal))}
    ${crearItemDesglose(textoInterfaz("feesEfectivos"), formatearPorcentaje(resumen.coeficienteFees))}
    ${crearItemDesglose(textoInterfaz("feesTotales"), formatearMoneda(feeEstimado))}
    ${crearItemDesglose(textoInterfaz("impuesto"), formatearMoneda(resumen.impuesto))}
    ${crearItemDesglose(textoInterfaz("costoTotal"), formatearMoneda(resumen.costoTotal))}
  `;

  destino.innerHTML = `
    <p class="result-job-name">${escaparHtml(nombreTrabajo)}</p>
    <p class="result-job-meta">${textoInterfaz("cantidadProductos")}: ${cantidadProductos} · ${textoInterfaz("alcanceDatosSlicerResultado")}: ${etiquetaAlcanceDatosSlicer(alcanceDatosSlicer)}</p>
    <p class="result-total">${formatearMoneda(resumen.precioFinal)}</p>
    <div class="result-summary">
      ${resumenHtml}
    </div>
    ${advertenciaCostoImpresoraHtml}
    ${desglose ? "" : `<div class="breakdown-grid">${desgloseHtml}</div>`}
    <div class="cost-chart-slot" data-future-chart hidden></div>
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
    advertencias.push(textoInterfaz("advertenciaEnvioAlto"));
  }

  if (resumen.costoManoObra > resumen.costoMaterial) {
    advertencias.push(textoInterfaz("advertenciaManoObraAlta"));
  }

  if (feePorcentual > 0.15) {
    advertencias.push(textoInterfaz("advertenciaFeeAlto"));
  }

  if (resumen.precioFinal < resumen.costoTotal + feeEstimado) {
    advertencias.push(textoInterfaz("advertenciaPrecioNoCubre"));
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
    ${crearItemSupuesto(textoInterfaz("costoRealUsadoAmortizacion"), formatearMoneda(supuestos.costoImpresora))}
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
    return textoInterfaz("sinFecha");
  }

  return new Date(valor).toLocaleDateString();
}

function textoEstadoTrabajo(estado) {
  return textoInterfaz(clavesEstadoTrabajo[estado] || "estado") || estado;
}

function obtenerTrabajosGuardados() {
  return window.StoragePrecio3D?.cargarTrabajos?.() || [];
}

function obtenerClienteGuardado(id) {
  return id ? window.ClientesPrecio3D?.obtenerClientePorId?.(id) : null;
}

function crearSnapshotCliente(cliente) {
  return window.ClientesPrecio3D?.crearSnapshot?.(cliente) || null;
}

function poblarSelectorClientes(selector, textoVacio) {
  if (!selector) return;
  const valorActual = selector.value;
  const clientes = window.ClientesPrecio3D?.obtenerClientes?.() || [];
  selector.innerHTML = `<option value="">${escaparHtml(textoVacio)}</option>${clientes
    .sort((a, b) => a.nombre.localeCompare(b.nombre, "es", { sensitivity: "base" }))
    .map((cliente) => `<option value="${escaparHtml(cliente.id)}">${escaparHtml(cliente.nombre)}${cliente.empresa ? ` · ${escaparHtml(cliente.empresa)}` : ""}</option>`)
    .join("")}`;
  selector.value = clientes.some((cliente) => cliente.id === valorActual) ? valorActual : "";
}

function poblarSelectoresClientes() {
  poblarSelectorClientes(trabajoClienteGuardado, textoInterfaz("guardarSinCliente"));
  poblarSelectorClientes(clienteGuardadoCotizacion, textoInterfaz("sinClienteGuardado"));
  if (clienteCotizacionSeleccionadoId && clienteGuardadoCotizacion) {
    clienteGuardadoCotizacion.value = clienteCotizacionSeleccionadoId;
  }
}

function aplicarClienteACotizacion(cliente, mantenerEdicion = false) {
  if (!cliente) {
    clienteCotizacionSeleccionadoId = "";
    snapshotClienteCotizacion = null;
    actualizarClienteDesdeCotizacionButton.disabled = true;
    if (clienteCotizacionVinculo) clienteCotizacionVinculo.textContent = textoInterfaz("cotizacionSinClienteVinculado");
    return;
  }

  clienteCotizacionSeleccionadoId = cliente.id;
  snapshotClienteCotizacion = crearSnapshotCliente(cliente);
  if (!mantenerEdicion) {
    asignarValorCampo("clienteCotizacion", cliente.nombre);
    asignarValorCampo("contactoCliente", cliente.telefono);
    asignarValorCampo("correoCliente", cliente.correo);
    asignarValorCampo("empresaCliente", cliente.empresa);
    asignarValorCampo("rutCliente", cliente.rutIdFiscal);
    asignarValorCampo("direccionCliente", cliente.direccion);
  }
  if (clienteGuardadoCotizacion) clienteGuardadoCotizacion.value = cliente.id;
  actualizarClienteDesdeCotizacionButton.disabled = false;
  if (clienteCotizacionVinculo) {
    clienteCotizacionVinculo.textContent = textoInterfaz("clienteVinculado", { cliente: cliente.nombre });
  }
}

function seleccionarClienteTrabajo(cliente) {
  if (!cliente) return;
  poblarSelectoresClientes();
  trabajoClienteGuardado.value = cliente.id;
  trabajoCliente.value = cliente.nombre;
}

function obtenerClienteSnapshotFormulario() {
  const cotizacion = {
    nombre: valorCampo("clienteCotizacion").trim(),
    empresa: valorCampo("empresaCliente").trim(),
    rutIdFiscal: valorCampo("rutCliente").trim(),
    telefono: valorCampo("contactoCliente").trim(),
    correo: valorCampo("correoCliente").trim(),
    direccion: valorCampo("direccionCliente").trim()
  };
}

function construirTrabajoActual() {
  if (!ultimoDatosCalculo || !ultimoResultadoCalculo || ultimoResultadoCalculo.precioNeto === null || !resultadoActualEsUsable()) {
    return null;
  }

  const ahora = new Date().toISOString();
  const clienteId = trabajoClienteGuardado?.value || "";
  const clienteGuardado = obtenerClienteGuardado(clienteId);
  const nombreCliente = clienteGuardado?.nombre || valorCampo("trabajoCliente").trim() || ultimoDatosCalculo.cliente || "";

  const cotizacion = {
    nombreTrabajo: ultimoDatosCalculo.nombreTrabajo || textoInterfaz("trabajoSinNombre"),
    cliente: nombreCliente,
    clienteId: clienteGuardado?.id || "",
    clienteSnapshot: clienteGuardado ? crearSnapshotCliente(clienteGuardado) : null,
    descripcion: valorCampo("trabajoDescripcion").trim(),
    fechaCreacion: ahora,
    fechaActualizacion: ahora,
    estado: trabajoEstado?.value || "Pendiente",
    modoUsado: ultimoModoCalculo || modoActual,
    precioFinal: ultimoResultadoCalculo.precioFinal,
    costoTotal: ultimoResultadoCalculo.costoTotal,
    utilidadObjetivo: obtenerUtilidadEstimada(ultimoResultadoCalculo),
    margenReal: obtenerMargenRealDesdeResultado(ultimoResultadoCalculo),
    impresoraId: ultimoDatosCalculo.impresoraId || "",
    impresoraSnapshot: ultimoDatosCalculo.impresoraSnapshot
      ? { ...ultimoDatosCalculo.impresoraSnapshot }
      : null,
    filamentoId: ultimoDatosCalculo.filamentoId || "",
    filamentoSnapshot: ultimoDatosCalculo.filamentoSnapshot
      ? { ...ultimoDatosCalculo.filamentoSnapshot }
      : null,
    consumoInventario: {
      registrado: false,
      estado: "No registrado",
      totalRegistradoGramos: 0,
      movimientosIds: [],
      fechaUltimoRegistro: null
    },
    moneda: ultimoDatosCalculo.moneda || obtenerCodigoMonedaActivo(),
    numeroCotizacion: numeroCotizacionActual || "",
    datos: { ...ultimoDatosCalculo, cliente: nombreCliente, clienteId: clienteGuardado?.id || "" },
    resultado: { ...ultimoResultadoCalculo }
  };
  return cotizacion;
}

function renderizarResumenTrabajos(trabajos) {
  if (!trabajosResumen) {
    return;
  }

  const resumirImportes = (campo, filtro = () => true) => {
    const totales = trabajos.filter(filtro).reduce((acumulado, trabajo) => {
      const moneda = trabajo.moneda || trabajo.datos?.moneda || "CLP";
      acumulado[moneda] = (acumulado[moneda] || 0) + (Number(trabajo[campo]) || 0);
      return acumulado;
    }, {});

    const textos = Object.entries(totales).map(([moneda, total]) => formatearMoneda(total, moneda, true));
    return textos.length ? textos.join(" · ") : formatearMoneda(0, obtenerCodigoMonedaActivo(), true);
  };
  const conteoEstados = estadosTrabajo
    .map((estado) => `${textoEstadoTrabajo(estado)}: ${trabajos.filter((trabajo) => trabajo.estado === estado).length}`)
    .join(" · ");

  trabajosResumen.innerHTML = `
    ${crearItemResumen(textoInterfaz("totalCotizadoEtiqueta"), resumirImportes("precioFinal"))}
    ${crearItemResumen(textoInterfaz("totalAceptadoEtiqueta"), resumirImportes("precioFinal", (trabajo) => trabajo.estado === "Aceptado"))}
    ${crearItemResumen(textoInterfaz("totalPagadoEtiqueta"), resumirImportes("precioFinal", (trabajo) => trabajo.estado === "Pagado"))}
    ${crearItemResumen(textoInterfaz("utilidadCotizadaTotal"), resumirImportes("utilidadObjetivo"))}
    ${crearItemResumen(textoInterfaz("utilidadAceptadaEstimada"), resumirImportes("utilidadObjetivo", (trabajo) => trabajo.estado === "Aceptado"))}
    ${crearItemResumen(textoInterfaz("utilidadPagadaEstimada"), resumirImportes("utilidadObjetivo", (trabajo) => trabajo.estado === "Pagado"))}
    ${crearItemResumen(textoInterfaz("trabajosPorEstado"), conteoEstados || textoInterfaz("sinTrabajos"))}
  `;
}

function crearOpcionesEstado(estadoActual) {
  return estadosTrabajo
    .map((estado) => `<option value="${estado}" ${estado === estadoActual ? "selected" : ""}>${textoEstadoTrabajo(estado)}</option>`)
    .join("");
}

function crearTarjetaTrabajo(trabajo) {
  const monedaTrabajo = trabajo.moneda || trabajo.datos?.moneda || "CLP";
  return `
    <article class="job-card" data-job-id="${escaparHtml(trabajo.id)}">
      <div class="job-card__main">
        <span class="job-date">${escaparHtml(formatearFechaTrabajo(trabajo.fechaCreacion))}</span>
        <h3>${escaparHtml(trabajo.nombreTrabajo || textoInterfaz("trabajoSinNombre"))}</h3>
        <p>${escaparHtml(trabajo.cliente || textoInterfaz("trabajoSinCliente"))}</p>
        ${trabajo.numeroCotizacion ? `<p class="job-quote-number">${escaparHtml(trabajo.numeroCotizacion)}</p>` : ""}
      </div>
      <div class="job-card__numbers">
        ${crearItemResumen(textoInterfaz("precioCotizado"), formatearMoneda(trabajo.precioFinal, monedaTrabajo, true))}
        ${crearItemResumen(textoInterfaz("costoEstimado"), formatearMoneda(trabajo.costoTotal, monedaTrabajo, true))}
        ${crearItemResumen(textoInterfaz("utilidadEstimada"), formatearMoneda(trabajo.utilidadObjetivo, monedaTrabajo, true))}
      </div>
      <label class="job-status-control">
        ${textoInterfaz("estado")}
        <select data-job-action="estado" data-job-id="${escaparHtml(trabajo.id)}">
          ${crearOpcionesEstado(trabajo.estado)}
        </select>
      </label>
      <div class="job-actions">
        <button type="button" class="secondary" data-job-action="detalle" data-job-id="${escaparHtml(trabajo.id)}">${textoInterfaz("verDetalle")}</button>
        <button type="button" class="secondary" data-job-action="cargar" data-job-id="${escaparHtml(trabajo.id)}">${textoInterfaz("cargarYEditar")}</button>
        <button type="button" class="secondary" data-job-action="cotizacion" data-job-id="${escaparHtml(trabajo.id)}">${textoInterfaz("generarCotizacion")}</button>
        <button type="button" class="secondary" data-job-action="duplicar" data-job-id="${escaparHtml(trabajo.id)}">${textoInterfaz("duplicarTrabajo")}</button>
        <button type="button" class="secondary danger-button" data-job-action="eliminar" data-job-id="${escaparHtml(trabajo.id)}">${textoInterfaz("eliminarTrabajo")}</button>
      </div>
    </article>
  `;
}

function renderizarTrabajos() {
  if (window.PanelTrabajosPrecio3D?.renderizar) {
    window.PanelTrabajosPrecio3D.renderizar();
    return;
  }

  const trabajos = obtenerTrabajosGuardados();

  renderizarResumenTrabajos(trabajos);

  if (!trabajosListado) {
    return;
  }

  if (!trabajos.length) {
    trabajosListado.innerHTML = `<p class="comparator-empty empty-state">${textoInterfaz("sinTrabajosGuardados")}</p>`;
    return;
  }

  trabajosListado.innerHTML = trabajos.map(crearTarjetaTrabajo).join("");
}

function guardarTrabajoActual() {
  const trabajo = construirTrabajoActual();

  if (!trabajo) {
    mostrarMensajeTrabajos(textoInterfaz("validationRecalculateBeforeQuote"), true);
    return;
  }

  const guardado = window.StoragePrecio3D?.guardarTrabajo?.(trabajo);

  if (!guardado) {
    mostrarMensajeTrabajos(textoInterfaz("trabajoNoGuardado"), true);
    return;
  }

  mostrarMensajeTrabajos(textoInterfaz("trabajoGuardado"));
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
  const omitirBasicoTrabajo = document.querySelector("#omitirAmortizacionBasico");
  const omitirAvanzadoTrabajo = document.querySelector("#omitirAmortizacionAvanzado");
  const omitirTrabajo = Boolean(datos.omitirAmortizacionImpresora);
  if (omitirBasicoTrabajo) omitirBasicoTrabajo.checked = omitirTrabajo;
  if (omitirAvanzadoTrabajo) omitirAvanzadoTrabajo.checked = omitirTrabajo;
  const monedaTrabajo = trabajo.moneda || datos.moneda || "CLP";
  ultimoDatosCalculo.moneda = monedaTrabajo;
  const cantidad = Math.max(1, Number(datos.cantidadProductos) || 1);
  const alcanceDatosSlicer = normalizarAlcanceDatosSlicer(datos.alcanceDatosSlicer);
  ultimoDatosCalculo.alcanceDatosSlicer = alcanceDatosSlicer;
  const factorCantidadSlicer = obtenerFactorCantidadSlicer(alcanceDatosSlicer, cantidad);
  const impresoraIdTrabajo = trabajo.impresoraId || datos.impresoraId || "";
  const snapshotTrabajo = trabajo.impresoraSnapshot || datos.impresoraSnapshot || null;
  const perfilTrabajo = impresoraIdTrabajo
    ? window.ImpresorasPrecio3D?.obtenerImpresoraPorId(impresoraIdTrabajo)
    : null;
  impresoraTrabajoCargada = snapshotTrabajo ? { ...snapshotTrabajo } : null;
  impresoraTrabajoCargadaId = impresoraIdTrabajo;
  const valorSelectorImpresora = perfilTrabajo ? `perfil:${perfilTrabajo.id}` : "manual";
  if (impresoraBasico) {
    impresoraBasico.value = valorSelectorImpresora;
    impresoraBasico.dataset.impresoraSeleccionada = valorSelectorImpresora;
  }
  if (impresoraAvanzado) {
    impresoraAvanzado.value = valorSelectorImpresora;
    impresoraAvanzado.dataset.impresoraSeleccionada = valorSelectorImpresora;
  }
  filamentoTrabajoCargadoId = trabajo.filamentoId || datos.filamentoId || "";
  filamentoTrabajoCargado = trabajo.filamentoSnapshot || datos.filamentoSnapshot || null;
  cargarSelectoresFilamentos();
  if (filamentoBasico) filamentoBasico.value = filamentoTrabajoCargadoId;
  if (filamentoAvanzado) filamentoAvanzado.value = filamentoTrabajoCargadoId;

  cambiarModo(ultimoModoCalculo);

  if (ultimoModoCalculo === "avanzado") {
    asignarValorCampo("nombreTrabajoAvanzado", trabajo.nombreTrabajo);
    asignarValorCampo("clienteAvanzado", datos.cliente || trabajo.cliente);
    asignarValorCampo("cantidadAvanzado", cantidad);
    asignarValorCampo("alcanceDatosSlicerAvanzado", alcanceDatosSlicer);
    asignarSelectPorTexto("materialAvanzado", datos.material);
    asignarSelectPorTexto("canalVentaAvanzado", datos.canalVenta);
    cambiarModoCostoMaterial("avanzado", false);
    asignarValorCampo("costoUnidadAvanzado", datos.costoUnidad);
    asignarValorCampo("pesoPiezaAvanzado", (Number(datos.pesoPieza) || 0) / factorCantidadSlicer);
    asignarValorCampo(
      "pesoSoportesPurgaAvanzado",
      (Number(datos.pesoSoportesPurga) || 0) / factorCantidadSlicer
    );
    asignarTiempoDesdeHoras(
      "horasImpresionHorasAvanzado",
      "horasImpresionMinutosAvanzado",
      (Number(datos.horasImpresion) || 0) / factorCantidadSlicer
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
    asignarValorCampo("tipoGananciaAvanzado", normalizarTipoGanancia(datos.tipoGanancia));
    asignarValorCampo("margenAvanzado", (Number(datos.margen) || 0) * 100);
    asignarValorCampo("impuestoAvanzado", (Number(datos.tasaImpuesto) || 0) * 100);
    asignarValorCampo("feeMarketplaceAvanzado", (Number(datos.feeCanalPorcentaje ?? datos.feePorcentualTotal) || 0) * 100);
    asignarValorCampo("feePagoAvanzado", (Number(datos.feePagoPorcentual) || 0) * 100);
    asignarValorCampo("baseComisionCanalAvanzado", normalizarBaseComision(datos.baseComisionCanal));
    asignarValorCampo("baseComisionPagoAvanzado", normalizarBaseComision(datos.baseComisionPago));
  } else {
    baseComisionCanalBasicoActual = normalizarBaseComision(datos.baseComisionCanal);
    baseComisionPagoBasicoActual = normalizarBaseComision(datos.baseComisionPago);
    asignarValorCampo("nombreTrabajoBasico", trabajo.nombreTrabajo);
    asignarValorCampo("cantidadBasico", cantidad);
    asignarValorCampo("alcanceDatosSlicerBasico", alcanceDatosSlicer);
    asignarSelectPorTexto("materialBasico", datos.material);
    asignarSelectPorTexto("canalVentaBasico", datos.canalVenta);
    cambiarModoCostoMaterial("basico", true);
    escribirCostoMaterialDesdeGramo("basico", datos.costoUnidad);
    asignarValorCampo("pesoPiezaBasico", (Number(datos.pesoPieza) || 0) / factorCantidadSlicer);
    asignarValorCampo(
      "pesoSoportesPurgaBasico",
      (Number(datos.pesoSoportesPurga) || 0) / factorCantidadSlicer
    );
    asignarTiempoDesdeHoras(
      "horasImpresionHorasBasico",
      "horasImpresionMinutosBasico",
      (Number(datos.horasImpresion) || 0) / factorCantidadSlicer
    );
    asignarValorCampo("manoObraSimpleBasico", (Number(datos.tarifaHora) || 0) / cantidad);
    asignarValorCampo("embalajeBasico", datos.embalaje);
    asignarValorCampo("envioBasico", datos.envio);
    asignarValorCampo("tipoGananciaBasico", normalizarTipoGanancia(datos.tipoGanancia));
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

  const nombreImpresoraTrabajo = snapshotTrabajo?.nombre || perfilTrabajo?.nombre || "configuración manual";
  if (impresoraPerfilNotaBasico) {
    impresoraPerfilNotaBasico.textContent = textoInterfaz("parametrosTecnicosImpresora", {
      impresora: nombreImpresoraTrabajo
    });
  }
  if (impresoraPerfilNotaAvanzado) {
    impresoraPerfilNotaAvanzado.textContent = textoInterfaz("parametrosTecnicosImpresora", {
      impresora: nombreImpresoraTrabajo
    });
  }
  if (actualizarPerfilBasico) actualizarPerfilBasico.hidden = !perfilTrabajo;
  if (actualizarPerfilAvanzado) actualizarPerfilAvanzado.hidden = !perfilTrabajo;

  asignarValorCampo("currencySelect", monedaTrabajo);
  asignarValorCampo("currencySelectBasico", monedaTrabajo);
  monedaActualConfirmada = monedaTrabajo;
  advertenciaMonedaSinConversion = false;
  actualizarAdvertenciaMoneda();
  mostrarAvisoLimpiarMoneda(false);

  asignarSelectPorTexto("metodoPagoComparador", datos.metodoPago);
  asignarValorCampo("trabajoCliente", trabajo.cliente || datos.cliente);
  poblarSelectoresClientes();
  if (trabajoClienteGuardado) {
    trabajoClienteGuardado.value = obtenerClienteGuardado(trabajo.clienteId) ? trabajo.clienteId : "";
  }
  sugerirClienteCotizacion(trabajo.cliente || datos.cliente);
  actualizarAyudaCostoMaterial(ultimoModoCalculo);
  actualizarEtiquetasAlcanceSlicer("basico");
  actualizarEtiquetasAlcanceSlicer("avanzado");
  actualizarAdvertenciaCostoImpresora("basico");
  actualizarAdvertenciaCostoImpresora("avanzado");
  actualizarResumenFilamento("basico");
  actualizarResumenFilamento("avanzado");
  actualizarVistaPreviaMoneda();
  actualizarSupuestosEditablesBasico();
  sincronizarDesplegablesBasicos();

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
  window.ValidacionPrecio3D?.registrarCalculoValido?.(ultimoModoCalculo, ultimoDatosCalculo, ultimoResultadoCalculo);
  actualizarBotonesGuardarTrabajo(ultimoResultadoCalculo.precioNeto !== null);
  actualizarBotonesCotizacion(ultimoResultadoCalculo.precioNeto !== null);
  mostrarMensajeTrabajos("Trabajo cargado en la calculadora.");
  document.dispatchEvent(new CustomEvent("precio3d:trabajo-cargado"));
}

function prepararCotizacionDesdeTrabajo(trabajo) {
  if (window.PanelCotizacionesPrecio3D?.agregarTrabajo) {
    window.PanelCotizacionesPrecio3D.nuevaCotizacion();
    window.PanelCotizacionesPrecio3D.agregarTrabajo(trabajo);
    document.dispatchEvent(new CustomEvent("precio3d:cotizacion-trabajo"));
    return;
  }

  if (!trabajo?.datos || !trabajo?.resultado || trabajo.resultado.precioNeto === null) {
    mostrarMensajeTrabajos(textoInterfaz("trabajoSinCalculoCotizable"), true);
    return;
  }

  trabajoCotizacionTemporal = {
    id: trabajo.id,
    datos: {
      ...trabajo.datos,
      nombreTrabajo: trabajo.nombreTrabajo,
      moneda: trabajo.moneda || trabajo.datos.moneda || "CLP"
    },
    resultado: { ...trabajo.resultado },
    cliente: trabajo.cliente || trabajo.datos.cliente || "",
    clienteId: trabajo.clienteId || "",
    clienteSnapshot: trabajo.clienteSnapshot || null,
    descripcion: trabajo.descripcion || "",
    numeroCotizacion: trabajo.numeroCotizacion || ""
  };
  numeroCotizacionActual = trabajoCotizacionTemporal.numeroCotizacion || null;
  referenciaCotizacionActual = `trabajo:${trabajo.id}`;

  asignarValorCampo("clienteCotizacion", trabajoCotizacionTemporal.cliente);
  const clienteGuardado = obtenerClienteGuardado(trabajoCotizacionTemporal.clienteId);
  if (clienteGuardado) {
    aplicarClienteACotizacion(clienteGuardado);
  } else if (trabajoCotizacionTemporal.clienteSnapshot) {
    const snapshot = trabajoCotizacionTemporal.clienteSnapshot;
    clienteCotizacionSeleccionadoId = "";
    snapshotClienteCotizacion = { ...snapshot };
    asignarValorCampo("clienteCotizacion", snapshot.nombre || trabajoCotizacionTemporal.cliente);
    asignarValorCampo("contactoCliente", snapshot.telefono);
    asignarValorCampo("correoCliente", snapshot.correo);
    asignarValorCampo("empresaCliente", snapshot.empresa);
    asignarValorCampo("rutCliente", snapshot.rutIdFiscal);
    asignarValorCampo("direccionCliente", snapshot.direccion);
  }
  asignarValorCampo("trabajoDescripcion", trabajoCotizacionTemporal.descripcion);
  actualizarBotonesCotizacion(true);

  const advertencias = obtenerAdvertenciasDatosCotizacion();
  mostrarMensajeCotizacion(
    advertencias.length
      ? `${textoInterfaz("cotizacionLista")} ${advertencias.join(" ")}`
      : textoInterfaz("trabajoTemporalCotizacion")
  );
  document.dispatchEvent(new CustomEvent("precio3d:cotizacion-trabajo"));
}

function verDetalleTrabajo(trabajo) {
  const monedaTrabajo = trabajo.moneda || trabajo.datos?.moneda || "CLP";
  const detalle = [
    `${textoInterfaz("trabajo")}: ${trabajo.nombreTrabajo}`,
    `${textoInterfaz("cliente")}: ${trabajo.cliente || textoInterfaz("trabajoSinCliente")}`,
    `${textoInterfaz("estado")}: ${textoEstadoTrabajo(trabajo.estado)}`,
    `${textoInterfaz("precioCotizado")}: ${formatearMoneda(trabajo.precioFinal, monedaTrabajo, true)}`,
    `${textoInterfaz("costoEstimado")}: ${formatearMoneda(trabajo.costoTotal, monedaTrabajo, true)}`,
    `${textoInterfaz("utilidadEstimada")}: ${formatearMoneda(trabajo.utilidadObjetivo, monedaTrabajo, true)}`,
    `${textoInterfaz("descripcion")}: ${trabajo.descripcion || textoInterfaz("sinDescripcion")}`
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
    mostrarMensajeTrabajos(actualizado ? textoInterfaz("estadoActualizado") : textoInterfaz("estadoNoActualizado"), !actualizado);
    renderizarTrabajos();
    return;
  }

  if (!trabajo) {
    mostrarMensajeTrabajos(textoInterfaz("trabajoNoEncontrado"), true);
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
    mostrarMensajeTrabajos(duplicado ? textoInterfaz("trabajoDuplicado") : textoInterfaz("trabajoNoDuplicado"), !duplicado);
    renderizarTrabajos();
  }

  if (accion === "eliminar") {
    const confirmar = confirm(textoInterfaz("confirmarEliminarTrabajo"));

    if (!confirmar) {
      return;
    }

    const eliminado = window.StoragePrecio3D?.eliminarTrabajo?.(id);
    mostrarMensajeTrabajos(eliminado ? textoInterfaz("trabajoEliminado") : textoInterfaz("trabajoNoEliminado"), !eliminado);
    renderizarTrabajos();
  }
}

function exportarCalculoActualCSV() {
  if (!ultimoDatosCalculo || !ultimoResultadoCalculo || ultimoResultadoCalculo.precioNeto === null || !resultadoActualEsUsable()) {
    mostrarMensajeAlmacenamiento(textoInterfaz("recalculaAntesExportar"), true);
    return;
  }

  const cliente = ultimoDatosCalculo.cliente || valorCampo("trabajoCliente").trim();
  const monedaCalculo = ultimoDatosCalculo.moneda || obtenerCodigoMonedaActivo();
  const filas = [
    ["Campo", "Valor"],
    ["Nombre del trabajo", ultimoDatosCalculo.nombreTrabajo || "Trabajo sin nombre"],
    ["Cliente", cliente],
    ["Modo usado", ultimoModoCalculo || modoActual],
    ["Fecha", new Date().toISOString()],
    ["Precio final", formatearMoneda(ultimoResultadoCalculo.precioFinal, monedaCalculo, true)],
    ["Costo total", formatearMoneda(ultimoResultadoCalculo.costoTotal, monedaCalculo, true)],
    ["Utilidad estimada", formatearMoneda(obtenerUtilidadEstimada(ultimoResultadoCalculo), monedaCalculo, true)],
    ["Margen", obtenerMargenRealDesdeResultado(ultimoResultadoCalculo)],
    ["Material", ultimoDatosCalculo.material],
    ["Peso pieza", ultimoDatosCalculo.pesoPieza],
    ["Soportes/purga", ultimoDatosCalculo.pesoSoportesPurga],
    ["Tiempo impresión", ultimoDatosCalculo.horasImpresion],
    ["Cantidad", ultimoDatosCalculo.cantidadProductos],
    ["Canal", ultimoDatosCalculo.canalVenta],
    ["Método de pago", ultimoDatosCalculo.metodoPago],
    ["Bobina de filamento", ultimoDatosCalculo.filamentoSnapshot?.nombre || ultimoDatosCalculo.filamentoSnapshot?.materialNombre || "Uso manual"],
    ["Costo histórico por gramo", ultimoDatosCalculo.filamentoSnapshot?.costoPorGramoUsado ?? ultimoDatosCalculo.costoUnidad],
    ["Consumo estimado de filamento", ultimoDatosCalculo.filamentoSnapshot?.consumoEstimadoGramos || ""],
    ["Moneda", monedaCalculo]
  ];

  descargarArchivo("calculo-impresion-3d.csv", crearCSVConBOM(filas), "text/csv;charset=utf-8");
  mostrarMensajeAlmacenamiento(textoInterfaz("calculoExportadoCsv"));
}

function exportarTrabajosCSV() {
  const trabajos = obtenerTrabajosGuardados();

  if (!trabajos.length) {
    mostrarMensajeTrabajos(textoInterfaz("noTrabajosExportar"), true);
    return;
  }

  const filas = [
    [
      "Número de cotización",
      "Fecha creación",
      "Fecha venta",
      "Fecha pago",
      "Trabajo",
      "Cliente",
      "Estado",
      "Modo",
      "Precio cotizado",
      "Precio vendido real",
      "Costo estimado",
      "Costos adicionales reales",
      "Utilidad estimada",
      "Utilidad real",
      "Margen real",
      "Monto abonado",
      "Total pagado",
      "Saldo pendiente",
      "Bobina de filamento",
      "Marca de filamento",
      "Material de filamento",
      "Color de filamento",
      "Costo por gramo usado",
      "Moneda del filamento",
      "Consumo estimado (g)",
      "Consumo registrado (g)",
      "Consumo de inventario",
      "IDs de movimientos de inventario",
      "Moneda"
    ],
    ...trabajos.map((trabajo) => {
      const moneda = trabajo.moneda || trabajo.datos?.moneda || "CLP";
      const utilidadReal = window.PanelTrabajosPrecio3D?.utilidadReal?.(trabajo);
      const margenReal = window.PanelTrabajosPrecio3D?.margenReal?.(trabajo);
      const totalPagado = window.PanelTrabajosPrecio3D?.totalPagado?.(trabajo) || 0;
      const precioCobro = Number(trabajo.precioVendidoReal) > 0
        ? Number(trabajo.precioVendidoReal)
        : Number(trabajo.precioFinal) || 0;

      return [
        trabajo.numeroCotizacion,
        trabajo.fechaCreacion,
        trabajo.fechaVenta,
        trabajo.fechaPago,
        trabajo.nombreTrabajo,
        trabajo.cliente,
        trabajo.estado,
        trabajo.modoUsado,
        formatearMoneda(trabajo.precioFinal, moneda, true),
        formatearMoneda(trabajo.precioVendidoReal, moneda, true),
        formatearMoneda(trabajo.costoTotal, moneda, true),
        formatearMoneda(trabajo.costosAdicionalesReales, moneda, true),
        formatearMoneda(trabajo.utilidadObjetivo, moneda, true),
        utilidadReal === null ? "" : formatearMoneda(utilidadReal, moneda, true),
        margenReal === null ? "" : margenReal,
        formatearMoneda(trabajo.montoAbonado, moneda, true),
        formatearMoneda(totalPagado, moneda, true),
        formatearMoneda(Math.max(0, precioCobro - totalPagado), moneda, true),
        trabajo.filamentoSnapshot?.nombre || trabajo.filamentoSnapshot?.materialNombre || "",
        trabajo.filamentoSnapshot?.marca || "",
        trabajo.filamentoSnapshot?.materialNombre || trabajo.datos?.material || "",
        trabajo.filamentoSnapshot?.colorNombre || "",
        trabajo.filamentoSnapshot?.costoPorGramo ?? trabajo.filamentoSnapshot?.costoPorGramoUsado ?? "",
        trabajo.filamentoSnapshot?.monedaCompra || "",
        trabajo.filamentoSnapshot?.consumoEstimadoGramos || "",
        trabajo.consumoInventario?.totalRegistradoGramos || 0,
        trabajo.consumoInventario?.estado || (trabajo.consumoInventario?.registrado ? "Registrado" : "No registrado"),
        (trabajo.consumoInventario?.movimientosIds || []).join(" | "),
        moneda
      ];
    })
  ];

  descargarArchivo("mis-trabajos-impresion-3d.csv", crearCSVConBOM(filas), "text/csv;charset=utf-8");
  mostrarMensajeTrabajos(textoInterfaz("trabajosExportadosCsv"));
}

function exportarTrabajosJSONDesdeUI() {
  if (!window.StoragePrecio3D?.exportarTrabajosJSON) {
    mostrarMensajeTrabajos(textoInterfaz("almacenamientoNoAccesible"), true);
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
      textoInterfaz("confirmarImportarTrabajos")
    );
    const trabajos = window.StoragePrecio3D?.importarTrabajosJSON?.(
      reader.result,
      reemplazar ? "reemplazar" : "combinar"
    );

    if (!trabajos) {
      mostrarMensajeTrabajos(textoInterfaz("archivoTrabajosInvalido"), true);
      importarTrabajosInput.value = "";
      return;
    }

    mostrarMensajeTrabajos(textoInterfaz("trabajosImportados"));
    importarTrabajosInput.value = "";
    renderizarTrabajos();
  };

  reader.onerror = () => {
    mostrarMensajeTrabajos(textoInterfaz("archivoTrabajosInvalido"), true);
    importarTrabajosInput.value = "";
  };

  reader.readAsText(archivo);
}

function borrarTodosLosTrabajos() {
  const confirmar = confirm(textoInterfaz("confirmarBorrarTrabajos"));

  if (!confirmar) {
    return;
  }

  const borrado = window.StoragePrecio3D?.borrarTrabajos?.();
  mostrarMensajeTrabajos(borrado ? textoInterfaz("trabajosBorrados") : textoInterfaz("trabajosNoBorrados"), !borrado);
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
    clienteId: clienteCotizacionSeleccionadoId,
    snapshotCliente: obtenerClienteSnapshotFormulario(),
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
    tiempoEntrega: valorCampo("tiempoEntrega").trim() || textoInterfaz("tiempoEntregaCoordinar"),
    condicionesPago:
      valorCampo("condicionesPago").trim() || textoInterfaz("condicionesPagoDefecto"),
    observacionesCotizacion: valorCampo("observacionesCotizacion").trim()
  };
}

function obtenerAdvertenciasDatosCotizacion() {
  const advertencias = [];
  const datosNegocio = obtenerDatosNegocioFormulario();
  const datosCliente = obtenerDatosClienteCotizacionFormulario();

  if (!datosNegocio.nombreNegocio) {
    advertencias.push(textoInterfaz("faltaNombreNegocio"));
  }

  if (!datosCliente.clienteCotizacion) {
    advertencias.push(textoInterfaz("faltaNombreCliente"));
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
  poblarSelectoresClientes();
}

function actualizarClienteDesdeCotizacion() {
  const cliente = obtenerClienteGuardado(clienteCotizacionSeleccionadoId);
  if (!cliente) {
    mostrarMensajeDatosCotizacion(textoInterfaz("seleccionaClienteGuardado"), true);
    return;
  }
  if (!confirm(textoInterfaz("confirmarActualizarCliente", { cliente: cliente.nombre }))) {
    return;
  }
  const snapshot = obtenerClienteSnapshotFormulario();
  const resultado = window.ClientesPrecio3D?.actualizarCliente?.(cliente.id, snapshot);
  if (!resultado?.ok) {
    mostrarMensajeDatosCotizacion(resultado?.error || textoInterfaz("clienteFichaNoActualizada"), true);
    return;
  }
  snapshotClienteCotizacion = crearSnapshotCliente(resultado.cliente);
  poblarSelectoresClientes();
  aplicarClienteACotizacion(resultado.cliente, true);
  mostrarMensajeDatosCotizacion(textoInterfaz("clienteFichaActualizada"));
}

function guardarDatosCotizacion() {
  const guardoNegocio = window.StoragePrecio3D?.guardarDatosNegocio?.(obtenerDatosNegocioFormulario());
  const guardoConfig = window.StoragePrecio3D?.guardarConfigCotizacion?.(obtenerConfigCotizacionFormulario());

  if (!guardoNegocio || !guardoConfig) {
    mostrarMensajeDatosCotizacion(textoInterfaz("datosCotizacionNoGuardados"), true);
    return;
  }

  const advertencias = obtenerAdvertenciasDatosCotizacion();
  mostrarMensajeDatosCotizacion(
    advertencias.length
      ? `${textoInterfaz("datosCotizacionGuardados")} ${advertencias.join(" ")}`
      : textoInterfaz("datosCotizacionGuardados")
  );
  actualizarVistaCotizacionSiExiste();
  document.dispatchEvent(new CustomEvent("precio3d:datos-cotizacion-guardados"));
}

function borrarDatosCotizacionGuardados() {
  const confirmar = confirm(textoInterfaz("confirmarBorrarDatosCotizacion"));

  if (!confirmar) {
    return;
  }

  const borroNegocio = window.StoragePrecio3D?.borrarDatosNegocio?.();
  const borroConfig = window.StoragePrecio3D?.borrarConfigCotizacion?.();

  if (!borroNegocio || !borroConfig) {
    mostrarMensajeDatosCotizacion(textoInterfaz("datosCotizacionNoBorrados"), true);
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
  mostrarMensajeDatosCotizacion(textoInterfaz("datosCotizacionBorrados"));
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

  if (!datosCalculo || !resultadoCalculo || resultadoCalculo.precioNeto === null || (!trabajoCotizacionTemporal && !resultadoActualEsUsable())) {
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
    clienteId: datosCliente.clienteId || trabajoCotizacionTemporal?.clienteId || "",
    snapshotCliente: datosCliente.snapshotCliente || trabajoCotizacionTemporal?.clienteSnapshot || snapshotClienteCotizacion,
    condiciones,
    cantidad,
    precioFinal,
    precioUnitario: cantidad > 0 ? precioFinal / cantidad : precioFinal,
    moneda: datosCalculo.moneda || currencySelectBasico?.value || currencySelect?.value || "CLP",
    nombreTrabajo: datosCalculo.nombreTrabajo || textoInterfaz("trabajoSinNombre"),
    clienteCalculo: trabajoCotizacionTemporal?.cliente || datosCalculo.cliente || "",
    descripcionTrabajo:
      trabajoCotizacionTemporal?.descripcion ||
      valorCampo("trabajoDescripcion").trim() ||
      condiciones.observacionesCotizacion,
    fechaCotizacion: formatearFechaCotizacion(),
    numeroCotizacion
  };
  window.StoragePrecio3D?.guardarDatosCotizacionActual?.({
    clienteId: cotizacion.clienteId,
    snapshotCliente: cotizacion.snapshotCliente,
    datosCliente: cotizacion.datosCliente,
    numeroCotizacion: cotizacion.numeroCotizacion,
    nombreTrabajo: cotizacion.nombreTrabajo,
    precioFinal: cotizacion.precioFinal,
    moneda: cotizacion.moneda
  });
  return cotizacion;
}

function prepararCotizacionActual() {
  trabajoCotizacionTemporal = null;

  if (!ultimoDatosCalculo || !ultimoResultadoCalculo || ultimoResultadoCalculo.precioNeto === null || !resultadoActualEsUsable()) {
    mostrarMensajeCotizacion(textoInterfaz("recalculaAntesCotizacion"), true);
    return;
  }

  const advertencias = obtenerAdvertenciasDatosCotizacion();
  mostrarMensajeCotizacion(
    advertencias.length
      ? `${textoInterfaz("cotizacionLista")} ${advertencias.join(" ")}`
      : textoInterfaz("cotizacionLista")
  );
}

function renderizarCotizacionCliente() {
  if (window.PanelCotizacionesPrecio3D?.renderizarVistaPrevia) {
    return window.PanelCotizacionesPrecio3D.renderizarVistaPrevia();
  }

  const datos = obtenerDatosCotizacionActuales();

  if (!datos) {
    mostrarMensajeCotizacion(textoInterfaz("recalculaAntesCotizacion"), true);
    return false;
  }

  const { datosNegocio, datosCliente, condiciones } = datos;
  const nombreNegocio = datosNegocio.nombreNegocio || textoInterfaz("negocioNoConfigurado");
  const cliente = datosCliente.clienteCotizacion || datos.clienteCalculo || textoInterfaz("clienteNoEspecificado");
  const validez = `${condiciones.validezCotizacionDias} ${textoInterfaz("dias")}`;

  cotizacionClienteVista.hidden = false;
  cotizacionClienteVista.innerHTML = `
    <article class="print-quote">
      <header class="print-quote__header">
        <div class="print-quote__title">
          <h2>${textoInterfaz("cotizacion")}</h2>
        </div>
        <div class="print-quote__meta">
          ${crearLineaCotizacion(textoInterfaz("numeroCotizacion"), datos.numeroCotizacion)}
          ${crearLineaCotizacion(textoInterfaz("fecha"), datos.fechaCotizacion)}
          ${crearLineaCotizacion(textoInterfaz("validezCotizacion"), validez)}
          ${crearLineaCotizacion(textoInterfaz("moneda"), datos.moneda)}
        </div>
      </header>

      <section class="print-quote__commercial">
        <div class="print-quote__party">
          <h3>${textoInterfaz("datosQuienCotiza")}</h3>
          <h4>${escaparHtml(nombreNegocio)}</h4>
          ${crearLineaCotizacion(textoInterfaz("rutNegocio"), datosNegocio.rutNegocio)}
          ${crearLineaCotizacion(textoInterfaz("contacto"), datosNegocio.telefonoNegocio)}
          ${crearLineaCotizacion(textoInterfaz("correoNegocio"), datosNegocio.correoNegocio)}
          ${crearLineaCotizacion(textoInterfaz("direccionNegocio"), datosNegocio.direccionNegocio)}
          ${crearLineaCotizacion(textoInterfaz("sitioWebNegocio"), datosNegocio.sitioWebNegocio)}
          ${crearLineaCotizacion("Instagram", datosNegocio.instagramNegocio)}
        </div>
        <div class="print-quote__party">
          <h3>${textoInterfaz("datosCliente")}</h3>
          ${crearLineaCotizacion(textoInterfaz("cliente"), cliente)}
          ${crearLineaCotizacion(textoInterfaz("empresa"), datosCliente.empresaCliente)}
          ${crearLineaCotizacion(textoInterfaz("rutCliente"), datosCliente.rutCliente)}
          ${crearLineaCotizacion(textoInterfaz("contacto"), datosCliente.contactoCliente)}
          ${crearLineaCotizacion(textoInterfaz("correoCliente"), datosCliente.correoCliente)}
          ${crearLineaCotizacion(textoInterfaz("direccionCliente"), datosCliente.direccionCliente)}
        </div>
      </section>

      <section class="print-quote__section">
        <h3>${textoInterfaz("detallePedido")}</h3>
        <table class="print-quote__table">
          <thead>
            <tr>
              <th class="quote-col-work">${textoInterfaz("nombreTrabajo")}</th>
              <th class="quote-col-description">${textoInterfaz("descripcionCotizacion")}</th>
              <th class="quote-col-quantity">${textoInterfaz("cantidadProductos")}</th>
              <th class="quote-col-money">${textoInterfaz("precioUnitario")}</th>
              <th class="quote-col-money">${textoInterfaz("total")}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>${escaparHtml(datos.nombreTrabajo)}</td>
              <td>${escaparHtml(datos.descripcionTrabajo || textoInterfaz("sinDescripcion"))}</td>
              <td class="quote-col-quantity">${datos.cantidad}</td>
              <td class="quote-col-money">${formatearMoneda(datos.precioUnitario, datos.moneda, true)}</td>
              <td class="quote-col-money">${formatearMoneda(datos.precioFinal, datos.moneda, true)}</td>
            </tr>
          </tbody>
        </table>
        <p class="print-quote__total">${textoInterfaz("totalFinal")}: ${formatearMoneda(datos.precioFinal, datos.moneda, true)}</p>
      </section>

      <section class="print-quote__section print-quote__conditions">
        <h3>${textoInterfaz("condicionesCotizacion")}</h3>
        ${crearLineaCotizacion(textoInterfaz("tiempoEntrega"), condiciones.tiempoEntrega)}
        ${crearLineaCotizacion(textoInterfaz("condicionesPago"), condiciones.condicionesPago)}
        ${crearLineaCotizacion(textoInterfaz("observacionesCotizacion"), condiciones.observacionesCotizacion)}
      </section>
    </article>
  `;

  mostrarMensajeCotizacion(textoInterfaz("vistaPreviaCotizacionGenerada"));
  return true;
}

function imprimirCotizacionCliente() {
  if (window.PanelCotizacionesPrecio3D?.imprimir) {
    window.PanelCotizacionesPrecio3D.imprimir();
    return;
  }

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
  if (window.PanelCotizacionesPrecio3D?.nuevaCotizacion) {
    window.PanelCotizacionesPrecio3D.nuevaCotizacion();
    return;
  }

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
    textoInterfaz("nuevaCotizacionPreparada"),
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
      ultimoCalculoPanel.hidden = true;
      ultimoCalculoResumen.textContent = textoInterfaz("ultimoCalculoVacio");
      cargarUltimoCalculoButton.disabled = true;
      borrarUltimoCalculoButton.disabled = true;
    }

    return;
  }

  const fecha = ultimo.guardadoEn ? new Date(ultimo.guardadoEn).toLocaleString() : textoInterfaz("sinFecha");
  const precioFinal = ultimo.resultado?.precioFinal;
  const costoTotal = ultimo.resultado?.costoTotal;

  ultimoCalculoPanel.hidden = false;
  cargarUltimoCalculoButton.disabled = false;
  borrarUltimoCalculoButton.disabled = false;
  ultimoCalculoResumen.innerHTML = `
    <div class="result-summary">
      ${crearItemResumen(textoInterfaz("fecha"), fecha)}
      ${crearItemResumen(textoInterfaz("modoCalculo"), ultimo.modo === "avanzado" ? textoInterfaz("modoAvanzado") : textoInterfaz("modoBasico"))}
      ${crearItemResumen(textoInterfaz("precioFinal"), formatearMoneda(precioFinal, ultimo.moneda || ultimo.datos?.moneda || "CLP", true))}
      ${crearItemResumen(textoInterfaz("costoTotal"), formatearMoneda(costoTotal, ultimo.moneda || ultimo.datos?.moneda || "CLP", true))}
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

  const monedaUltimo = ultimo.moneda || ultimo.datos?.moneda || "CLP";
  asignarValorCampo("currencySelectBasico", monedaUltimo);
  asignarValorCampo("currencySelect", monedaUltimo);
  monedaActualConfirmada = monedaUltimo;
  advertenciaMonedaSinConversion = false;
  actualizarAdvertenciaMoneda();
  mostrarAvisoLimpiarMoneda(false);

  if (ultimo.idioma) {
    asignarValorCampo("languageSelectBasico", ultimo.idioma);
    asignarValorCampo("languageSelect", ultimo.idioma);
    window.cambiarIdioma(ultimo.idioma);
  }

  asignarValorCampo("metodoPagoComparador", ultimo.metodoPagoComparador);
  cambiarModo(ultimo.modo === "avanzado" ? "avanzado" : "basico");

  ultimoDatosCalculo = { ...ultimo.datos };
  ultimoDatosCalculo.baseComisionCanal = normalizarBaseComision(ultimoDatosCalculo.baseComisionCanal);
  ultimoDatosCalculo.baseComisionPago = normalizarBaseComision(ultimoDatosCalculo.baseComisionPago);
  ultimoDatosCalculo.alcanceDatosSlicer = normalizarAlcanceDatosSlicer(
    ultimoDatosCalculo.alcanceDatosSlicer
  );
  ultimoResultadoCalculo = ultimo.resultado;
  ultimoModoCalculo = ultimo.modo === "avanzado" ? "avanzado" : "basico";
  const feeEstimado = calcularFeeEstimado(ultimo.resultado);

  if (ultimo.modo === "avanzado") {
    asignarValorCampo("baseComisionCanalAvanzado", ultimoDatosCalculo.baseComisionCanal);
    asignarValorCampo("baseComisionPagoAvanzado", ultimoDatosCalculo.baseComisionPago);
    renderizarResultado(ultimo.resultado, feeEstimado, resultBox, null, {
      margenObjetivo: ultimo.datos.margen,
      nombreTrabajo: ultimo.datos.nombreTrabajo,
      cantidadProductos: ultimo.datos.cantidadProductos
    });
  } else {
    baseComisionCanalBasicoActual = ultimoDatosCalculo.baseComisionCanal;
    baseComisionPagoBasicoActual = ultimoDatosCalculo.baseComisionPago;
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
  sincronizarVisibilidadPanelesResultado();
  actualizarBotonesGuardarTrabajo(ultimo.resultado.precioNeto !== null);
  actualizarBotonesCotizacion(ultimo.resultado.precioNeto !== null);

  if (exportExcelButton && ultimo.resultado.precioNeto !== null) {
    exportExcelButton.disabled = false;
  }

  mostrarMensajeAlmacenamiento(textoInterfaz("ultimoCalculoCargado"));
}

function borrarUltimoCalculoGuardado() {
  const borrado = window.StoragePrecio3D?.borrarUltimoCalculo?.();

  if (!borrado) {
    mostrarAdvertenciaStorageUnaVez();
    return;
  }

  renderizarUltimoCalculoGuardado();
  mostrarMensajeAlmacenamiento(textoInterfaz("ultimoCalculoBorrado"));
}

function calcularModoBasico() {
  trabajoCotizacionTemporal = null;
  const construido = construirDatosBasicos();

  if (!construido) {
    return;
  }

  const validacion = window.ValidacionPrecio3D?.validarModoBasico?.(construido.datos);
  if (validacion && !validacion.valido) {
    window.ValidacionPrecio3D?.marcarCalculoBloqueado?.("basico");
    actualizarBotonesGuardarTrabajo(false);
    actualizarBotonesCotizacion(false);
    if (exportExcelButton) exportExcelButton.disabled = true;
    return;
  }

  const resumen = window.FormulasPrecio3D.calcularResumenCompleto(construido.datos);
  const resultadoValido = window.ValidacionPrecio3D?.validarResultadoMotor?.(resumen);
  if (resultadoValido && !resultadoValido.valido) {
    window.ValidacionPrecio3D?.marcarCalculoBloqueado?.("basico");
    actualizarBotonesGuardarTrabajo(false);
    actualizarBotonesCotizacion(false);
    if (exportExcelButton) exportExcelButton.disabled = true;
    return;
  }
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
  sincronizarVisibilidadPanelesResultado();
  window.ValidacionPrecio3D?.registrarCalculoValido?.("basico", ultimoDatosCalculo, ultimoResultadoCalculo);
  actualizarBotonesGuardarTrabajo(resumen.precioNeto !== null);
  exportExcelButton.disabled = resumen.precioNeto === null;
  actualizarBotonesCotizacion(resumen.precioNeto !== null);
  persistirUltimoCalculo("basico", ultimoDatosCalculo, ultimoResultadoCalculo);
  guardarConfiguracionActual(false);

  if (resumen.precioNeto !== null) {
    notificarCalculoValido();
    anunciarAccesible(textoInterfaz("calculoCompletado"));
    enfocarResultadoCalculado("basico");
  }
}
function calcularModoAvanzado() {
  trabajoCotizacionTemporal = null;
  const construido = construirDatosAvanzados();

  if (!construido) {
    return;
  }

  const validacion = window.ValidacionPrecio3D?.validarModoAvanzado?.(construido.datos);
  if (validacion && !validacion.valido) {
    window.ValidacionPrecio3D?.marcarCalculoBloqueado?.("avanzado");
    actualizarBotonesGuardarTrabajo(false);
    actualizarBotonesCotizacion(false);
    if (exportExcelButton) exportExcelButton.disabled = true;
    return;
  }

  const resumen = window.FormulasPrecio3D.calcularResumenCompleto(construido.datos);
  const resultadoValido = window.ValidacionPrecio3D?.validarResultadoMotor?.(resumen);
  if (resultadoValido && !resultadoValido.valido) {
    window.ValidacionPrecio3D?.marcarCalculoBloqueado?.("avanzado");
    actualizarBotonesGuardarTrabajo(false);
    actualizarBotonesCotizacion(false);
    if (exportExcelButton) exportExcelButton.disabled = true;
    return;
  }
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
  sincronizarVisibilidadPanelesResultado();
  window.ValidacionPrecio3D?.registrarCalculoValido?.("avanzado", ultimoDatosCalculo, ultimoResultadoCalculo);
  actualizarBotonesGuardarTrabajo(resumen.precioNeto !== null);
  exportExcelButton.disabled = resumen.precioNeto === null;
  actualizarBotonesCotizacion(resumen.precioNeto !== null);
  persistirUltimoCalculo("avanzado", ultimoDatosCalculo, ultimoResultadoCalculo);
  guardarConfiguracionActual(false);

  if (resumen.precioNeto !== null) {
    notificarCalculoValido();
    anunciarAccesible(textoInterfaz("calculoCompletado"));
    enfocarResultadoCalculado("avanzado");
  }
}
function limpiarFormulario(opciones = {}) {
  const monedaAnterior = obtenerCodigoMonedaActivo();
  trabajoCotizacionTemporal = null;
  impresoraTrabajoCargada = null;
  impresoraTrabajoCargadaId = "";
  filamentoTrabajoCargado = null;
  filamentoTrabajoCargadoId = "";
  document.querySelectorAll("input").forEach((input) => {
    input.value = "";
  });

  document.querySelectorAll("select").forEach((select) => {
    select.selectedIndex = 0;
  });

  document.querySelectorAll("#omitirAmortizacionBasico, #omitirAmortizacionAvanzado").forEach((checkbox) => {
    checkbox.checked = false;
  });

  const monedaLimpieza = opciones.preservarMoneda === false ? "CLP" : monedaAnterior;
  currencySelect.value = monedaLimpieza;
  currencySelectBasico.value = monedaLimpieza;
  languageSelect.value = "es";
  languageSelectBasico.value = "es";
  metodoPagoComparador.value = "automatico";
  asignarValorCampo("tipoGananciaBasico", "recargo");
  asignarValorCampo("tipoGananciaAvanzado", "recargo");
  asignarValorCampo("alcanceDatosSlicerBasico", "unidad");
  asignarValorCampo("alcanceDatosSlicerAvanzado", "unidad");
  asignarValorCampo("baseComisionCanalAvanzado", "precioNeto");
  asignarValorCampo("baseComisionPagoAvanzado", "precioNeto");
  baseComisionCanalBasicoActual = "precioNeto";
  baseComisionPagoBasicoActual = "precioNeto";
  document.querySelector("#cantidadBasico").value = "1";
  document.querySelector("#cantidadAvanzado").value = "1";
  nivelTrabajoBasico.value = "basico";
  manoObraSimpleBasico.value = valoresNivelTrabajo.basico;
  cambiarModoCostoMaterial("basico", true);
  cambiarModoCostoMaterial("avanzado", false);
  actualizarEtiquetasAlcanceSlicer("basico");
  actualizarEtiquetasAlcanceSlicer("avanzado");
  resultBox.textContent = textoInterfaz("resultadoVacio");
  resultBasico.textContent = textoInterfaz("resultadoVacio");
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
  sincronizarVisibilidadPanelesResultado();
  aplicarMaterialBasico();
  aplicarImpresoraBasico();
  aplicarCanalBasico();
  aplicarMaterialAvanzado();
  aplicarImpresoraAvanzado();
  aplicarCanalAvanzado();
  cargarSelectoresFilamentos();
  ultimoResultadoBasico = null;
  ultimoFeeEstimadoBasico = 0;
  ultimosSupuestosBasicos = obtenerSupuestosBasicos();
  sincronizarDesplegablesBasicos({ reiniciar: true });
  cambiarModo("basico");
  actualizarVistaPreviaMoneda();
  renderizarSupuestosBasicos(ultimosSupuestosBasicos);
  window.cambiarIdioma("es");
}

function actualizarPerfilDesdeFormulario(modo) {
  const selector = modo === "basico" ? impresoraBasico : impresoraAvanzado;
  const perfil = obtenerPerfilImpresora(selector);
  if (!perfil) return;
  if (!confirm(textoInterfaz("confirmarActualizarPerfil", { perfil: perfil.nombre }))) return;
  const sufijo = modo === "basico" ? "Basico" : "Avanzado";
  const cambios = {
    costoCompra: leerNumero(`costoImpresora${sufijo}`),
    costoHerramientas: leerNumero(`costoHerramientas${sufijo}`),
    potenciaPromedioWatts: leerNumero(`wattsPromedio${sufijo}`),
    anosVidaUtil: leerNumero(`anosVida${sufijo}`),
    diasOperativosAno: leerNumero(`diasOperativosAno${sufijo}`),
    horasProductivasDia: leerNumero(`horasProductivasDia${sufijo}`),
    porcentajeMantenimiento: leerPorcentaje(`mantenimiento${sufijo}`)
  };
  const actualizada = window.ImpresorasPrecio3D?.actualizarImpresora(perfil.id, cambios);
  if (!actualizada) {
    alert(textoInterfaz("perfilNoActualizado"));
  }
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
document.querySelector("#volverACotizarDesdeResultadoButton")?.addEventListener("click", () => {
  limpiarFormulario();
});
nivelTrabajoBasico.addEventListener("change", actualizarManoObraPorNivel);
materialBasico.addEventListener("change", aplicarMaterialBasico);
filamentoBasico?.addEventListener("change", () => aplicarFilamentoSeleccionado("basico"));
cambiarMonedaFilamentoBasico?.addEventListener("click", () => usarMonedaDeFilamento("basico"));
usarCostoActualFilamentoBasico?.addEventListener("click", () => usarCostoActualFilamento("basico"));
usarCostoManualBasico?.addEventListener("click", () => usarCostoManualFilamento("basico"));
impresoraBasico.addEventListener("change", aplicarImpresoraBasico);
usarValoresManualesBasico?.addEventListener("click", () => {
  impresoraBasico.value = "manual";
  aplicarImpresoraBasico();
  panelSupuestosEditables.hidden = false;
  toggleSupuestosEditables.setAttribute("aria-expanded", "true");
  toggleSupuestosEditables.querySelector(".collapse-indicator").textContent = textoInterfaz("ocultar");
  document.querySelector("#wattsPromedioBasico")?.focus();
});
actualizarPerfilBasico?.addEventListener("click", () => actualizarPerfilDesdeFormulario("basico"));
canalVentaBasico.addEventListener("change", aplicarCanalBasico);
modoCostoGramoBasico.addEventListener("click", () => cambiarModoCostoMaterial("basico", false));
modoCostoKiloBasico.addEventListener("click", () => cambiarModoCostoMaterial("basico", true));
document
  .querySelector("#costoUnidadBasico")
  .addEventListener("input", () => {
    actualizarAyudaCostoMaterial("basico");
    actualizarResumenFilamento("basico");
  });
document.querySelectorAll(
  "#mermaBasico, #wattsPromedioBasico, #tarifaKwhBasico, #costoImpresoraBasico, #costoHerramientasBasico, #anosVidaBasico, #diasOperativosAnoBasico, #horasProductivasDiaBasico, #mantenimientoBasico"
).forEach((input) => {
  input.addEventListener("input", actualizarSupuestosEditablesBasico);
});
document.querySelector("#costoImpresoraBasico")?.addEventListener("input", () => {
  if ((leerNumero("costoImpresoraBasico") || 0) > 0) {
    revisarCostoImpresoraPorCambio.basico = false;
  }

  actualizarAdvertenciaCostoImpresora("basico");
});
document.querySelector("#costoImpresoraAvanzado")?.addEventListener("input", () => {
  if ((leerNumero("costoImpresoraAvanzado") || 0) > 0) {
    revisarCostoImpresoraPorCambio.avanzado = false;
  }

  actualizarAdvertenciaCostoImpresora("avanzado");
});
materialAvanzado.addEventListener("change", aplicarMaterialAvanzado);
filamentoAvanzado?.addEventListener("change", () => aplicarFilamentoSeleccionado("avanzado"));
cambiarMonedaFilamentoAvanzado?.addEventListener("click", () => usarMonedaDeFilamento("avanzado"));
usarCostoActualFilamentoAvanzado?.addEventListener("click", () => usarCostoActualFilamento("avanzado"));
usarCostoManualAvanzado?.addEventListener("click", () => usarCostoManualFilamento("avanzado"));
impresoraAvanzado.addEventListener("change", aplicarImpresoraAvanzado);
actualizarPerfilAvanzado?.addEventListener("click", () => actualizarPerfilDesdeFormulario("avanzado"));
canalVentaAvanzado.addEventListener("change", aplicarCanalAvanzado);
baseComisionCanalAvanzado?.addEventListener("change", () => {
  window.ValidacionPrecio3D?.marcarResultadoDesactualizado?.();
  renderizarComparadorCanales(ultimoDatosCalculo, ultimoResultadoCalculo);
});
baseComisionPagoAvanzado?.addEventListener("change", () => {
  window.ValidacionPrecio3D?.marcarResultadoDesactualizado?.();
  renderizarComparadorCanales(ultimoDatosCalculo, ultimoResultadoCalculo);
});
modoCostoGramoAvanzado.addEventListener("click", () => cambiarModoCostoMaterial("avanzado", false));
modoCostoKiloAvanzado.addEventListener("click", () => cambiarModoCostoMaterial("avanzado", true));
document
  .querySelector("#costoUnidadAvanzado")
  .addEventListener("input", () => {
    actualizarAyudaCostoMaterial("avanzado");
    actualizarResumenFilamento("avanzado");
  });
currencyKeepValuesButton?.addEventListener("click", () => {
  const pendiente = cambioMonedaPendiente;
  if (!pendiente) return;
  aplicarCambioMonedaConfirmado(pendiente.nueva, {
    manual: true,
    conservarValores: true
  });
  cerrarDialogoCambioMoneda();
});
currencyClearValuesButton?.addEventListener("click", () => {
  const pendiente = cambioMonedaPendiente;
  if (!pendiente) return;
  aplicarCambioMonedaConfirmado(pendiente.nueva, {
    manual: true,
    limpiarValores: true
  });
  cerrarDialogoCambioMoneda();
});
currencyCancelButton?.addEventListener("click", cancelarCambioMoneda);
currencyChangeModal?.querySelector("[data-currency-cancel]")?.addEventListener("click", cancelarCambioMoneda);
confirmarRevisionMoneda?.addEventListener("click", confirmarRevisionValoresMoneda);
confirmarRevisionMonedaBasico?.addEventListener("click", confirmarRevisionValoresMoneda);
currencySelect.addEventListener("change", () => {
  sincronizarMonedas(currencySelect, { manual: true });
  actualizarResumenFilamento("avanzado");
});
currencySelectBasico.addEventListener("change", () => {
  sincronizarMonedas(currencySelectBasico, { manual: true });
  actualizarResumenFilamento("basico");
});
detectarMonedaAvanzado?.addEventListener("click", detectarMonedaNuevamente);
detectarMonedaBasico?.addEventListener("click", detectarMonedaNuevamente);
languageSelect.addEventListener("change", () => sincronizarIdiomas(languageSelect));
languageSelectBasico.addEventListener("change", () => sincronizarIdiomas(languageSelectBasico));
metodoPagoComparador.addEventListener("change", () => {
  aplicarMetodoPagoAvanzado();
  window.ValidacionPrecio3D?.marcarResultadoDesactualizado?.();
  renderizarComparadorCanales(ultimoDatosCalculo, ultimoResultadoCalculo);
});
ordenComparadorCanales?.addEventListener("change", () => {
  renderizarComparadorCanales(ultimoDatosCalculo, ultimoResultadoCalculo);
  anunciarAccesible(textoInterfaz("comparadorOrdenado"));
});
guardarConfiguracionButton.addEventListener("click", () => guardarConfiguracionActual(true));
restablecerConfiguracionButton.addEventListener("click", restablecerConfiguracionGuardada);
exportarConfiguracionButton.addEventListener("click", exportarConfiguracion);
importarConfiguracionButton.addEventListener("click", () => importarConfiguracionInput.click());
importarConfiguracionInput.addEventListener("change", importarConfiguracionDesdeArchivo);
guardarTrabajoActualButton.addEventListener("click", guardarTrabajoActual);
nuevoClienteDesdeTrabajoButton?.addEventListener("click", (event) => {
  document.dispatchEvent(new CustomEvent("precio3d:abrir-nuevo-cliente", {
    detail: {
      cliente: trabajoCliente?.value ? { nombre: trabajoCliente.value } : null,
      disparador: event.currentTarget
    }
  }));
});
trabajoClienteGuardado?.addEventListener("change", () => {
  const cliente = obtenerClienteGuardado(trabajoClienteGuardado.value);
  if (cliente) trabajoCliente.value = cliente.nombre;
});
exportarTrabajosButton.addEventListener("click", exportarTrabajosCSV);
exportarTrabajosJsonButton.addEventListener("click", exportarTrabajosJSONDesdeUI);
importarTrabajosButton.addEventListener("click", () => importarTrabajosInput.click());
importarTrabajosInput.addEventListener("change", importarTrabajosDesdeArchivo);
borrarTrabajosButton.addEventListener("click", borrarTodosLosTrabajos);
window.PanelTrabajosPrecio3D?.inicializar({
  cargarTrabajo: cargarTrabajoEnCalculadora,
  generarCotizacion: prepararCotizacionDesdeTrabajo,
  agregarACotizacion: (trabajo) => window.PanelCotizacionesPrecio3D?.agregarTrabajo?.(trabajo),
  mostrarMensaje: mostrarMensajeTrabajos,
  formatearMoneda
});
guardarDatosCotizacionButton.addEventListener("click", guardarDatosCotizacion);
borrarDatosCotizacionButton.addEventListener("click", borrarDatosCotizacionGuardados);
clienteGuardadoCotizacion?.addEventListener("change", () => {
  const cliente = obtenerClienteGuardado(clienteGuardadoCotizacion.value);
  aplicarClienteACotizacion(cliente);
  actualizarVistaCotizacionSiExiste();
});
actualizarClienteDesdeCotizacionButton?.addEventListener("click", actualizarClienteDesdeCotizacion);
generarCotizacionButton.addEventListener("click", renderizarCotizacionCliente);
vistaPreviaCotizacionButton.addEventListener("click", renderizarCotizacionCliente);
imprimirCotizacionButton.addEventListener("click", imprimirCotizacionCliente);
nuevaCotizacionButton?.addEventListener("click", iniciarNuevaCotizacion);
cargarUltimoCalculoButton.addEventListener("click", cargarUltimoCalculoGuardado);
borrarUltimoCalculoButton.addEventListener("click", borrarUltimoCalculoGuardado);
window.addEventListener("precio3d:clientes-actualizados", poblarSelectoresClientes);
window.addEventListener("precio3d:impresoras-actualizadas", cargarSelectoresPerfilesImpresora);
window.addEventListener("precio3d:filamentos-actualizados", cargarSelectoresFilamentos);
[
  "cantidadBasico", "pesoPiezaBasico", "pesoSoportesPurgaBasico", "mermaBasico",
  "cantidadAvanzado", "pesoPiezaAvanzado", "pesoSoportesPurgaAvanzado"
].forEach((id) => document.querySelector(`#${id}`)?.addEventListener("input", () => {
  actualizarResumenFilamento(id.endsWith("Basico") ? "basico" : "avanzado");
}));
document.querySelector("#alcanceDatosSlicerBasico")?.addEventListener("change", () => {
  actualizarEtiquetasAlcanceSlicer("basico");
  actualizarResumenFilamento("basico");
});
document.querySelector("#alcanceDatosSlicerAvanzado")?.addEventListener("change", () => {
  actualizarEtiquetasAlcanceSlicer("avanzado");
  actualizarResumenFilamento("avanzado");
});
document.addEventListener("precio3d:usar-cliente-trabajo", (event) => {
  seleccionarClienteTrabajo(event.detail?.cliente);
});
document.addEventListener("precio3d:usar-cliente-cotizacion", (event) => {
  poblarSelectoresClientes();
  aplicarClienteACotizacion(event.detail?.cliente);
  actualizarVistaCotizacionSiExiste();
});
document.addEventListener("precio3d:cliente-eliminado", (event) => {
  if (event.detail?.clienteId === clienteCotizacionSeleccionadoId) {
    clienteCotizacionSeleccionadoId = "";
    if (clienteGuardadoCotizacion) clienteGuardadoCotizacion.value = "";
    actualizarClienteDesdeCotizacionButton.disabled = true;
  }
  renderizarTrabajos();
});

ubicarCostosInternosEnModoBasico();
cargarMonedas();
cargarIdiomas();
cargarPresetsVisuales();
cargarSelectoresFilamentos();
cargarMetodosPagoComparador();
aplicarMaterialBasico();
aplicarImpresoraBasico();
aplicarCanalBasico();
aplicarMaterialAvanzado();
aplicarImpresoraAvanzado();
aplicarCanalAvanzado();
actualizarAdvertenciaCostoImpresora("basico");
actualizarAdvertenciaCostoImpresora("avanzado");
cambiarModo("basico");
ultimosSupuestosBasicos = obtenerSupuestosBasicos();
actualizarEtiquetasAlcanceSlicer("basico");
actualizarEtiquetasAlcanceSlicer("avanzado");
actualizarVistaPreviaMoneda();
renderizarSupuestosBasicos(ultimosSupuestosBasicos);
cargarConfiguracionInicial();
inicializarDeteccionMoneda();
cargarDatosCotizacionIniciales();
window.PanelCotizacionesPrecio3D?.inicializar({
  obtenerCalculoActual: () => ({
    datos: ultimoDatosCalculo ? { ...ultimoDatosCalculo } : null,
    resultado: ultimoResultadoCalculo ? { ...ultimoResultadoCalculo } : null
  }),
  obtenerDatosNegocio: obtenerDatosNegocioFormulario,
  obtenerDatosCliente: obtenerDatosClienteCotizacionFormulario,
  obtenerCondiciones: obtenerConfigCotizacionFormulario,
  formatearMoneda
});
renderizarUltimoCalculoGuardado();
sincronizarVisibilidadPanelesResultado();
renderizarTrabajos();
registrarAutoguardado();







// Comparador de canales usando el mismo motor de formulas.
function normalizarNumeroComparador(valor) {
  const numero = Number(valor);

  if (!Number.isFinite(numero) || numero < 0) {
    return 0;
  }

  return numero;
}

function clonarDatos(datos) {
  return { ...(datos || {}) };
}

function obtenerMetodosPago() {
  return Array.isArray(window.PresetsPrecio3D?.metodosPago)
    ? window.PresetsPrecio3D.metodosPago
    : [];
}

function obtenerMetodoPorId(id) {
  return obtenerMetodosPago().find((metodo) => metodo.id === id) || null;
}

function obtenerMetodoSeleccionado(metodoPagoSeleccionado, canal) {
  const idSeleccionado =
    typeof metodoPagoSeleccionado === "string"
      ? metodoPagoSeleccionado
      : metodoPagoSeleccionado?.id;

  if (!idSeleccionado || idSeleccionado === "automatico") {
    if (canal?.integraPago) {
      return obtenerMetodoPorId("pago-integrado-marketplace");
    }

    return (
      obtenerMetodoPorId(canal?.metodoPagoSugerido) ||
      obtenerMetodoPorId("transferencia") ||
      null
    );
  }

  return obtenerMetodoPorId(idSeleccionado) || null;
}

function calcularFeesEstimados(resumen) {
  if (!resumen || resumen.precioNeto === null) {
    return null;
  }

  return (
    normalizarNumeroComparador(resumen.feeFijoTotal) +
    normalizarNumeroComparador(resumen.precioNeto) *
      normalizarNumeroComparador(resumen.feePorcentualTotal)
  );
}

function crearNota(canal, metodo, pagoExternoAplicado, metodoSolicitado) {
  const notas = [];

  if (canal?.nota) {
    notas.push(canal.nota);
  }

  if (
    canal?.integraPago &&
    canal?.permitePagoExterno === false &&
    metodoSolicitado &&
    metodoSolicitado !== "automatico"
  ) {
    notas.push(
      "No se suma método de pago externo porque este canal ya integra el cobro."
    );
  }

  if (metodo?.nota && pagoExternoAplicado) {
    notas.push(metodo.nota);
  }

  return notas.join(" ");
}

function resolverPagoCanal(canal, metodoPagoSeleccionado) {
  const idSolicitado =
    typeof metodoPagoSeleccionado === "string"
      ? metodoPagoSeleccionado
      : metodoPagoSeleccionado?.id;
  const metodo = obtenerMetodoSeleccionado(metodoPagoSeleccionado, canal);
  const canalIntegraPago = Boolean(canal?.integraPago);
  const permiteExterno = canal?.permitePagoExterno !== false;
  const esPagoIntegrado = metodo?.id === "pago-integrado-marketplace";
  const pagoExternoAplicado = Boolean(metodo && !esPagoIntegrado && (!canalIntegraPago || permiteExterno));
  const metodoIntegrado = obtenerMetodoPorId("pago-integrado-marketplace");
  const metodoAplicado =
    canalIntegraPago && !permiteExterno && !pagoExternoAplicado
      ? metodoIntegrado || metodo
      : metodo;
  const feeFijoPago = pagoExternoAplicado ? normalizarNumeroComparador(metodo.feeFijoPago) : 0;
  const feePorcentajePago = pagoExternoAplicado
    ? normalizarNumeroComparador(metodo.feePorcentajePago) +
      normalizarNumeroComparador(metodo.recargoInternacional)
    : 0;

  return {
    metodoPagoAplicado: metodoAplicado?.nombre || "Sin método",
    pagoExternoAplicado,
    feeFijoPago,
    feePorcentajePago,
    nota: crearNota(canal, metodo, pagoExternoAplicado, idSolicitado)
  };
}

function crearResultadoInvalido(canal, pago, feeFijoCanal, feePorcentajeCanal) {
  const feeFijoTotal = feeFijoCanal + pago.feeFijoPago;
  const feePorcentualTotal = feePorcentajeCanal + pago.feePorcentajePago;

  return {
    canalId: canal?.id || "canal-invalido",
    canalNombre: canal?.nombre || "Canal inválido",
    metodoPagoAplicado: pago.metodoPagoAplicado,
    pagoExternoAplicado: pago.pagoExternoAplicado,
    feeFijoCanal,
    feePorcentajeCanal,
    feeFijoPago: pago.feeFijoPago,
    feePorcentajePago: pago.feePorcentajePago,
    feeFijoTotal,
    feePorcentualTotal,
    precioFinal: null,
    costoTotal: null,
    utilidadObjetivo: null,
    utilidadReal: null,
    margenReal: null,
    feesEstimados: null,
    diferenciaVsVentaDirecta: null,
    nota: `${pago.nota || ""} Fee porcentual total inválido.`
  };
}

function crearResultadoCanal(datosBase, canal, metodoPagoSeleccionado) {
  const feeFijoCanal = normalizarNumeroComparador(canal?.feeFijo);
  const feePorcentajeCanal = normalizarNumeroComparador(canal?.feePorcentaje);
  const pago = resolverPagoCanal(canal, metodoPagoSeleccionado);
  const feeFijoTotal = feeFijoCanal + pago.feeFijoPago;
  const feePorcentualTotal = feePorcentajeCanal + pago.feePorcentajePago;

  if (feePorcentualTotal >= 1) {
    return crearResultadoInvalido(canal, pago, feeFijoCanal, feePorcentajeCanal);
  }

  const datosCanal = clonarDatos(datosBase);
  datosCanal.feeFijoTotal = feeFijoTotal;
  datosCanal.feePorcentualTotal = feePorcentualTotal;
  datosCanal.feeMarketplaceFijo = 0;
  datosCanal.feeMarketplacePorcentual = 0;
  datosCanal.feePagoFijo = 0;
  datosCanal.feePagoPorcentual = 0;

  const resumen = window.FormulasPrecio3D.calcularResumenCompleto(datosCanal);
  const feesEstimados = calcularFeesEstimados(resumen);
  const utilidadReal =
    resumen.precioNeto === null
      ? null
      : resumen.precioNeto - resumen.costoTotal - normalizarNumeroComparador(feesEstimados);
  const margenReal =
    resumen.precioNeto > 0 && utilidadReal !== null ? utilidadReal / resumen.precioNeto : null;

  return {
    canalId: canal?.id || "canal",
    canalNombre: canal?.nombre || "Canal",
    metodoPagoAplicado: pago.metodoPagoAplicado,
    pagoExternoAplicado: pago.pagoExternoAplicado,
    feeFijoCanal,
    feePorcentajeCanal,
    feeFijoPago: pago.feeFijoPago,
    feePorcentajePago: pago.feePorcentajePago,
    feeFijoTotal,
    feePorcentualTotal,
    precioFinal: resumen.precioFinal,
    costoTotal: resumen.costoTotal,
    utilidadObjetivo: resumen.utilidadObjetivo,
    utilidadReal,
    margenReal,
    feesEstimados,
    diferenciaVsVentaDirecta: null,
    nota: pago.nota
  };
}

function compararCanales(datosBase, canales, metodoPagoSeleccionado = "automatico") {
  const listaCanales = Array.isArray(canales) ? canales : [];

  if (!datosBase || !window.FormulasPrecio3D?.calcularResumenCompleto) {
    return [];
  }

  const resultados = listaCanales.map((canal) =>
    crearResultadoCanal(datosBase, canal, metodoPagoSeleccionado)
  );
  const ventaDirecta = resultados.find((resultado) => resultado.canalId === "venta-directa");
  const precioVentaDirecta = normalizarNumeroComparador(ventaDirecta?.precioFinal);

  return resultados.map((resultado) => ({
    ...resultado,
    diferenciaVsVentaDirecta:
      resultado.precioFinal === null || precioVentaDirecta === 0
        ? null
        : resultado.precioFinal - precioVentaDirecta
  }));
}

window.ComparadorPrecio3D = {
  compararCanales
};

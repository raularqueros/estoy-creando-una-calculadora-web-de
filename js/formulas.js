// Normaliza valores vacios, invalidos o negativos a cero.
function normalizarNumero(valor) {
  const numero = Number(valor);

  if (!Number.isFinite(numero) || numero < 0) {
    return 0;
  }

  return numero;
}

// Calcula el costo del material usado en la pieza.
function calcularCostoMaterial(pesoPieza, pesoSoportesPurga, costoUnidad, merma) {
  const pesoTotal = normalizarNumero(pesoPieza) + normalizarNumero(pesoSoportesPurga);
  const costo = normalizarNumero(costoUnidad);
  const factorMerma = 1 + normalizarNumero(merma);

  return pesoTotal * costo * factorMerma;
}

// Calcula el costo electrico usando horas, watts y tarifa por kWh.
function calcularCostoElectricidad(horasImpresion, wattsPromedio, tarifaKwh) {
  const horas = normalizarNumero(horasImpresion);
  const kw = normalizarNumero(wattsPromedio) / 1000;
  const tarifa = normalizarNumero(tarifaKwh);

  return horas * kw * tarifa;
}

// Calcula el costo por hora asociado al equipo.
function calcularCostoEquipoHora(
  costoImpresora,
  costoHerramientas,
  mantenimiento,
  anosVida,
  diasOperativosAno,
  horasProductivasDia
) {
  const inversion = normalizarNumero(costoImpresora) + normalizarNumero(costoHerramientas);
  const factorMantenimiento = 1 + normalizarNumero(mantenimiento);
  const horasVidaUtil =
    normalizarNumero(anosVida) *
    normalizarNumero(diasOperativosAno) *
    normalizarNumero(horasProductivasDia);

  if (horasVidaUtil === 0) {
    return 0;
  }

  return (inversion * factorMantenimiento) / horasVidaUtil;
}

// Calcula la amortizacion consumida por el trabajo.
function calcularAmortizacion(costoEquipoHora, horasImpresion) {
  return normalizarNumero(costoEquipoHora) * normalizarNumero(horasImpresion);
}

// Calcula el costo de mano de obra.
function calcularManoObra(horasPreparacion, horasPostprocesado, horasQA, tarifaHora) {
  const horasTotales =
    normalizarNumero(horasPreparacion) +
    normalizarNumero(horasPostprocesado) +
    normalizarNumero(horasQA);

  return horasTotales * normalizarNumero(tarifaHora);
}

// Suma los costos logisticos del pedido.
function calcularCostoLogistico(embalaje, envio, seguro, aduanas) {
  return (
    normalizarNumero(embalaje) +
    normalizarNumero(envio) +
    normalizarNumero(seguro) +
    normalizarNumero(aduanas)
  );
}

// Suma los costos principales antes de utilidad, fees e impuestos.
function calcularCostoTotal(datos) {
  const valores = datos || {};

  return (
    normalizarNumero(valores.costoMaterial) +
    normalizarNumero(valores.costoElectricidad) +
    normalizarNumero(valores.costoAmortizacion) +
    normalizarNumero(valores.costoManoObra) +
    normalizarNumero(valores.costoLogistico) +
    normalizarNumero(valores.marketing) +
    normalizarNumero(valores.otrosCostos)
  );
}

// Calcula la utilidad deseada segun el margen.
function calcularUtilidadObjetivo(costoTotal, margen) {
  return normalizarNumero(costoTotal) * normalizarNumero(margen);
}

// Calcula el precio neto considerando fees fijos y porcentuales.
function calcularPrecioNeto(costoTotal, utilidad, feeFijoTotal, feePorcentualTotal) {
  const feePorcentual = normalizarNumero(feePorcentualTotal);

  if (feePorcentual >= 1) {
    return null;
  }

  return (
    (normalizarNumero(costoTotal) +
      normalizarNumero(utilidad) +
      normalizarNumero(feeFijoTotal)) /
    (1 - feePorcentual)
  );
}

// Calcula el impuesto aplicado sobre el precio neto.
function calcularImpuesto(precioNeto, tasaImpuesto) {
  return normalizarNumero(precioNeto) * normalizarNumero(tasaImpuesto);
}

// Calcula el precio final con impuesto incluido.
function calcularPrecioFinal(precioNeto, impuesto) {
  return normalizarNumero(precioNeto) + normalizarNumero(impuesto);
}

// Genera un resumen completo de costos y precio final.
function calcularResumenCompleto(datos) {
  const valores = datos || {};
  const costoMaterial = calcularCostoMaterial(
    valores.pesoPieza,
    valores.pesoSoportesPurga,
    valores.costoUnidad,
    valores.merma
  );
  const costoElectricidad = calcularCostoElectricidad(
    valores.horasImpresion,
    valores.wattsPromedio,
    valores.tarifaKwh
  );
  const costoEquipoHora = calcularCostoEquipoHora(
    valores.costoImpresora,
    valores.costoHerramientas,
    valores.mantenimiento,
    valores.anosVida,
    valores.diasOperativosAno,
    valores.horasProductivasDia
  );
  const costoAmortizacion = calcularAmortizacion(costoEquipoHora, valores.horasImpresion);
  const costoManoObra = calcularManoObra(
    valores.horasPreparacion,
    valores.horasPostprocesado,
    valores.horasQA,
    valores.tarifaHora
  );
  const costoLogistico = calcularCostoLogistico(
    valores.embalaje,
    valores.envio,
    valores.seguro,
    valores.aduanas
  );
  const costoTotal = calcularCostoTotal({
    costoMaterial,
    costoElectricidad,
    costoAmortizacion,
    costoManoObra,
    costoLogistico,
    marketing: valores.marketing,
    otrosCostos: valores.otrosCostos
  });
  const utilidadObjetivo = calcularUtilidadObjetivo(costoTotal, valores.margen);
  const feeFijoTotal =
    normalizarNumero(valores.feeFijoTotal) +
    normalizarNumero(valores.feeMarketplaceFijo) +
    normalizarNumero(valores.feePagoFijo);
  const feePorcentualTotal =
    normalizarNumero(valores.feePorcentualTotal) +
    normalizarNumero(valores.feeMarketplacePorcentual) +
    normalizarNumero(valores.feePagoPorcentual);
  const precioNeto = calcularPrecioNeto(
    costoTotal,
    utilidadObjetivo,
    feeFijoTotal,
    feePorcentualTotal
  );
  const impuesto = precioNeto === null ? null : calcularImpuesto(precioNeto, valores.tasaImpuesto);
  const precioFinal = precioNeto === null ? null : calcularPrecioFinal(precioNeto, impuesto);

  return {
    costoMaterial,
    costoElectricidad,
    costoEquipoHora,
    costoAmortizacion,
    costoManoObra,
    costoLogistico,
    costoTotal,
    utilidadObjetivo,
    feeFijoTotal,
    feePorcentualTotal,
    precioNeto,
    impuesto,
    precioFinal
  };
}

// Expone el motor de formulas para usarlo desde la pagina.
window.FormulasPrecio3D = {
  calcularCostoMaterial,
  calcularCostoElectricidad,
  calcularCostoEquipoHora,
  calcularAmortizacion,
  calcularManoObra,
  calcularCostoLogistico,
  calcularCostoTotal,
  calcularUtilidadObjetivo,
  calcularPrecioNeto,
  calcularImpuesto,
  calcularPrecioFinal,
  calcularResumenCompleto
};

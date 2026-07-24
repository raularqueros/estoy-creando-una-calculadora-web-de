// Presets editables para alimentar los modos básico y avanzado.
const materiales = [
  {
    id: "pla",
    nombre: "PLA",
    tecnologia: "FDM",
    unidad: "gramo",
    costoUnidad: 20,
    mermaSugerida: 0.1,
    editable: true,
    nota: "Material común para piezas generales."
  },
  {
    id: "petg",
    nombre: "PETG",
    tecnologia: "FDM",
    unidad: "gramo",
    costoUnidad: 24,
    mermaSugerida: 0.12,
    editable: true,
    nota: "Buena resistencia y uso funcional."
  },
  {
    id: "abs",
    nombre: "ABS",
    tecnologia: "FDM",
    unidad: "gramo",
    costoUnidad: 26,
    mermaSugerida: 0.15,
    editable: true,
    nota: "Requiere más control de temperatura."
  },
  {
    id: "tpu",
    nombre: "TPU",
    tecnologia: "FDM",
    unidad: "gramo",
    costoUnidad: 35,
    mermaSugerida: 0.15,
    editable: true,
    nota: "Flexible y más lento de imprimir."
  },
  {
    id: "resina-estandar",
    nombre: "Resina estándar",
    tecnologia: "Resina",
    unidad: "gramo",
    costoUnidad: 45,
    mermaSugerida: 0.18,
    editable: true,
    nota: "Pensada para impresión en resina."
  },
  {
    id: "otro-personalizado",
    nombre: "Otro personalizado",
    tecnologia: "Personalizada",
    unidad: "gramo",
    costoUnidad: 0,
    mermaSugerida: 0.1,
    editable: true,
    nota: "Completa el costo manualmente."
  }
];

const impresoras = [
  {
    id: "bambu-lab-a1",
    nombre: "Bambu Lab A1",
    tecnologia: "FDM",
    wattsPromedio: 120,
    costoImpresora: 700000,
    costoHerramientas: 50000,
    anosVida: 2,
    diasOperativosAno: 300,
    horasProductivasDia: 8,
    mantenimiento: 0.05,
    editable: true,
    nota: "Preset base para cotización rápida."
  },
  {
    id: "bambu-lab-p1s",
    nombre: "Bambu Lab P1S",
    tecnologia: "FDM",
    wattsPromedio: 160,
    costoImpresora: 1100000,
    costoHerramientas: 70000,
    anosVida: 3,
    diasOperativosAno: 300,
    horasProductivasDia: 8,
    mantenimiento: 0.06,
    editable: true,
    nota: "Equipo cerrado para producción más estable."
  },
  {
    id: "creality-generica",
    nombre: "Creality genérica",
    tecnologia: "FDM",
    wattsPromedio: 140,
    costoImpresora: 350000,
    costoHerramientas: 40000,
    anosVida: 2,
    diasOperativosAno: 260,
    horasProductivasDia: 6,
    mantenimiento: 0.08,
    editable: true,
    nota: "Preset genérico para máquinas tipo Ender."
  },
  {
    id: "prusa-generica",
    nombre: "Prusa genérica",
    tecnologia: "FDM",
    wattsPromedio: 130,
    costoImpresora: 850000,
    costoHerramientas: 60000,
    anosVida: 3,
    diasOperativosAno: 300,
    horasProductivasDia: 8,
    mantenimiento: 0.05,
    editable: true,
    nota: "Preset genérico para equipos Prusa."
  },
  {
    id: "resina-generica",
    nombre: "Resina genérica",
    tecnologia: "Resina",
    wattsPromedio: 90,
    costoImpresora: 450000,
    costoHerramientas: 80000,
    anosVida: 2,
    diasOperativosAno: 260,
    horasProductivasDia: 6,
    mantenimiento: 0.08,
    editable: true,
    nota: "Incluye mayor gasto de herramientas y limpieza."
  },
  {
    id: "otra-personalizada",
    nombre: "Otra personalizada",
    tecnologia: "Personalizada",
    wattsPromedio: 120,
    costoImpresora: 700000,
    costoHerramientas: 50000,
    anosVida: 2,
    diasOperativosAno: 300,
    horasProductivasDia: 8,
    mantenimiento: 0.05,
    editable: true,
    nota: "Ajusta los valores manualmente si hace falta."
  }
];

const canalesVenta = [
  {
    id: "venta-directa",
    nombre: "Venta directa",
    feeFijo: 0,
    feePorcentaje: 0,
    integraPago: false,
    permitePagoExterno: true,
    metodoPagoSugerido: "transferencia",
    editable: true,
    nota: "Sin comisión de plataforma."
  },
  {
    id: "tienda-propia",
    nombre: "Tienda propia",
    feeFijo: 0,
    feePorcentaje: 0.03,
    integraPago: false,
    permitePagoExterno: true,
    metodoPagoSugerido: "stripe",
    editable: true,
    nota: "Referencia para costos de tienda y pasarela."
  },
  {
    id: "marketplace-generico",
    nombre: "Marketplace genérico",
    feeFijo: 300,
    feePorcentaje: 0.1,
    integraPago: true,
    permitePagoExterno: false,
    metodoPagoSugerido: "pago-integrado-marketplace",
    editable: true,
    nota: "Preset genérico para plataformas."
  },
  {
    id: "etsy",
    nombre: "Etsy",
    feeFijo: 300,
    feePorcentaje: 0.12,
    integraPago: true,
    permitePagoExterno: false,
    metodoPagoSugerido: "pago-integrado-marketplace",
    editable: true,
    nota: "Referencia editable, no tarifa oficial."
  },
  {
    id: "ebay",
    nombre: "eBay",
    feeFijo: 300,
    feePorcentaje: 0.13,
    integraPago: true,
    permitePagoExterno: false,
    metodoPagoSugerido: "pago-integrado-marketplace",
    editable: true,
    nota: "Referencia editable, no tarifa oficial."
  },
  {
    id: "amazon",
    nombre: "Amazon",
    feeFijo: 500,
    feePorcentaje: 0.15,
    integraPago: true,
    permitePagoExterno: false,
    metodoPagoSugerido: "pago-integrado-marketplace",
    editable: true,
    nota: "Referencia editable, no tarifa oficial."
  },
  {
    id: "mercado-libre",
    nombre: "Mercado Libre",
    feeFijo: 500,
    feePorcentaje: 0.14,
    integraPago: true,
    permitePagoExterno: false,
    metodoPagoSugerido: "pago-integrado-marketplace",
    editable: true,
    nota: "Referencia editable, no tarifa oficial."
  },
  {
    id: "otro-personalizado",
    nombre: "Otro personalizado",
    feeFijo: 0,
    feePorcentaje: 0,
    integraPago: false,
    permitePagoExterno: true,
    metodoPagoSugerido: "transferencia",
    editable: true,
    nota: "Completa los fees manualmente."
  }
];

const metodosPago = [
  {
    id: "efectivo",
    nombre: "Efectivo",
    feeFijoPago: 0,
    feePorcentajePago: 0,
    recargoInternacional: 0,
    editable: true,
    nota: "Pago sin fee externo."
  },
  {
    id: "transferencia",
    nombre: "Transferencia",
    feeFijoPago: 0,
    feePorcentajePago: 0,
    recargoInternacional: 0,
    editable: true,
    nota: "Pago directo."
  },
  {
    id: "stripe",
    nombre: "Stripe",
    feeFijoPago: 0,
    feePorcentajePago: 0.035,
    recargoInternacional: 0,
    editable: true,
    nota: "Referencia editable, no tarifa oficial."
  },
  {
    id: "paypal",
    nombre: "PayPal",
    feeFijoPago: 0,
    feePorcentajePago: 0.055,
    recargoInternacional: 0,
    editable: true,
    nota: "Referencia editable, no tarifa oficial."
  },
  {
    id: "pago-integrado-marketplace",
    nombre: "Pago integrado del marketplace",
    feeFijoPago: 0,
    feePorcentajePago: 0,
    recargoInternacional: 0,
    editable: false,
    nota: "El cobro ya se considera dentro del fee del canal."
  },
  {
    id: "otro-personalizado",
    nombre: "Otro personalizado",
    feeFijoPago: 0,
    feePorcentajePago: 0,
    recargoInternacional: 0,
    editable: true,
    nota: "Completa manualmente."
  }
];

const impuestos = [
  { id: "sin-impuesto", nombre: "Sin impuesto", tasa: 0, editable: true, nota: "No agrega impuesto." },
  { id: "iva-editable", nombre: "IVA editable", tasa: 0.19, editable: true, nota: "Ajusta la tasa según corresponda." },
  { id: "vat-editable", nombre: "VAT editable", tasa: 0.2, editable: true, nota: "Ajusta la tasa según corresponda." },
  { id: "sales-tax-editable", nombre: "Sales Tax editable", tasa: 0.08, editable: true, nota: "Ajusta la tasa según corresponda." },
  { id: "otro-personalizado", nombre: "Otro personalizado", tasa: 0, editable: true, nota: "Completa manualmente." }
];

const envios = [
  { id: "retiro-en-tienda", nombre: "Retiro en tienda", editable: true, nota: "Sin costo de envío por defecto." },
  { id: "envio-manual", nombre: "Envío manual", editable: true, nota: "Ingresa el costo manualmente." },
  { id: "peso-real", nombre: "Peso real", editable: true, nota: "Preparado para cálculo futuro." },
  { id: "peso-volumetrico", nombre: "Peso volumétrico", editable: true, nota: "Preparado para cálculo futuro." },
  { id: "otro-personalizado", nombre: "Otro personalizado", editable: true, nota: "Completa manualmente." }
];

const supuestosBasicos = {
  merma: 0.1,
  wattsPromedio: 120,
  tarifaKwh: 180,
  costoImpresora: 700000,
  costoHerramientas: 50000,
  anosVida: 2,
  diasOperativosAno: 300,
  horasProductivasDia: 8,
  mantenimiento: 0.05,
  horasPreparacion: 0,
  horasPostprocesado: 0,
  horasQA: 0,
  seguro: 0,
  aduanas: 0,
  marketing: 0,
  otrosCostos: 0
};

const clavesNombrePreset = {
  materiales: {
    "resina-estandar": "presetResinaEstandar",
    "otro-personalizado": "presetOtroPersonalizado"
  },
  impresoras: {
    "creality-generica": "presetCrealityGenerica",
    "prusa-generica": "presetPrusaGenerica",
    "resina-generica": "presetResinaGenerica",
    "otra-personalizada": "presetOtraPersonalizada"
  },
  canalesVenta: {
    "venta-directa": "presetVentaDirecta",
    "tienda-propia": "presetTiendaPropia",
    "marketplace-generico": "presetMarketplaceGenerico",
    "otro-personalizado": "presetOtroPersonalizado"
  },
  metodosPago: {
    efectivo: "presetEfectivo",
    transferencia: "presetTransferencia",
    "pago-integrado-marketplace": "presetPagoIntegrado",
    "otro-personalizado": "presetOtroPersonalizado"
  },
  impuestos: {
    "sin-impuesto": "presetSinImpuesto",
    "otro-personalizado": "presetOtroPersonalizado"
  },
  envios: {
    "retiro-en-tienda": "presetRetiroTienda",
    "envio-manual": "presetEnvioManual",
    "peso-real": "presetPesoReal",
    "peso-volumetrico": "presetPesoVolumetrico",
    "otro-personalizado": "presetOtroPersonalizado"
  }
};

function obtenerNombrePreset(tipo, item, idioma = document.documentElement.lang || "es") {
  const clave = clavesNombrePreset[tipo]?.[item?.id];
  return clave
    ? window.obtenerTextoI18n?.(clave, {}, idioma) || item.nombre
    : item?.nombre || "";
}

window.PresetsPrecio3D = {
  materiales,
  impresoras,
  canalesVenta,
  metodosPago,
  impuestos,
  envios,
  supuestosBasicos,
  obtenerNombrePreset
};

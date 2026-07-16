const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.resolve(__dirname, "..");
const memory = new Map();
let downloadedName = "";

const localStorage = {
  getItem(key) { return memory.has(key) ? memory.get(key) : null; },
  setItem(key, value) { memory.set(key, String(value)); },
  removeItem(key) { memory.delete(key); },
  clear() { memory.clear(); }
};

const document = {
  readyState: "complete",
  querySelector() { return null; },
  addEventListener() {},
  createElement(tag) {
    if (tag !== "a") return {};
    return {
      href: "",
      download: "",
      click() { downloadedName = this.download; },
      remove() {}
    };
  },
  body: { appendChild() {} }
};

const context = {
  console,
  localStorage,
  document,
  CustomEvent: class CustomEvent { constructor(type) { this.type = type; } },
  Blob,
  TextEncoder,
  Intl,
  Date,
  Math,
  JSON,
  Number,
  String,
  Set,
  Map,
  Object,
  Array,
  URL: { createObjectURL() { return "blob:test"; }, revokeObjectURL() {} },
  setTimeout(callback) { callback(); },
  crypto: { randomUUID() { return `uuid-${Math.random().toString(16).slice(2)}`; } }
};
context.window = context;
context.globalThis = context;
context.dispatchEvent = () => {};
context.addEventListener = () => {};
context.MonedasPrecio3D = [{ codigo: "CLP" }, { codigo: "USD" }];
context.StoragePrecio3D = {
  cargarConfiguracion() {
    return JSON.parse(localStorage.getItem("precio3d_config_v1") || "{}").configuracion || {};
  },
  cargarDatosNegocio() {
    return JSON.parse(localStorage.getItem("precio3d_datos_negocio_v1") || "{}").datosNegocio || {};
  },
  cargarConfigCotizacion() {
    return JSON.parse(localStorage.getItem("precio3d_cotizacion_config_v1") || "{}").configCotizacion || {};
  },
  cargarTrabajos() {
    return JSON.parse(localStorage.getItem("precio3d_trabajos_v1") || "{}").trabajos || [];
  }
};
context.CotizacionesPrecio3D = {
  calcularTotales(cotizacion) { return { totalFinal: Number(cotizacion.totalFinal) }; }
};

vm.createContext(context);
vm.runInContext(fs.readFileSync(path.join(root, "js", "formulas.js"), "utf8"), context, { filename: "formulas.js" });
vm.runInContext(fs.readFileSync(path.join(root, "js", "backup.js"), "utf8"), context, { filename: "backup.js" });

const api = context.RespaldoPrecio3D;
assert.ok(api, "window.RespaldoPrecio3D debe existir");

function seed() {
  localStorage.clear();
  localStorage.setItem("precio3d_config_v1", JSON.stringify({ version: 1, configuracion: { moneda: "CLP", idioma: "es" } }));
  localStorage.setItem("precio3d_datos_negocio_v1", JSON.stringify({ version: 1, datosNegocio: { nombreNegocio: "Taller 3D" } }));
  localStorage.setItem("precio3d_cotizacion_config_v1", JSON.stringify({ version: 1, configCotizacion: { validezCotizacionDias: 7 } }));
  localStorage.setItem("precio3d_clientes_v1", JSON.stringify({ version: 1, clientes: [
    { id: "cli-1", nombre: "Ana", correo: "ana@example.com" },
    { id: "cli-2", nombre: "Luis", telefono: "+56911112222" }
  ] }));
  localStorage.setItem("precio3d_cotizaciones_v2", JSON.stringify({ version: 2, cotizaciones: [
    { id: "cot-1", numeroCotizacion: "COT-20260715-001", clienteId: "cli-1", snapshotCliente: { nombre: "Ana" }, items: [{ id: "it-1", cantidad: 1, precioUnitario: 1000 }], totalFinal: 1000, moneda: "CLP" },
    { id: "cot-2", numeroCotizacion: "COT-20260715-002", clienteId: "cli-2", snapshotCliente: { nombre: "Luis" }, items: [{ id: "it-2", cantidad: 2, precioUnitario: 800 }], totalFinal: 1600, moneda: "CLP" }
  ] }));
  localStorage.setItem("precio3d_trabajos_v1", JSON.stringify({ version: 2, trabajos: [
    { id: "job-1", nombreTrabajo: "Llavero", estado: "Pagado", clienteId: "cli-1", cotizacionId: "cot-1", precioFinal: 1000, costoTotal: 600, utilidadObjetivo: 400, saldoPendiente: 0, pagos: [{ id: "pay-1", monto: 1000, fecha: "2026-07-15" }], datos: { filamentoSnapshot: { nombre: "PLA Negro" } } },
    { id: "job-2", nombreTrabajo: "Soporte", estado: "Pendiente", clienteId: "cli-2", cotizacionId: "cot-2", precioFinal: 1600, costoTotal: 900, utilidadObjetivo: 700, saldoPendiente: 1600, pagos: [] }
  ] }));
  localStorage.setItem("precio3d_impresoras_v1", JSON.stringify([
    { id: "printer-1", nombre: "A1", costoCompra: 700000, costoHerramientas: 50000, potenciaPromedioWatts: 120, porcentajeMantenimiento: 5, anosVidaUtil: 2, diasOperativosAno: 300, horasProductivasDia: 8, esPredeterminada: true },
    { id: "printer-2", nombre: "P1S", costoCompra: 900000, costoHerramientas: 50000, potenciaPromedioWatts: 140, porcentajeMantenimiento: 5, anosVidaUtil: 3, diasOperativosAno: 300, horasProductivasDia: 8 }
  ]));
  localStorage.setItem("precio3d_filamentos_v1", JSON.stringify({ version: 1, bobinas: [
    { id: "fil-1", nombre: "PLA Negro", modoCosto: "precio_kilo", precioPorKilo: 12000, pesoNetoInicialGramos: 1000, pesoRestanteGramos: 900, estado: "Abierta", movimientos: [{ id: "mov-1", tipo: "consumo_manual", cantidadGramos: 100, stockAnterior: 1000, stockNuevo: 900, createdAt: "2026-07-15T10:00:00.000Z" }] },
    { id: "fil-2", nombre: "PETG Azul", modoCosto: "precio_kilo", precioPorKilo: 15000, pesoNetoInicialGramos: 1000, pesoRestanteGramos: 1000, estado: "Sellada", movimientos: [] }
  ] }));
  localStorage.setItem("precio3d_cotizacion_contador_v1", JSON.stringify({ fecha: "20260715", valor: 2 }));
}

seed();
const completo = api.crearRespaldoCompleto();
assert.equal(completo.backupVersion, 2);
assert.deepEqual(JSON.parse(JSON.stringify(completo.metadata)), { totalClientes: 2, totalCotizaciones: 2, totalTrabajos: 2, totalImpresoras: 2, totalBobinas: 2, totalMovimientos: 1 });
assert.equal(completo.data.trabajos[0].pagos[0].id, "pay-1", "debe conservar pagos");
assert.equal(completo.data.filamentos[0].movimientos[0].id, "mov-1", "debe conservar movimientos");
assert.equal(completo.data.trabajos[0].datos.filamentoSnapshot.nombre, "PLA Negro", "debe conservar snapshots");

api.descargarRespaldoCompleto();
assert.match(downloadedName, /^respaldo-precio3d-\d{4}-\d{2}-\d{2}-\d{4}\.json$/);

const antesInvalido = JSON.stringify([...memory.entries()]);
assert.equal(api.importarRespaldo("{invalido").ok, false);
assert.equal(JSON.stringify([...memory.entries()]), antesInvalido, "JSON inválido no debe modificar datos");
const futuro = JSON.parse(JSON.stringify(completo));
futuro.backupVersion = 99;
assert.equal(api.validarRespaldo(futuro).valido, false, "una versión futura debe rechazarse");
assert.equal(api.validarRespaldo('{"app":"precio3d","backupVersion":2,"data":{"__proto__":{}}}').valido, false, "debe rechazar claves peligrosas");

const vista = api.previsualizarImportacion(JSON.stringify(completo));
assert.equal(vista.valido, true);
assert.equal(vista.resumen.totalClientes, 2);
assert.equal(vista.resumen.totalMovimientos, 1);

const conNuevoCliente = JSON.parse(JSON.stringify(completo));
conNuevoCliente.data.clientes[0].nombre = "Ana importada";
conNuevoCliente.data.clientes.push({ id: "cli-3", nombre: "Marta" });
const combinado = api.importarRespaldo(conNuevoCliente, { modo: "combinar", conflictos: "actual" });
assert.equal(combinado.ok, true);
const clientesCombinados = JSON.parse(localStorage.getItem("precio3d_clientes_v1")).clientes;
assert.equal(clientesCombinados.length, 3);
assert.equal(clientesCombinados.find((item) => item.id === "cli-1").nombre, "Ana");

const movimientoRepetido = JSON.parse(JSON.stringify(completo));
movimientoRepetido.data.filamentos = [{
  id: "fil-3",
  nombre: "PLA duplicado",
  modoCosto: "precio_kilo",
  precioPorKilo: 12000,
  pesoNetoInicialGramos: 1000,
  pesoRestanteGramos: 900,
  movimientos: [{ id: "mov-1", cantidadGramos: 100, stockAnterior: 1000, stockNuevo: 900 }]
}];
const combinadoMovimientos = api.importarRespaldo(movimientoRepetido, { modo: "combinar", conflictos: "actual" });
assert.equal(combinadoMovimientos.ok, true);
const idsMovimientos = JSON.parse(localStorage.getItem("precio3d_filamentos_v1")).bobinas.flatMap((bobina) => bobina.movimientos || []).map((movimiento) => movimiento.id);
assert.equal(idsMovimientos.filter((id) => id === "mov-1").length, 1, "combinar no debe duplicar movimientos");

const respaldoRestauracion = api.crearRespaldoCompleto();
localStorage.setItem("precio3d_clientes_v1", JSON.stringify({ version: 1, clientes: [] }));
const reemplazo = api.importarRespaldo(respaldoRestauracion, { modo: "reemplazar" });
assert.equal(reemplazo.ok, true);
assert.equal(JSON.parse(localStorage.getItem("precio3d_clientes_v1")).clientes.length, 3);
assert.equal(JSON.parse(localStorage.getItem("precio3d_filamentos_v1")).bobinas[0].movimientos.length, 1);
assert.equal(JSON.parse(localStorage.getItem("precio3d_trabajos_v1")).trabajos[0].pagos.length, 1);
assert.ok(reemplazo.respaldoPrevio, "reemplazar debe crear respaldo previo");

const copiaInconsistente = JSON.parse(JSON.stringify(respaldoRestauracion.data));
copiaInconsistente.trabajos[0].clienteId = "cli-inexistente";
copiaInconsistente.trabajos[0].consumoInventario = { registrado: true, movimientosIds: [] };
copiaInconsistente.trabajos[0].precioVendidoReal = 500;
copiaInconsistente.trabajos[0].pagos = [{ id: "pay-x", monto: 900, fecha: "2026-07-15" }];
copiaInconsistente.trabajos[0].estado = "Pagado";
copiaInconsistente.filamentos[0].pesoRestanteGramos = -10;
copiaInconsistente.filamentos[0].movimientos.push({ id: "mov-x", tipo: "consumo_manual", cantidadGramos: 10, stockAnterior: 850, stockNuevo: 840, createdAt: "2026-07-15T11:00:00.000Z" });
copiaInconsistente.filamentos[1].movimientos.push({ id: "mov-x", tipo: "ajuste", cantidadGramos: 5, stockAnterior: 1000, stockNuevo: 995, createdAt: "2026-07-15T12:00:00.000Z" });
copiaInconsistente.impresoras[1].esPredeterminada = true;
copiaInconsistente.cotizaciones[1].numeroCotizacion = copiaInconsistente.cotizaciones[0].numeroCotizacion;
copiaInconsistente.preferencias.contadorCotizaciones = { fecha: "20260715", valor: 0 };
const copiaAntesIntegridad = JSON.stringify(copiaInconsistente);
const integridad = api.verificarIntegridadDatos(copiaInconsistente);
assert.equal(JSON.stringify(copiaInconsistente), copiaAntesIntegridad, "el informe no debe modificar datos");
const descripciones = integridad.hallazgos.map((item) => item.descripcion).join(" | ");
assert.match(descripciones, /cliente inexistente/);
assert.match(descripciones, /stock restante es negativo/);
assert.match(descripciones, /consumo registrado/);
assert.match(descripciones, /más de una impresora predeterminada/);
assert.match(descripciones, /número de cotización está duplicado/);
assert.match(descripciones, /continuidad entre movimientos/);
assert.match(descripciones, /pagos superan el precio/);
assert.match(descripciones, /contador está por debajo/);
assert.match(descripciones, /movimiento de inventario con el mismo ID/);

const antiguo = {
  app: "precio3d",
  backupVersion: 1,
  createdAt: "2026-07-01T12:00:00.000Z",
  data: { clientes: [{ id: "old-1", nombre: "Antiguo" }], cotizaciones: [], trabajos: [], impresoras: [] }
};
const validarAntiguo = api.validarRespaldo(antiguo);
assert.equal(validarAntiguo.valido, true);
assert.deepEqual(Array.from(validarAntiguo.respaldo.data.filamentos), []);
const importarAntiguo = api.importarRespaldo(antiguo, { modo: "reemplazar" });
assert.equal(importarAntiguo.ok, true);
assert.equal(JSON.parse(localStorage.getItem("precio3d_clientes_v1")).clientes.length, 1);
assert.equal(JSON.parse(localStorage.getItem("precio3d_filamentos_v1")).bobinas.length, 0);

const costoGramo = context.FormulasPrecio3D.calcularCostoMaterial(50, 5, 12, 0.10);
const costoKilo = context.FormulasPrecio3D.calcularCostoMaterial(50, 5, 12000 / 1000, 0.10);
assert.ok(Math.abs(costoGramo - 726) < 0.000001);
assert.ok(Math.abs(costoKilo - 726) < 0.000001);

console.log("OK: respaldo, importación, integridad, compatibilidad y cálculo 726 verificados.");

// Almacenamiento local versionado para configuracion y ultimo calculo.
const STORAGE_CONFIG_KEY = "precio3d_config_v1";
const STORAGE_ULTIMO_CALCULO_KEY = "precio3d_ultimo_calculo_v1";
const STORAGE_VERSION = 1;

function puedeUsarLocalStorage() {
  try {
    const clavePrueba = "__precio3d_storage_test__";
    localStorage.setItem(clavePrueba, "ok");
    localStorage.removeItem(clavePrueba);
    return true;
  } catch (error) {
    console.warn("No se pudo usar almacenamiento local.", error);
    return false;
  }
}

function leerJSONSeguro(clave) {
  if (!puedeUsarLocalStorage()) {
    return null;
  }

  try {
    const valor = localStorage.getItem(clave);
    return valor ? JSON.parse(valor) : null;
  } catch (error) {
    console.warn("No se pudo leer LocalStorage.", error);
    return null;
  }
}

function escribirJSONSeguro(clave, valor) {
  if (!puedeUsarLocalStorage()) {
    return false;
  }

  try {
    localStorage.setItem(clave, JSON.stringify(valor));
    return true;
  } catch (error) {
    console.warn("No se pudo escribir en LocalStorage.", error);
    return false;
  }
}

function borrarClaveSeguro(clave) {
  if (!puedeUsarLocalStorage()) {
    return false;
  }

  try {
    localStorage.removeItem(clave);
    return true;
  } catch (error) {
    console.warn("No se pudo borrar LocalStorage.", error);
    return false;
  }
}

function envolverConfiguracion(configuracion) {
  return {
    version: STORAGE_VERSION,
    guardadoEn: new Date().toISOString(),
    configuracion: configuracion || {}
  };
}

function normalizarConfiguracion(datos) {
  if (!datos || typeof datos !== "object" || Array.isArray(datos)) {
    return null;
  }

  if (datos.version === STORAGE_VERSION && datos.configuracion && typeof datos.configuracion === "object") {
    return datos.configuracion;
  }

  if (datos.modoActual || datos.basico || datos.avanzado || datos.comparador) {
    return datos;
  }

  return null;
}

function guardarConfiguracion(configuracion) {
  return escribirJSONSeguro(STORAGE_CONFIG_KEY, envolverConfiguracion(configuracion));
}

function cargarConfiguracion() {
  return normalizarConfiguracion(leerJSONSeguro(STORAGE_CONFIG_KEY));
}

function borrarConfiguracion() {
  return borrarClaveSeguro(STORAGE_CONFIG_KEY);
}

function guardarUltimoCalculo(calculo) {
  const payload = {
    version: STORAGE_VERSION,
    guardadoEn: new Date().toISOString(),
    calculo: calculo || {}
  };

  return escribirJSONSeguro(STORAGE_ULTIMO_CALCULO_KEY, payload);
}

function cargarUltimoCalculo() {
  const datos = leerJSONSeguro(STORAGE_ULTIMO_CALCULO_KEY);

  if (!datos || typeof datos !== "object" || Array.isArray(datos)) {
    return null;
  }

  if (datos.version === STORAGE_VERSION && datos.calculo && typeof datos.calculo === "object") {
    return {
      ...datos.calculo,
      guardadoEn: datos.guardadoEn
    };
  }

  return null;
}

function borrarUltimoCalculo() {
  return borrarClaveSeguro(STORAGE_ULTIMO_CALCULO_KEY);
}

function exportarConfiguracionJSON(configuracion) {
  return JSON.stringify(envolverConfiguracion(configuracion), null, 2);
}

function importarConfiguracionJSON(contenido) {
  try {
    const datos = typeof contenido === "string" ? JSON.parse(contenido) : contenido;
    return normalizarConfiguracion(datos);
  } catch (error) {
    console.warn("Archivo de configuracion invalido.", error);
    return null;
  }
}

window.StoragePrecio3D = {
  guardarConfiguracion,
  cargarConfiguracion,
  borrarConfiguracion,
  guardarUltimoCalculo,
  cargarUltimoCalculo,
  borrarUltimoCalculo,
  exportarConfiguracionJSON,
  importarConfiguracionJSON
};

// Deteccion aproximada de pais para sugerir moneda; nunca solicita GPS ni guarda la IP.
(function configurarGeolocalizacionPrecio3D() {
  const STORAGE_KEY = "precio3d_geolocalizacion_v1";
  const CACHE_DIAS = 30;
  const TIMEOUT_MS = 4000;

  const paisAMoneda = {
    CL: "CLP", US: "USD", CA: "CAD", MX: "MXN", AR: "ARS", BO: "BOB", BR: "BRL",
    CO: "COP", EC: "USD", GY: "GYD", PE: "PEN", PY: "PYG", SR: "SRD", UY: "UYU", VE: "VES",
    BZ: "BZD", CR: "CRC", GT: "GTQ", HN: "HNL", NI: "NIO", PA: "PAB", SV: "USD",
    BB: "BBD", BS: "BSD", DO: "DOP", JM: "JMD", TT: "TTD", AG: "XCD", DM: "XCD",
    GD: "XCD", KN: "XCD", LC: "XCD", VC: "XCD", PR: "USD", VI: "USD",
    AT: "EUR", BE: "EUR", CY: "EUR", DE: "EUR", EE: "EUR", ES: "EUR", FI: "EUR",
    FR: "EUR", GR: "EUR", HR: "EUR", IE: "EUR", IT: "EUR", LT: "EUR", LU: "EUR",
    LV: "EUR", MT: "EUR", NL: "EUR", PT: "EUR", SI: "EUR", SK: "EUR", GB: "GBP",
    CH: "CHF", NO: "NOK", SE: "SEK", DK: "DKK", PL: "PLN", CZ: "CZK", HU: "HUF",
    RO: "RON", IS: "ISK", UA: "UAH", RS: "RSD", AL: "ALL", MK: "MKD", BA: "BAM",
    MD: "MDL", GE: "GEL", TR: "TRY",
    JP: "JPY", CN: "CNY", KR: "KRW", IN: "INR", ID: "IDR", MY: "MYR", SG: "SGD",
    TH: "THB", PH: "PHP", VN: "VND", PK: "PKR", BD: "BDT", LK: "LKR", NP: "NPR",
    AE: "AED", SA: "SAR", QA: "QAR", KW: "KWD", BH: "BHD", OM: "OMR", JO: "JOD", IL: "ILS",
    AU: "AUD", NZ: "NZD", FJ: "FJD", PG: "PGK", WS: "WST", TO: "TOP",
    ZA: "ZAR", EG: "EGP", MA: "MAD", DZ: "DZD", TN: "TND", NG: "NGN", GH: "GHS",
    KE: "KES", UG: "UGX", TZ: "TZS", ET: "ETB", MU: "MUR", BW: "BWP", NA: "NAD", ZM: "ZMW",
    BJ: "XOF", BF: "XOF", CI: "XOF", GW: "XOF", ML: "XOF", NE: "XOF", SN: "XOF", TG: "XOF",
    CM: "XAF", CF: "XAF", CG: "XAF", GA: "XAF", GQ: "XAF", TD: "XAF"
  };

  function monedaDisponible(codigo) {
    return Boolean(window.obtenerMonedaPrecio3D?.(codigo));
  }

  function normalizarDeteccion(datos, source) {
    const countryCode = String(datos?.country || datos?.countryCode || "").toUpperCase();
    const currencyApi = String(datos?.currency || "").toUpperCase();
    const currency = monedaDisponible(currencyApi) ? currencyApi : paisAMoneda[countryCode];

    if (!countryCode || !monedaDisponible(currency)) return null;

    return {
      countryCode,
      countryName: String(datos?.country_name || datos?.countryName || countryCode),
      currency,
      detectedAt: new Date().toISOString(),
      source
    };
  }

  function deteccionVigente(deteccion, ahora = Date.now()) {
    const fecha = Date.parse(deteccion?.detectedAt || "");
    return Number.isFinite(fecha) && ahora - fecha < CACHE_DIAS * 24 * 60 * 60 * 1000;
  }

  function cargarDeteccionGuardada() {
    try {
      const deteccion = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
      return deteccionVigente(deteccion) ? deteccion : null;
    } catch (error) {
      return null;
    }
  }

  function guardarDeteccion(deteccion) {
    const segura = normalizarDeteccion(deteccion, deteccion?.source || "desconocida");
    if (!segura) return null;

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(segura));
      return segura;
    } catch (error) {
      return segura;
    }
  }

  function borrarDeteccionGuardada() {
    try {
      localStorage.removeItem(STORAGE_KEY);
      return true;
    } catch (error) {
      return false;
    }
  }

  async function solicitarJSON(url, fetchFn) {
    const controller = new AbortController();
    const temporizador = setTimeout(() => controller.abort(), TIMEOUT_MS);

    try {
      const respuesta = await fetchFn(url, { signal: controller.signal, headers: { Accept: "application/json" } });
      if (!respuesta.ok) throw new Error("Respuesta no disponible");
      return await respuesta.json();
    } finally {
      clearTimeout(temporizador);
    }
  }

  function inferirDesdeIdiomas(idiomas = []) {
    const lista = Array.isArray(idiomas) ? idiomas : [idiomas];

    for (const idioma of lista) {
      const partes = String(idioma || "").split(/[-_]/);
      const countryCode = partes[1]?.toUpperCase();
      if (countryCode && paisAMoneda[countryCode]) {
        return normalizarDeteccion({ country: countryCode }, "navegador");
      }
    }

    return null;
  }

  function resolverMonedaPreferida({ manual, guardada, detectada, idiomas = [] } = {}) {
    const candidatas = [manual, guardada, detectada?.currency || detectada];
    const directa = candidatas.find((codigo) => monedaDisponible(String(codigo || "").toUpperCase()));
    if (directa) return String(directa).toUpperCase();

    return inferirDesdeIdiomas(idiomas)?.currency || "CLP";
  }

  async function detectarUbicacionAproximada(opciones = {}) {
    const fetchFn = opciones.fetchFn || window.fetch?.bind(window);
    const idiomas = opciones.idiomas || navigator.languages || [navigator.language];

    if (!opciones.forzar) {
      const guardada = cargarDeteccionGuardada();
      if (guardada) return guardada;
    }

    if (fetchFn) {
      try {
        const principal = normalizarDeteccion(await solicitarJSON("https://ipapi.co/json/", fetchFn), "ipapi");
        if (principal) return guardarDeteccion(principal);
      } catch (error) {
        // El respaldo mantiene operativa la calculadora si la API principal falla.
      }

      try {
        const respaldo = normalizarDeteccion(await solicitarJSON("https://api.country.is/", fetchFn), "country.is");
        if (respaldo) return guardarDeteccion(respaldo);
      } catch (error) {
        // Continua con el idioma del navegador.
      }
    }

    const navegador = inferirDesdeIdiomas(idiomas);
    if (navegador) return guardarDeteccion(navegador);

    return guardarDeteccion(normalizarDeteccion({ country: "CL", country_name: "Chile", currency: "CLP" }, "predeterminada"));
  }

  async function detectarMonedaAutomatica(opciones = {}) {
    return detectarUbicacionAproximada(opciones);
  }

  window.GeolocalizacionPrecio3D = {
    paisAMoneda,
    normalizarDeteccion,
    inferirDesdeIdiomas,
    resolverMonedaPreferida,
    deteccionVigente,
    cargarDeteccionGuardada,
    detectarUbicacionAproximada,
    detectarMonedaAutomatica,
    borrarDeteccionGuardada
  };
})();

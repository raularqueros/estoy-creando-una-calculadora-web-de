(function () {
  "use strict";

  const STORAGE_KEY = "precio3d_impresoras_v1";
  const VERSION = 1;
  const TECNOLOGIAS = ["FDM / FFF", "Resina", "SLS", "Otra"];
  const ESTADOS = ["Activa", "En mantenimiento", "Fuera de servicio", "Retirada"];

  function texto(valor) {
    return String(valor ?? "").trim();
  }

  function numeroSeguro(valor, predeterminado = 0) {
    const numero = Number(valor);
    return Number.isFinite(numero) && numero >= 0 ? numero : predeterminado;
  }

  function normalizarPorcentaje(valor) {
    const numero = numeroSeguro(valor);
    if (numero > 1) return Math.min(numero / 100, 1);
    return Math.min(numero, 1);
  }

  function crearId() {
    if (window.crypto?.randomUUID) return window.crypto.randomUUID();
    return `impresora-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }

  function fechaISO(valor, predeterminado = "") {
    if (!valor) return predeterminado;
    const fecha = new Date(valor);
    return Number.isNaN(fecha.getTime()) ? predeterminado : fecha.toISOString();
  }

  function normalizarImpresora(datos = {}, opciones = {}) {
    const ahora = new Date().toISOString();
    const tecnologia = TECNOLOGIAS.includes(datos.tecnologia) ? datos.tecnologia : "FDM / FFF";
    const estado = ESTADOS.includes(datos.estado) ? datos.estado : "Activa";
    const catalogoSnapshot = datos.catalogoSnapshot && typeof datos.catalogoSnapshot === "object"
      ? {
          marca: texto(datos.catalogoSnapshot.marca),
          modelo: texto(datos.catalogoSnapshot.modelo),
          variante: texto(datos.catalogoSnapshot.variante),
          tecnologia: texto(datos.catalogoSnapshot.tecnologia),
          volumenImpresion: texto(datos.catalogoSnapshot.volumenImpresion),
          cerrada: Boolean(datos.catalogoSnapshot.cerrada),
          multicolorCompatible: Boolean(datos.catalogoSnapshot.multicolorCompatible),
          fechaCatalogo: texto(datos.catalogoSnapshot.fechaCatalogo)
        }
      : null;

    return {
      id: texto(datos.id) || crearId(),
      version: VERSION,
      nombre: texto(datos.nombre) || "Impresora sin nombre",
      marca: texto(datos.marca),
      modelo: texto(datos.modelo),
      variante: texto(datos.variante),
      tecnologia,
      catalogoModeloId: texto(datos.catalogoModeloId) || null,
      catalogoSnapshot,
      costoCompra: numeroSeguro(datos.costoCompra),
      monedaCompra: texto(datos.monedaCompra).toUpperCase() || "CLP",
      costoHerramientas: numeroSeguro(datos.costoHerramientas),
      potenciaPromedioWatts: numeroSeguro(datos.potenciaPromedioWatts),
      anosVidaUtil: numeroSeguro(datos.anosVidaUtil, 2),
      diasOperativosAno: numeroSeguro(datos.diasOperativosAno, 300),
      horasProductivasDia: numeroSeguro(datos.horasProductivasDia, 8),
      porcentajeMantenimiento: normalizarPorcentaje(datos.porcentajeMantenimiento),
      costoMantenimientoAnual: numeroSeguro(datos.costoMantenimientoAnual),
      fechaCompra: texto(datos.fechaCompra),
      estado,
      notas: texto(datos.notas),
      esPredeterminada: estado !== "Retirada" && Boolean(datos.esPredeterminada),
      fechaCreacion: fechaISO(datos.fechaCreacion, ahora),
      fechaActualizacion: opciones.conservarActualizacion
        ? fechaISO(datos.fechaActualizacion, ahora)
        : ahora
    };
  }

  function validarImpresora(datos = {}) {
    const errores = {};
    const costoCompra = Number(datos.costoCompra);
    const potencia = Number(datos.potenciaPromedioWatts);
    const divisores = ["anosVidaUtil", "diasOperativosAno", "horasProductivasDia"];
    const noNegativos = ["costoHerramientas", "costoMantenimientoAnual"];

    if (!texto(datos.nombre)) errores.nombre = "Escribe un nombre para identificar la impresora.";
    if (!TECNOLOGIAS.includes(datos.tecnologia)) errores.tecnologia = "Selecciona una tecnología válida.";
    if (!texto(datos.costoCompra) || !Number.isFinite(costoCompra) || costoCompra < 0) {
      errores.costoCompra = "Ingresa el costo real pagado, igual o mayor que cero.";
    }
    if (!Number.isFinite(potencia) || potencia <= 0) errores.potenciaPromedioWatts = "Ingresa una potencia mayor que cero.";

    divisores.forEach((campo) => {
      const valor = Number(datos[campo]);
      if (!Number.isFinite(valor) || valor <= 0) errores[campo] = "Debe ser un número mayor que cero.";
    });

    noNegativos.forEach((campo) => {
      const valor = datos[campo] === "" || datos[campo] == null ? 0 : Number(datos[campo]);
      if (!Number.isFinite(valor) || valor < 0) errores[campo] = "No puede ser negativo.";
    });

    const mantenimiento = Number(datos.porcentajeMantenimiento);
    if (!Number.isFinite(mantenimiento) || mantenimiento < 0 || mantenimiento > 100) {
      errores.porcentajeMantenimiento = "Usa un valor entre 0 y 100, o un decimal entre 0 y 1.";
    }

    return errores;
  }

  function leerLista() {
    try {
      const contenido = localStorage.getItem(STORAGE_KEY);
      if (!contenido) return [];
      const datos = JSON.parse(contenido);
      const lista = Array.isArray(datos) ? datos : datos?.impresoras;
      if (!Array.isArray(lista)) return [];
      return lista
        .filter((item) => item && typeof item === "object")
        .map((item) => normalizarImpresora(item, { conservarActualizacion: true }));
    } catch (error) {
      console.warn("No fue posible cargar las impresoras guardadas.", error);
      return [];
    }
  }

  function escribirLista(lista) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lista));
      window.dispatchEvent(new CustomEvent("precio3d:impresoras-actualizadas"));
      return true;
    } catch (error) {
      console.warn("No fue posible guardar las impresoras.", error);
      return false;
    }
  }

  function quitarPredeterminada(lista, exceptoId = "") {
    const ahora = new Date().toISOString();
    return lista.map((item) => item.esPredeterminada && item.id !== exceptoId
      ? { ...item, esPredeterminada: false, fechaActualizacion: ahora }
      : item);
  }

  function crearImpresora(datos) {
    if (Object.keys(validarImpresora(datos)).length) return null;
    let lista = leerLista();
    const nueva = normalizarImpresora(datos);
    if (nueva.esPredeterminada) lista = quitarPredeterminada(lista);
    lista.unshift(nueva);
    return escribirLista(lista) ? nueva : null;
  }

  function obtenerImpresoras() {
    return leerLista();
  }

  function obtenerImpresoraPorId(id) {
    return leerLista().find((item) => item.id === id) || null;
  }

  function actualizarImpresora(id, cambios) {
    let lista = leerLista();
    const indice = lista.findIndex((item) => item.id === id);
    if (indice < 0) return null;
    const datos = { ...lista[indice], ...cambios, id, fechaCreacion: lista[indice].fechaCreacion };
    if (Object.keys(validarImpresora(datos)).length) return null;
    const actualizada = normalizarImpresora(datos);
    if (actualizada.esPredeterminada) lista = quitarPredeterminada(lista, id);
    lista[indice] = actualizada;
    return escribirLista(lista) ? actualizada : null;
  }

  function duplicarImpresora(id) {
    const original = obtenerImpresoraPorId(id);
    if (!original) return null;
    return crearImpresora({
      ...original,
      id: "",
      nombre: `${original.nombre} (copia)`,
      esPredeterminada: false,
      fechaCreacion: "",
      fechaActualizacion: ""
    });
  }

  function archivarImpresora(id) {
    return actualizarImpresora(id, { estado: "Retirada", esPredeterminada: false });
  }

  function eliminarImpresora(id) {
    const lista = leerLista();
    const nuevaLista = lista.filter((item) => item.id !== id);
    return nuevaLista.length !== lista.length && escribirLista(nuevaLista);
  }

  function establecerPredeterminada(id) {
    const lista = leerLista();
    const seleccionada = lista.find((item) => item.id === id);
    if (!seleccionada || seleccionada.estado === "Retirada") return null;
    const ahora = new Date().toISOString();
    const actualizada = lista.map((item) => ({
      ...item,
      esPredeterminada: item.id === id,
      fechaActualizacion: item.esPredeterminada !== (item.id === id) ? ahora : item.fechaActualizacion
    }));
    return escribirLista(actualizada) ? actualizada.find((item) => item.id === id) : null;
  }

  function calcularCostoHoraEstimado(impresora = {}) {
    const costoBase = numeroSeguro(impresora.costoCompra) + numeroSeguro(impresora.costoHerramientas);
    const anos = Number(impresora.anosVidaUtil);
    const dias = Number(impresora.diasOperativosAno);
    const horas = Number(impresora.horasProductivasDia);
    if (![anos, dias, horas].every((valor) => Number.isFinite(valor) && valor > 0)) return null;
    const horasVida = anos * dias * horas;
    const mantenimiento = costoBase * normalizarPorcentaje(impresora.porcentajeMantenimiento);
    const costoHora = (costoBase + mantenimiento) / horasVida;
    return Number.isFinite(costoHora) && costoHora >= 0 ? costoHora : null;
  }

  function buscarImpresoras(consulta = "", opciones = {}) {
    const termino = texto(consulta).toLocaleLowerCase("es");
    const filtro = opciones.filtro || "todas";
    const orden = opciones.orden || "nombre";
    const lista = leerLista().filter((item) => {
      const coincideTexto = !termino || [item.nombre, item.marca, item.modelo, item.variante]
        .some((valor) => texto(valor).toLocaleLowerCase("es").includes(termino));
      const coincideFiltro = filtro === "todas"
        || item.estado === filtro
        || item.tecnologia === filtro;
      return coincideTexto && coincideFiltro;
    });

    return lista.sort((a, b) => {
      if (orden === "recientes") return new Date(b.fechaActualizacion) - new Date(a.fechaActualizacion);
      if (orden === "mayor_costo") return (calcularCostoHoraEstimado(b) ?? -1) - (calcularCostoHoraEstimado(a) ?? -1);
      if (orden === "menor_costo") return (calcularCostoHoraEstimado(a) ?? Infinity) - (calcularCostoHoraEstimado(b) ?? Infinity);
      return a.nombre.localeCompare(b.nombre, "es", { sensitivity: "base" });
    });
  }

  function exportarImpresorasJSON() {
    return JSON.stringify({
      version: VERSION,
      fechaExportacion: new Date().toISOString(),
      impresoras: leerLista()
    }, null, 2);
  }

  function importarImpresorasJSON(contenido, modo = "combinar") {
    try {
      const datos = typeof contenido === "string" ? JSON.parse(contenido.replace(/^\uFEFF/, "")) : contenido;
      const listaEntrada = Array.isArray(datos) ? datos : datos?.impresoras;
      if (!Array.isArray(listaEntrada)) return { ok: false, importadas: 0, rechazadas: 0, impresoras: leerLista() };

      const actuales = modo === "reemplazar" ? [] : leerLista();
      const ids = new Set(actuales.map((item) => item.id));
      const aceptadas = [];
      let rechazadas = 0;

      listaEntrada.forEach((item) => {
        if (!item || typeof item !== "object" || Object.keys(validarImpresora(item)).length) {
          rechazadas += 1;
          return;
        }
        const normalizada = normalizarImpresora(item, { conservarActualizacion: true });
        if (ids.has(normalizada.id)) {
          rechazadas += 1;
          return;
        }
        ids.add(normalizada.id);
        aceptadas.push(normalizada);
      });

      if (!aceptadas.length && listaEntrada.length) {
        return { ok: false, importadas: 0, rechazadas, impresoras: leerLista() };
      }

      let combinadas = [...actuales, ...aceptadas];
      const predeterminadas = combinadas.filter((item) => item.esPredeterminada);
      if (predeterminadas.length > 1) {
        const conservarId = predeterminadas[0].id;
        combinadas = quitarPredeterminada(combinadas, conservarId);
      }
      const ok = escribirLista(combinadas);
      return { ok, importadas: ok ? aceptadas.length : 0, rechazadas, impresoras: ok ? combinadas : leerLista() };
    } catch (error) {
      console.warn("El archivo de impresoras no es válido.", error);
      return { ok: false, importadas: 0, rechazadas: 0, impresoras: leerLista() };
    }
  }

  function escaparCSV(valor) {
    return `"${String(valor ?? "").replaceAll('"', '""')}"`;
  }

  function exportarImpresorasCSV() {
    const encabezados = [
      "Nombre", "ID catálogo", "Marca", "Modelo", "Variante", "Tecnología", "Costo real pagado", "Moneda",
      "Costo herramientas", "Potencia promedio", "Vida útil", "Días operativos",
      "Horas productivas", "Mantenimiento", "Costo por hora estimado", "Estado",
      "Predeterminada", "Fecha de compra", "Fecha de creación", "Fecha de actualización"
    ];
    const filas = leerLista().map((item) => [
      item.nombre, item.catalogoModeloId || "", item.marca, item.modelo, item.variante,
      item.tecnologia, item.costoCompra, item.monedaCompra,
      item.costoHerramientas, item.potenciaPromedioWatts, item.anosVidaUtil, item.diasOperativosAno,
      item.horasProductivasDia, `${item.porcentajeMantenimiento * 100}%`, calcularCostoHoraEstimado(item) ?? "",
      item.estado, item.esPredeterminada ? "Sí" : "No", item.fechaCompra,
      item.fechaCreacion, item.fechaActualizacion
    ]);
    return `\uFEFF${[encabezados, ...filas].map((fila) => fila.map(escaparCSV).join(";")).join("\r\n")}`;
  }

  window.ImpresorasPrecio3D = {
    crearImpresora,
    obtenerImpresoras,
    obtenerImpresoraPorId,
    actualizarImpresora,
    duplicarImpresora,
    archivarImpresora,
    eliminarImpresora,
    establecerPredeterminada,
    calcularCostoHoraEstimado,
    buscarImpresoras,
    exportarImpresorasJSON,
    importarImpresorasJSON,
    exportarImpresorasCSV,
    validarImpresora,
    claveStorage: STORAGE_KEY,
    version: VERSION
  };
})();

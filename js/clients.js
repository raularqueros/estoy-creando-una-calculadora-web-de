(function () {
  "use strict";

  const STORAGE_KEY = "precio3d_clientes_v1";
  const VERSION = 1;

  function texto(valor) {
    return String(valor ?? "").trim();
  }

  function comparable(valor) {
    return texto(valor)
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "");
  }

  function crearId() {
    if (window.crypto?.randomUUID) {
      return window.crypto.randomUUID();
    }

    return `cliente-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }

  function normalizarCliente(cliente) {
    if (!cliente || typeof cliente !== "object") {
      return null;
    }

    const ahora = new Date().toISOString();
    const etiquetas = Array.isArray(cliente.etiquetas)
      ? cliente.etiquetas.map(texto).filter(Boolean)
      : texto(cliente.etiquetas).split(",").map(texto).filter(Boolean);

    return {
      id: texto(cliente.id) || crearId(),
      version: VERSION,
      nombre: texto(cliente.nombre),
      empresa: texto(cliente.empresa),
      rutIdFiscal: texto(cliente.rutIdFiscal),
      telefono: texto(cliente.telefono),
      correo: texto(cliente.correo).toLowerCase(),
      direccion: texto(cliente.direccion),
      ciudad: texto(cliente.ciudad),
      pais: texto(cliente.pais),
      notas: texto(cliente.notas),
      etiquetas,
      fechaCreacion: texto(cliente.fechaCreacion) || ahora,
      fechaActualizacion: texto(cliente.fechaActualizacion) || ahora
    };
  }

  function crearSnapshot(cliente) {
    const normalizado = normalizarCliente(cliente);
    if (!normalizado) return null;
    return {
      nombre: normalizado.nombre,
      empresa: normalizado.empresa,
      rutIdFiscal: normalizado.rutIdFiscal,
      telefono: normalizado.telefono,
      correo: normalizado.correo,
      direccion: normalizado.direccion
    };
  }

  function leerLista() {
    try {
      const guardado = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
      const lista = Array.isArray(guardado) ? guardado : guardado?.clientes;
      return Array.isArray(lista) ? lista.map(normalizarCliente).filter(Boolean) : [];
    } catch (error) {
      console.warn("No se pudieron cargar los clientes.", error);
      return [];
    }
  }

  function escribirLista(clientes) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        version: VERSION,
        guardadoEn: new Date().toISOString(),
        clientes: clientes.map(normalizarCliente).filter(Boolean)
      }));
      window.dispatchEvent(new CustomEvent("precio3d:clientes-actualizados"));
      return true;
    } catch (error) {
      console.warn("No se pudieron guardar los clientes.", error);
      return false;
    }
  }

  function obtenerClientes() {
    return leerLista();
  }

  function obtenerClientePorId(id) {
    return leerLista().find((cliente) => cliente.id === id) || null;
  }

  function detectarDuplicados(datos, excluirId = "", clientes = leerLista()) {
    const candidato = normalizarCliente(datos);
    if (!candidato) return [];

    const correo = comparable(candidato.correo);
    const telefono = comparable(candidato.telefono);
    const fiscal = comparable(candidato.rutIdFiscal);
    const nombre = comparable(candidato.nombre);
    const empresa = comparable(candidato.empresa);

    return clientes.filter((cliente) => {
      if (cliente.id === excluirId) return false;
      return Boolean(
        (correo && correo === comparable(cliente.correo)) ||
        (telefono && telefono === comparable(cliente.telefono)) ||
        (fiscal && fiscal === comparable(cliente.rutIdFiscal)) ||
        (nombre && nombre === comparable(cliente.nombre) && empresa === comparable(cliente.empresa))
      );
    });
  }

  function crearCliente(datos, opciones = {}) {
    const cliente = normalizarCliente(datos);
    if (!cliente?.nombre) return { ok: false, error: "El nombre del cliente es obligatorio." };

    const duplicados = detectarDuplicados(cliente);
    if (duplicados.length && !opciones.permitirDuplicado) {
      return { ok: false, duplicados, error: "Ya existe un cliente con datos similares." };
    }

    const clientes = leerLista();
    clientes.unshift(cliente);
    return escribirLista(clientes) ? { ok: true, cliente } : { ok: false, error: "No se pudo guardar el cliente." };
  }

  function actualizarCliente(id, cambios, opciones = {}) {
    const clientes = leerLista();
    const indice = clientes.findIndex((cliente) => cliente.id === id);
    if (indice < 0) return { ok: false, error: "Cliente no encontrado." };

    const actualizado = normalizarCliente({
      ...clientes[indice],
      ...cambios,
      id,
      fechaCreacion: clientes[indice].fechaCreacion,
      fechaActualizacion: new Date().toISOString()
    });
    if (!actualizado.nombre) return { ok: false, error: "El nombre del cliente es obligatorio." };

    const duplicados = detectarDuplicados(actualizado, id, clientes);
    if (duplicados.length && !opciones.permitirDuplicado) {
      return { ok: false, duplicados, error: "Ya existe un cliente con datos similares." };
    }

    clientes[indice] = actualizado;
    return escribirLista(clientes) ? { ok: true, cliente: actualizado } : { ok: false, error: "No se pudo actualizar el cliente." };
  }

  function eliminarCliente(id) {
    const clientes = leerLista();
    const eliminado = clientes.find((cliente) => cliente.id === id);
    const restantes = clientes.filter((cliente) => cliente.id !== id);
    if (!eliminado || !escribirLista(restantes)) return false;

    const storage = window.StoragePrecio3D;
    storage?.cargarTrabajos?.()
      .filter((trabajo) => trabajo.clienteId === id)
      .forEach((trabajo) => {
        storage.actualizarTrabajo?.(trabajo.id, {
          clienteId: "",
          cliente: trabajo.cliente || eliminado.nombre,
          clienteSnapshot: trabajo.clienteSnapshot || crearSnapshot(eliminado)
        });
      });
    return true;
  }

  function buscarClientes(consulta = "") {
    const termino = comparable(consulta);
    if (!termino) return leerLista();
    return leerLista().filter((cliente) => [
      cliente.nombre,
      cliente.empresa,
      cliente.correo,
      cliente.telefono,
      cliente.rutIdFiscal,
      ...cliente.etiquetas
    ].some((valor) => comparable(valor).includes(termino)));
  }

  function exportarClientesJSON(clientes = leerLista()) {
    return JSON.stringify({
      version: VERSION,
      exportadoEn: new Date().toISOString(),
      clientes: clientes.map(normalizarCliente).filter(Boolean)
    }, null, 2);
  }

  function importarClientesJSON(contenido, modo = "combinar", opciones = {}) {
    try {
      const datos = typeof contenido === "string" ? JSON.parse(contenido) : contenido;
      const lista = Array.isArray(datos) ? datos : datos?.clientes;
      if (!Array.isArray(lista)) return { ok: false, error: "Archivo de clientes inválido." };

      const validos = lista.map(normalizarCliente).filter((cliente) => cliente?.nombre);
      const destino = modo === "reemplazar" ? [] : leerLista();
      const ids = new Set(destino.map((cliente) => cliente.id));
      const omitidos = [];

      validos.forEach((cliente) => {
        const duplicados = detectarDuplicados(cliente, "", destino);
        if (duplicados.length && !opciones.permitirDuplicados) {
          omitidos.push(cliente);
          return;
        }
        if (ids.has(cliente.id)) cliente.id = crearId();
        ids.add(cliente.id);
        destino.push(cliente);
      });

      return escribirLista(destino)
        ? { ok: true, clientes: destino, importados: validos.length - omitidos.length, omitidos }
        : { ok: false, error: "No se pudieron importar los clientes." };
    } catch (error) {
      console.warn("Archivo de clientes inválido.", error);
      return { ok: false, error: "Archivo de clientes inválido." };
    }
  }

  window.ClientesPrecio3D = {
    crearCliente,
    obtenerClientes,
    obtenerClientePorId,
    actualizarCliente,
    eliminarCliente,
    buscarClientes,
    detectarDuplicados,
    crearSnapshot,
    exportarClientesJSON,
    importarClientesJSON
  };
})();

// Navegacion simple por secciones para la interfaz tipo panel.
(function () {
  "use strict";

  const STORAGE_KEY = "precio3d_seccion_activa_v1";
  const SIDEBAR_STORAGE_KEY = "precio3d_sidebar_expandida_v1";
  const main = document.querySelector("#dashboardContent");
  const nav = document.querySelector("#dashboardNav");
  const shell = document.querySelector(".dashboard-shell");
  const sidebarToggle = document.querySelector("#sidebarToggle");
  const mobileBottomNav = document.querySelector("#mobileBottomNav");
  const mobileMoreButton = document.querySelector("#mobileMoreButton");
  const mobileMoreMenu = document.querySelector("#mobileMoreMenu");
  const t = (clave, reemplazos = {}) =>
    window.obtenerTextoI18n?.(clave, reemplazos) || clave;

  if (!main || !nav) {
    console.error("No se pudo iniciar la navegacion principal.");
    return;
  }

  const nombres = {
    cotizar: ["Cotizar", "Ingresa los datos de tu impresión para calcular un precio rentable."],
    resultado: ["Resultado", "Revisa el precio sugerido, tus costos y la utilidad estimada."],
    trabajos: ["Trabajos", "Guarda y organiza tus cotizaciones, ventas y pedidos."],
    clientes: ["Clientes", "Guarda y reutiliza los datos de tus clientes en trabajos y cotizaciones."],
    impresoras: ["Impresoras", "Guarda los costos y características de tus impresoras para reutilizarlos en tus cotizaciones."],
    filamentos: ["Filamentos", "Registra tus bobinas, controla el material disponible y utiliza su costo real por gramo."],
    finanzas: ["Panel financiero", "Analiza tus ventas, cobros, costos y rentabilidad utilizando los datos registrados en la aplicaciÃ³n."],
    cotizaciones: ["Historial de cotizaciones", "Crea, guarda y administra propuestas comerciales con varios productos o servicios."],
    "datos-cotizacion": ["Datos comerciales", "Configura los datos de tu negocio, cliente y condiciones comerciales."],
    "cotizacion-cliente": ["Nueva cotización", "Prepara una cotización limpia para imprimir o guardar como PDF."],
    configuracion: ["Configuración", "Personaliza los costos y preferencias utilizados en los cálculos."],
    ayuda: ["Ayuda", "Consulta explicaciones, advertencias y fuentes de referencia."]
  };

  const clavesNombres = {
    cotizar: ["navCotizarTitulo", "navCotizarDescripcion"],
    resultado: ["navResultadoTitulo", "navResultadoDescripcion"],
    trabajos: ["navTrabajosTitulo", "navTrabajosDescripcion"],
    clientes: ["navClientesTitulo", "navClientesDescripcion"],
    impresoras: ["navImpresorasTitulo", "navImpresorasDescripcion"],
    filamentos: ["navFilamentosTitulo", "navFilamentosDescripcion"],
    finanzas: ["navFinanzasTitulo", "navFinanzasDescripcion"],
    cotizaciones: ["navCotizacionesTitulo", "navCotizacionesDescripcion"],
    "datos-cotizacion": ["navDatosCotizacionTitulo", "navDatosCotizacionDescripcion"],
    "cotizacion-cliente": ["navCotizacionClienteTitulo", "navCotizacionClienteDescripcion"],
    configuracion: ["navConfiguracionTitulo", "navConfiguracionDescripcion"],
    ayuda: ["navAyudaTitulo", "navAyudaDescripcion"]
  };

  const vistas = {};

  function crearVista(id) {
    const [claveTitulo, claveDescripcion] = clavesNombres[id];
    const vista = document.createElement("section");
    vista.id = `vista-${id}`;
    vista.className = "dashboard-view";
    vista.dataset.view = id;
    vista.setAttribute("aria-labelledby", `titulo-vista-${id}`);
    vista.innerHTML = `
      <header class="dashboard-view__header">
        <p class="dashboard-breadcrumb"><span data-i18n="inicio">Inicio</span> / <span data-i18n="${claveTitulo}">${nombres[id][0]}</span></p>
        <h2 id="titulo-vista-${id}" tabindex="-1" data-i18n="${claveTitulo}">${nombres[id][0]}</h2>
        <p data-i18n="${claveDescripcion}">${nombres[id][1]}</p>
      </header>
      <div class="dashboard-view__content"></div>
    `;
    vistas[id] = vista;
    return vista;
  }

  const fragmento = document.createDocumentFragment();
  Object.keys(nombres).forEach((id) => fragmento.appendChild(crearVista(id)));

  // Extrae primero los resultados anidados para separarlos de los formularios.
  const resultadoBasico = document.querySelector(".basic-result-panel");
  const supuestosBasicos = document.querySelector(".assumptions-panel");
  const resultadoAvanzado = document.querySelector("#result")?.closest(".panel");
  const datosGuardadosBasico = document.querySelector("#datosGuardadosBasico");
  const costosAdicionalesBasico = document.querySelector("#costosAdicionalesBasico");
  const ventaConfiguracionBasico = document.querySelector("#ventaConfiguracionBasico");
  const paneles = {
    selectorModo: document.querySelector(".mode-switch-panel"),
    modoBasico: document.querySelector("#seccionModoBasico"),
    modoAvanzado: document.querySelector("#seccionModoAvanzado"),
    preciosNivel: document.querySelector(".price-levels-panel"),
    comparador: document.querySelector("#comparadorCanalesPanel"),
    ultimoCalculo: document.querySelector("#ultimoCalculoPanel"),
    trabajos: document.querySelector("#misTrabajosPanel"),
    clientes: document.querySelector("#misClientesPanel"),
    impresoras: document.querySelector("#misImpresorasPanel"),
    filamentos: document.querySelector("#inventarioFilamentosPanel"),
    finanzas: document.querySelector("#panelFinancieroPanel"),
    cotizaciones: document.querySelector("#misCotizacionesPanel"),
    cotizacionCliente: document.querySelector("#cotizacionClientePanel"),
    datosCotizacion: document.querySelector("#datosCotizacionPanel"),
    configuracion: document.querySelector(".storage-panel:not(#ultimoCalculoPanel)"),
    respaldo: document.querySelector("#respaldoIntegridadPanel")
  };

  main.replaceChildren(fragmento);

  function contenido(id) {
    return vistas[id].querySelector(".dashboard-view__content");
  }

  function mover(id, elementos) {
    elementos.filter(Boolean).forEach((elemento) => contenido(id).appendChild(elemento));
  }

  const cotizarLayout = document.createElement("div");
  cotizarLayout.className = "quote-workspace";
  cotizarLayout.innerHTML = `
    <div class="quote-workspace__form"></div>
    <aside class="quote-workspace__result" tabindex="-1" aria-label="Resultado de la cotización" data-i18n-aria-label="resultadoCotizacionAria"></aside>
  `;
  contenido("cotizar").appendChild(cotizarLayout);

  const columnaFormulario = cotizarLayout.querySelector(".quote-workspace__form");
  const columnaResultado = cotizarLayout.querySelector(".quote-workspace__result");
  [paneles.selectorModo, paneles.modoBasico, paneles.modoAvanzado]
    .filter(Boolean)
    .forEach((elemento) => columnaFormulario.appendChild(elemento));

  function crearAcordeonAvanzado(panel, titulo, claveTitulo) {
    if (!panel || panel.classList.contains("advanced-accordion")) {
      return;
    }

    const encabezadoAnterior = panel.querySelector(":scope > h2");
    const contenidoAcordeon = document.createElement("div");
    const boton = document.createElement("button");
    const idContenido = `acordeon-${titulo.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

    contenidoAcordeon.id = idContenido;
    contenidoAcordeon.className = "advanced-accordion__content";
    contenidoAcordeon.hidden = true;
    encabezadoAnterior?.querySelectorAll(".info-btn").forEach((ayuda) => {
      const contenedorAyuda = document.createElement("div");
      contenedorAyuda.className = "advanced-accordion__help";
      contenedorAyuda.appendChild(ayuda);
      contenidoAcordeon.appendChild(contenedorAyuda);
    });
    Array.from(panel.children)
      .filter((elemento) => elemento !== encabezadoAnterior)
      .forEach((elemento) => contenidoAcordeon.appendChild(elemento));

    boton.type = "button";
    boton.className = "advanced-accordion__toggle";
    boton.setAttribute("aria-expanded", "false");
    boton.setAttribute("aria-controls", idContenido);
    boton.innerHTML = `<span data-i18n="${claveTitulo}">${titulo}</span><span class="advanced-accordion__indicator" aria-hidden="true">+</span>`;
    boton.addEventListener("click", () => {
      const abierto = boton.getAttribute("aria-expanded") === "true";
      boton.setAttribute("aria-expanded", String(!abierto));
      contenidoAcordeon.hidden = abierto;
      boton.querySelector(".advanced-accordion__indicator").textContent = abierto ? "+" : "−";
    });

    panel.classList.add("advanced-accordion");
    panel.replaceChildren(boton, contenidoAcordeon);
  }

  const acordeonesAvanzados = [
    [document.querySelector("#wattsPromedioAvanzado")?.closest(".panel"), "Energía", "energia"],
    [document.querySelector("#impresoraAvanzado")?.closest(".panel"), "Impresora y amortización", "impresoraAmortizacion"],
    [document.querySelector("#horasPreparacionAvanzado")?.closest(".panel"), "Mano de obra", "manoObra"],
    [document.querySelector("#embalajeAvanzado")?.closest(".panel"), "Logística", "logistica"],
    [document.querySelector("#canalVentaAvanzado")?.closest(".panel"), "Comisiones e impuestos", "comisionesImpuestos"],
    [document.querySelector("#margenAvanzado")?.closest(".panel"), "Margen y precio final", "margenPrecioFinal"]
  ];

  acordeonesAvanzados.forEach(([panel, titulo, claveTitulo]) => {
    crearAcordeonAvanzado(panel, titulo, claveTitulo);
    if (panel) {
      paneles.modoAvanzado?.appendChild(panel);
    }
  });

  const accionesAvanzadas = document.createElement("section");
  accionesAvanzadas.className = "panel advanced-calculate-panel";
  accionesAvanzadas.innerHTML = `
    <div>
      <h2 data-i18n="calcularCotizacionAvanzada">Calcular cotización avanzada</h2>
      <p class="help-text" data-i18n="calcularCotizacionAvanzadaAyuda">Usa todos los datos del formulario avanzado para generar el resultado.</p>
    </div>
    <button type="button" id="calcularAvanzadoDesdeCotizar" data-i18n="calcular">Calcular</button>
  `;
  paneles.modoAvanzado?.appendChild(accionesAvanzadas);

  const accionesResultado = document.createElement("section");
  accionesResultado.className = "panel result-workflow-panel";
  accionesResultado.hidden = true;
  accionesResultado.innerHTML = `
    <div>
      <h2 data-i18n="accionesCalculo">Acciones del cálculo</h2>
      <p class="help-text" data-i18n="accionesCalculoAyuda">Guarda el cálculo actual o vuelve al formulario para hacer cambios.</p>
    </div>
    <div class="actions">
      <button type="button" id="guardarDesdeResultadoButton" data-i18n="guardarComoTrabajo" disabled>Guardar como trabajo</button>
      <button type="button" id="agregarCalculoCotizacionButton" class="secondary" data-i18n="agregarCalculoCotizacion" disabled>Agregar cálculo a cotización</button>
      <button type="button" id="generarCotizacionDesdeResultadoButton" class="secondary" data-i18n="generarCotizacion" disabled>Generar cotización</button>
      <button type="button" id="volverACotizarDesdeResultadoButton" class="secondary" data-i18n="nuevoCalculo">Nuevo cálculo</button>
    </div>
  `;

  const elementosResultado = [
    resultadoBasico,
    resultadoAvanzado,
    accionesResultado,
    paneles.preciosNivel,
    paneles.comparador,
    paneles.ultimoCalculo
  ].filter(Boolean);

  function ubicarResultados(destino) {
    const contenedor = destino === "cotizar" ? columnaResultado : contenido("resultado");
    elementosResultado.forEach((elemento) => contenedor.appendChild(elemento));
  }

  ubicarResultados("cotizar");

  mover("trabajos", [paneles.trabajos]);
  mover("clientes", [paneles.clientes]);
  mover("impresoras", [paneles.impresoras]);
  mover("filamentos", [paneles.filamentos]);
  mover("finanzas", [paneles.finanzas]);
  mover("cotizaciones", [paneles.cotizaciones]);
  mover("cotizacion-cliente", [paneles.cotizacionCliente]);
  mover("datos-cotizacion", [paneles.datosCotizacion]);

  const pasoDatosCotizacion = document.createElement("section");
  pasoDatosCotizacion.className = "panel quote-step-panel";
  pasoDatosCotizacion.innerHTML = `
    <div>
      <p class="eyebrow" data-i18n="paso1">Paso 1</p>
      <h2 data-i18n="completaDatosCotizacion">Completa los datos de la cotización</h2>
      <p class="help-text" data-i18n="completaDatosCotizacionAyuda">Primero registra los datos del negocio, cliente y condiciones comerciales.</p>
    </div>
    <button type="button" id="irADatosCotizacionButton" data-i18n="completarDatos">Completar datos</button>
  `;
  contenido("cotizacion-cliente").prepend(pasoDatosCotizacion);

  const accionesCotizacion = document.createElement("div");
  accionesCotizacion.className = "actions section-navigation-actions";
  accionesCotizacion.innerHTML = `
    <button type="button" id="editarDatosDesdeCotizacionButton" class="secondary" data-i18n="editarDatosCotizacion">Editar datos de cotización</button>
    <button type="button" id="volverResultadoDesdeCotizacionButton" class="secondary" data-i18n="volverResultado">Volver al resultado</button>
  `;
  contenido("cotizacion-cliente").appendChild(accionesCotizacion);

  const accionesDatosCotizacion = document.createElement("div");
  accionesDatosCotizacion.className = "actions section-navigation-actions";
  accionesDatosCotizacion.innerHTML = `
    <button type="button" id="volverCotizacionDesdeDatosButton" class="secondary" data-i18n="volverCotizacion">Volver a la cotización</button>
  `;
  contenido("datos-cotizacion").appendChild(accionesDatosCotizacion);

  const panelCostos = document.createElement("section");
  panelCostos.className = "panel settings-panel";
  panelCostos.innerHTML = `
    <section class="settings-group settings-group--preferences">
      <div class="settings-group__heading">
        <p class="eyebrow" data-i18n="configuracionPreferencias">Preferencias generales</p>
        <h2 data-i18n="configuracionPreferencias">Preferencias generales</h2>
        <p class="help-text" data-i18n="configuracionPreferenciasAyuda">Define el idioma, la moneda y las opciones de venta que usarás por defecto.</p>
      </div>
    </section>
    <section class="settings-group settings-group--calculator">
      <div class="settings-group__heading">
        <p class="eyebrow" data-i18n="configuracionCalculadora">Valores y comportamiento de la calculadora</p>
        <h2 data-i18n="configuracionCalculadora">Valores y comportamiento de la calculadora</h2>
        <p class="help-text" data-i18n="configuracionCalculadoraAyuda">Ajusta los datos guardados y los costos que se reutilizan al calcular.</p>
      </div>
    </section>
  `;
  const grupoPreferencias = panelCostos.querySelector(".settings-group--preferences");
  const grupoCalculadora = panelCostos.querySelector(".settings-group--calculator");
  [ventaConfiguracionBasico].filter(Boolean).forEach((elemento) => grupoPreferencias.appendChild(elemento));
  [datosGuardadosBasico, costosAdicionalesBasico].filter(Boolean).forEach((elemento) => grupoCalculadora.appendChild(elemento));

  mover("configuracion", [
    panelCostos,
    paneles.configuracion,
    paneles.respaldo
  ]);

  contenido("ayuda").innerHTML = `
    <section class="panel help-sources-panel">
      <h2 data-i18n="comoUsarAyuda">Como usar la ayuda</h2>
      <p data-i18n="comoUsarAyudaTexto">Los botones de información i explican los campos más técnicos sin cambiar tus datos.</p>
      <p data-i18n="ayudaCostosReferenciales">Los costos, comisiones e impuestos son referenciales. Verifica las tarifas y obligaciones aplicables en tu país antes de enviar una cotización.</p>
      <div class="actions">
        <a class="button-link secondary" href="docs/FUENTES.md" target="_blank" rel="noopener" data-i18n="verFuentesProyecto">Ver fuentes del proyecto</a>
        <a class="button-link secondary" href="README.md" target="_blank" rel="noopener" data-i18n="verDocumentacion">Ver documentación</a>
      </div>
    </section>
    <section class="panel help-sources-panel">
      <h2 data-i18n="paginasInformativas">Páginas informativas</h2>
      <p data-i18n="paginasInformativasTexto">Información pública sobre el alcance de la calculadora, privacidad, preguntas frecuentes y términos de uso.</p>
      <div class="actions">
        <a class="button-link secondary" href="pages/acerca-de.html" data-i18n="acercaDe">Acerca de</a>
        <a class="button-link secondary" href="pages/como-funciona.html" data-i18n="comoFunciona">Cómo funciona</a>
        <a class="button-link secondary" href="pages/preguntas-frecuentes.html" data-i18n="preguntasFrecuentes">Preguntas frecuentes</a>
        <a class="button-link secondary" href="pages/privacidad.html" data-i18n="privacidad">Privacidad</a>
        <a class="button-link secondary" href="pages/terminos.html" data-i18n="terminos">Términos</a>
      </div>
    </section>
  `;

  function aplicarEstadoSidebar(expandida) {
    shell?.classList.toggle("sidebar-collapsed", !expandida);
    sidebarToggle?.setAttribute("aria-expanded", String(expandida));
    sidebarToggle?.setAttribute(
      "aria-label",
      t(expandida ? "contraerNavegacion" : "expandirNavegacion")
    );
    const etiqueta = sidebarToggle?.querySelector(".dashboard-nav__label");
    if (etiqueta) {
      etiqueta.textContent = t(expandida ? "contraer" : "expandir");
    }
  }

  function cargarEstadoSidebar() {
    try {
      const guardado = localStorage.getItem(SIDEBAR_STORAGE_KEY);
      return guardado === null ? true : guardado === "true";
    } catch (error) {
      console.warn("No fue posible cargar el estado de la navegación.", error);
      return true;
    }
  }

  function guardarEstadoSidebar(expandida) {
    try {
      localStorage.setItem(SIDEBAR_STORAGE_KEY, String(expandida));
    } catch (error) {
      console.warn("No fue posible guardar el estado de la navegación.", error);
    }
  }

  function cerrarMenuMovil(devolverFoco = false) {
    const estabaAbierto = mobileMoreMenu && !mobileMoreMenu.hidden;
    if (mobileMoreMenu) {
      mobileMoreMenu.hidden = true;
    }
    mobileMoreButton?.setAttribute("aria-expanded", "false");
    if (devolverFoco && estabaAbierto) {
      mobileMoreButton?.focus();
    }
  }

  function guardarSeccion(id) {
    try {
      localStorage.setItem(STORAGE_KEY, id);
    } catch (error) {
      console.warn("No fue posible guardar la seccion activa.", error);
    }
  }

  function mostrarSeccion(id, opciones = {}) {
    const destino = vistas[id] ? id : "cotizar";

    if (destino === "cotizar" || destino === "resultado") {
      ubicarResultados(destino);
    }

    Object.entries(vistas).forEach(([vistaId, vista]) => {
      const activa = vistaId === destino;
      vista.hidden = !activa;
      vista.setAttribute("aria-hidden", String(!activa));
    });

    document
      .querySelectorAll("#dashboardNav [data-section], #mobileBottomNav [data-section], #mobileMoreMenu [data-section]")
      .forEach((boton) => {
      const activo = boton.dataset.section === destino;
      boton.classList.toggle("active", activo);
      if (activo) {
        boton.setAttribute("aria-current", "page");
      } else {
        boton.removeAttribute("aria-current");
      }

      if (activo && window.matchMedia("(max-width: 768px)").matches && boton.closest("#mobileBottomNav")) {
        window.requestAnimationFrame(() => {
          boton.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
        });
      }
    });

    const seccionesSecundarias = new Set([
      "cotizacion-cliente",
      "datos-cotizacion",
      "impresoras",
      "filamentos",
      "finanzas",
      "cotizaciones",
      "configuracion",
      "ayuda"
    ]);
    const masActivo = seccionesSecundarias.has(destino);
    mobileMoreButton?.classList.toggle("active", masActivo);
    if (masActivo) {
      mobileMoreButton?.setAttribute("aria-current", "page");
    } else {
      mobileMoreButton?.removeAttribute("aria-current");
    }
    cerrarMenuMovil();

    if (opciones.guardar !== false) {
      guardarSeccion(destino);
    }

    if (opciones.enfocar) {
      const objetivoFoco = opciones.focoSelector
        ? vistas[destino].querySelector(opciones.focoSelector)
        : vistas[destino].querySelector("h2");
      objetivoFoco?.focus({ preventScroll: true });
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  function mostrarResultadoEnCotizar() {
    mostrarSeccion("cotizar");
    window.requestAnimationFrame(() => {
      const tituloBasico = resultadoBasico?.querySelector("#resultadoBasicoTitulo");
      const tituloAvanzado = resultadoAvanzado?.querySelector("h2");
      const objetivo = resultadoBasico && !resultadoBasico.hidden
        ? tituloBasico
        : tituloAvanzado || tituloBasico || columnaResultado;
      if (objetivo && !objetivo.hasAttribute("tabindex")) {
        objetivo.setAttribute("tabindex", "-1");
      }
      objetivo?.focus({ preventScroll: true });
      objetivo?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  function cargarSeccion() {
    try {
      const guardada = localStorage.getItem(STORAGE_KEY) || "cotizar";
      return guardada === "resultado" ? "cotizar" : guardada;
    } catch (error) {
      console.warn("No fue posible cargar la seccion activa.", error);
      return "cotizar";
    }
  }

  function manejarNavegacion(event) {
    const boton = event.target.closest("[data-section]");
    if (boton) {
      mostrarSeccion(boton.dataset.section, { enfocar: true });
    }
  }

  [nav, mobileBottomNav, mobileMoreMenu]
    .filter(Boolean)
    .forEach((contenedor) => contenedor.addEventListener("click", manejarNavegacion));

  sidebarToggle?.addEventListener("click", () => {
    const expandida = sidebarToggle.getAttribute("aria-expanded") !== "true";
    aplicarEstadoSidebar(expandida);
    guardarEstadoSidebar(expandida);
  });

  mobileMoreButton?.addEventListener("click", () => {
    const abierto = mobileMoreButton.getAttribute("aria-expanded") === "true";
    mobileMoreButton.setAttribute("aria-expanded", String(!abierto));
    if (mobileMoreMenu) {
      mobileMoreMenu.hidden = abierto;
    }
  });

  document.addEventListener("click", (event) => {
    if (
      mobileMoreMenu &&
      !mobileMoreMenu.hidden &&
      !mobileMoreMenu.contains(event.target) &&
      !mobileMoreButton?.contains(event.target)
    ) {
      cerrarMenuMovil();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && mobileMoreMenu && !mobileMoreMenu.hidden) {
      cerrarMenuMovil(true);
    }
  });

  document.querySelector("#calcularAvanzadoDesdeCotizar")?.addEventListener("click", () => {
    document.querySelector("#calculateButton")?.click();
  });

  document.querySelector("#guardarDesdeResultadoButton")?.addEventListener("click", () => {
    mostrarSeccion("trabajos", { enfocar: true, focoSelector: "#trabajoCliente" });
  });

  document.querySelector("#generarCotizacionDesdeResultadoButton")?.addEventListener("click", () => {
    document.dispatchEvent(new CustomEvent("precio3d:abrir-cotizacion-actual"));
    mostrarSeccion("cotizacion-cliente", { enfocar: true });
  });

  document.querySelector("#agregarCalculoCotizacionButton")?.addEventListener("click", () => {
    document.dispatchEvent(new CustomEvent("precio3d:agregar-calculo-cotizacion"));
    mostrarSeccion("cotizacion-cliente", { enfocar: true });
  });

  document.querySelector("#volverACotizarDesdeResultadoButton")?.addEventListener("click", () => {
    mostrarSeccion("cotizar", { enfocar: true });
  });

  document.querySelector("#irADatosCotizacionButton")?.addEventListener("click", () => {
    mostrarSeccion("datos-cotizacion", { enfocar: true });
  });

  document.querySelector("#editarDatosDesdeCotizacionButton")?.addEventListener("click", () => {
    mostrarSeccion("datos-cotizacion", { enfocar: true });
  });

  document.querySelector("#volverResultadoDesdeCotizacionButton")?.addEventListener("click", () => {
    mostrarResultadoEnCotizar();
  });

  document.querySelector("#volverCotizacionDesdeDatosButton")?.addEventListener("click", () => {
    document.dispatchEvent(new CustomEvent("precio3d:actualizar-vista-cotizacion"));
    mostrarSeccion("cotizacion-cliente", { enfocar: true });
  });

  // app.js emite este evento unicamente cuando el calculo es valido.
  document.addEventListener("precio3d:calculo-valido", () => {
    mostrarResultadoEnCotizar();
  });

  document.addEventListener("precio3d:trabajo-cargado", () => {
    mostrarSeccion("cotizar", { enfocar: true });
  });

  document.addEventListener("precio3d:cotizacion-trabajo", () => {
    mostrarSeccion("cotizacion-cliente", { enfocar: true });
  });

  document.addEventListener("precio3d:datos-cotizacion-guardados", () => {
    mostrarSeccion("cotizacion-cliente", { enfocar: true });
  });

  document.addEventListener("precio3d:idioma-actualizado", () => {
    aplicarEstadoSidebar(sidebarToggle?.getAttribute("aria-expanded") === "true");
  });

  window.NavegacionPrecio3D = {
    mostrarSeccion,
    claveStorage: STORAGE_KEY,
    claveSidebar: SIDEBAR_STORAGE_KEY
  };

  aplicarEstadoSidebar(cargarEstadoSidebar());
  mostrarSeccion(cargarSeccion(), { guardar: false });
})();

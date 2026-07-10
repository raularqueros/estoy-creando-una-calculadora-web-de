// Navegacion simple por secciones para la interfaz tipo panel.
(function () {
  "use strict";

  const STORAGE_KEY = "precio3d_seccion_activa_v1";
  const main = document.querySelector("#dashboardContent");
  const nav = document.querySelector("#dashboardNav");

  if (!main || !nav) {
    console.error("No se pudo iniciar la navegacion principal.");
    return;
  }

  const nombres = {
    cotizar: ["Cotizar", "Ingresa los datos de tu impresión para calcular un precio rentable."],
    resultado: ["Resultado", "Revisa el precio sugerido, tus costos y la utilidad estimada."],
    trabajos: ["Mis trabajos", "Guarda y organiza tus cotizaciones, ventas y pedidos."],
    "datos-cotizacion": ["Datos de cotización", "Configura los datos de tu negocio, cliente y condiciones comerciales."],
    "cotizacion-cliente": ["Cotización para cliente", "Prepara una cotización limpia para imprimir o guardar como PDF."],
    configuracion: ["Configuración", "Personaliza los costos y preferencias utilizados en los cálculos."],
    ayuda: ["Ayuda / Fuentes", "Consulta explicaciones, advertencias y fuentes de referencia."]
  };

  const vistas = {};

  function crearVista(id) {
    const vista = document.createElement("section");
    vista.id = `vista-${id}`;
    vista.className = "dashboard-view";
    vista.dataset.view = id;
    vista.setAttribute("aria-labelledby", `titulo-vista-${id}`);
    vista.innerHTML = `
      <header class="dashboard-view__header">
        <h2 id="titulo-vista-${id}" tabindex="-1">${nombres[id][0]}</h2>
        <p>${nombres[id][1]}</p>
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
  const opcionesBasicas = document.querySelector(".quick-panel > details.collapsible-section");
  const botonCostos = document.querySelector("#toggleSupuestosEditables")?.closest(".collapse-row");
  const costosBasicos = document.querySelector("#supuestosEditablesBasico");
  const paneles = {
    selectorModo: document.querySelector(".mode-switch-panel"),
    modoBasico: document.querySelector("#seccionModoBasico"),
    modoAvanzado: document.querySelector("#seccionModoAvanzado"),
    preciosNivel: document.querySelector(".price-levels-panel"),
    comparador: document.querySelector("#comparadorCanalesPanel"),
    ultimoCalculo: document.querySelector("#ultimoCalculoPanel"),
    trabajos: document.querySelector("#misTrabajosPanel"),
    cotizacionCliente: document.querySelector("#cotizacionClientePanel"),
    datosCotizacion: document.querySelector("#datosCotizacionPanel"),
    configuracion: document.querySelector(".storage-panel:not(#ultimoCalculoPanel)")
  };

  main.replaceChildren(fragmento);

  function contenido(id) {
    return vistas[id].querySelector(".dashboard-view__content");
  }

  function mover(id, elementos) {
    elementos.filter(Boolean).forEach((elemento) => contenido(id).appendChild(elemento));
  }

  mover("cotizar", [
    paneles.selectorModo,
    paneles.modoBasico,
    paneles.modoAvanzado
  ]);

  const accionesAvanzadas = document.createElement("section");
  accionesAvanzadas.className = "panel advanced-calculate-panel";
  accionesAvanzadas.innerHTML = `
    <div>
      <h2>Calcular cotización avanzada</h2>
      <p class="help-text">Usa todos los datos del formulario avanzado para generar el resultado.</p>
    </div>
    <button type="button" id="calcularAvanzadoDesdeCotizar">Calcular</button>
  `;
  paneles.modoAvanzado?.appendChild(accionesAvanzadas);

  const accionesResultado = document.createElement("section");
  accionesResultado.className = "panel result-workflow-panel";
  accionesResultado.innerHTML = `
    <div>
      <h2>Acciones del cálculo</h2>
      <p class="help-text">Guarda el cálculo actual o vuelve al formulario para hacer cambios.</p>
    </div>
    <div class="actions">
      <button type="button" id="guardarDesdeResultadoButton" disabled>Guardar como trabajo</button>
      <button type="button" id="generarCotizacionDesdeResultadoButton" class="secondary" disabled>Generar cotización</button>
      <button type="button" id="volverACotizarDesdeResultadoButton" class="secondary">Nuevo cálculo</button>
    </div>
  `;

  mover("resultado", [
    accionesResultado,
    resultadoBasico,
    resultadoAvanzado,
    paneles.preciosNivel,
    paneles.comparador,
    paneles.ultimoCalculo
  ]);

  mover("trabajos", [paneles.trabajos]);
  mover("cotizacion-cliente", [paneles.cotizacionCliente]);
  mover("datos-cotizacion", [paneles.datosCotizacion]);

  const pasoDatosCotizacion = document.createElement("section");
  pasoDatosCotizacion.className = "panel quote-step-panel";
  pasoDatosCotizacion.innerHTML = `
    <div>
      <p class="eyebrow">Paso 1</p>
      <h2>Completa los datos de la cotización</h2>
      <p class="help-text">Primero registra los datos del negocio, cliente y condiciones comerciales.</p>
    </div>
    <button type="button" id="irADatosCotizacionButton">Completar datos</button>
  `;
  contenido("cotizacion-cliente").prepend(pasoDatosCotizacion);

  const accionesCotizacion = document.createElement("div");
  accionesCotizacion.className = "actions section-navigation-actions";
  accionesCotizacion.innerHTML = `
    <button type="button" id="editarDatosDesdeCotizacionButton" class="secondary">Editar datos de cotización</button>
    <button type="button" id="volverResultadoDesdeCotizacionButton" class="secondary">Volver al resultado</button>
  `;
  contenido("cotizacion-cliente").appendChild(accionesCotizacion);

  const accionesDatosCotizacion = document.createElement("div");
  accionesDatosCotizacion.className = "actions section-navigation-actions";
  accionesDatosCotizacion.innerHTML = `
    <button type="button" id="volverCotizacionDesdeDatosButton" class="secondary">Volver a la cotización</button>
  `;
  contenido("datos-cotizacion").appendChild(accionesDatosCotizacion);

  const panelCostos = document.createElement("section");
  panelCostos.className = "panel settings-panel";
  panelCostos.innerHTML = `
    <h2>Costos internos usados</h2>
    <p class="help-text">Puedes mantener estos valores o ajustarlos con tus costos reales. Se usan en el modo básico.</p>
  `;
  [opcionesBasicas, botonCostos, costosBasicos].filter(Boolean).forEach((elemento) => panelCostos.appendChild(elemento));

  mover("configuracion", [
    panelCostos,
    paneles.configuracion
  ]);

  contenido("ayuda").innerHTML = `
    <section class="panel help-sources-panel">
      <h2>Como usar la ayuda</h2>
      <p>Los botones de información <strong>i</strong> explican los campos más técnicos sin cambiar tus datos.</p>
      <p>Los costos, comisiones e impuestos son referenciales. Verifica las tarifas y obligaciones aplicables en tu país antes de enviar una cotización.</p>
      <div class="actions">
        <a class="button-link secondary" href="docs/FUENTES.md" target="_blank" rel="noopener">Ver fuentes del proyecto</a>
        <a class="button-link secondary" href="README.md" target="_blank" rel="noopener">Ver documentación</a>
      </div>
    </section>
  `;

  function guardarSeccion(id) {
    try {
      localStorage.setItem(STORAGE_KEY, id);
    } catch (error) {
      console.warn("No fue posible guardar la seccion activa.", error);
    }
  }

  function mostrarSeccion(id, opciones = {}) {
    const destino = vistas[id] ? id : "cotizar";

    Object.entries(vistas).forEach(([vistaId, vista]) => {
      const activa = vistaId === destino;
      vista.hidden = !activa;
      vista.setAttribute("aria-hidden", String(!activa));
    });

    nav.querySelectorAll("[data-section]").forEach((boton) => {
      const activo = boton.dataset.section === destino;
      boton.classList.toggle("active", activo);
      boton.setAttribute("aria-current", activo ? "page" : "false");

      if (activo && window.matchMedia("(max-width: 768px)").matches) {
        window.requestAnimationFrame(() => {
          boton.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
        });
      }
    });

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

  function cargarSeccion() {
    try {
      return localStorage.getItem(STORAGE_KEY) || "cotizar";
    } catch (error) {
      console.warn("No fue posible cargar la seccion activa.", error);
      return "cotizar";
    }
  }

  nav.addEventListener("click", (event) => {
    const boton = event.target.closest("[data-section]");
    if (boton) {
      mostrarSeccion(boton.dataset.section, { enfocar: true });
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
    mostrarSeccion("resultado", { enfocar: true });
  });

  document.querySelector("#volverCotizacionDesdeDatosButton")?.addEventListener("click", () => {
    document.dispatchEvent(new CustomEvent("precio3d:actualizar-vista-cotizacion"));
    mostrarSeccion("cotizacion-cliente", { enfocar: true });
  });

  // app.js emite este evento unicamente cuando el calculo es valido.
  document.addEventListener("precio3d:calculo-valido", () => {
    mostrarSeccion("resultado", { enfocar: true });
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

  window.NavegacionPrecio3D = {
    mostrarSeccion,
    claveStorage: STORAGE_KEY
  };

  mostrarSeccion(cargarSeccion(), { guardar: false });
})();

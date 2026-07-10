// Ayuda contextual para explicar campos y secciones sin afectar los calculos.
const contenidos = {
  datosImpresion: {
    titulo: "Datos de la impresión",
    texto:
      "Estos datos normalmente salen del slicer, como Bambu Studio, PrusaSlicer, Cura o Creality Print. Busca el peso estimado de la pieza, el material extra usado en soportes o purga, y el tiempo de impresión. Si no conoces el peso de soportes, puedes dejarlo en 0 o usar una estimación conservadora."
  },
  precioFilamento: {
    titulo: "Precio del filamento",
    texto:
      "Puedes ingresar el precio por gramo o el precio del kilo completo. Si compras una bobina de 1 kg a $12.000, usa la opción precio por kilo y escribe 12000. La calculadora convertirá automáticamente ese valor a precio por gramo."
  },
  materialExtra: {
    titulo: "Material extra: soportes o purga",
    texto:
      "Este campo considera material que no queda en la pieza final, como soportes, torres de purga, cambios de color o material descartado. El slicer suele mostrar este consumo. Si tu pieza no usa soportes ni purga, puedes dejarlo en 0."
  },
  ventaGanancia: {
    titulo: "Venta y ganancia",
    texto:
      "En esta sección defines cuánto trabajo adicional requiere la pieza, cuánto gastarás en embalaje y envío, y qué margen deseas ganar. El margen no es lo mismo que el impuesto ni la comisión: es tu utilidad objetivo sobre el costo."
  },
  nivelTrabajo: {
    titulo: "Nivel de trabajo",
    texto:
      "Usa Básico para piezas simples sin mucho acabado. Usa Normal si debes retirar soportes, revisar calidad o hacer limpieza menor. Usa Detallado si hay lijado, pintura, armado, ajuste o terminaciones especiales. Puedes editar manualmente el valor de trabajo."
  },
  comisiones: {
    titulo: "Comisiones",
    texto:
      "Las comisiones dependen del canal de venta. Venta directa puede no tener comisión. Una tienda propia puede usar Stripe o PayPal. Marketplaces como Etsy, eBay, Amazon o Mercado Libre pueden cobrar comisión propia. Evita duplicar comisiones si el marketplace ya integra el pago."
  },
  impuestos: {
    titulo: "Impuestos",
    texto:
      "Este campo es referencial. El impuesto depende del país, tipo de venta y normativa vigente. No reemplaza asesoría contable o tributaria. Si no corresponde aplicar impuesto al precio final, puedes dejarlo en 0."
  },
  resultado: {
    titulo: "Resultado",
    texto:
      "El precio sugerido incluye costo real, utilidad objetivo, comisiones e impuesto. Revisa también el desglose para entender qué parte del precio viene de material, trabajo, envío, amortización, fees o impuestos."
  },
  supuestos: {
    titulo: "Costos internos usados",
    texto:
      "Estos valores ayudan a calcular costos como electricidad, mantenimiento, vida útil de la impresora y pérdidas estimadas. Puedes dejarlos como están o cambiarlos si conoces tus costos reales."
  },
  comparador: {
    titulo: "Comparador de canales",
    texto:
      "Este comparador usa el mismo pedido y recalcula el precio cambiando solo las comisiones del canal y método de pago. Sirve para ver si te conviene vender directo, en tienda propia o en marketplace."
  },
  configuracion: {
    titulo: "Configuración",
    texto:
      "Aquí puedes guardar tus valores frecuentes, como moneda, margen, precio del filamento o método de pago. La información queda guardada solo en este navegador mediante LocalStorage."
  },
  modoAvanzado: {
    titulo: "Modo avanzado",
    texto:
      "El modo avanzado permite editar costos técnicos como amortización, mantenimiento, electricidad, mano de obra por hora, fees, aduanas y otros costos. Úsalo cuando quieras una cotización más precisa."
  },
  precioFilamentoCampo: {
    titulo: "Precio del filamento",
    texto:
      "Puedes ingresar el precio por gramo o el precio del kilo completo. Si compraste una bobina de 1 kg a $12.000, selecciona precio por kilo y escribe 12000. La calculadora lo convertirá automáticamente a precio por gramo."
  },
  materialExtraCampo: {
    titulo: "Material extra: soportes o purga",
    texto:
      "Corresponde al material que se usa pero no queda en la pieza final, como soportes, purga por cambio de color o torre de limpieza. Puedes verlo en el slicer. Si no usas soportes ni purga, deja 0."
  },
  mermaCampo: {
    titulo: "Pérdidas o fallas estimadas",
    texto:
      "Es un porcentaje adicional para cubrir fallas, pruebas, piezas rechazadas o pequeñas pérdidas de material. Para empezar puedes usar 5% a 10%. Si tu impresión es riesgosa, usa un valor mayor."
  },
  tiempoImpresionCampo: {
    titulo: "Tiempo de impresión",
    texto:
      "Este dato normalmente lo entrega el slicer antes de imprimir, por ejemplo Bambu Studio, PrusaSlicer, Cura o Creality Print. Usa el tiempo estimado total de impresión."
  },
  nivelTrabajoCampo: {
    titulo: "Nivel de trabajo",
    texto:
      "Sirve para estimar el trabajo humano. Básico es para piezas simples. Normal considera retirar soportes y revisar calidad. Detallado aplica cuando hay lijado, pintura, armado o terminaciones especiales."
  },
  manoObraSimpleCampo: {
    titulo: "Trabajo / terminaciones",
    texto:
      "Es el valor que quieres cobrar por tu tiempo de preparación, retiro de soportes, limpieza, revisión, armado o terminaciones. No es costo de máquina: es tu trabajo humano."
  },
  margenCampo: {
    titulo: "Margen",
    texto:
      "El margen es la utilidad objetivo sobre tus costos. No es lo mismo que impuesto ni comisión. Por ejemplo, 30% significa que quieres ganar un 30% sobre el costo estimado antes de fees e impuestos."
  },
  impuestoCampo: {
    titulo: "Impuesto",
    texto:
      "Es un valor referencial. Depende del país, tipo de venta y situación tributaria. Si no corresponde agregar impuesto al precio final, puedes dejarlo en 0. No reemplaza asesoría contable o tributaria."
  },
  comisionPorcentajeCampo: {
    titulo: "Comisión %",
    texto:
      "Es la comisión porcentual que cobra una plataforma o método de pago. Por ejemplo, si un marketplace cobra 6%, escribe 6. La calculadora lo interpreta como 6%."
  },
  comisionFijaCampo: {
    titulo: "Comisión fija",
    texto:
      "Es un cargo fijo por venta u orden. Algunos marketplaces o métodos de pago cobran un monto fijo además del porcentaje. Si no aplica, deja 0."
  },
  wattsPromedioCampo: {
    titulo: "Watts promedio",
    texto:
      "Es el consumo eléctrico promedio de la impresora durante el trabajo. Si no lo sabes, puedes usar un valor referencial como 80 W, 120 W o el valor sugerido por tu impresora."
  },
  tarifaKwhCampo: {
    titulo: "Tarifa kWh",
    texto:
      "Es el precio que pagas por cada kWh de electricidad. Puedes encontrarlo en tu boleta eléctrica. Si no lo sabes, usa un valor aproximado y luego ajústalo."
  },
  costoImpresoraCampo: {
    titulo: "Costo impresora",
    texto:
      "Es el valor de compra de la impresora. Se usa para estimar amortización, es decir, recuperar poco a poco el costo de la máquina en cada trabajo."
  },
  vidaUtilCampo: {
    titulo: "Vida útil",
    texto:
      "Es la cantidad de años en que esperas recuperar la inversión de la impresora. Para una estimación simple puedes usar 2 o 3 años."
  },
  diasOperativosCampo: {
    titulo: "Días operativos al año",
    texto:
      "Son los días al año en que realmente usas la impresora para producir. No necesariamente son 365. Puedes usar 250, 300 o el valor que refleje tu operación."
  },
  horasProductivasCampo: {
    titulo: "Horas productivas al día",
    texto:
      "Son las horas promedio al día en que la impresora produce trabajos cobrables. Sirve para calcular el costo de máquina por hora."
  },
  mantenimientoCampo: {
    titulo: "Mantenimiento",
    texto:
      "Es una reserva para boquillas, repuestos, láminas, lubricación, calibraciones o reparaciones. Para empezar puedes usar 5% a 10%."
  },
  seguroCampo: {
    titulo: "Seguro o aduanas",
    texto:
      "Es un costo opcional de envío o protección del pedido. Si no contratas seguro o no lo incluyes en el precio, deja 0. Si este campo lo usas para aduanas, considera aranceles, gestión internacional u otros cargos similares."
  },
  aduanasCampo: {
    titulo: "Aduanas",
    texto:
      "Úsalo si absorbes costos de aduana, aranceles o gestión internacional. Si vendes localmente o el cliente paga esos cargos aparte, deja 0."
  },
  otrosCostosCampo: {
    titulo: "Marketing / otros costos",
    texto:
      "Sirve para incluir costos adicionales como publicidad, muestras, descuentos, empaques especiales, errores menores o costos administrativos."
  },
  metodoPagoComparadorCampo: {
    titulo: "Método de pago para comparar",
    texto:
      "Permite comparar si el pago se hace por efectivo, transferencia, Stripe, PayPal u otro método. Si el marketplace ya integra el cobro, evita sumar un pago externo para no duplicar comisiones."
  }
};

let ultimoFocoAyuda = null;

function obtenerElementosAyuda() {
  return {
    modal: document.querySelector("#helpModal"),
    titulo: document.querySelector("#helpModalTitle"),
    texto: document.querySelector("#helpModalText"),
    cerrar: document.querySelector("#helpModalClose")
  };
}

function mostrarAyuda(clave) {
  const contenido = contenidos[clave];
  const elementos = obtenerElementosAyuda();

  if (!contenido || !elementos.modal || !elementos.titulo || !elementos.texto) {
    return;
  }

  ultimoFocoAyuda = document.activeElement;
  elementos.titulo.textContent = contenido.titulo;
  elementos.texto.textContent = contenido.texto;
  elementos.modal.hidden = false;
  elementos.cerrar?.focus();
}

function cerrarAyuda() {
  const elementos = obtenerElementosAyuda();

  if (!elementos.modal) {
    return;
  }

  elementos.modal.hidden = true;

  if (ultimoFocoAyuda?.focus) {
    ultimoFocoAyuda.focus();
  }
}

document.addEventListener("click", (event) => {
  const boton = event.target.closest("[data-help]");

  if (boton) {
    event.preventDefault();
    event.stopPropagation();
    mostrarAyuda(boton.dataset.help);
    return;
  }

  if (event.target.closest("[data-help-close]") || event.target.closest("#helpModalClose")) {
    cerrarAyuda();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    cerrarAyuda();
  }
});

window.AyudaPrecio3D = {
  contenidos,
  mostrarAyuda,
  cerrarAyuda
};

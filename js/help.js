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

const contenidosTraducidos = {
  en: {
    datosImpresion: ["Print data", "Use the weight, support or purge material, and print time estimated by your slicer. If support weight is unknown, use zero or a conservative estimate."],
    precioFilamento: ["Filament price", "Enter either the price per gram or the full kilogram price. The calculator converts a kilogram price into a cost per gram automatically."],
    materialExtra: ["Extra material: supports or purge", "Include material that does not remain in the final part, such as supports, purge towers, color changes, or discarded material."],
    ventaGanancia: ["Sale and profit", "Define additional labor, packaging, shipping, and your target margin. Margin is your target profit over cost, not a tax or fee."],
    nivelTrabajo: ["Work level", "Use Basic for simple parts, Normal for support removal and light cleanup, and Detailed for sanding, painting, assembly, or special finishing."],
    comisiones: ["Fees", "Fees depend on the sales channel and payment method. Avoid adding a separate payment fee when the marketplace already includes payment processing."],
    impuestos: ["Taxes", "This value is only a reference and depends on local rules and the type of sale. It does not replace accounting or tax advice."],
    resultado: ["Result", "The suggested price includes actual cost, target profit, fees, and tax. Review the breakdown to understand each component."],
    supuestos: ["Internal costs used", "These values estimate electricity, maintenance, printer useful life, and expected losses. Replace them with your actual costs when available."],
    comparador: ["Channel comparator", "The comparator keeps the same order and recalculates only channel and payment fees so you can compare selling options."],
    configuracion: ["Settings", "Save frequent values such as currency, margin, filament price, and payment method. Data is stored only in this browser."],
    modoAvanzado: ["Advanced mode", "Advanced mode exposes amortization, maintenance, electricity, hourly labor, fees, customs, and other costs for a more precise quote."],
    mermaCampo: ["Estimated losses or failures", "Add a percentage for failed prints, tests, rejected parts, and small material losses. A common starting range is 5% to 10%."],
    tiempoImpresionCampo: ["Print time", "Use the total print time estimated by your slicer before printing."],
    manoObraSimpleCampo: ["Labor and finishing", "Enter what you charge for preparation, support removal, cleaning, inspection, assembly, and finishing. This is human labor, not machine cost."],
    margenCampo: ["Margin", "Margin is the target profit over your costs. It is separate from taxes and platform or payment fees."],
    comisionPorcentajeCampo: ["Percentage fee", "Enter the percentage charged by the platform or payment method. For example, enter 6 for a 6% fee."],
    comisionFijaCampo: ["Fixed fee", "Enter any fixed charge per sale or order in addition to percentage fees. Use zero when it does not apply."],
    wattsPromedioCampo: ["Average watts", "Enter the printer's average electrical consumption while working. Use a reasonable reference value if it is unknown."],
    tarifaKwhCampo: ["kWh rate", "Enter the price paid for each kWh of electricity, normally shown on your electricity bill."],
    costoImpresoraCampo: ["Printer cost", "Enter the printer purchase price so its cost can be recovered gradually through amortization."],
    vidaUtilCampo: ["Useful life", "Enter the number of years over which you expect to recover the printer investment."],
    diasOperativosCampo: ["Operating days per year", "Enter the number of days per year the printer is realistically available for production."],
    horasProductivasCampo: ["Productive hours per day", "Enter the average daily hours used for billable production to estimate the machine hourly cost."],
    mantenimientoCampo: ["Maintenance", "Set aside a percentage for nozzles, spare parts, build plates, lubrication, calibration, and repairs."],
    seguroCampo: ["Insurance or customs", "Include optional shipping protection, customs duties, or international handling costs. Use zero when they do not apply."],
    aduanasCampo: ["Customs", "Use this when you absorb customs, duties, or international handling costs; otherwise leave it at zero."],
    otrosCostosCampo: ["Marketing and other costs", "Include advertising, samples, discounts, special packaging, minor errors, or administrative costs."],
    metodoPagoComparadorCampo: ["Payment method to compare", "Choose the payment method used in the comparison. Do not add an external payment fee when the marketplace already processes payment."]
  },
  pt: {
    datosImpresion: ["Dados da impressão", "Use o peso, o material de suporte ou purga e o tempo estimados pelo slicer. Se não souber o peso dos suportes, use zero ou uma estimativa conservadora."],
    precioFilamento: ["Preço do filamento", "Informe o preço por grama ou o preço do quilo completo. A calculadora converte automaticamente o preço do quilo em custo por grama."],
    materialExtra: ["Material extra: suportes ou purga", "Inclua material que não fica na peça final, como suportes, torres de purga, trocas de cor ou material descartado."],
    ventaGanancia: ["Venda e lucro", "Defina mão de obra adicional, embalagem, envio e margem desejada. A margem é o lucro-alvo sobre o custo, não imposto ou comissão."],
    nivelTrabajo: ["Nível de trabalho", "Use Básico para peças simples, Normal para remover suportes e limpar, e Detalhado para lixar, pintar, montar ou dar acabamentos especiais."],
    comisiones: ["Comissões", "As comissões dependem do canal e do método de pagamento. Evite somar outra taxa quando o marketplace já processa o pagamento."],
    impuestos: ["Impostos", "Este valor é apenas referencial e depende das regras locais e do tipo de venda. Não substitui orientação contábil ou tributária."],
    resultado: ["Resultado", "O preço sugerido inclui custo real, lucro desejado, comissões e imposto. Revise o detalhamento para entender cada componente."],
    supuestos: ["Custos internos usados", "Estes valores estimam eletricidade, manutenção, vida útil da impressora e perdas. Substitua-os pelos custos reais quando disponíveis."],
    comparador: ["Comparador de canais", "O comparador mantém o mesmo pedido e recalcula apenas as taxas do canal e do pagamento para comparar opções de venda."],
    configuracion: ["Configurações", "Salve valores frequentes como moeda, margem, preço do filamento e método de pagamento. Os dados ficam apenas neste navegador."],
    modoAvanzado: ["Modo avançado", "O modo avançado permite editar amortização, manutenção, eletricidade, mão de obra por hora, taxas, alfândega e outros custos."],
    mermaCampo: ["Perdas ou falhas estimadas", "Adicione uma porcentagem para impressões com falha, testes, peças rejeitadas e pequenas perdas. Um início comum é de 5% a 10%."],
    tiempoImpresionCampo: ["Tempo de impressão", "Use o tempo total de impressão estimado pelo slicer antes de imprimir."],
    manoObraSimpleCampo: ["Trabalho e acabamento", "Informe o valor da preparação, remoção de suportes, limpeza, revisão, montagem e acabamento. É trabalho humano, não custo da máquina."],
    margenCampo: ["Margem", "A margem é o lucro desejado sobre os custos. Ela é separada dos impostos e das taxas de plataforma ou pagamento."],
    comisionPorcentajeCampo: ["Comissão percentual", "Informe a porcentagem cobrada pela plataforma ou método de pagamento. Por exemplo, use 6 para uma taxa de 6%."],
    comisionFijaCampo: ["Comissão fixa", "Informe qualquer cobrança fixa por venda ou pedido além da comissão percentual. Use zero quando não se aplicar."],
    wattsPromedioCampo: ["Watts médios", "Informe o consumo elétrico médio da impressora durante o trabalho. Use um valor de referência razoável se não souber."],
    tarifaKwhCampo: ["Tarifa de kWh", "Informe o preço pago por cada kWh de eletricidade, normalmente disponível na conta de luz."],
    costoImpresoraCampo: ["Custo da impressora", "Informe o preço de compra para recuperar gradualmente o investimento por meio da amortização."],
    vidaUtilCampo: ["Vida útil", "Informe em quantos anos você espera recuperar o investimento da impressora."],
    diasOperativosCampo: ["Dias operacionais por ano", "Informe quantos dias por ano a impressora realmente fica disponível para produção."],
    horasProductivasCampo: ["Horas produtivas por dia", "Informe a média diária de horas de produção cobrável para estimar o custo por hora da máquina."],
    mantenimientoCampo: ["Manutenção", "Reserve uma porcentagem para bicos, peças, chapas, lubrificação, calibração e reparos."],
    seguroCampo: ["Seguro ou alfândega", "Inclua proteção de envio, impostos aduaneiros ou gestão internacional quando se aplicarem. Caso contrário, use zero."],
    aduanasCampo: ["Alfândega", "Use este campo se você absorver custos aduaneiros, tarifas ou gestão internacional; caso contrário, deixe zero."],
    otrosCostosCampo: ["Marketing e outros custos", "Inclua publicidade, amostras, descontos, embalagens especiais, pequenos erros ou custos administrativos."],
    metodoPagoComparadorCampo: ["Método de pagamento para comparar", "Escolha o método usado na comparação. Não some uma taxa externa quando o marketplace já processa o pagamento."]
  }
};

const aliasContenidoAyuda = {
  precioFilamentoCampo: "precioFilamento",
  materialExtraCampo: "materialExtra",
  nivelTrabajoCampo: "nivelTrabajo",
  impuestoCampo: "impuestos"
};

Object.keys(contenidos).forEach((clave) => {
  ["es", "en", "pt"].forEach((idioma) => {
    const claveTraducida = aliasContenidoAyuda[clave] || clave;
    const traduccion = contenidosTraducidos[idioma]?.[claveTraducida];
    const contenido = idioma === "es" || !traduccion
      ? contenidos[clave]
      : { titulo: traduccion[0], texto: traduccion[1] };
    const catalogo = window.IdiomasPrecio3D?.[idioma]?.textos;
    if (catalogo) {
      catalogo[`ayuda_${clave}_titulo`] = contenido.titulo;
      catalogo[`ayuda_${clave}_texto`] = contenido.texto;
    }
  });
});

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
  const contenido = {
    titulo: window.obtenerTextoI18n?.(`ayuda_${clave}_titulo`) || contenidos[clave]?.titulo,
    texto: window.obtenerTextoI18n?.(`ayuda_${clave}_texto`) || contenidos[clave]?.texto
  };
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

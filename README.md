# Calculadora de precio final para impresion 3D

## Descripcion

Calculadora web HTML5 + CSS + JavaScript puro para estimar el precio final de trabajos de impresion 3D. Funciona sin backend, sin frameworks y sin librerias externas.

El objetivo del MVP es ayudar a calcular un precio sugerido considerando costos reales, fees, impuestos y margen, sin depender solo del peso del material.

## Publico objetivo

- Makers
- Emprendedores de impresion 3D
- Talleres pequenos
- Vendedores online

## Que problema resuelve

Cobrar solo gramos de material y horas de impresion suele dejar costos importantes fuera del precio. Esta calculadora separa los componentes principales de una cotizacion:

- Material
- Soportes, purga o merma
- Electricidad
- Amortizacion del equipo
- Mano de obra
- Embalaje
- Envio
- Fees de canal y pago
- Impuestos
- Margen de ganancia

## Modos de uso

### Modo Basico / Cotizacion rapida

Pensado para cotizaciones rapidas con pocos datos visibles y supuestos editables. Usa presets de material, impresora y canal de venta, pero permite modificar valores clave como merma, electricidad, margen, impuesto, embalaje, envio y fees.

### Modo Avanzado

Permite ingresar datos con mas detalle: tiempos de preparacion y postprocesado, consumo electrico, costos de equipo, logistica, fees e impuestos. Usa el mismo motor de formulas que el modo basico.

## Funciones actuales del MVP

- Calculo de costo material
- Switch de costo de filamento por gramo o por kilo
- Normalizacion interna a costo por gramo
- Calculo de electricidad
- Calculo de amortizacion del equipo
- Mano de obra
- Logistica
- Margen de ganancia
- Impuestos
- Fees fijos y porcentuales
- Comparador de canales de venta
- Metodo de pago seleccionable en el comparador
- Prevencion de doble comision cuando un marketplace integra el cobro
- LocalStorage para configuracion del usuario
- Exportar e importar configuracion JSON
- Ultimo calculo guardado
- Selector de moneda para formato visual
- Estructura base de i18n para idiomas

## Formulas principales

### Costo material

```text
(pesoPieza + pesoSoportesPurga) * costoUnidad * (1 + merma)
```

`costoUnidad` siempre debe llegar al motor como costo por gramo. Si el usuario ingresa precio por kilo, la app calcula:

```text
costoUnidad = precioKilo / 1000
```

### Costo electricidad

```text
horasImpresion * kWPromedio * tarifaKwh
```

Donde:

```text
kWPromedio = wattsPromedio / 1000
```

### Costo equipo hora

```text
((costoImpresora + costoHerramientas) * (1 + mantenimiento)) / (anosVida * diasOperativosAno * horasProductivasDia)
```

### Amortizacion

```text
costoEquipoHora * horasImpresion
```

### Mano de obra

```text
(horasPreparacion + horasPostprocesado + horasQA) * tarifaHora
```

### Costo total

```text
material + electricidad + amortizacion + manoObra + logistica + marketing + otros
```

### Utilidad

```text
costoTotal * margen
```

### Precio neto

```text
(costoTotal + utilidad + feeFijoTotal) / (1 - feePorcentualTotal)
```

### Impuesto

```text
precioNeto * tasaImpuesto
```

### Precio final

```text
precioNeto + impuesto
```

## Regla critica de fees

Los fees porcentuales se resuelven dentro de la ecuacion del precio neto. No se suman al final.

Esto es importante porque si una plataforma cobra un porcentaje sobre el precio de venta, el precio final debe cubrir ese porcentaje desde la formula:

```text
precioNeto = (costoTotal + utilidad + feeFijoTotal) / (1 - feePorcentualTotal)
```

Si `feePorcentualTotal` es igual o mayor a 100%, el calculo no es valido porque implicaria dividir por cero o por un valor negativo.

## Estructura de archivos

```text
index.html
styles.css
app.js
js/formulas.js
js/presets.js
js/currencies.js
js/i18n.js
js/comparator.js
js/storage.js
```

- `index.html`: estructura de la interfaz, secciones, formularios, resultados y carga de scripts.
- `styles.css`: estilos responsive para escritorio y celular.
- `app.js`: conecta la interfaz con formulas, presets, comparador, moneda, idioma y almacenamiento local.
- `js/formulas.js`: motor unico de formulas puras.
- `js/presets.js`: materiales, impresoras, canales, metodos de pago, impuestos, envios y supuestos base.
- `js/currencies.js`: monedas disponibles y locales de formato.
- `js/i18n.js`: estructura base de textos por idioma.
- `js/comparator.js`: comparador de canales usando el motor de formulas.
- `js/storage.js`: guardado, carga, importacion y exportacion de configuracion con LocalStorage.

## Como usar localmente

1. Abrir `index.html` en el navegador.
2. Completar los datos del modo basico o avanzado.
3. Presionar `Calcular`.
4. Revisar el resultado y el comparador de canales.

No requiere instalacion, backend, cuenta de usuario ni internet para el calculo base.

## Como probar

### Caso A: costo por gramo

Datos:

- Peso pieza: `50`
- Soportes/purga: `5`
- Costo por gramo: `12`
- Merma: `10%`

Resultado esperado de costo material:

```text
(50 + 5) * 12 * (1 + 0.10) = 726
```

### Caso B: precio por kilo

Datos:

- Peso pieza: `50`
- Soportes/purga: `5`
- Precio por kilo: `12000`
- Merma: `10%`

Normalizacion:

```text
12000 / 1000 = 12 por gramo
```

Resultado esperado de costo material:

```text
(50 + 5) * 12 * (1 + 0.10) = 726
```

Ambos casos deben dar el mismo costo material.

## Advertencias

- Los fees son referenciales.
- Los impuestos son referenciales.
- Esta herramienta no es asesoria contable, tributaria ni legal.
- Las tarifas cambian segun pais, fecha, plataforma, categoria y tipo de cuenta.
- El usuario debe verificar sus valores antes de cotizar o vender.
- La moneda seleccionada solo cambia el formato visual; no realiza conversion automatica.

## Pendientes / Roadmap

- Exportacion real a Excel
- Graficos
- PDF
- Compartir calculo por enlace
- Edicion avanzada de presets desde interfaz
- Publicacion en GitHub Pages
- Posible importacion de `.gcode` o `.3mf` en una version futura

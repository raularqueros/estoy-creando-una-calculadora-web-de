# Calculadora de precio final para impresión 3D

Aplicación web estática en HTML, CSS y JavaScript puro para calcular precios de trabajos de impresión 3D, preparar cotizaciones, organizar clientes, registrar trabajos, controlar impresoras y bobinas de filamento, y revisar resultados financieros.

Funciona sin backend, sin cuentas, sin base de datos externa y sin frameworks. Es compatible con alojamiento estático como GitHub Pages.

## Enlace público

URL configurada para publicación:

https://raularqueros.github.io/estoy-creando-una-calculadora-web-de/

## Funciones principales

- Modo Básico y Modo Avanzado de cálculo.
- Costo de filamento por gramo o por kilo, normalizado internamente a costo por gramo.
- Costos de material, electricidad, amortización, mano de obra, logística, fees, impuestos y margen.
- Comparador de canales de venta.
- Gestión de trabajos y estados.
- Gestión de clientes.
- Gestión de cotizaciones para cliente.
- Registro de venta real y pagos asociados a trabajos.
- Gestión de impresoras.
- Inventario de filamentos, bobinas y consumos.
- Panel financiero con reportes y exportaciones CSV.
- Exportación/importación JSON y respaldo completo.
- Páginas públicas informativas.
- SEO técnico básico, `robots.txt`, `sitemap.xml`, `404.html`, favicon e imagen social.
- Blog estático preparado para artículos educativos.

## Almacenamiento local

Los datos se guardan en `LocalStorage` del navegador. Esto significa que:

- los datos quedan en el navegador y dispositivo usado;
- si se borran los datos del navegador, se pueden perder registros;
- para cambiar de computador conviene exportar un respaldo JSON e importarlo en el otro navegador;
- no existe sincronización automática en la nube.

Antes de publicar o usar comercialmente, revisa `pages/privacidad.html` y `pages/terminos.html`.

## Cómo ejecutar localmente

Opción simple:

1. Abrir `index.html` en el navegador.
2. Completar una cotización.
3. Presionar `Calcular`.

Opción con servidor local, útil para probar el blog y `fetch` de archivos JSON:

```bash
python -m http.server 8767
```

Luego abrir:

```text
http://127.0.0.1:8767/index.html
```

## Estructura principal

```text
index.html
styles.css
app.js
404.html
robots.txt
sitemap.xml
assets/
blog/
docs/
js/
pages/
styles/
tests/
```

Archivos clave:

- `js/formulas.js`: motor único de fórmulas puras.
- `js/storage.js`: persistencia, importación, exportación y respaldo.
- `js/navigation.js`: navegación por secciones.
- `js/clients.js` y `js/clients-dashboard.js`: clientes.
- `js/quotes.js` y `js/quotes-dashboard.js`: cotizaciones.
- `js/printers.js` y `js/printers-dashboard.js`: impresoras.
- `js/filaments.js` y `js/filaments-dashboard.js`: bobinas y consumos.
- `js/reports.js` y `js/reports-dashboard.js`: panel financiero.
- `js/backup.js`: respaldo completo e integridad.
- `blog/posts.json`: índice de artículos del blog.

## Fórmula base de material

```text
(pesoPieza + pesoSoportesPurga) * costoUnidad * (1 + merma)
```

Si el usuario ingresa precio por kilo:

```text
costoUnidad = precioKilo / 1000
```

Caso de prueba esperado:

```text
(50 + 5) * 12 * (1 + 0.10) = 726
```

El mismo resultado debe obtenerse usando `12` por gramo o `12000` por kilo.

## Publicación

Antes de actualizar GitHub Pages, revisar:

- `docs/CHECKLIST_PUBLICACION.md`
- `docs/SEO_Y_PUBLICACION.md`
- `docs/PAGINAS_PUBLICAS.md`
- `docs/COMO_PUBLICAR_ARTICULOS.md`
- `docs/RESPALDO_E_INTEGRIDAD.md`

No subir respaldos personales, exportaciones JSON con datos reales, archivos `.env`, logs ni archivos temporales.

## Estado del proyecto

Versión experimental pública preparada hasta Fase 5B.4: auditoría final y preparación de publicación.

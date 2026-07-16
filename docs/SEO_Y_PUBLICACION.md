# SEO tecnico y publicacion

## Configuracion actual

- Titulo: `Calculadora de precio de impresion 3D | Costos, cotizaciones e inventario`
- Description: `Calcula costos de impresion 3D, define precios rentables, crea cotizaciones y gestiona impresoras e inventario de filamentos desde una herramienta local.`
- URL publica: `https://raularqueros.github.io/estoy-creando-una-calculadora-web-de/`
- Configuracion editable: `js/site-config.js`

## Cambiar a dominio propio

1. Actualiza `urlSitio` y `rutaBase` en `js/site-config.js`.
2. Cambia el `canonical`, `og:url`, `og:image`, `twitter:image` y JSON-LD en `index.html`.
3. Actualiza las URLs completas de `robots.txt` y `sitemap.xml`.

## Imagen social y favicon

- Imagen social: `assets/images/social-preview.svg`
- Favicon: `assets/icons/favicon.svg`

Si luego existe un logotipo definitivo, reemplaza esos archivos manteniendo rutas relativas.

## Sitemap

El archivo `sitemap.xml` incluye solo la pagina principal. Cuando existan paginas informativas o articulos, agrega URLs reales publicas. No agregues secciones internas que dependan solo de JavaScript.

## Robots

`robots.txt` permite indexar la web y referencia el sitemap. Para comprobarlo, abre:

`https://raularqueros.github.io/estoy-creando-una-calculadora-web-de/robots.txt`

## Canonical

El canonical actual apunta a la pagina principal publicada en GitHub Pages. No debe usar `localhost` ni rutas locales.

## Limitaciones de una SPA estatica

La aplicacion funciona como sitio estatico y varias secciones internas se muestran mediante JavaScript. Los buscadores pueden leer el contenido inicial de `index.html`, pero no deben indexarse como paginas separadas si no existen URLs reales.

## SEO tecnico vs posicionamiento real

SEO tecnico significa que la pagina esta preparada para ser interpretada por buscadores: metadatos, canonical, sitemap, robots, datos estructurados y contenido inicial. El posicionamiento real depende tambien de contenido util, enlaces, velocidad, autoridad del dominio y busquedas de los usuarios.

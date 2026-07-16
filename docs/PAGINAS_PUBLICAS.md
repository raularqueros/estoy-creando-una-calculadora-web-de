# Paginas publicas

Este documento resume las paginas informativas agregadas para preparar la publicacion del sitio estatico.

## Paginas creadas

- `pages/acerca-de.html`: explica el objetivo de la calculadora y para quien esta pensada.
- `pages/como-funciona.html`: describe el flujo general del calculo y sus limitaciones.
- `pages/preguntas-frecuentes.html`: resuelve dudas comunes e incluye marcado `FAQPage`.
- `pages/privacidad.html`: explica almacenamiento local, respaldos y servicios externos usados.
- `pages/terminos.html`: define alcance, limitaciones y responsabilidades de uso.

No se creo pagina de contacto porque `emailSoporte` esta vacio en `js/site-config.js`.

## Enlaces agregados

- Footer publico en `index.html`.
- Bloque de paginas informativas dentro de la seccion Ayuda / Fuentes.
- `sitemap.xml` actualizado con las paginas nuevas.

## Datos que conviene confirmar antes de publicar en produccion

- Nombre legal o comercial del responsable del sitio.
- Correo o canal real de soporte, si se quiere agregar una pagina de contacto.
- Dominio final, si se cambia desde GitHub Pages a dominio propio.
- Pais principal de operacion.
- Condiciones comerciales definitivas para servicios pagados o version PRO.

## Textos que requieren revision si cambia el proyecto

- Privacidad: actualizar antes de agregar analitica, anuncios, cookies, login, backend, pagos, base de datos externa o integraciones nuevas.
- Terminos: actualizar antes de una explotacion comercial grande, version pagada o funciones con impacto contable, tributario o legal.
- FAQ: mantener sincronizada con las funciones reales disponibles.
- Sitemap: agregar nuevas paginas publicas indexables.

## Servicios externos declarados

La pagina de privacidad menciona los servicios usados actualmente por `js/geolocation.js`:

- `https://ipapi.co/json/`
- `https://api.country.is/`

Estos servicios se usan para deteccion aproximada de pais/moneda. No se usa GPS.

## Nota legal

Los textos de privacidad y terminos son informativos. Antes de operar comercialmente a gran escala, deben revisarse con asesoria legal y contable segun el pais correspondiente.

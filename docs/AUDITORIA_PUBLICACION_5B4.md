# Auditoría de publicación Fase 5B.4

Fecha: 2026-07-15

## Alcance

Se revisó la copia local `calculadora-3d-experimentos-visuales` como preparación para publicar una versión estable en GitHub Pages.

## Inventario público revisado

- `index.html`
- `404.html`
- `robots.txt`
- `sitemap.xml`
- `pages/acerca-de.html`
- `pages/como-funciona.html`
- `pages/preguntas-frecuentes.html`
- `pages/privacidad.html`
- `pages/terminos.html`
- `blog/index.html`
- `blog/post-template.html`
- `blog/posts.json`
- `blog/articulos/como-calcular-precio-impresion-3d.html`
- `styles.css`
- `styles/public-pages.css`
- `styles/blog.css`
- `assets/icons/favicon.svg`
- `assets/images/social-preview.svg`
- `assets/images/blog/placeholder-articulo.svg`

## Comprobaciones ejecutadas

- Metadatos SEO básicos: title, description, canonical, lang, h1, Open Graph y favicon.
- Rutas internas desde raíz, `pages/`, `blog/` y `blog/articulos/`.
- Duplicados de IDs en `index.html`.
- Scripts cargados desde `index.html`.
- CSS cargado desde `index.html`.
- Blog: `posts.json`, estados, borradores ocultos y borrador fuera del sitemap.
- `robots.txt` y `sitemap.xml`.
- Prueba de respaldo, importación, integridad y compatibilidad.
- Caso de material 726 por gramo y por kilo.
- Confirmación de que `js/formulas.js` no fue modificado.

## Problemas encontrados y corregidos

| Problema | Corrección |
| --- | --- |
| `.gitignore` era una carpeta local, no un archivo de reglas. | Se preservó como `.codex-local-ignore-backup/` y se creó un `.gitignore` real. |
| `README.md` describía una versión anterior del proyecto. | Se actualizó con funciones actuales, estructura, ejecución local, publicación y almacenamiento local. |
| No existía checklist formal de publicación. | Se creó `docs/CHECKLIST_PUBLICACION.md`. |

## Resultados

- SEO: sin problemas detectados en los archivos públicos revisados.
- Rutas: sin enlaces internos faltantes detectados.
- Blog: borrador oculto, noindex y fuera del sitemap.
- Privacidad: coherente con LocalStorage y servicios externos de geolocalización aproximada.
- Respaldo: pruebas automatizadas correctas.
- Cálculo 726: correcto.

## Pendientes manuales antes de publicar

- Revisar la app en navegador con datos de prueba.
- Confirmar visualmente responsive en 320, 375, 390, 768, 1024 y 1440 px.
- Verificar consola del navegador durante uso real.
- Exportar respaldo completo antes de subir cambios.
- Revisar legalmente privacidad y términos si se usará comercialmente a gran escala.

## Conclusión

La copia está preparada para publicación estática en GitHub Pages, con pendientes manuales normales de revisión visual y prueba en navegador real.

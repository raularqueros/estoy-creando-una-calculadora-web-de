# Como publicar articulos en el blog

El blog funciona como sitio estatico. No usa backend, base de datos, cuentas, CMS ni proceso de compilacion obligatorio.

## Flujo recomendado

1. Duplicar `blog/post-template.html`.
2. Guardar la copia en `blog/articulos/`.
3. Elegir un slug corto, descriptivo y sin espacios.
   - Ejemplo: `como-calcular-precio-impresion-3d.html`.
4. Completar el titulo del articulo.
5. Completar la meta description.
6. Ajustar canonical, Open Graph y Twitter Card con la URL final.
7. Escribir el contenido principal directamente en HTML.
8. Agregar o reemplazar la imagen del articulo.
9. Completar el JSON-LD `BlogPosting` solo con datos reales.
10. Agregar una entrada en `blog/posts.json`.
11. Mantener `status: "draft"` mientras el articulo no este revisado.
12. Cambiar a `status: "published"` cuando este listo.
13. Si esta publicado, agregar la URL a `sitemap.xml`.
14. Revisar enlaces internos e imagenes.
15. Probar localmente.
16. Publicar los cambios en GitHub Pages.

## Estados en posts.json

- `draft`: borrador oculto del indice y fuera del sitemap.
- `published`: articulo visible en el indice y apto para sitemap.
- `archived`: articulo retirado del indice y fuera del sitemap.

El indice del blog muestra solamente articulos con `status: "published"`.

## Estructura de una entrada

```json
{
  "id": "identificador-unico",
  "slug": "slug-del-articulo",
  "title": "Titulo",
  "description": "Descripcion",
  "datePublished": "YYYY-MM-DD",
  "dateModified": "YYYY-MM-DD",
  "category": "Costos",
  "tags": ["impresion 3D", "precios"],
  "image": "../assets/images/blog/imagen.webp",
  "author": "",
  "status": "draft",
  "featured": false
}
```

## Checklist antes de publicar

- El articulo fue revisado manualmente.
- El contenido principal existe en HTML, no solo en JSON.
- `title` es unico.
- `description` es unica y clara.
- `canonical` apunta a la URL final.
- Open Graph y Twitter Card apuntan a la URL final.
- La imagen tiene `alt`, dimensiones y licencia confirmada.
- El articulo no usa imagenes externas sin permiso.
- El JSON-LD contiene solo datos reales.
- No se invento autor, organizacion, logotipo ni publisher.
- Los enlaces internos funcionan desde `blog/articulos/`.
- Los datos, cifras y recomendaciones fueron revisados.
- Si corresponde, se agrega aviso de estimaciones.
- El articulo cambio de `noindex, nofollow` a `index, follow` solo cuando esta publicado.
- `posts.json` tiene `status: "published"`.
- `sitemap.xml` incluye la URL solo si esta publicado.
- El articulo se reviso en celular y escritorio.

## Categorias iniciales sugeridas

- Costos.
- Precios.
- Filamentos.
- Impresoras.
- Mantenimiento.
- Cotizaciones.
- Gestion del negocio.
- Guias.

No es necesario mostrar categorias vacias. Apareceran en el filtro cuando existan articulos publicados que las usen.

## Imagenes

Usa imagenes propias, generadas para el proyecto o con licencia confirmada. Cuando falte una imagen final, usa un placeholder local claramente identificado y reemplazalo antes de publicar.

## Sitemap

Agregar manualmente al sitemap solo articulos publicados:

```xml
<url>
  <loc>https://raularqueros.github.io/estoy-creando-una-calculadora-web-de/blog/articulos/slug-del-articulo.html</loc>
  <lastmod>YYYY-MM-DD</lastmod>
  <changefreq>monthly</changefreq>
  <priority>0.7</priority>
</url>
```

No agregar `draft` ni `archived`.

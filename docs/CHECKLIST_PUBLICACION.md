# Checklist de publicación

Usa uno de estos estados para cada punto:

- Pendiente.
- Revisado.
- Correcto.
- No aplica.

## Antes de publicar

| Elemento | Estado | Notas |
| --- | --- | --- |
| Copia de seguridad local creada | Pendiente | Exportar respaldo completo antes de subir cambios. |
| URL pública confirmada | Revisado | Configurada para GitHub Pages. |
| Canonical revisado | Correcto | Raíz, páginas públicas y blog apuntan a la URL pública. |
| Sitemap revisado | Correcto | Incluye páginas públicas e índice del blog. |
| Robots revisado | Correcto | Apunta al sitemap público. |
| Favicon revisado | Correcto | `assets/icons/favicon.svg`. |
| Imagen social revisada | Correcto | `assets/images/social-preview.svg`. |
| Páginas legales revisadas | Revisado | Privacidad y términos son informativos; requieren revisión legal si hay explotación comercial grande. |
| Borradores fuera del sitemap | Correcto | El borrador del blog no está en sitemap. |
| Datos personales fuera del repositorio | Revisado | No subir respaldos/exportaciones reales. |
| Consola sin errores críticos | Revisado | Verificar en navegador antes de publicar. |
| Responsive 320 px | Revisado | Revisar manualmente. |
| Responsive 375 px | Revisado | Revisar manualmente. |
| Responsive 390 px | Revisado | Revisar manualmente. |
| Responsive 768 px | Revisado | Revisar manualmente. |
| Responsive 1024 px | Revisado | Revisar manualmente. |
| Responsive 1440 px | Revisado | Revisar manualmente. |
| Cálculo 726 | Correcto | Verificado con costo por gramo y por kilo. |
| Exportaciones CSV | Revisado | Verificar con datos de prueba. |
| Exportaciones JSON | Revisado | Verificar con datos de prueba. |
| Respaldo completo | Correcto | Pruebas automatizadas pasaron. |
| Importación de respaldo | Correcto | Pruebas automatizadas pasaron. |
| Rutas internas | Correcto | Sin enlaces faltantes detectados. |
| Publicación en GitHub Pages | Pendiente | Subir rama/cambios cuando se apruebe. |
| Verificación posterior a publicación | Pendiente | Abrir URL pública, páginas públicas, blog, robots y sitemap. |

## Archivos que no deben publicarse

- `.env`
- `.env.*`
- `*.log`
- `*.tmp`
- `*.temp`
- `backups/`
- `respaldos/`
- `exports/`
- `exportaciones/`
- `datos-exportados/`
- `clientes-exportados/`
- `*.backup.json`
- `*respaldo*.json`
- `*backup*.json`
- `clientes-impresion-3d.json`
- `trabajos-impresion-3d.json`
- `cotizaciones-impresion-3d.json`
- `impresoras-impresion-3d.json`
- `bobinas-impresion-3d.json`
- `respaldo-precio3d-*.json`
- `.codex-local-ignore-backup/`
- `.agents/`
- `.codex/`
- `outputs/`
- `work/`
- `local/`
- `sandbox/`
- `coverage/`
- `dist-local/`

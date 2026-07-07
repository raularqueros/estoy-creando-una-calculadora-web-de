# Checklist MVP

Checklist para revisar el estado minimo viable de la calculadora antes de seguir agregando funciones.

## Calculo

- [x] El calculo no depende de valores ocultos.
- [x] Todos los costos criticos tienen campo editable o preset visible.
- [x] El precio final resuelve fees porcentuales correctamente.
- [x] El usuario puede elegir canal de venta o personalizar fees.
- [x] El resultado muestra costo real, utilidad y margen real.
- [x] El sistema advierte precios bajo costo o margen insuficiente.
- [x] Las formulas principales estan documentadas.
- [x] Los impuestos y fees se presentan como referenciales.

## Interfaz

- [x] La app funciona en celular y escritorio.
- [x] Existe Modo Basico / Cotizacion rapida.
- [x] Existe Modo Avanzado.
- [x] El switch de filamento permite costo por gramo y precio por kilo.
- [x] El comparador de canales usa el mismo motor de formulas.
- [x] El metodo de pago del comparador evita duplicar fees si el canal integra cobro.
- [x] La configuracion queda mas abajo para no interrumpir el flujo de cotizacion.

## Persistencia

- [x] LocalStorage guarda configuracion principal.
- [x] LocalStorage guarda ultimo calculo.
- [x] La configuracion puede exportarse como JSON.
- [x] La configuracion puede importarse desde JSON validado.
- [x] La app sigue funcionando si LocalStorage no esta disponible.

## Proyecto

- [x] No requiere backend.
- [x] No requiere frameworks.
- [x] No requiere librerias externas.
- [x] El proyecto puede publicarse en GitHub Pages.
- [x] La estructura de archivos esta documentada.
- [x] Las fuentes de referencia estan documentadas.

## Antes de publicar

- [ ] Revisar presets de materiales para el pais/moneda objetivo.
- [ ] Revisar fees reales de cada marketplace.
- [ ] Revisar tarifas de pago reales segun pais y cuenta.
- [ ] Revisar impuestos aplicables con un contador o asesor tributario.
- [ ] Probar en navegadores principales.
- [ ] Probar en celular real.
- [ ] Crear captura o demo basica para el README si se publica.

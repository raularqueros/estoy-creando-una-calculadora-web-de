# Respaldo e integridad de datos

## Qué contiene el respaldo

El respaldo completo reúne en un único archivo JSON:

- configuración general, moneda e idioma;
- preferencias relevantes de navegación y flujo de trabajo;
- datos del negocio y condiciones de cotización;
- clientes;
- cotizaciones y sus snapshots históricos;
- trabajos, ventas y pagos asociados;
- perfiles de impresoras;
- bobinas de filamento y sus movimientos de inventario.

Las colecciones sin registros se incluyen como listas vacías válidas. El formato está versionado para poder reconocer respaldos anteriores y evitar importar archivos creados por otra aplicación.

## Qué no contiene

No se incluyen cachés temporales de geolocalización, tasas de cambio, archivos descargados ni datos externos al navegador. Tampoco se guarda una segunda copia completa dentro de LocalStorage: allí solo se registra la fecha y los totales del último respaldo descargado.

## Respaldo no es sincronización

El respaldo es un archivo que debes conservar y trasladar manualmente. No sincroniza dispositivos ni guarda información en la nube. Cada navegador mantiene su propio LocalStorage.

## Cómo exportar

1. Abre **Configuración**.
2. Busca **Respaldo y restauración**.
3. Pulsa **Descargar respaldo completo**.
4. Guarda el archivo `respaldo-precio3d-AAAA-MM-DD-HHmm.json` en un lugar seguro.

## Cómo importar

1. Pulsa **Importar respaldo** y selecciona un archivo JSON.
2. Revisa la fecha, versión, cantidades, advertencias, rechazos y conflictos.
3. Elige **Combinar** o **Reemplazar**.
4. Confirma la operación. Seleccionar el archivo nunca importa datos automáticamente.

### Combinar

Conserva los datos actuales y agrega registros nuevos comparando sus IDs. Ante un conflicto puedes mantener el registro actual, usar el importado o conservar ambos solo cuando no se rompan referencias. Los movimientos repetidos no se duplican y los snapshots históricos no se actualizan desde perfiles actuales.

### Reemplazar

Sustituye únicamente las colecciones incluidas en el respaldo. Antes de confirmar se crea un respaldo temporal del estado actual y se habilita su descarga. Si una escritura falla durante el proceso, la aplicación intenta restaurar las claves anteriores.

## Validación

Antes de importar se comprueba que el JSON sea seguro, pertenezca a `precio3d`, use una versión compatible y contenga colecciones con la estructura esperada. También se revisan IDs, números y fechas razonables. El contenido importado nunca se ejecuta ni se inserta como HTML.

Los respaldos antiguos pueden omitir colecciones nuevas; estas se normalizan en memoria como listas vacías. Un respaldo creado con una versión futura no se importa.

## Informe de integridad

La acción **Revisar integridad** analiza sin modificar datos. Puede detectar, entre otros casos:

- IDs y números de cotización duplicados;
- referencias rotas entre clientes, cotizaciones, trabajos, impresoras y bobinas;
- totales, pagos o saldos inconsistentes;
- más de una impresora predeterminada;
- stock negativo o continuidad rota entre movimientos;
- consumos sin movimientos y movimientos vinculados a trabajos inexistentes;
- códigos o mezclas de moneda que requieren revisión.

Los hallazgos se clasifican como error, advertencia o información y muestran una acción sugerida.

## Reparaciones controladas

Solo algunas reparaciones inequívocas pueden ejecutarse desde el informe, por ejemplo quitar una referencia inexistente conservando su snapshot, elegir una única impresora predeterminada, recalcular un total derivado o actualizar el contador futuro de cotizaciones.

Antes de cualquier reparación se explica el cambio, se solicita confirmación y se crea un respaldo previo. No se corrigen automáticamente stock, pagos, consumos, precios, utilidades, identidad de clientes ni relaciones ambiguas.

## Limitaciones de LocalStorage

LocalStorage pertenece al navegador y dispositivo actuales. Puede borrarse al limpiar datos del sitio, usar navegación privada o cambiar de navegador. Su capacidad es limitada y varía según el navegador. Si está lleno, la aplicación informa el error y no elimina datos para liberar espacio.

El tamaño mostrado en Configuración es una estimación, no una medición exacta de la cuota disponible.

## Frecuencia recomendada

- Semanalmente si utilizas la aplicación con frecuencia.
- Antes de importar o reemplazar datos.
- Antes de actualizar a una nueva versión.
- Antes de cambiar de navegador, dispositivo o equipo.

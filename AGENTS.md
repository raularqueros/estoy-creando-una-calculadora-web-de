# Flujo de trabajo del proyecto

## Alcance de cada tarea

- No realizar una auditoría general del repositorio al comenzar cada tarea.
- No recorrer, releer ni analizar todos los archivos por defecto.
- Utilizar el contexto existente de la conversación y los cambios ya realizados.
- Inspeccionar únicamente los archivos directamente relacionados con la solicitud y sus dependencias inmediatas.
- No revisar README, documentación, fuentes, historial, archivos generados o elementos no relacionados, salvo que sean indispensables para completar la tarea.
- No modificar funcionalidades fuera del alcance solicitado.
- No corregir automáticamente problemas no relacionados.

## Orden de trabajo

Para cada tarea de implementación:

1. Identificar los archivos mínimos involucrados.
2. Inspeccionar solamente esos archivos.
3. Implementar el cambio solicitado.
4. Ejecutar verificaciones dirigidas después de la implementación.
5. Informar brevemente:
   - archivos modificados;
   - cambio realizado;
   - verificaciones ejecutadas;
   - problemas pendientes.

## Verificaciones

- No ejecutar auditorías, builds completos, lint global ni toda la suite de pruebas antes de implementar.
- Realizar primero el cambio solicitado.
- Ejecutar después las pruebas o verificaciones relacionadas con los archivos modificados.
- Ejecutar una revisión completa solamente cuando:
  - el usuario solicite explícitamente una auditoría;
  - se cierre una fase importante;
  - se prepare una publicación;
  - se modifique arquitectura compartida;
  - se cambie el motor de fórmulas;
  - se modifique persistencia, exportaciones, autenticación o datos críticos;
  - exista un riesgo real de regresión global.

## Problemas fuera del alcance

- Si se detecta un problema no relacionado, no corregirlo automáticamente.
- Mencionarlo brevemente al finalizar.
- Mantener la tarea enfocada en la solicitud actual.

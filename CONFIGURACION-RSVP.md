# Confirmación confiable con Google Sheets

El sitio actualmente envía el nombre con `no-cors`. Ese método no permite comprobar si Google Sheets guardó realmente el registro.

La solución preparada usa dos pasos:

1. Envía el nombre junto con un identificador único.
2. Consulta ese identificador y solo muestra el mensaje de éxito cuando aparece en la hoja.

## Actualizar Apps Script

1. Abre la hoja de cálculo de confirmaciones.
2. Ve a **Extensiones → Apps Script**.
3. Reemplaza el código actual por el contenido de `apps-script-rsvp.gs`.
4. Guarda el proyecto.
5. Ve a **Implementar → Administrar implementaciones**.
6. Edita la implementación existente y selecciona **Nueva versión**.
7. Confirma que se ejecute como tu cuenta y que el acceso sea **Cualquier persona**.
8. Implementa y conserva la URL terminada en `/exec`.

El código crea una hoja llamada `Confirmaciones` con las columnas `Fecha`, `ID` y `Nombre`. El ID evita registros duplicados y permite comprobar que cada confirmación sí quedó guardada.

La verificación ya está preparada en `index.html`; comenzará a confirmar automáticamente en cuanto se actualice la implementación de Apps Script.

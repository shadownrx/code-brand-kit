# Code Brand Kit

Dos apariencias compartidas de VS Code para macOS y Windows: **PCN code** y **Macch Code**.

Incluye tema negro, colores, fuente JetBrains Mono, preferencias de edición y terminal, fondo, logo del chat, mascota interactiva con pelotita y la lista de extensiones del equipo. Las extensiones de terceros se descargan desde el Marketplace; no se redistribuye el código de Claude ni ninguna sesión, cuenta o credencial.

## Instalar

1. Instalá [Visual Studio Code](https://code.visualstudio.com/). Descargá el ZIP de la última versión desde **Releases** y extraelo completo.
2. Elegí **una** variante:

| Sistema | PCN code | Macch Code |
|---|---|---|
| Mac | Doble clic en `install-mac.command` | Doble clic en `install-macch-mac.command` |
| Windows | Doble clic en `install-pcn-windows.cmd` | Doble clic en `install-macch-windows.cmd` |

3. En VS Code, abrí la paleta con **Cmd+Shift+P** (Mac) o **Ctrl+Shift+P** (Windows). Ejecutá **PCN: Aplicar configuración y marca del chat** o **Macch: Aplicar configuración y marca del chat**. También podés usar el botón **Aplicar** del aviso inicial.
4. Ejecutá **Background: Enable and apply the background.** y aceptá recargar la ventana. La mascota aparece en el Explorador. Hacé clic en su panel o en la pelota para jugar.

Necesita Internet para instalar las extensiones y permisos de escritura en la instalación de VS Code para aplicar el fondo. Claude requiere que cada persona inicie sesión con su propia cuenta. Cerrá y abrí VS Code si la fuente recién instalada todavía no aparece.

En Windows se usa la política de ejecución de PowerShell configurada por el equipo. Si bloquea el script, pedí al administrador que revise y autorice el instalador o instalá las extensiones desde `extensions.txt`, la fuente desde `fonts/` y el VSIX desde `dist/` manualmente. No hace falta desactivar protecciones.

En Mac, si se pierde el permiso de ejecución al extraer, desde Terminal en esta carpeta ejecutá `bash install-mac.command` o `bash install-macch-mac.command`. Si el sistema bloquea la apertura, revisá el origen del archivo antes de autorizarlo mediante el flujo normal de macOS.

## Actualizar

Descargá la nueva versión desde **Releases**, extraela y volvé a ejecutar el instalador de tu variante. Después ejecutá su comando **Aplicar configuración y marca del chat** y reaplicá Background. El logo se resuelve desde la extensión instalada: no depende de Descargas ni del usuario que creó el pack.

Si usás Git: `git pull --ff-only` en el repositorio y volvé a ejecutar el instalador. GitHub almacena las actualizaciones; el pack no descarga ni ejecuta cambios en segundo plano.

Si Claude se actualiza, el pack muestra un aviso para reaplicar el parche. Si una nueva versión cambia su estructura, el comando informa que el chat quedó pendiente; el tema y la mascota siguen disponibles. El cambio de marca es local y no convierte Claude en otro servicio.

## Cambiar entre las dos variantes

Deshabilitá la extensión local de la variante anterior en **Extensiones**, instalá la otra y ejecutá **Aplicar**. Reaplicá Background y recargá. Evitá mantener ambas activas: comparten preferencias y personalizan el mismo chat. La copia de cada variante representa el estado que existía la primera vez que se aplicó en esa computadora.

## Restaurar

Ejecutá **PCN: Restaurar configuración anterior** o **Macch: Restaurar configuración anterior**. Se recuperan los valores globales que existían antes de aplicar esa variante. El parche de Claude se restaura solamente si el archivo sigue siendo el que modificó el pack; no pisa cambios posteriores de terceros.

Después deshabilitá el pack, reaplicá Background y recargá la ventana. Las fuentes y extensiones descargadas se conservan y se pueden desinstalar por separado. Las copias se guardan en el almacenamiento global de la extensión de VS Code, en `chat-backups/` para el chat.

## Alcance

- Se comparten las preferencias portables del equipo y todos los identificadores de extensiones usados al preparar el kit. La extensión de iconos exclusiva de Mac se excluye para que ambas plataformas usen Material Icon Theme.
- No se exportan el shell exclusivo de Mac, rutas personales, credenciales, conversaciones, proyectos ni archivos del equipo. No había atajos personalizados ni snippets para exportar.
- Los paneles abiertos y su ancho, el proyecto activo y las sesiones de terminal son estado de cada ventana, no preferencias exportables de este kit.
- El parche del fondo modifica archivos del workbench. VS Code puede mostrar un aviso de integridad; el kit no desactiva esa comprobación. Una actualización de VS Code puede requerir reaplicar Background.
- Los VSIX locales no tienen firma del Marketplace. El código fuente está en `packages/` para revisarlo.
- Validado localmente en macOS: construcción, formato VSIX y pruebas del parche. Windows se valida en GitHub Actions; la apariencia final y la instalación de fuentes en un equipo Windows necesitan una prueba allí.

## Mantener y publicar

Editá `packages/pcn/` o `packages/macch/`. Conservá sincronizada la lógica común entre ambas variantes. Actualizá la versión en los dos `package.json`, la constante `VERSION` de cada `extension.js` y el archivo `VERSION`.

```sh
node --test tests/patch.test.js
python3 scripts/build.py
```

Los VSIX se generan en `dist/`, con sus sumas SHA-256. El workflow de validación corre en Mac y Windows. Para distribuir una actualización, creá un tag `vX.Y.Z`; el workflow de release genera el ZIP con ambos packs y lo adjunta a GitHub Releases.

El esquema de instalación usa la [CLI oficial de VS Code](https://code.visualstudio.com/docs/configure/command-line) para instalar extensiones y VSIX.

JetBrains Mono se incluye con su licencia OFL en `fonts/OFL.txt`. Las marcas y recursos PCN/Macch se distribuyen para uso del equipo; este repositorio no concede derechos sobre marcas de terceros.

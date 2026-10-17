#!/bin/bash
set -euo pipefail
cd "$(dirname "$0")"
variant="${1:-pcn}"
version="$(tr -d '\r\n' < VERSION)"
case "$variant" in pcn|macch) ;; *) echo 'Variante: pcn o macch'; exit 1;; esac
codecli='/Applications/Visual Studio Code.app/Contents/Resources/app/bin/code'
if [[ ! -x "$codecli" ]]; then codecli="$HOME/Applications/Visual Studio Code.app/Contents/Resources/app/bin/code"; fi
if [[ ! -x "$codecli" ]]; then codecli="$(command -v code || true)"; fi
if [[ ! -x "$codecli" ]]; then echo 'Instalá Visual Studio Code primero.'; exit 1; fi
mkdir -p "$HOME/Library/Fonts"
cp -n fonts/*.ttf "$HOME/Library/Fonts/" || true
while IFS= read -r extension; do
 [[ -z "$extension" ]] || "$codecli" --install-extension "$extension"
done < extensions.txt
"$codecli" --install-extension "dist/$variant-code-$version.vsix" --force
"$codecli" --new-window
printf '\nInstalado. En VS Code: Cmd+Shift+P → %s: Aplicar configuración y marca del chat\n' "$(echo "$variant" | tr '[:lower:]' '[:upper:]')"
printf 'Después: Background: Enable and apply the background.\n'
read -r -p 'Enter para cerrar…' _

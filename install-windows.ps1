param([ValidateSet('pcn','macch')][string]$Variant = 'pcn')
$ErrorActionPreference = 'Stop'
Set-Location $PSScriptRoot
$version = (Get-Content (Join-Path $PSScriptRoot 'VERSION') -Raw).Trim()
$codeCli = (Get-Command code.cmd -ErrorAction SilentlyContinue).Source
if (-not $codeCli) {
  $candidates = @("$env:LOCALAPPDATA\Programs\Microsoft VS Code\bin\code.cmd", "$env:ProgramFiles\Microsoft VS Code\bin\code.cmd")
  $codeCli = $candidates | Where-Object { Test-Path $_ } | Select-Object -First 1
}
if (-not $codeCli) { throw 'Instalá Visual Studio Code primero.' }
$fontDir = Join-Path $env:LOCALAPPDATA 'Microsoft\Windows\Fonts'
New-Item -ItemType Directory -Force -Path $fontDir | Out-Null
$fontKey = 'HKCU:\Software\Microsoft\Windows NT\CurrentVersion\Fonts'
New-Item -Path $fontKey -Force | Out-Null
Get-ChildItem (Join-Path $PSScriptRoot 'fonts\*.ttf') | ForEach-Object {
  $dest = Join-Path $fontDir $_.Name
  if (-not (Test-Path $dest)) { Copy-Item $_.FullName $dest }
  New-ItemProperty -Path $fontKey -Name ($_.BaseName + ' (TrueType)') -Value $dest -PropertyType String -Force | Out-Null
}
foreach ($extension in Get-Content (Join-Path $PSScriptRoot 'extensions.txt')) {
  if ($extension.Trim()) { & $codeCli --install-extension $extension; if ($LASTEXITCODE -ne 0) { throw "No se pudo instalar $extension" } }
}
& $codeCli --install-extension (Join-Path $PSScriptRoot "dist\$Variant-code-$version.vsix") --force
if ($LASTEXITCODE -ne 0) { throw 'No se pudo instalar el pack.' }
& $codeCli --new-window
Write-Host "Instalado. En VS Code: Ctrl+Shift+P > $($Variant.ToUpper()): Aplicar configuración y marca del chat"
Write-Host 'Después: Background: Enable and apply the background.'
Write-Host 'Si la fuente todavía no aparece, cerrá y abrí VS Code.'

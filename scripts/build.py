from pathlib import Path
import json,zipfile,hashlib
from xml.sax.saxutils import escape
root=Path(__file__).resolve().parents[1]
dist=root/'dist';dist.mkdir(exist_ok=True)
for variant in ('pcn','macch'):
 source=root/'packages'/variant
 pkg=json.loads((source/'package.json').read_text())
 manifest=f'''<?xml version="1.0" encoding="utf-8"?>
<PackageManifest Version="2.0.0" xmlns="http://schemas.microsoft.com/developer/vsx-schema/2011"><Metadata><Identity Language="en-US" Id="{pkg['name']}" Version="{pkg['version']}" Publisher="{pkg['publisher']}"/><DisplayName>{escape(pkg['displayName'])}</DisplayName><Description xml:space="preserve">{escape(pkg['description'])}</Description><Tags>branding</Tags><Categories>Extension Packs</Categories><Properties><Property Id="Microsoft.VisualStudio.Code.Engine" Value="^1.100.0"/><Property Id="Microsoft.VisualStudio.Code.ExtensionDependencies" Value=""/><Property Id="Microsoft.VisualStudio.Code.ExtensionPack" Value=""/><Property Id="Microsoft.VisualStudio.Code.LocalizedLanguages" Value=""/><Property Id="Microsoft.VisualStudio.Code.PreRelease" Value="false"/></Properties></Metadata><Installation><InstallationTarget Id="Microsoft.VisualStudio.Code"/></Installation><Dependencies/><Assets><Asset Type="Microsoft.VisualStudio.Code.Manifest" Path="extension/package.json" Addressable="true"/></Assets></PackageManifest>'''
 content='''<?xml version="1.0" encoding="utf-8"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="json" ContentType="application/json"/><Default Extension="js" ContentType="application/javascript"/><Default Extension="png" ContentType="image/png"/><Default Extension="md" ContentType="text/markdown"/><Default Extension="vsixmanifest" ContentType="text/xml"/></Types>'''
 out=dist/f'{variant}-code-{pkg["version"]}.vsix'
 with zipfile.ZipFile(out,'w',zipfile.ZIP_DEFLATED) as z:
  z.writestr('extension.vsixmanifest',manifest);z.writestr('[Content_Types].xml',content)
  for f in sorted(source.rglob('*')):
   if f.is_file():z.write(f,'extension/'+f.relative_to(source).as_posix())
 print(out.name)
(dist/'SHA256SUMS.txt').write_text(''.join(f'{hashlib.sha256(p.read_bytes()).hexdigest()}  {p.name}\n' for p in sorted(dist.glob('*.vsix'))))

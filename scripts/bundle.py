from pathlib import Path
import zipfile
root=Path(__file__).resolve().parents[1]
version=(root/'VERSION').read_text().strip()
out=root/'dist'/f'code-brand-kit-{version}.zip'
with zipfile.ZipFile(out,'w',zipfile.ZIP_DEFLATED) as z:
 for directory in ('packages','fonts'):
  for p in sorted((root/directory).rglob('*')):
   if p.is_file():z.write(p,'code-brand-kit/'+p.relative_to(root).as_posix())
 for p in sorted(root.glob('install-*')):z.write(p,'code-brand-kit/'+p.name)
 for name in ('README.md','VERSION','extensions.txt','extensions.json'):
  z.write(root/name,'code-brand-kit/'+name)
 for p in sorted((root/'dist').glob('*')):
  if p.suffix=='.vsix' or p.name=='SHA256SUMS.txt':z.write(p,'code-brand-kit/dist/'+p.name)
print(out)

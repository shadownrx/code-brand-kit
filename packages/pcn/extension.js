const vscode=require('vscode'),fs=require('fs'),path=require('path'),crypto=require('crypto');
const BRAND='PCN code',PREFIX='pcn',VERSION='1.0.0';
const hash=s=>crypto.createHash('sha256').update(s).digest('hex');
function patchChat(context){
 const ext=vscode.extensions.getExtension('Anthropic.claude-code');
 if(!ext)throw Error('Falta la extensión oficial Anthropic.claude-code. Instalá las extensiones del pack y volvé a aplicar.');
 const dir=ext.extensionPath,version=ext.packageJSON.version;
 const backup=path.join(context.globalStorageUri.fsPath,'chat-backups',path.basename(dir));fs.mkdirSync(backup,{recursive:true});
 const changes=[];
 const pkgPath=path.join(dir,'package.json'),pkg=JSON.parse(fs.readFileSync(pkgPath,'utf8'));
 for(const group of Object.values(pkg.contributes?.viewsContainers||{}))for(const view of group)if(view.id?.startsWith('claude')){view.title=BRAND;view.icon='resources/team-brand.png';}
 for(const group of Object.values(pkg.contributes?.views||{}))for(const view of group)if(view.type==='webview'&&view.id?.toLowerCase().includes('claude'))view.name=BRAND;
 changes.push([pkgPath,JSON.stringify(pkg,null,2)+'\n']);
 const js=path.join(dir,'webview','index.js');if(!fs.existsSync(js))throw Error('Esta versión de Claude cambió su estructura; no se aplicó el parche.');
 let bundle=fs.readFileSync(js,'utf8');
 bundle=bundle.replace(/\n\/\* TEAM-BRAND-START \*\/[\s\S]*?\/\* TEAM-BRAND-END \*\//g,'');
 const logo='data:image/png;base64,'+fs.readFileSync(path.join(context.extensionPath,'media','brand.png')).toString('base64');
 // Existing local branding is also migrated without copying Claude's source into the pack.
 bundle=bundle.replace(/Macch Code|Pcn code|PCN code/g,BRAND);
 const injection=fs.readFileSync(path.join(context.extensionPath,'chat-brand.js'),'utf8').replace('__BRAND__',JSON.stringify(BRAND)).replace('__LOGO__',JSON.stringify(logo));
 changes.push([js,bundle.trimEnd()+'\n/* TEAM-BRAND-START */\n'+injection+'\n/* TEAM-BRAND-END */\n']);
 const icon=path.join(dir,'resources','team-brand.png');changes.push([icon,fs.readFileSync(path.join(context.extensionPath,'media','brand.png'))]);
 const manifestFile=path.join(backup,'manifest.json');const manifest=fs.existsSync(manifestFile)?JSON.parse(fs.readFileSync(manifestFile)):[];
 for(const [file,data]of changes){
  const relative=path.relative(dir,file);let record=manifest.find(x=>x.relative===relative);
  if(!record){record={relative,existed:fs.existsSync(file)};if(record.existed){const copy=path.join(backup,relative);fs.mkdirSync(path.dirname(copy),{recursive:true});fs.copyFileSync(file,copy);}manifest.push(record);}
  fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,data);record.patchedHash=hash(data);
 }
 fs.writeFileSync(manifestFile,JSON.stringify(manifest,null,2));return version;
}
async function apply(context){
 const settings=JSON.parse(fs.readFileSync(path.join(context.extensionPath,'settings.json'),'utf8'));
 const cfg=vscode.workspace.getConfiguration();let before=context.globalState.get('before');
 if(!before){before={};for(const k of Object.keys(settings)){const old=cfg.inspect(k)?.globalValue;before[k]=old===undefined?{missing:true}:{value:old};}await context.globalState.update('before',before);}
 const logo=vscode.Uri.joinPath(context.extensionUri,'media','wallpaper.png').toString();
 settings['background.fullscreen'].images=[logo];
 for(const [k,value] of Object.entries(settings))await cfg.update(k,value,vscode.ConfigurationTarget.Global);
 await context.globalState.update('appliedVersion',VERSION);
 let chat='';try{chat=patchChat(context);await context.globalState.update('chatVersion',chat);}catch(e){vscode.window.showWarningMessage(`${BRAND}: configuración aplicada; chat pendiente: ${e.message}`);}
 const action=await vscode.window.showInformationMessage(`${BRAND} aplicado. Fondo: ejecutá “Background: Enable and apply the background.”. Recargá para ver la marca del chat.`,'Recargar ventana');
 if(action)await vscode.commands.executeCommand('workbench.action.reloadWindow');
}
async function restore(context){
 const before=context.globalState.get('before');if(!before)return vscode.window.showInformationMessage('No hay copia de configuración para restaurar.');
 const cfg=vscode.workspace.getConfiguration();for(const[k,record]of Object.entries(before))await cfg.update(k,record.missing?undefined:record.value,vscode.ConfigurationTarget.Global);
 const ext=vscode.extensions.getExtension('Anthropic.claude-code');
 if(ext){const dir=ext.extensionPath,b=path.join(context.globalStorageUri.fsPath,'chat-backups',path.basename(dir)),m=path.join(b,'manifest.json');if(fs.existsSync(m)){
  for(const r of JSON.parse(fs.readFileSync(m))){const f=path.join(dir,r.relative);if(!fs.existsSync(f)||hash(fs.readFileSync(f))!==r.patchedHash)continue;if(r.existed)fs.copyFileSync(path.join(b,r.relative),f);else fs.unlinkSync(f);}
 }}
 await context.globalState.update('appliedVersion',undefined);await context.globalState.update('before',undefined);
 vscode.window.showInformationMessage('Configuración anterior restaurada. Reaplicá Background y recargá la ventana. Las extensiones y fuentes instaladas se conservan.');
}
exports.activate=context=>{
 require('./mascot').registerMascot(context);
 for(const[id,fn]of [[PREFIX+'.apply',apply],[PREFIX+'.restore',restore]])context.subscriptions.push(vscode.commands.registerCommand(id,()=>fn(context).catch(e=>vscode.window.showErrorMessage(BRAND+': '+e.message))));
 const current=vscode.extensions.getExtension('Anthropic.claude-code')?.packageJSON.version;
 if(context.globalState.get('appliedVersion')!==VERSION||current!==context.globalState.get('chatVersion'))vscode.window.showInformationMessage(`${BRAND}: aplicá el pack o actualizá la marca del chat.`,'Aplicar').then(x=>{if(x) return apply(context);}).catch(e=>vscode.window.showErrorMessage(e.message));
};
exports.patchChat=patchChat;

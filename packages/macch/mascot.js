const vscode = require('vscode');
exports.registerMascot = function(context) {
 let current;
 context.subscriptions.push(vscode.commands.registerCommand('macch.throwBall',()=>current?.webview.postMessage({type:'throw'})));
 context.subscriptions.push(vscode.window.registerWebviewViewProvider('macch.mascot', {
 resolveWebviewView(view) {
  current=view;
  view.onDidDispose(()=>{if(current===view)current=undefined;});
  view.webview.options={enableScripts:true,localResourceRoots:[vscode.Uri.joinPath(context.extensionUri,'media')]};
  const asset=name=>view.webview.asWebviewUri(vscode.Uri.joinPath(context.extensionUri,'media',name));
  view.description='';
  view.webview.html=`<!doctype html><html><head><meta name="viewport" content="width=device-width, initial-scale=1"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src ${view.webview.cspSource}; script-src ${view.webview.cspSource}; style-src 'unsafe-inline';"><style>
html,body{height:100%;margin:0;background:transparent;overflow:hidden}#stage{position:relative;height:100%;min-height:80px;overflow:hidden;cursor:crosshair}#pet{position:absolute;bottom:8px;left:0;width:64px;height:64px;object-fit:contain;transform-origin:50% 90%;pointer-events:none;will-change:transform}#ball{position:absolute;width:12px;height:12px;border-radius:50%;background:radial-gradient(circle at 30% 25%,#eaff9c,#9bcb30 60%,#638719);box-shadow:inset -1px -1px 2px #0005,0 2px 3px #0004;pointer-events:none;display:none}button{position:absolute;right:8px;top:5px;z-index:2;border:0;border-radius:5px;background:var(--vscode-toolbar-hoverBackground,transparent);color:var(--vscode-foreground);font:inherit;padding:4px 7px;cursor:pointer;font-size:12px}button:hover{background:var(--vscode-button-secondaryBackground)}button:focus-visible{outline:1px solid var(--vscode-focusBorder)}@media(prefers-reduced-motion:reduce){#pet{will-change:auto}}</style></head><body><div id="stage" title="Hacé clic para tirar la pelotita"><button id="throw" title="Tirar pelotita" aria-label="Tirar pelotita">⚽</button><img id="pet" src="${asset('pcn.png')}" alt="Macch, mascota con tu logo" draggable="false"><div id="ball"></div></div><script src="${asset('pet.js')}"></script></body></html>`;
 }
 },{webviewOptions:{retainContextWhenHidden:true}}));
};

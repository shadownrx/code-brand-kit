const test=require('node:test'),assert=require('node:assert/strict'),fs=require('fs'),os=require('os'),path=require('path'),vm=require('vm');
for(const variant of ['pcn','macch'])test(variant+': patch portable, backup and idempotence',()=>{
 const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'brand-kit-'));
 try{
 const dir=path.join(tmp,'anthropic.claude-code-1.2.3');fs.mkdirSync(path.join(dir,'webview'),{recursive:true});fs.mkdirSync(path.join(dir,'resources'));
 const pkg={version:'1.2.3',contributes:{viewsContainers:{secondarySidebar:[{id:'claude-sidebar',title:'Claude Code',icon:'original.svg'}]},views:{sidebar:[{id:'claudeVSCodeSidebar',name:'Claude Code',type:'webview'}]}}};
 fs.writeFileSync(path.join(dir,'package.json'),JSON.stringify(pkg));const original='console.log("Claude Code");';fs.writeFileSync(path.join(dir,'webview/index.js'),original);
 const entry=path.resolve(__dirname,'../packages',variant,'extension.js');const module={exports:{}};
 vm.runInNewContext(fs.readFileSync(entry,'utf8'),{require:id=>id==='vscode'?{extensions:{getExtension:()=>({extensionPath:dir,packageJSON:pkg})}}:require(id),exports:module.exports});
 const ctx={extensionPath:path.dirname(entry),globalStorageUri:{fsPath:path.join(tmp,'storage')}};
 assert.equal(module.exports.patchChat(ctx),'1.2.3');const first=fs.readFileSync(path.join(dir,'webview/index.js'),'utf8');
 module.exports.patchChat(ctx);assert.ok(fs.readFileSync(path.join(dir,'webview/index.js'),'utf8')===first,'patch is idempotent');
 assert.equal((first.match(/TEAM-BRAND-START/g)||[]).length,1);assert.ok(JSON.parse(fs.readFileSync(path.join(dir,'package.json'))).contributes.viewsContainers.secondarySidebar[0].title.includes(variant==='pcn'?'PCN':'Macch'));
 const backup=path.join(tmp,'storage/chat-backups',path.basename(dir));assert.equal(fs.readFileSync(path.join(backup,'webview/index.js'),'utf8'),original);
 assert.equal(JSON.parse(fs.readFileSync(path.join(backup,'manifest.json'))).length,3);
 }finally{fs.rmSync(tmp,{recursive:true,force:true});}
});
test('portable settings and public extension IDs only',()=>{
 for(const v of ['pcn','macch']){
 const s=fs.readFileSync(path.resolve(__dirname,'../packages',v,'settings.json'),'utf8');assert.ok(!s.includes('/Users/'));assert.ok(!s.includes('salvador'));JSON.parse(s);
 const js=fs.readFileSync(path.resolve(__dirname,'../packages',v,'chat-brand.js'),'utf8').replace('__BRAND__','"Test"').replace('__LOGO__','"data:image/png;base64,a"');new vm.Script(js);
 }
 const ids=fs.readFileSync(path.resolve(__dirname,'../extensions.txt'),'utf8').trim().split('\n');assert.ok(ids.every(id=>/^[a-zA-Z0-9-]+\.[a-zA-Z0-9-]+$/.test(id)));
});

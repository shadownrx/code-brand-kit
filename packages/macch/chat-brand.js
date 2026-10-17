// Runs inside Claude's existing webview bundle. No requests or chat data leave the page.
(()=>{
 const brand=__BRAND__,logo=__LOGO__;
 const apply=()=>{
  const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
  const changes=[];while(walker.nextNode()){
   const n=walker.currentNode,p=n.parentElement;
   if(!p||p.closest('textarea,input,[contenteditable],pre,code,[class*="message"],[role="log"],[data-message-id]'))continue;
   if(n.textContent.trim()==='Claude Code'||n.textContent.trim()==='Macch Code'||n.textContent.trim()==='PCN code')changes.push(n);
  }
  changes.forEach(n=>{if(n.textContent!==brand)n.textContent=brand;});
  for(const el of document.querySelectorAll('[class*="logo_"],.macch-code-brand')){
   if(el.dataset.teamBrand)continue;el.dataset.teamBrand='1';
   el.replaceChildren();const im=document.createElement('img');im.src=logo;im.alt=brand;im.style.cssText='width:30px;height:30px;object-fit:contain';
   const label=document.createElement('span');label.textContent=brand;el.append(im,label);
   el.style.cssText+=';display:flex;flex-direction:row;align-items:center;gap:9px;font:600 25px Georgia,serif';
  }
  for(const im of document.querySelectorAll('img[alt="Logo Macch"],img[alt="Macch"],img[alt="Logo PCN"],img[alt="PCN"]')){
   if(im.src!==logo)im.src=logo;if(im.alt!==brand)im.alt=brand;
  }
  for(const input of document.querySelectorAll('[contenteditable="plaintext-only"]')){
   const host=input.parentElement;if(!host||host.querySelector('[data-team-composer]'))continue;
   host.style.position='relative';const im=document.createElement('img');im.src=logo;im.alt=brand;im.dataset.teamComposer='1';
   im.style.cssText='position:absolute;left:14px;top:13px;width:19px;height:19px;object-fit:contain;pointer-events:none;z-index:2';
   host.append(im);input.style.paddingLeft='42px';
  }
 };
 let pending=false;const queue=()=>{if(pending)return;pending=true;requestAnimationFrame(()=>{pending=false;apply();});};
 const start=()=>{new MutationObserver(queue).observe(document.body,{childList:true,subtree:true,characterData:true});queue();};
 if(document.body)start();else document.addEventListener('DOMContentLoaded',start,{once:true});
})();

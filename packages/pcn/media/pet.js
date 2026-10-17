(()=>{
 const stage=document.getElementById('stage'),pet=document.getElementById('pet'),ball=document.getElementById('ball');
 let x=12,bx=0,by=0,vx=0,vy=0,active=false,playingUntil=0,last=0,frame=0;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 const bounds=()=>({w:Math.max(76,stage.clientWidth),h:Math.max(80,stage.clientHeight)});
 function toss(px,py){const {w,h}=bounds();bx=Math.max(6,Math.min(w-18,px??w*.75));by=Math.max(8,Math.min(h-24,py??10));vx=(bx<x+32?-1:1)*85;vy=-95;active=true;playingUntil=0;ball.style.display='block';ball.setAttribute('aria-label','Pelotita');start();}
 function tick(now){const dt=Math.min((now-(last||now))/1000,.04);last=now;const {w,h}=bounds();x=Math.max(0,Math.min(w-64,x));let lift=0,angle=0;
 if(active){vy+=420*dt;bx+=vx*dt;by+=vy*dt;if(bx<0||bx>w-12){bx=Math.max(0,Math.min(w-12,bx));vx*=-.75;}if(by>h-20){by=h-20;vy=-Math.abs(vy)*.55;vx*=.8;if(Math.abs(vy)<16)vy=0;}
 const gap=bx+6-(x+32);x+=Math.sign(gap)*Math.min(Math.abs(gap),100*dt);lift=reduced?0:Math.abs(Math.sin(now/95))*7;angle=reduced?0:Math.sin(now/95)*5;
 if(Math.abs(gap)<12&&by>=h-33){active=false;playingUntil=now+1300;ball.style.display='none';}
 }else if(now<playingUntil){lift=reduced?0:Math.abs(Math.sin(now/95))*14;angle=reduced?0:Math.sin(now/100)*10;}
 else{pet.style.transform=`translateX(${x}px)`;frame=0;last=0;return;}
 pet.style.transform=`translate(${x}px,${-lift}px) rotate(${angle}deg)`;ball.style.transform=`translate(${bx}px,${by}px)`;frame=requestAnimationFrame(tick);}
 function start(){if(!frame){last=0;frame=requestAnimationFrame(tick);}}
 document.getElementById('throw').addEventListener('click',e=>{e.stopPropagation();toss();});
 stage.addEventListener('click',e=>{const r=stage.getBoundingClientRect();toss(e.clientX-r.left,e.clientY-r.top);});
 window.addEventListener('message',e=>{if(e.data?.type==='throw')toss();});
 window.addEventListener('resize',()=>{x=Math.max(0,Math.min(bounds().w-64,x));if(!frame)pet.style.transform=`translateX(${x}px)`;});
 pet.style.transform=`translateX(${x}px)`;
})();

const $=id=>document.getElementById(id);
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
let phase='closed',view='gift',musicOn=false,generation=0,pendingOpen=null;
let drawPhase='idle',drawGeneration=0,pendingDraw=null,energy=0,currentLot=null,bag=[];
const lots=window.JoFortunes;
const numerals=['一','二','三','四','五','六','七','八','九','十','十一','十二','十三','十四','十五','十六','十七','十八','十九','二十','二十一','二十二','二十三','二十四'];
function state(){return{stage:phase,view,music:musicOn,fortuneStage:drawPhase,fortune:currentLot?{number:currentLot.index+1,...currentLot.value}:null};}
function setDisabled(value){$('primary').disabled=value;$('chest').disabled=value;}
async function openGift(){
 if(phase==='open')return state();if(pendingOpen)return pendingOpen;
 const token=++generation;phase='opening';setDisabled(true);$('experience').setAttribute('aria-busy','true');$('experience').classList.add('is-opening');$('hint').textContent='启匣中…';
 pendingOpen=(async()=>{await sleep(reduced?80:3000);if(token!==generation)return state();phase='open';$('letter').hidden=false;$('experience').classList.remove('is-opening');$('experience').classList.add('is-open');document.body.classList.add('letter-open');$('experience').setAttribute('aria-busy','false');$('step-one').classList.remove('active');$('step-two').classList.add('active');if(view==='gift')$('letter').focus({preventScroll:true});pendingOpen=null;return state();})();return pendingOpen;
}
function replay(){generation++;pendingOpen=null;phase='closed';$('letter').hidden=true;$('experience').classList.remove('is-opening','is-open');document.body.classList.remove('letter-open');$('experience').setAttribute('aria-busy','false');$('hint').textContent='一岁一礼，一寸欢喜。';$('step-one').classList.add('active');$('step-two').classList.remove('active');setDisabled(false);if(view==='gift')$('primary').focus({preventScroll:true});return state();}
function changeView(next,focus=false){
 if(!['gift','oracle'].includes(next))throw Error('Unknown birthday view.');
 view=next;$('gift-content').hidden=next!=='gift';$('oracle-content').hidden=next!=='oracle';document.body.classList.toggle('oracle-mode',next==='oracle');$('page-heading').textContent=next==='gift'?'生辰喜乐':'生辰启签';
 for(const name of ['gift','oracle']){const tab=$(name+'-tab');tab.setAttribute('aria-selected',String(name===next));tab.tabIndex=name===next?0:-1;}
 if(focus)$(next+'-tab').focus({preventScroll:true});return state();
}
$('primary').addEventListener('click',openGift);$('chest').addEventListener('click',openGift);$('replay').addEventListener('click',replay);
$('gift-tab').addEventListener('click',()=>changeView('gift'));$('oracle-tab').addEventListener('click',()=>changeView('oracle'));$('to-oracle').addEventListener('click',()=>changeView('oracle',true));
for(const name of ['gift','oracle'])$(name+'-tab').addEventListener('keydown',event=>{if(['ArrowLeft','ArrowRight','Home','End'].includes(event.key)){event.preventDefault();changeView(event.key==='Home'?'gift':event.key==='End'?'oracle':view==='gift'?'oracle':'gift',true);}});
function randomBelow(max){
 if(window.crypto?.getRandomValues){const sample=new Uint32Array(1),limit=Math.floor(4294967296/max)*max;do{window.crypto.getRandomValues(sample);}while(sample[0]>=limit);return sample[0]%max;}
 return Math.floor(Math.random()*max);
}
function pickLot(){
 if(!bag.length){bag=lots.map((_,i)=>i);for(let i=bag.length-1;i>0;i--){const j=randomBelow(i+1);[bag[i],bag[j]]=[bag[j],bag[i]];}if(currentLot&&bag[bag.length-1]===currentLot.index)[bag[0],bag[bag.length-1]]=[bag[bag.length-1],bag[0]];}
 const index=bag.pop();return{index,value:lots[index]};
}
function setEnergy(value){energy=Math.max(0,Math.min(100,value));$('shake-fill').style.width=energy+'%';$('shake-progress').setAttribute('aria-valuenow',String(Math.round(energy)));}
function resetFortune(focus=false){
 drawGeneration++;pendingDraw=null;drawPhase='idle';setEnergy(0);$('lot-card').hidden=true;$('oracle-stage').classList.remove('drawing','revealed');$('oracle-stage').setAttribute('aria-busy','false');$('fortune-tube').disabled=false;$('fortune-tube').style.setProperty('--shake-angle','0deg');$('draw-lot').disabled=false;$('draw-label').textContent='轻摇启签';$('oracle-status').textContent='左右滑动签筒，或点一下启签。';if(focus)$('fortune-tube').focus({preventScroll:true});return state();
}
async function drawLot(){
 if(pendingDraw)return pendingDraw;if(drawPhase==='revealed')resetFortune();
 const token=++drawGeneration;drawPhase='drawing';setEnergy(100);$('oracle-stage').classList.add('drawing');$('oracle-stage').setAttribute('aria-busy','true');$('draw-lot').disabled=true;$('fortune-tube').disabled=true;$('oracle-status').textContent='一支吉签，正向你而来。';
 pendingDraw=(async()=>{
  await sleep(reduced?120:2400);if(token!==drawGeneration)return state();
  currentLot=pickLot();const lot=currentLot.value;$('lot-number').textContent='第'+numerals[currentLot.index]+'签 · 吉';$('lot-title').textContent=lot.title;$('lot-line-one').textContent=lot.poem[0];$('lot-line-two').textContent=lot.poem[1];$('lot-note').textContent=lot.note;$('lot-card').hidden=false;$('oracle-stage').classList.remove('drawing');$('oracle-stage').classList.add('revealed');$('oracle-stage').setAttribute('aria-busy','false');drawPhase='revealed';$('draw-lot').disabled=false;$('draw-label').textContent='再启一签';$('oracle-status').textContent='愿这一签的好意，陪你走进新一岁。';pendingDraw=null;if(view==='oracle')$('lot-card').focus({preventScroll:true});return state();
 })();return pendingDraw;
}
$('draw-lot').addEventListener('click',drawLot);$('reshake').addEventListener('click',()=>resetFortune(true));
let dragging=false,lastX=0,lastY=0,gestureDistance=0,suppressClick=false;
const tube=$('fortune-tube');
tube.addEventListener('pointerdown',event=>{if(drawPhase!=='idle'||event.isPrimary===false)return;dragging=true;lastX=event.clientX;lastY=event.clientY;gestureDistance=0;suppressClick=false;tube.setPointerCapture?.(event.pointerId);});
tube.addEventListener('pointermove',event=>{
 if(!dragging||drawPhase!=='idle')return;const dx=event.clientX-lastX,dy=event.clientY-lastY;lastX=event.clientX;lastY=event.clientY;if(Math.abs(dy)>Math.abs(dx)*1.6)return;
 gestureDistance+=Math.abs(dx);if(gestureDistance>8)suppressClick=true;if(!reduced)tube.style.setProperty('--shake-angle',Math.max(-11,Math.min(11,dx*.6))+'deg');setEnergy(energy+Math.abs(dx)/2.4);if(energy>=100){dragging=false;drawLot();}
});
function endGesture(){dragging=false;tube.style.setProperty('--shake-angle','0deg');}
tube.addEventListener('pointerup',endGesture);tube.addEventListener('pointercancel',endGesture);tube.addEventListener('click',()=>{if(suppressClick){suppressClick=false;return;}drawLot();});
let motionEnabled=false,motionLast=null,motionLastHit=0,motionSeen=false,motionTimer=null;
function onMotion(event){
 const a=[event.accelerationIncludingGravity,event.acceleration].find(value=>value&&[value.x,value.y,value.z].every(Number.isFinite));if(!a)return;motionSeen=true;
 const xyz=[a.x,a.y,a.z];if(motionLast&&view==='oracle'&&drawPhase==='idle'&&!document.hidden){const delta=Math.hypot(...xyz.map((value,i)=>value-motionLast[i]));const now=performance.now();if(delta>11&&now-motionLastHit>140){motionLastHit=now;setEnergy(energy+25);if(!reduced)tube.style.setProperty('--shake-angle',(xyz[0]>=motionLast[0]?8:-8)+'deg');if(energy>=100)drawLot();}}motionLast=xyz;
}
function stopMotion(){window.removeEventListener('devicemotion',onMotion);clearTimeout(motionTimer);motionEnabled=false;motionLast=null;$('motion-toggle').setAttribute('aria-pressed','false');$('motion-toggle').textContent='开启摇一摇';}
async function toggleMotion(){
 if(motionEnabled){stopMotion();$('motion-status').textContent='仍可滑动签筒，或点按启签。';return;}
 try{
  const Motion=window.DeviceMotionEvent;if(!Motion)throw Error('unsupported');
  if(typeof Motion.requestPermission==='function'&&await Motion.requestPermission()!=='granted'){$('motion-status').textContent='未开启摇动权限，仍可滑动或点按启签。';return;}
  motionEnabled=true;motionSeen=false;motionLast=null;window.addEventListener('devicemotion',onMotion);$('motion-toggle').setAttribute('aria-pressed','true');$('motion-toggle').textContent='关闭摇一摇';$('motion-status').textContent='轻轻摇动手机，让一支吉签落下。';
  motionTimer=setTimeout(()=>{if(!motionSeen){stopMotion();$('motion-status').textContent='当前浏览器未提供摇动信息，请滑动或点按启签。';}},6500);
 }catch{$('motion-status').textContent='当前浏览器暂不支持，请滑动或点按启签。';}
}
if(window.DeviceMotionEvent&&(matchMedia('(pointer: coarse)').matches||typeof window.DeviceMotionEvent.requestPermission==='function'))$('motion-toggle').hidden=false;
$('motion-toggle').addEventListener('click',toggleMotion);
let audioBusy=false;
async function toggleMusic(){
 if(audioBusy)return;audioBusy=true;
 try{musicOn=await window.JoMusic.setPlaying(!musicOn);$('sound').setAttribute('aria-pressed',String(musicOn));$('sound').setAttribute('aria-label',musicOn?'关闭古风音乐':'开启古风音乐');$('music-label').textContent=musicOn?'音乐开':'音乐关';}
 catch{musicOn=false;$('sound').setAttribute('aria-pressed','false');$('music-label').textContent='点按重试';}finally{audioBusy=false;}return state();
}
$('sound').addEventListener('click',toggleMusic);
window.addEventListener('pagehide',()=>{stopMotion();window.JoMusic.audio?.pause();});
const context=document.modelContext;
if(context?.registerTool){
 const lifecycle=new AbortController();window.addEventListener('pagehide',()=>lifecycle.abort(),{once:true});
 for(const tool of [
 {name:'read_birthday_surprise',description:'Read the current birthday gift stage, view, and the revealed fortune.',annotations:{readOnlyHint:true},execute:state},
 {name:'advance_birthday_surprise',description:'Open the lacquer gift box and reveal Jo’s birthday letter.',annotations:{readOnlyHint:false},execute:openGift},
 {name:'restart_birthday_surprise',description:'Close the birthday letter and reset the lacquer gift box.',annotations:{readOnlyHint:false},execute:replay},
 {name:'draw_birthday_fortune',description:'Open the birthday fortune view, shake the cylinder, and reveal one original ancient-style blessing.',annotations:{readOnlyHint:false},execute:async()=>{changeView('oracle');return drawLot();}}
 ]){tool.inputSchema={type:'object',properties:{},additionalProperties:false};const run=tool.execute;tool.execute=input=>{if(!input||typeof input!=='object'||Array.isArray(input)||Object.keys(input).length)throw Error('Expected an empty object.');return run();};try{Promise.resolve(context.registerTool(tool,{signal:lifecycle.signal})).catch(()=>{});}catch{}}
}

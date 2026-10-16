/* Debt Quest cinematic pixel battle prototype. No external assets or network access. */
(()=>{
const CSS=`#dqBattle{position:fixed;inset:0;z-index:120;background:#080b17;color:#f8eac7;overflow:auto;font-family:system-ui,sans-serif}#dqBattle .battleWrap{max-width:760px;margin:auto;padding:12px 12px 40px}#dqBattle canvas{display:block;width:100%;aspect-ratio:16/9;image-rendering:pixelated;background:#101b2a;border:2px solid #b89c62;border-radius:9px}#dqBattle .battleHud{display:flex;justify-content:space-between;gap:12px;align-items:center;font-size:13px;padding:10px 0}#dqBattle .battleLog{min-height:58px;padding:12px;background:#161e33;border:1px solid #5e6484;border-radius:10px;margin:9px 0;line-height:1.45}#dqBattle .battleActions{display:grid;grid-template-columns:repeat(2,1fr);gap:9px}#dqBattle button{padding:13px 8px;background:#283453;border:1px solid #bda46d;color:#f9e8ba;border-radius:10px;font-size:15px;font-weight:700}#dqBattle button:disabled{opacity:.4}#dqBattle .battleQuiz{background:#18233c;padding:12px;border:1px solid #c9b77e;border-radius:12px;margin:8px 0}#dqBattle .battleQuiz button{display:block;width:100%;text-align:left;margin:7px 0}#dqBattle .battleClose{background:transparent;border-color:#64718e;padding:6px 12px}#dqBattle .battleBars{display:flex;gap:15px;justify-content:space-between;flex-wrap:wrap}#dqBattle .battleBars span{font-size:13px}#dqBattle .battleBars b{color:#91e2bc}`;
const style=document.createElement('style');style.textContent=CSS;document.head.append(style);
let scene=null,raf=0, battleGeneration=0, pending=[];
const spriteImages={};
for(const key of ['hero','skeleton']){const img=new Image();img.src='./'+key+'-sprites.png?v=07';spriteImages[key]=img;}
function delay(fn,ms){const token=battleGeneration;const id=setTimeout(()=>{pending=pending.filter(v=>v!==id);if(scene&&token===battleGeneration)fn();},ms);pending.push(id);}
function clearBattleTimers(){battleGeneration++;pending.forEach(clearTimeout);pending=[];}

const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
function open(){if(scene)return;clearBattleTimers();const depth=Math.max(1,dq3.depth||1);scene={hp:36,maxhp:36,enemyHp:42+Math.min(depth,10)*5,enemyMax:42+Math.min(depth,10)*5,focus:0,guard:false,turn:0,phase:'ready',anim:0,kind:'',question:null,enemyName:depth<4?'Bone Collector':depth<7?'Coin Wraith':'Interest Drake',message:'A shadow approaches. Choose your action!',damage:0};
 const root=document.createElement('div');root.id='dqBattle';root.innerHTML=`<div class="battleWrap"><div class="battleHud"><strong>⚔️ THE WILDS · DEPTH ${depth}</strong><button class="battleClose" data-battle="exit">Leave battle</button></div><div class="battleBars"><span>🗡️ <b id="bHero">Hero 36/36</b> · Focus <b id="bFocus">0/3</b></span><span>💀 <b id="bEnemy">Enemy</b></span></div><canvas id="bCanvas" width="384" height="216" aria-label="Animated fantasy battle"></canvas><div class="battleLog" id="bLog" aria-live="polite"></div><div id="bQuiz"></div><div class="battleActions" id="bActions"><button data-battle="attack">⚔️ Attack</button><button data-battle="skill">✨ Twin-Blade Art</button><button data-battle="guard">🛡️ Defend</button><button data-battle="insight">📖 Insight</button></div><p style="font-size:12px;color:#a6b2ca">Combat, health, and loot are fictional. Battles never change your real debt balances.</p></div>`;document.body.append(root);root.addEventListener('click',handle);paint();loop();}
function paint(){if(!scene)return;const s=scene;document.getElementById('bHero').textContent=`Hero ${s.hp}/${s.maxhp}`;document.getElementById('bFocus').textContent=`${s.focus}/3`;document.getElementById('bEnemy').textContent=`${s.enemyName} ${Math.max(0,s.enemyHp)}/${s.enemyMax}`;document.getElementById('bLog').textContent=s.message;document.querySelectorAll('#bActions button').forEach(b=>b.disabled=s.phase!=='ready'||(b.dataset.battle==='skill'&&s.focus<2));}
function hit(amount,kind){const s=scene;if(!s)return;s.damage=amount;s.kind=kind;s.anim=performance.now();s.phase='anim';s.enemyHp=Math.max(0,s.enemyHp-amount);s.message=kind==='skill'?`Twin-Blade Art! ${amount} damage!`:`You strike for ${amount} damage!`;paint();delay(()=>{if(s.enemyHp<=0){win();return;}enemyTurn();},780)}
function enemyTurn(){const s=scene;if(!s)return;const n=s.guard?3:7+Math.floor(Math.random()*5);s.hp=Math.max(0,s.hp-n);s.anim=performance.now();s.kind='enemy';s.damage=n;s.message=`${s.enemyName} attacks! ${n} damage${s.guard?' (guarded)':''}.`;s.guard=false;s.phase='anim';paint();delay(()=>{if(s.hp===0){s.phase='lost';s.message='You fall in battle. Guild scouts bring you home safely. No real-world penalty.';dq3.hp=3;dq3.encounter=null;dqSave();}else{s.phase='ready';}paint();if(s.phase==='lost')finishButtons();},800)}
function win(){const s=scene;if(!s||s.phase==='won')return;s.phase='won';const reward=12+Math.min(10,s.turn)*2;state.xp+=reward;dq3.gold+=8;dq3.depth++;dq3.encounter=null;dqSave();save();s.message=`VICTORY! +${reward} XP · +8 guild gold · Depth ${dq3.depth} unlocked!`;paint();finishButtons();}
function finishButtons(){document.getElementById('bActions').innerHTML='<button data-battle="exit">🏰 Return to Guild</button><button data-battle="again">⚔️ Next Encounter</button>';}
function handle(e){const b=e.target.closest('[data-battle]');if(!b||!scene)return;const s=scene,a=b.dataset.battle;if(a==='exit'){close();return}if(a==='again'){close();open();return}if(s.phase!=='ready')return;s.turn++;if(a==='attack'){s.focus=clamp(s.focus+1,0,3);hit(8+Math.floor(Math.random()*7),'attack')}if(a==='skill'){if(s.focus<2)return;s.focus-=2;hit(21+Math.floor(Math.random()*10),'skill')}if(a==='guard'){s.guard=true;s.focus=clamp(s.focus+1,0,3);s.message='You brace behind your cloak and gain 1 Focus.';paint();enemyTurn()}if(a==='insight'){const q=dqQuestions[Math.floor(Math.random()*dqQuestions.length)];s.phase='quiz';s.question=q;s.message='Guild Insight: answer to gain Focus and a shield. Incorrect answers only miss the bonus.';document.getElementById('bQuiz').innerHTML=`<div class="battleQuiz"><strong>${esc(q.q)}</strong>${q.a.map((v,i)=>`<button data-battle="answer" data-choice="${i}">${esc(v)}</button>`).join('')}</div>`;paint()}}
function answer(e){const b=e.target.closest('[data-battle="answer"]');if(!b||!scene||scene.phase!=='quiz')return;const s=scene,q=s.question,correct=Number(b.dataset.choice)===q.correct;document.getElementById('bQuiz').innerHTML='';s.phase='ready';if(correct){s.focus=clamp(s.focus+2,0,3);s.guard=true;s.message=`Insight gained! +2 Focus and Guard. ${q.why}`;}else{s.message=`Not quite. ${q.why} No penalty—try another strategy.`;}paint();enemyTurn();}
function close(){clearBattleTimers();cancelAnimationFrame(raf);document.getElementById('dqBattle')?.remove();scene=null;render()}
function loop(){if(!scene)return;const c=document.getElementById('bCanvas'),ctx=c.getContext('2d');ctx.imageSmoothingEnabled=false;const s=scene,t=performance.now()/1000;ctx.fillStyle='#141b35';ctx.fillRect(0,0,384,216);
// Atmospheric parallax mountains and castle
for(let i=0;i<3;i++){ctx.fillStyle=['#202c4a','#293853','#33475c'][i];ctx.beginPath();ctx.moveTo(0,140+i*9);for(let x=0;x<=384;x+=24)ctx.lineTo(x,82+i*20+Math.sin(x*.023+i*2+t*.03)*19);ctx.lineTo(384,216);ctx.lineTo(0,216);ctx.fill()}
ctx.fillStyle='#131a30';ctx.fillRect(264,55,14,55);ctx.fillRect(290,40,22,73);ctx.fillRect(318,60,12,52);ctx.fillStyle='#ffcf7d';ctx.fillRect(298,61,5,9);
ctx.fillStyle='#263b40';ctx.fillRect(0,157,384,59);for(let i=0;i<38;i++){ctx.fillStyle=i%3?'#3a5551':'#496052';ctx.fillRect((i*47)%384,160+(i*17)%50,9,3)}
// Animated, articulated pixel actors. All weapons are attached to hand positions.
const elapsed=(performance.now()-s.anim)/1000;
const active=s.phase==='anim'&&elapsed<.72;
const attacking=active&&(s.kind==='attack'||s.kind==='skill');
const countering=active&&s.kind==='enemy';
const dash=attacking?Math.sin(Math.min(1,elapsed/.62)*Math.PI)*105:0;
const lunge=countering?Math.sin(Math.min(1,elapsed/.62)*Math.PI)*-73:0;
const heroX=94+dash,enemyX=284+lunge;
function rect(x,y,w,h,col){ctx.fillStyle=col;ctx.fillRect(Math.round(x),Math.round(y),w,h)}
function poly(points,col){ctx.fillStyle=col;ctx.beginPath();ctx.moveTo(Math.round(points[0][0]),Math.round(points[0][1]));for(let i=1;i<points.length;i++)ctx.lineTo(Math.round(points[i][0]),Math.round(points[i][1]));ctx.closePath();ctx.fill()}
function limb(x1,y1,x2,y2,w,col){ctx.strokeStyle=col;ctx.lineWidth=w;ctx.lineCap='square';ctx.beginPath();ctx.moveTo(Math.round(x1),Math.round(y1));ctx.lineTo(Math.round(x2),Math.round(y2));ctx.stroke()}
function blade(x,y,angle,reverse=false){ctx.save();ctx.translate(Math.round(x),Math.round(y));ctx.rotate(angle);rect(-3,-2,6,8,'#6a493a');rect(-7,-7,14,4,'#c7a261');poly([[-3,-7],[3,-7],[3,-38],[0,-46],[-3,-38]],'#a8c6d5');rect(-1,-35,2,26,'#f1f4ec');rect(-3,-38,2,22,'#718da9');ctx.restore()}
function hero(x,y){ctx.save();ctx.translate(Math.round(x),Math.round(y));const bob=Math.sin(t*3.4)*1.7;ctx.translate(0,bob);const strike=attacking?Math.sin(Math.min(1,elapsed/.65)*Math.PI):0;const cloak=Math.sin(t*4)*3-(attacking?11*strike:0);
// Cloak silhouette, lined hem, folds and hood
poly([[-11,-31],[-21,-20],[-24+cloak,12],[-18+cloak,29],[-7,25],[13,27],[24+cloak,23],[20,-18],[10,-31]],'#090c1b');
poly([[-15,-21],[-19+cloak,11],[-15+cloak,25],[-8,19],[-7,-20]],'#24304c');
poly([[12,-23],[18+cloak,15],[15+cloak,25],[9,20]],'#354365');
rect(-13,15,10,21,'#202838');rect(4,15,10,21,'#202838');rect(-14,31,12,8,'#0b0f19');rect(4,31,13,8,'#0b0f19');rect(-13,32,3,5,'#8e7e67');rect(5,32,3,5,'#8e7e67');
// Tunic, layered armor, straps, belt and silver trim
poly([[-13,-27],[11,-27],[16,15],[-15,15]],'#35405b');rect(-9,-21,18,30,'#293b53');
poly([[-12,-23],[1,-15],[-2,-10],[-15,-18]],'#647b91');poly([[9,-23],[-2,-14],[1,-10],[13,-19]],'#71879d');
limb(-10,-22,8,10,3,'#806548');rect(-13,8,28,5,'#151b2a');rect(-2,8,6,5,'#d4b96f');
rect(-6,-6,5,5,'#4f6077');rect(5,-6,5,5,'#4f6077');
// Head, face, textured hair, hood and highlights
rect(-9,-44,19,21,'#80553e');rect(-7,-43,16,16,'#a77757');rect(3,-36,3,3,'#f4dfb0');rect(6,-31,3,2,'#573a34');
poly([[-13,-43],[-11,-52],[7,-53],[13,-44],[11,-38],[7,-45],[-8,-45],[-11,-37]],'#111321');
for(let i=0;i<6;i++)rect(-8+i*3,-49+(i%2),2,4,i%2?'#242031':'#17131d');
// Two moving forearms, hands, and blades: no floating weapons
const swing=attacking?Math.sin(Math.min(1,elapsed/.62)*Math.PI*1.55):0;
const lx=-18-7*swing,ly=-13-12*swing,rx=19+10*swing,ry=-11-17*swing;
limb(-12,-20,lx,ly,9,'#28344b');limb(12,-20,rx,ry,9,'#35465e');
rect(lx-4,ly-3,8,7,'#171e2d');rect(rx-4,ry-3,8,7,'#171e2d');
rect(lx-2,ly-2,4,3,'#a97d5c');rect(rx-2,ry-2,4,3,'#a97d5c');
blade(lx,ly,attacking?-1.0+1.9*swing:-.56);blade(rx,ry,attacking?.8-2.1*swing:.58);
ctx.restore()}
function skeleton(x,y){ctx.save();ctx.translate(Math.round(x),Math.round(y+Math.sin(t*2.6)*1.5));const recoil=active&&s.kind!=='enemy'?Math.sin(Math.min(1,elapsed/.6)*Math.PI)*10:0;ctx.translate(recoil,0);const sway=Math.sin(t*2.3)*2;
// Tattered mantle, cracked breastplate, ribcage, exposed spine
poly([[-19,-25],[-29,-8],[-24,20],[-11,12],[16,17],[25,-8],[16,-28]],'#4d3447');
poly([[-17,-23],[-24,-5],[-20,15],[-10,8]],'#755064');
limb(-7,7,-8,28,8,'#c6bca4');limb(8,7,10,28,8,'#c6bca4');
rect(-14,26,12,9,'#bbb29e');rect(4,26,13,9,'#bbb29e');rect(-10,27,3,6,'#efe4c9');
rect(-4,-22,8,33,'#d8d0b7');for(let j=0;j<4;j++){limb(-4,-20+j*6,-15,-18+j*6,3,'#dcd3b9');limb(4,-20+j*6,15,-18+j*6,3,'#dcd3b9')}
rect(-12,7,24,9,'#c5bca4');rect(-6,7,12,9,'#54485a');
// Detailed skull, jaw, glowing eye sockets, crown fracture
rect(-17,-52,34,29,'#c7bda7');rect(-14,-55,28,29,'#eee2c7');rect(-11,-26,24,11,'#d7c8ab');
rect(-11,-42,9,8,'#392936');rect(5,-42,9,8,'#392936');rect(-8,-40,4,4,'#f26383');rect(7,-40,4,4,'#f26383');
poly([[-1,-32],[4,-32],[6,-26],[-4,-26]],'#65545b');for(let i=0;i<5;i++)rect(-8+i*5,-22,2,5,'#6c6260');
limb(-12,-53,-5,-47,2,'#8e8178');limb(-5,-47,-9,-43,2,'#8e8178');
// Jointed arms and weapon held in bony right hand
const arm=countering?Math.sin(Math.min(1,elapsed/.6)*Math.PI):0;
limb(-16,-17,-24+sway,-1,6,'#ded4b9');limb(-24+sway,-1,-25+sway,12,5,'#ded4b9');
limb(16,-17,25+arm*5,-3-arm*9,6,'#ded4b9');limb(25+arm*5,-3-arm*9,29+arm*9,11-arm*17,5,'#ded4b9');
rect(26+arm*9,8-arm*17,6,5,'#e9ddc0');
ctx.save();ctx.translate(29+arm*9,10-arm*17);ctx.rotate(.18-arm*1.2);rect(-2,-4,5,11,'#64495b');rect(-5,-5,11,4,'#ad9b78');poly([[-3,-5],[3,-5],[3,-43],[0,-51],[-3,-43]],'#91a5ba');rect(-1,-41,2,31,'#d9e7e8');ctx.restore();
ctx.restore()}
rect(heroX-21,185,42,4,'#111723');rect(enemyX-22,185,44,4,'#111723');
// Frame-based, transparent PNG sprite sheets; each weapon is drawn as part of its pose.
const frame=active?(attacking?(elapsed<.20?2:elapsed<.44?3:1):countering?(elapsed<.35?2:3):4):(s.phase==='won'?5:Math.floor(t*2.6)%2);
function actor(name,x,y,f){const img=spriteImages[name];if(img.complete&&img.naturalWidth){ctx.drawImage(img,f*96,0,96,112,Math.round(x-47),Math.round(y-79),94,110);return true;}return false;}
if(!actor('hero',heroX,151,frame))hero(heroX,151);
const enemyFrame=active?(countering?(elapsed<.28?2:3):attacking?4:1):Math.floor(t*2)%2;
if(!actor('skeleton',enemyX,148,enemyFrame))skeleton(enemyX,148);
// Directional slash arcs, sparks and impact flashes
if(attacking&&elapsed>.12&&elapsed<.52){const alpha=1-Math.abs(elapsed-.32)/.23;ctx.globalAlpha=Math.max(0,alpha);ctx.strokeStyle=s.kind==='skill'?'#8aeaff':'#f5e4b1';ctx.lineWidth=s.kind==='skill'?5:3;for(let i=0;i<(s.kind==='skill'?3:2);i++){ctx.beginPath();ctx.arc(enemyX-7,133,24+i*8,-1.5+i*.42,1.4+i*.32);ctx.stroke()}for(let i=0;i<12;i++){const a=i*2.4+t*3;rect(enemyX+Math.cos(a)*25,128+Math.sin(a)*23,3,3,i%2?'#f9d98d':'#9dd9f4')}ctx.globalAlpha=1}
if(countering&&elapsed>.16&&elapsed<.46){ctx.strokeStyle='#f59bad';ctx.lineWidth=4;ctx.beginPath();ctx.arc(heroX,137,32,-1.4,1.2);ctx.stroke()}
// HP bars
rect(48,18,106,10,'#111827');rect(49,19,Math.round(104*s.hp/s.maxhp),8,'#66d8a2');rect(231,18,106,10,'#111827');rect(232,19,Math.round(104*s.enemyHp/s.enemyMax),8,'#ef7a80');
if(s.phase==='anim'&&performance.now()-s.anim<410){ctx.globalAlpha=.75;rect(s.kind==='enemy'?heroX-20:enemyX-20,100,42,65,s.kind==='enemy'?'#f46b8b':'#e7e6ad');ctx.globalAlpha=1;ctx.fillStyle='#fff4b2';ctx.font='bold 15px monospace';ctx.fillText('-'+s.damage,enemyX-10,89)}
for(let i=0;i<10;i++){const x=(i*57+t*(i%2?4:-3)+384)%384,y=30+(i*31)%120;rect(x,y,2,2,i%2?'#e4c780':'#8ad1cf')}
raf=requestAnimationFrame(loop)}
document.addEventListener('click',answer);
document.addEventListener('click',e=>{if(e.target.closest('[data-v3="battle"]'))open()});
})();

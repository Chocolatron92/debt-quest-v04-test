(()=>{'use strict';
const $=id=>document.getElementById(id),scene=$('scene'),hero=$('hero'),enemy=$('enemy'),flash=$('hitflash');let state=BattleRules.create(),runId=0;const sleep=ms=>new Promise(r=>setTimeout(r,ms));
function ui(message){$('heroLabel').textContent=`Night Hunter ${state.heroHP}/${state.heroMax}`;$('enemyLabel').textContent=`Coin Wraith ${state.enemyHP}/${state.enemyMax}`;$('heroBar').style.width=(100*state.heroHP/state.heroMax)+'%';$('enemyBar').style.width=(100*state.enemyHP/state.enemyMax)+'%';$('focus').textContent=`Focus ${state.focus}/3`;$('guard').textContent=`Guard ${state.guard}/${state.guardMax}`;$('turn').textContent=`Turn ${state.turn} · ${state.phase}`;if(message)$('status').textContent=message;$('attack').disabled=state.phase!=='ready';$('special').disabled=state.phase!=='ready'||state.focus<3;$('defend').disabled=state.phase!=='ready';}
function log(s){const d=document.createElement('div');d.textContent=s;$('log').prepend(d);}
function pose(n){hero.style.backgroundPosition=`${(n%6)*20}% ${n>=6?100:0}%`;}
function approach(n){const t=n<2?n/2:n<9?1:Math.max(0,1-(n-8)/3);hero.style.transform=`translateX(${t*75}%)`;}
function hitEnemy(dmg,id){flash.textContent='−'+dmg;flash.classList.remove('show');scene.classList.remove('shake');void flash.offsetWidth;flash.classList.add('show');scene.classList.add('shake');enemy.style.transform='translateX(10px) rotate(5deg)';setTimeout(()=>{if(id!==runId)return;enemy.style.transform='';scene.classList.remove('shake');},250);}
async function attack(type){if(!BattleRules.startAction(state,type))return;const id=++runId,valid=()=>id===runId;ui(type==='special'?'Twin-Blade Art!':'Night Hunter attacks!');const hits=BattleRules.ACTIONS[type].hits.length;
for(let h=0;h<hits;h++){
 for(let frame=0;frame<12;frame++){
  if(!valid())return;pose(frame);approach(frame);
  if(frame===6){const event=BattleRules.heroContact(state);if(event){hitEnemy(event.damage,id);log(`Blade ${h+1}: ${event.damage} damage · Enemy HP ${event.remaining}/${state.enemyMax}`);ui(event.broken?'GUARD BROKEN! Enemy staggered.':`Direct hit! ${event.damage} damage.`);}if(state.won)break;}
  await sleep(frame===6?210:frame<3?115:80);
 }
 if(state.won)break;
}
if(!valid())return;pose(0);hero.style.transform='';if(state.won){ui('VICTORY! Coin Wraith defeated.');log('Victory — no enemy retaliation.');return;}
BattleRules.finishHero(state);ui('Attack resolved.');await enemyTurn(id);
}
async function enemyTurn(id){if(id!==runId||state.phase!=='enemy')return;if(state.staggered){log('Guard break interrupts enemy retaliation.');ui('Enemy staggered — attack interrupted!');await sleep(350);if(id!==runId)return;}else{ui('Coin Wraith prepares to strike…');await sleep(450);if(id!==runId)return;enemy.style.transform='translateX(-24%)';await sleep(240);if(id!==runId)return;const event=BattleRules.enemyContact(state);if(event){scene.classList.remove('shake');void scene.offsetWidth;scene.classList.add('shake');log(`Coin Wraith strikes: ${event.damage} damage · Hero HP ${event.remaining}/${state.heroMax}`);ui(`Enemy hit! ${event.damage} damage.`);}await sleep(250);if(id!==runId)return;enemy.style.transform='';}
if(id!==runId)return;scene.classList.remove('shake');if(state.lost){ui('DEFEAT — return safely to the guild.');return;}BattleRules.finishTurn(state);ui('Your turn. Choose an action.');}
async function defend(){if(!BattleRules.startAction(state,'defend'))return;const id=++runId;hero.style.filter='drop-shadow(0 0 14px #6cc9fa)';ui('Defensive stance! Incoming damage reduced.');await sleep(500);if(id!==runId)return;hero.style.filter='';BattleRules.finishHero(state);await enemyTurn(id);}
function reset(){++runId;state=BattleRules.create();pose(0);hero.style.transform='';hero.style.filter='';enemy.style.transform='';flash.classList.remove('show');scene.classList.remove('shake');$('log').replaceChildren();ui('New battle started.');}
$('attack').addEventListener('click',()=>attack('attack'));$('special').addEventListener('click',()=>attack('special'));$('defend').addEventListener('click',defend);$('reset').addEventListener('click',reset);ui();
})();

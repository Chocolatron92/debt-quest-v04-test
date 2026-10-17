'use strict';
const BattleRules = (() => {
 const clamp=(n,lo,hi)=>Math.max(lo,Math.min(hi,n));
 const ACTIONS=Object.freeze({attack:{hits:[10],focusCost:0},special:{hits:[12,16],focusCost:3},defend:{hits:[],focusCost:0}});
 function create(){return {heroHP:36,heroMax:36,enemyHP:68,enemyMax:68,focus:0,guard:3,guardMax:3,turn:1,phase:'ready',defending:false,won:false,lost:false,action:null,hitIndex:0,staggered:false,events:[]};}
 function startAction(s,type){const spec=ACTIONS[type];if(!spec||s.phase!=='ready'||s.focus<spec.focusCost)return false;s.phase='hero';s.action=type;s.hitIndex=0;s.staggered=false;s.events=[];s.focus-=spec.focusCost;if(type==='defend'){s.defending=true;s.focus=clamp(s.focus+1,0,3);}return true;}
 function heroContact(s){if(s.phase!=='hero'||!s.action||s.action==='defend')return null;const spec=ACTIONS[s.action];if(s.hitIndex>=spec.hits.length||s.enemyHP<=0)return null;const index=s.hitIndex++;const base=spec.hits[index];const damage=Math.min(s.enemyHP,base+(s.guard===0?4:0));s.enemyHP-=damage;const oldGuard=s.guard;s.guard=clamp(s.guard-1,0,s.guardMax);const broken=oldGuard>0&&s.guard===0;if(broken)s.staggered=true;if(s.enemyHP===0){s.phase='finished';s.won=true;}const event={kind:'hero-hit',index,damage,remaining:s.enemyHP,broken};s.events.push(event);return event;}
 function finishHero(s){if(s.phase!=='hero')return false;if(s.action==='attack')s.focus=clamp(s.focus+1,0,3);s.phase='enemy';return true;}
 function enemyContact(s,base=8){if(s.phase!=='enemy'||s.staggered)return null;const damage=Math.min(s.heroHP,s.defending?Math.ceil(base*.35):base);s.defending=false;s.heroHP-=damage;if(s.heroHP===0){s.lost=true;s.phase='finished';}const event={kind:'enemy-hit',damage,remaining:s.heroHP};s.events.push(event);return event;}
 function finishTurn(s){if(s.phase!=='enemy')return false;if(s.staggered){s.guard=s.guardMax;s.staggered=false;}s.defending=false;s.action=null;s.hitIndex=0;s.turn++;s.phase='ready';return true;}
 return {ACTIONS,create,startAction,heroContact,finishHero,enemyContact,finishTurn};
})();
if(typeof module!=='undefined')module.exports=BattleRules;

(function(root){'use strict';
const MAX_HERO=36,MAX_ENEMY=68;
function create(){return {heroHP:MAX_HERO,enemyHP:MAX_ENEMY,focus:0,guard:3,turn:1,phase:'ready',defending:false,ended:false,log:[]}}
function clamp(n,a,b){return Math.max(a,Math.min(b,n))}
function start(s,kind){if(s.phase!=='ready'||s.ended)return false;if(kind==='special'&&s.focus<3)return false;if(!['attack','special','defend'].includes(kind))return false;s.phase='acting';if(kind==='special')s.focus-=3;return true}
function hit(s,amount,token,seen){if(s.phase!=='acting'||s.ended||seen.has(token))return false;seen.add(token);const dealt=Math.min(s.enemyHP,Math.max(0,amount));s.enemyHP-=dealt;s.guard=Math.max(0,s.guard-1);s.log.unshift(`Hit ${token}: ${dealt} damage`);if(s.enemyHP===0){s.ended=true;s.phase='victory'}return dealt}
function finish(s,kind){if(s.ended)return 'victory';if(kind==='attack')s.focus=clamp(s.focus+1,0,3);if(kind==='defend'){s.defending=true;s.focus=clamp(s.focus+1,0,3)}if(s.guard===0){s.guard=3;s.defending=false;s.phase='ready';s.turn++;s.log.unshift('Guard broken — enemy turn skipped');return 'break'}s.phase='enemy';return 'enemy'}
function retaliate(s){if(s.phase!=='enemy'||s.ended)return false;const damage=s.defending?3:8;s.heroHP=Math.max(0,s.heroHP-damage);s.defending=false;s.log.unshift(`Wraith: ${damage} damage`);if(s.heroHP===0){s.ended=true;s.phase='defeat'}else{s.phase='ready';s.turn++}return damage}
root.DQEngine={create,start,hit,finish,retaliate};
})(typeof module!=='undefined'?module.exports:window);

const assert=require('assert'),R=require('./engine.js');
let s=R.create();assert(R.startAction(s,'attack'));assert(!R.startAction(s,'attack'));let r=R.strike(s,10);assert.equal(r.damage,10);assert.equal(s.enemyHP,58);assert.equal(s.guard,2);R.enemyStrike(s,8);assert.equal(s.heroHP,28);R.finishTurn(s);assert.equal(s.phase,'ready');assert.equal(s.turn,2);
s=R.create();assert(R.startAction(s,'defend'));assert.equal(R.enemyStrike(s,8),3);assert.equal(s.heroHP,33);
s=R.create();assert(!R.startAction(s,'special'));assert.equal(s.phase,'ready');assert(R.startAction(s,'attack'));R.strike(s,100);assert(s.won);assert.equal(s.enemyHP,0);assert.equal(R.enemyStrike(s,8),0);assert.equal(s.heroHP,36);
s=R.create();assert(R.startAction(s,'attack'));R.enemyStrike(s,100);assert(s.lost);assert.equal(s.heroHP,0);assert(!R.startAction(s,'attack'));
s=R.create();assert(R.startAction(s,'attack'));R.strike(s,5);R.strike(s,5);assert.equal(s.guard,1);assert.equal(R.strike(s,5).guardBroken,true);assert.equal(s.guard,0);
console.log('PASS: input locking, contact damage, HP bounds, guard break, defend, special gating, victory, defeat');

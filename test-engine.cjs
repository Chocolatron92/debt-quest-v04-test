const assert=require('node:assert/strict'), E=require('./engine.js').DQEngine;
let count=0;function test(name,fn){fn();count++;console.log('PASS',name)}
test('initial values',()=>{const s=E.create();assert.equal(s.enemyHP,68);assert.equal(s.phase,'ready')});
test('cannot double start',()=>{const s=E.create();assert.equal(E.start(s,'attack'),true);assert.equal(E.start(s,'attack'),false)});
test('one hit per token',()=>{const s=E.create(),seen=new Set();E.start(s,'attack');assert.equal(E.hit(s,10,'slash',seen),10);assert.equal(E.hit(s,10,'slash',seen),false);assert.equal(s.enemyHP,58)});
test('guard break skips enemy',()=>{const s=E.create();s.guard=1;E.start(s,'attack');E.hit(s,10,'slash',new Set());assert.equal(E.finish(s,'attack'),'break');assert.equal(s.phase,'ready');assert.equal(s.heroHP,36)});
test('defend mitigation',()=>{const s=E.create();E.start(s,'defend');E.finish(s,'defend');assert.equal(E.retaliate(s),3)});
test('normal retaliation',()=>{const s=E.create();E.start(s,'attack');E.finish(s,'attack');assert.equal(E.retaliate(s),8)});
test('focus special cost',()=>{const s=E.create();assert.equal(E.start(s,'special'),false);s.focus=3;assert.equal(E.start(s,'special'),true);assert.equal(s.focus,0)});
test('victory stops enemy',()=>{const s=E.create();s.enemyHP=4;E.start(s,'attack');assert.equal(E.hit(s,10,'slash',new Set()),4);assert.equal(s.phase,'victory');assert.equal(E.retaliate(s),false)});
test('defeat stops new commands',()=>{const s=E.create();s.heroHP=4;E.start(s,'attack');E.finish(s,'attack');E.retaliate(s);assert.equal(s.phase,'defeat');assert.equal(E.start(s,'attack'),false)});
test('special two distinct hits',()=>{const s=E.create(),seen=new Set();s.focus=3;E.start(s,'special');E.hit(s,10,'blade-1',seen);E.hit(s,20,'blade-2',seen);assert.equal(s.enemyHP,38)});
console.log(`${count} engine tests passed`);

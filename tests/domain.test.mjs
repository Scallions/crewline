import test from 'node:test';
import assert from 'node:assert/strict';
import { initialState, reducer, quote, parseBrief, stationsFor, reportMarkdown } from '../src/domain.mjs';

const current = s => s.jobs.find(j => j.id === s.activeId);
const runToReview = state => { let s = reducer(state, { type: 'START' }); for (let i = 0; i < 4; i++) s = reducer(s, { type: 'TICK' }); return s; };

test('reference quote is coherent and QA is included in the platform fee', () => {
  assert.deepEqual(quote(current(initialState())), { success: 440, reserve: 60, platform: 20, total: 520 });
});
test('agent replacement updates price and rejects mismatched or third-party QA assignments', () => {
  let s = initialState();
  s = reducer(s, { type: 'SELECT_AGENT', station: 'collect', agentId: 'openresearch' });
  assert.equal(quote(current(s)).total, 490);
  assert.equal(reducer(s, { type: 'SELECT_AGENT', station: 'collect', agentId: 'reportwriter' }), s);
  assert.equal(reducer(s, { type: 'SELECT_AGENT', station: 'qa', agentId: 'quality' }), s);
});
test('natural language changes scope, budget and duration', () => {
  const j = current(initialState());
  const patch = parseBrief('预算改为 450 USDC，10 页，一周交付，去掉对比矩阵', j);
  assert.deepEqual(patch, { budget: 450, pages: 10, days: 7, includeMatrix: false });
  const s = reducer(initialState(), { type: 'CHAT', text: '换便宜一点的组合' });
  assert.equal(quote(current(s)).total, 420);
});
test('removing matrix changes dependencies and price while keeping quality gate', () => {
  let s = initialState(); s = reducer(s, { type: 'EDIT', patch: { includeMatrix: false } });
  assert.equal(quote(current(s)).total, 380);
  assert.deepEqual(stationsFor(current(s)).map(x => x.id), ['collect', 'write', 'qa']);
  s = runToReview(s); assert.equal(current(s).progress, 3); assert.equal(current(s).status, 'review');
});
test('insufficient budget or wallet prevents any execution and ledger mutation', () => {
  let s = initialState(); s = reducer(s, { type: 'EDIT', patch: { budget: 400 } });
  assert.equal(reducer(s, { type: 'START' }), s);
  const poor = { ...initialState(), balance: 100 }; assert.equal(reducer(poor, { type: 'START' }), poor);
  const fresh = initialState(); assert.equal(reducer(fresh, { type: 'TICK' }), fresh);
});
test('starting twice cannot charge twice; running crew is immutable', () => {
  let s = reducer(initialState(), { type: 'START' });
  assert.equal(s.balance, 760); assert.equal(current(s).escrow, 520);
  assert.equal(reducer(s, { type: 'START' }), s);
  assert.equal(reducer(s, { type: 'SELECT_AGENT', station: 'write', agentId: 'briefly' }), s);
  assert.equal(reducer(s, { type: 'EDIT', patch: { budget: 900 } }), s);
  assert.equal(s.transactions.length, 1);
});
test('pause freezes progress, resume preserves completed work', () => {
  let s = reducer(initialState(), { type: 'START' }); s = reducer(s, { type: 'TICK' });
  s = reducer(s, { type: 'PAUSE' }); assert.equal(current(s).status, 'paused');
  assert.equal(reducer(s, { type: 'TICK' }), s);
  s = reducer(s, { type: 'CHAT', text: '继续执行' }); s = reducer(s, { type: 'TICK' });
  assert.equal(current(s).progress, 2); assert.equal(s.balance, 760);
});
test('completion waits for manual acceptance and unused reserve refunds only once', () => {
  let s = runToReview(initialState()); assert.equal(current(s).status, 'review'); assert.equal(s.balance, 760);
  s = reducer(s, { type: 'ACCEPT' }); assert.equal(current(s).status, 'completed'); assert.equal(current(s).escrow, 0); assert.equal(s.balance, 796);
  assert.equal(reducer(s, { type: 'ACCEPT' }), s); assert.equal(s.transactions.length, 2);
  assert.equal(1280 - s.balance, 440 + 20 + 24);
});
test('one free rework is allowed; second rejection opens dispute without releasing escrow', () => {
  let s = runToReview(initialState()); const before = s.balance;
  assert.equal(reducer(s, { type: 'REWORK', reason: '' }), s);
  s = reducer(s, { type: 'REWORK', reason: '缺少出处：补充来源' }); assert.equal(current(s).reworks, 1); assert.equal(s.balance, before);
  s = reducer(reducer(s, { type: 'TICK' }), { type: 'TICK' }); assert.equal(current(s).status, 'review');
  assert.equal(reducer(s, { type: 'REWORK', reason: 'again' }), s);
  s = reducer(s, { type: 'DISPUTE', reason: '事实仍无法核实' }); assert.equal(current(s).status, 'disputed'); assert.equal(current(s).escrow, 520); assert.equal(s.balance, before);
  assert.equal(reducer(s, { type: 'ACCEPT' }), s);
});
test('background execution updates the correct job after opening a new draft', () => {
  let s = reducer(initialState(), { type: 'START' }); const oldId = s.activeId;
  s = reducer(s, { type: 'CREATE' }); s = reducer(s, { type: 'TICK', id: oldId });
  assert.equal(current(s).status, 'draft'); assert.equal(s.jobs.find(j => j.id === oldId).progress, 1);
});
test('artifact represents current scope and explicitly identifies demonstration data', () => {
  let s = reducer(initialState(), { type: 'CHAT', text: '改成 12 页' });
  assert.match(reportMarkdown(current(s)), /目标篇幅：12 页/); assert.match(reportMarkdown(current(s)), /不是实际研究结论/);
});


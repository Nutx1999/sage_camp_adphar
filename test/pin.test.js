import { test } from 'node:test';
import assert from 'node:assert/strict';
import { startTestServer } from './helpers.js';

test('POST /api/announcements/:id/pin ครั้งแรก → pinned: true', async () => {
  const srv = await startTestServer();
  const res = await srv.request('POST', '/api/announcements/2/pin');
  assert.equal(res.status, 200);
  assert.equal(res.data.id, 2);
  assert.equal(res.data.pinned, true);
  assert.equal(srv.store.get(2).pinned, true);
  await srv.close();
});

test('POST /api/announcements/:id/pin ครั้งที่สอง → pinned: false', async () => {
  const srv = await startTestServer();
  await srv.request('POST', '/api/announcements/2/pin');
  const res = await srv.request('POST', '/api/announcements/2/pin');
  assert.equal(res.status, 200);
  assert.equal(res.data.pinned, false);
  await srv.close();
});

test('POST /api/announcements/:id/pin ไม่พบประกาศ → 404 พร้อม error', async () => {
  const srv = await startTestServer();
  const res = await srv.request('POST', '/api/announcements/9999/pin');
  assert.equal(res.status, 404);
  assert.equal(typeof res.data.error, 'string');
  await srv.close();
});

test('pin ไม่กระทบประกาศอื่น และ GET รายการเห็นค่า pinned', async () => {
  const srv = await startTestServer();
  await srv.request('POST', '/api/announcements/1/pin');
  const res = await srv.request('GET', '/api/announcements');
  const one = res.data.find((item) => item.id === 1);
  const two = res.data.find((item) => item.id === 2);
  assert.equal(one.pinned, true);
  assert.equal(two.pinned, undefined);
  await srv.close();
});

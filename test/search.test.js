// โมดูล B — ค้นหาประกาศ · branch: feature/search
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { startTestServer } from './helpers.js';

test('ค้นหาไม่สนตัวพิมพ์เล็ก/ใหญ่ (ประกาศ id 1 มีคำว่า Docker)', async () => {
  const srv = await startTestServer();
  const res = await srv.request('GET', '/api/search?q=DOCKER');
  assert.equal(res.status, 200);
  assert.deepEqual(res.data.map((item) => item.id), [1]);
  await srv.close();
});

test('ค้นจาก title และ body ได้', async () => {
  const srv = await startTestServer();
  await srv.request('POST', '/api/announcements', { title: 'ประชุม Kickoff', body: 'ห้อง 301' });
  const byTitle = await srv.request('GET', '/api/search?q=kickoff');
  assert.equal(byTitle.data.length, 1);
  const byBody = await srv.request('GET', '/api/search?q=ห้อง%20301');
  assert.equal(byBody.data.length, 1);
  await srv.close();
});

test('ไม่ใส่คำค้น → ได้ทุกรายการ', async () => {
  const srv = await startTestServer();
  const res = await srv.request('GET', '/api/search');
  assert.equal(res.status, 200);
  assert.equal(res.data.length, 2);
  await srv.close();
});

test('คำค้นที่มีแต่ช่องว่าง → ได้ทุกรายการ (trim)', async () => {
  const srv = await startTestServer();
  const res = await srv.request('GET', '/api/search?q=%20%20');
  assert.equal(res.data.length, 2);
  await srv.close();
});

test('ไม่พบ → ได้ array ว่าง', async () => {
  const srv = await startTestServer();
  const res = await srv.request('GET', '/api/search?q=zzzz');
  assert.equal(res.status, 200);
  assert.deepEqual(res.data, []);
  await srv.close();
});

test('คำค้นที่เป็นอักขระพิเศษ (เช่น "(") ไม่ทำให้ server พัง', async () => {
  const srv = await startTestServer();
  const res = await srv.request('GET', '/api/search?q=(');
  assert.equal(res.status, 200);
  assert.deepEqual(res.data, []);
  await srv.close();
});

test('การค้นหาไม่แก้ไขข้อมูลใด ๆ', async () => {
  const srv = await startTestServer();
  const before = JSON.stringify(srv.store.list());
  await srv.request('GET', '/api/search?q=docker');
  assert.equal(JSON.stringify(srv.store.list()), before);
  await srv.close();
});

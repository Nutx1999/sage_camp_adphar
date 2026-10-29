import { test } from 'node:test';
import assert from 'node:assert/strict';
import { startTestServer } from './helpers.js';

test('PATCH แก้หัวข้อได้', async () => {
  const srv = await startTestServer();
  try {
    const res = await srv.request('PATCH', '/api/announcements/1', { title: 'Updated title' });
    assert.equal(res.status, 200);
    assert.equal(res.data.title, 'Updated title');
  } finally {
    await srv.close();
  }
});

test('PATCH ฟิลด์ที่ไม่ส่งคงค่าเดิม', async () => {
  const srv = await startTestServer();
  try {
    await srv.request('PATCH', '/api/announcements/1', { title: 'Updated title' });
    const got = await srv.request('GET', '/api/announcements/1');
    assert.ok(got.data.body.includes('แอปนี้ใช้ฝึก Git'));
  } finally {
    await srv.close();
  }
});

test('PATCH ส่งฟิลด์อื่นไม่ถูกบันทึก', async () => {
  const srv = await startTestServer();
  try {
    const res = await srv.request('PATCH', '/api/announcements/1', { title: 'Again', pinned: true });
    assert.equal(res.status, 200);
    assert.equal(res.data.pinned, undefined);
  } finally {
    await srv.close();
  }
});

test('PATCH หัวข้อว่าง → 400', async () => {
  const srv = await startTestServer();
  try {
    const res = await srv.request('PATCH', '/api/announcements/1', { title: '   ' });
    assert.equal(res.status, 400);
  } finally {
    await srv.close();
  }
});

test('PATCH ไม่พบประกาศ → 404', async () => {
  const srv = await startTestServer();
  try {
    const res = await srv.request('PATCH', '/api/announcements/9999', { title: 'x' });
    assert.equal(res.status, 404);
  } finally {
    await srv.close();
  }
});

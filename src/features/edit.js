// โมดูล A — แก้ไขประกาศ  ·  branch: feature/edit
// API ที่ต้องทำ: PATCH /api/announcements/:id
// รายละเอียด: การ์ดงาน (Issue) "A — แก้ไขประกาศ" บน Board ของทีม
//
// router = express.Router() ที่ mount ไว้ที่ /api แล้ว (เขียน path โดยไม่ต้องมี /api นำหน้า)
// store  = ตัวเก็บข้อมูล: list() · get(id) · create({title, body}) · update(id, patch) · remove(id)

import { validateAnnouncement } from '../validation.js';

export function register(router, { store }) {
  router.patch('/announcements/:id', (req, res) => {
    const id = Number(req.params.id);
    const item = store.get(id);
    if (!item) return res.status(404).json({ error: 'ไม่พบประกาศ' });

    const body = req.body && typeof req.body === 'object' ? req.body : {};
    const merged = {
      title: body.title !== undefined ? body.title : item.title,
      body: body.body !== undefined ? body.body : item.body,
    };

    const { errors, value } = validateAnnouncement(merged);
    if (errors.length) return res.status(400).json({ error: errors.join(', ') });

    const updated = store.update(id, { title: value.title, body: value.body });
    res.status(200).json(updated);
  });
}

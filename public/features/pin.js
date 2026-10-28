// โมดูล C — ปักหมุดประกาศ  ·  branch: feature/pin
// หน้าเว็บของฟีเจอร์ — ดูเครื่องมือที่ใช้ได้ใน ctx ที่หัวไฟล์ public/app.js

export function init(ctx) {
  // ประกาศที่ปักหมุดอยู่บนสุด ส่วนที่เหลือเรียงตามเดิม
  ctx.addSorter((a, b) => Number(b.pinned === true) - Number(a.pinned === true));

  ctx.addItemHook((item, { title, actions }) => {
    const pinned = item.pinned === true;
    if (pinned) {
      const badge = document.createElement('span');
      badge.className = 'badge';
      badge.textContent = '📌 ปักหมุด';
      title.prepend(badge);
    }

    const button = document.createElement('button');
    button.className = 'link';
    button.textContent = pinned ? 'เลิกปักหมุด' : 'ปักหมุด';
    button.onclick = async () => {
      const res = await ctx.api(`/api/announcements/${item.id}/pin`, { method: 'POST' });
      if (!res.ok) return ctx.notify(res.data.error);
      ctx.reload();
    };
    actions.prepend(button);
  });
}

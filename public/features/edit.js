// โมดูล A — แก้ไขประกาศ  ·  branch: feature/edit
// หน้าเว็บของฟีเจอร์ — ดูเครื่องมือที่ใช้ได้ใน ctx ที่หัวไฟล์ public/app.js

export function init(ctx) {
  ctx.addItemHook((item, parts) => {
    const editBtn = document.createElement('button');
    editBtn.className = 'link';
    editBtn.textContent = 'แก้ไข';
    editBtn.onclick = async () => {
      const newTitle = prompt('หัวข้อ', item.title);
      if (newTitle === null) return;
      const newBody = prompt('รายละเอียด', item.body);
      if (newBody === null) return;
      const res = await ctx.api(`/api/announcements/${item.id}`, {
        method: 'PATCH',
        body: { title: newTitle, body: newBody },
      });
      if (!res.ok) return ctx.notify(res.data.error);
      ctx.reload();
    };
    parts.actions.append(editBtn);
  });
}

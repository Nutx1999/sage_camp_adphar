// โมดูล B — ค้นหาประกาศ  ·  branch: feature/search
// หน้าเว็บของฟีเจอร์ — ดูเครื่องมือที่ใช้ได้ใน ctx ที่หัวไฟล์ public/app.js

export function init(ctx) {
  let keyword = '';

  const input = document.createElement('input');
  input.type = 'search';
  input.placeholder = 'ค้นหาประกาศ...';
  input.setAttribute('aria-label', 'ค้นหาประกาศ');

  // กรองทันทีที่พิมพ์ — ลบคำค้นจนว่างจะแสดงทุกรายการ
  ctx.addFilter((item) => {
    if (!keyword) return true;
    return (
      String(item.title ?? '').toLowerCase().includes(keyword) ||
      String(item.body ?? '').toLowerCase().includes(keyword)
    );
  });

  input.addEventListener('input', () => {
    keyword = input.value.trim().toLowerCase();
    ctx.render();
  });

  ctx.toolbar.append(input);
}

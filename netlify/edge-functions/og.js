// Đặt tên bài thi vào bản xem trước khi chia sẻ link (Zalo, Messenger...).
// Link dạng: https://trang-cua-ban/?t=Ten%20bai#e=...  (phần sau # trình duyệt không gửi lên máy chủ nên tên phải nằm ở ?t=)
export default async (request, context) => {
  const res = await context.next();
  const t = new URL(request.url).searchParams.get('t');
  if (!t || !(res.headers.get('content-type') || '').includes('text/html')) return res;
  const title = t.slice(0, 150).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const html = (await res.text())
    .replace(/<title>.*?<\/title>/, () => `<title>${title}</title>`)
    .replace(/(<meta property="og:title" content=")[^"]*"/, (_, a) => `${a}${title}"`)
    .replace(/(<meta property="og:description" content=")[^"]*"/, (_, a) => `${a}${title}"`);
  return new Response(html, { headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-cache' } });
};
export const config = { path: ['/', '/index.html'] };

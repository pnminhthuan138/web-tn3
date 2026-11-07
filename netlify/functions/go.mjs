// GET /ten-bai-ab12  → chuyển tới trang làm bài (kèm tên đề để hiện khi chia sẻ)
import { getStore } from '@netlify/blobs';
export default async (req, ctx) => {
  const d = await getStore('exams').get(ctx.params.id, { type: 'json' });
  return d
    ? Response.redirect(new URL(`/?t=${encodeURIComponent(d.n)}&k=${ctx.params.id}`, req.url), 302)
    : new Response('Không tìm thấy bài thi', { status: 404 });
};
export const config = { path: '/:id', preferStatic: true };

// POST /api/save  → lưu đề, trả về {id} dạng "ten-bai-ab12"
import { getStore } from '@netlify/blobs';
const slug = s => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[đĐ]/g, 'd').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40);
export default async (req) => {
  let d; try { d = await req.json(); } catch { return new Response('bad', { status: 400 }); }
  const q = (Array.isArray(d.q) ? d.q.slice(0, 300) : [])
    .filter(x => x && typeof x.q === 'string' && Array.isArray(x.o) && x.o.length > 1 && x.o.length < 10)
    .map(x => ({ q: x.q.slice(0, 2000), o: x.o.map(o => String(o).slice(0, 1000)), a: Number.isInteger(x.a) ? x.a : -1 }));
  if (!q.length) return new Response('bad', { status: 400 });
  const store = getStore('exams'), base = slug(String(d.n || '')) || 'de';
  let id; do { id = base + '-' + Math.random().toString(36).slice(2, 6); } while (await store.get(id));
  await store.setJSON(id, { n: String(d.n || 'Đề trắc nghiệm').slice(0, 200), c: String(d.c || '').slice(0, 12), q });
  return Response.json({ id });
};
export const config = { path: '/api/save', method: 'POST' };

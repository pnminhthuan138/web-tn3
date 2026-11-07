// GET /api/get?id=...  → trả về nội dung đề
import { getStore } from '@netlify/blobs';
export default async (req) => {
  const id = new URL(req.url).searchParams.get('id');
  const d = id && await getStore('exams').get(id, { type: 'json' });
  return d ? Response.json(d) : new Response('not found', { status: 404 });
};
export const config = { path: '/api/get' };

import { timingSafeEqual } from 'node:crypto';

export type RVRecord = { id?: string; kind: string; key?: string; payload: Record<string, unknown>; created_at?: string };

export function isOwnerAuthorized(request: Request): boolean {
  const expected = process.env.INTEGRATION_API_TOKEN || '';
  const supplied = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '') || '';
  if (!expected || !supplied) return false;
  const a = Buffer.from(expected); const b = Buffer.from(supplied);
  return a.length === b.length && timingSafeEqual(a, b);
}

function supabaseConfig() {
  const url = (process.env.SUPABASE_URL || '').replace(/\/$/, '');
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  if (!url || !key) throw new Error('Database belum dikonfigurasi: set SUPABASE_URL dan SUPABASE_SERVICE_ROLE_KEY.');
  if (!/^https:\/\//i.test(url)) throw new Error('SUPABASE_URL harus menggunakan HTTPS.');
  return { url, key };
}

export async function dbRequest(path: string, init: RequestInit = {}) {
  const { url, key } = supabaseConfig();
  const response = await fetch(`${url}/rest/v1/${path}`, {
    ...init,
    cache: 'no-store',
    headers: {
      apikey: key,
      authorization: `Bearer ${key}`,
      'content-type': 'application/json',
      ...(init.headers || {}),
    },
  });
  const bodyText = await response.text();
  let body: unknown = null;
  try { body = bodyText ? JSON.parse(bodyText) : null; } catch { body = bodyText; }
  if (!response.ok) throw new Error(`Database request failed (${response.status}).`);
  return body;
}

export async function writeRecord(record: RVRecord) {
  return dbRequest('rv_records', {
    method: 'POST',
    headers: { Prefer: 'return=representation' },
    body: JSON.stringify({ kind: record.kind, key: record.key || null, payload: record.payload }),
  });
}

export async function listRecords(kind: string, limit = 5000) {
  const safeKind = encodeURIComponent(kind);
  const result = await dbRequest(`rv_records?select=id,kind,key,payload,created_at&kind=eq.${safeKind}&order=created_at.desc&limit=${Math.max(1, Math.min(10000, limit))}`);
  return Array.isArray(result) ? result as RVRecord[] : [];
}

export function money(value: unknown): number {
  const n = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(n) && n >= 0 ? Math.round(n) : 0;
}

export async function findEvent(eventId: string) {
  const safeId = encodeURIComponent(eventId);
  const result = await dbRequest(`rv_records?select=id,kind,key,payload,created_at&payload->>eventId=eq.${safeId}&limit=1`);
  return Array.isArray(result) ? result[0] || null : null;
}

import { timingSafeEqual } from 'node:crypto';
import { z } from 'zod';
import { jsonError, jsonOk } from '@/lib/http';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const IntegrationEvent = z.object({
  source: z.string().trim().min(1).max(80),
  event: z.string().trim().min(1).max(120),
  eventId: z.string().trim().min(8).max(160),
  occurredAt: z.string().datetime().optional(),
  data: z.record(z.string(), z.unknown()).default({}),
}).strict();

function authorized(request: Request): boolean {
  const expected = process.env.INTEGRATION_API_TOKEN;
  const supplied = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '') ?? '';
  if (!expected || !supplied) return false;
  const a = Buffer.from(expected);
  const b = Buffer.from(supplied);
  return a.length === b.length && timingSafeEqual(a, b);
}

// This endpoint validates a future webhook contract. It intentionally does not execute commands,
// relay messages, or persist events until authentication, storage, idempotency and permissions are configured.
export async function POST(request: Request) {
  if (!process.env.INTEGRATION_API_TOKEN) {
    return jsonError('INTEGRATION_NOT_CONFIGURED', 'Server integration token has not been configured.', 503);
  }
  if (!authorized(request)) return jsonError('UNAUTHORIZED', 'A valid bearer token is required.', 401);

  let body: unknown;
  try { body = await request.json(); } catch { return jsonError('INVALID_JSON', 'Request body must be valid JSON.', 400); }
  const parsed = IntegrationEvent.safeParse(body);
  if (!parsed.success) return jsonError('INVALID_PAYLOAD', 'Payload does not match the integration event schema.', 422);

  // Safe scaffold: acknowledge validated envelope only. Add a queue/database adapter before production use.
  return jsonOk({ accepted: false, mode: 'validation-only', eventId: parsed.data.eventId, message: 'Payload valid; event delivery is not enabled yet.' }, { status: 202 });
}

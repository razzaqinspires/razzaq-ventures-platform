import { z } from 'zod';
import { jsonError, jsonOk } from '@/lib/http';
import { findEvent, isOwnerAuthorized, writeRecord } from '@/lib/rv-store';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
const EventSchema = z.object({ source: z.string().trim().min(1).max(80), event: z.enum(['content.update','sale.record','expense.record','product.update','team.update','audit.note']), eventId: z.string().trim().min(8).max(160), occurredAt: z.string().datetime().optional(), data: z.record(z.string(), z.unknown()).default({}) }).strict();
const contentKeys = new Set(['heroTitle','heroIntro','ceoName','ceoTitle','announcement','accentColor','showAnnouncement']);
const str = (v: unknown, max = 1000) => typeof v === 'string' && v.trim().length > 0 && v.trim().length <= max;
const num = (v: unknown) => typeof v === 'number' && Number.isFinite(v) && v >= 0;

export async function POST(request: Request) {
  if (!process.env.INTEGRATION_API_TOKEN) return jsonError('INTEGRATION_NOT_CONFIGURED','Server integration token has not been configured.',503);
  if (!isOwnerAuthorized(request)) return jsonError('UNAUTHORIZED','A valid bearer token is required.',401);
  let raw: unknown;
  try { raw = await request.json(); } catch { return jsonError('INVALID_JSON','Request body must be valid JSON.',400); }
  const parsed = EventSchema.safeParse(raw);
  if (!parsed.success) return jsonError('INVALID_PAYLOAD','Event or payload does not match the allowed schema.',422);
  const { event, data, eventId, source } = parsed.data;
  let kind: 'content'|'sale'|'expense'|'product'|'team'|'audit'; let key: string | undefined; let payload: Record<string, unknown> = { ...data };
  if (event === 'content.update') {
    if (typeof data.key !== 'string' || !contentKeys.has(data.key)) return jsonError('INVALID_CONTENT_KEY','Content key is not editable through this API.',422);
    if (data.key === 'accentColor' && !(typeof data.value === 'string' && /^#[0-9a-fA-F]{6}$/.test(data.value))) return jsonError('INVALID_VALUE','accentColor must be a six-digit hex color.',422);
    if (data.key === 'showAnnouncement' && typeof data.value !== 'boolean') return jsonError('INVALID_VALUE','showAnnouncement must be boolean.',422);
    if (data.key !== 'accentColor' && data.key !== 'showAnnouncement' && !str(data.value, 600)) return jsonError('INVALID_VALUE','Content value must be a non-empty string up to 600 characters.',422);
    kind = 'content'; key = data.key; payload = { value: data.value };
  } else if (event === 'sale.record') {
    if (!str(data.product,160) || !num(data.quantity) || data.quantity <= 0 || !Number.isInteger(data.quantity) || !num(data.unitPrice) || !num(data.unitCost)) return jsonError('INVALID_SALE','Required: product string, positive integer quantity, unitPrice and unitCost >= 0.',422);
    if (data.currency !== undefined && data.currency !== 'IDR') return jsonError('INVALID_CURRENCY','Only IDR is currently supported.',422);
    kind = 'sale'; payload = { product: data.product.trim(), quantity: data.quantity, unitPrice: data.unitPrice, unitCost: data.unitCost, currency: 'IDR', channel: str(data.channel,80) ? data.channel : 'unspecified', reference: str(data.reference,120) ? data.reference : null, occurredAt: parsed.data.occurredAt || new Date().toISOString() };
  } else if (event === 'expense.record') {
    if (!str(data.category,100) || !str(data.description,240) || !num(data.amount) || data.amount <= 0) return jsonError('INVALID_EXPENSE','Required: category, description and amount > 0.',422);
    kind = 'expense'; payload = { category: data.category.trim(), description: data.description.trim(), amount: data.amount, currency: 'IDR', occurredAt: parsed.data.occurredAt || new Date().toISOString(), reference: str(data.reference,120) ? data.reference : null };
  } else if (event === 'product.update') {
    if (!str(data.sku,100) || !str(data.name,160)) return jsonError('INVALID_PRODUCT','Required: sku and name.',422);
    if (data.stock !== undefined && (!num(data.stock) || !Number.isInteger(data.stock))) return jsonError('INVALID_STOCK','Stock must be a non-negative integer.',422);
    if (data.price !== undefined && !num(data.price)) return jsonError('INVALID_PRICE','Price must be non-negative.',422);
    kind = 'product'; key = String(data.sku); payload = { sku: data.sku, name: data.name, ...(data.stock === undefined ? {} : {stock:data.stock}), ...(data.price === undefined ? {} : {price:data.price}), ...(str(data.status,40) ? {status:data.status} : {}), public: data.public === true };
  } else if (event === 'team.update') {
    if (!str(data.memberId,100) || !str(data.name,160) || !str(data.role,120)) return jsonError('INVALID_TEAM_MEMBER','Required: memberId, name, role.',422);
    kind = 'team'; key = String(data.memberId); payload = { memberId: data.memberId, name: data.name, role: data.role, public: data.public === true };
  } else {
    if (!str(data.message,1000)) return jsonError('INVALID_AUDIT_NOTE','message is required.',422);
    kind = 'audit'; payload = { message: data.message };
  }
  try {
    const existing = await findEvent(eventId);
    if (existing) return jsonOk({ accepted: true, duplicate: true, mode: 'persisted', eventId, message: 'Event already processed; duplicate ignored.' }, { status: 200 });
    await writeRecord({ kind, key, payload: { ...payload, eventId, source, actor: 'integration-token' } });
    return jsonOk({ accepted: true, mode: 'persisted', eventId, event, message: 'Event stored successfully.' }, { status: 201 });
  } catch (error) { return jsonError('PERSISTENCE_FAILED', error instanceof Error ? error.message : 'Unable to persist event.',503); }
}

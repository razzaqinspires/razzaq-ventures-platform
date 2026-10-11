import { jsonError, jsonOk } from '@/lib/http';
import { listRecords } from '@/lib/rv-store';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Only a small allowlist is public. Finance, team private data and audit records never leave this endpoint.
const PUBLIC_KEYS = new Set(['heroTitle', 'heroIntro', 'ceoName', 'ceoTitle', 'announcement', 'accentColor', 'showAnnouncement']);

export async function GET() {
  try {
    const [rows, productRows] = await Promise.all([listRecords('content', 300), listRecords('product', 500)]);
    const content: Record<string, unknown> = {};
    for (const row of rows) if (row.key && PUBLIC_KEYS.has(row.key) && !(row.key in content)) content[row.key] = row.payload.value;
    const latestProducts = new Map<string, Record<string, unknown>>();
    for (const row of [...productRows].reverse()) {
      const sku = typeof row.payload.sku === 'string' ? row.payload.sku : row.key;
      if (sku && row.payload.public === true) latestProducts.set(sku, { sku, name: row.payload.name, stock: row.payload.stock, price: row.payload.price, status: row.payload.status });
    }
    return jsonOk({ content, products: [...latestProducts.values()], updatedAt: rows[0]?.created_at || productRows[0]?.created_at || null });
  } catch {
    // Static website remains available during initial DB setup or temporary database outage.
    return jsonOk({ content: {}, updatedAt: null, mode: 'static-fallback' });
  }
}

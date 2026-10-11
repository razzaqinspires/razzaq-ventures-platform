import { jsonOk } from '@/lib/http';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export function GET() {
  return jsonOk({ service: 'razzaq-ventures-platform', status: 'healthy', apiVersion: 'v1', timestamp: new Date().toISOString() });
}

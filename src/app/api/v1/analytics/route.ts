import { jsonError, jsonOk } from '@/lib/http';
import { isOwnerAuthorized, listRecords, money } from '@/lib/rv-store';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  if (!process.env.INTEGRATION_API_TOKEN) return jsonError('INTEGRATION_NOT_CONFIGURED', 'Integration token is not configured.', 503);
  if (!isOwnerAuthorized(request)) return jsonError('UNAUTHORIZED', 'A valid bearer token is required.', 401);
  try {
    const [sales, expenses] = await Promise.all([listRecords('sale', 10000), listRecords('expense', 10000)]);
    const totalUnits = sales.reduce((sum, r) => sum + money(r.payload.quantity), 0);
    const revenue = sales.reduce((sum, r) => sum + money(r.payload.quantity) * money(r.payload.unitPrice), 0);
    const cogs = sales.reduce((sum, r) => sum + money(r.payload.quantity) * money(r.payload.unitCost), 0);
    const expenseTotal = expenses.reduce((sum, r) => sum + money(r.payload.amount), 0);
    return jsonOk({
      generatedAt: new Date().toISOString(),
      sales: { transactions: sales.length, unitsSold: totalUnits, grossRevenue: revenue, recordedCostOfGoods: cogs },
      expenses: { entries: expenses.length, total: expenseTotal },
      estimate: { grossProfitBeforeOperatingExpenses: revenue - cogs, estimatedNetBeforeTax: revenue - cogs - expenseTotal },
      note: 'Angka hanya mencakup transaksi yang dicatat melalui bot/API. Ini bukan laporan pajak atau akuntansi resmi; masukkan retur, diskon, biaya marketplace, pajak, dan saldo awal secara terpisah untuk laporan lengkap.'
    });
  } catch (error) {
    return jsonError('ANALYTICS_UNAVAILABLE', error instanceof Error ? error.message : 'Analytics unavailable.', 503);
  }
}

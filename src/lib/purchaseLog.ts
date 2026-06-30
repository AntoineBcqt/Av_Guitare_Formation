export interface PurchaseLogEntry {
  id: string;
  studentName: string;
  studentEmail: string;
  packId: string;
  packTitle: string;
  price: number;
  date: string;
}

const KEY = 'av_purchase_log';

export function logPurchase(entry: Omit<PurchaseLogEntry, 'id' | 'date'>): void {
  const log = getPurchaseLog();
  log.unshift({ ...entry, id: `pl-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, date: new Date().toISOString() });
  localStorage.setItem(KEY, JSON.stringify(log.slice(0, 200)));
}

export function getPurchaseLog(): PurchaseLogEntry[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '[]') as PurchaseLogEntry[];
  } catch {
    return [];
  }
}

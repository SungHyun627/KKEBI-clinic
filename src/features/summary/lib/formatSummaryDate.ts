export function formatSummaryDate(iso?: string): string {
  const fallbackDate = new Date();
  const date = iso ? new Date(iso) : fallbackDate;
  const safeDate = Number.isNaN(date.getTime()) ? fallbackDate : date;

  const yyyy = String(safeDate.getFullYear());
  const mm = String(safeDate.getMonth() + 1).padStart(2, '0');
  const dd = String(safeDate.getDate()).padStart(2, '0');
  return `${yyyy}.${mm}.${dd}`;
}

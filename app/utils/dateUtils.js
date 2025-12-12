// Date utilities

/**
 * Return today's date as YYYY-MM-DD (no time component)
 */
export function getTodayISO() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

/**
 * Add days to a date string and return a full ISO timestamp (toISOString())
 * Accepts either YYYY-MM-DD or any value accepted by Date constructor.
 */
export function addDays(dateString, days) {
  const base = dateString ? new Date(dateString) : new Date();
  const next = new Date(base.getTime());
  next.setDate(next.getDate() + Number(days));
  return next.toISOString();
}

export default {
  getTodayISO,
  addDays,
};

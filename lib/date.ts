/** YYYY-MM-DD for `offsetDays` before today (0 = today). */
export function isoDate(offsetDays: number) {
  const date = new Date()
  date.setDate(date.getDate() - offsetDays)
  return date.toISOString().slice(0, 10)
}

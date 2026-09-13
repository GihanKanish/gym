// day_of_week: 0=Sunday .. 6=Saturday (matches JS Date#getDay())

export function toISODate(d) {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Next date (today or later) that falls on the given day_of_week.
export function nextDateForDay(dayOfWeek) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = (dayOfWeek - today.getDay() + 7) % 7;
  const result = new Date(today);
  result.setDate(today.getDate() + diff);
  return toISODate(result);
}

// Returns the 7 ISO dates (Sun..Sat) for the week containing weekStartOffset*7 days from today.
export function weekDates(weekOffset = 0) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const sunday = new Date(today);
  sunday.setDate(today.getDate() - today.getDay() + weekOffset * 7);
  const dates = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(sunday);
    d.setDate(sunday.getDate() + i);
    dates.push(toISODate(d));
  }
  return dates;
}

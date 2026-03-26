export const getDayOfWeek = (date: Date | string): string => {
  const formattedDate = typeof date === 'string' ? new Date(date) : date;
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const result = daysOfWeek[formattedDate.getUTCDay()] || 'Invalid date';
  return result;
}
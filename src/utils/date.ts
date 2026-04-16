import dayjs from "dayjs";
import weekOfYear from "dayjs/plugin/weekOfYear.js";
import isoWeek from "dayjs/plugin/isoWeek.js";

dayjs.extend(weekOfYear);
dayjs.extend(isoWeek);

export function today(): string {
  return dayjs().format("YYYY-MM-DD");
}

export function currentYearMonth(): string {
  return dayjs().format("YYYY-MM");
}

export function formatDate(date: string): string {
  return dayjs(date).format("ddd, MMM D YYYY");
}

export function getYearMonthFromDate(date: string): string {
  return dayjs(date).format("YYYY-MM");
}

export function getDayOfWeek(date: string): string {
  return dayjs(date).format("dddd");
}

export function getStartOfWeek(): string {
  return dayjs().startOf("isoWeek").format("YYYY-MM-DD");
}

export function getEndOfWeek(): string {
  return dayjs().endOf("isoWeek").format("YYYY-MM-DD");
}

export function isValidDate(date: string): boolean {
  return dayjs(date, "YYYY-MM-DD", true).isValid();
}

export function daysAgo(n: number): string {
  return dayjs().subtract(n, "day").format("YYYY-MM-DD");
}

export function parseYearMonth(input: string): string | null {
  const d = dayjs(input, "YYYY-MM", true);
  return d.isValid() ? d.format("YYYY-MM") : null;
}

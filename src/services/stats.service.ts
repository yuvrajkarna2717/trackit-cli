import { getAllLogs, getLogsBetween, type LogEntry } from "./log.service.js";
import { today, getDayOfWeek, daysAgo } from "../utils/date.js";

export interface StatsResult {
  totalDays: number;
  currentStreak: number;
  longestStreak: number;
  totals: Record<string, number>;
  averages: Record<string, number>;
}

export interface WeeklyReview {
  totalDays: number;
  bestDay: { date: string; day: string; score: number } | null;
  totals: Record<string, number>;
  weakArea: string | null;
  strongArea: string | null;
}

function getNumericTotals(logs: LogEntry[]): Record<string, number> {
  const totals: Record<string, number> = {};
  for (const log of logs) {
    for (const [key, val] of Object.entries(log.entries)) {
      if (typeof val === "number") {
        totals[key] = (totals[key] ?? 0) + val;
      }
    }
  }
  return totals;
}

function calculateStreak(logs: LogEntry[]): { current: number; longest: number } {
  if (logs.length === 0) return { current: 0, longest: 0 };

  const dates = new Set(logs.map((l) => l.date));
  let current = 0;
  let longest = 0;
  let streak = 0;

  // Walk backwards from today
  const todayStr = today();
  let checkDate = todayStr;

  // Check if today or yesterday has a log to start the streak
  if (!dates.has(todayStr)) {
    const yesterday = daysAgo(1);
    if (!dates.has(yesterday)) {
      // No recent logs, streak is 0
      // Still calculate longest
      current = 0;
    } else {
      checkDate = yesterday;
    }
  }

  if (dates.has(checkDate) || dates.has(todayStr)) {
    let d = dates.has(todayStr) ? todayStr : daysAgo(1);
    while (dates.has(d)) {
      current++;
      const prev = new Date(d);
      prev.setDate(prev.getDate() - 1);
      d = prev.toISOString().split("T")[0];
    }
  }

  // Calculate longest streak from all dates
  const sortedDates = [...dates].sort();
  streak = 1;
  longest = 1;
  for (let i = 1; i < sortedDates.length; i++) {
    const prev = new Date(sortedDates[i - 1]);
    const curr = new Date(sortedDates[i]);
    const diffDays = (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24);
    if (diffDays === 1) {
      streak++;
      longest = Math.max(longest, streak);
    } else {
      streak = 1;
    }
  }

  if (sortedDates.length === 1) longest = 1;

  return { current, longest: Math.max(longest, current) };
}

export async function getStats(): Promise<StatsResult> {
  const logs = await getAllLogs();
  const totals = getNumericTotals(logs);
  const { current, longest } = calculateStreak(logs);

  const averages: Record<string, number> = {};
  if (logs.length > 0) {
    for (const [key, total] of Object.entries(totals)) {
      averages[key] = Math.round((total / logs.length) * 10) / 10;
    }
  }

  return {
    totalDays: logs.length,
    currentStreak: current,
    longestStreak: longest,
    totals,
    averages,
  };
}

export async function getWeeklyReview(start: string, end: string): Promise<WeeklyReview> {
  const logs = await getLogsBetween(start, end);
  const totals = getNumericTotals(logs);

  let bestDay: WeeklyReview["bestDay"] = null;
  let maxScore = 0;

  for (const log of logs) {
    let score = 0;
    for (const val of Object.values(log.entries)) {
      if (typeof val === "number") score += val;
    }
    if (score > maxScore) {
      maxScore = score;
      bestDay = { date: log.date, day: getDayOfWeek(log.date), score };
    }
  }

  // Find weak/strong areas
  const numericKeys = Object.keys(totals);
  let weakArea: string | null = null;
  let strongArea: string | null = null;

  if (numericKeys.length > 0) {
    let minVal = Infinity;
    let maxVal = -Infinity;
    for (const [key, val] of Object.entries(totals)) {
      if (val < minVal) { minVal = val; weakArea = key; }
      if (val > maxVal) { maxVal = val; strongArea = key; }
    }
  }

  return {
    totalDays: logs.length,
    bestDay,
    totals,
    weakArea,
    strongArea,
  };
}

export function getChartData(logs: LogEntry[], taskName: string): { labels: string[]; values: number[] } {
  const labels: string[] = [];
  const values: number[] = [];
  for (const log of logs) {
    const val = log.entries[taskName];
    if (typeof val === "number") {
      labels.push(log.date.slice(5)); // MM-DD
      values.push(val);
    }
  }
  return { labels, values };
}

import fs from "fs-extra";
import { getLogFilePath, getLogsDir } from "../utils/paths.js";
import { getYearMonthFromDate, today } from "../utils/date.js";

export interface LogEntry {
  date: string;
  entries: Record<string, string | number>;
}

export interface MonthLog {
  month: string;
  logs: LogEntry[];
}

async function readMonthLog(yearMonth: string): Promise<MonthLog> {
  const filePath = getLogFilePath(yearMonth);
  if (await fs.pathExists(filePath)) {
    return fs.readJSON(filePath);
  }
  return { month: yearMonth, logs: [] };
}

async function writeMonthLog(monthLog: MonthLog): Promise<void> {
  const filePath = getLogFilePath(monthLog.month);
  await fs.ensureDir(getLogsDir());
  await fs.writeJSON(filePath, monthLog, { spaces: 2 });
}

export async function saveLog(date: string, entries: Record<string, string | number>): Promise<void> {
  const yearMonth = getYearMonthFromDate(date);
  const monthLog = await readMonthLog(yearMonth);

  const existingIdx = monthLog.logs.findIndex((l) => l.date === date);
  if (existingIdx >= 0) {
    monthLog.logs[existingIdx] = { date, entries };
  } else {
    monthLog.logs.push({ date, entries });
    monthLog.logs.sort((a, b) => a.date.localeCompare(b.date));
  }

  await writeMonthLog(monthLog);
}

export async function getTodayLog(): Promise<LogEntry | null> {
  return getLogByDate(today());
}

export async function getLogByDate(date: string): Promise<LogEntry | null> {
  const yearMonth = getYearMonthFromDate(date);
  const monthLog = await readMonthLog(yearMonth);
  return monthLog.logs.find((l) => l.date === date) ?? null;
}

export async function getMonthLogs(yearMonth: string): Promise<LogEntry[]> {
  const monthLog = await readMonthLog(yearMonth);
  return monthLog.logs;
}

export async function getAllLogs(): Promise<LogEntry[]> {
  const logsDir = getLogsDir();
  if (!(await fs.pathExists(logsDir))) return [];

  const files = await fs.readdir(logsDir);
  const jsonFiles = files.filter((f) => f.endsWith(".json")).sort();

  const allLogs: LogEntry[] = [];
  for (const file of jsonFiles) {
    const monthLog: MonthLog = await fs.readJSON(
      `${logsDir}/${file}`
    );
    allLogs.push(...monthLog.logs);
  }
  return allLogs.sort((a, b) => a.date.localeCompare(b.date));
}

export async function hasLogForDate(date: string): Promise<boolean> {
  const log = await getLogByDate(date);
  return log !== null;
}

export async function getLogsBetween(start: string, end: string): Promise<LogEntry[]> {
  const allLogs = await getAllLogs();
  return allLogs.filter((l) => l.date >= start && l.date <= end);
}

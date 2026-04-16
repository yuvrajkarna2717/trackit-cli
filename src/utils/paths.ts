import path from "path";
import os from "os";

export const TRACKIT_DIR = ".trackit";
export const CONFIG_FILE = "config.json";
export const LOGS_DIR = "logs";
export const REMINDERS_FILE = "reminders.json";

export function getTrackitDir(): string {
  return path.resolve(process.cwd(), TRACKIT_DIR);
}

export function getConfigPath(): string {
  return path.join(getTrackitDir(), CONFIG_FILE);
}

export function getLogsDir(): string {
  return path.join(getTrackitDir(), LOGS_DIR);
}

export function getLogFilePath(yearMonth: string): string {
  return path.join(getLogsDir(), `${yearMonth}.json`);
}

export function getRemindersPath(): string {
  return path.join(getTrackitDir(), REMINDERS_FILE);
}

export function getExportDir(): string {
  return path.join(process.cwd(), "trackit-exports");
}

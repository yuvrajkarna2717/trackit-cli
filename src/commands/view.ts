import { Command } from "commander";
import { getTodayLog, getLogByDate, getMonthLogs } from "../services/log.service.js";
import { today, formatDate, currentYearMonth, parseYearMonth, isValidDate } from "../utils/date.js";
import { error } from "../utils/helpers.js";
import { getActiveTheme } from "../ui/theme.service.js";
import { renderHeading, createTable, renderError } from "../ui/renderer.js";

async function renderLog(date: string, entries: Record<string, string | number>): Promise<void> {
  const t = await getActiveTheme();
  renderHeading(t, `${t.icons.log} Log for ${formatDate(date)}`);
  const table = createTable(t, ["Task", "Value"]);
  for (const [key, val] of Object.entries(entries)) {
    table.push([key, t.colors.value(String(val))]);
  }
  console.log(table.toString());
  console.log("");
}

async function renderMonthLogs(yearMonth: string, logs: { date: string; entries: Record<string, string | number> }[]): Promise<void> {
  const t = await getActiveTheme();

  if (logs.length === 0) {
    renderError(t, `No logs found for ${yearMonth}.`);
    return;
  }

  const allTasks = new Set<string>();
  for (const log of logs) {
    for (const key of Object.keys(log.entries)) {
      allTasks.add(key);
    }
  }

  const tasks = [...allTasks];
  renderHeading(t, `${t.icons.calendar} Monthly View — ${yearMonth}`);

  const table = createTable(t, ["Date", ...tasks]);

  for (const log of logs) {
    table.push([
      t.colors.muted(log.date.slice(5)),
      ...tasks.map((tk) => t.colors.value(String(log.entries[tk] ?? "—"))),
    ]);
  }

  console.log(table.toString());
  console.log(t.colors.muted(`\n  ${logs.length} log(s) this month.\n`));
}

export function registerViewCommand(program: Command): void {
  program
    .command("view")
    .description("View logs (today, <date>, month, month <YYYY-MM>)")
    .argument("[filter]", 'Use "today", a date (YYYY-MM-DD), or "month"')
    .argument("[param]", "Optional month (YYYY-MM)")
    .action(async (filter?: string, param?: string) => {
      try {
        if (!filter || filter === "today") {
          const log = await getTodayLog();
          if (!log) {
            await error(`No log for today (${today()}). Run \`trackit log\` first.`);
            return;
          }
          await renderLog(log.date, log.entries);
          return;
        }

        if (filter === "month") {
          const ym = param ? parseYearMonth(param) : currentYearMonth();
          if (!ym) {
            await error("Invalid month format. Use YYYY-MM.");
            return;
          }
          const logs = await getMonthLogs(ym);
          await renderMonthLogs(ym, logs);
          return;
        }

        if (isValidDate(filter)) {
          const log = await getLogByDate(filter);
          if (!log) {
            await error(`No log for ${filter}.`);
            return;
          }
          await renderLog(log.date, log.entries);
          return;
        }

        await error('Invalid filter. Use "today", "month", or a date (YYYY-MM-DD).');
      } catch (e: any) {
        await error(e.message);
      }
    });
}

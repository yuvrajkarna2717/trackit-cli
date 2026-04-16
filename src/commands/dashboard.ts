import { Command } from "commander";
import asciichart from "asciichart";
import { readConfig } from "../services/config.service.js";
import { getAllLogs } from "../services/log.service.js";
import { getStats, getChartData } from "../services/stats.service.js";
import { error } from "../utils/helpers.js";
import { getActiveTheme } from "../ui/theme.service.js";
import {
  renderDashboardHeader, renderMetric, renderSectionTitle,
  createTable, renderProgressBar, renderActivityRow, renderFooter,
  renderError,
} from "../ui/renderer.js";

export function registerDashboardCommand(program: Command): void {
  program
    .command("dashboard")
    .alias("dash")
    .description("[v2] Full markdown-style dashboard in terminal")
    .action(async () => {
      try {
        const t = await getActiveTheme();
        const config = await readConfig();
        const stats = await getStats();
        const logs = await getAllLogs();

        if (stats.totalDays === 0) {
          renderError(t, "No logs yet. Run `trackit log` first.");
          return;
        }

        // Header
        renderDashboardHeader(t, config.projectName);

        // Streak section
        console.log("");
        renderMetric(t, t.icons.fire, "Current Streak", `${stats.currentStreak} days`);
        renderMetric(t, t.icons.trophy, "Longest Streak", `${stats.longestStreak} days`);
        renderMetric(t, t.icons.calendar, "Total Logged", `${stats.totalDays} days`);

        // Totals & averages table
        renderSectionTitle(t, `  ${t.icons.chart} Performance Summary`);

        const table = createTable(t, ["Task", "Total", "Avg", "Progress"], [22, 10, 10, 20]);

        const maxTotal = Math.max(...Object.values(stats.totals), 1);

        for (const task of config.tasks) {
          const total = stats.totals[task] ?? 0;
          const avg = stats.averages[task] ?? 0;
          const bar = renderProgressBar(t, total, maxTotal);
          table.push([task, t.colors.value(String(total)), t.colors.label(String(avg)), bar]);
        }

        console.log(table.toString());

        // Mini charts for top 2 numeric tasks
        const numericTasks = config.tasks.filter((tk) => stats.totals[tk] !== undefined);
        const topTasks = numericTasks.slice(0, 2);

        for (const task of topTasks) {
          const data = getChartData(logs.slice(-14), task);
          if (data.values.length >= 2) {
            renderSectionTitle(t, `  ${t.icons.chart} ${task} (last ${data.values.length} days)`);
            console.log(
              asciichart.plot(data.values, {
                height: t.chrome.chartHeight,
                colors: [t.chrome.chartColor],
                padding: "       ",
              })
            );
          }
        }

        // Recent activity
        renderSectionTitle(t, `  ${t.icons.log} Recent Activity`);

        const recentLogs = logs.slice(-5).reverse();
        for (const log of recentLogs) {
          const numericEntries = Object.entries(log.entries)
            .filter(([, v]) => typeof v === "number")
            .map(([k, v]) => `${k}: ${v}`)
            .join(", ");
          renderActivityRow(t, log.date, numericEntries || t.colors.muted("(text entries)"));
        }

        renderFooter(t);
      } catch (e: any) {
        await error(e.message);
      }
    });
}

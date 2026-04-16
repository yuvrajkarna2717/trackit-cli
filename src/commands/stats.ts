import { Command } from "commander";
import asciichart from "asciichart";
import { getStats, getChartData } from "../services/stats.service.js";
import { getAllLogs } from "../services/log.service.js";
import { readConfig } from "../services/config.service.js";
import { error } from "../utils/helpers.js";
import { getActiveTheme } from "../ui/theme.service.js";
import {
  renderHeading, renderMetric, createTable,
  renderError,
} from "../ui/renderer.js";

export function registerStatsCommand(program: Command): void {
  program
    .command("stats")
    .description("View overall stats and productivity metrics")
    .option("-c, --chart <task>", "Show ASCII chart for a specific task")
    .action(async (opts) => {
      try {
        const t = await getActiveTheme();
        const stats = await getStats();

        if (stats.totalDays === 0) {
          renderError(t, "No logs yet. Run `trackit log` to start tracking.");
          return;
        }

        // Chart mode (v2 feature)
        if (opts.chart) {
          const logs = await getAllLogs();
          const data = getChartData(logs, opts.chart);
          if (data.values.length === 0) {
            renderError(t, `No numeric data found for "${opts.chart}".`);
            return;
          }
          renderHeading(t, `${t.icons.chart} Chart — ${opts.chart}`);
          console.log(
            asciichart.plot(data.values, {
              height: t.chrome.chartHeight + 2,
              colors: [t.chrome.chartColor],
              padding: "     ",
            })
          );
          console.log(t.colors.muted(`\n  ${data.values.length} data points\n`));
          return;
        }

        renderHeading(t, `${t.icons.chart} Stats Overview`);

        console.log("");
        renderMetric(t, t.icons.fire, "Current Streak", `${stats.currentStreak} days`);
        renderMetric(t, t.icons.trophy, "Longest Streak", `${stats.longestStreak} days`);
        renderMetric(t, t.icons.calendar, "Total Days Logged", String(stats.totalDays));

        console.log("");

        // Totals table
        const table = createTable(t, ["Task", "Total", "Avg/Day"]);

        const config = await readConfig();
        for (const task of config.tasks) {
          const total = stats.totals[task];
          const avg = stats.averages[task];
          if (total !== undefined) {
            table.push([task, t.colors.value(String(total)), t.colors.label(String(avg))]);
          }
        }

        console.log(table.toString());
        console.log(
          t.colors.muted(`\n  Tip: Use ${t.colors.accent("trackit stats --chart <task>")} to see a chart.\n`)
        );
      } catch (e: any) {
        await error(e.message);
      }
    });
}

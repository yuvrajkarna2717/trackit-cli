import { Command } from "commander";
import inquirer from "inquirer";
import { readConfig } from "../services/config.service.js";
import { saveLog, hasLogForDate } from "../services/log.service.js";
import { today, formatDate } from "../utils/date.js";
import { success, warn, isNumeric } from "../utils/helpers.js";
import { getActiveTheme } from "../ui/theme.service.js";
import { renderHeading } from "../ui/renderer.js";

export function registerLogCommand(program: Command): void {
  program
    .command("log")
    .description("Log your daily progress")
    .option("-d, --date <date>", "Log for a specific date (YYYY-MM-DD)")
    .action(async (opts) => {
      try {
        const t = await getActiveTheme();
        const config = await readConfig();
        const logDate = opts.date || today();

        renderHeading(t, `${t.icons.log} Daily Log — ${formatDate(logDate)}`);
        console.log("");

        if (await hasLogForDate(logDate)) {
          await warn(`Log for ${logDate} already exists.`);
          const { overwrite } = await inquirer.prompt([
            {
              type: "confirm",
              name: "overwrite",
              message: "Overwrite existing log?",
              default: false,
            },
          ]);
          if (!overwrite) return;
        }

        const entries: Record<string, string | number> = {};

        for (const task of config.tasks) {
          const { value } = await inquirer.prompt([
            {
              type: "input",
              name: "value",
              message: `${task}:`,
            },
          ]);

          entries[task] = isNumeric(value) ? Number(value) : value;
        }

        await saveLog(logDate, entries);

        console.log("");
        await success("Log saved!");
        console.log(t.colors.muted("  Run `trackit view today` to see it.\n"));
      } catch (e: any) {
        const t = await getActiveTheme();
        console.log(t.colors.error(`${t.icons.error} `) + e.message);
      }
    });
}

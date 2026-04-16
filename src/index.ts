import { Command } from "commander";
import { registerInitCommand } from "./commands/init.js";
import { registerTaskCommand } from "./commands/task.js";
import { registerLogCommand } from "./commands/log.js";
import { registerViewCommand } from "./commands/view.js";
import { registerStatsCommand } from "./commands/stats.js";
import { registerExportCommand } from "./commands/export.js";
import { registerReviewCommand } from "./commands/review.js";
import { registerDashboardCommand } from "./commands/dashboard.js";
import { registerReminderCommand, checkReminders } from "./commands/reminder.js";
import { registerThemeCommand } from "./commands/theme.js";

const program = new Command();

program
  .name("trackit")
  .description("🚀 TrackIt CLI — Track daily progress, tasks, and productivity")
  .version("2.0.0");

// Register all commands
registerInitCommand(program);
registerTaskCommand(program);
registerLogCommand(program);
registerViewCommand(program);
registerStatsCommand(program);
registerExportCommand(program);
registerReviewCommand(program);
registerDashboardCommand(program);
registerReminderCommand(program);
registerThemeCommand(program);

// Check reminders before any command
program.hook("preAction", async () => {
  await checkReminders();
});

program.parse();

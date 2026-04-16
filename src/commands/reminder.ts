import { Command } from "commander";
import inquirer from "inquirer";
import fs from "fs-extra";
import { getRemindersPath } from "../utils/paths.js";
import { success, error, warn } from "../utils/helpers.js";
import { getActiveTheme } from "../ui/theme.service.js";
import { createTable, renderHeading } from "../ui/renderer.js";

interface Reminder {
  id: string;
  message: string;
  time: string; // HH:mm
  days: string[]; // ["Mon","Tue",...] or ["daily"]
  enabled: boolean;
}

interface RemindersConfig {
  reminders: Reminder[];
}

async function readReminders(): Promise<RemindersConfig> {
  const p = getRemindersPath();
  if (await fs.pathExists(p)) {
    return fs.readJSON(p);
  }
  return { reminders: [] };
}

async function writeReminders(config: RemindersConfig): Promise<void> {
  await fs.writeJSON(getRemindersPath(), config, { spaces: 2 });
}

export function registerReminderCommand(program: Command): void {
  const reminder = program
    .command("reminder")
    .description("[v2] Manage daily reminders");

  reminder
    .command("add")
    .description("Add a new reminder")
    .action(async () => {
      try {
        const answers = await inquirer.prompt([
          {
            type: "input",
            name: "message",
            message: "Reminder message:",
            validate: (v: string) => v.trim().length > 0 || "Message required",
          },
          {
            type: "input",
            name: "time",
            message: "Time (HH:mm, 24h format):",
            default: "21:00",
            validate: (v: string) => /^([01]\d|2[0-3]):[0-5]\d$/.test(v) || "Use HH:mm format",
          },
          {
            type: "checkbox",
            name: "days",
            message: "Which days?",
            choices: [
              { name: "Every day", value: "daily" },
              { name: "Monday", value: "Mon" },
              { name: "Tuesday", value: "Tue" },
              { name: "Wednesday", value: "Wed" },
              { name: "Thursday", value: "Thu" },
              { name: "Friday", value: "Fri" },
              { name: "Saturday", value: "Sat" },
              { name: "Sunday", value: "Sun" },
            ],
            default: ["daily"],
          },
        ]);

        const config = await readReminders();
        const id = `rem_${Date.now()}`;
        config.reminders.push({
          id,
          message: answers.message.trim(),
          time: answers.time,
          days: answers.days.length === 0 ? ["daily"] : answers.days,
          enabled: true,
        });
        await writeReminders(config);

        await success(`Reminder added: "${answers.message}" at ${answers.time}`);
        const t2 = await getActiveTheme();
        console.log(t2.colors.muted("  Note: Reminders display when you run any trackit command.\n"));
      } catch (e: any) {
        await error(e.message);
      }
    });

  reminder
    .command("list")
    .description("List all reminders")
    .action(async () => {
      try {
        const t = await getActiveTheme();
        const config = await readReminders();
        if (config.reminders.length === 0) {
          await warn("No reminders set. Use `trackit reminder add` to create one.");
          return;
        }

        renderHeading(t, "Reminders");

        const table = createTable(t, ["#", "Message", "Time", "Days", "Status"]);

        config.reminders.forEach((r, i) => {
          const status = r.enabled ? t.colors.success("ON") : t.colors.error("OFF");
          const days = r.days.includes("daily") ? "Every day" : r.days.join(", ");
          table.push([i + 1, r.message, r.time, days, status]);
        });

        console.log(table.toString());
        console.log("");
      } catch (e: any) {
        await error(e.message);
      }
    });

  reminder
    .command("remove")
    .description("Remove a reminder by number")
    .argument("<number>", "Reminder number (from `reminder list`)")
    .action(async (num: string) => {
      try {
        const config = await readReminders();
        const idx = parseInt(num, 10) - 1;
        if (isNaN(idx) || idx < 0 || idx >= config.reminders.length) {
          await error("Invalid reminder number.");
          return;
        }
        const removed = config.reminders.splice(idx, 1)[0];
        await writeReminders(config);
        await success(`Removed reminder: "${removed.message}"`);
      } catch (e: any) {
        await error(e.message);
      }
    });

  reminder
    .command("toggle")
    .description("Toggle a reminder on/off")
    .argument("<number>", "Reminder number")
    .action(async (num: string) => {
      try {
        const config = await readReminders();
        const idx = parseInt(num, 10) - 1;
        if (isNaN(idx) || idx < 0 || idx >= config.reminders.length) {
          await error("Invalid reminder number.");
          return;
        }
        config.reminders[idx].enabled = !config.reminders[idx].enabled;
        await writeReminders(config);
        const status = config.reminders[idx].enabled ? "enabled" : "disabled";
        await success(`Reminder "${config.reminders[idx].message}" ${status}.`);
      } catch (e: any) {
        await error(e.message);
      }
    });
}

/** Check and display pending reminders (called on every command run) */
export async function checkReminders(): Promise<void> {
  try {
    const remindersPath = getRemindersPath();
    if (!(await fs.pathExists(remindersPath))) return;

    const t = await getActiveTheme();
    const config: RemindersConfig = await fs.readJSON(remindersPath);
    const now = new Date();
    const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const currentDay = dayNames[now.getDay()];

    for (const r of config.reminders) {
      if (!r.enabled) continue;
      const isRightDay = r.days.includes("daily") || r.days.includes(currentDay);
      if (isRightDay && currentTime >= r.time && currentTime <= incrementTime(r.time, 30)) {
        console.log(t.colors.warning(` ${t.icons.warning} Reminder: ${r.message} `));
      }
    }
  } catch {
    // Silent fail — don't block CLI
  }
}

function incrementTime(time: string, minutes: number): string {
  const [h, m] = time.split(":").map(Number);
  const total = h * 60 + m + minutes;
  const nh = Math.floor(total / 60) % 24;
  const nm = total % 60;
  return `${String(nh).padStart(2, "0")}:${String(nm).padStart(2, "0")}`;
}

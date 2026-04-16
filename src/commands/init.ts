import { Command } from "commander";
import inquirer from "inquirer";
import chalk from "chalk";
import { initProject, isInitialized } from "../services/config.service.js";
import { success, warn, spinner } from "../utils/helpers.js";
import { getActiveTheme } from "../ui/theme.service.js";

export function registerInitCommand(program: Command): void {
  program
    .command("init")
    .description("Initialize a new TrackIt project")
    .action(async () => {
      const t = await getActiveTheme();

      if (await isInitialized()) {
        await warn("TrackIt is already initialized in this directory.");
        const { overwrite } = await inquirer.prompt([
          {
            type: "confirm",
            name: "overwrite",
            message: "Reinitialize? This will overwrite your config.",
            default: false,
          },
        ]);
        if (!overwrite) return;
      }

      const { projectName } = await inquirer.prompt([
        {
          type: "input",
          name: "projectName",
          message: "Project Name:",
          validate: (v: string) => v.trim().length > 0 || "Name required",
        },
      ]);

      const tasks: string[] = [];
      let addMore = true;

      while (addMore) {
        const { task } = await inquirer.prompt([
          {
            type: "input",
            name: "task",
            message: `Add task${tasks.length > 0 ? " (leave empty to finish)" : ""}:`,
          },
        ]);

        if (task.trim() === "") {
          if (tasks.length === 0) {
            console.log(t.colors.warning("  Add at least one task."));
            continue;
          }
          addMore = false;
        } else {
          if (tasks.includes(task.trim())) {
            console.log(t.colors.warning(`  "${task.trim()}" already added.`));
          } else {
            tasks.push(task.trim());
            console.log(t.colors.muted(`  ${t.icons.success} Added: ${task.trim()}`));
          }
        }
      }

      const s = spinner("Initializing TrackIt...");
      s.start();
      await initProject(projectName.trim(), tasks);
      s.stop();

      console.log("");
      await success(`Project "${chalk.bold(projectName.trim())}" initialized!`);
      console.log(t.colors.muted(`  Tasks: ${tasks.join(", ")}`));
      console.log(t.colors.muted(`  Run ${t.colors.accent("trackit log")} to start logging.\n`));
    });
}

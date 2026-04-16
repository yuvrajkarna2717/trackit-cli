import { Command } from "commander";
import chalk from "chalk";
import { listTasks, addTask, removeTask, renameTask } from "../services/task.service.js";
import { success, error } from "../utils/helpers.js";
import { getActiveTheme } from "../ui/theme.service.js";
import { createTable, renderHeading } from "../ui/renderer.js";

export function registerTaskCommand(program: Command): void {
  const task = program
    .command("task")
    .description("Manage tasks (add, remove, rename, list)");

  task
    .command("list")
    .description("List all tasks")
    .action(async () => {
      try {
        const t = await getActiveTheme();
        const tasks = await listTasks();

        renderHeading(t, `${t.icons.task} Tasks`);

        const table = createTable(t, ["#", "Task Name"]);
        tasks.forEach((tk, i) => table.push([
          t.colors.muted(String(i + 1)),
          tk,
        ]));
        console.log(table.toString());
        console.log(t.colors.muted(`\n  ${tasks.length} task(s) configured.\n`));
      } catch (e: any) {
        await error(e.message);
      }
    });

  task
    .command("add")
    .description("Add a new task")
    .argument("<name>", "Task name")
    .action(async (name: string) => {
      try {
        await addTask(name);
        await success(`Task "${chalk.bold(name)}" added.`);
      } catch (e: any) {
        await error(e.message);
      }
    });

  task
    .command("remove")
    .description("Remove a task")
    .argument("<name>", "Task name")
    .action(async (name: string) => {
      try {
        await removeTask(name);
        await success(`Task "${chalk.bold(name)}" removed.`);
      } catch (e: any) {
        await error(e.message);
      }
    });

  task
    .command("rename")
    .description("Rename a task")
    .argument("<oldName>", "Current task name")
    .argument("<newName>", "New task name")
    .action(async (oldName: string, newName: string) => {
      try {
        await renameTask(oldName, newName);
        await success(`Task renamed: "${chalk.bold(oldName)}" → "${chalk.bold(newName)}"`);
      } catch (e: any) {
        await error(e.message);
      }
    });
}

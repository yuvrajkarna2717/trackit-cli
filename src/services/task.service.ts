import { readConfig, updateTasks } from "./config.service.js";

export async function listTasks(): Promise<string[]> {
  const config = await readConfig();
  return config.tasks;
}

export async function addTask(taskName: string): Promise<void> {
  const config = await readConfig();
  if (config.tasks.includes(taskName)) {
    throw new Error(`Task "${taskName}" already exists.`);
  }
  config.tasks.push(taskName);
  await updateTasks(config.tasks);
}

export async function removeTask(taskName: string): Promise<void> {
  const config = await readConfig();
  const idx = config.tasks.indexOf(taskName);
  if (idx === -1) {
    throw new Error(`Task "${taskName}" not found.`);
  }
  config.tasks.splice(idx, 1);
  await updateTasks(config.tasks);
}

export async function renameTask(oldName: string, newName: string): Promise<void> {
  const config = await readConfig();
  const idx = config.tasks.indexOf(oldName);
  if (idx === -1) {
    throw new Error(`Task "${oldName}" not found.`);
  }
  if (config.tasks.includes(newName)) {
    throw new Error(`Task "${newName}" already exists.`);
  }
  config.tasks[idx] = newName;
  await updateTasks(config.tasks);
}

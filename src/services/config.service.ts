import fs from "fs-extra";
import { z } from "zod";
import { getConfigPath, getTrackitDir, getLogsDir, getRemindersPath } from "../utils/paths.js";

const ConfigSchema = z.object({
  projectName: z.string().min(1),
  tasks: z.array(z.string().min(1)).min(1),
});

export type Config = z.infer<typeof ConfigSchema>;

export async function readConfig(): Promise<Config> {
  const configPath = getConfigPath();
  if (!(await fs.pathExists(configPath))) {
    throw new Error("TrackIt not initialized. Run `trackit init` first.");
  }
  const raw = await fs.readJSON(configPath);
  return ConfigSchema.parse(raw);
}

export async function writeConfig(config: Config): Promise<void> {
  ConfigSchema.parse(config);
  await fs.writeJSON(getConfigPath(), config, { spaces: 2 });
}

export async function isInitialized(): Promise<boolean> {
  return fs.pathExists(getConfigPath());
}

export async function initProject(projectName: string, tasks: string[]): Promise<void> {
  const trackitDir = getTrackitDir();
  const logsDir = getLogsDir();

  await fs.ensureDir(trackitDir);
  await fs.ensureDir(logsDir);

  const config: Config = { projectName, tasks };
  await writeConfig(config);
}

export async function updateTasks(tasks: string[]): Promise<void> {
  const config = await readConfig();
  config.tasks = tasks;
  await writeConfig(config);
}

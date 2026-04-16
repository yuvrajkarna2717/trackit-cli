import fs from "fs-extra";
import { getConfigPath } from "../utils/paths.js";
import { themes, type Theme, type ThemeName, THEME_NAMES } from "./themes.js";

const DEFAULT_THEME: ThemeName = "minimal";

interface TrackitConfig {
  projectName: string;
  tasks: string[];
  theme?: ThemeName;
}

export async function getActiveThemeName(): Promise<ThemeName> {
  try {
    const configPath = getConfigPath();
    if (await fs.pathExists(configPath)) {
      const config: TrackitConfig = await fs.readJSON(configPath);
      if (config.theme && THEME_NAMES.includes(config.theme)) {
        return config.theme;
      }
    }
  } catch {
    // Fall through to default
  }
  return DEFAULT_THEME;
}

export async function getActiveTheme(): Promise<Theme> {
  const name = await getActiveThemeName();
  return themes[name];
}

export async function setTheme(name: ThemeName): Promise<void> {
  const configPath = getConfigPath();
  if (!(await fs.pathExists(configPath))) {
    throw new Error("TrackIt not initialized. Run `trackit init` first.");
  }
  const config: TrackitConfig = await fs.readJSON(configPath);
  config.theme = name;
  await fs.writeJSON(configPath, config, { spaces: 2 });
}

export function getTheme(name: ThemeName): Theme {
  return themes[name];
}

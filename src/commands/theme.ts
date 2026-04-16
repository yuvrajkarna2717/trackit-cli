import { Command } from "commander";
import chalk from "chalk";
import inquirer from "inquirer";
import { getActiveTheme, setTheme, getTheme } from "../ui/theme.service.js";
import { themes, THEME_NAMES, THEME_LABELS, type ThemeName } from "../ui/themes.js";
import {
  renderSuccess, renderError, renderHeading, renderMetric,
  renderDashboardHeader, renderCard, renderFooter,
  createTable, renderProgressBar, renderActivityRow, renderDivider,
} from "../ui/renderer.js";

export function registerThemeCommand(program: Command): void {
  const theme = program
    .command("theme")
    .description("Manage visual themes");

  // ─── theme set ────────────────────────────────────────
  theme
    .command("set")
    .description("Set the active theme")
    .argument("[name]", "Theme name: minimal, neon, or premium")
    .action(async (name?: string) => {
      const t = await getActiveTheme();

      if (!name) {
        // Interactive selector
        const currentName = t.name;
        const { selected } = await inquirer.prompt([
          {
            type: "list",
            name: "selected",
            message: "Choose a theme:",
            choices: THEME_NAMES.map((n) => ({
              name: `${n === currentName ? chalk.green("● ") : "  "}${THEME_LABELS[n]}${n === currentName ? chalk.dim(" (current)") : ""}`,
              value: n,
            })),
            default: currentName,
          },
        ]);
        name = selected;
      }

      if (!THEME_NAMES.includes(name as ThemeName)) {
        renderError(t, `Unknown theme "${name}". Available: ${THEME_NAMES.join(", ")}`);
        return;
      }

      try {
        await setTheme(name as ThemeName);
        const newT = getTheme(name as ThemeName);
        renderSuccess(newT, `Theme set to ${chalk.bold(newT.label)}`);
      } catch (e: any) {
        renderError(t, e.message);
      }
    });

  // ─── theme list ───────────────────────────────────────
  theme
    .command("list")
    .description("List available themes")
    .action(async () => {
      const t = await getActiveTheme();
      renderHeading(t, "Available Themes");
      for (const name of THEME_NAMES) {
        const th = themes[name];
        const active = name === t.name;
        const marker = active ? t.colors.success("● ") : "  ";
        const label = active ? chalk.bold(th.label) : th.label;
        const tag = active ? t.colors.muted(" (active)") : "";
        console.log(`  ${marker}${label}${tag}`);
      }
      console.log("");
    });

  // ─── theme preview ───────────────────────────────────
  theme
    .command("preview")
    .description("Preview all themes side by side")
    .argument("[name]", "Preview a specific theme")
    .action(async (name?: string) => {
      const themesToPreview = name && THEME_NAMES.includes(name as ThemeName)
        ? [name as ThemeName]
        : THEME_NAMES;

      for (const themeName of themesToPreview) {
        const t = getTheme(themeName);
        previewTheme(t);
      }
    });
}

function previewTheme(t: ReturnType<typeof getTheme>): void {
  renderDashboardHeader(t, "My Project");

  // Metrics
  console.log("");
  renderMetric(t, t.icons.fire, "Current Streak", "8 days");
  renderMetric(t, t.icons.trophy, "Longest Streak", "14 days");
  renderMetric(t, t.icons.calendar, "Total Logged", "23 days");

  // Table
  const table = createTable(t, ["Task", "Total", "Avg", "Progress"], [22, 10, 10, 20]);
  const bar1 = renderProgressBar(t, 52, 52);
  const bar2 = renderProgressBar(t, 22, 52);
  const bar3 = renderProgressBar(t, 38, 52);
  table.push(
    ["Problems Solved", t.colors.value("52"), t.colors.label("2.3"), bar1],
    ["Jobs Applied", t.colors.value("22"), t.colors.label("1.0"), bar2],
    ["Focus Hours", t.colors.value("38"), t.colors.label("1.7"), bar3],
  );
  console.log("");
  console.log(table.toString());

  // Card
  renderCard(t, "Weekly Summary", [
    `${t.icons.strong} Best Day: ${t.colors.success("Monday")} — score 18`,
    `${t.icons.weak} Weak Area: ${t.colors.warning("SQL Queries")}`,
  ]);

  // Messages
  console.log("");
  renderSuccess(t, "Log saved successfully!");
  renderError(t, "No logs found for 2026-04-15.");

  // Activity
  console.log("");
  console.log(t.colors.heading("  Recent Activity"));
  renderActivityRow(t, "04-15", "Problems: 4, Focus: 6");
  renderActivityRow(t, "04-14", "Problems: 3, Focus: 5");

  renderFooter(t);
}

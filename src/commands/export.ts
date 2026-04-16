import { Command } from "commander";
import chalk from "chalk";
import fs from "fs-extra";
import { getAllLogs } from "../services/log.service.js";
import { readConfig } from "../services/config.service.js";
import { getExportDir } from "../utils/paths.js";
import { success, error, spinner } from "../utils/helpers.js";

async function exportCSV(): Promise<string> {
  const config = await readConfig();
  const logs = await getAllLogs();
  if (logs.length === 0) throw new Error("No logs to export.");

  const headers = ["Date", ...config.tasks];
  const rows = logs.map((log) => [
    log.date,
    ...config.tasks.map((t) => String(log.entries[t] ?? "")),
  ]);

  const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
  const dir = getExportDir();
  await fs.ensureDir(dir);
  const filePath = `${dir}/trackit-export-${Date.now()}.csv`;
  await fs.writeFile(filePath, csv, "utf-8");
  return filePath;
}

async function exportJSON(): Promise<string> {
  const logs = await getAllLogs();
  if (logs.length === 0) throw new Error("No logs to export.");

  const dir = getExportDir();
  await fs.ensureDir(dir);
  const filePath = `${dir}/trackit-export-${Date.now()}.json`;
  await fs.writeJSON(filePath, { logs }, { spaces: 2 });
  return filePath;
}

async function exportMarkdown(): Promise<string> {
  const config = await readConfig();
  const logs = await getAllLogs();
  if (logs.length === 0) throw new Error("No logs to export.");

  const lines: string[] = [
    `# TrackIt Report — ${config.projectName}`,
    "",
    `> Generated on ${new Date().toLocaleDateString()}`,
    "",
    `| Date | ${config.tasks.join(" | ")} |`,
    `| --- | ${config.tasks.map(() => "---").join(" | ")} |`,
  ];

  for (const log of logs) {
    const vals = config.tasks.map((t) => String(log.entries[t] ?? "—"));
    lines.push(`| ${log.date} | ${vals.join(" | ")} |`);
  }

  lines.push("", `---`, `*${logs.length} total entries*`);

  const md = lines.join("\n");
  const dir = getExportDir();
  await fs.ensureDir(dir);
  const filePath = `${dir}/trackit-export-${Date.now()}.md`;
  await fs.writeFile(filePath, md, "utf-8");
  return filePath;
}

export function registerExportCommand(program: Command): void {
  program
    .command("export")
    .description("Export logs as CSV, JSON, or Markdown")
    .argument("<format>", 'Export format: "csv", "json", or "md"')
    .action(async (format: string) => {
      const s = spinner(`Exporting as ${format}...`);
      s.start();
      try {
        let filePath: string;
        switch (format.toLowerCase()) {
          case "csv":
            filePath = await exportCSV();
            break;
          case "json":
            filePath = await exportJSON();
            break;
          case "md":
          case "markdown":
            filePath = await exportMarkdown();
            break;
          default:
            s.stop();
            await error('Invalid format. Use "csv", "json", or "md".');
            return;
        }
        s.stop();
        await success(`Exported to ${chalk.underline(filePath)}`);
      } catch (e: any) {
        s.stop();
        await error(e.message);
      }
    });
}

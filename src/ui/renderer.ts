import Table from "cli-table3";
import type { Theme } from "./themes.js";

// ─── Messages ───────────────────────────────────────────────

export function renderSuccess(t: Theme, msg: string): void {
  const { colors, icons } = t;
  console.log(colors.success(`${icons.success} `) + msg);
}

export function renderError(t: Theme, msg: string): void {
  const { colors, icons } = t;
  console.log(colors.error(`${icons.error} `) + msg);
}

export function renderWarn(t: Theme, msg: string): void {
  const { colors, icons } = t;
  console.log(colors.warning(`${icons.warning} `) + msg);
}

export function renderInfo(t: Theme, msg: string): void {
  const { colors, icons } = t;
  console.log(colors.info(`${icons.info} `) + msg);
}

// ─── Headings & Dividers ────────────────────────────────────

export function renderHeading(t: Theme, text: string): void {
  const { colors, chrome } = t;
  console.log("");
  console.log(colors.heading(text));
  console.log(colors.border(chrome.dividerChar.repeat(chrome.dividerWidth)));
}

export function renderSectionTitle(t: Theme, text: string): void {
  const { colors, chrome } = t;
  console.log("");
  console.log(colors.heading(text));
  console.log(colors.muted("  " + chrome.sectionDividerChar.repeat(chrome.dividerWidth - 4)));
}

export function renderDivider(t: Theme): void {
  const { colors, chrome } = t;
  console.log(colors.border(chrome.dividerChar.repeat(chrome.dividerWidth)));
}

// ─── Dashboard Header ───────────────────────────────────────

export function renderDashboardHeader(t: Theme, projectName: string): void {
  const { chrome, colors } = t;
  const w = chrome.dividerWidth;

  if (t.name === "neon") {
    console.log("");
    console.log(colors.border(chrome.boxTopLeft + chrome.boxHorizontal.repeat(w - 2) + chrome.boxTopRight));
    const title = ` ${t.icons.streak} TRACKIT // ${projectName.toUpperCase()} `;
    const padTotal = w - 2 - stripAnsi(title).length;
    const padL = Math.floor(padTotal / 2);
    const padR = padTotal - padL;
    console.log(colors.border(chrome.boxVertical) + " ".repeat(padL) + chrome.headerFg(title) + " ".repeat(padR) + colors.border(chrome.boxVertical));
    console.log(colors.border(chrome.boxBottomLeft + chrome.boxHorizontal.repeat(w - 2) + chrome.boxBottomRight));
  } else if (t.name === "premium") {
    console.log("");
    const line = chrome.boxHorizontal.repeat(w);
    console.log(colors.border(line));
    const title = `  ${t.icons.chart} ${projectName} — Analytics Dashboard  `;
    console.log(chrome.headerBg(chrome.headerFg(title)));
    console.log(colors.border(line));
  } else {
    // minimal
    console.log("");
    const title = `  ${projectName}  `;
    console.log(chrome.headerBg(chrome.headerFg(title)));
    console.log(colors.muted(chrome.dividerChar.repeat(w)));
  }
}

// ─── Stat Metric ────────────────────────────────────────────

export function renderMetric(t: Theme, icon: string, label: string, value: string | number): void {
  const { colors } = t;
  if (t.name === "neon") {
    console.log(`  ${colors.accent(icon)} ${colors.label(label)}  ${colors.value(String(value))}`);
  } else if (t.name === "premium") {
    console.log(`  ${icon}  ${colors.label(label.padEnd(18))} ${colors.value(String(value))}`);
  } else {
    console.log(`  ${colors.muted(icon)} ${label}  ${colors.value(String(value))}`);
  }
}

// ─── Tables ─────────────────────────────────────────────────

export function createTable(t: Theme, heads: string[], colWidths?: number[]): Table.Table {
  const { colors, chrome } = t;
  const styledHeads = heads.map((h) => colors.tableHead(h));
  const opts: Table.TableConstructorOptions = {
    head: styledHeads,
    style: chrome.tableStyle,
  };
  if (colWidths) opts.colWidths = colWidths;

  if (t.name === "neon") {
    opts.chars = {
      top: "═", "top-mid": "╤", "top-left": "╔", "top-right": "╗",
      bottom: "═", "bottom-mid": "╧", "bottom-left": "╚", "bottom-right": "╝",
      left: "║", "left-mid": "╟", mid: "─", "mid-mid": "┼",
      right: "║", "right-mid": "╢", middle: "│",
    };
  } else if (t.name === "premium") {
    opts.chars = {
      top: "━", "top-mid": "┯", "top-left": "┏", "top-right": "┓",
      bottom: "━", "bottom-mid": "┷", "bottom-left": "┗", "bottom-right": "┛",
      left: "┃", "left-mid": "┠", mid: "─", "mid-mid": "┼",
      right: "┃", "right-mid": "┨", middle: "│",
    };
  }

  return new Table(opts) as Table.Table;
}

// ─── Progress Bar ───────────────────────────────────────────

export function renderProgressBar(t: Theme, value: number, max: number, width: number = 15): string {
  const { colors } = t;
  const filled = max > 0 ? Math.round((value / max) * width) : 0;
  const empty = width - filled;

  if (t.name === "neon") {
    return colors.bar("█".repeat(filled)) + colors.muted("░".repeat(empty));
  } else if (t.name === "premium") {
    return colors.bar("▓".repeat(filled)) + colors.muted("░".repeat(empty));
  } else {
    return colors.bar("█".repeat(filled)) + colors.muted("░".repeat(empty));
  }
}

// ─── Card / Box ─────────────────────────────────────────────

export function renderCard(t: Theme, title: string, lines: string[]): void {
  const { colors, chrome } = t;
  const w = chrome.dividerWidth - 4;

  if (t.name === "premium") {
    console.log("");
    console.log("  " + colors.border(chrome.boxTopLeft + chrome.boxHorizontal.repeat(w) + chrome.boxTopRight));
    const titlePad = w - stripAnsi(title).length - 1;
    console.log("  " + colors.border(chrome.boxVertical) + " " + colors.heading(title) + " ".repeat(Math.max(titlePad, 0)) + colors.border(chrome.boxVertical));
    console.log("  " + colors.border(chrome.boxVertical) + colors.muted(chrome.sectionDividerChar.repeat(w)) + colors.border(chrome.boxVertical));
    for (const line of lines) {
      const linePad = w - stripAnsi(line).length - 1;
      console.log("  " + colors.border(chrome.boxVertical) + " " + line + " ".repeat(Math.max(linePad, 0)) + colors.border(chrome.boxVertical));
    }
    console.log("  " + colors.border(chrome.boxBottomLeft + chrome.boxHorizontal.repeat(w) + chrome.boxBottomRight));
  } else if (t.name === "neon") {
    console.log("");
    console.log("  " + colors.border(chrome.boxTopLeft + chrome.boxHorizontal.repeat(w) + chrome.boxTopRight));
    const titlePad = w - stripAnsi(title).length - 1;
    console.log("  " + colors.border(chrome.boxVertical) + " " + colors.accent(title) + " ".repeat(Math.max(titlePad, 0)) + colors.border(chrome.boxVertical));
    console.log("  " + colors.border(chrome.boxVertical) + colors.muted("─".repeat(w)) + colors.border(chrome.boxVertical));
    for (const line of lines) {
      const linePad = w - stripAnsi(line).length - 1;
      console.log("  " + colors.border(chrome.boxVertical) + " " + line + " ".repeat(Math.max(linePad, 0)) + colors.border(chrome.boxVertical));
    }
    console.log("  " + colors.border(chrome.boxBottomLeft + chrome.boxHorizontal.repeat(w) + chrome.boxBottomRight));
  } else {
    // minimal — clean section
    console.log("");
    console.log("  " + colors.heading(title));
    console.log("  " + colors.muted(chrome.sectionDividerChar.repeat(w)));
    for (const line of lines) {
      console.log("  " + line);
    }
  }
}

// ─── Footer ─────────────────────────────────────────────────

export function renderFooter(t: Theme): void {
  const { colors, chrome } = t;
  console.log("");
  console.log(colors.muted(chrome.dividerChar.repeat(chrome.dividerWidth)));
  console.log(colors.muted("  " + chrome.footerText));
  console.log("");
}

// ─── Activity Row ───────────────────────────────────────────

export function renderActivityRow(t: Theme, date: string, text: string): void {
  const { colors, icons } = t;
  if (t.name === "neon") {
    console.log(`  ${colors.accent(icons.bullet)} ${colors.muted(date)} ${colors.primary(text)}`);
  } else if (t.name === "premium") {
    console.log(`  ${colors.muted(icons.bullet)} ${colors.label(date)}  ${text}`);
  } else {
    console.log(`  ${colors.muted(date)} ${text}`);
  }
}

// ─── Helper ─────────────────────────────────────────────────

function stripAnsi(str: string): string {
  // eslint-disable-next-line no-control-regex
  return str.replace(/\x1B\[\d+m|\x1B\[38;2;\d+;\d+;\d+m|\x1B\[48;2;\d+;\d+;\d+m|\x1B\[0m|\x1B\[\d+;\d+;\d+m/g, "");
}

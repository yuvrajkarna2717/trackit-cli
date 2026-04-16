import chalk, { type ChalkInstance } from "chalk";
import asciichart from "asciichart";

// ─── Theme Name Type ────────────────────────────────────────
export type ThemeName = "minimal" | "neon" | "premium";

export const THEME_NAMES: ThemeName[] = ["minimal", "neon", "premium"];

export const THEME_LABELS: Record<ThemeName, string> = {
  minimal: "Modern Minimal",
  neon: "Neon Hacker",
  premium: "Premium Analytics",
};

// ─── Theme Color Palette ────────────────────────────────────
export interface ThemeColors {
  primary: ChalkInstance;
  secondary: ChalkInstance;
  accent: ChalkInstance;
  success: ChalkInstance;
  error: ChalkInstance;
  warning: ChalkInstance;
  info: ChalkInstance;
  muted: ChalkInstance;
  highlight: ChalkInstance;
  heading: ChalkInstance;
  value: ChalkInstance;
  label: ChalkInstance;
  border: ChalkInstance;
  bar: ChalkInstance;
  barBg: ChalkInstance;
  tableHead: ChalkInstance;
}

// ─── Theme Icons ────────────────────────────────────────────
export interface ThemeIcons {
  success: string;
  error: string;
  warning: string;
  info: string;
  fire: string;
  trophy: string;
  calendar: string;
  chart: string;
  task: string;
  log: string;
  review: string;
  strong: string;
  weak: string;
  streak: string;
  arrow: string;
  bullet: string;
  dash: string;
}

// ─── Theme Borders/Chrome ───────────────────────────────────
export interface ThemeChrome {
  headerBg: ChalkInstance;
  headerFg: ChalkInstance;
  dividerChar: string;
  dividerWidth: number;
  sectionDividerChar: string;
  boxTopLeft: string;
  boxTopRight: string;
  boxBottomLeft: string;
  boxBottomRight: string;
  boxHorizontal: string;
  boxVertical: string;
  chartColor: string;
  chartHeight: number;
  tableStyle: { head: string[]; border: string[] };
  footerText: string;
}

// ─── Full Theme ─────────────────────────────────────────────
export interface Theme {
  name: ThemeName;
  label: string;
  colors: ThemeColors;
  icons: ThemeIcons;
  chrome: ThemeChrome;
}

// ═══════════════════════════════════════════════════════════
// Theme 1: Modern Minimal
// ═══════════════════════════════════════════════════════════
const minimalColors: ThemeColors = {
  primary: chalk.hex("#5B9BD5"),
  secondary: chalk.hex("#A3C4DC"),
  accent: chalk.hex("#70AD47"),
  success: chalk.hex("#70AD47"),
  error: chalk.hex("#E06666"),
  warning: chalk.hex("#F6B26B"),
  info: chalk.hex("#6FA8DC"),
  muted: chalk.dim,
  highlight: chalk.bold.hex("#5B9BD5"),
  heading: chalk.bold.hex("#5B9BD5"),
  value: chalk.bold.white,
  label: chalk.hex("#B4B4B4"),
  border: chalk.hex("#555555"),
  bar: chalk.hex("#5B9BD5"),
  barBg: chalk.hex("#333333"),
  tableHead: chalk.hex("#5B9BD5"),
};

const minimalIcons: ThemeIcons = {
  success: "✓",
  error: "✗",
  warning: "!",
  info: "i",
  fire: "◆",
  trophy: "★",
  calendar: "▫",
  chart: "▸",
  task: "○",
  log: "▸",
  review: "◇",
  strong: "▲",
  weak: "▽",
  streak: "◆",
  arrow: "→",
  bullet: "·",
  dash: "─",
};

const minimalChrome: ThemeChrome = {
  headerBg: chalk.bgHex("#2B4C6F"),
  headerFg: chalk.bold.white,
  dividerChar: "─",
  dividerWidth: 50,
  sectionDividerChar: "·",
  boxTopLeft: "┌",
  boxTopRight: "┐",
  boxBottomLeft: "└",
  boxBottomRight: "┘",
  boxHorizontal: "─",
  boxVertical: "│",
  chartColor: asciichart.blue,
  chartHeight: 8,
  tableStyle: { head: [], border: [] },
  footerText: "trackit-cli",
};

// ═══════════════════════════════════════════════════════════
// Theme 2: Neon Hacker
// ═══════════════════════════════════════════════════════════
const neonColors: ThemeColors = {
  primary: chalk.hex("#00FF41"),
  secondary: chalk.hex("#FF00FF"),
  accent: chalk.hex("#00FFFF"),
  success: chalk.hex("#00FF41"),
  error: chalk.hex("#FF073A"),
  warning: chalk.hex("#FFE900"),
  info: chalk.hex("#00FFFF"),
  muted: chalk.hex("#555555"),
  highlight: chalk.bold.hex("#FF00FF"),
  heading: chalk.bold.hex("#00FF41"),
  value: chalk.bold.hex("#00FFFF"),
  label: chalk.hex("#00FF41"),
  border: chalk.hex("#00FF41"),
  bar: chalk.hex("#FF00FF"),
  barBg: chalk.hex("#1A1A2E"),
  tableHead: chalk.hex("#00FFFF"),
};

const neonIcons: ThemeIcons = {
  success: "⚡",
  error: "✘",
  warning: "⚠",
  info: "◈",
  fire: "🔥",
  trophy: "⚡",
  calendar: "◉",
  chart: "█",
  task: "▶",
  log: "▶",
  review: "◈",
  strong: "⬆",
  weak: "⬇",
  streak: "⚡",
  arrow: "»",
  bullet: "›",
  dash: "═",
};

const neonChrome: ThemeChrome = {
  headerBg: chalk.bgHex("#0D0221"),
  headerFg: chalk.bold.hex("#00FF41"),
  dividerChar: "═",
  dividerWidth: 54,
  sectionDividerChar: "─",
  boxTopLeft: "╔",
  boxTopRight: "╗",
  boxBottomLeft: "╚",
  boxBottomRight: "╝",
  boxHorizontal: "═",
  boxVertical: "║",
  chartColor: asciichart.green,
  chartHeight: 10,
  tableStyle: { head: [], border: [] },
  footerText: "[ TRACKIT-CLI // SYSTEM ONLINE ]",
};

// ═══════════════════════════════════════════════════════════
// Theme 3: Premium Analytics
// ═══════════════════════════════════════════════════════════
const premiumColors: ThemeColors = {
  primary: chalk.hex("#E8B931"),
  secondary: chalk.hex("#C0A062"),
  accent: chalk.hex("#D4AF37"),
  success: chalk.hex("#4CAF50"),
  error: chalk.hex("#E53935"),
  warning: chalk.hex("#FF9800"),
  info: chalk.hex("#42A5F5"),
  muted: chalk.hex("#717171"),
  highlight: chalk.bold.hex("#E8B931"),
  heading: chalk.bold.hex("#E8B931"),
  value: chalk.bold.white,
  label: chalk.hex("#AAAAAA"),
  border: chalk.hex("#E8B931"),
  bar: chalk.hex("#4CAF50"),
  barBg: chalk.hex("#2A2A2A"),
  tableHead: chalk.hex("#E8B931"),
};

const premiumIcons: ThemeIcons = {
  success: "✔",
  error: "✖",
  warning: "⚠",
  info: "ℹ",
  fire: "🔥",
  trophy: "🏆",
  calendar: "📅",
  chart: "📊",
  task: "◈",
  log: "📝",
  review: "📋",
  strong: "💪",
  weak: "⚠️",
  streak: "🔥",
  arrow: "→",
  bullet: "›",
  dash: "━",
};

const premiumChrome: ThemeChrome = {
  headerBg: chalk.bgHex("#1A1A2E"),
  headerFg: chalk.bold.hex("#E8B931"),
  dividerChar: "━",
  dividerWidth: 56,
  sectionDividerChar: "─",
  boxTopLeft: "┏",
  boxTopRight: "┓",
  boxBottomLeft: "┗",
  boxBottomRight: "┛",
  boxHorizontal: "━",
  boxVertical: "┃",
  chartColor: asciichart.yellow,
  chartHeight: 10,
  tableStyle: { head: [], border: [] },
  footerText: "TrackIt Analytics™",
};

// ═══════════════════════════════════════════════════════════
// Theme Registry
// ═══════════════════════════════════════════════════════════
export const themes: Record<ThemeName, Theme> = {
  minimal: {
    name: "minimal",
    label: "Modern Minimal",
    colors: minimalColors,
    icons: minimalIcons,
    chrome: minimalChrome,
  },
  neon: {
    name: "neon",
    label: "Neon Hacker",
    colors: neonColors,
    icons: neonIcons,
    chrome: neonChrome,
  },
  premium: {
    name: "premium",
    label: "Premium Analytics",
    colors: premiumColors,
    icons: premiumIcons,
    chrome: premiumChrome,
  },
};

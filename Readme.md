# 🚀 TrackIt CLI

A developer-friendly CLI to track daily progress, manage tasks, analyze productivity, and maintain streaks — all from your terminal.

[![npm version](https://img.shields.io/npm/v/trackit-cli.svg)](https://www.npmjs.com/package/trackit-cli)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

---

## ✨ Features

- **Daily Logging** — Log progress on custom tasks every day
- **Task Management** — Add, remove, rename, and list tasks
- **View Logs** — View today's log, specific dates, or full month
- **Streak Tracking** — Track current and longest streaks
- **Stats & Averages** — See totals, averages, and productivity metrics
- **Weekly Review** — Best day, strong/weak areas analysis
- **Export** — Export logs as CSV, JSON, or Markdown
- **Terminal Charts** *(v2)* — ASCII charts for any numeric task
- **Dashboard** *(v2)* — Full terminal dashboard with charts and progress bars
- **Reminders** *(v2)* — Set daily reminders to stay consistent
- **Themes** *(v2)* — 3 beautiful terminal themes (Modern Minimal, Neon Hacker, Premium Analytics)

---

## 📦 Installation

```bash
npm install -g trackit-cli
```

Or use locally:

```bash
npx trackit-cli
```

---

## 🚀 Quick Start

```bash
# Initialize a new project
trackit init

# Log your daily progress
trackit log

# View today's log
trackit view today

# See your stats
trackit stats

# Open the full dashboard
trackit dashboard
```

---

## 📖 Commands

### `trackit init`

Initialize TrackIt in your current directory. Creates a `.trackit/` folder with config and log storage.

```
? Project Name: Career Sprint
? Add task: Problems Solved
? Add task: SQL Queries
? Add task (leave empty to finish):
✔ Project "Career Sprint" initialized!
```

### `trackit task`

Manage your tracked tasks.

```bash
trackit task list                              # List all tasks
trackit task add "Mock Interviews"             # Add a task
trackit task remove "SQL Queries"              # Remove a task
trackit task rename "Jobs Applied" "Apps Sent" # Rename a task
```

### `trackit log`

Log daily progress. Prompts for each configured task.

```bash
trackit log              # Log for today
trackit log -d 2026-04-14  # Log for a specific date
```

```
📝 Daily Log — Tue, Apr 15 2026

? Problems Solved: 4
? SQL Queries: 2
? System Design: Cache Design
? Jobs Applied: 5
? Focus Hours: 6

✔ Log saved!
```

### `trackit view`

View logged data.

```bash
trackit view today         # Today's log
trackit view 2026-04-15    # Specific date
trackit view month         # Current month
trackit view month 2026-03 # Specific month
```

### `trackit stats`

View overall stats, totals, and averages.

```
📊 Stats Overview
  🔥 Current Streak: 8 days
  🏆 Longest Streak: 14 days
  📅 Total Days Logged: 23

┌──────────────────┬───────┬─────────┐
│ Task             │ Total │ Avg/Day │
├──────────────────┼───────┼─────────┤
│ Problems Solved  │ 52    │ 2.3     │
│ Jobs Applied     │ 22    │ 1.0     │
│ Focus Hours      │ 124   │ 5.4     │
└──────────────────┴───────┴─────────┘

  Tip: Use trackit stats --chart <task> to see a chart.
```

### `trackit stats --chart <task>`

*(v2)* Show an ASCII chart for a numeric task.

```bash
trackit stats --chart "Problems Solved"
```

### `trackit review`

Weekly review with best day, totals, and weak/strong area analysis.

```
📋 Weekly Review (2026-04-13 → 2026-04-19)
  📅 Days Logged: 5
  🏆 Best Day: Monday (2026-04-13) — score 18
  💪 Strong Area: Problems Solved
  ⚠️  Weak Area: SQL Queries
```

### `trackit dashboard` / `trackit dash`

*(v2)* Full terminal dashboard with progress bars, mini charts, and recent activity.

### `trackit export <format>`

Export all logs in your chosen format.

```bash
trackit export csv   # Comma-separated values
trackit export json  # Raw JSON
trackit export md    # Markdown table
```

### `trackit reminder`

*(v2)* Manage daily reminders.

```bash
trackit reminder add       # Interactive prompt to add reminder
trackit reminder list      # List all reminders
trackit reminder remove 1  # Remove reminder #1
trackit reminder toggle 1  # Enable/disable reminder #1
```

### `trackit theme`

*(v2)* Switch between 3 visual themes. The active theme is saved in your config.

```bash
trackit theme list            # List available themes
trackit theme set             # Interactive theme selector
trackit theme set neon        # Set theme directly
trackit theme preview         # Preview all 3 themes
trackit theme preview premium # Preview a specific theme
```

**Available themes:**

| Theme | Style |
|-------|-------|
| `minimal` | Clean, soft colors, professional borders — developer-friendly |
| `neon` | Bold bright colors, double-line borders — cyberpunk terminal vibe |
| `premium` | Gold accents, heavy borders, boxed cards — executive dashboard feel |

Themes apply to: dashboard, stats, review, task list, log summary, view, and all success/error messages.

---

## 📁 File Storage

TrackIt stores data locally in a `.trackit/` folder:

```
.trackit/
├── config.json          # Project config, task list & theme setting
├── reminders.json       # Reminder settings (v2)
└── logs/
    ├── 2026-04.json     # Monthly log files
    └── 2026-05.json
```

---

## 🛠 Tech Stack

| Tool | Purpose |
|------|---------|
| Node.js | Runtime |
| TypeScript | Type safety |
| Commander | CLI framework |
| Inquirer | Interactive prompts |
| Chalk | Terminal colors |
| Ora | Spinners/loaders |
| cli-table3 | Table formatting |
| asciichart | Terminal charts (v2) |
| fs-extra | File system operations |
| Day.js | Date handling |
| Zod | Config validation |

---

## 🏗 Development

```bash
# Clone the repo
git clone https://github.com/yuvrajkarna2717/trackit-cli.git
cd trackit-cli

# Install deps
npm install

# Build
npm run build

# Run locally
node dist/index.js --help

# Watch mode
npm run dev
```

---

## 📄 License

MIT

import { Command } from "commander";
import { getWeeklyReview } from "../services/stats.service.js";
import { getStartOfWeek, getEndOfWeek } from "../utils/date.js";
import { error } from "../utils/helpers.js";
import { getActiveTheme } from "../ui/theme.service.js";
import {
  renderHeading, renderMetric, renderCard,
  createTable, renderError, renderFooter,
} from "../ui/renderer.js";

export function registerReviewCommand(program: Command): void {
  program
    .command("review")
    .description("Weekly review — see your best day, totals, and weak areas")
    .action(async () => {
      try {
        const t = await getActiveTheme();
        const start = getStartOfWeek();
        const end = getEndOfWeek();
        const review = await getWeeklyReview(start, end);

        if (review.totalDays === 0) {
          renderError(t, "No logs this week. Start logging with `trackit log`.");
          return;
        }

        renderHeading(t, `${t.icons.review} Weekly Review (${start} ${t.icons.arrow} ${end})`);

        console.log("");
        renderMetric(t, t.icons.calendar, "Days Logged", String(review.totalDays));

        if (review.bestDay) {
          renderMetric(t, t.icons.trophy, "Best Day", `${review.bestDay.day} (${review.bestDay.date}) — score ${review.bestDay.score}`);
        }

        // Card for strengths/weaknesses
        const cardLines: string[] = [];
        if (review.strongArea) {
          cardLines.push(`${t.icons.strong} Strong Area: ${t.colors.success(review.strongArea)}`);
        }
        if (review.weakArea && review.weakArea !== review.strongArea) {
          cardLines.push(`${t.icons.weak}  Weak Area:   ${t.colors.warning(review.weakArea)}`);
        }
        if (cardLines.length > 0) {
          renderCard(t, "Insights", cardLines);
        }

        console.log("");

        const table = createTable(t, ["Task", "Weekly Total"]);
        for (const [key, val] of Object.entries(review.totals)) {
          table.push([key, t.colors.value(String(val))]);
        }

        console.log(table.toString());
        console.log("");
      } catch (e: any) {
        await error(e.message);
      }
    });
}

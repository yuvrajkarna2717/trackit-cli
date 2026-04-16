import ora from "ora";
import { getActiveTheme } from "../ui/theme.service.js";
import { renderSuccess, renderError, renderWarn, renderInfo, renderHeading } from "../ui/renderer.js";

export async function success(msg: string): Promise<void> {
  const t = await getActiveTheme();
  renderSuccess(t, msg);
}

export async function error(msg: string): Promise<void> {
  const t = await getActiveTheme();
  renderError(t, msg);
}

export async function warn(msg: string): Promise<void> {
  const t = await getActiveTheme();
  renderWarn(t, msg);
}

export async function info(msg: string): Promise<void> {
  const t = await getActiveTheme();
  renderInfo(t, msg);
}

export async function heading(msg: string): Promise<void> {
  const t = await getActiveTheme();
  renderHeading(t, msg);
}

export function spinner(text: string) {
  return ora({ text, spinner: "dots" });
}

export function isNumeric(val: string): boolean {
  return !isNaN(Number(val)) && val.trim() !== "";
}

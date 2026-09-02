import { useTick } from "./useTick.js";
import { pad2 } from "../utils/formatters.js";

export function useCountdown(targetTs) {
  useTick(1000);
  const remaining = Math.max(0, (targetTs || 0) - Date.now());
  const hh = Math.floor(remaining / 3600000);
  const mm = Math.floor((remaining % 3600000) / 60000);
  const ss = Math.floor((remaining % 60000) / 1000);
  const label = hh > 0 ? `${pad2(hh)}:${pad2(mm)}:${pad2(ss)}` : `${pad2(mm)}:${pad2(ss)}`;
  return { remaining, label, expired: remaining <= 0 };
}

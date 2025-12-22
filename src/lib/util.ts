import { DateError, ValidationIssue } from "@/dto/projectDto";

export function parseTTL(ttl: string): number {
  const match = ttl.match(/^(\d+)(s|m|h|d)$/);
  if (!match) throw new Error("Invalid TTL format");

  const value = parseInt(match[1], 10);
  const unit = match[2];
  switch (unit) {
    case "s":
      return value;
    case "m":
      return value * 60;
    case "h":
      return value * 3600;
    case "d":
      return value * 86400;
    default:
      throw new Error("Invalid TTL unit");
  }
}

export const generateSixDigitCode = () => {
  return Math.floor(Math.random() * 1000000)
    .toString()
    .padStart(6, "0");
};

export function parseDateOrNull(v: string) {
  if (!v) return null;
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? null : d;
}

export function validateStartEndDate(
  start: string,
  end: string
): DateError | null {
  if (!start) return "MISSING_START";
  if (!end) return "MISSING_END";

  const s = parseDateOrNull(start);
  if (!s) return "INVALID_START";
  const e = parseDateOrNull(end);
  if (!e) return "INVALID_END";

  const sTime = s.getTime();
  const eTime = e.getTime();

  if (sTime === eTime) return "START_EQUALS_END";
  if (sTime > eTime) return "START_AFTER_END";
  return null;
}

export function pushIfEmpty(
  issues: ValidationIssue[],
  field: string,
  value: string | undefined | null,
  message: string
) {
  if (!value || value.trim() === "") issues.push({ field, message });
}

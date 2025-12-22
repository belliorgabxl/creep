
export function parseTTL(ttl: string): number {
  const match = ttl.match(/^(\d+)(s|m|h|d)$/);
  if (!match) throw new Error("Invalid TTL format");

  const value = parseInt(match[1], 10);
  const unit = match[2];
  switch (unit) {
    case "s": return value;
    case "m": return value * 60;
    case "h": return value * 3600;
    case "d": return value * 86400;
    default: throw new Error("Invalid TTL unit");
  }
}
export const generateSixDigitCode = () => {
  return Math.floor(Math.random() * 1000000)
    .toString()
    .padStart(6, "0");
};

import "server-only";
import { headers } from "next/headers";

export async function getBaseUrl() {
  const h =  await headers();

  const host =
    h.get("x-forwarded-host") ??
    h.get("host");

  const proto =
    h.get("x-forwarded-proto") ??
    "http";

  if (host) {
    return `${proto}://${host}`;
  }

  return process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
}

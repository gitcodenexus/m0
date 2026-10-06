export const CTA_URL = process.env.NEXT_PUBLIC_CTA_URL || "https://www.m0.org/";

const parsed = Number(process.env.NEXT_PUBLIC_LOAD_MS);
export const LOAD_MS = Number.isFinite(parsed) && parsed > 0 ? parsed : 3800;

export const CTA_TEXT = "CLICK HERE";

export const STATUS_MESSAGES = [
  "Starting up",
  "Loading assets",
  "Preparing experience",
  "Almost there",
] as const;

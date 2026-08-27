export const TIER_LIMITS = {
  free: { minutesPerMonth: 3, maxVideoSeconds: 120, languages: 5, watermark: true, priority: false },
  pro: { minutesPerMonth: 30, maxVideoSeconds: 900, languages: 999, watermark: false, priority: false },
  business: { minutesPerMonth: 120, maxVideoSeconds: 3600, languages: 999, watermark: false, priority: true },
  enterprise: { minutesPerMonth: 500, maxVideoSeconds: Infinity, languages: 999, watermark: false, priority: true },
} as const;

export type Tier = keyof typeof TIER_LIMITS;

export function canTranslate(tier: Tier, minutesUsed: number, videoDurationSeconds: number): { allowed: boolean; reason?: string } {
  const limits = TIER_LIMITS[tier];
  const videoDurationMinutes = videoDurationSeconds / 60;

  if (minutesUsed + videoDurationMinutes > limits.minutesPerMonth) {
    return { allowed: false, reason: "Monthly minute limit reached. Please upgrade your plan." };
  }

  if (videoDurationSeconds > limits.maxVideoSeconds) {
    return {
      allowed: false,
      reason: `Video exceeds ${limits.maxVideoSeconds / 60} minute limit for your plan. Please upgrade.`,
    };
  }

  return { allowed: true };
}

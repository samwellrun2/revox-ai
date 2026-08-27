interface UsageMeterProps {
  minutesUsed: number;
  minutesLimit: number;
  tier: string;
}

export function UsageMeter({ minutesUsed, minutesLimit, tier }: UsageMeterProps) {
  const percentage = Math.min((minutesUsed / minutesLimit) * 100, 100);
  const isNearLimit = percentage >= 80;
  const isAtLimit = percentage >= 100;

  return (
    <div className="p-4 rounded-card border border-brand-border bg-white">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium">Usage this month</span>
        <span className="text-xs bg-brand-primary/10 text-brand-primary px-2 py-0.5 rounded-full font-medium capitalize">
          {tier}
        </span>
      </div>
      <div className="flex items-baseline gap-1 mb-3">
        <span className="text-2xl font-bold">{minutesUsed.toFixed(1)}</span>
        <span className="text-sm text-brand-muted">/ {minutesLimit} min</span>
      </div>
      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            isAtLimit
              ? "bg-red-500"
              : isNearLimit
              ? "bg-amber-500"
              : "bg-brand-primary"
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {isNearLimit && !isAtLimit && (
        <p className="text-xs text-amber-600 mt-2">Running low on minutes. Consider upgrading.</p>
      )}
      {isAtLimit && (
        <p className="text-xs text-red-500 mt-2">Monthly limit reached. Upgrade to keep translating.</p>
      )}
    </div>
  );
}

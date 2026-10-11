import { formatPercent } from "@/lib/format";

const ChangeBadge = ({ change }: { change: number }) => {
  if (change > 0) {
    return (
      <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-brand-dark">
        ▲ {formatPercent(change)}%
      </span>
    );
  }

  if (change < 0) {
    return (
      <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-down">
        ▼ {formatPercent(change)}%
      </span>
    );
  }

  return (
    <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-500">
      — ০.০%
    </span>
  );
};

export default ChangeBadge;
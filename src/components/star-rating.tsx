"use client";

export function StarRating({
  rating,
  size = 14,
  className = "",
}: {
  rating: number;
  size?: number;
  className?: string;
}) {
  const stars = [1, 2, 3, 4, 5];
  return (
    <span
      className={`inline-flex items-center gap-0.5 ${className}`}
      aria-label={`${rating} out of 5 stars`}
    >
      {stars.map((s) => {
        const fill = Math.max(0, Math.min(1, rating - (s - 1)));
        return (
          <span
            key={s}
            className="relative inline-block"
            style={{ width: size, height: size }}
          >
            <Star size={size} className="text-black/15" filled />
            <span
              className="absolute inset-0 overflow-hidden"
              style={{ width: `${fill * 100}%` }}
            >
              <Star size={size} className="text-amber-500" filled />
            </span>
          </span>
        );
      })}
    </span>
  );
}

function Star({
  size,
  className,
  filled,
}: {
  size: number;
  className?: string;
  filled?: boolean;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      className={className}
      aria-hidden="true"
    >
      <path d="M12 2.5l2.9 6.2 6.6.7-4.9 4.6 1.3 6.5L12 17.9 6.1 21l1.3-6.5L2.5 9.9l6.6-.7L12 2.5z" />
    </svg>
  );
}

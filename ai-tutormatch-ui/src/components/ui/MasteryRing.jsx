// The signature visual motif of AI TutorMatch: a radial "mastery ring"
// used anywhere a percentage/score/risk needs to read at a glance —
// stat cards, performance rows, risk indicators.
export default function MasteryRing({ value = 0, size = 56, stroke = 6, color, label }) {
  const clamped = Math.max(0, Math.min(100, value));
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clamped / 100) * circumference;

  const ringColor =
    color ||
    (clamped >= 75 ? "var(--teal)" : clamped >= 45 ? "var(--accent-dark)" : "var(--coral)");

  return (
    <svg
      className="mastery-ring"
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      role="img"
      aria-label={label || `${clamped}%`}
    >
      <circle className="track" cx={size / 2} cy={size / 2} r={radius} />
      <circle
        className="progress"
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke={ringColor}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
      />
      <text x="50%" y="53%" textAnchor="middle" fontSize={size * 0.26}>
        {Math.round(clamped)}
      </text>
    </svg>
  );
}

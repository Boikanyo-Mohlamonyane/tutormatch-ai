import MasteryRing from "./MasteryRing";

export default function StatCard({ label, value, icon, ring, deltaText }) {
  return (
    <div className="stat-card">
      {typeof ring === "number" ? (
        <MasteryRing value={ring} />
      ) : (
        icon && (
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 10,
              background: "var(--accent-tint)",
              color: "var(--accent-ink)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            {icon}
          </div>
        )
      )}
      <div className="stat-card-body">
        <div className="stat-card-label">{label}</div>
        <div className="stat-card-value">{value}</div>
        {deltaText && <div className="stat-card-delta">{deltaText}</div>}
      </div>
    </div>
  );
}

const TONE_MAP = {
  approved: "teal",
  confirmed: "teal",
  active: "teal",
  completed: "teal",
  low: "teal",
  pending: "amber",
  medium: "amber",
  rejected: "coral",
  cancelled: "coral",
  canceled: "coral",
  high: "coral",
  critical: "coral",
  admin: "blue",
  tutor: "blue",
  student: "slate",
};

export default function Badge({ children, tone }) {
  const key = (tone || String(children)).toString().toLowerCase();
  const resolved = TONE_MAP[key] || "slate";
  return <span className={`badge badge-${resolved}`}>{children}</span>;
}

import { STATUS } from "../../constants/status.js";

export default function StatusBadge({ estado }) {
  const meta = STATUS[estado];
  if (!meta) return null;
  return (
    <span
      className="status-pill"
      style={{
        background: `${meta.color}22`,
        color: meta.color,
        borderColor: `${meta.color}55`,
      }}
    >
      {meta.label}
    </span>
  );
}

export default function Chip({ label, active, color, onClick }) {
  return (
    <button
      type="button"
      className={"chip" + (active ? " active" : "")}
      style={color ? { "--dot": color } : undefined}
      onClick={onClick}
    >
      {color && <span className="dot" />}
      {label}
    </button>
  );
}

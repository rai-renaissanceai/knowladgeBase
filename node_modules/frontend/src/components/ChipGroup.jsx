import Chip from "./Chip.jsx";

/**
 * items: [{ key, label, color? }]
 * activeKeys: Set of currently active keys
 * onToggle: (key) => void
 */
export default function ChipGroup({ items, activeKeys, onToggle }) {
  return (
    <div className="controls">
      {items.map((item) => (
        <Chip
          key={item.key}
          label={item.label}
          color={item.color}
          active={activeKeys.has(item.key)}
          onClick={() => onToggle(item.key)}
        />
      ))}
    </div>
  );
}

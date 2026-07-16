export default function StatTile({ num, label }) {
  return (
    <div className="stat">
      <div className="num">{num}</div>
      <div className="lbl">{label}</div>
    </div>
  );
}

export default function SearchInput({ value, onChange, placeholder }) {
  return (
    <div className="search">
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

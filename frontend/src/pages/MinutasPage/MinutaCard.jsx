import { PROJECTS } from "../../constants/projects.js";
import { API_BASE } from "../../config.js";

const MONTH_NAMES = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];

function formatDate(iso) {
  const [y, m, d] = iso.split("-").map(Number);
  return `${d} de ${MONTH_NAMES[m - 1]} ${y}`;
}

export default function MinutaCard({ minuta }) {
  return (
    <a className="card" href={`${API_BASE}/${minuta.file}`} target="_blank" rel="noopener noreferrer">
      <div className="card-top">
        <h3 className="card-title">{minuta.title}</h3>
        <span className="card-date">{formatDate(minuta.date)}</span>
      </div>
      <p className="card-desc">{minuta.desc}</p>
      <div className="tags">
        {minuta.tags.map((tag) => {
          const meta = PROJECTS[tag];
          if (!meta) return null;
          return (
            <span
              key={tag}
              className="tag"
              style={{
                "--tag-bg": `${meta.color}22`,
                "--tag-fg": meta.color,
                "--tag-border": `${meta.color}55`,
              }}
            >
              {meta.label}
            </span>
          );
        })}
      </div>
    </a>
  );
}

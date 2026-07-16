import StatusBadge from "./StatusBadge.jsx";
import { STATUS } from "../../constants/status.js";
import { PROJECTS } from "../../constants/projects.js";

export default function TaskCard({ task, onEdit, onDelete, onChangeEstado }) {
  return (
    <article className="card">
      <div className="card-top">
        <p className="card-title">{task.title}</p>
        <StatusBadge estado={task.estado} />
      </div>
      <div className="meta-row">
        <span className="meta-item">
          Responsable: <b>{task.responsable}</b>
        </span>
        <span className="meta-item">
          Fecha: <b>{task.fecha}</b>
        </span>
        {task.minuta && (
          <a
            className="meta-item"
            href={`/${task.minuta.file}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {task.minuta.title}
          </a>
        )}
      </div>
      {task.minuta && (
        <div className="tags">
          {task.minuta.tags.map((tag) => {
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
      )}
      <div className="card-actions">
        <select
          value={task.estado}
          onChange={(e) => onChangeEstado(task.id, e.target.value)}
          aria-label="Cambiar estado"
        >
          {Object.entries(STATUS).map(([key, meta]) => (
            <option key={key} value={key}>
              {meta.label}
            </option>
          ))}
        </select>
        <button type="button" className="btn" onClick={() => onEdit(task)}>
          Editar
        </button>
        <button type="button" className="btn danger" onClick={() => onDelete(task.id)}>
          Eliminar
        </button>
      </div>
    </article>
  );
}

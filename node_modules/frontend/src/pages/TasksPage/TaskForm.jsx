import { useState } from "react";
import { STATUS } from "../../constants/status.js";

const emptyForm = {
  title: "",
  responsable: "",
  fecha: "Por definir",
  estado: "pendiente",
  minutaId: "",
};

export default function TaskForm({ task, minutas, onSubmit, onCancel }) {
  const [form, setForm] = useState(
    task
      ? {
          title: task.title,
          responsable: task.responsable,
          fecha: task.fecha,
          estado: task.estado,
          minutaId: task.minuta?.id ?? "",
        }
      : emptyForm
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await onSubmit({
        title: form.title.trim(),
        responsable: form.responsable.trim(),
        fecha: form.fecha.trim() || "Por definir",
        estado: form.estado,
        minutaId: form.minutaId ? Number(form.minutaId) : null,
      });
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  }

  return (
    <div className="modal-backdrop" onClick={onCancel}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>{task ? "Editar tarea" : "Nueva tarea"}</h2>
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="title">Título</label>
            <input
              id="title"
              required
              value={form.title}
              onChange={(e) => update("title", e.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="responsable">Responsable</label>
            <input
              id="responsable"
              required
              value={form.responsable}
              onChange={(e) => update("responsable", e.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="fecha">Fecha compromiso</label>
            <input
              id="fecha"
              value={form.fecha}
              onChange={(e) => update("fecha", e.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="estado">Estado</label>
            <select id="estado" value={form.estado} onChange={(e) => update("estado", e.target.value)}>
              {Object.entries(STATUS).map(([key, meta]) => (
                <option key={key} value={key}>
                  {meta.label}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="minuta">Minuta de origen (opcional)</label>
            <select id="minuta" value={form.minutaId} onChange={(e) => update("minutaId", e.target.value)}>
              <option value="">Sin minuta</option>
              {minutas.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.title}
                </option>
              ))}
            </select>
          </div>

          {error && <p style={{ color: "#ff8f8f", fontSize: "0.85rem" }}>{error}</p>}

          <div className="modal-actions">
            <button type="button" className="btn" onClick={onCancel} disabled={saving}>
              Cancelar
            </button>
            <button type="submit" className="btn primary" disabled={saving}>
              {saving ? "Guardando…" : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

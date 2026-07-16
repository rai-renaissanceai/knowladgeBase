import { Router } from "express";
import { db } from "../db.js";
import { splitOwners } from "../lib/owners.js";
import { taskCreateSchema, taskUpdateSchema } from "../lib/validation.js";

export const tasksRouter = Router();

const SELECT_JOIN = `
  SELECT
    t.id AS id, t.title AS title, t.responsable AS responsable, t.fecha AS fecha,
    t.estado AS estado, t.created_at AS created_at, t.updated_at AS updated_at,
    m.id AS m_id, m.file AS m_file, m.title AS m_title, m.date AS m_date, m.tags AS m_tags
  FROM tasks t
  LEFT JOIN minutas m ON m.id = t.minuta_id
`;

function serialize(row) {
  return {
    id: row.id,
    title: row.title,
    responsable: row.responsable,
    owners: splitOwners(row.responsable),
    fecha: row.fecha,
    estado: row.estado,
    minuta: row.m_id
      ? {
          id: row.m_id,
          file: row.m_file,
          title: row.m_title,
          date: row.m_date,
          tags: JSON.parse(row.m_tags),
        }
      : null,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

tasksRouter.get("/", (req, res) => {
  const rows = db.prepare(`${SELECT_JOIN} ORDER BY t.created_at DESC`).all();
  res.json(rows.map(serialize));
});

tasksRouter.get("/:id", (req, res) => {
  const row = db.prepare(`${SELECT_JOIN} WHERE t.id = ?`).get(req.params.id);
  if (!row) return res.status(404).json({ error: "Tarea no encontrada" });
  res.json(serialize(row));
});

tasksRouter.post("/", (req, res) => {
  const parsed = taskCreateSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues });
  }
  const { title, responsable, fecha, estado, minutaId } = parsed.data;
  const result = db
    .prepare(
      "INSERT INTO tasks (minuta_id, title, responsable, fecha, estado) VALUES (?, ?, ?, ?, ?)"
    )
    .run(minutaId ?? null, title, responsable, fecha, estado);
  const row = db.prepare(`${SELECT_JOIN} WHERE t.id = ?`).get(Number(result.lastInsertRowid));
  res.status(201).json(serialize(row));
});

tasksRouter.patch("/:id", (req, res) => {
  const existing = db.prepare("SELECT id FROM tasks WHERE id = ?").get(req.params.id);
  if (!existing) return res.status(404).json({ error: "Tarea no encontrada" });

  const parsed = taskUpdateSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues });
  }

  const fields = parsed.data;
  const columns = {
    title: fields.title,
    responsable: fields.responsable,
    fecha: fields.fecha,
    estado: fields.estado,
    minuta_id: "minutaId" in fields ? fields.minutaId ?? null : undefined,
  };

  const sets = [];
  const values = [];
  for (const [col, val] of Object.entries(columns)) {
    if (val !== undefined) {
      sets.push(`${col} = ?`);
      values.push(val);
    }
  }

  if (sets.length > 0) {
    sets.push("updated_at = datetime('now')");
    values.push(req.params.id);
    db.prepare(`UPDATE tasks SET ${sets.join(", ")} WHERE id = ?`).run(...values);
  }

  const row = db.prepare(`${SELECT_JOIN} WHERE t.id = ?`).get(req.params.id);
  res.json(serialize(row));
});

tasksRouter.delete("/:id", (req, res) => {
  const result = db.prepare("DELETE FROM tasks WHERE id = ?").run(req.params.id);
  if (result.changes === 0) return res.status(404).json({ error: "Tarea no encontrada" });
  res.status(204).end();
});

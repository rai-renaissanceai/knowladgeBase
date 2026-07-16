import { Router } from "express";
import { db } from "../db.js";

export const minutasRouter = Router();

function serialize(row) {
  return {
    id: row.id,
    file: row.file,
    title: row.title,
    date: row.date,
    desc: row.desc,
    tags: JSON.parse(row.tags),
    hasPmo: Boolean(row.has_pmo),
  };
}

minutasRouter.get("/", (req, res) => {
  const rows = db.prepare("SELECT * FROM minutas ORDER BY date DESC").all();
  res.json(rows.map(serialize));
});

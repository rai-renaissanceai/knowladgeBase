import { DatabaseSync } from "node:sqlite";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// On Railway, mount a Volume (e.g. at /data) and set SQLITE_DATA_DIR to that path
// so the database survives redeploys/restarts. Defaults to a local folder for dev.
const dataDir = process.env.SQLITE_DATA_DIR ?? path.join(__dirname, "..", "data");
fs.mkdirSync(dataDir, { recursive: true });

const dbPath = path.join(dataDir, "rai.sqlite3");
export const db = new DatabaseSync(dbPath);

export function initSchema() {
  db.exec(`
  CREATE TABLE IF NOT EXISTS minutas (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    file       TEXT NOT NULL UNIQUE,
    title      TEXT NOT NULL,
    date       TEXT NOT NULL,
    desc       TEXT NOT NULL DEFAULT '',
    tags       TEXT NOT NULL DEFAULT '[]',
    has_pmo    INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS tasks (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    minuta_id   INTEGER REFERENCES minutas(id) ON DELETE SET NULL,
    title       TEXT NOT NULL,
    responsable TEXT NOT NULL,
    fecha       TEXT NOT NULL DEFAULT 'Por definir',
    estado      TEXT NOT NULL DEFAULT 'pendiente'
                CHECK (estado IN ('pendiente','seguimiento','completado')),
    created_at  TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at  TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE INDEX IF NOT EXISTS idx_tasks_minuta_id ON tasks(minuta_id);
  CREATE INDEX IF NOT EXISTS idx_tasks_estado    ON tasks(estado);
`);
}

initSchema();

import express from "express";
import cors from "cors";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { tasksRouter } from "./routes/tasks.routes.js";
import { minutasRouter } from "./routes/minutas.routes.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.join(__dirname, "..", "..");

const app = express();
const PORT = process.env.PORT ?? process.env.BACKEND_PORT ?? 4000;

const allowedOrigins = (process.env.FRONTEND_ORIGIN ?? "http://localhost:5173")
  .split(",")
  .map((o) => o.trim());
app.use(cors({ origin: allowedOrigins }));
app.use(express.json());

app.use("/api/tasks", tasksRouter);
app.use("/api/minutas", minutasRouter);
app.use("/minutas", express.static(path.join(repoRoot, "minutas")));

app.listen(PORT, () => {
  console.log(`RAI backend escuchando en http://localhost:${PORT}`);
});

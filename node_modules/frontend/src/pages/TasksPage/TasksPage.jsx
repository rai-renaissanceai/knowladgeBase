import { useEffect, useMemo, useState } from "react";
import NavBar from "../../components/NavBar.jsx";
import EmptyState from "../../components/EmptyState.jsx";
import FilterBar from "./FilterBar.jsx";
import StatTile from "./StatTile.jsx";
import TaskCard from "./TaskCard.jsx";
import TaskForm from "./TaskForm.jsx";
import { PROJECTS } from "../../constants/projects.js";
import { STATUS } from "../../constants/status.js";
import { listTasks, createTask, updateTask, deleteTask } from "../../api/tasks.js";
import { listMinutas } from "../../api/minutas.js";

const STATUS_ITEMS = Object.entries(STATUS).map(([key, meta]) => ({
  key,
  label: meta.label,
  color: meta.color,
}));
const PROJECT_ITEMS = Object.entries(PROJECTS).map(([key, meta]) => ({
  key,
  label: meta.label,
  color: meta.color,
}));

const MONTH_NAMES = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];

function formatDate(iso) {
  const [y, m, d] = iso.split("-").map(Number);
  return `${d} de ${MONTH_NAMES[m - 1]} ${y}`;
}

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [minutas, setMinutas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [activeStatus, setActiveStatus] = useState(new Set());
  const [activeProjects, setActiveProjects] = useState(new Set());
  const [activeOwners, setActiveOwners] = useState(new Set());
  const [search, setSearch] = useState("");

  const [editingTask, setEditingTask] = useState(null);
  const [creating, setCreating] = useState(false);

  function reload() {
    setLoading(true);
    return Promise.all([listTasks(), listMinutas()])
      .then(([t, m]) => {
        setTasks(t);
        setMinutas(m);
        setError(null);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    reload();
  }, []);

  const ownerItems = useMemo(() => {
    const owners = new Set(tasks.flatMap((t) => t.owners));
    return [...owners].sort().map((o) => ({ key: o, label: o }));
  }, [tasks]);

  function toggleSet(setter) {
    return (key) => {
      setter((prev) => {
        const next = new Set(prev);
        if (next.has(key)) next.delete(key);
        else next.add(key);
        return next;
      });
    };
  }

  const items = useMemo(() => {
    const term = search.trim().toLowerCase();
    return tasks.filter((t) => {
      const matchesStatus = activeStatus.size === 0 || activeStatus.has(t.estado);
      const tags = t.minuta?.tags ?? [];
      const matchesProject = activeProjects.size === 0 || tags.some((tag) => activeProjects.has(tag));
      const matchesOwner = activeOwners.size === 0 || t.owners.some((o) => activeOwners.has(o));
      const haystack = `${t.title} ${t.responsable} ${t.minuta?.title ?? ""}`.toLowerCase();
      const matchesSearch = !term || haystack.includes(term);
      return matchesStatus && matchesProject && matchesOwner && matchesSearch;
    });
  }, [tasks, activeStatus, activeProjects, activeOwners, search]);

  const groups = useMemo(() => {
    const map = new Map();
    for (const t of items) {
      const key = t.minuta ? t.minuta.file : "__sin_minuta__";
      if (!map.has(key)) map.set(key, { minuta: t.minuta ?? null, tasks: [] });
      map.get(key).tasks.push(t);
    }
    const groups = [...map.values()];
    groups.sort((a, b) => {
      if (!a.minuta) return 1;
      if (!b.minuta) return -1;
      return b.minuta.date.localeCompare(a.minuta.date);
    });
    return groups;
  }, [items]);

  const stats = useMemo(() => {
    const total = tasks.length;
    const byEstado = {};
    for (const key of Object.keys(STATUS)) {
      byEstado[key] = tasks.filter((t) => t.estado === key).length;
    }
    return { total, byEstado };
  }, [tasks]);

  async function handleCreate(payload) {
    await createTask(payload);
    setCreating(false);
    await reload();
  }

  async function handleUpdate(payload) {
    await updateTask(editingTask.id, payload);
    setEditingTask(null);
    await reload();
  }

  async function handleDelete(id) {
    if (!window.confirm("¿Eliminar esta tarea?")) return;
    await deleteTask(id);
    await reload();
  }

  async function handleChangeEstado(id, estado) {
    await updateTask(id, { estado });
    await reload();
  }

  return (
    <>
      <section className="hero">
        <NavBar />
        <p className="eyebrow">Tareas pendientes</p>
        <h1>Registro operativo PMO</h1>
        <p className="subtitle">
          Todas las tareas con responsable asignado, respaldadas en base de datos: crea, edita,
          cambia estado o elimina directamente desde aquí.
        </p>

        <div className="stats">
          <StatTile num={stats.total} label="Total" />
          {Object.entries(STATUS).map(([key, meta]) => (
            <StatTile key={key} num={stats.byEstado[key] ?? 0} label={meta.label} />
          ))}
        </div>

        <FilterBar
          statusItems={STATUS_ITEMS}
          activeStatus={activeStatus}
          onToggleStatus={toggleSet(setActiveStatus)}
          projectItems={PROJECT_ITEMS}
          activeProjects={activeProjects}
          onToggleProject={toggleSet(setActiveProjects)}
          ownerItems={ownerItems}
          activeOwners={activeOwners}
          onToggleOwner={toggleSet(setActiveOwners)}
          search={search}
          onSearchChange={setSearch}
        />

        <div className="card-actions" style={{ marginTop: 20 }}>
          <button type="button" className="btn primary" onClick={() => setCreating(true)}>
            + Nueva tarea
          </button>
        </div>
      </section>

      {loading && <p className="count">Cargando…</p>}
      {error && <EmptyState message={`Error al cargar tareas: ${error}`} />}

      {!loading && !error && (
        <>
          <p className="count">
            {items.length} tarea{items.length === 1 ? "" : "s"}
          </p>
          {items.length === 0 ? (
            <EmptyState message="No hay tareas que coincidan con este filtro." />
          ) : (
            groups.map((group) => (
              <div className="group" key={group.minuta ? group.minuta.file : "__sin_minuta__"}>
                <div className="group-header">
                  <span className="group-title">
                    {group.minuta ? (
                      <a href={`/${group.minuta.file}`} target="_blank" rel="noopener noreferrer">
                        {group.minuta.title}
                      </a>
                    ) : (
                      "Sin minuta de origen"
                    )}
                  </span>
                  {group.minuta && <span className="group-date">{formatDate(group.minuta.date)}</span>}
                </div>
                <div className="cards">
                  {group.tasks.map((t) => (
                    <TaskCard
                      key={t.id}
                      task={t}
                      onEdit={setEditingTask}
                      onDelete={handleDelete}
                      onChangeEstado={handleChangeEstado}
                    />
                  ))}
                </div>
              </div>
            ))
          )}
        </>
      )}

      <footer>
        RAI — tareas consolidadas a partir del registro operativo PMO, respaldadas en SQLite
      </footer>

      {creating && (
        <TaskForm minutas={minutas} onSubmit={handleCreate} onCancel={() => setCreating(false)} />
      )}
      {editingTask && (
        <TaskForm
          task={editingTask}
          minutas={minutas}
          onSubmit={handleUpdate}
          onCancel={() => setEditingTask(null)}
        />
      )}
    </>
  );
}

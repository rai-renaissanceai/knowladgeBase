import { useEffect, useMemo, useState } from "react";
import NavBar from "../../components/NavBar.jsx";
import ChipGroup from "../../components/ChipGroup.jsx";
import SearchInput from "../../components/SearchInput.jsx";
import EmptyState from "../../components/EmptyState.jsx";
import MinutaCard from "./MinutaCard.jsx";
import { PROJECTS } from "../../constants/projects.js";
import { listMinutas } from "../../api/minutas.js";

const MONTH_NAMES = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];

const PROJECT_ITEMS = Object.entries(PROJECTS).map(([key, meta]) => ({
  key,
  label: meta.label,
  color: meta.color,
}));

export default function MinutasPage() {
  const [minutas, setMinutas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTags, setActiveTags] = useState(new Set());
  const [search, setSearch] = useState("");

  useEffect(() => {
    listMinutas()
      .then(setMinutas)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  function toggleTag(key) {
    setActiveTags((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  const items = useMemo(() => {
    const term = search.trim().toLowerCase();
    return minutas
      .filter((m) => {
        const matchesTag = activeTags.size === 0 || m.tags.some((t) => activeTags.has(t));
        const haystack = `${m.title} ${m.desc}`.toLowerCase();
        const matchesSearch = !term || haystack.includes(term);
        return matchesTag && matchesSearch;
      })
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [minutas, activeTags, search]);

  const groups = useMemo(() => {
    const map = new Map();
    for (const m of items) {
      const key = m.date.slice(0, 7);
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(m);
    }
    return [...map.entries()];
  }, [items]);

  return (
    <>
      <section className="hero">
        <NavBar />
        <p className="eyebrow">Índice de minutas</p>
        <h1>Minutas de sesiones</h1>
        <p className="subtitle">
          Todas las minutas generadas después de cada sesión, filtrables por proyecto y ordenadas
          por fecha.
        </p>

        <div className="filter-group">
          <ChipGroup items={PROJECT_ITEMS} activeKeys={activeTags} onToggle={toggleTag} />
        </div>

        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Buscar por título o palabra clave…"
        />
      </section>

      {loading && <p className="count">Cargando…</p>}
      {error && <EmptyState message={`Error al cargar minutas: ${error}`} />}

      {!loading && !error && (
        <>
          <p className="count">
            {items.length} minuta{items.length === 1 ? "" : "s"}
          </p>
          <div>
            {items.length === 0 ? (
              <EmptyState message="No hay minutas que coincidan con este filtro." />
            ) : (
              groups.map(([key, group]) => {
                const [y, mo] = key.split("-").map(Number);
                return (
                  <div className="group" key={key}>
                    <p className="group-title">
                      {MONTH_NAMES[mo - 1]} {y}
                    </p>
                    <div className="cards">
                      {group.map((m) => (
                        <MinutaCard key={m.file} minuta={m} />
                      ))}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </>
      )}

      <footer>
        RAI — archivo generado a partir de las minutas en <code>/minutas</code>
      </footer>
    </>
  );
}

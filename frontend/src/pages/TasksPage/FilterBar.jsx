import ChipGroup from "../../components/ChipGroup.jsx";
import SearchInput from "../../components/SearchInput.jsx";

export default function FilterBar({
  statusItems, activeStatus, onToggleStatus,
  projectItems, activeProjects, onToggleProject,
  ownerItems, activeOwners, onToggleOwner,
  search, onSearchChange,
}) {
  return (
    <>
      <div className="filter-group">
        <p className="filter-label">Estado</p>
        <ChipGroup items={statusItems} activeKeys={activeStatus} onToggle={onToggleStatus} />
      </div>

      <div className="filter-group">
        <p className="filter-label">Proyecto</p>
        <ChipGroup items={projectItems} activeKeys={activeProjects} onToggle={onToggleProject} />
      </div>

      <div className="filter-group">
        <p className="filter-label">Responsable</p>
        <ChipGroup items={ownerItems} activeKeys={activeOwners} onToggle={onToggleOwner} />
      </div>

      <SearchInput
        value={search}
        onChange={onSearchChange}
        placeholder="Buscar por tarea, responsable o minuta…"
      />
    </>
  );
}

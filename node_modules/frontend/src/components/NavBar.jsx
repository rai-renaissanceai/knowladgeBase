import { Link, useLocation } from "react-router-dom";

export default function NavBar() {
  const { pathname } = useLocation();
  const onTasks = pathname.startsWith("/tareas");

  return (
    <div className="brand-row">
      <div className="brand">
        <div className="brand-mark">RAI</div>
        <span>Archivo interno RAI</span>
      </div>
      {onTasks ? (
        <Link className="back-link" to="/">
          &larr; Índice de minutas
        </Link>
      ) : (
        <Link className="back-link" to="/tareas">
          Tareas pendientes &rarr;
        </Link>
      )}
    </div>
  );
}

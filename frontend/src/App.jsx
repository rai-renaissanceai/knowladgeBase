import { BrowserRouter, Routes, Route } from "react-router-dom";
import MinutasPage from "./pages/MinutasPage/MinutasPage.jsx";
import TasksPage from "./pages/TasksPage/TasksPage.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <div className="page">
        <Routes>
          <Route path="/" element={<MinutasPage />} />
          <Route path="/tareas" element={<TasksPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

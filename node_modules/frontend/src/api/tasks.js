import { api } from "./client.js";

export const listTasks = () => api.get("/tasks");
export const createTask = (task) => api.post("/tasks", task);
export const updateTask = (id, patch) => api.patch(`/tasks/${id}`, patch);
export const deleteTask = (id) => api.delete(`/tasks/${id}`);

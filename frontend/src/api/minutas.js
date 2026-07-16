import { api } from "./client.js";

export const listMinutas = () => api.get("/minutas");

// In dev, VITE_API_URL is unset so this is "" and requests go through the Vite proxy
// (see vite.config.js) to http://localhost:4000. In production (e.g. Vercel), set
// VITE_API_URL to the externally-hosted backend's origin, e.g. https://api.example.com
export const API_BASE = import.meta.env.VITE_API_URL ?? "";

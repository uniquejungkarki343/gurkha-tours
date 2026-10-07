import axios from "axios";
import { packages } from "./data";
// Mock backend: an Axios instance whose adapter answers locally, so the app runs with no server.
// To use a real API, delete `adapter` and set baseURL.
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const adapter = async (config) => {
  await wait(150);
  const url = config.url;
  const ok = (data) => ({ data, status: 200, statusText: "OK", headers: {}, config });
  const fail = (status, message) => Promise.reject(Object.assign(new Error(message), { response: { status, data: { message } }, config }));
  if (url === "/packages") return ok(packages);
  const m = url.match(/^\/packages\/(\d+)$/);
  if (m) { const found = packages.find((x) => x.id === +m[1]); return found ? ok(found) : fail(404, "Package not found"); }
  if (url === "/bookings") return ok({ reference: "GT-" + Math.random().toString(36).slice(2, 8).toUpperCase(), ...JSON.parse(config.data) });
  return fail(404, "Not found");
};
const api = axios.create({ adapter });
export const getPackages = () => api.get("/packages").then((r) => r.data);
export const getPackage = (id) => api.get(`/packages/${id}`).then((r) => r.data);
export const createBooking = (b) => api.post("/bookings", b).then((r) => r.data);
export const errorMessage = (e) => e?.response?.data?.message || "Something went wrong. Please try again.";

import { createContext, useContext, useState } from "react";
const Ctx = createContext(null);
export const useAuth = () => useContext(Ctx);
const read = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } };
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => read("gt_user", null));
  const register = (name, email, password) => {
    const users = read("gt_users", []);
    if (users.some((u) => u.email === email)) throw new Error("An account with this email already exists.");
    localStorage.setItem("gt_users", JSON.stringify([...users, { name, email, password }]));
    login(email, password);
  };
  const login = (email, password) => {
    const u = read("gt_users", []).find((x) => x.email === email && x.password === password);
    if (!u) throw new Error("Incorrect email or password.");
    const session = { name: u.name, email: u.email };
    localStorage.setItem("gt_user", JSON.stringify(session));
    setUser(session);
  };
  const logout = () => { localStorage.removeItem("gt_user"); setUser(null); };
  return <Ctx.Provider value={{ user, register, login, logout }}>{children}</Ctx.Provider>;
}

import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../auth";
export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const link = ({ isActive }) => "py-1 " + (isActive ? "text-teal-300" : "text-slate-200 hover:text-white");
  const close = () => setOpen(false);
  return (
    <header className="sticky top-0 z-30 bg-ink shadow">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" onClick={close} className="font-display text-xl font-bold text-white">Gurkha <span className="text-teal-300">Tours</span></Link>
        <button className="text-2xl text-white md:hidden" aria-label="Menu" onClick={() => setOpen(!open)}>{open ? "✕" : "☰"}</button>
        <nav className={`${open ? "flex" : "hidden"} absolute left-0 top-full w-full flex-col gap-3 bg-ink px-4 pb-4 md:static md:flex md:w-auto md:flex-row md:items-center md:gap-6 md:p-0`}>
          <NavLink to="/" end className={link} onClick={close}>Home</NavLink>
          <NavLink to="/packages" className={link} onClick={close}>Packages</NavLink>
          {user && <NavLink to="/trips" className={link} onClick={close}>My bookings</NavLink>}
          {user ? (
            <button className="btn" onClick={() => { close(); nav("/"); logout(); }}>Logout ({user.name.split(" ")[0]})</button>
          ) : (
            <Link to="/login" className="btn" onClick={close}>Login</Link>
          )}
        </nav>
      </div>
    </header>
  );
}

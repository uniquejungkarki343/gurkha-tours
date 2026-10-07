import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Packages from "./pages/Packages";
import Details from "./pages/Details";
import { Login, Register } from "./pages/AuthPages";
import { useAuth } from "./auth";

function Protected({ children }) {
  const { user } = useAuth();
  const loc = useLocation();
  return user ? children : <Navigate to="/login" state={{ from: loc.pathname }} replace />;
}
export default function App() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/packages" element={<Packages />} />
          <Route path="/packages/:id" element={<Details />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/trips" element={<Protected><Trips /></Protected>} />
          <Route path="*" element={<div className="p-16 text-center"><h1 className="font-display text-3xl">Page not found</h1></div>} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
function Trips() {
  const { user } = useAuth();
  const trips = JSON.parse(localStorage.getItem("gt_trips_" + user.email) || "[]");
  return (
    <section className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="font-display text-3xl text-ink">My bookings</h1>
      {trips.length === 0 ? <p className="mt-4 text-slate-500">No bookings yet. Pick a trip and it will show up here.</p> : (
        <ul className="mt-6 space-y-3">
          {trips.map((t) => (
            <li key={t.reference} className="rounded-xl bg-white p-4 shadow-sm">
              <p className="font-semibold text-ink">{t.title}</p>
              <p className="text-sm text-slate-500">{t.reference} · {t.date} · {t.guests} guest(s) · NPR {t.total}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

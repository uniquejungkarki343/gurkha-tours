import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { createBooking, errorMessage, getPackage } from "../api";
import { useAuth } from "../auth";
import useFetch from "../components/useFetch";
import { Cover } from "../components/PackageCard";
import { Loading, ErrorBox } from "../components/Status";
export default function Details() {
  const { id } = useParams();
  const { data: pkg, loading, error, retry } = useFetch(() => getPackage(id), [id], "package-" + id);
  if (loading) return <Loading />;
  if (error) return <div><ErrorBox message={error} retry={retry} /><p className="text-center"><Link to="/packages" className="text-brand underline">Back to all trips</Link></p></div>;
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <Link to="/packages" className="text-sm text-brand">← All trips</Link>
      <Cover category={pkg.category} location={pkg.location} className="mt-3 h-56 rounded-2xl md:h-72" />
      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_340px]">
        <div>
          <p className="text-sm font-semibold text-brand">{pkg.category} · {pkg.location}</p>
          <h1 className="font-display text-3xl text-ink md:text-4xl">{pkg.title}</h1>
          <p className="mt-1 text-sm text-slate-500">★ {pkg.rating} · {pkg.days} days · {pkg.difficulty}</p>
          <p className="mt-4 text-lg">{pkg.summary}</p>
          <h2 className="mt-8 font-display text-xl text-ink">Highlights</h2>
          <ul className="mt-2 grid gap-2 sm:grid-cols-2">{pkg.highlights.map((h) => <li key={h} className="rounded-lg bg-teal-50 px-3 py-2 text-teal-900">✓ {h}</li>)}</ul>
          <h2 className="mt-8 font-display text-xl text-ink">Day by day</h2>
          <ol className="mt-3 space-y-2">{pkg.itinerary.map((d, i) => (
            <li key={i} className="flex gap-3 rounded-lg bg-white p-3 shadow-sm"><span className="font-bold text-brand">Day {i + 1}</span><span>{d}</span></li>
          ))}</ol>
        </div>
        <BookingForm pkg={pkg} />
      </div>
    </div>
  );
}
function BookingForm({ pkg }) {
  const { user } = useAuth();
  const nav = useNavigate();
  const [f, setF] = useState({ date: "", guests: 1, phone: "" });
  const [errs, setErrs] = useState({});
  const [state, setState] = useState({ busy: false, done: null, error: "" });
  const total = pkg.price * (+f.guests || 0);
  const today = new Date().toISOString().slice(0, 10);
  const validate = () => {
    const e = {};
    if (!f.date) e.date = "Choose a start date."; else if (f.date < today) e.date = "Date can't be in the past.";
    if (!(+f.guests >= 1 && +f.guests <= 12)) e.guests = "Guests must be between 1 and 12.";
    if (!/^[0-9+\-\s]{7,15}$/.test(f.phone)) e.phone = "Enter a valid phone number.";
    return e;
  };
  if (!user) return (
    <aside className="h-fit rounded-2xl bg-white p-5 shadow"><p className="font-display text-2xl text-ink">NPR {pkg.price}<span className="text-sm text-slate-400"> / person</span></p>
      <p className="mt-3 text-sm text-slate-600">Log in to book this trip.</p>
      <button className="btn mt-4 w-full" onClick={() => nav("/login", { state: { from: `/packages/${pkg.id}` } })}>Login to book</button></aside>
  );
  const submit = async (ev) => {
    ev.preventDefault();
    const e = validate(); setErrs(e);
    if (Object.keys(e).length) return;
    setState({ busy: true, done: null, error: "" });
    try {
      const b = await createBooking({ packageId: pkg.id, title: pkg.title, ...f, total, email: user.email });
      const key = "gt_trips_" + user.email;
      localStorage.setItem(key, JSON.stringify([b, ...JSON.parse(localStorage.getItem(key) || "[]")]));
      setState({ busy: false, done: b, error: "" });
    } catch (err) { setState({ busy: false, done: null, error: errorMessage(err) }); }
  };
  if (state.done) return (
    <aside className="h-fit rounded-2xl bg-teal-50 p-5 text-center shadow"><p className="text-4xl">🎉</p>
      <p className="mt-2 font-display text-xl text-ink">Booking confirmed</p>
      <p className="text-sm text-slate-600">Reference <b>{state.done.reference}</b></p>
      <button className="btn mt-4" onClick={() => nav("/trips")}>View my bookings</button></aside>
  );
  const field = (k, label, props) => (
    <label className="block text-sm font-medium">{label}
      <input className={`input mt-1 ${errs[k] ? "border-red-400" : ""}`} value={f[k]} onChange={(e) => setF({ ...f, [k]: e.target.value })} {...props} />
      {errs[k] && <span className="text-xs text-red-600">{errs[k]}</span>}
    </label>
  );
  return (
    <form onSubmit={submit} noValidate className="h-fit space-y-3 rounded-2xl bg-white p-5 shadow lg:sticky lg:top-20">
      <p className="font-display text-2xl text-ink">NPR {pkg.price}<span className="text-sm text-slate-400"> / person</span></p>
      {field("date", "Start date", { type: "date", min: today })}
      {field("guests", "Guests", { type: "number", min: 1, max: 12 })}
      {field("phone", "Phone", { type: "tel", placeholder: "+977 98…" })}
      <p className="flex justify-between border-t pt-3 font-semibold text-ink"><span>Total</span><span>NPR {total}</span></p>
      {state.error && <p className="text-sm text-red-600">{state.error}</p>}
      <button className="btn w-full" disabled={state.busy}>{state.busy ? "Booking…" : "Book now"}</button>
    </form>
  );
}

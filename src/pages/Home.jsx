import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { categories, theme } from "../data";
import { getPackages } from "../api";
import useFetch from "../components/useFetch";
import PackageCard from "../components/PackageCard";
import { Loading, ErrorBox } from "../components/Status";
export default function Home() {
  const { data, loading, error, retry } = useFetch(getPackages, [], "packages");
  const [q, setQ] = useState("");
  const nav = useNavigate();
  const featured = data ? [...data].sort((a, b) => b.rating - a.rating).slice(0, 4) : [];
  return (
    <>
      <section className="bg-gradient-to-br from-ink via-slate-800 to-teal-800 px-4 py-20 text-center text-white">
        <h1 className="font-display text-4xl font-bold md:text-6xl">Nepal, planned properly.</h1>
        <p className="mx-auto mt-4 max-w-xl text-slate-200">Treks, temples, jungles and lakes, with local guides and no guesswork.</p>
        <form onSubmit={(e) => { e.preventDefault(); nav(`/packages?q=${encodeURIComponent(q)}`); }} className="mx-auto mt-8 flex max-w-lg gap-2">
          <input className="input text-slate-800" placeholder="Search Everest, Pokhara, Lumbini…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search trips" />
          <button className="btn">Search</button>
        </form>
      </section>
      <section className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="font-display text-2xl text-ink">Browse by kind of trip</h2>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
          {categories.map((c) => (
            <Link key={c} to={`/packages?category=${c}`} className="rounded-xl bg-white p-4 text-center shadow-sm transition hover:shadow-md">
              <div className="text-3xl">{theme[c][2]}</div><div className="mt-1 text-sm font-semibold text-ink">{c}</div>
            </Link>
          ))}
        </div>
        <h2 className="mt-14 font-display text-2xl text-ink">Top rated right now</h2>
        {loading ? <Loading /> : error ? <ErrorBox message={error} retry={retry} /> : (
          <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{featured.map((p) => <PackageCard key={p.id} pkg={p} />)}</div>
        )}
      </section>
    </>
  );
}

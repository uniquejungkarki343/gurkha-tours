import { useSearchParams } from "react-router-dom";
import { categories } from "../data";
import { getPackages } from "../api";
import useFetch from "../components/useFetch";
import PackageCard from "../components/PackageCard";
import { Loading, ErrorBox } from "../components/Status";
export default function Packages() {
  const { data, loading, error, retry } = useFetch(getPackages, [], "packages");
  const [sp, setSp] = useSearchParams();
  const q = sp.get("q") || "", category = sp.get("category") || "", sort = sp.get("sort") || "rating";
  const set = (k, v) => { const n = new URLSearchParams(sp); v ? n.set(k, v) : n.delete(k); setSp(n, { replace: true }); };
  const list = (data || [])
    .filter((p) => (!category || p.category === category) && `${p.title} ${p.location} ${p.category}`.toLowerCase().includes(q.toLowerCase()))
    .sort((a, b) => sort === "price" ? a.price - b.price : sort === "days" ? a.days - b.days : b.rating - a.rating);
  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="font-display text-3xl text-ink">All trips</h1>
      <div className="mt-5 grid gap-3 md:grid-cols-[1fr_180px_180px]">
        <input className="input" placeholder="Search by name or place" value={q} onChange={(e) => set("q", e.target.value)} aria-label="Search" />
        <select className="input" value={category} onChange={(e) => set("category", e.target.value)} aria-label="Category">
          <option value="">All categories</option>{categories.map((c) => <option key={c}>{c}</option>)}
        </select>
        <select className="input" value={sort} onChange={(e) => set("sort", e.target.value)} aria-label="Sort">
          <option value="rating">Top rated</option><option value="price">Lowest price</option><option value="days">Shortest trip</option>
        </select>
      </div>
      {loading ? <Loading /> : error ? <ErrorBox message={error} retry={retry} /> : list.length === 0 ? (
        <p className="py-16 text-center text-slate-500">No trips match your search. <button className="text-brand underline" onClick={() => setSp({})}>Clear filters</button></p>
      ) : (
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{list.map((p) => <PackageCard key={p.id} pkg={p} />)}</div>
      )}
    </section>
  );
}

import { useState } from "react";
import { Link } from "react-router-dom";
import { locationImages, theme } from "../data";
export function Cover({ category, location, className = "h-40" }) {
  const [a, b, emoji] = theme[category];
  const [imageFailed, setImageFailed] = useState(false);
  const image = locationImages[location];
  return (
    <div className={`relative isolate flex items-center justify-center overflow-hidden text-6xl ${className}`} style={{ background: `linear-gradient(135deg, ${a}, ${b})` }}>
      {image && !imageFailed && <img src={image} alt={`${location} travel destination`} loading="lazy" className="absolute inset-0 -z-10 h-full w-full object-cover" onError={() => setImageFailed(true)} />}
      {(!image || imageFailed) && <span aria-hidden="true">{emoji}</span>}
    </div>
  );
}
export default function PackageCard({ pkg }) {
  return (
    <Link to={`/packages/${pkg.id}`} className="group overflow-hidden rounded-2xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <Cover category={pkg.category} location={pkg.location} />
      <div className="p-4">
        <div className="flex items-center justify-between text-xs">
          <span className="rounded-full bg-teal-50 px-2 py-0.5 font-semibold text-teal-700">{pkg.category}</span>
          <span className="text-amber-600">★ {pkg.rating}</span>
        </div>
        <h3 className="mt-2 font-display text-lg text-ink group-hover:text-brand">{pkg.title}</h3>
        <p className="text-sm text-slate-500">{pkg.location} · {pkg.days} days · {pkg.difficulty}</p>
        <p className="mt-3 font-semibold text-ink">NPR {pkg.price} <span className="text-xs font-normal text-slate-400">per person</span></p>
      </div>
    </Link>
  );
}

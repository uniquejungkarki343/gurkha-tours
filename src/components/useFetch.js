import { useCallback, useEffect, useRef, useState } from "react";
import { errorMessage } from "../api";

const cache = new Map(); // shared across pages so revisiting a page shows data instantly

export default function useFetch(fn, deps = [], key) {
  const ticket = useRef(0);
  const fromCache = () => (key ? cache.get(key) : undefined);
  const [state, setState] = useState(() => ({ data: fromCache() ?? null, loading: fromCache() === undefined, error: "" }));

  const run = useCallback(() => {
    const id = ++ticket.current;
    const c = fromCache();
    setState({ data: c ?? null, loading: c === undefined, error: "" }); // show cached data now, refresh quietly
    fn()
      .then((data) => { if (id !== ticket.current) return; if (key) cache.set(key, data); setState({ data, loading: false, error: "" }); })
      .catch((e) => { if (id === ticket.current) setState({ data: null, loading: false, error: errorMessage(e) }); });
  }, deps); // eslint-disable-line

  useEffect(() => { run(); return () => { ticket.current++; }; }, [run]); // ignore late responses after leaving the page
  return { ...state, retry: run };
}

import { useEffect, useMemo, useRef, useState } from "react";
import { searchIndicators, searchLocations, type IndicatorItem, type LocationItem } from "../api/search";

function useDebouncedValue<T>(value: T, delayMs: number) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(t);
  }, [value, delayMs]);

  return debounced;
}

export function useHeaderSearch(query: string) {
  const q = useDebouncedValue(query.trim(), 300);

  const [loading, setLoading] = useState(false);
  const [locations, setLocations] = useState<LocationItem[]>([]);
  const [indicators, setIndicators] = useState<IndicatorItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  const requestIdRef = useRef(0);

  useEffect(() => {
    if (q.length < 2) {
      setLocations([]);
      setIndicators([]);
      setError(null);
      setLoading(false);
      return;
    }

    let cancelled = false;
    const requestId = ++requestIdRef.current;

    setLoading(true);
    setError(null);

    Promise.all([searchLocations(q, 8), searchIndicators(q, 8)])
      .then(([locs, inds]) => {
        if (cancelled) return;
        if (requestId !== requestIdRef.current) return;

        setLocations(locs);
        setIndicators(inds);
      })
      .catch((e) => {
        if (cancelled) return;
        setError(e?.message ?? "Search failed");
      })
      .finally(() => {
        if (cancelled) return;
        if (requestId !== requestIdRef.current) return;
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [q]);

  const hasResults = useMemo(
    () => locations.length > 0 || indicators.length > 0,
    [locations.length, indicators.length]
  );

  return { loading, error, locations, indicators, hasResults };
}
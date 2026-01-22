import { http } from "./http";

export type LocationItem = {
  id: number;
  iso3: string | null;
  name: string;
  region?: string | null;
  type?: string;
};

export type IndicatorItem = {
  id: number;
  code: string;
  name: string;
  domain?: { code: string; name: string };
};

export async function searchLocations(q: string, limit = 8) {
  const res = await http.get<{ total: number; items: LocationItem[] }>("/locations", {
    params: { q, limit, offset: 0 },
  });
  return res.data.items.filter((x) => x.iso3);
}

export async function searchIndicators(q: string, limit = 8) {
  const res = await http.get<{ total: number; items: any[] }>("/indicators", {
    params: { q, limit, offset: 0 },
  });

  return res.data.items.map((row) => ({
    id: row.id,
    code: row.code,
    name: row.name,
    domain: row.domain,
  })) as IndicatorItem[];
}

import { parseNumber } from "./format";

const BASE_URLS = [
  "https://openapi.programming-hero.com/api/bazardor",
  "https://api.api-store.workers.dev/api/bazardor",
  "https://api.abcz.workers.dev/api/bazardor",
];

export interface Market {
  name: string;
  area: string;
  price: number;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  emoji: string;
  unit: string;
  category: string;
  categoryName: string;
  description: string;
  price: number;
  change: number;
  minPrice: number;
  maxPrice: number;
  avgPrice: number;
  markets: Market[];
}

export interface Category {
  slug: string;
  title: string;
  icon: string;
}

// API may use different key names, so read the first one that exists
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const pick = (raw: any, keys: string[], fallback: any = undefined) => {
  for (const key of keys) {
    if (raw?.[key] !== undefined && raw?.[key] !== null) return raw[key];
  }
  return fallback;
};

// try main url first, then the alternative urls
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const request = async (path: string): Promise<any> => {
  for (const base of BASE_URLS) {
    try {
      const res = await fetch(`${base}${path}`, { cache: "no-store" });
      if (!res.ok) continue;
      return await res.json();
    } catch {
      continue;
    }
  }
  return null;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const toList = (data: any): any[] => {
  const list = data?.data ?? data?.products ?? data?.categories ?? data;
  return Array.isArray(list) ? list : [];
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const toProduct = (raw: any): Product => {
  const rawMarkets = pick(raw, ["markets", "bazars", "marketPrices", "prices"], []);
  const markets: Market[] = Array.isArray(rawMarkets)
    ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
      rawMarkets.map((m: any) => ({
        name: String(pick(m, ["name", "market", "marketName", "bazar", "title"], "")),
        area: String(pick(m, ["area", "district", "division", "location", "city"], "")),
        price: parseNumber(pick(m, ["price", "todayPrice", "value", "currentPrice"], 0)),
      }))
    : [];

  const price = parseNumber(
    pick(raw, ["price", "todayPrice", "currentPrice", "avgPrice", "averagePrice"], 0),
  );
  const prices = markets.map((m) => m.price).filter((p) => p > 0);

  const direction = String(pick(raw, ["trend", "direction", "changeType"], "")).toLowerCase();
  let change = parseNumber(
    pick(raw, ["change", "changePercent", "percentChange", "percent", "changePercentage"], 0),
  );
  if (change > 0 && ["down", "fall", "decrease"].includes(direction)) change = -change;

  const category = pick(raw, ["category", "categorySlug", "categoryId"], "");
  const categoryText =
    typeof category === "object" ? pick(category, ["slug", "id"], "") : category;
  const categoryName =
    typeof category === "object"
      ? pick(category, ["title", "name"], "")
      : pick(raw, ["categoryName", "categoryTitle"], categoryText);

  const id = String(pick(raw, ["id", "_id", "productId"], ""));

  return {
    id,
    slug: String(pick(raw, ["slug"], id)),
    name: String(pick(raw, ["name", "title", "productName"], "")),
    emoji: String(pick(raw, ["emoji", "icon", "image"], "🛒")),
    unit: String(pick(raw, ["unit", "unitName", "per"], "প্রতি কেজি")),
    category: String(categoryText),
    categoryName: String(categoryName),
    description: String(pick(raw, ["description", "summary", "subtitle", "details"], "")),
    price: price || (prices.length ? Math.round(prices.reduce((a, b) => a + b, 0) / prices.length) : 0),
    change,
    minPrice: parseNumber(pick(raw, ["minPrice", "min", "lowestPrice"], prices.length ? Math.min(...prices) : price)),
    maxPrice: parseNumber(pick(raw, ["maxPrice", "max", "highestPrice"], prices.length ? Math.max(...prices) : price)),
    avgPrice: parseNumber(pick(raw, ["avgPrice", "averagePrice", "avg"], price)),
    markets,
  };
};

export const getProducts = async (category?: string): Promise<Product[]> => {
  const query = category ? `?category=${encodeURIComponent(category)}` : "";
  const data = await request(`/products${query}`);
  return toList(data).map(toProduct);
};

export const getProduct = async (slug: string): Promise<Product | null> => {
  const data = await request(`/products/${encodeURIComponent(slug)}`);
  const raw = data?.data ?? data?.product;

  if (raw && !Array.isArray(raw) && typeof raw === "object") {
    return toProduct(raw);
  }


  const all = await getProducts();
  return all.find((p) => p.slug === slug || p.id === slug) ?? null;
};

export const getCategories = async (): Promise<Category[]> => {
  const data = await request("/categories");
  return toList(data).map((c) => ({
    slug: String(pick(c, ["slug", "id"], "")),
    title: String(pick(c, ["title", "name", "label"], "")),
    icon: String(pick(c, ["icon", "emoji"], "🛒")),
  }));
};

export const getCategory = async (slug: string): Promise<Category | null> => {
  const data = await request(`/categories/${encodeURIComponent(slug)}`);
  const raw = data?.data ?? data?.category;
  if (raw && !Array.isArray(raw) && typeof raw === "object") {
    return {
      slug: String(pick(raw, ["slug", "id"], slug)),
      title: String(pick(raw, ["title", "name", "label"], slug)),
      icon: String(pick(raw, ["icon", "emoji"], "🛒")),
    };
  }

  const all = await getCategories();
  return all.find((c) => c.slug === slug) ?? null;
};
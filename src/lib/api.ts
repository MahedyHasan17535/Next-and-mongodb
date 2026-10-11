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

type Raw = Record<string, unknown>;

const bengali = /[\u0980-\u09FF]/;
const priceInner = /today|current|price|value|now|latest|avg|average/i;

const isObject = (value: unknown): value is Raw =>
  typeof value === "object" && value !== null && !Array.isArray(value);

// value of the first key that matches the pattern
const findKey = (raw: Raw, include: RegExp, exclude?: RegExp): unknown => {
  for (const [key, value] of Object.entries(raw)) {
    if (value === null || value === undefined) continue;
    if (exclude && exclude.test(key)) continue;
    if (include.test(key)) return value;
  }
  return undefined;
};

// value of the first exact key that exists
const pick = (raw: Raw, keys: string[]): unknown => {
  for (const key of keys) {
    if (raw[key] !== undefined && raw[key] !== null) return raw[key];
  }
  return undefined;
};

// string, number or object like { bn: "...", en: "..." } -> text
const toText = (value: unknown): string => {
  if (typeof value === "string") return value;
  if (typeof value === "number") return String(value);
  if (isObject(value)) {
    const strings = Object.values(value).filter(
      (v): v is string => typeof v === "string",
    );
    return strings.find((s) => bengali.test(s)) ?? strings[0] ?? "";
  }
  return "";
};

// number, "১,৮৫০", or object like { today: 148 } -> number
const toNumber = (value: unknown, inner: RegExp = priceInner): number => {
  if (isObject(value)) {
    const found = findKey(value, inner);
    if (found !== undefined) return toNumber(found, inner);
    const first = Object.values(value).find(
      (v) => typeof v === "number" || typeof v === "string",
    );
    return first === undefined ? 0 : toNumber(first, inner);
  }
  if (Array.isArray(value)) {
    return value.length ? toNumber(value[value.length - 1], inner) : 0;
  }
  return parseNumber(value);
};

// first matching key that holds a non-zero number
const findNumber = (
  raw: Raw,
  include: RegExp,
  exclude?: RegExp,
  inner?: RegExp,
): number => {
  for (const [key, value] of Object.entries(raw)) {
    if (exclude && exclude.test(key)) continue;
    if (!include.test(key)) continue;
    const num = toNumber(value, inner);
    if (num !== 0) return num;
  }
  return 0;
};

// try main url first, then the alternative urls
const request = async (path: string): Promise<unknown> => {
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

const toList = (data: unknown): Raw[] => {
  let list: unknown = data;
  if (isObject(data)) {
    list =
      data.data ?? data.products ?? data.categories ?? data.result ?? data.items;
  }
  if (isObject(list)) {
    list = list.products ?? list.categories ?? list.items ?? list.data;
  }
  return Array.isArray(list) ? list.filter(isObject) : [];
};

const toObject = (data: unknown): Raw | null => {
  let raw: unknown = data;
  if (isObject(raw)) raw = raw.data ?? raw.product ?? raw.category ?? raw.result ?? raw;
  if (isObject(raw) && isObject(raw.product)) raw = raw.product;
  return isObject(raw) ? raw : null;
};

const toProduct = (raw: Raw, index: number): Product => {
  const rawMarkets = findKey(raw, /market|bazar|bazaar|shop/i);
  const markets: Market[] = Array.isArray(rawMarkets)
    ? rawMarkets.filter(isObject).map((m) => ({
        name: toText(findKey(m, /name|title|market|bazar/i)),
        area: toText(findKey(m, /area|district|division|location|city|region/i)),
        price: findNumber(m, /price|rate|amount|today|value|current/i),
      }))
    : [];
  const marketPrices = markets.map((m) => m.price).filter((p) => p > 0);

  let price = findNumber(
    raw,
    /price|rate|today|current|amount|cost/i,
    /change|percent|diff|min|max|avg|average|prev|yesterday|old|market|categor/i,
  );

  const avgFromData = findNumber(raw, /avg|average/i);
  if (!price) price = avgFromData;
  if (!price && marketPrices.length) {
    price = Math.round(marketPrices.reduce((a, b) => a + b, 0) / marketPrices.length);
  }

  const previous = findNumber(raw, /prev|yesterday/i);
  const trend = String(findKey(raw, /trend|direction/i) ?? "").toLowerCase();

  let change = findNumber(
    raw,
    /change|percent|diff|delta/i,
    undefined,
    /percent|pct|value|rate|change/i,
  );
  if (!change && previous > 0 && price > 0) {
    change = ((price - previous) / previous) * 100;
  }
  if (change > 0 && /down|fall|decrease|loss/.test(trend)) change = -change;

  const category = pick(raw, ["category", "categorySlug", "categoryId"]) ??
    findKey(raw, /categor/i);
  const categorySlug = isObject(category)
    ? toText(pick(category, ["slug", "id"]))
    : toText(category);
  const categoryName = isObject(category)
    ? toText(findKey(category, /title|name|label/i))
    : toText(findKey(raw, /categoryName|categoryTitle/i)) || categorySlug;

  const id = String(pick(raw, ["id", "_id", "productId"]) ?? index + 1);

  const nameValue =
    pick(raw, ["name", "title", "productName", "name_bn", "nameBn", "bn_name", "bnName"]) ??
    findKey(raw, /name|title|label/i, /categor|unit|market/i);

  const unitValue =
    pick(raw, ["unit", "unitName", "per"]) ?? findKey(raw, /unit/i);

  return {
    id,
    slug: toText(findKey(raw, /^slug$/i)) || id,
    name: toText(nameValue),
    emoji: toText(findKey(raw, /emoji|icon|image/i)) || "🛒",
    unit: toText(unitValue) || "kg",
    category: categorySlug,
    categoryName,
    description: toText(findKey(raw, /desc|summary|subtitle|detail/i)),
    price,
    change,
    minPrice:
      findNumber(raw, /min|lowest/i) || (marketPrices.length ? Math.min(...marketPrices) : price),
    maxPrice:
      findNumber(raw, /max|highest/i) || (marketPrices.length ? Math.max(...marketPrices) : price),
    avgPrice: avgFromData || price,
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
  const raw = toObject(data);

  if (raw && Object.keys(raw).length > 2) {
    return toProduct(raw, 0);
  }

  // fallback: find the product from the full list by slug / id
  const all = await getProducts();
  return all.find((p) => p.slug === slug || p.id === slug) ?? null;
};

const toCategory = (raw: Raw): Category => ({
  slug: toText(findKey(raw, /^(slug|id|_id)$/i)),
  title: toText(findKey(raw, /title|name|label/i)),
  icon: toText(findKey(raw, /icon|emoji|image/i)) || "🛒",
});

export const getCategories = async (): Promise<Category[]> => {
  const data = await request("/categories");
  return toList(data).map(toCategory);
};

export const getCategory = async (slug: string): Promise<Category | null> => {
  const data = await request(`/categories/${encodeURIComponent(slug)}`);
  const raw = toObject(data);

  if (raw && Object.keys(raw).length > 1) {
    const category = toCategory(raw);
    return { ...category, slug: category.slug || slug };
  }

  const all = await getCategories();
  return all.find((c) => c.slug === slug) ?? null;
};
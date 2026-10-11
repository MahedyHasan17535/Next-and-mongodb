import Hero from "@/components/Hero";
import ProductSection from "@/components/ProductSection";
import { getProducts } from "@/lib/api";

export default async function Home() {
  const products = await getProducts();

  const risers = products
    .filter((p) => p.change > 0)
    .sort((a, b) => b.change - a.change)
    .slice(0, 6);

  const fallers = products
    .filter((p) => p.change < 0)
    .sort((a, b) => a.change - b.change)
    .slice(0, 6);

  return (
    <div>
      <Hero />

      {/* risers section */}
      <ProductSection
        title="Prices Up Today ▲"
        titleColor="text-brand-dark"
        products={risers}
      />

      {/* fallers section */}
      <ProductSection
        title="Prices Down Today ▼"
        titleColor="text-down"
        products={fallers}
      />

      {/* all products section */}
      <ProductSection
        id="all-products"
        title="All Products"
        subtitle="Today's price of all everyday products"
        products={products}
      />
    </div>
  );
}
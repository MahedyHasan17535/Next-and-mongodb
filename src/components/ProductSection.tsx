import ProductCard from "./ProductCard";
import type { Product } from "@/lib/api";

interface ProductSectionProps {
  id?: string;
  title: string;
  subtitle?: string;
  titleColor?: string;
  products: Product[];
}

const ProductSection = ({
  id,
  title,
  subtitle,
  titleColor = "text-ink",
  products,
}: ProductSectionProps) => {
  return (
    <section id={id} className="mt-10 scroll-mt-5">
      <h2 className={`text-2xl font-bold ${titleColor}`}>{title}</h2>
      {subtitle && <p className="mt-1 text-sm text-neutral-500">{subtitle}</p>}

      <div className="mt-4 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};

export default ProductSection;
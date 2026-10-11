import Link from "next/link";
import ChangeBadge from "./ChangeBadge";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/lib/api";

const ProductCard = ({ product }: { product: Product }) => {
  return (
    <Link href={`/product/${product.slug}`}>
      <div className="card bg-white border border-line p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-soft text-3xl">
            {product.emoji}
          </div>
          <div>
            <h2 className="font-bold text-ink">{product.name}</h2>
            <p className="text-xs text-neutral-500">{product.unit}</p>
          </div>
        </div>

        <div className="mt-4 flex items-end justify-between border-t border-line pt-3">
          <div>
            <p className="text-xs text-neutral-500">আজকের দাম</p>
            <p className="text-lg font-bold text-brand-dark">
              {formatPrice(product.price)} টাকা
            </p>
          </div>
          <ChangeBadge change={product.change} />
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
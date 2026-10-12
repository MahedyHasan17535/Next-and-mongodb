import { notFound } from "next/navigation";
import ChangeBadge from "@/components/ChangeBadge";
import { getProduct } from "@/lib/api";
import { formatPrice } from "@/lib/format";

const ProductDetails = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;

  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  const sortedMarkets = [...product.markets].sort((a, b) => a.price - b.price);
  const cheapest = sortedMarkets[0];

  return (
    <div className="mt-8">
      {/* summary section */}
      <div className="card bg-white border border-line p-5 md:p-8">
        <div className="flex items-start gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-soft text-4xl">
            {product.emoji}
          </div>
          <div>
            <h1 className="text-2xl font-bold sm:text-3xl">{product.name}</h1>
            {product.description && (
              <p className="mt-1 text-neutral-600">{product.description}</p>
            )}
            <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
              {product.categoryName && (
                <span className="rounded-full bg-brand-soft px-3 py-1 font-semibold text-brand-dark">
                  {product.categoryName}
                </span>
              )}
              <span className="rounded-full bg-surface px-3 py-1">{product.unit}</span>
              <ChangeBadge change={product.change} />
            </div>
          </div>
        </div>
      </div>

      {/* price summary */}
      <h2 className="mt-8 mb-3 text-xl font-bold">দামের সারসংক্ষেপ</h2>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
        <div className="card bg-white border border-line p-4">
          <p className="text-sm text-neutral-500">সর্বনিম্ন দাম</p>
          <p className="text-2xl font-bold text-brand-dark">
            {formatPrice(product.minPrice)} টাকা
          </p>
        </div>
        <div className="card bg-white border border-line p-4">
          <p className="text-sm text-neutral-500">সর্বাধিক দাম</p>
          <p className="text-2xl font-bold text-down">
            {formatPrice(product.maxPrice)} টাকা
          </p>
        </div>
        <div className="card bg-white border border-line p-4">
          <p className="text-sm text-neutral-500">গড় দাম</p>
          <p className="text-2xl font-bold">{formatPrice(product.avgPrice)} টাকা</p>
        </div>
      </div>

      {/* market wise price */}
      <h2 className="mt-8 mb-1 text-xl font-bold">বাজারভিত্তিক আজকের দাম</h2>
      <p className="mb-3 text-sm text-neutral-500">{product.unit}-এর হিসাবে</p>

      {sortedMarkets.length === 0 ? (
        <p className="card bg-white border border-line p-4 text-neutral-500">
          এই পণ্যের বাজারভিত্তিক তথ্য এখনো পাওয়া যায়নি।
        </p>
      ) : (
        <div className="overflow-x-auto card bg-white border border-line">
          <table className="table">
            <thead>
              <tr>
                <th>বাজার</th>
                <th>বিভাগ</th>
                <th className="text-right">দাম</th>
              </tr>
            </thead>
            <tbody>
              {sortedMarkets.map((m, i) => (
                <tr key={`${m.name}-${i}`}>
                  <td className="font-semibold">
                    {m.name}
                    {i === 0 && m.price > 0 && (
                      <span className="ml-2 rounded-full bg-green-100 px-2 py-0.5 text-xs text-brand-dark">
                        সবচেয়ে কম দামের বাজার
                      </span>
                    )}
                  </td>
                  <td>{m.area}</td>
                  <td className="text-right font-bold">{formatPrice(m.price)} টাকা</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
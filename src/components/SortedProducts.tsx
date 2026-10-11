"use client";

import { useState } from "react";
import ProductCard from "./ProductCard";
import type { Product } from "@/lib/api";
import { parseNumber } from "@/lib/format";

const SortedProducts = ({ products }: { products: Product[] }) => {
  const [sort, setSort] = useState("default");

  // price is always compared as a number (Bengali digits are converted first)
  const sortedProducts = [...products].sort((a, b) => {
    if (sort === "low") return parseNumber(a.price) - parseNumber(b.price);
    if (sort === "high") return parseNumber(b.price) - parseNumber(a.price);
    return 0;
  });

  return (
    <div>
      <div className="mb-5 flex items-center justify-end gap-2">
        <label htmlFor="sort" className="text-sm font-semibold">
          সাজান:
        </label>
        <select
          id="sort"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="select select-sm sm:select-md w-52"
        >
          <option value="default">ডিফল্ট</option>
          <option value="low">দাম: কম থেকে বেশি</option>
          <option value="high">দাম: বেশি থেকে কম</option>
        </select>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {sortedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default SortedProducts;
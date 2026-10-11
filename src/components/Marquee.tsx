import Link from "next/link";
import MarqueeText from "react-marquee-text";
import "react-marquee-text/dist/styles.css";
import { getProducts } from "@/lib/api";
import { formatPercent, formatPrice } from "@/lib/format";

const Marquee = async () => {
  const products = await getProducts();

  if (products.length === 0) return null;

  return (
    <div className="bg-brand-dark text-white">
      <div className="flex max-w-6xl mx-auto text-sm">
        <div className="bg-ink py-1.5 px-4 font-bold whitespace-nowrap">আজকের দর</div>

        <MarqueeText className="py-1.5" direction="left" duration={40}>
          {products.map((p) => (
            <Link
              className="hover:underline"
              href={`/product/${p.slug}`}
              key={p.id}
            >
              <span>
                {p.emoji} {p.name} {formatPrice(p.price)} টাকা/
                {p.unit.replace("প্রতি ", "")}{" "}
              </span>
              <span
                className={
                  p.change > 0 ? "text-green-200" : p.change < 0 ? "text-red-200" : ""
                }
              >
                {p.change > 0 ? "▲" : p.change < 0 ? "▼" : "—"}{" "}
                {formatPercent(p.change)}%
              </span>
              <span className="mx-5">•</span>
            </Link>
          ))}
        </MarqueeText>
      </div>
    </div>
  );
};

export default Marquee;
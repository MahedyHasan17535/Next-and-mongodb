import Image from "next/image";

const Hero = () => {
  return (
    <section className="mt-5 grid items-center gap-6 rounded-3xl bg-brand-soft border border-line px-6 py-8 md:grid-cols-2 md:px-10">
      <div className="text-center md:text-left">
        <p className="text-sm font-semibold text-brand-dark">
          Today&apos;s market prices at a glance
        </p>
        <h1 className="mt-2 text-3xl font-bold leading-tight text-ink sm:text-4xl">
          Everyday product prices, first in your hands
        </h1>
        <p className="mt-3 text-neutral-600">
          Rice, pulses, vegetables, fish and meat. Compare prices across every
          bazar and buy smart.
        </p>

        <a
          href="#all-products"
          className="btn btn-sm sm:btn-md mt-5 border-none bg-brand text-white hover:bg-brand-dark"
        >
          View All Products
        </a>
      </div>

      <div className="flex justify-center">
        <Image
          src="/bazar-hero.png"
          alt="Market basket"
          width={315}
          height={263}
          priority
        />
      </div>
    </section>
  );
};

export default Hero;
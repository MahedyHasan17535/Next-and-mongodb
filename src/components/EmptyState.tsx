import Link from "next/link";

const EmptyState = ({ message }: { message: string }) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <h1 className="text-8xl font-black text-brand">৪০৪</h1>
      <p className="mt-3 text-neutral-600">{message}</p>
      <Link
        href="/"
        className="btn mt-6 border-none bg-brand text-white hover:bg-brand-dark"
      >
        হোম পেজে ফিরে যান
      </Link>
    </div>
  );
};

export default EmptyState;
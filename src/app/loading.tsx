import ProductSkeleton from "@/components/ProductSkeleton";

const LoadingPage = () => {
  return (
    <div className="mt-5">
      {/* hero skeleton */}
      <div className="skeleton h-56 w-full rounded-3xl"></div>

      <div className="skeleton mt-10 h-7 w-48"></div>
      <div className="mt-4">
        <ProductSkeleton count={4} />
      </div>
    </div>
  );
};

export default LoadingPage;
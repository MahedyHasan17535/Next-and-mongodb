import ProductSkeleton from "@/components/ProductSkeleton";

const CategoryLoading = () => {
  return (
    <div className="mt-8">
      <div className="skeleton h-8 w-40"></div>
      <div className="mt-6">
        <ProductSkeleton count={8} />
      </div>
    </div>
  );
};

export default CategoryLoading;
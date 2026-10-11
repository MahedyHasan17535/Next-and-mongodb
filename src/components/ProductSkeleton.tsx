const ProductSkeleton = ({ count = 8 }: { count?: number }) => {
  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="card bg-white border border-line p-4">
          <div className="flex items-center gap-3">
            <div className="skeleton h-12 w-12 rounded-xl"></div>
            <div className="grid gap-2">
              <div className="skeleton h-4 w-28"></div>
              <div className="skeleton h-3 w-16"></div>
            </div>
          </div>
          <div className="mt-4 flex items-end justify-between border-t border-line pt-3">
            <div className="grid gap-2">
              <div className="skeleton h-3 w-14"></div>
              <div className="skeleton h-5 w-24"></div>
            </div>
            <div className="skeleton h-5 w-12 rounded-full"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductSkeleton;
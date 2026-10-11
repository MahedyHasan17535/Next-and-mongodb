import EmptyState from "@/components/EmptyState";
import SortedProducts from "@/components/SortedProducts";
import { getCategory, getProducts } from "@/lib/api";

const CategoryNews = async ({ params }: { params: { categoryId: string } }) => {
  const { categoryId } = await params;

  const [category, products] = await Promise.all([
    getCategory(categoryId),
    getProducts(categoryId),
  ]);

  if (!category || products.length === 0) {
    return <EmptyState message="এই বিভাগে কোনো পণ্য পাওয়া যায়নি।" />;
  }

  return (
    <div className="mt-8">
      <h1 className="text-2xl font-bold border-b-2 border-brand mb-5 pb-1">
        {category.icon} {category.title}
      </h1>

      <SortedProducts products={products} />
    </div>
  );
};

export default CategoryNews;
import { Link, useSearchParams } from 'react-router-dom';
import { useCategories } from '@/hooks/useProducts';

export default function CategoryBar() {
  const { data } = useCategories();
  const categories = data?.data || [];

  return (
    <section className="bg-white border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-none">
          <Link
            to="/products"
            className="shrink-0 px-4 py-2 rounded-full bg-navy text-white text-sm font-medium hover:bg-navy-light transition-colors"
          >
            All Products
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/products?category=${cat.slug}`}
              className="shrink-0 px-4 py-2 rounded-full bg-slate-100 text-slate-700 text-sm font-medium hover:bg-gold-light hover:text-amber-800 transition-colors"
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

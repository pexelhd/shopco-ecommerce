import { Link } from 'react-router-dom';
import { useFeatured } from '@/hooks/useProducts';
import ProductGrid from './ProductGrid';
import Button from '@/components/ui/Button';

export default function FeaturedProducts() {
  const { data, isLoading, error } = useFeatured();

  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Featured Products</h2>
        <Link to="/products"><Button variant="ghost" size="sm">View all →</Button></Link>
      </div>
      <ProductGrid products={data?.data} isLoading={isLoading} error={error} />
    </section>
  );
}

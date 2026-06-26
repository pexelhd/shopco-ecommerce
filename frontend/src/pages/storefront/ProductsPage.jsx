import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal } from 'lucide-react';
import Navbar from '@/components/storefront/Navbar';
import Footer from '@/components/storefront/Footer';
import ProductGrid from '@/components/storefront/ProductGrid';
import { useProducts, useCategories } from '@/hooks/useProducts';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [page, setPage] = useState(1);
  const [debouncedSearch, setDebouncedSearch] = useState(search);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  const params = { search: debouncedSearch, category, minPrice, maxPrice, page, limit: 12 };
  const { data, isLoading, error } = useProducts(params);
  const { data: catData } = useCategories();
  const categories = catData?.data || [];
  const products = data?.data || [];
  const pagination = data?.pagination;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full">
        <h1 className="text-2xl font-bold text-slate-800 mb-6">All Products</h1>
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <aside className="w-full md:w-56 shrink-0">
            <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-4 sticky top-20">
              <div>
                <p className="text-sm font-semibold text-slate-700 mb-2">Search</p>
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                    placeholder="Search products..."
                    className="w-full border border-slate-300 rounded-lg pl-9 pr-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold"
                  />
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-700 mb-2">Category</p>
                <div className="space-y-1">
                  <label className="flex items-center gap-2 text-sm cursor-pointer hover:text-gold transition-colors">
                    <input type="radio" name="cat" checked={category === ''} onChange={() => { setCategory(''); setPage(1); }} />
                    All
                  </label>
                  {categories.map((c) => (
                    <label key={c.id} className="flex items-center gap-2 text-sm cursor-pointer hover:text-gold transition-colors">
                      <input type="radio" name="cat" checked={category === c.slug} onChange={() => { setCategory(c.slug); setPage(1); }} />
                      {c.name}
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-700 mb-2">Price Range</p>
                <div className="flex gap-2">
                  <input
                    type="number" placeholder="Min" value={minPrice}
                    onChange={(e) => { setMinPrice(e.target.value); setPage(1); }}
                    className="w-full border border-slate-300 rounded-lg px-2 py-1.5 text-sm outline-none focus:border-gold"
                  />
                  <input
                    type="number" placeholder="Max" value={maxPrice}
                    onChange={(e) => { setMaxPrice(e.target.value); setPage(1); }}
                    className="w-full border border-slate-300 rounded-lg px-2 py-1.5 text-sm outline-none focus:border-gold"
                  />
                </div>
              </div>
              <Button variant="ghost" size="sm" className="w-full text-slate-500"
                onClick={() => { setSearch(''); setCategory(''); setMinPrice(''); setMaxPrice(''); setPage(1); }}>
                Clear Filters
              </Button>
            </div>
          </aside>

          {/* Product grid */}
          <div className="flex-1">
            {pagination && (
              <p className="text-sm text-slate-500 mb-4">{pagination.total} products found</p>
            )}
            <ProductGrid products={products} isLoading={isLoading} error={error} />
            {pagination && pagination.pages > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                <Button variant="secondary" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</Button>
                <span className="px-4 py-2 text-sm text-slate-600">{page} / {pagination.pages}</span>
                <Button variant="secondary" size="sm" disabled={page >= pagination.pages} onClick={() => setPage(page + 1)}>Next</Button>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

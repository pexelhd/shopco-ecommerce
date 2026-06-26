import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingCart, ArrowLeft, Package } from 'lucide-react';
import { toast } from 'sonner';
import Navbar from '@/components/storefront/Navbar';
import Footer from '@/components/storefront/Footer';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';
import Badge from '@/components/ui/Badge';
import { useProduct } from '@/hooks/useProducts';
import { useCart } from '@/hooks/useCart';

export default function ProductDetailPage() {
  const { id } = useParams();
  const { data, isLoading, error } = useProduct(id);
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);

  const product = data?.data;

  const handleAdd = () => {
    addItem(product, qty);
    toast.success(`"${product.name}" added to cart`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-5xl mx-auto px-4 py-8 w-full">
        <Link to="/products" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-gold mb-6">
          <ArrowLeft size={16} /> Back to products
        </Link>

        {isLoading && <div className="flex justify-center py-20"><Spinner size="lg" /></div>}
        {error && <p className="text-red-500 text-center py-12">Failed to load product.</p>}
        {product && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="aspect-square rounded-2xl overflow-hidden bg-slate-100">
              <img
                src={product.image_url || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600'}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="space-y-4">
              {product.category_name && (
                <Badge color="gold">{product.category_name}</Badge>
              )}
              <h1 className="text-3xl font-bold text-slate-800">{product.name}</h1>
              <p className="text-3xl font-bold text-gold">${product.price.toFixed(2)}</p>
              {product.description && (
                <p className="text-slate-600 leading-relaxed">{product.description}</p>
              )}
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Package size={16} />
                {product.stock > 0 ? (
                  <span className="text-green-600 font-medium">{product.stock} in stock</span>
                ) : (
                  <span className="text-red-500 font-medium">Out of stock</span>
                )}
              </div>

              {product.stock > 0 && (
                <div className="flex items-center gap-3 pt-2">
                  <div className="flex items-center border border-slate-300 rounded-lg overflow-hidden">
                    <button className="px-3 py-2 hover:bg-slate-100 cursor-pointer" onClick={() => setQty(Math.max(1, qty - 1))}>−</button>
                    <span className="px-4 py-2 font-medium min-w-[3rem] text-center">{qty}</span>
                    <button className="px-3 py-2 hover:bg-slate-100 cursor-pointer" onClick={() => setQty(Math.min(product.stock, qty + 1))}>+</button>
                  </div>
                  <Button size="lg" className="flex-1" onClick={handleAdd}>
                    <ShoppingCart size={18} /> Add to Cart
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

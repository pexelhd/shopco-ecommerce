import { Link } from 'react-router-dom';
import Button from '@/components/ui/Button';

export default function HeroSection() {
  return (
    <section className="bg-navy text-white">
      <div className="max-w-7xl mx-auto px-4 py-20 flex flex-col items-center text-center gap-6">
        <span className="bg-gold/20 text-gold px-4 py-1.5 rounded-full text-sm font-medium">
          New arrivals every week
        </span>
        <h1 className="text-4xl md:text-6xl font-bold leading-tight max-w-3xl">
          Shop the Best. <span className="text-gold">Save More.</span>
        </h1>
        <p className="text-slate-300 text-lg max-w-xl">
          Discover thousands of quality products across electronics, clothing, home goods, and more.
          Free shipping on orders over $50.
        </p>
        <div className="flex gap-4 flex-wrap justify-center">
          <Link to="/products">
            <Button size="lg">Shop Now</Button>
          </Link>
          <Link to="/products?category=electronics">
            <Button variant="ghost" size="lg" className="border border-white text-white hover:bg-white/10">
              Browse Electronics
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

import Navbar from '@/components/storefront/Navbar';
import Footer from '@/components/storefront/Footer';
import HeroSection from '@/components/storefront/HeroSection';
import CategoryBar from '@/components/storefront/CategoryBar';
import FeaturedProducts from '@/components/storefront/FeaturedProducts';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <CategoryBar />
        <FeaturedProducts />
      </main>
      <Footer />
    </div>
  );
}

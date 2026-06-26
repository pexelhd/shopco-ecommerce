import { Link } from 'react-router-dom';
import { Store } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-navy text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <div className="flex items-center gap-2 font-bold text-lg text-gold mb-3">
            <Store size={20} />
            ShopCo
          </div>
          <p className="text-slate-400 text-sm">Your one-stop shop for quality products at great prices.</p>
        </div>
        <div>
          <h4 className="font-semibold mb-3">Quick Links</h4>
          <ul className="space-y-2 text-sm text-slate-400">
            <li><Link to="/" className="hover:text-gold transition-colors">Home</Link></li>
            <li><Link to="/products" className="hover:text-gold transition-colors">Products</Link></li>
            <li><Link to="/cart" className="hover:text-gold transition-colors">Cart</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3">Contact</h4>
          <ul className="space-y-2 text-sm text-slate-400">
            <li>support@shopco.com</li>
            <li>Mon–Fri, 9am–5pm EST</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-navy-lighter text-center text-xs text-slate-500 py-4">
        © {new Date().getFullYear()} ShopCo. All rights reserved.
      </div>
    </footer>
  );
}

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Store, Menu, X, User, LogOut } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useUserAuth } from '@/context/UserAuthContext';
import CartDrawer from './CartDrawer';

export default function Navbar() {
  const { totalItems } = useCart();
  const { user, logout } = useUserAuth();
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <nav className="bg-navy text-white sticky top-0 z-40 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl text-gold">
            <Store size={24} />
            ShopCo
          </Link>

          <div className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link to="/" className="hover:text-gold transition-colors">Home</Link>
            <Link to="/products" className="hover:text-gold transition-colors">Products</Link>
            {user ? (
              <div className="flex items-center gap-3">
                <span className="text-gold flex items-center gap-1"><User size={15} />{user.name.split(' ')[0]}</span>
                <button onClick={logout} className="hover:text-gold transition-colors flex items-center gap-1"><LogOut size={15} />Logout</button>
              </div>
            ) : (
              <>
                <Link to="/login" className="hover:text-gold transition-colors">Login</Link>
                <Link to="/register" className="bg-gold text-white px-3 py-1 rounded-lg hover:bg-amber-500 transition-colors">Register</Link>
              </>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setCartOpen(true)}
              className="relative p-2 hover:bg-navy-light rounded-lg transition-colors cursor-pointer"
            >
              <ShoppingCart size={22} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-gold text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {totalItems}
                </span>
              )}
            </button>
            <button className="md:hidden p-2 cursor-pointer" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden bg-navy-light px-4 py-3 flex flex-col gap-3 text-sm font-medium border-t border-navy-lighter">
            <Link to="/" onClick={() => setMenuOpen(false)} className="hover:text-gold transition-colors">Home</Link>
            <Link to="/products" onClick={() => setMenuOpen(false)} className="hover:text-gold transition-colors">Products</Link>
            <button onClick={() => { setMenuOpen(false); setCartOpen(true); }} className="text-left hover:text-gold transition-colors flex items-center gap-2">
              <ShoppingCart size={15} />Cart{totalItems > 0 && <span className="bg-gold text-white text-xs rounded-full px-1.5">{totalItems}</span>}
            </button>
            <div className="border-t border-navy-lighter pt-3 mt-1 flex flex-col gap-3">
              {user ? (
                <>
                  <span className="text-gold flex items-center gap-1"><User size={15} />{user.name}</span>
                  <button onClick={() => { logout(); setMenuOpen(false); }} className="text-left hover:text-gold transition-colors flex items-center gap-1"><LogOut size={15} />Logout</button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setMenuOpen(false)} className="hover:text-gold transition-colors">Login</Link>
                  <Link to="/register" onClick={() => setMenuOpen(false)} className="bg-gold text-white text-center py-2 rounded-lg hover:bg-amber-500 transition-colors">Register</Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} onCheckout={() => { setCartOpen(false); navigate('/checkout'); }} />
    </>
  );
}

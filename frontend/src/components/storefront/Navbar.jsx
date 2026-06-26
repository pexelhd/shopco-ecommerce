import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Store, Menu, X, User, LogOut, Settings, ChevronDown, Sun, Moon } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useUserAuth } from '@/context/UserAuthContext';
import { useDarkMode } from '@/context/DarkModeContext';
import CartDrawer from './CartDrawer';

function UserDropdown({ user, logout }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const initials = user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 hover:bg-navy-light px-2 py-1.5 rounded-lg transition-colors cursor-pointer"
      >
        <div className="w-8 h-8 rounded-full bg-gold flex items-center justify-center text-white text-xs font-bold">
          {initials}
        </div>
        <span className="text-sm font-medium text-white hidden md:block">{user.name.split(' ')[0]}</span>
        <ChevronDown size={14} className={`text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-2xl border border-slate-100 overflow-hidden z-50">
          {/* Profile header */}
          <div className="bg-navy px-4 py-4 flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gold flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
              {initials}
            </div>
            <div className="overflow-hidden">
              <p className="text-white font-semibold text-sm truncate">{user.name}</p>
              <p className="text-slate-400 text-xs truncate">{user.email}</p>
            </div>
          </div>

          {/* Menu items */}
          <div className="py-2">
            <div className="px-4 py-2">
              <p className="text-xs text-slate-400 uppercase tracking-wider font-medium">Account</p>
            </div>
            <Link
              to="/profile"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <User size={16} className="text-slate-400" />
              My Profile
            </Link>
            <Link
              to="/settings"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <Settings size={16} className="text-slate-400" />
              Settings
            </Link>
          </div>

          <div className="border-t border-slate-100 py-2">
            <button
              onClick={() => { logout(); setOpen(false); }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
            >
              <LogOut size={16} />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Navbar() {
  const { totalItems } = useCart();
  const { user, logout } = useUserAuth();
  const { dark, toggle } = useDarkMode();
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <nav className="bg-navy text-white sticky top-0 z-40 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2 font-bold text-xl text-gold">
              <Store size={24} />
              ShopCo
            </Link>
            <div className="hidden md:flex items-center gap-6 text-sm font-medium">
              <Link to="/" className="hover:text-gold transition-colors">Home</Link>
              <Link to="/products" className="hover:text-gold transition-colors">Products</Link>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-4 text-sm font-medium">
            {!user && (
              <>
                <Link to="/login" className="hover:text-gold transition-colors">Login</Link>
                <Link to="/register" className="bg-gold text-white px-3 py-1 rounded-lg hover:bg-amber-500 transition-colors">Register</Link>
              </>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggle}
              className="p-2 hover:bg-navy-light rounded-lg transition-colors cursor-pointer"
              title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {dark ? <Sun size={20} className="text-gold" /> : <Moon size={20} className="text-slate-300" />}
            </button>
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

            {user && <UserDropdown user={user} logout={logout} />}

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
            {!user && (
              <div className="border-t border-navy-lighter pt-3 mt-1 flex flex-col gap-3">
                <Link to="/login" onClick={() => setMenuOpen(false)} className="hover:text-gold transition-colors">Login</Link>
                <Link to="/register" onClick={() => setMenuOpen(false)} className="bg-gold text-white text-center py-2 rounded-lg hover:bg-amber-500 transition-colors">Register</Link>
              </div>
            )}
          </div>
        )}
      </nav>

      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} onCheckout={() => { setCartOpen(false); navigate('/checkout'); }} />
    </>
  );
}

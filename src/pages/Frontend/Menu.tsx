import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import { 
  UtensilsCrossed, 
  ChefHat, 
  ShoppingBasket, 
  Plus, 
  Minus, 
  Trash2, 
  X, 
  Search,
  ChevronRight,
  Filter,
  Menu as MenuIcon,
  LogOut,
  MapPin,
  Phone,
  Instagram,
  Facebook,
  Twitter,
  ArrowRight,
  ArrowLeft,
  Calendar,
  User
} from 'lucide-react';

import { useCurrentUser, logout } from '../../redux/features/auth/authSlice';
import { useGetAllMenuQuery } from '../../redux/features/menu/menuApi';
import { useCreateOrderMutation } from '../../redux/features/order/orderApi';

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer);
    toast.addEventListener('mouseleave', Swal.resumeTimer);
  }
});

type Category = 'All' | 'Appetizers' | 'Main Course' | 'Desserts' | 'Beverages';

interface MenuItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: Category;
  image?: string;
  isAvailable: boolean;
}

export function Menu() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(useCurrentUser);
  const [activeCategory, setActiveCategory] = useState<Category>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState<{ item: MenuItem, quantity: number }[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<'CART' | 'ADDRESS'>('CART');
  const [addressData, setAddressData] = useState({
    name: '',
    phone: '',
    deliveryAddress: ''
  });

  const { data: menuData, isLoading: isMenuLoading } = useGetAllMenuQuery(undefined);
  const [createOrder, { isLoading: isOrdering }] = useCreateOrderMutation();

  const menuItems: MenuItem[] = menuData?.data || [];
  const navItems = ['Home', 'About', 'Menu', 'Reservations', 'Contact'];

  useEffect(() => {
    if (user) {
      setAddressData(prev => ({ ...prev, name: user.email.split('@')[0] }));
    }
  }, [user]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const scrollToSection = (id: string) => {
    setIsMobileMenuOpen(false);
    if (id === 'menu') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate(`/#${id}`);
    }
  };

  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.item._id === item._id);
      if (existing) {
        return prev.map(i => i.item._id === item._id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { item, quantity: 1 }];
    });
    setCheckoutStep('CART');
    setIsCartOpen(true);
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(i => i.item._id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(i => {
      if (i.item._id === id) {
        const newQty = Math.max(1, i.quantity + delta);
        return { ...i, quantity: newQty };
      }
      return i;
    }));
  };

  const cartTotal = cart.reduce((sum, i) => sum + (i.item.price * i.quantity), 0);

  const handleCheckoutClick = () => {
    if (!user) {
      Swal.fire({
        title: 'Login Required',
        text: 'Please login to proceed to checkout.',
        icon: 'info',
        confirmButtonColor: '#f97316',
        showCancelButton: true,
        confirmButtonText: 'Go to Login'
      }).then((result) => {
        if (result.isConfirmed) {
          navigate(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
        }
      });
      return;
    }
    setCheckoutStep('ADDRESS');
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    if (!addressData.phone || !addressData.deliveryAddress) {
      Toast.fire({
        icon: 'warning',
        title: 'Please provide all delivery details'
      });
      return;
    }

    try {
      await createOrder({
        email: user?.email,
        items: cart.map(i => ({
          menuItem: i.item._id,
          quantity: i.quantity,
          price: i.item.price
        })),
        tableNumber: Math.floor(Math.random() * 20) + 1,
        totalAmount: cartTotal,
        customerName: addressData.name,
        phone: addressData.phone,
        address: addressData.deliveryAddress
      }).unwrap();

      Swal.fire({
        title: 'Order Placed!',
        text: 'Your culinary journey has begun. We are preparing your order!',
        icon: 'success',
        confirmButtonColor: '#f97316'
      });
      setCart([]);
      setIsCartOpen(false);
      setCheckoutStep('CART');
      setAddressData(prev => ({ ...prev, phone: '', deliveryAddress: '' }));
    } catch (err: any) {
      Swal.fire({
        title: 'Error!',
        text: err?.data?.message || 'Failed to place order.',
        icon: 'error',
        confirmButtonColor: '#f97316'
      });
    }
  };

  const filteredItems = menuItems.filter((item) => {
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      {/* Navbar - Exactly like Home */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md py-3' : 'bg-transparent py-5'}`}>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <div className="bg-orange-500 p-2 rounded-lg">
              <ChefHat className="w-6 h-6 text-white" />
            </div>
            <span
              className={`text-2xl font-bold ${isScrolled ? 'text-slate-900' : 'text-white'}`}>
              La Maison
            </span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map(
              (item) =>
                <button
                  key={item}
                  onClick={() => scrollToSection(item.toLowerCase())}
                  className={`text-sm font-medium hover:text-orange-500 transition-colors ${isScrolled ? 'text-slate-600' : 'text-slate-200'} ${item === 'Menu' ? 'text-orange-500 font-bold border-b-2 border-orange-500' : ''}`}>

                  {item}
                </button>
            )}

            {user ? (
              <>
                <button
                  onClick={() => navigate('/dashboard')}
                  className={`flex items-center gap-2 text-sm font-medium hover:text-orange-500 transition-colors ${isScrolled ? 'text-slate-600' : 'text-slate-200'}`}>
                  <User className="w-4 h-4" />
                  Profile
                </button>
                <button
                  onClick={handleLogout}
                  className={`flex items-center gap-2 text-sm font-medium hover:text-orange-500 transition-colors ${isScrolled ? 'text-slate-600' : 'text-slate-200'}`}>
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className={`text-sm font-medium hover:text-orange-500 transition-colors ${isScrolled ? 'text-slate-600' : 'text-slate-200'}`}>
                Login
              </button>
            )}

            <button
              onClick={() => setIsCartOpen(true)}
              className="bg-white px-4 py-2 rounded-full flex items-center gap-3 shadow-md hover:shadow-lg transition-all relative group"
            >
              <ShoppingBasket className="w-5 h-5 text-teal-600" />
              <span className="text-slate-700 font-bold text-sm">
                {cartTotal.toFixed(2)} <span className="text-[10px] text-slate-400">TK</span>
              </span>
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-1 bg-rose-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                  {cart.reduce((s, i) => s + i.quantity, 0)}
                </span>
              )}
            </button>

            <button
              onClick={() => scrollToSection('reservations')}
              className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-full text-sm font-medium transition-colors shadow-lg shadow-orange-500/20">
              Reserve a Table
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-orange-500"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Nav */}
        {isMobileMenuOpen &&
          <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-lg border-t border-slate-100 p-4 flex flex-col gap-4">
            {navItems.map(
              (item) =>
                <button
                  key={item}
                  onClick={() => scrollToSection(item.toLowerCase())}
                  className={`text-left font-medium py-2 hover:text-orange-500 ${item === 'Menu' ? 'text-orange-500 font-bold' : 'text-slate-600'}`}>
                  {item}
                </button>
            )}

            {user ? (
              <>
                <button
                  onClick={() => { navigate('/dashboard'); setIsMobileMenuOpen(false); }}
                  className="text-left text-slate-600 font-medium py-2 hover:text-orange-500 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="text-left text-slate-600 font-medium py-2 hover:text-orange-500 flex items-center gap-2">
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="text-left text-slate-600 font-medium py-2 hover:text-orange-500">
                Login
              </button>
            )}

            <button
              onClick={() => scrollToSection('reservations')}
              className="bg-orange-500 text-white py-3 rounded-lg font-medium text-center">
              Reserve a Table
            </button>
          </div>
        }
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 overflow-hidden bg-slate-900">
        <div className="absolute inset-0 z-0">
           <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-orange-950 opacity-90" />
           <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1559339352-11d035aa65de?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center mix-blend-overlay opacity-30" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-black tracking-widest uppercase mb-6 backdrop-blur-md">
            <UtensilsCrossed className="w-3 h-3" />
            Culinary Odyssey
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tighter">
            Our <span className="text-orange-500">Signature</span> Menu
          </h1>
          <p className="max-w-2xl mx-auto text-slate-400 text-lg font-medium leading-relaxed">
            Discover a curated selection of dishes where tradition meets innovation. 
            Each plate is a masterpiece crafted with the finest seasonal ingredients.
          </p>
        </div>

        <div className="absolute -bottom-10 left-0 right-0 h-40 bg-gradient-to-t from-slate-50 to-transparent z-10" />
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 -mt-10 relative z-20 pb-32">
        {/* Search and Filters */}
        <div className="bg-white/80 backdrop-blur-2xl p-4 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-white flex flex-col lg:flex-row items-center gap-6 mb-16">
          <div className="flex-1 w-full lg:w-auto relative group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-orange-500 transition-colors" />
            <input 
              type="text" 
              placeholder="What are you craving today?"
              className="w-full pl-14 pr-6 py-4 bg-slate-50 rounded-3xl border-none focus:ring-2 focus:ring-orange-500/20 outline-none transition-all font-bold text-slate-700 placeholder:text-slate-300 shadow-inner"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="w-full lg:w-auto overflow-x-auto no-scrollbar scroll-smooth">
            <div className="flex gap-2 p-1">
              {(['All', 'Appetizers', 'Main Course', 'Desserts', 'Beverages'] as const).map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`
                    px-6 py-3 rounded-2xl text-sm font-black whitespace-nowrap transition-all duration-300
                    ${activeCategory === category 
                      ? 'bg-orange-500 text-white shadow-lg shadow-orange-200 scale-105' 
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                    }
                  `}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Menu Grid */}
        {isMenuLoading ? (
          <div className="flex flex-col items-center justify-center py-40">
             <div className="w-20 h-20 relative">
                <div className="absolute inset-0 border-4 border-orange-500/20 rounded-full" />
                <div className="absolute inset-0 border-4 border-orange-500 rounded-full border-t-transparent animate-spin" />
             </div>
             <p className="mt-8 text-slate-400 font-bold tracking-widest uppercase text-xs animate-pulse">Setting the table...</p>
          </div>
        ) : filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredItems.map((item, idx) => (
              <div 
                key={item._id}
                className="group bg-white rounded-[2.5rem] p-4 shadow-sm hover:shadow-2xl hover:shadow-orange-100/50 transition-all duration-500 border border-slate-100 hover:border-orange-100 relative"
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                <div className="relative h-60 rounded-[2rem] overflow-hidden mb-5 bg-slate-50">
                  {item.image ? (
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&q=80';
                      }}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                       <UtensilsCrossed className="w-12 h-12 text-slate-200" />
                    </div>
                  )}
                  
                  <div className="absolute top-4 left-4">
                    <span className="px-4 py-1.5 bg-white/90 backdrop-blur-md text-orange-600 text-[10px] font-black tracking-widest uppercase rounded-full shadow-lg border border-white">
                      {item.category}
                    </span>
                  </div>

                  {!item.isAvailable && (
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-10">
                      <div className="transform -rotate-12 border-4 border-white px-6 py-2 rounded-xl">
                        <span className="text-white text-xl font-black uppercase tracking-widest">Sold Out</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="px-2">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-black text-slate-900 group-hover:text-orange-600 transition-colors line-clamp-1 pr-2">
                      {item.name}
                    </h3>
                  </div>
                  <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed mb-6 h-10">
                    {item.description}
                  </p>
                  
                  <div className="flex items-center justify-between pt-5 border-t border-slate-50">
                    <span className="text-2xl font-black text-slate-900">
                      ${item.price.toFixed(2)}
                    </span>
                    <button
                      onClick={() => addToCart(item)}
                      disabled={!item.isAvailable}
                      className="bg-slate-900 text-white p-3 rounded-2xl hover:bg-orange-500 hover:scale-110 active:scale-95 transition-all shadow-lg shadow-slate-200 disabled:opacity-50 disabled:cursor-not-allowed group/btn"
                    >
                      <Plus className="w-5 h-5 group-hover/btn:rotate-90 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-40">
             <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8">
                <Filter className="w-10 h-10 text-slate-200" />
             </div>
             <h3 className="text-2xl font-black text-slate-900 mb-2">No delicacies found</h3>
             <p className="text-slate-400 font-medium">Try adjusting your search or filters to find what you're looking for.</p>
          </div>
        )}
      </main>

      {/* Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-[100] overflow-hidden">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsCartOpen(false)} />
          <div className="absolute inset-y-0 right-0 max-w-full flex">
            <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 rounded-l-[3rem]">
              <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="bg-orange-500 p-3 rounded-2xl shadow-lg shadow-orange-200">
                    <ShoppingBasket className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-slate-900">
                      {checkoutStep === 'CART' ? 'Your Selection' : 'Delivery Details'}
                    </h2>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">
                      {checkoutStep === 'CART' ? `${cart.length} delicacies chosen` : 'Final Step'}
                    </p>
                  </div>
                </div>
                <button onClick={() => setIsCartOpen(false)} className="p-2 text-slate-300 hover:text-slate-900 transition-colors">
                  <X className="w-8 h-8" />
                </button>
              </div>

              {checkoutStep === 'CART' ? (
                <>
                  <div className="flex-1 overflow-y-auto p-8 space-y-8 no-scrollbar">
                    {cart.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center text-center">
                        <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                          <ShoppingBasket className="w-10 h-10 text-slate-200" />
                        </div>
                        <p className="text-slate-400 font-black tracking-widest uppercase text-xs">Your basket is empty</p>
                        <button 
                          onClick={() => setIsCartOpen(false)}
                          className="mt-6 text-orange-500 font-black flex items-center gap-2 hover:gap-3 transition-all"
                        >
                          Start adding items <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      cart.map((i) => (
                        <div key={i.item._id} className="flex gap-6 group">
                          <div className="w-24 h-24 bg-slate-50 rounded-3xl overflow-hidden shadow-inner flex-shrink-0">
                            {i.item.image ? (
                               <img src={i.item.image} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                 <UtensilsCrossed className="w-8 h-8 text-slate-200" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 py-1">
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-black text-slate-900 text-lg leading-tight line-clamp-1">{i.item.name}</h4>
                              <button onClick={() => removeFromCart(i.item._id)} className="text-slate-300 hover:text-red-500 transition-colors">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                            <div className="flex justify-between items-center mt-4">
                              <div className="flex items-center gap-4 bg-slate-50 rounded-2xl p-1.5 border border-slate-100">
                                <button 
                                  onClick={() => updateQuantity(i.item._id, -1)}
                                  className="w-8 h-8 flex items-center justify-center bg-white rounded-xl shadow-sm text-slate-400 hover:text-orange-500 active:scale-90 transition-all"
                                >
                                  <Minus className="w-4 h-4" />
                                </button>
                                <span className="text-sm font-black w-4 text-center text-slate-900">{i.quantity}</span>
                                <button 
                                  onClick={() => updateQuantity(i.item._id, 1)}
                                  className="w-8 h-8 flex items-center justify-center bg-white rounded-xl shadow-sm text-slate-400 hover:text-orange-500 active:scale-90 transition-all"
                                >
                                  <Plus className="w-4 h-4" />
                                </button>
                              </div>
                              <span className="font-black text-slate-900">${(i.item.price * i.quantity).toFixed(2)}</span>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {cart.length > 0 && (
                    <div className="p-8 bg-slate-50 border-t border-white rounded-b-[3rem] space-y-6">
                      <div className="space-y-3">
                        <div className="flex justify-between text-slate-400 text-sm font-bold uppercase tracking-widest">
                          <span>Subtotal</span>
                          <span>${cartTotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-slate-900 font-black text-2xl">
                          <span>Total</span>
                          <span>${cartTotal.toFixed(2)}</span>
                        </div>
                      </div>
                      <button
                        onClick={handleCheckoutClick}
                        className="w-full relative group overflow-hidden bg-slate-900 text-white py-5 rounded-[2rem] font-black tracking-widest uppercase text-sm transition-all hover:scale-[1.02] active:scale-[0.98] shadow-2xl shadow-slate-200"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-orange-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <span className="relative z-10 flex items-center justify-center gap-3">
                          Checkout
                          <ChevronRight className="w-5 h-5" />
                        </span>
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex-1 overflow-y-auto p-8 no-scrollbar">
                  <button 
                    onClick={() => setCheckoutStep('CART')}
                    className="flex items-center gap-2 text-slate-400 hover:text-orange-500 transition-colors font-black text-xs uppercase tracking-widest mb-8"
                  >
                    <ArrowLeft className="w-4 h-4" /> Back to Cart
                  </button>

                  <form onSubmit={handlePlaceOrder} className="space-y-6">
                    <div className="space-y-2">
                       <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-2">Full Name</label>
                       <div className="relative">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                          <input 
                            type="text" 
                            required
                            placeholder="Your name"
                            className="w-full bg-slate-50 border-none rounded-2xl pl-12 pr-4 py-4 focus:ring-2 focus:ring-orange-500/20 outline-none font-bold text-slate-700"
                            value={addressData.name}
                            onChange={(e) => setAddressData({...addressData, name: e.target.value})}
                          />
                       </div>
                    </div>

                    <div className="space-y-2">
                       <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-2">Phone Number</label>
                       <div className="relative">
                          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                          <input 
                            type="tel" 
                            required
                            placeholder="Contact number"
                            className="w-full bg-slate-50 border-none rounded-2xl pl-12 pr-4 py-4 focus:ring-2 focus:ring-orange-500/20 outline-none font-bold text-slate-700"
                            value={addressData.phone}
                            onChange={(e) => setAddressData({...addressData, phone: e.target.value})}
                          />
                       </div>
                    </div>

                    <div className="space-y-2">
                       <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-2">Delivery Address</label>
                       <div className="relative">
                          <MapPin className="absolute left-4 top-5 w-5 h-5 text-slate-300" />
                          <textarea 
                            required
                            placeholder="Complete street address"
                            rows={4}
                            className="w-full bg-slate-50 border-none rounded-2xl pl-12 pr-4 py-4 focus:ring-2 focus:ring-orange-500/20 outline-none font-bold text-slate-700 resize-none"
                            value={addressData.deliveryAddress}
                            onChange={(e) => setAddressData({...addressData, deliveryAddress: e.target.value})}
                          />
                       </div>
                    </div>

                    <div className="pt-8 border-t border-slate-50">
                       <div className="flex justify-between items-center mb-6">
                          <span className="text-slate-400 font-black uppercase text-xs tracking-widest">Payable Total</span>
                          <span className="text-2xl font-black text-slate-900">${cartTotal.toFixed(2)}</span>
                       </div>
                       <button
                        type="submit"
                        disabled={isOrdering}
                        className="w-full bg-slate-900 text-white py-5 rounded-[2rem] font-black tracking-widest uppercase text-sm transition-all hover:bg-orange-500 shadow-2xl shadow-slate-200 disabled:opacity-50"
                      >
                        {isOrdering ? 'Preparing Order...' : 'Place Order'}
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Footer - Exactly like Home */}
      <footer className="bg-slate-900 text-white pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center mb-16">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-gradient-to-br from-orange-500 to-amber-500 p-3 rounded-xl shadow-lg shadow-orange-500/20">
                <ChefHat className="w-8 h-8 text-white" />
              </div>
              <span className="text-3xl font-bold tracking-tight">La Maison</span>
            </div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-px bg-gradient-to-r from-transparent to-orange-500"></div>
              <UtensilsCrossed className="w-4 h-4 text-orange-500" />
              <div className="w-12 h-px bg-gradient-to-l from-transparent to-orange-500"></div>
            </div>
            <p className="text-slate-400 max-w-md leading-relaxed">
              Experience the finest culinary delights in a warm and inviting
              atmosphere. Where every meal is a celebration of flavor and
              artistry.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-16 pb-16 border-b border-slate-800">
            <div>
              <h4 className="text-sm font-bold uppercase tracking-widest text-orange-500 mb-6">Navigate</h4>
              <ul className="space-y-4">
                {[{label: 'Home', id: 'home'}, {label: 'About Us', id: 'about'}, {label: 'Our Menu', id: 'menu'}, {label: 'Reservations', id: 'reservations'}, {label: 'Contact', id: 'contact'}].map((item) => (
                  <li key={item.id}>
                    <button onClick={() => scrollToSection(item.id)} className="text-slate-400 hover:text-orange-400 transition-colors flex items-center gap-2 group">
                      <ArrowRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-orange-500" />
                      <span>{item.label}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-bold uppercase tracking-widest text-orange-500 mb-6">Hours</h4>
              <ul className="space-y-4">
                <li className="flex justify-between text-slate-400"><span>Mon – Thu</span><span className="text-slate-300">11am – 10pm</span></li>
                <li className="flex justify-between text-slate-400"><span>Fri – Sat</span><span className="text-slate-300">11am – 11pm</span></li>
                <li className="flex justify-between text-slate-400"><span>Sunday</span><span className="text-slate-300">10am – 9pm</span></li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-bold uppercase tracking-widest text-orange-500 mb-6">Contact</h4>
              <ul className="space-y-4">
                <li className="flex items-start gap-3 text-slate-400">
                  <MapPin className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                  <span>123 Gourmet Avenue<br />Culinary District, NY 10012</span>
                </li>
                <li className="flex items-center gap-3 text-slate-400"><Phone className="w-5 h-5 text-orange-500 flex-shrink-0" /><span>(555) 123-4567</span></li>
                <li className="flex items-center gap-3 text-slate-400"><Calendar className="w-5 h-5 text-orange-500 flex-shrink-0" /><span>reservations@lamaison.com</span></li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-bold uppercase tracking-widest text-orange-500 mb-6">Newsletter</h4>
              <p className="text-slate-400 mb-6 text-sm leading-relaxed">Subscribe for exclusive offers, seasonal menus, and special invitations.</p>
              <div className="space-y-3">
                <input type="email" placeholder="Your email address" className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-orange-500 outline-none text-white placeholder-slate-500 transition-all" />
                <button className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-4 py-3 rounded-xl font-medium transition-all text-sm shadow-lg shadow-orange-500/20">Subscribe</button>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-12">
            <p className="text-slate-500 text-sm">Follow us on social media</p>
            <div className="flex gap-3">
              {[{icon: Instagram, label: 'Instagram', color: 'hover:bg-pink-500'}, {icon: Facebook, label: 'Facebook', color: 'hover:bg-blue-600'}, {icon: Twitter, label: 'Twitter', color: 'hover:bg-sky-500'}].map((social, i) => (
                <a key={i} href="#" className={`group flex items-center gap-2 px-4 py-2 bg-slate-800 rounded-full ${social.color} transition-all duration-300`}>
                  <social.icon className="w-4 h-4" />
                  <span className="text-sm font-medium hidden sm:inline">{social.label}</span>
                </a>
              ))}
            </div>
          </div>

          <div className="border-t border-slate-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-sm">
            <p>&copy; {new Date().getFullYear()} La Maison Restaurant. All rights reserved.</p>
            <div className="flex items-center gap-6">
              {['Privacy', 'Terms', 'Cookies'].map((item) => <a key={item} href="#" className="hover:text-orange-400 transition-colors">{item}</a>)}
              <button onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} className="ml-2 w-10 h-10 bg-slate-800 hover:bg-orange-500 rounded-full flex items-center justify-center transition-all group">
                <ArrowRight className="w-4 h-4 -rotate-90 group-hover:scale-110 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

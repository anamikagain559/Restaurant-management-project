import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { UtensilsCrossed, Search, Filter, Plus } from 'lucide-react';

import { MenuItem, Category } from '../../types/frontend';
import { useGetAllMenuQuery } from '../../redux/features/menu/menuApi';
import { addToCart, setCartOpen } from '../../redux/features/cart/cartSlice';

export function Menu() {
  const dispatch = useDispatch();
  const [activeCategory, setActiveCategory] = useState<Category>('All');
  const [searchTerm, setSearchTerm] = useState('');

  const { data: menuResponse, isLoading: isMenuLoading } = useGetAllMenuQuery(undefined);
  const menuItems: MenuItem[] = menuResponse?.data || [];

  const handleAddToCart = (item: MenuItem) => {
    dispatch(addToCart(item));
    dispatch(setCartOpen(true));
  };

  const filteredItems = menuItems.filter((item) => {
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="overflow-hidden bg-slate-50">
      {/* Hero Section - AI Premium */}
      <section className="relative pt-64 pb-32 overflow-hidden bg-slate-950">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://i.ibb.co.com/dsJ59VbS/slider-bg2.webp" 
            className="w-full h-full object-cover opacity-60" 
            alt="Hero Background" 
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-transparent to-slate-950 z-0"></div>
        <div className="absolute inset-0 bg-mesh opacity-20 z-0 mix-blend-overlay"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-4 px-6 py-2.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-2xl text-white/60 text-[10px] font-black uppercase tracking-[0.5em] mb-12 animate-shimmer overflow-hidden">
             <span className="flex items-center gap-2">
               <span className="w-1.5 h-1.5 rounded-full bg-kona-teal animate-pulse"></span>
               Biological Selection
             </span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-white mb-8 tracking-tighter uppercase leading-[0.85] text-glow">
            Discovery <br/> <span className="text-kona-teal italic font-light drop-shadow-lg">Prototypes</span>
          </h1>
          <p className="max-w-2xl mx-auto text-white/40 text-lg font-light leading-relaxed italic">
            Each entry represents a unique iteration of seasonal perfection, 
            optimized for biological satisfaction and sensory excellence.
          </p>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-slate-50 to-transparent z-10" />
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 -mt-10 relative z-20 pb-32">
        {/* Search and Filters */}
        <div className="bg-white p-6 rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100 flex flex-col lg:flex-row items-center gap-8 mb-20 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-kona-teal/50 to-transparent"></div>
          
          <div className="flex-1 w-full lg:w-auto relative">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-kona-teal transition-colors" />
            <input 
              type="text" 
              placeholder="Search Biological Selection..."
              className="w-full pl-14 pr-6 py-5 bg-slate-50 rounded-2xl border border-slate-100 focus:border-kona-teal/50 focus:ring-4 focus:ring-kona-teal/10 outline-none transition-all font-medium text-slate-800 placeholder:text-slate-400 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="w-full lg:w-auto overflow-x-auto no-scrollbar scroll-smooth">
            <div className="flex gap-4 p-1">
              {(['All', 'Appetizers', 'Main Course', 'Desserts', 'Beverages'] as const).map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`
                    px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] whitespace-nowrap transition-all duration-500
                    ${activeCategory === category 
                      ? 'bg-slate-950 text-white shadow-xl scale-105' 
                      : 'text-slate-500 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300'
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
                <div className="absolute inset-0 border-4 border-kona-teal/10 rounded-full" />
                <div className="absolute inset-0 border-4 border-kona-teal rounded-full border-t-transparent animate-spin" />
             </div>
             <p className="mt-8 text-kona-maroon font-black tracking-widest uppercase text-[10px] animate-pulse">Setting the table...</p>
          </div>
        ) : filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
            {filteredItems.map((item, idx) => (
              <div 
                key={item._id}
                className="group relative bg-white/40 backdrop-blur-xl rounded-[3rem] border border-white/40 shadow-[0_20px_40px_rgba(0,0,0,0.05)] hover:shadow-[0_30px_60px_rgba(0,0,0,0.1)] transition-all duration-700 overflow-hidden flex flex-col hover:-translate-y-2"
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                {/* Image Section */}
                <div className="h-64 relative p-4">
                  <div className="w-full h-full rounded-[2.5rem] overflow-hidden relative shadow-inner">
                    {item.image ? (
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 grayscale-[0.2] group-hover:grayscale-0"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&q=80';
                        }}
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full bg-slate-100">
                         <UtensilsCrossed className="w-12 h-12 text-slate-300" />
                      </div>
                    )}
                    
                    {/* Glass Badge */}
                    <div className="absolute top-4 left-4 z-10">
                      <span className="px-4 py-1.5 bg-white/80 backdrop-blur-md text-kona-maroon text-[8px] font-black tracking-[0.3em] uppercase rounded-full shadow-lg border border-white/50">
                        {item.category}
                      </span>
                    </div>

                    {!item.isAvailable && (
                      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-20">
                        <span className="px-8 py-3 bg-white text-slate-900 text-[10px] font-black uppercase tracking-[0.4em] rounded-full shadow-xl">
                          Depleted
                        </span>
                      </div>
                    )}

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-kona-maroon/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-8 pt-2 flex flex-col flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-black text-kona-maroon group-hover:text-kona-teal transition-colors tracking-tighter uppercase leading-tight line-clamp-1">
                      {item.name}
                    </h3>
                  </div>

                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-8 h-10 font-light italic opacity-80 group-hover:opacity-100 transition-opacity">
                    {item.description}
                  </p>
                  
                  <div className="mt-auto flex items-center justify-between pt-6 border-t border-slate-100/50">
                    <div className="flex flex-col">
                      <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Price Unit</span>
                      <span className="text-2xl font-black text-slate-900">
                        ${item.price.toFixed(2)}
                      </span>
                    </div>

                    <button
                      onClick={() => handleAddToCart(item)}
                      disabled={!item.isAvailable}
                      className="w-14 h-14 rounded-full bg-slate-900 flex items-center justify-center text-white hover:bg-kona-teal hover:scale-110 active:scale-95 transition-all shadow-xl disabled:opacity-50 disabled:cursor-not-allowed group/btn overflow-hidden relative"
                    >
                      <Plus className="w-5 h-5 relative z-10 group-hover/btn:rotate-90 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-r from-kona-teal to-kona-light opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500"></div>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-40">
             <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-8 border border-slate-200 shadow-sm">
                <Filter className="w-10 h-10 text-slate-400" />
             </div>
             <h3 className="text-2xl font-black text-slate-900 mb-2">No delicacies found</h3>
             <p className="text-slate-500 font-light italic">Try adjusting your search or filters to find what you're looking for.</p>
          </div>
        )}
      </main>
    </div>
  );
}
